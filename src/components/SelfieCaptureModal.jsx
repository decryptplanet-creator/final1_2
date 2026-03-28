import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Camera, X, Upload, AlertCircle } from 'lucide-react';

export function SelfieCaptureModal({ onCapture, onClose }) {
  const [hasCamera, setHasCamera] = useState(true);
  const [cameraError, setCameraError] = useState(null);
  const [stream, setStream] = useState(null);
  const [showUploadPrompt, setShowUploadPrompt] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setCameraError(null);
        setHasCamera(true);
        setShowUploadPrompt(false);
      }
    } catch (error) {
      // Silently handle camera errors - this is expected behavior
      setHasCamera(false);
      setShowUploadPrompt(true);
      
      if (error.name === 'NotAllowedError') {
        setCameraError('Camera permission denied. Please upload your selfie using the button below.');
      } else if (error.name === 'NotFoundError') {
        setCameraError('No camera detected. Please upload your selfie using the button below.');
      } else if (error.name === 'NotReadableError') {
        setCameraError('Camera is busy. Please upload your selfie using the button below.');
      } else {
        setCameraError('Cannot access camera. Please upload your selfie using the button below.');
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/png');
        stopCamera();
        onCapture(imageData);
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result;
        onCapture(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="max-w-lg w-full bg-white border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#1F2933] flex items-center gap-2">
              <Camera className="size-5" />
              Capture Selfie
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose}
              className="text-gray-400 hover:text-[#1F2933]"
            >
              <X className="size-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {cameraError && (
            <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="size-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-600 font-medium">Camera Access Issue</p>
                  <p className="text-sm text-gray-600 mt-1">{cameraError}</p>
                </div>
              </div>
            </div>
          )}

          {!stream ? (
            <div className="space-y-4">
              {/* Show camera button only if no error */}
              {!cameraError && (
                <>
                  <Button 
                    onClick={startCamera}
                    className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                  >
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
                </>
              )}

              {/* Upload button - prominent when camera fails */}
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className={cameraError 
                  ? "w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white" 
                  : "w-full border-gray-300 text-[#1F2933] hover:bg-gray-50"
                }
                variant={cameraError ? "default" : "outline"}
              >
                <Upload className="size-4 mr-2" />
                {cameraError ? 'Choose Photo to Upload' : 'Upload Photo'}
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />

              {/* Show retry camera button if there was an error */}
              {cameraError && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Or try again</span>
                    </div>
                  </div>

                  <Button 
                    onClick={startCamera}
                    variant="outline"
                    className="w-full border-gray-300 text-[#1F2933] hover:bg-gray-50"
                  >
                    <Camera className="size-4 mr-2" />
                    Retry Camera Access
                  </Button>
                </>
              )}

              <p className="text-xs text-gray-500 text-center">
                Your selfie will be used to verify your identity
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
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={stopCamera}
                  variant="outline"
                  className="flex-1 border-gray-300 text-[#1F2933]"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={captureSelfie}
                  className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                >
                  <Camera className="size-4 mr-2" />
                  Capture Photo
                </Button>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    </div>
  );
}
/*Purpose: This file creates a selfie capture modal using camera or file upload for identity verification.
Platform: Web-based (uses browser camera APIs), mainly for web but can be adapted for app. */