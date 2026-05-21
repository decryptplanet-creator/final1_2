# CNIC Forensic Verification System - Backend

AI-powered CNIC verification system with OCR, face matching, and tampering detection.

## Features

- **OCR Text Extraction**: Extract name, CNIC number, DOB, and expiry date from CNIC images
- **Layout Verification**: Verify CNIC structure, photo position, and text alignment
- **Chip Detection**: Detect security chip presence and position
- **Tampering Detection**: Error Level Analysis, noise consistency, blur detection
- **Face Comparison**: Compare CNIC photo with user selfie using DeepFace
- **Scoring Engine**: Weighted scoring system with final decision (GENUINE/SUSPICIOUS/FAKE)
- **Firebase Integration**: Store verification results and images

## Setup Instructions

### Prerequisites

1. Python 3.9 or higher
2. Google Cloud account with Vision API enabled
3. Firebase project with Storage and Firestore enabled

### Installation

1. **Create virtual environment:**
   ```bash
   cd backend
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   
   Copy `.env.example` to `.env` and configure:
   
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   
   - **Google Cloud Vision API:**
     - Download service account key from Google Cloud Console
     - Set `GOOGLE_APPLICATION_CREDENTIALS` to the path of your service account JSON file
     - Set `GOOGLE_CLOUD_PROJECT_ID` to your project ID
   
   - **Firebase:**
     - Download Firebase Admin SDK service account key
     - Set `FIREBASE_CREDENTIALS` to the path of your Firebase Admin SDK JSON file
     - Set `FIREBASE_STORAGE_BUCKET` to your Firebase storage bucket (e.g., `your-project.appspot.com`)

4. **Run the server:**
   ```bash
   python main.py
   ```
   
   Or with uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

5. **Access the API:**
   - API Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/health

## API Endpoints

### Main Verification
- `POST /api/verify` - Complete CNIC verification

### Individual Services
- `POST /api/ocr` - Extract text from CNIC
- `POST /api/face-compare` - Compare two faces
- `POST /api/detect-tampering` - Detect image tampering
- `POST /api/verify-layout` - Verify CNIC layout
- `POST /api/detect-chip` - Detect security chip

### Data Retrieval
- `GET /api/verification/{id}` - Get verification result
- `GET /api/user/{user_id}/verifications` - Get user's verification history
- `GET /api/statistics` - Get verification statistics

## Request Format

### Complete Verification
```bash
curl -X POST http://localhost:8000/api/verify \
  -F "cnic_front=@cnic_front.jpg" \
  -F "cnic_back=@cnic_back.jpg" \
  -F "selfie=@selfie.jpg" \
  -F "user_name=John Doe" \
  -F "user_cnic=1234512345678" \
  -F "user_dob=1990-01-01" \
  -F "user_expiry=2030-01-01" \
  -F "user_id=user123"
```

## Response Format

```json
{
  "success": true,
  "message": "Verification completed. Result: GENUINE",
  "result": {
    "verification_id": "uuid",
    "timestamp": "2024-01-01T12:00:00",
    "final_score": 85.5,
    "final_decision": "GENUINE",
    "text_match_score": { "score": 90, "weight": 0.2, "status": "pass" },
    "face_match_score": { "score": 88, "weight": 0.3, "status": "pass" },
    "layout_score": { "score": 80, "weight": 0.15, "status": "pass" },
    "chip_score": { "score": 75, "weight": 0.1, "status": "pass" },
    "tampering_score": { "score": 90, "weight": 0.15, "status": "pass" },
    "ocr_confidence_score": { "score": 85, "weight": 0.1, "status": "pass" }
  }
}
```

## Scoring System

| Component | Weight | Description |
|-----------|--------|-------------|
| Text Match | 20% | OCR vs User Input |
| Face Match | 30% | CNIC Photo vs Selfie |
| Layout | 15% | CNIC Structure Verification |
| Chip | 10% | Security Chip Detection |
| Tampering | 15% | Image Manipulation Detection |
| OCR Confidence | 10% | Text Extraction Confidence |

### Decision Thresholds
- **GENUINE**: Score ≥ 80
- **SUSPICIOUS**: Score 70-79
- **FAKE**: Score < 70

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Cloud Storage
4. Generate Admin SDK service account key:
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /verifications/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /verifications/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Google Cloud Vision API Setup

1. Create a Google Cloud project
2. Enable Cloud Vision API
3. Create service account with Vision API access
4. Download service account key JSON
5. Set `GOOGLE_APPLICATION_CREDENTIALS` environment variable

## Troubleshooting

### Common Issues

1. **"Module not found" errors:**
   - Ensure virtual environment is activated
   - Run `pip install -r requirements.txt` again

2. **Firebase initialization failed:**
   - Check `FIREBASE_CREDENTIALS` path is correct
   - Ensure Firebase Admin SDK JSON is valid

3. **Google Vision API errors:**
   - Verify `GOOGLE_APPLICATION_CREDENTIALS` is set
   - Check Vision API is enabled in Google Cloud Console

4. **CORS errors:**
   - Add your frontend URL to `CORS_ORIGINS` in `.env`

## Mobile View Support

The frontend is fully responsive and works on mobile devices. The same codebase supports both web and mobile views through responsive Tailwind CSS design.

## License

Proprietary - All rights reserved