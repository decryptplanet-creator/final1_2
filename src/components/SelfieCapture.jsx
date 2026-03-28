import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Camera, CheckCircle, XCircle, Upload } from 'lucide-react';
import { Badge } from './ui/badge';

export function SelfieCapture({ onVerified, cnicUploaded }) {
  const [selfieImage, setSelfieImage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState('pending');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stream, setStream] = useState(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Camera access is required for selfie verification');
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
        setSelfieImage(imageData);
        
        // Stop camera
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelfieImage(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const verifySelfie = () => {
    if (!cnicUploaded) {
      alert('Please upload CNIC first before verifying selfie');
      return;
    }

    setIsVerifying(true);
    
    // Simulate AI-based face matching (90% success rate for demo)
    setTimeout(() => {
      const isMatch = Math.random() > 0.1; // 90% success rate
      setVerificationResult(isMatch ? 'matched' : 'notmatched');
      setIsVerifying(false);
      onVerified(isMatch);
    }, 2000);
  };

  const retakeSelfie = () => {
    setSelfieImage(null);
    setVerificationResult('pending');
    startCamera();
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Camera className="size-5" />
          Selfie Verification
        </CardTitle>
        <CardDescription className="text-gray-400">
          Capture your selfie to match with CNIC
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selfieImage ? (
          <>
            {!stream ? (
              <div className="space-y-4">
                <Button 
                  onClick={startCamera}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
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
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full"
                  />
                </div>
                <Button 
                  onClick={captureSelfie}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <Camera className="size-4 mr-2" />
                  Capture Photo
                </Button>
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
                >
                  Retake
                </Button>
                <Button 
                  onClick={verifySelfie}
                  disabled={isVerifying}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {isVerifying ? 'Verifying...' : 'Verify Selfie'}
                </Button>
              </div>
            )}

            {verificationResult === 'matched' && (
              <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-5 text-green-600" />
                  <div>
                    <p className="text-green-400 font-semibold">Verification Successful!</p>
                    <p className="text-sm text-gray-400">Your selfie matches with CNIC</p>
                  </div>
                </div>
              </div>
            )}

            {verificationResult === 'notmatched' && (
              <div className="space-y-4">
                <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="size-5 text-red-600" />
                    <div>
                      <p className="text-red-400 font-semibold">Verification Failed</p>
                      <p className="text-sm text-gray-400">Selfie does not match with CNIC</p>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={retakeSelfie}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>
        )}

        {!cnicUploaded && (
          <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-3">
            <p className="text-sm text-yellow-400">
              Please upload your CNIC first before selfie verification
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
/*Purpose: This file handles selfie capture and verification by matching user selfie with CNIC (identity check).
Platform: Web-based (uses browser camera), mainly for web but can be adapted for app.*/





