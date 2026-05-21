import cv2
import numpy as np
import tempfile
import os
from typing import Optional, Dict, Any, Tuple
from app.schemas import FaceDetectionResult, FaceComparisonResult
from app.utils.image_preprocessor import decode_base64_image, preprocess_cnic_image, extract_photo_region


def _save_image_temp_jpg(image: np.ndarray) -> str:
    """Helper to write the numpy image to a temporary JPEG and returns the path."""
    if image is None or not isinstance(image, np.ndarray) or image.size == 0:
        raise ValueError("Empty image provided to DeepFace temp save")

    fd, path = tempfile.mkstemp(suffix=".jpg")
    os.close(fd)

    ok, buffer = cv2.imencode(".jpg", image)
    if not ok:
        raise ValueError("Failed to encode image as JPEG")

    with open(path, "wb") as f:
        f.write(buffer.tobytes())

    return path


def _get_deepface():
    """Lazy import DeepFace to avoid crashing the whole API startup."""
    try:
        from deepface import DeepFace  # type: ignore
        return DeepFace
    except Exception as e:
        raise RuntimeError(
            f"DeepFace is not available (missing dependencies). {e}"
        ) from e


class FaceService:
    """Service for face detection and comparison using DeepFace."""
    
    DETECTOR_BACKENDS = ['opencv', 'mtcnn', 'ssd', 'dlib', 'retinaface']
    RECOGNITION_MODELS = ['VGG-Face', 'Facenet', 'OpenFace', 'DeepFace', 'DeepID', 'ArcFace', 'Dlib']
    
    def __init__(self, detection_backend: str = 'opencv', 
                 recognition_model: str = 'VGG-Face'):
        self.detection_backend = detection_backend
        self.recognition_model = recognition_model
    
    def detect_face(self, image_data: str, is_selfie: bool = False) -> FaceDetectionResult:
        try:
            image = decode_base64_image(image_data)
            if not is_selfie:
                image = preprocess_cnic_image(image)
            
            # Use OpenCV for fast detection
            face_result = self._opencv_face_detection(image)
            if face_result.face_detected:
                return face_result
            
            return FaceDetectionResult(face_detected=False, face_count=0, confidence=0.0)
            
        except Exception as e:
            print(f"Face detection error: {e}")
            return FaceDetectionResult(face_detected=False, face_count=0, confidence=0.0, details={"error": str(e)})

    def _opencv_face_detection(self, image: np.ndarray) -> FaceDetectionResult:
        """Fallback face detection using OpenCV Haar Cascades."""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        
        if len(faces) > 0:
            largest_face = max(faces, key=lambda f: f[2] * f[3])
            x, y, w, h = largest_face
            face_region = image[y:y+h, x:x+w]
            face_base64 = self._encode_face_image(face_region)
            
            return FaceDetectionResult(
                face_detected=True,
                face_count=len(faces),
                face_location={'x': int(x), 'y': int(y), 'w': int(w), 'h': int(h)},
                confidence=0.8,
                face_image_base64=face_base64
            )
        return FaceDetectionResult(face_detected=False, face_count=0, confidence=0.0)

    def compare_faces(self, cnic_image_data: str, selfie_image_data: str) -> FaceComparisonResult:
        """
        ACTUAL COMPARISON LOGIC: Matches CNIC face with Selfie.
        """
        temp_paths = []
        try:
            # 1. Lazy load DeepFace
            DeepFace = _get_deepface()

            # 2. Decode and Preprocess
            cnic_img = decode_base64_image(cnic_image_data)
            selfie_img = decode_base64_image(selfie_image_data)
            cnic_img = preprocess_cnic_image(cnic_img)

            # 3. Save to temp files for DeepFace to read
            path1 = _save_image_temp_jpg(cnic_img)
            path2 = _save_image_temp_jpg(selfie_img)
            temp_paths.extend([path1, path2])

            # 4. Perform Verification
            # Threshold hum 0.4 rakh rahe hain (VGG-Face standard)
            result = DeepFace.verify(
                img1_path=path1, 
                img2_path=path2, 
                model_name=self.recognition_model,
                detector_backend=self.detection_backend,
                enforce_detection=False
            )

            is_match = result['verified']
            distance = result['distance']
            # Similarity score calculate karna (0 to 100 range mein)
            similarity = max(0, 1 - distance) * 100

            return FaceComparisonResult(
                is_match=bool(is_match),
                similarity_score=float(similarity),
                confidence=float(max(0, 1 - distance)),
                threshold_used=result['threshold'],
                details={
                    "model": result['model'],
                    "distance": distance,
                    "detector": result['detector_backend']
                }
            )

        except Exception as e:
            print(f"Face comparison error: {e}")
            return FaceComparisonResult(
                is_match=False, similarity_score=0.0, confidence=0.0, threshold_used=0.6,
                details={"error": str(e)}
            )
        finally:
            # Clean up temp files
            for p in temp_paths:
                if os.path.exists(p):
                    os.remove(p)

    def _encode_face_image(self, face_image: np.ndarray) -> str:
        if face_image is None or face_image.size == 0:
            return ""
        if len(face_image.shape) == 2:
            face_image = cv2.cvtColor(face_image, cv2.COLOR_GRAY2BGR)
        _, buffer = cv2.imencode('.jpg', face_image)
        return buffer.tobytes()

    def get_face_landmarks(self, image_data: str) -> Dict[str, Any]:
        """Kept simple as per instructions."""
        try:
            DeepFace = _get_deepface()
            image = decode_base64_image(image_data)
            result = DeepFace.analyze(img_path=image, actions=['emotion'], enforce_detection=False)
            return {"success": True, "analysis": result}
        except Exception as e:
            return {"success": False, "error": str(e)}
