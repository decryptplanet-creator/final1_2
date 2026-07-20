import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Camera, CheckCircle, XCircle, Upload, Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_CNIC_API_URL || 'http://localhost:8000';

export function SelfieCapture({ onVerified, cnicUploaded }) {
  const [selfieImage, setSelfieImage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState('pending');
  const [verificationDetails, setVerificationDetails] = useState(null);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [apiError, setApiError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  // ─── Camera Functions ───────────────────────────────────────────────────────

  const stopCamera = () => {
    console.log('[SelfieCapture] stopCamera called');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setStream(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async () => {
    console.log('[SelfieCapture] startCamera called');
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('[SelfieCapture] getUserMedia not supported');
        setCameraError('Camera is not supported in this browser.');
        return;
      }

      console.log('[SelfieCapture] Requesting getUserMedia...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      console.log('[SelfieCapture] getUserMedia SUCCESS, tracks:', mediaStream.getTracks().length);

      streamRef.current = mediaStream;
      setStream(mediaStream);

      // Attach directly — don't wait for useEffect re-render
      if (videoRef.current) {
        console.log('[SelfieCapture] videoRef available, attaching srcObject immediately');
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          console.log('[SelfieCapture] Video metadata loaded, calling play()');
          videoRef.current.play().catch((err) => {
            console.error('[SelfieCapture] Video play() error:', err);
            setCameraError('Could not start video preview. Please try again.');
          });
        };
      } else {
        console.warn('[SelfieCapture] videoRef.current is null after getUserMedia — stream saved to state for useEffect fallback');
      }
    } catch (error) {
      console.error('[SelfieCapture] getUserMedia error:', error.name, error.message);
      if (error.name === 'NotAllowedError') {
        setCameraError('Camera permission denied. Please allow camera access from browser settings.');
      } else if (error.name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else if (error.name === 'NotReadableError') {
        setCameraError('Camera is busy. Close Zoom/Meet or other camera apps and try again.');
      } else {
        setCameraError(`Camera error: ${error.message}`);
      }
    }
  };

  // Fallback: attach stream to video when both are available
  useEffect(() => {
    if (stream && videoRef.current && !videoRef.current.srcObject) {
      console.log('[SelfieCapture] useEffect[stream]: attaching srcObject (fallback)');
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => {
        console.error('[SelfieCapture] useEffect play() error:', err);
      });
    }
  }, [stream]);

  const captureSelfie = () => {
    console.log('[SelfieCapture] captureSelfie called');
    if (!videoRef.current || !canvasRef.current) {
      console.error('[SelfieCapture] videoRef or canvasRef is null');
      setCameraError('Camera preview not ready. Please try again.');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    console.log('[SelfieCapture] Video dimensions:', video.videoWidth, 'x', video.videoHeight);
    if (!video.videoWidth || !video.videoHeight) {
      setCameraError('Camera is still loading. Please wait and try again.');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) {
      console.error('[SelfieCapture] Failed to get 2d context from canvas');
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg', 0.95);
    console.log('[SelfieCapture] Captured image, base64 length:', imageData.length);

    setSelfieImage(imageData);
    stopCamera();
  };

  // ─── File Upload ─────────────────────────────────────────────────────────────

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    console.log('[SelfieCapture] File upload selected:', file?.name, file?.size);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        console.log('[SelfieCapture] File read complete, base64 length:', result?.length);
        setSelfieImage(result);
        setVerificationResult('pending');
        setVerificationDetails(null);
        setApiError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // ─── FastAPI Verification ────────────────────────────────────────────────────

  const verifySelfie = async () => {
    console.log('[SelfieCapture] verifySelfie called');
    if (!cnicUploaded) {
      console.warn('[SelfieCapture] cnicUploaded is falsy, aborting');
      setApiError('Please upload CNIC first before verifying selfie.');
      return;
    }
    if (!selfieImage) {
      console.warn('[SelfieCapture] selfieImage is null, aborting');
      setApiError('Please capture or upload a selfie first.');
      return;
    }

    console.log('[SelfieCapture] Sending request to', `${API_BASE_URL}/api/verify`);
    console.log('[SelfieCapture] cnic_front length:', cnicUploaded?.length, '| selfie length:', selfieImage?.length);

    setIsVerifying(true);
    setApiError(null);

    try {
      const payload = {
        cnic_front: cnicUploaded,
        cnic_back: null,
        selfie: selfieImage,
        user_id: null,
      };
      console.log('[SelfieCapture] Request payload keys:', Object.keys(payload));

      const response = await fetch(`${API_BASE_URL}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('[SelfieCapture] Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error('[SelfieCapture] API error response:', errData);
        throw new Error(errData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('[SelfieCapture] API response:', {
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

      console.log('[SelfieCapture] Face score:', faceScore, '| Final decision:', finalDecision);

      const isMatched =
        finalDecision === 'VERIFIED' ||
        (faceScore?.score !== undefined && faceScore.score > 0.5);

      console.log('[SelfieCapture] isMatched:', isMatched);

      setVerificationResult(isMatched ? 'matched' : 'notmatched');
      setVerificationDetails({
        finalDecision,
        faceScore: faceScore?.score,
        confidence: faceScore?.confidence,
        finalScore: result?.final_score,
      });

      if (onVerified) onVerified(isMatched, result);

    } catch (err) {
      console.error('[SelfieCapture] Verification error:', err);
      setApiError(err.message || 'Could not connect to server. Make sure FastAPI is running on port 8000.');
      setVerificationResult('notmatched');
    } finally {
      setIsVerifying(false);
    }
  };

  // ─── Retake ──────────────────────────────────────────────────────────────────

  const retakeSelfie = () => {
    console.log('[SelfieCapture] retakeSelfie called');
    setSelfieImage(null);
    setVerificationResult('pending');
    setVerificationDetails(null);
    setApiError(null);
    setCameraError(null);
    startCamera();
  };

  // ─── Cleanup ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      console.log('[SelfieCapture] Unmounting, stopping camera');
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Camera className="size-5" />
          Selfie Verification
        </CardTitle>
        <CardDescription className="text-gray-400">
          Capture your selfie to match with CNIC using AI face recognition
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">

        {!cnicUploaded && (
          <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-3 flex items-center gap-2">
            <AlertTriangle className="size-4 text-yellow-400 flex-shrink-0" />
            <p className="text-sm text-yellow-400">
              Please upload your CNIC first before selfie verification.
            </p>
          </div>
        )}

        {cameraError && (
          <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-3">
            <p className="text-sm text-yellow-400">{cameraError}</p>
          </div>
        )}

        {apiError && (
          <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-3">
            <p className="text-sm text-red-400">{apiError}</p>
          </div>
        )}

        {!selfieImage ? (
          <>
            {!stream ? (
              <div className="space-y-4">
                <Button onClick={startCamera} className="w-full bg-red-600 hover:bg-red-700">
                  <Camera className="size-4 mr-2" />
                  Start Camera
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-900 px-2 text-gray-400">Or</span>
                  </div>
                </div>

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full bg-gray-800 border-gray-700 text-gray-300"
                >
                  <Upload className="size-4 mr-2" />
                  Upload Selfie
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden bg-black border border-gray-700">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-80 bg-black object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-40 h-48 border-2 border-dashed border-red-400/60 rounded-full opacity-70" />
                  </div>
                  <p className="absolute bottom-3 left-0 right-0 text-center text-xs text-gray-300">
                    Align your face inside the oval
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={stopCamera} variant="outline" className="flex-1 bg-gray-800 border-gray-700 text-gray-300">
                    Cancel
                  </Button>
                  <Button onClick={captureSelfie} className="flex-1 bg-red-600 hover:bg-red-700">
                    <Camera className="size-4 mr-2" />
                    Capture Photo
                  </Button>
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border border-gray-700">
              <img src={selfieImage} alt="Captured selfie" className="w-full" />
            </div>

            {verificationResult === 'pending' && (
              <div className="flex gap-2">
                <Button
                  onClick={retakeSelfie}
                  variant="outline"
                  className="flex-1 bg-gray-800 border-gray-700 text-gray-300"
                  disabled={isVerifying}
                >
                  Retake
                </Button>
                <Button
                  onClick={verifySelfie}
                  disabled={isVerifying || !cnicUploaded}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  {isVerifying ? (
                    <><Loader2 className="size-4 mr-2 animate-spin" />Verifying...</>
                  ) : (
                    <><ShieldCheck className="size-4 mr-2" />Verify Selfie</>
                  )}
                </Button>
              </div>
            )}

            {isVerifying && (
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-2">AI face matching in progress...</p>
                <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-red-500 h-1.5 rounded-full animate-pulse w-3/4" />
                </div>
              </div>
            )}

            {verificationResult === 'matched' && (
              <div className="space-y-3">
                <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="size-5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="text-green-400 font-semibold">Verification Successful!</p>
                      <p className="text-sm text-gray-400">Your selfie matches with CNIC photo.</p>
                    </div>
                  </div>
                </div>
                {verificationDetails && (
                  <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-3 space-y-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Match Details</p>
                    {verificationDetails.faceScore !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Face Score</span>
                        <span className="text-green-400 font-medium">{(verificationDetails.faceScore * 100).toFixed(1)}%</span>
                      </div>
                    )}
                    {verificationDetails.finalScore !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Overall Score</span>
                        <span className="text-green-400 font-medium">{(verificationDetails.finalScore * 100).toFixed(1)}%</span>
                      </div>
                    )}
                    {verificationDetails.finalDecision && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Decision</span>
                        <span className="text-green-400 font-medium">{verificationDetails.finalDecision}</span>
                      </div>
                    )}
                  </div>
                )}
                <Button onClick={retakeSelfie} variant="outline" className="w-full bg-gray-800 border-gray-700 text-gray-300">
                  Retake Selfie
                </Button>
              </div>
            )}

            {verificationResult === 'notmatched' && (
              <div className="space-y-3">
                <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="size-5 text-red-500 flex-shrink-0" />
                    <div>
                      <p className="text-red-400 font-semibold">Verification Failed</p>
                      <p className="text-sm text-gray-400">Selfie does not match with CNIC photo.</p>
                    </div>
                  </div>
                </div>
                {verificationDetails && (
                  <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-3 space-y-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Match Details</p>
                    {verificationDetails.faceScore !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Face Score</span>
                        <span className="text-red-400 font-medium">{(verificationDetails.faceScore * 100).toFixed(1)}%</span>
                      </div>
                    )}
                    {verificationDetails.finalDecision && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Decision</span>
                        <span className="text-red-400 font-medium">{verificationDetails.finalDecision}</span>
                      </div>
                    )}
                  </div>
                )}
                <Button onClick={retakeSelfie} className="w-full bg-red-600 hover:bg-red-700">
                  Try Again
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
