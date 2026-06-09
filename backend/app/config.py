import os
from pydantic import field_validator
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Google Cloud Vision API
    google_application_credentials: str = ""
    google_cloud_project_id: str = ""
    
    # Firebase Admin SDK
    firebase_credentials: str = ""
    firebase_storage_bucket: str = ""
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True
    
    # CORS Origins
    cors_origins: str = "http://localhost:5173,http://localhost:3000"
    
    # Verification Thresholds
    face_match_threshold: float = 0.5
    text_match_threshold: float = 0.7
    tampering_threshold: float = 0.5
    genuine_score_threshold: float = 65.0  # was 80 — too strict
    suspicious_score_threshold: float = 45.0 # was 70 — too strict

    # Scoring Weights (must sum to 1.0)
    text_match_weight: float = 0.30    # was 0.20
    face_match_weight: float = 0.35    # was 0.30
    layout_weight: float = 0.10        # was 0.15
    chip_weight: float = 0.00          # was 0.10 — disabled (unreliable)
    tampering_weight: float = 0.15     # same
    ocr_confidence_weight: float = 0.10 # same

    @field_validator("debug", mode="before")
    @classmethod
    def parse_debug_mode(cls, value):
        if isinstance(value, str):
            normalized = value.strip().lower()
            if normalized in {"release", "production", "prod", "false", "0", "no", "off"}:
                return False
            if normalized in {"debug", "development", "dev", "true", "1", "yes", "on"}:
                return True
        return value
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]


settings = Settings()

if settings.google_application_credentials:
    credentials_path = settings.google_application_credentials
    if not os.path.isabs(credentials_path):
        backend_dir = os.path.dirname(os.path.dirname(__file__))
        credentials_path = os.path.join(backend_dir, credentials_path)
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_path

if settings.google_cloud_project_id:
    os.environ["GOOGLE_CLOUD_PROJECT"] = settings.google_cloud_project_id