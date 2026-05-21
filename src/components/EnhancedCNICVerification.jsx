import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Camera, Upload, CheckCircle, XCircle, AlertCircle, 
  Sparkles, User, CreditCard, Activity, Shield, 
  ChevronRight, RotateCcw, Download, Eye
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function EnhancedCNICVerification({ onVerificationComplete, onBack }) {
  const { isDarkMode } = useTheme();
  
  // State management
  const [step, setStep] = useState('input'); // input, uploading, processing, selfie, matching, results
  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    cnic: '',
    dob: '',
    expiry: ''
  });
  const [userId] = useState(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  // Processing state
  const [processingStage, setProcessingStage] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  
  // Results state
  const [verificationResult, setVerificationResult] = useState(null);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  
  // Webcam ref
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [webcamStream, setWebcamStream] = useState(null);
  const [facingMode, setFacingMode] = useState('user');

  // Cleanup webcam on unmount
  useEffect(() => {
    return () => {
      if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [webcamStream]);

  // File upload handlers
  const handleFileUpload = (file, type) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      if (type === 'cnicFront') setCnicFront(imageData);
      else if (type === 'cnicBack') setCnicBack(imageData);
      else if (type === 'selfie') setSelfieImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  // Webcam handlers
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setWebcamStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Webcam error:', err);
      setError('Could not access webcam. Please upload a photo instead.');
    }
  };

  const stopWebcam = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
      setWebcamStream(null);
    }
  };

  const captureSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      setSelfieImage(imageData);
      stopWebcam();
    }
  };

  // API call handlers
  const convertToBase64 = (dataUrl) => {
    return dataUrl.split(',')[1];
  };

  const processVerification = async () => {
    if (!cnicFront || !cnicBack || !selfieImage) {
      setError('Please upload all required images');
      return;
    }

    if (!userData.name || !userData.cnic || !userData.dob) {
      setError('Please fill in all required fields');
      return;
    }

    setStep('processing');
    setProgress(0);
    setError(null);

    const stages = [
      { name: 'Uploading images...', progress: 10 },
      { name: 'Extracting text from CNIC...', progress: 25 },
      { name: 'Verifying layout and structure...', progress: 40 },
      { name: 'Detecting security chip...', progress: 50 },
      { name: 'Analyzing for tampering...', progress: 65 },
      { name: 'Comparing faces...', progress: 80 },
      { name: 'Calculating final score...', progress: 95 },
      { name: 'Complete!', progress: 100 }
    ];

    try {
      // Simulate progress updates
      for (const stage of stages) {
        setProcessingStage(stage.name);
        setProgress(stage.progress);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      const payload = {
        cnic_front: convertToBase64(cnicFront),
        cnic_back: convertToBase64(cnicBack),
        selfie: convertToBase64(selfieImage),
        user_name: userData.name,
        user_cnic: userData.cnic,
        user_dob: userData.dob,
        user_expiry: userData.expiry || null,
        user_id: userId
      };

      // Call API
      const response = await fetch(`${API_BASE_URL}/api/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      const result = await response.json();
      
      if (result.success && result.result) {
        setVerificationResult(result.result);
        setStep('results');
        if (onVerificationComplete) {
          onVerificationComplete(result.result);
        }
      } else {
        throw new Error(result.message || 'Verification failed');
      }

    } catch (err) {
      console.error('Verification error:', err);
      setError(err.message || 'An error occurred during verification');
      setStep('input');
    }
  };

  // Get score status color
  const getScoreColor = (score, threshold = 60) => {
    if (score >= threshold + 20) return 'text-green-600';
    if (score >= threshold) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score, threshold = 60) => {
    if (score >= threshold + 20) return 'bg-green-500/10 border-green-500/20';
    if (score >= threshold) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass': return <CheckCircle className="size-5 text-green-600" />;
      case 'warning': return <AlertCircle className="size-5 text-yellow-600" />;
      case 'fail': return <XCircle className="size-5 text-red-600" />;
      default: return <Activity className="size-5 text-gray-600" />;
    }
  };

  const getDecisionColor = (decision) => {
    switch (decision) {
      case 'GENUINE': return 'bg-green-500 text-white';
      case 'SUSPICIOUS': return 'bg-yellow-500 text-black';
      case 'FAKE': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Render functions for different steps
  const renderInputStep = () => (
    <div className="space-y-6">
      {/* User Information Section */}
      <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
            <User className="size-5 text-[#2563EB]" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Full Name *</Label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={userData.name}
                onChange={(e) => setUserData({...userData, name: e.target.value})}
                className={isDarkMode ? 'bg-[#1F2933] border-gray-600 text-white' : ''}
              />
            </div>
            <div>
              <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>CNIC Number *</Label>
              <Input
                type="text"
                placeholder="XXXXX-XXXXXXX-X"
                value={userData.cnic}
                onChange={(e) => setUserData({...userData, cnic: e.target.value})}
                className={isDarkMode ? 'bg-[#1F2933] border-gray-600 text-white' : ''}
              />
            </div>
            <div>
              <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Date of Birth *</Label>
              <Input
                type="date"
                value={userData.dob}
                onChange={(e) => setUserData({...userData, dob: e.target.value})}
                className={isDarkMode ? 'bg-[#1F2933] border-gray-600 text-white' : ''}
              />
            </div>
            <div>
              <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Expiry Date</Label>
              <Input
                type="date"
                value={userData.expiry}
                onChange={(e) => setUserData({...userData, expiry: e.target.value})}
                className={isDarkMode ? 'bg-[#1F2933] border-gray-600 text-white' : ''}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CNIC Upload Section */}
      <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
            <CreditCard className="size-5 text-[#2563EB]" />
            CNIC Images
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CNIC Front */}
            <div>
              <Label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>CNIC Front *</Label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                cnicFront 
                  ? 'border-green-500 bg-green-500/10' 
                  : isDarkMode ? 'border-gray-700 bg-[#1F2933] hover:border-gray-500' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
              }`}>
                {cnicFront ? (
                  <div className="space-y-2">
                    <CheckCircle className="size-10 text-green-600 mx-auto" />
                    <p className="text-sm text-green-600 font-medium">Front image uploaded</p>
                    <img src={cnicFront} alt="CNIC Front" className="max-h-32 mx-auto rounded" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCnicFront(null)}
                      className="text-xs"
                    >
                      <XCircle className="size-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className={`size-10 mx-auto mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="cnic-front-upload"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], 'cnicFront')}
                    />
                    <Label htmlFor="cnic-front-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>Upload Front</span>
                      </Button>
                    </Label>
                  </>
                )}
              </div>
            </div>

            {/* CNIC Back */}
            <div>
              <Label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>CNIC Back *</Label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                cnicBack 
                  ? 'border-green-500 bg-green-500/10' 
                  : isDarkMode ? 'border-gray-700 bg-[#1F2933] hover:border-gray-500' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
              }`}>
                {cnicBack ? (
                  <div className="space-y-2">
                    <CheckCircle className="size-10 text-green-600 mx-auto" />
                    <p className="text-sm text-green-600 font-medium">Back image uploaded</p>
                    <img src={cnicBack} alt="CNIC Back" className="max-h-32 mx-auto rounded" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCnicBack(null)}
                      className="text-xs"
                    >
                      <XCircle className="size-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className={`size-10 mx-auto mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="cnic-back-upload"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], 'cnicBack')}
                    />
                    <Label htmlFor="cnic-back-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>Upload Back</span>
                      </Button>
                    </Label>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
          <AlertCircle className="size-5 text-red-600" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={() => setStep('selfie')}
        disabled={!cnicFront || !cnicBack || !userData.name || !userData.cnic || !userData.dob}
        className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] disabled:opacity-50"
        size="lg"
      >
        Continue to Selfie Capture
        <ChevronRight className="size-4 ml-2" />
      </Button>
    </div>
  );

  const renderSelfieStep = () => (
    <div className="space-y-6">
      <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
            <Camera className="size-5 text-[#2563EB]" />
            Capture Selfie
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Position your face clearly in the camera. Ensure good lighting and remove glasses if possible.
          </p>

          {/* Webcam or Preview */}
          <div className="relative rounded-lg overflow-hidden bg-gray-900 aspect-video">
            {webcamStream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : selfieImage ? (
              <img src={selfieImage} alt="Selfie" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <User className="size-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Camera not started</p>
                </div>
              </div>
            )}

            {/* Face guide overlay */}
            {!selfieImage && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-dashed border-blue-500/50 rounded-full" />
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {/* Controls */}
          <div className="flex gap-3">
            {!selfieImage ? (
              <>
                {!webcamStream ? (
                  <Button onClick={startWebcam} className="flex-1" variant="outline">
                    <Camera className="size-4 mr-2" />
                    Start Camera
                  </Button>
                ) : (
                  <>
                    <Button onClick={captureSelfie} className="flex-1 bg-[#2563EB]">
                      <Camera className="size-4 mr-2" />
                      Capture
                    </Button>
                    <Button onClick={stopWebcam} variant="outline">
                      <XCircle className="size-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                <Button onClick={() => { setSelfieImage(null); startWebcam(); }} className="flex-1" variant="outline">
                  <RotateCcw className="size-4 mr-2" />
                  Retake
                </Button>
                <Button onClick={processVerification} className="flex-1 bg-[#2563EB]">
                  <Sparkles className="size-4 mr-2" />
                  Start Verification
                </Button>
              </>
            )}
          </div>

          {/* Upload alternative */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`} />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className={`px-2 ${isDarkMode ? 'bg-[#2A3642] text-gray-400' : 'bg-white text-gray-500'}`}>Or</span>
            </div>
          </div>

          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="selfie-upload-alt"
            onChange={(e) => {
              handleFileUpload(e.target.files?.[0], 'selfie');
              stopWebcam();
            }}
          />
          <Label htmlFor="selfie-upload-alt" className="cursor-pointer">
            <Button variant="outline" className="w-full">
              <Upload className="size-4 mr-2" />
              Upload Selfie Photo
            </Button>
          </Label>
        </CardContent>
      </Card>

      <Button variant="ghost" onClick={() => setStep('input')} className="w-full">
        <ChevronRight className="size-4 mr-2 rotate-180" />
        Back to Information
      </Button>
    </div>
  );

  const renderProcessingStep = () => (
    <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}>
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          {/* Animated spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto"
          >
            <Sparkles className="size-16 text-[#2563EB]" />
          </motion.div>

          <div>
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              Processing Verification
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {processingStage}
            </p>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Progress</span>
              <span className="text-[#2563EB] font-medium">{progress}%</span>
            </div>
            <div className={`h-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
              <motion.div
                className="h-full bg-[#2563EB]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Processing stages */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              { name: 'OCR Extraction', done: progress >= 25 },
              { name: 'Layout Check', done: progress >= 40 },
              { name: 'Chip Detection', done: progress >= 50 },
              { name: 'Tampering Analysis', done: progress >= 65 },
              { name: 'Face Comparison', done: progress >= 80 },
              { name: 'Final Scoring', done: progress >= 95 }
            ].map((stage, idx) => (
              <div 
                key={idx}
                className={`flex items-center gap-2 p-2 rounded ${
                  stage.done 
                    ? 'bg-green-500/10 text-green-600' 
                    : isDarkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'
                }`}
              >
                {stage.done ? (
                  <CheckCircle className="size-4" />
                ) : (
                  <div className="size-4 rounded-full border-2 border-current" />
                )}
                <span>{stage.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderResultsStep = () => {
    if (!verificationResult) return null;

    const { final_decision, final_score, score_breakdown } = verificationResult;

    return (
      <div className="space-y-6">
        {/* Final Decision Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className={`${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'} overflow-hidden`}>
            <CardContent className="p-8 text-center">
              <div className={`inline-flex items-center justify-center size-24 rounded-full mb-4 ${getDecisionColor(final_decision)}`}>
                {final_decision === 'GENUINE' ? (
                  <CheckCircle className="size-12" />
                ) : final_decision === 'SUSPICIOUS' ? (
                  <AlertCircle className="size-12" />
                ) : (
                  <XCircle className="size-12" />
                )}
              </div>

              <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                {final_decision}
              </h2>
              
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Confidence Score:</span>
                <span className={`text-2xl font-bold ${getScoreColor(final_score)}`}>
                  {final_score}%
                </span>
              </div>

              {/* Score breakdown summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {score_breakdown && Object.entries(score_breakdown).map(([key, value]) => (
                  <div key={key} className={`p-3 rounded-lg ${getScoreBg(value.score)}`}>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {getStatusIcon(value.status)}
                    </div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {key.replace('_', ' ')}
                    </p>
                    <p className={`text-lg font-bold ${getScoreColor(value.score)}`}>
                      {value.score}%
                    </p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailedReport(!showDetailedReport)}
                  className="flex-1"
                >
                  <Eye className="size-4 mr-2" />
                  {showDetailedReport ? 'Hide' : 'View'} Details
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Reset for new verification
                    setCnicFront(null);
                    setCnicBack(null);
                    setSelfieImage(null);
                    setVerificationResult(null);
                    setUserData({ name: '', cnic: '', dob: '', expiry: '' });
                    setStep('input');
                  }}
                  className="flex-1"
                >
                  <RotateCcw className="size-4 mr-2" />
                  New Verification
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Report */}
        <AnimatePresence>
          {showDetailedReport && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}>
                <CardHeader>
                  <CardTitle className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>
                    Detailed Analysis Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Score breakdown table */}
                  <div className="space-y-3">
                    {score_breakdown && Object.entries(score_breakdown).map(([key, value]) => (
                      <div key={key} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(value.status)}
                            <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                              {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                          <span className={`font-bold ${getScoreColor(value.score)}`}>
                            {value.score}%
                          </span>
                        </div>
                        <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <div 
                            className={`h-full rounded-full ${
                              value.status === 'pass' ? 'bg-green-500' :
                              value.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${value.score}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>Weight: {Math.round(value.weight * 100)}%</span>
                          <span>Contribution: {value.weighted_score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Additional details */}
                  {verificationResult.ocr_result && (
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
                      <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                        OCR Extracted Data
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Name:</span>
                          <span className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {verificationResult.ocr_result.name || 'Not detected'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">CNIC:</span>
                          <span className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {verificationResult.ocr_result.cnic_number || 'Not detected'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">DOB:</span>
                          <span className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {verificationResult.ocr_result.dob || 'Not detected'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Confidence:</span>
                          <span className={`ml-2 ${getScoreColor(verificationResult.ocr_result.confidence)}`}>
                            {verificationResult.ocr_result.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {verificationResult.face_comparison_result && (
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
                      <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                        Face Comparison
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Match:</span>
                          <span className={`ml-2 ${
                            verificationResult.face_comparison_result.is_match 
                              ? 'text-green-600 font-medium' 
                              : 'text-red-600 font-medium'
                          }`}>
                            {verificationResult.face_comparison_result.is_match ? 'Verified' : 'Not Verified'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Similarity:</span>
                          <span className={`ml-2 ${getScoreColor(verificationResult.face_comparison_result.similarity_score)}`}>
                            {verificationResult.face_comparison_result.similarity_score}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className={`text-xs text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Verification ID: {verificationResult.verification_id}<br />
                    Completed: {new Date(verificationResult.timestamp).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className={`min-h-screen p-4 md:p-6 ${isDarkMode ? 'bg-[#1F2933]' : 'bg-[#F9FAFB]'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              CNIC Verification
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              AI-powered forensic document verification
            </p>
          </div>
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <XCircle className="size-5" />
            </Button>
          )}
        </div>

        {/* Step indicator */}
        {step !== 'results' && (
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              {['Information', 'Selfie', 'Processing'].map((label, idx) => {
                const stepNames = ['input', 'selfie', 'processing'];
                const isActive = stepNames.indexOf(step) >= idx;
                const isCurrent = stepNames.indexOf(step) === idx;
                
                return (
                  <div key={label} className="flex items-center">
                    <div className={`flex items-center justify-center size-8 rounded-full text-sm font-medium transition-colors ${
                      isCurrent 
                        ? 'bg-[#2563EB] text-white' 
                        : isActive 
                          ? 'bg-[#2563EB]/20 text-[#2563EB]' 
                          : isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {idx + 1}
                    </div>
                    <span className={`ml-2 text-sm ${
                      isCurrent 
                        ? isDarkMode ? 'text-white' : 'text-[#1F2933]' 
                        : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {label}
                    </span>
                    {idx < 2 && (
                      <ChevronRight className={`size-4 mx-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Content */}
        {step === 'input' && renderInputStep()}
        {step === 'selfie' && renderSelfieStep()}
        {step === 'processing' && renderProcessingStep()}
        {step === 'results' && renderResultsStep()}
      </div>
    </div>
  );
}
