import cv2
import numpy as np
from typing import Dict, Any, Tuple
from app.schemas import LayoutVerificationResult
from app.utils.image_preprocessor import decode_base64_image, preprocess_cnic_image


class LayoutVerifier:
    """Service for verifying CNIC layout and structure."""
    
    # Standard CNIC dimensions (approximate ratios)
    CNIC_WIDTH_RATIO = 1.587  # Standard ID-1 card ratio (85.6mm x 53.98mm)
    
    # Expected positions (as ratios of image dimensions)
    PHOTO_X_RATIO = 0.05
    PHOTO_Y_RATIO = 0.15
    PHOTO_WIDTH_RATIO = 0.25
    PHOTO_HEIGHT_RATIO = 0.55
    
    TEXT_START_X_RATIO = 0.35
    TEXT_LINE_HEIGHT_RATIO = 0.08
    
    def __init__(self):
        """Initialize layout verifier."""
        pass
    
    def verify_layout(self, image_data: str) -> LayoutVerificationResult:
        """
        Verify the layout and structure of a CNIC image.
        
        Args:
            image_data: Base64 encoded CNIC image
            
        Returns:
            LayoutVerificationResult with verification details
        """
        try:
            # Decode and preprocess image
            image = decode_base64_image(image_data)
            image = preprocess_cnic_image(image)
            
            height, width = image.shape[:2]
            
            # Perform various layout checks
            structure_valid = self._check_card_structure(image)
            photo_valid, photo_position = self._check_photo_position(image)
            text_alignment_valid = self._check_text_alignment(image)
            logo_detected = self._detect_logo(image)

            # Calculate overall layout score
            score = self._calculate_layout_score(
                structure_valid, photo_valid, text_alignment_valid, logo_detected
            )

            # Cast numpy.bool_ -> native bool for Pydantic serialization
            structure_valid_bool = bool(structure_valid)
            photo_valid_bool = bool(photo_valid)
            text_alignment_valid_bool = bool(text_alignment_valid)
            logo_detected_bool = bool(logo_detected)
            is_valid_bool = bool(score >= 60)

            return LayoutVerificationResult(
                is_valid=is_valid_bool,
                score=float(score),
                photo_position_valid=photo_valid_bool,
                text_alignment_valid=text_alignment_valid_bool,
                logo_detected=logo_detected_bool,
                structure_valid=structure_valid_bool,
                details={
                    "image_width": width,
                    "image_height": height,
                    "aspect_ratio": width / height if height > 0 else 0,
                    "expected_aspect_ratio": self.CNIC_WIDTH_RATIO,
                    "photo_position": photo_position,
                    "structure_details": {
                        "card_detected": structure_valid_bool,
                        "corners_detected": self._count_corners(image),
                        "edge_quality": self._check_edge_quality(image)
                    }
                }
            )
            
        except Exception as e:
            print(f"Layout verification error: {e}")
            return LayoutVerificationResult(
                is_valid=False,
                score=0.0,
                details={"error": str(e)}
            )
    
    def _check_card_structure(self, image: np.ndarray) -> bool:
        """Check if the image has proper card structure."""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Check aspect ratio
        height, width = gray.shape
        aspect_ratio = width / height
        
        # CNIC should have aspect ratio close to standard
        aspect_ratio_valid = 1.4 < aspect_ratio < 1.8
        
        # Check for rectangular structure using edge detection
        edges = cv2.Canny(gray, 50, 150)
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        has_rectangular_contour = False
        for contour in contours:
            if cv2.contourArea(contour) > (width * height * 0.1):  # Reduced from 30% to 10%
                epsilon = 0.04 * cv2.arcLength(contour, True)  # More tolerance
                approx = cv2.approxPolyDP(contour, epsilon, True)
                if 4 <= len(approx) <= 6:  # Allow 4-6 vertices (not strictly 4)
                    has_rectangular_contour = True
                    break
        
        return aspect_ratio_valid and has_rectangular_contour
    
    def _check_photo_position(self, image: np.ndarray) -> Tuple[bool, Dict[str, Any]]:
        """Check if photo is in the expected position."""
        height, width = image.shape[:2]
        
        # Define expected photo region
        photo_x = int(width * self.PHOTO_X_RATIO)
        photo_y = int(height * self.PHOTO_Y_RATIO)
        photo_w = int(width * self.PHOTO_WIDTH_RATIO)
        photo_h = int(height * self.PHOTO_HEIGHT_RATIO)
        
        # Extract photo region
        photo_region = image[photo_y:photo_y+photo_h, photo_x:photo_x+photo_w]
        
        # Analyze photo region for face-like content
        gray_region = cv2.cvtColor(photo_region, cv2.COLOR_BGR2GRAY)
        
        # Check if region has sufficient variation (not blank)
        std_dev = np.std(gray_region)
        mean_intensity = np.mean(gray_region)
        
        # A valid photo region should have:
        # - Sufficient contrast (std_dev > 20)
        # - Not too dark or too bright
        has_content = std_dev > 20 and 50 < mean_intensity < 200
        
        # Try to detect face-like features using Haar cascades
        face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )
        
        faces = face_cascade.detectMultiScale(
            gray_region,
            scaleFactor=1.1,
            minNeighbors=3,
            minSize=(30, 30)
        )
        
        face_detected = len(faces) > 0
        
        position_info = {
            "expected_x": photo_x,
            "expected_y": photo_y,
            "expected_width": photo_w,
            "expected_height": photo_h,
            "has_content": has_content,
            "face_detected": face_detected,
            "std_deviation": float(std_dev),
            "mean_intensity": float(mean_intensity),
            "face_count": len(faces)
        }
        
        return has_content, position_info
    
    def _check_text_alignment(self, image: np.ndarray) -> bool:
        """Check if text is properly aligned."""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Focus on the right side of the card where text should be
        height, width = gray.shape
        text_region_x = int(width * self.TEXT_START_X_RATIO)
        text_region = gray[:, text_region_x:]
        
        # Use edge detection to find horizontal lines (text baselines)
        edges = cv2.Canny(text_region, 50, 150)
        
        # Use Hough Line Transform to detect horizontal lines
        lines = cv2.HoughLinesP(
            edges,
            rho=1,
            theta=np.pi/180,
            threshold=30,
            minLineLength=30,
            maxLineGap=10
        )
        
        if lines is None:
            return False
        
        # Count horizontal lines (within 10 degrees of horizontal)
        horizontal_lines = 0
        for line in lines:
            x1, y1, x2, y2 = line[0]
            angle = abs(np.arctan2(y2 - y1, x2 - x1) * 180 / np.pi)
            if angle < 10 or angle > 170:
                horizontal_lines += 1
        
        # Should have multiple horizontal text lines
        return horizontal_lines >= 3
    
    def _detect_logo(self, image: np.ndarray) -> bool:
        """Detect presence of official logo/emblem."""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        height, width = gray.shape
        
        # Logo is typically at the top center of CNIC
        logo_region = image[0:int(height*0.15), int(width*0.3):int(width*0.7)]
        
        if logo_region.size == 0:
            return False
        
        # Check for circular or emblem-like shapes
        logo_gray = cv2.cvtColor(logo_region, cv2.COLOR_BGR2GRAY)
        
        # Use Canny edge detection
        edges = cv2.Canny(logo_gray, 50, 150)
        
        # Detect circles using Hough Circle Transform
        circles = cv2.HoughCircles(
            logo_gray,
            cv2.HOUGH_GRADIENT,
            dp=1,
            minDist=20,
            param1=50,
            param2=30,
            minRadius=10,
            maxRadius=50
        )
        
        if circles is not None:
            return True
        
        # Alternative: check for complex patterns in logo region
        # Logo region should have higher edge density than surrounding areas
        edge_density = np.sum(edges > 0) / edges.size
        
        return edge_density > 0.05
    
    def _calculate_layout_score(self, structure_valid: bool, photo_valid: bool, 
                                text_valid: bool, logo_detected: bool) -> float:
        """Calculate overall layout verification score."""
        score = 0.0
        
        # Structure check (30% weight)
        if structure_valid:
            score += 30
        
        # Photo position check (30% weight)
        if photo_valid:
            score += 30
        
        # Text alignment check (25% weight)
        if text_valid:
            score += 25
        
        # Logo detection (15% weight)
        if logo_detected:
            score += 15
        
        return score
    
    def _count_corners(self, image: np.ndarray) -> int:
        """Count detectable corners in the image."""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Use Harris corner detection
        dst = cv2.cornerHarris(gray, 2, 3, 0.04)
        dst_normalized = cv2.normalize(dst, None, 0, 255, cv2.NORM_MINMAX)
        
        # Count significant corners
        corners = np.where(dst_normalized > 200)
        return len(corners[0])
    
    def _check_edge_quality(self, image: np.ndarray) -> float:
        """Check the quality of card edges."""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 50, 150)
        
        # Calculate edge strength
        edge_strength = np.sum(edges) / edges.size
        
        return min(edge_strength * 10, 100)  # Normalize to 0-100
