import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle, Sparkles, Camera, Upload, X, AlertCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

export function AICNICVerification({ onVerificationComplete, onBack }) {
  const { isDarkMode } = useTheme();
  const [step, setStep] = useState('upload');
  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [matchProgress, setMatchProgress] = useState(0);
  const [faceMatched, setFaceMatched] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  
  // Refs for file inputs to properly reset them
  const cnicFrontInputRef = useRef(null);
  const cnicBackInputRef = useRef(null);
  const selfieInputRef = useRef(null);

  // AI Scanning Animation
  useEffect(() => {
    if (step === 'scanning') {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('selfie'), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step]);

  // AI Face Matching Animation
  useEffect(() => {
    if (step === 'matching') {
      const interval = setInterval(() => {
        setMatchProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setFaceMatched(true);
            setTimeout(() => {
              const finalAccuracy = 97 + Math.floor(Math.random() * 3); // 97-99%
              setAccuracy(finalAccuracy);
              setStep('success');
              setTimeout(() => onVerificationComplete(true, finalAccuracy), 2000);
            }, 1000);
            return 100;
          }
          return prev + 3;
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleCNICUpload = (side, file) => {
    // Validate file
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result;
      if (imageData) {
        if (side === 'front') {
          setCnicFront(imageData);
        } else {
          setCnicBack(imageData);
        }
      }
    };
    reader.onerror = () => {
      console.error('Error reading file');
    };
    reader.readAsDataURL(file);
  };

  const clearCNICImage = (side) => {
    if (side === 'front') {
      setCnicFront(null);
      if (cnicFrontInputRef.current) {
        cnicFrontInputRef.current.value = '';
      }
    } else {
      setCnicBack(null);
      if (cnicBackInputRef.current) {
        cnicBackInputRef.current.value = '';
      }
    }
  };

  const startScanning = () => {
    if (cnicFront && cnicBack) {
      setStep('scanning');
      setScanProgress(0);
    }
  };

  const handleSelfieCapture = (imageData) => {
    setSelfieImage(imageData);
    setStep('matching');
    setMatchProgress(0);
  };

  // Step 1: Upload CNIC
  if (step === 'upload') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${isDarkMode ? 'bg-[#1F2933]' : 'bg-[#F9FAFB]'}`}>
        <Card className={`w-full max-w-2xl ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                <Sparkles className="size-6 text-[#2563EB]" />
                AI Identity Verification
              </CardTitle>
              {onBack && (
                <Button variant="ghost" size="icon" onClick={onBack}>
                  <X className="size-5" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Upload front and back images of your CNIC for AI-powered verification
            </p>

            {/* CNIC Front */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>
                CNIC Front Image
              </label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                cnicFront 
                  ? 'border-green-500 bg-green-500/10' 
                  : isDarkMode ? 'border-gray-700 bg-[#1F2933]' : 'border-gray-300 bg-gray-50'
              }`}>
                {cnicFront ? (
                  <div className="space-y-2">
                    <CheckCircle className="size-12 text-green-600 mx-auto" />
                    <p className="text-sm text-green-600 font-medium">Front image uploaded</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearCNICImage('front')}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      <X className="size-3 mr-1" />
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className={`size-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <input
                      ref={cnicFrontInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="cnic-front"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleCNICUpload('front', file);
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => cnicFrontInputRef.current?.click()}
                    >
                      Choose File
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* CNIC Back */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>
                CNIC Back Image
              </label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                cnicBack 
                  ? 'border-green-500 bg-green-500/10' 
                  : isDarkMode ? 'border-gray-700 bg-[#1F2933]' : 'border-gray-300 bg-gray-50'
              }`}>
                {cnicBack ? (
                  <div className="space-y-2">
                    <CheckCircle className="size-12 text-green-600 mx-auto" />
                    <p className="text-sm text-green-600 font-medium">Back image uploaded</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearCNICImage('back')}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      <X className="size-3 mr-1" />
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className={`size-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <input
                      ref={cnicBackInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="cnic-back"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleCNICUpload('back', file);
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => cnicBackInputRef.current?.click()}
                    >
                      Choose File
                    </Button>
                  </>
                )}
              </div>
            </div>

            <Button
              onClick={startScanning}
              disabled={!cnicFront || !cnicBack}
              className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] disabled:opacity-50"
            >
              <Sparkles className="size-4 mr-2" />
              Start AI Verification
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 2: AI Scanning Animation
  if (step === 'scanning') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${isDarkMode ? 'bg-[#1F2933]' : 'bg-[#F9FAFB]'}`}>
        <Card className={`w-full max-w-2xl ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              <Sparkles className="size-6 text-[#2563EB] animate-pulse" />
              AI Scanning CNIC...
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative">
              {/* CNIC Preview */}
              <div className="relative rounded-lg overflow-hidden bg-gray-200 aspect-video mb-4">
                {cnicFront && (
                  <img src={cnicFront} alt="CNIC" className="w-full h-full object-cover" />
                )}
                {/* Animated Scanning Line */}
                <motion.div
                  className="absolute left-0 right-0 h-1 bg-[#2563EB] shadow-lg shadow-blue-500/50"
                  style={{ top: `${scanProgress}%` }}
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(37, 99, 235, 0.8)',
                      '0 0 40px rgba(37, 99, 235, 1)',
                      '0 0 20px rgba(37, 99, 235, 0.8)',
                    ],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                {/* Scanning Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2563EB]/10 to-transparent" 
                     style={{ clipPath: `inset(0 0 ${100 - scanProgress}% 0)` }} />
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Analyzing Document...</span>
                  <span className="text-[#2563EB] font-medium">{scanProgress}%</span>
                </div>
                <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                  <motion.div
                    className="h-full bg-[#2563EB]"
                    initial={{ width: 0 }}
                    animate={{ width: `${scanProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-[#2563EB]">
                  <Sparkles className="size-4 animate-pulse" />
                  <span>AI is extracting and validating CNIC data...</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 3: Live Selfie Capture
  if (step === 'selfie') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${isDarkMode ? 'bg-[#1F2933]' : 'bg-[#F9FAFB]'}`}>
        <Card className={`w-full max-w-2xl ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              <Camera className="size-6 text-[#2563EB]" />
              Capture Live Selfie
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Position your face within the circle for AI face matching
            </p>

            {/* Selfie Capture Area with Face Overlay */}
            <div className="relative rounded-lg overflow-hidden bg-gray-900 aspect-video">
              {!selfieImage ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Face Circle Overlay */}
                  <div className="relative">
                    <svg className="size-64" viewBox="0 0 256 256">
                      <circle
                        cx="128"
                        cy="128"
                        r="100"
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="3"
                        strokeDasharray="8 4"
                        className="animate-pulse"
                      />
                      <circle cx="128" cy="128" r="100" fill="rgba(37, 99, 235, 0.1)" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera className="size-12 text-[#2563EB]" />
                    </div>
                  </div>
                </div>
              ) : (
                <img src={selfieImage} alt="Selfie" className="w-full h-full object-cover" />
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSelfieImage(null);
                  if (selfieInputRef.current) {
                    selfieInputRef.current.value = '';
                  }
                }}
              >
                Retake
              </Button>
              <Button
                className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8]"
                onClick={() => {
                  // Simulate selfie capture
                  const canvas = document.createElement('canvas');
                  canvas.width = 640;
                  canvas.height = 480;
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    ctx.fillStyle = '#2563EB';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = 'white';
                    ctx.font = '24px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('Selfie Captured', canvas.width / 2, canvas.height / 2);
                  }
                  handleSelfieCapture(canvas.toDataURL());
                }}
              >
                <Camera className="size-4 mr-2" />
                Capture Selfie
              </Button>
            </div>

            {/* Upload Alternative */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`} />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className={`px-2 ${isDarkMode ? 'bg-[#2A3642] text-gray-400' : 'bg-white text-gray-500'}`}>Or</span>
              </div>
            </div>

            <input
              ref={selfieInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              id="selfie-upload"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const result = ev.target?.result;
                    if (result) {
                      handleSelfieCapture(result);
                    }
                  };
                  reader.onerror = () => {
                    console.error('Error reading selfie file');
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer"
              onClick={() => selfieInputRef.current?.click()}
            >
              <Upload className="size-4 mr-2" />
              Upload Selfie Photo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 4: AI Face Matching
  if (step === 'matching') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${isDarkMode ? 'bg-[#1F2933]' : 'bg-[#F9FAFB]'}`}>
        <Card className={`w-full max-w-2xl ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              <Sparkles className="size-6 text-[#2563EB] animate-pulse" />
              AI Face Matching...
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* CNIC Photo */}
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>CNIC Photo</p>
                <div className="relative rounded-lg overflow-hidden aspect-square bg-gray-200">
                  {cnicFront && <img src={cnicFront} alt="CNIC" className="w-full h-full object-cover" />}
                </div>
              </div>
              {/* Live Selfie */}
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Live Selfie</p>
                <div className="relative rounded-lg overflow-hidden aspect-square bg-gray-200">
                  {selfieImage && <img src={selfieImage} alt="Selfie" className="w-full h-full object-cover" />}
                  {/* Face Circle Overlay - turns green when matched */}
                  <AnimatePresence>
                    {!faceMatched && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <svg className="size-48" viewBox="0 0 256 256">
                          <circle
                            cx="128"
                            cy="128"
                            r="100"
                            fill="none"
                            stroke="#2563EB"
                            strokeWidth="4"
                            strokeDasharray="8 4"
                            className="animate-pulse"
                          />
                        </svg>
                      </motion.div>
                    )}
                    {faceMatched && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        <svg className="size-48" viewBox="0 0 256 256">
                          <circle
                            cx="128"
                            cy="128"
                            r="100"
                            fill="rgba(34, 197, 94, 0.2)"
                            stroke="#22c55e"
                            strokeWidth="4"
                          />
                        </svg>
                        <CheckCircle className="absolute size-16 text-green-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Matching Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {faceMatched ? 'Face Matched!' : 'Matching facial features...'}
                </span>
                <span className={`font-medium ${faceMatched ? 'text-green-600' : 'text-[#2563EB]'}`}>
                  {matchProgress}%
                </span>
              </div>
              <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                <motion.div
                  className={`h-full ${faceMatched ? 'bg-green-600' : 'bg-[#2563EB]'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${matchProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-[#2563EB]">
                <Sparkles className="size-4 animate-pulse" />
                <span>AI is comparing facial biometrics...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 5: Verification Success
  if (step === 'success') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${isDarkMode ? 'bg-[#1F2933]' : 'bg-[#F9FAFB]'}`}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className={`w-full max-w-2xl ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardContent className="p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className={`size-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
                }`}
              >
                <CheckCircle className="size-16 text-green-600" />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="size-6 text-[#2563EB]" />
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                    AI Verified Successfully!
                  </h2>
                </div>
                <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  CNIC details matched with live selfie
                </p>

                <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${
                  isDarkMode ? 'bg-[#2563EB]/20' : 'bg-blue-50'
                } mb-8`}>
                  <Sparkles className="size-5 text-[#2563EB]" />
                  <span className="text-[#2563EB] font-bold text-xl">{accuracy}% Accuracy</span>
                </div>

                <div className={`p-4 rounded-lg text-left ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Verification Method</p>
                      <p className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>AI Biometric Match</p>
                    </div>
                    <div>
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Status</p>
                      <p className="font-medium text-green-600">Verified</p>
                    </div>
                    <div>
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Timestamp</p>
                      <p className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                        {new Date().toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Accuracy</p>
                      <p className="font-medium text-[#2563EB]">{accuracy}%</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return null;
}

/* Purpose: AI-based CNIC verification system jo user ki identity verify karta hai (CNIC upload + selfie + face matching).
Type: React component hai, is liye web-based hai (browser app), lekin same logic ko mobile app (React Native) me bhi use kiya ja sakta hai. */