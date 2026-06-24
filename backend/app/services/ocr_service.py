import os
import re
from typing import Optional, Dict, Any
from google.cloud import vision
from app.schemas import OCRResult
from app.utils.image_preprocessor import decode_base64_image, encode_image_to_base64
import cv2
import numpy as np


class OCRService:
    """Service for extracting text from CNIC images using Google Cloud Vision API."""
    
    def __init__(self):
        """Initialize OCR service with Google Cloud Vision client."""
        try:
            self.client = vision.ImageAnnotatorClient()
            self.is_available = True
        except Exception as e:
            print(f"Warning: Google Cloud Vision client initialization failed: {e}")
            self.client = None
            self.is_available = False
    
    def extract_text_from_image(self, image_data: str) -> OCRResult:
        """
        Extract text from CNIC image using Google Cloud Vision API.
        
        Args:
            image_data: Base64 encoded image string
            
        Returns:
            OCRResult with extracted information
        """
        if not self.is_available or self.client is None:
            return OCRResult(
                confidence=0.0,
                raw_text="",
                name=None,
                cnic_number=None,
                dob=None,
                expiry_date=None
            )
        
        try:
            # Decode base64 image
            image_array = decode_base64_image(image_data)
            
            # Convert to bytes for Vision API
            _, buffer = cv2.imencode('.jpg', image_array)
            image_content = buffer.tobytes()
            
            # Create vision image
            image = vision.Image(content=image_content)
            
            # Perform text detection
            response = self.client.text_detection(image=image)
            texts = response.text_annotations
            
            if not texts:
                return OCRResult(
                    confidence=0.0,
                    raw_text="",
                    name=None,
                    cnic_number=None,
                    dob=None,
                    expiry_date=None
                )
            
            # Get full text and sanitize to skip unreadable characters
            full_text = texts[0].description if texts else ""
            full_text = full_text.encode('utf-8', errors='ignore').decode('utf-8')
            
            # Parse CNIC specific information
            parsed_data = self._parse_cnic_text(full_text)
            
            # Calculate confidence (based on text detection confidence)
            confidence = self._calculate_confidence(texts, full_text)
            
            return OCRResult(
                name=parsed_data.get("name"),
                cnic_number=parsed_data.get("cnic_number"),
                dob=parsed_data.get("dob"),
                expiry_date=parsed_data.get("expiry_date"),
                confidence=confidence,
                raw_text=full_text
            )
            
        except Exception as e:
            print(f"OCR extraction error: {e}")
            return OCRResult(
                confidence=0.0,
                raw_text="",
                name=None,
                cnic_number=None,
                dob=None,
                expiry_date=None
            )
    
    def _parse_cnic_text(self, text: str) -> Dict[str, Optional[str]]:
        """
        Parse CNIC specific information from extracted text.
        
        CNIC Format (Pakistan):
        - Name (Urdu and English)
        - Father/Husband Name
        - CNIC Number (13 digits, format: XXXXX-XXXXXXX-X)
        - Date of Birth (DD/MM/YYYY)
        - Date of Issue
        - Date of Expiry
        """
        result = {
            "name": None,
            "cnic_number": None,
            "dob": None,
            "expiry_date": None
        }
        
        # Clean and normalize text
        text = text.replace('\n', ' ').replace('\r', ' ')
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        # Pattern for CNIC number (13 digits with optional dashes)
        cnic_pattern = r'\b(\d{5}[-\s]?\d{7}[-\s]?\d)\b'
        cnic_match = re.search(cnic_pattern, text)
        if cnic_match:
            cnic_number = cnic_match.group(1).replace('-', '').replace(' ', '')
            result["cnic_number"] = cnic_number
        
        # Pattern for dates (DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY)
        date_pattern = r'\b(\d{1,2}[/\-\.]\d{1,2}[/\-\.]\d{4})\b'
        dates = re.findall(date_pattern, text)
        
        # Identify DOB and Expiry
        if dates:
            # Try to identify which date is DOB and which is expiry
            for date_str in dates:
                # Normalize date format
                date_normalized = date_str.replace('-', '/').replace('.', '/')
                
                # Check if it's likely an expiry date (future date)
                try:
                    from datetime import datetime
                    date_obj = datetime.strptime(date_normalized, '%d/%m/%Y')
                    current_year = datetime.now().year

                    if date_obj.year >= current_year:
                        result["expiry_date"] = date_normalized
                    elif date_obj.year <= (current_year - 10):  # age 10+ valid for CNIC
                        result["dob"] = date_normalized
                except ValueError:
                    continue
        
        # Extract name - typically appears at the beginning
        # Look for common CNIC name patterns
        name_patterns = [
            r'(?:Name|نام)\s*[:\-]?\s*([A-Za-z\s\.]+?)(?:\n|$|Father|Husband|CNIC|Date)',
            r'^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)',  # Capitalized name at start
        ]
        
        for pattern in name_patterns:
            name_match = re.search(pattern, text, re.MULTILINE | re.IGNORECASE)
            if name_match:
                name = name_match.group(1).strip()
                # Clean up name
                name = re.sub(r'\s+', ' ', name)
                if len(name) > 3:  # Minimum name length
                    result["name"] = name
                    break
        
        # If no name found with patterns, try to extract from lines
        if not result["name"]:
            for line in lines:
                # Skip lines that contain numbers or dates
                if re.search(r'\d', line):
                    continue
                # Skip common CNIC labels
                if any(keyword in line.lower() for keyword in [
                    'republic', 'pakistan', 'identity', 'card', 
                    'national', 'nadra', 'issued', 'valid'
                ]):
                    continue
                # If line is reasonably long and looks like a name
                if len(line) > 5 and len(line) < 50:
                    result["name"] = line.strip()
                    break
        
        return result
    
    def _calculate_confidence(self, texts, full_text: str) -> float:
        """
        Calculate confidence score for OCR result.
        Based on text length, presence of key fields, and detection confidence.
        """
        confidence = 50.0  # Base confidence
        
        # Increase confidence based on text length
        if len(full_text) > 100:
            confidence += 20
        elif len(full_text) > 50:
            confidence += 10
        
        # Increase confidence if key fields are detected
        if re.search(r'\d{13}', full_text.replace('-', '').replace(' ', '')):
            confidence += 15
        
        if re.search(r'\d{1,2}/\d{1,2}/\d{4}', full_text):
            confidence += 10
        
        # Check for bounding box confidence from Vision API
        if hasattr(texts[0], 'confidence') and texts[0].confidence:
            api_confidence = texts[0].confidence * 20  # Scale to 0-20
            confidence += api_confidence
        
        return min(confidence, 100.0)
    
    def extract_text_with_document_analysis(self, image_data: str) -> Dict[str, Any]:
        """
        Perform full document analysis on CNIC image.
        Returns detailed information about text locations and structure.
        """
        if not self.is_available or self.client is None:
            return {"success": False, "error": "OCR service not available"}
        
        try:
            image_array = decode_base64_image(image_data)
            _, buffer = cv2.imencode('.jpg', image_array)
            image_content = buffer.tobytes()
            
            image = vision.Image(content=image_content)
            
            # Use document text detection for better structure
            response = self.client.document_text_detection(image=image)
            
            result = {
                "success": True,
                "full_text": response.full_text_annotation.text,
                "pages": [],
                "text_blocks": []
            }
            
            # Extract page information
            for page in response.full_text_annotation.pages:
                page_info = {
                    "width": page.width,
                    "height": page.height,
                    "blocks": []
                }
                
                for block in page.blocks:
                    block_text = ''.join(
                        paragraph.symbols[0].text 
                        for paragraph in block.paragraphs
                    )
                    page_info["blocks"].append({
                        "text": block_text,
                        "confidence": block.confidence if hasattr(block, 'confidence') else 1.0,
                        "block_type": block.block_type.name if hasattr(block, 'block_type') else 'UNKNOWN'
                    })
                
                result["pages"].append(page_info)
            
            return result
            
        except Exception as e:
            return {"success": False, "error": str(e)}
