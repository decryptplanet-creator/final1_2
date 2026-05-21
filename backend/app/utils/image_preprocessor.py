import cv2
import numpy as np
from PIL import Image
import base64
from io import BytesIO
from typing import Tuple, Optional


def decode_base64_image(base64_string: str) -> np.ndarray:
    """Decode base64 encoded image to numpy array."""
    if "base64," in base64_string:
        base64_string = base64_string.split("base64,")[1]
    
    image_bytes = base64.b64decode(base64_string)
    image = Image.open(BytesIO(image_bytes))
    return cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)


def encode_image_to_base64(image: np.ndarray, format: str = "JPEG") -> str:
    """Encode numpy array image to base64 string."""
    _, buffer = cv2.imencode(f".{format.lower()}", image)
    return base64.b64encode(buffer).decode('utf-8')


def resize_image(image: np.ndarray, max_width: int = 1024, max_height: int = 768) -> np.ndarray:
    """Resize image while maintaining aspect ratio."""
    height, width = image.shape[:2]
    
    if width <= max_width and height <= max_height:
        return image
    
    scale = min(max_width / width, max_height / height)
    new_width = int(width * scale)
    new_height = int(height * scale)
    
    return cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_AREA)


def correct_perspective(image: np.ndarray) -> np.ndarray:
    """
    Correct perspective distortion in CNIC image.
    Attempts to detect document edges and straighten the image.
    """
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Edge detection
    edged = cv2.Canny(blurred, 75, 200)
    
    # Find contours
    contours, _ = cv2.findContours(edged.copy(), cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)[:5]
    
    for contour in contours:
        # Approximate contour to polygon
        epsilon = 0.02 * cv2.arcLength(contour, True)
        approx = cv2.approxPolyDP(contour, epsilon, True)
        
        # If approximated contour has 4 points, it's likely a document
        if len(approx) == 4:
            # Get perspective transform
            pts = approx.reshape(4, 2)
            rect = order_points(pts)
            
            # Get dimensions of new image
            (tl, tr, br, bl) = rect
            widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
            widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
            maxWidth = int(max(widthA, widthB))
            
            heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
            heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
            maxHeight = int(max(heightA, heightB))
            
            dst = np.array([
                [0, 0],
                [maxWidth - 1, 0],
                [maxWidth - 1, maxHeight - 1],
                [0, maxHeight - 1]
            ], dtype="float32")
            
            # Apply perspective transform
            M = cv2.getPerspectiveTransform(rect, dst)
            warped = cv2.warpPerspective(image, M, (maxWidth, maxHeight))
            
            return warped
    
    return image


def order_points(pts: np.ndarray) -> np.ndarray:
    """Order points in top-left, top-right, bottom-right, bottom-left order."""
    rect = np.zeros((4, 2), dtype="float32")
    
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]  # Top-left
    rect[2] = pts[np.argmax(s)]  # Bottom-right
    
    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]  # Top-right
    rect[3] = pts[np.argmax(diff)]  # Bottom-left
    
    return rect


def remove_noise(image: np.ndarray) -> np.ndarray:
    """Remove noise from image using non-local means denoising."""
    # Convert to RGB if needed
    if len(image.shape) == 2:
        # Grayscale image
        return cv2.fastNlMeansDenoising(image, None, 10, 7, 21)
    else:
        # Color image
        return cv2.fastNlMeansDenoisingColored(image, None, 10, 10, 7, 21)


def enhance_contrast(image: np.ndarray) -> np.ndarray:
    """Enhance image contrast using CLAHE."""
    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    
    # Apply CLAHE to L channel
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced_l = clahe.apply(l)
    
    # Merge channels back
    enhanced_lab = cv2.merge([enhanced_l, a, b])
    return cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2BGR)


def preprocess_cnic_image(image: np.ndarray) -> np.ndarray:
    """
    Complete preprocessing pipeline for CNIC image.
    Steps: Resize -> Perspective Correction -> Noise Removal -> Contrast Enhancement
    """
    # Step 1: Resize if too large
    image = resize_image(image, max_width=1024, max_height=768)
    
    # Step 2: Correct perspective
    image = correct_perspective(image)
    
    # Step 3: Remove noise
    image = remove_noise(image)
    
    # Step 4: Enhance contrast
    image = enhance_contrast(image)
    
    return image


def crop_cnic_region(image: np.ndarray) -> np.ndarray:
    """
    Crop the main CNIC region from the image.
    Assumes CNIC is the largest rectangular object in the image.
    """
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Threshold to get binary image
    _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    
    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Find largest contour by area
    if contours:
        largest_contour = max(contours, key=cv2.contourArea)
        x, y, w, h = cv2.boundingRect(largest_contour)
        
        # Add small margin
        margin = 5
        x = max(0, x - margin)
        y = max(0, y - margin)
        w = min(image.shape[1] - x, w + 2 * margin)
        h = min(image.shape[0] - y, h + 2 * margin)
        
        return image[y:y+h, x:x+w]
    
    return image


def extract_photo_region(image: np.ndarray) -> Optional[np.ndarray]:
    """
    Extract the photo region from CNIC.
    CNIC photo is typically on the left side (front) or right side (back).
    """
    height, width = image.shape[:2]
    
    # CNIC photo is typically in the left 40% of the card
    photo_width = int(width * 0.4)
    photo_height = int(height * 0.6)
    
    # Position for front side (photo on left)
    x = int(width * 0.05)
    y = int(height * 0.15)
    
    # Check if this region has significant content
    photo_region = image[y:y+photo_height, x:x+photo_width]
    
    # Simple check: if region is too dark or too light, try other positions
    mean_intensity = np.mean(cv2.cvtColor(photo_region, cv2.COLOR_BGR2GRAY))
    if mean_intensity < 30 or mean_intensity > 220:
        # Try right side for back of CNIC
        x = int(width * 0.55)
        photo_region = image[y:y+photo_height, x:x+photo_width]
    
    return photo_region if photo_region.size > 0 else None


def get_image_dimensions(image: np.ndarray) -> Tuple[int, int]:
    """Get image dimensions (width, height)."""
    return (image.shape[1], image.shape[0])