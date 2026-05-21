from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime


class OCRResult(BaseModel):
    """OCR extraction result from CNIC image."""
    name: Optional[str] = None
    cnic_number: Optional[str] = None
    dob: Optional[str] = None
    expiry_date: Optional[str] = None
    confidence: float = 0.0
    raw_text: str = ""


class LayoutVerificationResult(BaseModel):
    """Layout verification result for CNIC."""
    is_valid: bool = False
    score: float = 0.0
    photo_position_valid: bool = False
    text_alignment_valid: bool = False
    logo_detected: bool = False
    structure_valid: bool = False
    details: Dict[str, Any] = Field(default_factory=dict)


class ChipDetectionResult(BaseModel):
    """Chip detection result for CNIC."""
    chip_present: bool = False
    score: float = 0.0
    position_valid: bool = False
    confidence: float = 0.0
    details: Dict[str, Any] = Field(default_factory=dict)


class TamperingDetectionResult(BaseModel):
    """Tampering detection result."""
    is_tampered: bool = False
    score: float = 0.0  # 0 = tampered, 100 = genuine
    ela_score: float = 0.0
    noise_consistency_score: float = 0.0
    blur_score: float = 0.0
    copy_move_score: float = 0.0
    details: Dict[str, Any] = Field(default_factory=dict)


class FaceDetectionResult(BaseModel):
    """Face detection result."""
    face_detected: bool = False
    face_count: int = 0
    face_location: Optional[Dict[str, int]] = None
    confidence: float = 0.0
    face_image_base64: Optional[str] = None


class FaceComparisonResult(BaseModel):
    """Face comparison result between CNIC and selfie."""
    is_match: bool = False
    similarity_score: float = 0.0  # 0-100
    confidence: float = 0.0
    threshold_used: float = 0.6
    details: Dict[str, Any] = Field(default_factory=dict)


class TextMatchResult(BaseModel):
    """Text matching result between OCR and user input."""
    match_score: float = 0.0  # 0-100
    name_match: bool = False
    cnic_match: bool = False
    dob_match: bool = False
    expiry_match: bool = False
    details: Dict[str, Any] = Field(default_factory=dict)


class VerificationScore(BaseModel):
    """Individual verification score."""
    name: str
    score: float
    weight: float
    weighted_score: float
    status: str  # "pass", "warning", "fail"


class VerificationResult(BaseModel):
    """Complete verification result."""
    verification_id: str
    timestamp: datetime
    final_score: float
    final_decision: str  # "GENUINE", "SUSPICIOUS", "FAKE"
    
    # Individual scores
    text_match_score: VerificationScore
    face_match_score: VerificationScore
    layout_score: VerificationScore
    chip_score: VerificationScore
    tampering_score: VerificationScore
    ocr_confidence_score: VerificationScore
    
    # Detailed results
    ocr_result: Optional[OCRResult] = None
    layout_result: Optional[LayoutVerificationResult] = None
    chip_result: Optional[ChipDetectionResult] = None
    tampering_result: Optional[TamperingDetectionResult] = None
    face_comparison_result: Optional[FaceComparisonResult] = None
    text_match_result: Optional[TextMatchResult] = None
    
    # User input for reference
    user_input: Optional[Dict[str, Any]] = None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class VerificationRequest(BaseModel):
    """Request model for verification."""
    user_name: str = Field(..., min_length=1)
    user_cnic: str = Field(..., min_length=13, max_length=15)
    user_dob: str = Field(...)
    user_expiry: Optional[str] = None
    cnic_front: str = Field(..., min_length=1)
    cnic_back: str = Field(..., min_length=1)
    selfie: str = Field(..., min_length=1)
    user_id: Optional[str] = None


class VerificationResponse(BaseModel):
    """Response model for verification API."""
    success: bool
    message: str
    result: Optional[VerificationResult] = None
    errors: Optional[List[str]] = None


class FirebaseStorageResult(BaseModel):
    """Firebase storage result."""
    success: bool
    file_path: str
    download_url: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
