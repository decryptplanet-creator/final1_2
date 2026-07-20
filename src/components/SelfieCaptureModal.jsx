import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Camera, X, Upload, AlertCircle, Loader2, CheckCircle, XCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_CNIC_API_URL || 'http://localhost:8000';

export function SelfieCaptureModal({ onCapture, onClose, cnicUploaded, autoVerify = false, onVerified }) {
  const [cameraError, setCameraError] = useState(null);
  const [stream, setStream] = useState(null);

  const [capturedImage, setCapturedImage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationDetails, setVerificationDetails] = useState(null);
  const [apiError, setApiError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  // ─── Camera Functions ────────────────────────────────────────────────────────

  const stopCamera = () => {
    console.log('[SelfieCaptureModal] stopCamera called');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setStream(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async (retries = 3) => {
    console.log('[SelfieCaptureModal] startCamera called');
    setCameraError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('Camera is not supported in this browser.');
        return;
      }

      console.log('[SelfieCaptureModal] Requesting getUserMedia...');

      const mediaStream = await Promise.race([
        navigator.mediaDevices.getUserMedia({ video: true, audio: false }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new DOMException('Timeout', 'AbortError')), 5000)
        ),
      ]);
      console.log('[SelfieCaptureModal] getUserMedia SUCCESS, tracks:', mediaStream.getTracks().length);

      streamRef.current = mediaStream;
      setStream(mediaStream);

      // Attach immediately — don't rely solely on useEffect
      if (videoRef.current) {
        console.log('[SelfieCaptureModal] Attaching srcObject immediately after getUserMedia');
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch((err) => {
          console.error('[SelfieCaptureModal] play() error:', err);
        });
      } else {
        console.warn('[SelfieCaptureModal] videoRef.current is null — useEffect will attach when component re-renders');
      }
    } catch (e) {
      console.error('[SelfieCaptureModal] getUserMedia error:', e.name, e.message);
      if (e.name === 'NotAllowedError') {
        setCameraError('Camera permission denied. Please allow access in browser settings.');
      } else if (e.name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else if (e.name === 'AbortError') {
        if (retries > 1) {
          console.warn('[SelfieCaptureModal] AbortError, retrying...', retries - 1, 'left');
          setTimeout(() => startCamera(retries - 1), 800);
          return;
        }
        setCameraError('Camera is busy or unavailable. Close other apps using the camera, then try again.');
      } else {
        setCameraError('Camera access denied or not found.');
      }
    }
  };

  // Fallback: attach stream to video element after re-render
  useEffect(() => {
    if (stream && videoRef.current && !videoRef.current.srcObject) {
      console.log('[SelfieCaptureModal] useEffect[stream]: attaching srcObject (fallback path)');
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => {
        console.error('[SelfieCaptureModal] useEffect play() error:', err);
      });
    }
  }, [stream]);

  const captureSelfie = () => {
    console.log('[SelfieCaptureModal] captureSelfie called');
    if (!videoRef.current || !canvasRef.current) {
      console.error('[SelfieCaptureModal] videoRef or canvasRef is null');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    console.log('[SelfieCaptureModal] Video dimensions:', video.videoWidth, 'x', video.videoHeight);
    if (!video.videoWidth || !video.videoHeight) {
      setCameraError('Camera is still loading. Please wait and try again.');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) {
      console.error('[SelfieCaptureModal] Failed to get 2d context');
      return;
    }

    context.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.95);
    console.log('[SelfieCaptureModal] Captured image, base64 length:', imageData.length);

    stopCamera();

    if (autoVerify && cnicUploaded) {
      console.log('[SelfieCaptureModal] autoVerify=true, cnicUploaded present — calling verifyWithAPI');
      setCapturedImage(imageData);
      // Use setTimeout to let setCapturedImage re-render before starting verification
      setTimeout(() => verifyWithAPI(imageData), 0);
    } else {
      console.log('[SelfieCaptureModal] Calling onCapture callback');
      onCapture(imageData);
    }
  };

  // ─── File Upload ─────────────────────────────────────────────────────────────

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    console.log('[SelfieCaptureModal] File selected:', file?.name, file?.size);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result;
        console.log('[SelfieCaptureModal] File read complete, base64 length:', imageData?.length);
        if (autoVerify && cnicUploaded) {
          setCapturedImage(imageData);
          setTimeout(() => verifyWithAPI(imageData), 0);
        } else {
          onCapture(imageData);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // ─── FastAPI Verification ────────────────────────────────────────────────────

  const verifyWithAPI = async (selfieBase64) => {
    console.log('[SelfieCaptureModal] verifyWithAPI called');
    console.log('[SelfieCaptureModal] cnic_front length:', cnicUploaded?.length, '| selfie length:', selfieBase64?.length);

    setIsVerifying(true);
    setApiError(null);

    try {
      const payload = {
        cnic_front: cnicUploaded,
        cnic_back: null,
        selfie: selfieBase64,
        user_id: null,
      };
      console.log('[SelfieCaptureModal] POST', `${API_BASE_URL}/api/verify`);

      const response = await fetch(`${API_BASE_URL}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('[SelfieCaptureModal] Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error('[SelfieCaptureModal] API error:', errData);
        throw new Error(errData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('[SelfieCaptureModal] API response:', {
        success: data.success,
        message: data.message,
        final_decision: data.result?.final_decision,
        face_match_score: data.result?.face_match_score,
      });

      if (!data.success) {
        throw new Error(data.message || 'Verification failed');
      }

      const result = data.result;
      const faceScore = result?.face_match_score;
      const finalDecision = result?.final_decision;

      const isMatched =
        finalDecision === 'VERIFIED' ||
        (faceScore?.score !== undefined && faceScore.score > 0.5);

      console.log('[SelfieCaptureModal] isMatched:', isMatched, '| faceScore:', faceScore?.score);

      setVerificationResult(isMatched ? 'matched' : 'notmatched');
      setVerificationDetails({
        finalDecision,
        faceScore: faceScore?.score,
        finalScore: result?.final_score,
      });

      if (onVerified) onVerified(isMatched, result);

    } catch (err) {
      console.error('[SelfieCaptureModal] Verification error:', err);
      setApiError(err.message || 'Server connection failed. Make sure FastAPI is running on port 8000.');
      setVerificationResult('notmatched');
    } finally {
      setIsVerifying(false);
    }
  };

  // ─── Retake ──────────────────────────────────────────────────────────────────

  const handleRetake = () => {
    console.log('[SelfieCaptureModal] handleRetake called');
    setCapturedImage(null);
    setVerificationResult(null);
    setVerificationDetails(null);
    setApiError(null);
    setCameraError(null);
    startCamera();
  };

  const handleClose = () => {
    console.log('[SelfieCaptureModal] handleClose called');
    stopCamera();
    onClose();
  };

  // ─── Cleanup ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      console.log('[SelfieCaptureModal] Unmounting, stopping camera');
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="max-w-lg w-full bg-white border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#1F2933] flex items-center gap-2">
              <Camera className="size-5" />
              {verificationResult ? 'Verification Result' : 'Capture Selfie'}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={handleClose} className="text-gray-400 hover:text-[#1F2933]">
              <X className="size-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">

          {cameraError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="size-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-700 font-medium text-sm">Camera Access Issue</p>
                  <p className="text-sm text-gray-600 mt-1">{cameraError}</p>
                </div>
              </div>
            </div>
          )}

          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="size-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{apiError}</p>
              </div>
            </div>
          )}

          {/* ── Verifying Loader ── */}
          {isVerifying && capturedImage && (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <img src={capturedImage} alt="Captured selfie" className="w-full" />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="size-8 text-white animate-spin" />
                  <p className="text-white text-sm font-medium">AI Face Matching...</p>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-500 h-1.5 rounded-full animate-pulse w-2/3" />
              </div>
              <p className="text-xs text-gray-400 text-center">
                ArcFace (DeepFace) comparison running...
              </p>
            </div>
          )}

          {/* ── Verification Result ── */}
          {!isVerifying && verificationResult && capturedImage && (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <img src={capturedImage} alt="Captured selfie" className="w-full" />
              </div>

              {verificationResult === 'matched' ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="size-6 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="text-green-700 font-semibold">Verification Successful!</p>
                      <p className="text-sm text-gray-500">Your selfie matches with CNIC photo.</p>
                    </div>
                  </div>
                  {verificationDetails && (
                    <div className="mt-3 pt-3 border-t border-green-100 space-y-1">
                      {verificationDetails.faceScore !== undefined && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Face Score</span>
                          <span className="text-green-600 font-medium">{(verificationDetails.faceScore * 100).toFixed(1)}%</span>
                        </div>
                      )}
                      {verificationDetails.finalScore !== undefined && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Overall Score</span>
                          <span className="text-green-600 font-medium">{(verificationDetails.finalScore * 100).toFixed(1)}%</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <XCircle className="size-6 text-red-500 flex-shrink-0" />
                    <div>
                      <p className="text-red-700 font-semibold">Verification Failed</p>
                      <p className="text-sm text-gray-500">Selfie does not match with CNIC photo.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button onClick={handleRetake} variant="outline" className="flex-1 border-gray-300 text-[#1F2933]">
                  Try Again
                </Button>
                <Button onClick={handleClose} className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white">
                  Close
                </Button>
              </div>
            </div>
          )}

          {/* ── Camera / Upload UI ── */}
          {!isVerifying && !verificationResult && (
            <>
              {!stream ? (
                <div className="space-y-4">
                  <Button onClick={startCamera} className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white">
                    <Camera className="size-4 mr-2" />
                    Start Camera
                  </Button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Or</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full border-gray-300 text-[#1F2933] hover:bg-gray-50"
                  >
                    <Upload className="size-4 mr-2" />
                    Upload Photo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <p className="text-xs text-gray-400 text-center">
                    Your selfie will be verified against your CNIC using AI
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-36 h-44 border-2 border-dashed border-blue-400/70 rounded-full" />
                    </div>
                    <p className="absolute bottom-3 left-0 right-0 text-center text-xs text-gray-300">
                      Align your face inside the oval
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={stopCamera} variant="outline" className="flex-1 border-gray-300 text-[#1F2933]">
                      Cancel
                    </Button>
                    <Button onClick={captureSelfie} className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white">
                      <Camera className="size-4 mr-2" />
                      Capture Photo
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    </div>
  );
}
