import cv2
import numpy as np
import os
from app.schemas import FaceDetectionResult, FaceComparisonResult
from app.utils.image_preprocessor import decode_base64_image

# Debug images will be saved here (relative to where uvicorn is run from)
DEBUG_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "debug_images")


def _ensure_debug_dir():
    os.makedirs(DEBUG_DIR, exist_ok=True)


def _save_debug_image(image: np.ndarray, filename: str):
    """Save a numpy image to DEBUG_DIR for inspection."""
    try:
        _ensure_debug_dir()
        path = os.path.join(DEBUG_DIR, filename)
        cv2.imwrite(path, image)
        print(f"[FaceService] Debug image saved: {path}")
    except Exception as e:
        print(f"[FaceService] Could not save debug image {filename}: {e}")


def _get_deepface():
    try:
        from deepface import DeepFace
        return DeepFace
    except Exception as e:
        raise RuntimeError(f"DeepFace not available: {e}") from e


class FaceService:

    def __init__(self):
        pass

    def detect_face(self, image_data: str, is_selfie: bool = False) -> FaceDetectionResult:
        """Kept for backwards compatibility — uses RetinaFace internally."""
        try:
            DeepFace = _get_deepface()
            image = decode_base64_image(image_data)
            faces = DeepFace.extract_faces(
                img_path=image,
                detector_backend="retinaface",
                enforce_detection=False,
            )
            detected = any(f.get("confidence", 0) > 0.5 for f in faces)
            return FaceDetectionResult(
                face_detected=detected,
                face_count=len(faces),
                confidence=faces[0].get("confidence", 0.0) if faces else 0.0,
            )
        except Exception as e:
            print(f"[FaceService] detect_face error: {e}")
            return FaceDetectionResult(face_detected=False, face_count=0, confidence=0.0,
                                       details={"error": str(e)})

    def compare_faces(self, cnic_image_data: str, selfie_image_data: str) -> FaceComparisonResult:
        """
        Compare CNIC face vs selfie using RetinaFace (detection) + ArcFace (recognition).
        RetinaFace detects the face from the FULL image — no manual cropping needed.
        """
        print("[FaceService] compare_faces called")

        # ── Step 1: Decode images ──────────────────────────────────────────────
        if not cnic_image_data:
            print("[FaceService] ERROR: cnic_image_data is empty/None")
            return self._fail("CNIC image not received")

        if not selfie_image_data:
            print("[FaceService] ERROR: selfie_image_data is empty/None")
            return self._fail("Selfie image not received")

        try:
            cnic_img = decode_base64_image(cnic_image_data)
            print(f"[FaceService] CNIC image decoded: shape={cnic_img.shape}")
            _save_debug_image(cnic_img, "debug_cnic_input.jpg")
        except Exception as e:
            print(f"[FaceService] Failed to decode CNIC image: {e}")
            return self._fail(f"Invalid CNIC image: {e}")

        try:
            selfie_img = decode_base64_image(selfie_image_data)
            print(f"[FaceService] Selfie image decoded: shape={selfie_img.shape}")
            _save_debug_image(selfie_img, "debug_selfie_input.jpg")
        except Exception as e:
            print(f"[FaceService] Failed to decode selfie image: {e}")
            return self._fail(f"Invalid selfie image: {e}")

        # ── Step 2: Check RetinaFace can detect faces ──────────────────────────
        DeepFace = _get_deepface()

        print("[FaceService] Checking CNIC face detection with RetinaFace...")
        try:
            cnic_faces = DeepFace.extract_faces(
                img_path=cnic_img,
                detector_backend="retinaface",
                enforce_detection=False,
            )
            cnic_detected = any(f.get("confidence", 0) > 0.5 for f in cnic_faces)
            print(f"[FaceService] CNIC face detected: {cnic_detected} ({len(cnic_faces)} face(s) found)")
        except Exception as e:
            print(f"[FaceService] CNIC face detection error: {e}")
            cnic_detected = False

        print("[FaceService] Checking selfie face detection with RetinaFace...")
        try:
            selfie_faces = DeepFace.extract_faces(
                img_path=selfie_img,
                detector_backend="retinaface",
                enforce_detection=False,
            )
            selfie_detected = any(f.get("confidence", 0) > 0.5 for f in selfie_faces)
            print(f"[FaceService] Selfie face detected: {selfie_detected} ({len(selfie_faces)} face(s) found)")
        except Exception as e:
            print(f"[FaceService] Selfie face detection error: {e}")
            selfie_detected = False

        if not cnic_detected:
            print("[FaceService] No face found in CNIC image")
            return self._fail("Face not detected in CNIC image", cnic_detected, selfie_detected)

        if not selfie_detected:
            print("[FaceService] No face found in selfie image")
            return self._fail("Face not detected in selfie image", cnic_detected, selfie_detected)

        # ── Step 3: ArcFace comparison — RetinaFace handles detection internally ──
        print("[FaceService] Running DeepFace.verify (ArcFace + RetinaFace)...")
        try:
            result = DeepFace.verify(
                img1_path=cnic_img,
                img2_path=selfie_img,
                model_name="ArcFace",
                detector_backend="retinaface",
                enforce_detection=False,
                distance_metric="cosine",
            )

            distance = float(result.get("distance", 1.0))
            threshold = float(result.get("threshold", 0.68))
            is_match = bool(result.get("verified", False))

            print(f"[FaceService] distance={distance:.4f} | threshold={threshold:.4f} | verified={is_match}")

            # ── FIXED: Similarity score — direct formula, not relative to threshold ──
            # Old (wrong): (1.0 - distance / threshold) * 100  → gave 3.22 even on match
            # New (correct): (1.0 - distance) * 100            → gives proper 0-100 score
            similarity = round(max(0.0, (1.0 - distance) * 100), 2)

            return FaceComparisonResult(
                is_match=is_match,
                similarity_score=similarity,
                confidence=round(1.0 - distance, 4),
                threshold_used=threshold,
                details={
                    "model": "ArcFace",
                    "detector": "retinaface",
                    "distance": round(distance, 4),
                    "threshold": round(threshold, 4),
                    "cnic_face_detected": cnic_detected,
                    "selfie_face_detected": selfie_detected,
                    "message": "Face matched" if is_match else "Face not matched",
                },
            )

        except Exception as e:
            print(f"[FaceService] DeepFace.verify error: {e}")
            import traceback; traceback.print_exc()
            return self._fail(f"Comparison error: {e}", cnic_detected, selfie_detected)

    @staticmethod
    def _fail(reason: str, cnic_detected: bool = False, selfie_detected: bool = False) -> FaceComparisonResult:
        return FaceComparisonResult(
            is_match=False,
            similarity_score=0.0,
            confidence=0.0,
            threshold_used=0.68,
            details={
                "error": reason,
                "cnic_face_detected": cnic_detected,
                "selfie_face_detected": selfie_detected,
                "message": "Face not detected" if "not detected" in reason else reason,
            },
        )

    # ── Kept for backwards compatibility ──────────────────────────────────────
    def get_face_landmarks(self, image_data: str):
        try:
            DeepFace = _get_deepface()
            image = decode_base64_image(image_data)
            result = DeepFace.analyze(img_path=image, actions=["emotion"], enforce_detection=False)
            return {"success": True, "analysis": result}
        except Exception as e:
            return {"success": False, "error": str(e)}