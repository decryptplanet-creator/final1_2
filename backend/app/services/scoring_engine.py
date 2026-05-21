from typing import Dict, Any, Optional
from datetime import datetime
import uuid
from app.schemas import (
    VerificationResult, VerificationScore, OCRResult, 
    LayoutVerificationResult, ChipDetectionResult, 
    TamperingDetectionResult, FaceComparisonResult, 
    TextMatchResult, VerificationRequest
)
from app.config import settings
import numpy as np


class ScoringEngine:
    """
    Central scoring engine that combines all verification modules
    into a final decision.
    """
    
    def __init__(self):
        """Initialize scoring engine with configured weights."""
        self.weights = {
            'text_match': settings.text_match_weight,
            'face_match': settings.face_match_weight,
            'layout': settings.layout_weight,
            'chip': settings.chip_weight,
            'tampering': settings.tampering_weight,
            'ocr_confidence': settings.ocr_confidence_weight
        }
        
        self.thresholds = {
            'genuine': settings.genuine_score_threshold,
            'suspicious': settings.suspicious_score_threshold,
            'face_match': settings.face_match_threshold,
            'text_match': settings.text_match_threshold,
            'tampering': settings.tampering_threshold
        }
    
    def calculate_final_result(
        self,
        ocr_result: OCRResult,
        layout_result: LayoutVerificationResult,
        chip_result: ChipDetectionResult,
        tampering_result: TamperingDetectionResult,
        face_comparison_result: FaceComparisonResult,
        user_input: VerificationRequest
    ) -> VerificationResult:
        """
        Calculate final verification result by combining all scores.
        
        Args:
            ocr_result: OCR extraction result
            layout_result: Layout verification result
            chip_result: Chip detection result
            tampering_result: Tampering detection result
            face_comparison_result: Face comparison result
            user_input: User-provided data for verification
            
        Returns:
            VerificationResult with final decision
        """
        # Calculate text match score
        text_match_result = self._calculate_text_match(ocr_result, user_input)
        text_match_score = self._create_verification_score(
            "Text Match",
            text_match_result.match_score,
            self.weights['text_match'],
            text_match_result.match_score >= self.thresholds['text_match'] * 100
        )
        
        # Calculate face match score
        face_score = face_comparison_result.similarity_score
        face_match_score = self._create_verification_score(
            "Face Match",
            face_score,
            self.weights['face_match'],
            face_comparison_result.is_match
        )
        
        # Calculate layout score
        layout_score = self._create_verification_score(
            "Layout Verification",
            layout_result.score,
            self.weights['layout'],
            layout_result.is_valid
        )
        
        # Calculate chip score
        chip_score = self._create_verification_score(
            "Chip Detection",
            chip_result.score,
            self.weights['chip'],
            chip_result.chip_present
        )
        
        # Calculate tampering score
        tampering_score = self._create_verification_score(
            "Tampering Detection",
            tampering_result.score,
            self.weights['tampering'],
            not tampering_result.is_tampered
        )
        
        # Calculate OCR confidence score
        ocr_confidence_score = self._create_verification_score(
            "OCR Confidence",
            ocr_result.confidence,
            self.weights['ocr_confidence'],
            ocr_result.confidence >= 70
        )
        
        # Calculate final weighted score
        final_score = (
            text_match_score.weighted_score +
            face_match_score.weighted_score +
            layout_score.weighted_score +
            chip_score.weighted_score +
            tampering_score.weighted_score +
            ocr_confidence_score.weighted_score
        )
        
        # Determine final decision
        final_decision = self._determine_decision(final_score)
        
        verification_result = VerificationResult(
            verification_id=str(uuid.uuid4()),
            timestamp=datetime.now(),
            final_score=round(final_score, 2),
            final_decision=final_decision,
            text_match_score=text_match_score,
            face_match_score=face_match_score,
            layout_score=layout_score,
            chip_score=chip_score,
            tampering_score=tampering_score,
            ocr_confidence_score=ocr_confidence_score,
            ocr_result=ocr_result,
            layout_result=layout_result,
            chip_result=chip_result,
            tampering_result=tampering_result,
            face_comparison_result=face_comparison_result,
            text_match_result=text_match_result,
            user_input={
                "name": user_input.user_name,
                "cnic": user_input.user_cnic,
                "dob": user_input.user_dob,
                "expiry": user_input.user_expiry
            }
        )

        # Recursively sanitize numpy types so FastAPI/Pydantic can serialize safely.
        def sanitize(value):
            if isinstance(value, np.bool_):
                return bool(value)
            if isinstance(value, np.generic):
                return value.item()
            if isinstance(value, dict):
                return {k: sanitize(v) for k, v in value.items()}
            if isinstance(value, list):
                return [sanitize(v) for v in value]
            return value

        sanitized_dict = sanitize(verification_result.model_dump())
        return VerificationResult(**sanitized_dict)
    
    def _calculate_text_match(self, ocr_result: OCRResult, 
                              user_input: VerificationRequest) -> TextMatchResult:
        """
        Calculate text match score between OCR results and user input.
        """
        score = 0.0
        total_fields = 0
        matched_fields = 0
        
        details = {}
        
        # Match CNIC number
        if ocr_result.cnic_number and user_input.user_cnic:
            total_fields += 1
            # Normalize CNIC numbers (remove dashes and spaces)
            ocr_cnic = ocr_result.cnic_number.replace('-', '').replace(' ', '')
            user_cnic = user_input.user_cnic.replace('-', '').replace(' ', '')
            
            if ocr_cnic == user_cnic:
                matched_fields += 1
                details['cnic_match'] = True
                score += 25
            else:
                details['cnic_match'] = False
                # Partial match scoring
                similarity = self._string_similarity(ocr_cnic, user_cnic)
                score += similarity * 25
        
        # Match name
        if ocr_result.name and user_input.user_name:
            total_fields += 1
            name_similarity = self._string_similarity(
                ocr_result.name.lower().strip(),
                user_input.user_name.lower().strip()
            )
            name_match = name_similarity >= 0.7
            if name_match:
                matched_fields += 1
            details['name_match'] = name_match
            details['name_similarity'] = round(name_similarity, 2)
            score += name_similarity * 25
        
        # Match DOB
        if ocr_result.dob and user_input.user_dob:
            total_fields += 1
            # Normalize date formats
            ocr_dob = self._normalize_date(ocr_result.dob)
            user_dob = self._normalize_date(user_input.user_dob)
            
            if ocr_dob == user_dob:
                matched_fields += 1
                details['dob_match'] = True
                score += 25
            else:
                details['dob_match'] = False
                similarity = self._string_similarity(ocr_dob, user_dob)
                score += similarity * 25
        
        # Match expiry date (optional)
        if ocr_result.expiry_date and user_input.user_expiry:
            total_fields += 1
            ocr_expiry = self._normalize_date(ocr_result.expiry_date)
            user_expiry = self._normalize_date(user_input.user_expiry)
            
            if ocr_expiry == user_expiry:
                matched_fields += 1
                details['expiry_match'] = True
                score += 25
            else:
                details['expiry_match'] = False
                similarity = self._string_similarity(ocr_expiry, user_expiry)
                score += similarity * 25
        
        # Normalize score to 0-100
        if total_fields > 0:
            normalized_score = (score / (total_fields * 25)) * 100
        else:
            normalized_score = 0
        
        return TextMatchResult(
            match_score=round(normalized_score, 2),
            name_match=details.get('name_match', False),
            cnic_match=details.get('cnic_match', False),
            dob_match=details.get('dob_match', False),
            expiry_match=details.get('expiry_match', False),
            details=details
        )
    
    def _create_verification_score(self, name: str, score: float, 
                                   weight: float, passed: bool) -> VerificationScore:
        """Create a VerificationScore object."""
        weighted_score = score * weight

        # `passed` can be numpy.bool_ from model outputs; cast to native bool
        # so Pydantic can serialize the response.
        passed_bool = bool(passed)

        if passed_bool:
            status = "pass"
        elif score >= 50:
            status = "warning"
        else:
            status = "fail"
        
        return VerificationScore(
            name=name,
            score=round(score, 2),
            weight=weight,
            weighted_score=round(weighted_score, 2),
            status=status
        )
    
    def _determine_decision(self, final_score: float) -> str:
        """Determine final decision based on score."""
        if final_score >= self.thresholds['genuine']:
            return "GENUINE"
        elif final_score >= self.thresholds['suspicious']:
            return "SUSPICIOUS"
        else:
            return "FAKE"
    
    def _string_similarity(self, s1: str, s2: str) -> float:
        """Calculate similarity between two strings (0-1)."""
        if not s1 or not s2:
            return 0.0
        
        # Use Levenshtein-like approach
        len1, len2 = len(s1), len(s2)
        if len1 == 0 and len2 == 0:
            return 1.0
        
        # Create distance matrix
        matrix = [[0] * (len2 + 1) for _ in range(len1 + 1)]
        
        for i in range(len1 + 1):
            matrix[i][0] = i
        for j in range(len2 + 1):
            matrix[0][j] = j
        
        for i in range(1, len1 + 1):
            for j in range(1, len2 + 1):
                if s1[i-1] == s2[j-1]:
                    matrix[i][j] = matrix[i-1][j-1]
                else:
                    matrix[i][j] = min(
                        matrix[i-1][j] + 1,      # deletion
                        matrix[i][j-1] + 1,      # insertion
                        matrix[i-1][j-1] + 1     # substitution
                    )
        
        distance = matrix[len1][len2]
        max_len = max(len1, len2)
        
        return 1.0 - (distance / max_len) if max_len > 0 else 0.0
    
    def _normalize_date(self, date_str: str) -> str:
        """Normalize date string to DD/MM/YYYY format."""
        if not date_str:
            return ""
        
        # Remove any existing separators and extract numbers
        cleaned = ''.join(c for c in date_str if c.isdigit())
        
        if len(cleaned) == 8:
            return f"{cleaned[:2]}/{cleaned[2:4]}/{cleaned[4:]}"
        elif len(cleaned) == 6:
            # Assume 2-digit year
            return f"{cleaned[:2]}/{cleaned[2:4]}/19{cleaned[4:]}"
        
        return date_str
    
    def get_detailed_report(self, result: VerificationResult) -> Dict[str, Any]:
        """
        Generate a detailed verification report.
        """
        return {
            "verification_id": result.verification_id,
            "timestamp": result.timestamp.isoformat(),
            "final_decision": result.final_decision,
            "final_score": result.final_score,
            "thresholds": {
                "genuine": self.thresholds['genuine'],
                "suspicious": self.thresholds['suspicious'],
                "fake": self.thresholds['suspicious']
            },
            "score_breakdown": {
                "text_match": {
                    "score": result.text_match_score.score,
                    "weight": result.text_match_score.weight,
                    "weighted_score": result.text_match_score.weighted_score,
                    "status": result.text_match_score.status
                },
                "face_match": {
                    "score": result.face_match_score.score,
                    "weight": result.face_match_score.weight,
                    "weighted_score": result.face_match_score.weighted_score,
                    "status": result.face_match_score.status
                },
                "layout": {
                    "score": result.layout_score.score,
                    "weight": result.layout_score.weight,
                    "weighted_score": result.layout_score.weighted_score,
                    "status": result.layout_score.status
                },
                "chip": {
                    "score": result.chip_score.score,
                    "weight": result.chip_score.weight,
                    "weighted_score": result.chip_score.weighted_score,
                    "status": result.chip_score.status
                },
                "tampering": {
                    "score": result.tampering_score.score,
                    "weight": result.tampering_score.weight,
                    "weighted_score": result.tampering_score.weighted_score,
                    "status": result.tampering_score.status
                },
                "ocr_confidence": {
                    "score": result.ocr_confidence_score.score,
                    "weight": result.ocr_confidence_score.weight,
                    "weighted_score": result.ocr_confidence_score.weighted_score,
                    "status": result.ocr_confidence_score.status
                }
            },
            "recommendations": self._generate_recommendations(result)
        }
    
    def _generate_recommendations(self, result: VerificationResult) -> list:
        """Generate recommendations based on verification results."""
        recommendations = []
        
        if result.final_decision == "GENUINE":
            recommendations.append("Document appears genuine. Proceed with verification.")
        elif result.final_decision == "SUSPICIOUS":
            recommendations.append("Document shows some suspicious characteristics. Manual review recommended.")
        else:
            recommendations.append("Document appears to be fake or tampered. Reject verification.")
        
        # Add specific recommendations based on individual scores
        if result.text_match_score.status == "fail":
            recommendations.append("Text data mismatch detected. Verify user-provided information.")
        
        if result.face_match_score.status == "fail":
            recommendations.append("Face mismatch detected. Request new selfie or verify identity.")
        
        if result.tampering_score.status == "fail":
            recommendations.append("Signs of image tampering detected. Request original document.")
        
        if result.chip_score.status == "fail":
            recommendations.append("Chip not detected or invalid. Verify document authenticity.")
        
        return recommendations
