import cv2
import numpy as np
from typing import Dict, Any
from skimage import io, filters, feature
from scipy import ndimage
from app.schemas import TamperingDetectionResult
from app.utils.image_preprocessor import decode_base64_image, preprocess_cnic_image


class TamperingDetector:
    """Service for detecting image tampering and manipulation."""
    
    def __init__(self):
        """Initialize tampering detector."""
        pass
    
    def detect_tampering(self, image_data: str) -> TamperingDetectionResult:
        """
        Detect tampering in CNIC image using multiple forensic techniques.
        
        Args:
            image_data: Base64 encoded CNIC image
            
        Returns:
            TamperingDetectionResult with detailed analysis
        """
        try:
            # Decode and preprocess image
            image = decode_base64_image(image_data)
            image = preprocess_cnic_image(image)
            
            # Perform multiple tampering detection methods
            ela_score = self._error_level_analysis(image)
            noise_score = self._noise_consistency_analysis(image)
            blur_score = self._blur_detection(image)
            copy_move_score = self._copy_move_detection(image)
            
            # Calculate combined tampering score
            # Higher score = more likely genuine (less tampered)
            combined_score = (
                ela_score * 0.30 +
                noise_score * 0.30 +
                blur_score * 0.20 +
                copy_move_score * 0.20
            )
            
            # Determine if tampered
            is_tampered = combined_score < 50

            # Cast numpy.bool_ -> native bool for Pydantic serialization
            is_tampered_bool = bool(is_tampered)

            return TamperingDetectionResult(
                is_tampered=is_tampered_bool,
                score=combined_score,
                ela_score=ela_score,
                noise_consistency_score=noise_score,
                blur_score=blur_score,
                copy_move_score=copy_move_score,
                details={
                    "analysis_methods": [
                        "error_level_analysis",
                        "noise_consistency_analysis", 
                        "blur_detection",
                        "copy_move_detection"
                    ],
                    "tampering_probability": 100 - combined_score,
                    "authenticity_score": combined_score,
                    "threshold": 50,
                    "individual_scores": {
                        "ela": ela_score,
                        "noise": noise_score,
                        "blur": blur_score,
                        "copy_move": copy_move_score
                    }
                }
            )
            
        except Exception as e:
            print(f"Tampering detection error: {e}")
            return TamperingDetectionResult(
                is_tampered=False,  # Assume genuine if analysis fails
                score=50.0,  # Neutral score
                details={"error": str(e)}
            )
    
    def _error_level_analysis(self, image: np.ndarray) -> float:
        """
        Error Level Analysis (ELA) - Detects areas with different compression levels.
        Tampered regions often have different compression artifacts.
        """
        # Convert to RGB for PIL compatibility
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Save image at high quality (95%)
        _, encoded_image = cv2.imencode('.jpg', image_rgb, [cv2.IMWRITE_JPEG_QUALITY, 95])
        encoded_bytes = encoded_image.tobytes()
        
        # Decode the re-compressed image
        recompressed = cv2.imdecode(np.frombuffer(encoded_bytes, dtype=np.uint8), cv2.IMREAD_COLOR)
        
        # Calculate difference (error level)
        image_float = image.astype(np.float32)
        recompressed_float = recompressed.astype(np.float32)
        
        error_image = cv2.absdiff(image_float, recompressed_float)
        
        # Analyze error distribution
        error_gray = cv2.cvtColor(error_image.astype(np.uint8), cv2.COLOR_BGR2GRAY)
        
        # Calculate statistics
        mean_error = np.mean(error_gray)
        std_error = np.std(error_gray)
        
        # Divide image into blocks and analyze variance
        block_size = 8
        height, width = error_gray.shape
        block_variances = []
        
        for y in range(0, height - block_size, block_size):
            for x in range(0, width - block_size, block_size):
                block = error_gray[y:y+block_size, x:x+block_size]
                variance = np.var(block)
                block_variances.append(variance)
        
        # Calculate coefficient of variation of block variances
        if len(block_variances) > 0:
            variance_mean = np.mean(block_variances)
            variance_std = np.std(block_variances)
            coefficient_of_variation = variance_std / variance_mean if variance_mean > 0 else 0
        else:
            coefficient_of_variation = 0
        
        # Genuine images typically have consistent error levels
        # Tampered images have inconsistent error levels across regions
        # Lower CV = more consistent = more likely genuine
        
        if coefficient_of_variation < 0.5:
            return 90 - coefficient_of_variation * 40
        elif coefficient_of_variation < 1.0:
            return 70 - (coefficient_of_variation - 0.5) * 40
        else:
            return max(20, 50 - (coefficient_of_variation - 1.0) * 10)
    
    def _noise_consistency_analysis(self, image: np.ndarray) -> float:
        """
        Analyze noise consistency across the image.
        Tampered regions often have different noise patterns.
        """
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Estimate noise using wavelet transform
        # High-frequency coefficients represent noise
        from skimage.restoration import estimate_sigma
        
        try:
            # Estimate noise standard deviation
            noise_sigma = estimate_sigma(gray)
            
            # Analyze noise in different regions
            height, width = gray.shape
            region_size = min(height, width) // 4
            
            region_noises = []
            for i in range(4):
                for j in range(4):
                    y_start = i * region_size
                    x_start = j * region_size
                    y_end = min(y_start + region_size, height)
                    x_end = min(x_start + region_size, width)
                    
                    region = gray[y_start:y_end, x_start:x_end]
                    if region.size > 0:
                        region_sigma = estimate_sigma(region)
                        region_noises.append(region_sigma)
            
            # Calculate consistency of noise across regions
            if len(region_noises) > 0:
                noise_mean = np.mean(region_noises)
                noise_std = np.std(region_noises)
                noise_cv = noise_std / noise_mean if noise_mean > 0 else 0
                
                # Lower CV = more consistent noise = more likely genuine
                if noise_cv < 0.2:
                    return 95
                elif noise_cv < 0.4:
                    return 80 - (noise_cv - 0.2) * 75
                else:
                    return max(20, 50 - (noise_cv - 0.4) * 30)
            
        except Exception:
            # Fallback to simpler noise analysis
            laplacian = cv2.Laplacian(gray, cv2.CV_64F)
            noise_variance = np.var(laplacian)
            
            # Very low or very high variance might indicate tampering
            if 10 < noise_variance < 1000:
                return 80
            else:
                return 50
        
        return 50
    
    def _blur_detection(self, image: np.ndarray) -> float:
        """
        Detect blur inconsistencies that might indicate tampering.
        Pasted regions often have different blur levels.
        """
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Calculate Laplacian variance (measure of sharpness)
        laplacian = cv2.Laplacian(gray, cv2.CV_64F)
        overall_variance = np.var(laplacian)
        
        # Analyze blur in different regions
        height, width = gray.shape
        block_size = min(height, width) // 8
        
        block_variances = []
        for y in range(0, height - block_size, block_size):
            for x in range(0, width - block_size, block_size):
                block = gray[y:y+block_size, x:x+block_size]
                block_laplacian = cv2.Laplacian(block, cv2.CV_64F)
                block_variance = np.var(block_laplacian)
                block_variances.append(block_variance)
        
        if len(block_variances) == 0:
            return 50
        
        # Check for inconsistent blur levels
        variance_mean = np.mean(block_variances)
        variance_std = np.std(block_variances)
        
        # Count blocks with significantly different blur
        inconsistent_blocks = sum(
            1 for v in block_variances 
            if abs(v - variance_mean) > 2 * variance_std
        )
        
        inconsistency_ratio = inconsistent_blocks / len(block_variances)
        
        # Genuine images typically have consistent blur
        if inconsistency_ratio < 0.1:
            return 90
        elif inconsistency_ratio < 0.2:
            return 75
        elif inconsistency_ratio < 0.3:
            return 60
        else:
            return max(20, 50 - inconsistency_ratio * 50)
    
    def _copy_move_detection(self, image: np.ndarray) -> float:
        """
        Detect copy-move forgery where parts of the image are duplicated.
        Uses block-matching approach.
        """
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Extract features using SIFT
        sift = cv2.SIFT_create()
        
        try:
            keypoints, descriptors = sift.detectAndCompute(gray, None)
            
            if descriptors is None or len(keypoints) < 10:
                return 80  # Not enough features to analyze
            
            # Match features using brute force
            bf = cv2.BFMatcher()
            matches = bf.knnMatch(descriptors, descriptors, k=2)
            
            # Apply Lowe's ratio test
            good_matches = []
            for match_pair in matches:
                if len(match_pair) == 2:
                    m, n = match_pair
                    if m.distance < 0.75 * n.distance:
                        good_matches.append(m)
            
            # Analyze spatial distribution of matches
            if len(good_matches) < 20:
                return 80  # Few matches, likely no copy-move
            
            # Get matched keypoint locations
            matched_points_1 = np.array([keypoints[m.queryIdx].pt for m in good_matches])
            matched_points_2 = np.array([keypoints[m.trainIdx].pt for m in good_matches])
            
            # Calculate distances between matched points
            distances = np.sqrt(
                np.sum((matched_points_1 - matched_points_2) ** 2, axis=1)
            )
            
            # Filter out self-matches (very small distances)
            valid_distances = distances[distances > 10]
            
            if len(valid_distances) == 0:
                return 90
            
            # Look for clusters of similar displacement vectors
            # Copy-move regions will have many matches with similar displacement
            displacement_vectors = matched_points_2 - matched_points_1
            valid_displacements = displacement_vectors[distances > 10]
            
            if len(valid_displacements) < 5:
                return 85
            
            # Cluster analysis (simplified)
            # Calculate pairwise similarity of displacement vectors
            similar_displacements = 0
            total_pairs = 0
            
            for i in range(min(len(valid_displacements), 50)):
                for j in range(i + 1, min(len(valid_displacements), 50)):
                    diff = valid_displacements[i] - valid_displacements[j]
                    distance = np.sqrt(np.sum(diff ** 2))
                    if distance < 5:  # Similar displacement
                        similar_displacements += 1
                    total_pairs += 1
            
            if total_pairs > 0:
                similarity_ratio = similar_displacements / total_pairs
                
                # High similarity ratio might indicate copy-move
                if similarity_ratio < 0.1:
                    return 90
                elif similarity_ratio < 0.2:
                    return 75
                elif similarity_ratio < 0.3:
                    return 60
                else:
                    return max(20, 50 - similarity_ratio * 50)
            
        except cv2.error:
            # SIFT might fail on some images
            return 70
        
        return 70
