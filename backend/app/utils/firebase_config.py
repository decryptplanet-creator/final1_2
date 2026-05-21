import firebase_admin
from firebase_admin import credentials, storage, firestore
from typing import Optional, Dict, Any
from datetime import datetime
import base64
from io import BytesIO
import uuid

from app.config import settings


class FirebaseService:
    """Service for Firebase integration (Storage and Firestore)."""
    
    _instance = None
    _initialized = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not self._initialized:
            self._initialize_firebase()
            self._initialized = True
    
    def _initialize_firebase(self):
        """Initialize Firebase Admin SDK."""
        # Ensure attributes always exist (startup calls is_available()).
        self.db = None
        self.bucket = None

        try:
            if not firebase_admin._apps:
                # Try to initialize with credentials file
                if settings.firebase_credentials:
                    cred = credentials.Certificate(settings.firebase_credentials)
                    firebase_admin.initialize_app(
                        cred,
                        {
                            'storageBucket': settings.firebase_storage_bucket
                        }
                    )

                    self.db = firestore.client()
                    self.bucket = storage.bucket()
                    print("Firebase initialized successfully")
                else:
                    print("Warning: Firebase credentials not configured")
                    return

        except Exception as e:
            print(f"Firebase initialization error: {e}")
            self.db = None
            self.bucket = None
    
    def is_available(self) -> bool:
        """Check if Firebase is properly initialized."""
        return self.db is not None and self.bucket is not None
    
    async def upload_image(self, image_data: str, user_id: str, 
                          image_type: str) -> Dict[str, Any]:
        """
        Upload image to Firebase Storage.
        
        Args:
            image_data: Base64 encoded image
            user_id: User identifier
            image_type: Type of image (cnic_front, cnic_back, selfie)
            
        Returns:
            Dictionary with upload result
        """
        if not self.is_available():
            return {
                "success": False,
                "error": "Firebase not available"
            }
        
        try:
            # Decode base64 image
            if "base64," in image_data:
                image_data = image_data.split("base64,")[1]
            
            image_bytes = base64.b64decode(image_data)
            
            # Generate unique filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            file_id = str(uuid.uuid4())[:8]
            extension = "jpg"
            filename = f"verifications/{user_id}/{timestamp}_{image_type}_{file_id}.{extension}"
            
            # Upload to Firebase Storage
            blob = self.bucket.blob(filename)
            blob.upload_from_string(image_bytes, content_type=f"image/{extension}")
            
            # Make file publicly accessible (or use signed URLs)
            blob.make_public()
            
            return {
                "success": True,
                "file_path": filename,
                "download_url": blob.public_url,
                "metadata": {
                    "user_id": user_id,
                    "image_type": image_type,
                    "uploaded_at": timestamp,
                    "size_bytes": len(image_bytes)
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def save_verification_result(self, result: Dict[str, Any], 
                                       user_id: str) -> Dict[str, Any]:
        """
        Save verification result to Firestore.
        
        Args:
            result: Verification result dictionary
            user_id: User identifier
            
        Returns:
            Dictionary with save result
        """
        if not self.is_available():
            return {
                "success": False,
                "error": "Firebase not available"
            }
        
        try:
            # Create document reference
            doc_ref = self.db.collection('verifications').document()
            
            # Prepare document data
            doc_data = {
                "verification_id": result.get("verification_id", str(uuid.uuid4())),
                "user_id": user_id,
                "timestamp": datetime.now().isoformat(),
                "final_decision": result.get("final_decision"),
                "final_score": result.get("final_score"),
                "scores": result.get("score_breakdown", {}),
                "ocr_result": result.get("ocr_result", {}),
                "face_comparison": result.get("face_comparison_result", {}),
                "tampering_detection": result.get("tampering_result", {}),
                "chip_detection": result.get("chip_result", {}),
                "layout_verification": result.get("layout_result", {}),
                "user_input": result.get("user_input", {}),
                "recommendations": result.get("recommendations", []),
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            }
            
            # Save to Firestore
            doc_ref.set(doc_data)
            
            # Also add to user's verification history
            user_ref = self.db.collection('users').document(user_id)
            user_ref.set({
                "last_verification": doc_data,
                "verification_count": firestore.Increment(1),
                "last_updated": datetime.now()
            }, merge=True)
            
            return {
                "success": True,
                "document_id": doc_ref.id,
                "verification_id": doc_data["verification_id"]
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_verification_history(self, user_id: str, 
                                       limit: int = 10) -> Dict[str, Any]:
        """
        Get verification history for a user.
        
        Args:
            user_id: User identifier
            limit: Maximum number of records to return
            
        Returns:
            Dictionary with verification history
        """
        if not self.is_available():
            return {
                "success": False,
                "error": "Firebase not available"
            }
        
        try:
            # Query verifications for user
            verifications_ref = self.db.collection('verifications')
            query = verifications_ref.where('user_id', '==', user_id)\
                                    .order_by('timestamp', direction=firestore.Query.DESCENDING)\
                                    .limit(limit)
            
            docs = query.stream()
            verifications = []
            
            for doc in docs:
                verifications.append({
                    "id": doc.id,
                    **doc.to_dict()
                })
            
            return {
                "success": True,
                "verifications": verifications,
                "count": len(verifications)
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_verification_by_id(self, verification_id: str) -> Dict[str, Any]:
        """
        Get specific verification result by ID.
        
        Args:
            verification_id: Verification ID
            
        Returns:
            Dictionary with verification details
        """
        if not self.is_available():
            return {
                "success": False,
                "error": "Firebase not available"
            }
        
        try:
            verifications_ref = self.db.collection('verifications')
            query = verifications_ref.where('verification_id', '==', verification_id).limit(1)
            
            docs = query.stream()
            
            for doc in docs:
                return {
                    "success": True,
                    "id": doc.id,
                    **doc.to_dict()
                }
            
            return {
                "success": False,
                "error": "Verification not found"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def update_verification_status(self, verification_id: str, 
                                         status: str, notes: str = "") -> Dict[str, Any]:
        """
        Update verification status (for manual review).
        
        Args:
            verification_id: Verification ID
            status: New status
            notes: Review notes
            
        Returns:
            Dictionary with update result
        """
        if not self.is_available():
            return {
                "success": False,
                "error": "Firebase not available"
            }
        
        try:
            verifications_ref = self.db.collection('verifications')
            query = verifications_ref.where('verification_id', '==', verification_id).limit(1)
            
            docs = query.stream()
            
            for doc in docs:
                doc.reference.update({
                    "review_status": status,
                    "review_notes": notes,
                    "reviewed_at": datetime.now(),
                    "updated_at": datetime.now()
                })
                
                return {
                    "success": True,
                    "document_id": doc.id,
                    "message": "Verification updated successfully"
                }
            
            return {
                "success": False,
                "error": "Verification not found"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_statistics(self, start_date: datetime = None, 
                            end_date: datetime = None) -> Dict[str, Any]:
        """
        Get verification statistics.
        
        Args:
            start_date: Start date for statistics
            end_date: End date for statistics
            
        Returns:
            Dictionary with statistics
        """
        if not self.is_available():
            return {
                "success": False,
                "error": "Firebase not available"
            }
        
        try:
            verifications_ref = self.db.collection('verifications')
            
            # Build query
            query = verifications_ref
            
            if start_date:
                query = query.where('timestamp', '>=', start_date.isoformat())
            if end_date:
                query = query.where('timestamp', '<=', end_date.isoformat())
            
            docs = query.stream()
            
            total = 0
            genuine = 0
            suspicious = 0
            fake = 0
            scores = []
            
            for doc in docs:
                data = doc.to_dict()
                total += 1
                
                decision = data.get('final_decision', '')
                if decision == 'GENUINE':
                    genuine += 1
                elif decision == 'SUSPICIOUS':
                    suspicious += 1
                elif decision == 'FAKE':
                    fake += 1
                
                score = data.get('final_score', 0)
                scores.append(score)
            
            avg_score = sum(scores) / len(scores) if scores else 0
            
            return {
                "success": True,
                "statistics": {
                    "total_verifications": total,
                    "genuine_count": genuine,
                    "suspicious_count": suspicious,
                    "fake_count": fake,
                    "genuine_percentage": (genuine / total * 100) if total > 0 else 0,
                    "suspicious_percentage": (suspicious / total * 100) if total > 0 else 0,
                    "fake_percentage": (fake / total * 100) if total > 0 else 0,
                    "average_score": round(avg_score, 2)
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }


# Singleton instance
firebase_service = FirebaseService()
