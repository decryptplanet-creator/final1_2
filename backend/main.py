import os
import sys
import asyncio
import io

# Fix Windows charmap encoding — wrap stdout/stderr with utf-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import uvicorn
from contextlib import asynccontextmanager
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Path setup for internal imports
sys.path.insert(0, os.path.dirname(__file__))

from app.config import settings
from app.schemas import VerificationRequest, VerificationResponse
from app.services.ocr_service import OCRService
from app.services.layout_verifier import LayoutVerifier
from app.services.chip_detector import ChipDetector
from app.services.tampering_detector import TamperingDetector
from app.services.face_service import FaceService
from app.services.scoring_engine import ScoringEngine
from app.utils.firebase_config import firebase_service
from app.utils.image_preprocessor import decode_base64_image

@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"AI Services & Firebase Started (Available: {firebase_service.is_available()})")
    yield

app = FastAPI(
    title="CNIC Forensic Verification API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Services Initialize
ocr_service = OCRService()
layout_verifier = LayoutVerifier()
chip_detector = ChipDetector()
tampering_detector = TamperingDetector()
face_service = FaceService()
scoring_engine = ScoringEngine()

@app.get("/health")
async def health():
    return {"status": "healthy", "firebase": firebase_service.is_available()}

# --- MAIN VERIFICATION ENDPOINT (Updated to JSON) ---
@app.post("/api/verify", response_model=VerificationResponse)
async def verify_cnic(request: VerificationRequest):
    """
    Complete CNIC verification flow using JSON input.
    """
    try:
        # 1. Base64 images nikalein
        cnic_front = request.cnic_front
        cnic_back = request.cnic_back
        selfie = request.selfie
        
        # 2. Parallel Processing (Fast performance)
        ocr_result, layout_result, chip_result, tampering_result, face_result = await asyncio.gather(
            asyncio.to_thread(ocr_service.extract_text_from_image, cnic_front),
            asyncio.to_thread(layout_verifier.verify_layout, cnic_front),
            asyncio.to_thread(chip_detector.detect_chip, cnic_front),
            asyncio.to_thread(tampering_detector.detect_tampering, cnic_front),
            asyncio.to_thread(face_service.compare_faces, cnic_front, selfie)
        )
        
        # 3. Final Score & Decision
        verification_result = scoring_engine.calculate_final_result(
            ocr_result=ocr_result,
            layout_result=layout_result,
            chip_result=chip_result,
            tampering_result=tampering_result,
            face_comparison_result=face_result,
            user_input=request
        )

        import json
        try:
            print("Verification score breakdown:", json.dumps({
                "final_decision": verification_result.final_decision,
                "final_score": verification_result.final_score,
                "text_match": verification_result.text_match_score.model_dump(),
                "face_match": verification_result.face_match_score.model_dump(),
                "layout": verification_result.layout_score.model_dump(),
                "chip": verification_result.chip_score.model_dump(),
                "tampering": verification_result.tampering_score.model_dump(),
                "ocr_confidence": verification_result.ocr_confidence_score.model_dump(),
                "ocr_result": ocr_result.model_dump(),
                "face_result": face_result.model_dump(),
            }, ensure_ascii=True, default=str))
        except Exception:
            print("Verification score breakdown: (print skipped due to encoding)")
        
        detailed_report = scoring_engine.get_detailed_report(verification_result)
        
        # 4. Firebase Storage & Firestore Logic
        if firebase_service.is_available():
            user_id = request.user_id or "temp_user"
            # Only upload non-None images
            front_url, selfie_url = await asyncio.gather(
                firebase_service.upload_image(cnic_front, user_id, "cnic_front"),
                firebase_service.upload_image(selfie, user_id, "selfie"),
            )
            image_urls = {"cnic_front": front_url, "selfie": selfie_url}
            if cnic_back:
                image_urls["cnic_back"] = await firebase_service.upload_image(cnic_back, user_id, "cnic_back")
            detailed_report["image_urls"] = image_urls
            
            # Firestore mein save karein
            await firebase_service.save_verification_result(detailed_report, user_id)
        
        return VerificationResponse(
            success=True,

            
            message=f"Verification Decision: {verification_result.final_decision}",
            result=verification_result
        )
        
    except Exception as e:
        print(f"Verification Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class FaceVerifyRequest(BaseModel):
    cnic_front: str
    selfie: str


@app.post("/api/face-verify")
async def face_verify(request: FaceVerifyRequest):
    """
    Simple face-only verification endpoint.
    Returns: { success, verified, similarity, distance, message }
    """
    try:
        result = await asyncio.to_thread(
            face_service.compare_faces, request.cnic_front, request.selfie
        )

        distance = result.details.get("distance", 1.0 - result.confidence)
        message = result.details.get("message", "Face matched" if result.is_match else "Face not matched")

        return {
            "success": True,
            "verified": result.is_match,
            "similarity": result.similarity_score,
            "distance": distance,
            "message": message,
        }
    except Exception as e:
        print(f"[face-verify] Error: {e}")
        return {
            "success": False,
            "verified": False,
            "similarity": 0.0,
            "distance": 1.0,
            "message": str(e),
        }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
