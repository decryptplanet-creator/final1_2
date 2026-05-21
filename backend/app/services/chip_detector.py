import cv2
import numpy as np
from typing import Dict, Any, Tuple
from app.schemas import ChipDetectionResult
from app.utils.image_preprocessor import decode_base64_image, preprocess_cnic_image


class ChipDetector:
    """Service for detecting and verifying the chip on CNIC."""
    
    # Chip characteristics (approximate)
    # CNIC chip is a small metallic rectangle, typically gold/copper colored
    CHIP_WIDTH_RATIO = 0.06  # ~6% of card width
    CHIP_HEIGHT_RATIO = 0.08  # ~8% of card height
    
    # Expected chip position (on the left side of CNIC front)
    CHIP_X_RATIO = 0.08  # 8% from left edge
    CHIP_Y_RATIO = 0.60  # 60% from top (below photo)
    
    # Chip color characteristics (in HSV)
    # Gold/copper metallic colors
    CHIP_COLOR_LOWER = np.array([15, 50, 50])
    CHIP_COLOR_UPPER = np.array([35, 255, 200])
    
    def __init__(self):
        """Initialize chip detector."""
        # Load or create chip template
        self.chip_template = self._create_chip_template()
    
    def _create_chip_template(self) -> np.ndarray:
        """Create a simple chip template for template matching."""
        # Create a small rectangular template that resembles a chip
        template = np.zeros((30, 40, 3), dtype=np.uint8)
        # Gold/copper color
        template[:] = (20, 120, 200)  # BGR format
        # Add some circuit-like patterns
        cv2.rectangle(template, (5, 5), (35, 25), (40, 140, 220), -1)
        cv2.line(template, (20, 5), (20, 25), (10, 80, 160), 1)
        cv2.line(template, (5, 15), (35, 15), (10, 80, 160), 1)
        return template
    
    def detect_chip(self, image_data: str) -> ChipDetectionResult:
        """
        Detect chip presence on CNIC image.
        
        Args:
            image_data: Base64 encoded CNIC image
            
        Returns:
            ChipDetectionResult with detection details
        """
        try:
            # Decode and preprocess image
            image = decode_base64_image(image_data)
            image = preprocess_cnic_image(image)
            
            height, width = image.shape[:2]
            
            # Define expected chip region
            chip_x = int(width * self.CHIP_X_RATIO)
            chip_y = int(height * self.CHIP_Y_RATIO)
            chip_w = int(width * self.CHIP_WIDTH_RATIO)
            chip_h = int(height * self.CHIP_HEIGHT_RATIO)
            
            # Ensure chip region is within bounds
            chip_x = max(0, chip_x)
            chip_y = max(0, chip_y)
            chip_w = min(chip_w, width - chip_x)
            chip_h = min(chip_h, height - chip_y)
            
            # Extract chip region
            chip_region = image[chip_y:chip_y+chip_h, chip_x:chip_x+chip_w]
            
            if chip_region.size == 0:
                return ChipDetectionResult(
                    chip_present=False,
                    score=0.0,
                    details={"error": "Chip region out of bounds"}
                )
            
            # Perform multiple detection methods
            color_match_score = self._check_chip_color(chip_region)
            shape_match_score = self._check_chip_shape(chip_region)
            template_match_score = self._template_matching(chip_region)
            metallic_reflection_score = self._detect_metallic_reflection(chip_region)
            
            # Combine scores with weights
            combined_score = (
                color_match_score * 0.30 +
                shape_match_score * 0.25 +
                template_match_score * 0.25 +
                metallic_reflection_score * 0.20
            )
            
            chip_present = combined_score >= 40
            position_valid = self._verify_chip_position(image, chip_x, chip_y, chip_w, chip_h)

            # Cast numpy.bool_ -> native bool for Pydantic serialization
            chip_present_bool = bool(chip_present)
            position_valid_bool = bool(position_valid)

            return ChipDetectionResult(
                chip_present=chip_present_bool,
                score=combined_score,
                position_valid=position_valid_bool,
                confidence=combined_score / 100.0,
                details={
                    "chip_region_x": chip_x,
                    "chip_region_y": chip_y,
                    "chip_region_width": chip_w,
                    "chip_region_height": chip_h,
                    "color_match_score": color_match_score,
                    "shape_match_score": shape_match_score,
                    "template_match_score": template_match_score,
                    "metallic_reflection_score": metallic_reflection_score,
                    "combined_score": combined_score,
                    "detection_method": "multi-feature-analysis"
                }
            )
            
        except Exception as e:
            print(f"Chip detection error: {e}")
            return ChipDetectionResult(
                chip_present=False,
                score=0.0,
                details={"error": str(e)}
            )
    
    def _check_chip_color(self, chip_region: np.ndarray) -> float:
        """Check if chip region has expected gold/copper color."""
        # Convert to HSV color space
        hsv = cv2.cvtColor(chip_region, cv2.COLOR_BGR2HSV)
        
        # Create mask for gold/copper colors
        mask = cv2.inRange(hsv, self.CHIP_COLOR_LOWER, self.CHIP_COLOR_UPPER)
        
        # Calculate percentage of pixels matching chip color
        color_pixels = np.sum(mask > 0)
        total_pixels = mask.size
        color_ratio = color_pixels / total_pixels
        
        # Score based on color ratio
        # Expected: 20-60% of chip region should be gold/copper colored
        if 0.2 <= color_ratio <= 0.6:
            return min(color_ratio * 150, 100)
        elif color_ratio > 0.1:
            return min(color_ratio * 100, 80)
        else:
            return color_ratio * 50
    
    def _check_chip_shape(self, chip_region: np.ndarray) -> float:
        """Check if chip region has expected rectangular shape."""
        gray = cv2.cvtColor(chip_region, cv2.COLOR_BGR2GRAY)
        
        # Apply threshold to segment chip
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Find contours
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if not contours:
            return 0.0
        
        # Find largest contour
        largest_contour = max(contours, key=cv2.contourArea)
        
        # Approximate to polygon
        epsilon = 0.02 * cv2.arcLength(largest_contour, True)
        approx = cv2.approxPolyDP(largest_contour, epsilon, True)
        
        # Check if it's rectangular (4 vertices)
        is_rectangular = len(approx) == 4
        
        # Check aspect ratio (chip should be roughly 3:4 or 2:3)
        x, y, w, h = cv2.boundingRect(largest_contour)
        aspect_ratio = w / h if h > 0 else 0
        expected_aspect_ratio = 0.75  # 3:4
        aspect_ratio_valid = 0.5 < aspect_ratio < 1.2
        
        # Calculate score
        score = 0.0
        if is_rectangular:
            score += 50
        
        if aspect_ratio_valid:
            # Closer to expected aspect ratio = higher score
            aspect_diff = abs(aspect_ratio - expected_aspect_ratio)
            score += max(0, 50 - aspect_diff * 100)
        
        return score
    
    def _template_matching(self, chip_region: np.ndarray) -> float:
        """Use template matching to detect chip."""
        # Resize template to match chip region size
        template_resized = cv2.resize(self.chip_template, 
                                       (chip_region.shape[1], chip_region.shape[0]))
        
        # Perform template matching
        result = cv2.matchTemplate(chip_region, template_resized, cv2.TM_CCOEFF_NORMED)
        _, max_val, _, _ = cv2.minMaxLoc(result)
        
        # Scale to 0-100
        return max_val * 100
    
    def _detect_metallic_reflection(self, chip_region: np.ndarray) -> float:
        """Detect metallic reflection characteristics."""
        gray = cv2.cvtColor(chip_region, cv2.COLOR_BGR2GRAY)
        
        # Metallic surfaces often have specular highlights
        # Look for bright spots with sharp transitions
        
        # Calculate local contrast
        kernel = np.ones((3, 3), np.float32) / 9
        mean_filter = cv2.filter2D(gray, -1, kernel)
        local_contrast = cv2.absdiff(gray, mean_filter)
        
        # Count high-contrast pixels (potential specular highlights)
        high_contrast_pixels = np.sum(local_contrast > 30)
        contrast_ratio = high_contrast_pixels / local_contrast.size
        
        # Metallic surfaces typically have 10-30% high-contrast pixels
        if 0.1 <= contrast_ratio <= 0.3:
            return min(contrast_ratio * 400, 100)
        elif contrast_ratio > 0.05:
            return min(contrast_ratio * 200, 80)
        else:
            return contrast_ratio * 100
    
    def _verify_chip_position(self, image: np.ndarray, 
                              chip_x: int, chip_y: int, 
                              chip_w: int, chip_h: int) -> bool:
        """Verify that chip is in the expected position."""
        height, width = image.shape[:2]
        
        # Expected position ranges
        expected_x = width * self.CHIP_X_RATIO
        expected_y = height * self.CHIP_Y_RATIO
        
        # Allow 20% tolerance
        x_tolerance = width * 0.03
        y_tolerance = height * 0.05
        
        x_valid = abs(chip_x - expected_x) < x_tolerance
        y_valid = abs(chip_y - expected_y) < y_tolerance
        
        return x_valid and y_valid
