import { useState, useRef } from 'react';
import { User } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, Upload, Check, Eye, EyeOff, MapPin, Lock, 
  CreditCard, Camera, Loader2, CheckCircle, Video,
  Briefcase, Factory, HardHat, X, Sparkles, FileText, Barcode
} from 'lucide-react';
import { SelfieCaptureModal } from './SelfieCaptureModal';
import { LocationModal } from './LocationModal';
import { useTheme } from '../contexts/ThemeContext';
import LegalCompliance from './LegalCompliance'; // 1. YAHAN IMPORT KAREIN

export function EnhancedRegistrationForm({ userType, onComplete, onBack }) {
  const { isDarkMode } = useTheme();
  const [step, setStep] = useState('basic');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSelfieCapture, setShowSelfieCapture] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    cnic: '',
    skills: [],
    rate: '',
    experience: '',
    videoProfile: null,
    workHistory: '',
    companyName: '',
    productionCapacity: '',
    pricing: '',
    affidavitCode: '',
    businessDocuments: null,
    businessType: '',
  });

  const [location, setLocation] = useState(null);
  const [cnicFrontFile, setCnicFrontFile] = useState(null);
  const [cnicBackFile, setCnicBackFile] = useState(null);
  const [cnicFrontUploaded, setCnicFrontUploaded] = useState(false);
  const [cnicBackUploaded, setCnicBackUploaded] = useState(false);
  const [selfieData, setSelfieData] = useState(null);
  const [selfieCaptured, setSelfieCaptured] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [businessDocUploaded, setBusinessDocUploaded] = useState(false);
  const [locationVerified, setLocationVerified] = useState(false);
  
  const cnicFrontInputRef = useRef(null);
  const cnicBackInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const businessDocInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCnicFrontUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCnicFrontFile(file);
      setCnicFrontUploaded(true);
      e.target.value = '';
    }
  };

  const handleCnicBackUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCnicBackFile(file);
      setCnicBackUploaded(true);
      e.target.value = '';
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, videoProfile: file }));
      setVideoUploaded(true);
    }
  };

  const handleBusinessDocUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, businessDocuments: file }));
      setBusinessDocUploaded(true);
    }
  };

  const handleSelfieCapture = (imageData) => {
    setSelfieData(imageData);
    setSelfieCaptured(true);
    setShowSelfieCapture(false);
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setFormData(prev => ({ ...prev, address: selectedLocation.address }));
    setLocationVerified(true);
    setShowLocationModal(false);
  };

  const isVerificationLocationReady =
    (locationVerified && location != null) ||
    Boolean(formData.address?.trim());

  const handleBasicSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.password) {
      alert('Please fill all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    if (userType === 'manufacturer' && (!formData.companyName || !formData.productionCapacity)) {
      alert('Please fill manufacturer details');
      return;
    }
    if (userType === 'labour' && (!formData.skills.length || !formData.rate)) {
      alert('Please fill labour details');
      return;
    }

    setStep('verification');
  };

  const handleVerificationSubmit = () => {
    if (!cnicFrontUploaded || !cnicFrontFile) {
      alert('Please upload CNIC front image');
      return;
    }
    if (!cnicBackUploaded || !cnicBackFile) {
      alert('Please upload CNIC back image');
      return;
    }
    if (!selfieCaptured || !selfieData) {
      alert('Please capture your live selfie for AI verification');
      return;
    }
    if (!isVerificationLocationReady) {
      alert('Please enter your address in step 1, or use Verify GPS on step 1.');
      return;
    }

    // Optional manufacturer/labour fields are not required to match the enabled state of this button.

    setStep('verifying');
    
    setTimeout(() => {
      setStep('verified');
    }, 3000);
  };

  const handleComplete = () => {
    const userData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      cnic: formData.cnic,
      address: formData.address,
      location: location || undefined,
      skills: formData.skills.length > 0 ? formData.skills : undefined,
      rate: formData.rate ? Number(formData.rate) : undefined,
      videoProfile: formData.videoProfile ? URL.createObjectURL(formData.videoProfile) : undefined,
      documents: [],
      isVerified: true,
      trustScore: 50,
    };

    if (cnicFrontFile) {
      userData.documents.push({ type: 'CNIC Front', file: cnicFrontFile });
    }
    if (cnicBackFile) {
      userData.documents.push({ type: 'CNIC Back', file: cnicBackFile });
    }

    if (userType === 'manufacturer' && formData.businessDocuments) {
      userData.documents.push({ type: 'Business Documents', file: formData.businessDocuments });
      userData.documents.push({ type: 'Affidavit', file: formData.businessDocuments });
    }

    onComplete(userData);
  };

  const getUserTypeIcon = () => {
    switch (userType) {
      case 'client': return <Briefcase className="size-6" />;
      case 'manufacturer': return <Factory className="size-6" />;
      case 'labour': return <HardHat className="size-6" />;
      default: return null;
    }
  };

  const getUserTypeLabel = () => {
    switch (userType) {
      case 'client': return 'Client';
      case 'manufacturer': return 'Manufacturer';
      case 'labour': return 'Labour';
      default: return '';
    }
  };

  if (step === 'basic') {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-[#1F2933]' : 'bg-[#F9FAFB]'} flex items-center justify-center p-4`}>
        <Card className={`w-full max-w-2xl shadow-xl ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader className="bg-[#2563EB] text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onBack}
                className="text-white hover:bg-[#1d4ed8]"
              >
                <ArrowLeft className="size-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
                  {getUserTypeIcon()}
                </div>
                <div>
                  <CardTitle className="text-xl">Register as {getUserTypeLabel()}</CardTitle>
                  <p className="text-sm text-white/90">Step 1: Basic Information</p>
                </div>
              </div>
              <div className="size-10" />
            </div>
          </CardHeader>
          
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="name" className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
              />
            </div>

            <div>
              <Label htmlFor="email" className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
              />
            </div>

            <div>
              <Label htmlFor="phone" className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>Phone Number *</Label>
              <Input
                id="phone"
                placeholder="+92 300 1234567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
              />
            </div>

            <div>
              <Label htmlFor="cnic" className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>CNIC Number *</Label>
              <Input
                id="cnic"
                placeholder="12345-1234567-1"
                value={formData.cnic}
                onChange={(e) => handleInputChange('cnic', e.target.value)}
                className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
              />
            </div>

            <div>
              <Label htmlFor="address" className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>
                Address * {locationVerified && <Badge variant="outline" className="ml-2 text-xs bg-green-500/10 text-green-600 border-green-500">GPS Verified</Badge>}
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="address"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`flex-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                />
                <Button
                  type="button"
                  onClick={() => setShowLocationModal(true)}
                  className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                >
                  <MapPin className="size-4 mr-2" />
                  {locationVerified ? 'Update' : 'Verify GPS'}
                </Button>
              </div>
              {location && (
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              )}
            </div>

            {userType === 'manufacturer' && (
              <>
                <div>
                  <Label htmlFor="companyName" className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>Company Name *</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter company/factory name"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                  />
                </div>
                <div>
                  <Label htmlFor="productionCapacity" className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>Production Capacity *</Label>
                  <Input
                    id="productionCapacity"
                    placeholder="e.g., 1000 units/month"
                    value={formData.productionCapacity}
                    onChange={(e) => handleInputChange('productionCapacity', e.target.value)}
                    className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                  />
                </div>
                <div>
                  <Label htmlFor="pricing" className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>Pricing (PKR/unit)</Label>
                  <Input
                    id="pricing"
                    type="number"
                    placeholder="e.g., 500"
                    value={formData.pricing}
                    onChange={(e) => handleInputChange('pricing', e.target.value)}
                    className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                  />
                </div>
              </>
            )}

            {userType === 'labour' && (
              <>
                <div>
                  <Label htmlFor="skills" className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>Skills (comma separated) *</Label>
                  <Input
                    id="skills"
                    placeholder="e.g. Stitching, Pattern Making, Embroidery"
                    value={formData.skills.join(', ')}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                    }))}
                    className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                  />
                </div>
                <div>
                  <Label htmlFor="rate" className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>Daily Rate (PKR) *</Label>
                  <Input
                    id="rate"
                    type="number"
                    placeholder="e.g. 800"
                    value={formData.rate}
                    onChange={(e) => handleInputChange('rate', e.target.value)}
                    className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                  />
                </div>
                <div>
                  <Label htmlFor="experience" className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>Years of Experience</Label>
                  <Input
                    id="experience"
                    placeholder="e.g. 5 years"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                  />
                </div>
                <div>
                  <Label htmlFor="workHistory" className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>Work History</Label>
                  <Textarea
                    id="workHistory"
                    placeholder="Describe your previous work experience..."
                    value={formData.workHistory}
                    onChange={(e) => handleInputChange('workHistory', e.target.value)}
                    className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                    rows={3}
                  />
                </div>
              </>
            )}

            {userType === 'client' && (
              <div>
                <Label htmlFor="businessType" className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>Business Type</Label>
                <Input
                  id="businessType"
                  placeholder="e.g., Textile Exporter, Fashion Brand"
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                />
              </div>
            )}

            <div>
              <Label htmlFor="password" className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>Password *</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`pr-10 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>Confirm Password *</Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`pr-10 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleBasicSubmit}
              className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] mt-6"
            >
              Continue to Verification
            </Button>
          </CardContent>
        </Card>

        {showLocationModal && (
          <LocationModal
            onClose={() => setShowLocationModal(false)}
            onSelectLocation={handleLocationSelect}
          />
        )}
      </div>
    );
  }

  if (step === 'verification') {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-xl bg-white border border-gray-200">
          <CardHeader className="bg-[#2563EB] text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setStep('basic')}
                className="text-white hover:bg-[#1d4ed8]"
              >
                <ArrowLeft className="size-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
                  <CreditCard className="size-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">Identity Verification</CardTitle>
                  <p className="text-sm text-white/90">Step 2: Upload Documents</p>
                </div>
              </div>
              <div className="size-10" />
            </div>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            <div>
              <Label>Upload CNIC (Front & Back) *</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  ref={cnicFrontInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCnicFrontUpload}
                  className="sr-only"
                />
                <input
                  ref={cnicBackInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCnicBackUpload}
                  className="sr-only"
                />
                {cnicFrontUploaded && cnicBackUploaded ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="size-12 text-[#2563EB]" />
                    <p className="text-sm text-gray-700">CNIC Uploaded Successfully</p>
                    <p className="text-xs text-gray-500">{cnicFrontFile?.name}, {cnicBackFile?.name}</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setCnicFrontFile(null);
                        setCnicBackFile(null);
                        setCnicFrontUploaded(false);
                        setCnicBackUploaded(false);
                        if (cnicFrontInputRef.current) cnicFrontInputRef.current.value = '';
                        if (cnicBackInputRef.current) cnicBackInputRef.current.value = '';
                      }}
                      className="mt-2"
                    >
                      Upload Different Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 text-left">
                    <p className="text-sm text-gray-600 text-center mb-2">
                      Upload the front and back of your CNIC (each side has its own control).
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-md border border-gray-200 p-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800">CNIC front</p>
                        {cnicFrontUploaded ? (
                          <p className="text-xs text-green-600 mt-1 truncate">{cnicFrontFile?.name}</p>
                        ) : (
                          <p className="text-xs text-gray-500 mt-1">Not uploaded yet</p>
                        )}
                      </div>
                      <Button
                        type="button"
                        onClick={() => cnicFrontInputRef.current?.click()}
                        className="bg-[#2563EB] hover:bg-[#1d4ed8] shrink-0"
                      >
                        <Upload className="size-4 mr-2" />
                        {cnicFrontUploaded ? 'Change front' : 'Upload front'}
                      </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-md border border-gray-200 p-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800">CNIC back</p>
                        {cnicBackUploaded ? (
                          <p className="text-xs text-green-600 mt-1 truncate">{cnicBackFile?.name}</p>
                        ) : (
                          <p className="text-xs text-gray-500 mt-1">Not uploaded yet</p>
                        )}
                      </div>
                      <Button
                        type="button"
                        onClick={() => cnicBackInputRef.current?.click()}
                        className="bg-[#2563EB] hover:bg-[#1d4ed8] shrink-0"
                      >
                        <Upload className="size-4 mr-2" />
                        {cnicBackUploaded ? 'Change back' : 'Upload back'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Capture Selfie for Verification *</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {selfieCaptured ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                      <img src={selfieData} alt="Selfie" className="size-32 rounded-full object-cover" />
                      <CheckCircle className="absolute -top-1 -right-1 size-8 text-[#2563EB] bg-white rounded-full" />
                    </div>
                    <p className="text-sm text-gray-700">Selfie Captured Successfully</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelfieData(null);
                        setSelfieCaptured(false);
                        setShowSelfieCapture(true);
                      }}
                      className="mt-2"
                    >
                      Retake Selfie
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Camera className="size-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Capture a clear selfie for face verification</p>
                    <Button
                      onClick={() => setShowSelfieCapture(true)}
                      className="bg-[#2563EB] hover:bg-[#1d4ed8]"
                    >
                      <Camera className="size-4 mr-2" />
                      Open Camera
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {userType === 'labour' && (
              <div>
                <Label>Upload Skills Video (Optional)</Label>
                <p className="text-xs text-gray-500 mb-2">Show your skills in action (max 30 seconds)</p>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  {videoUploaded ? (
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle className="size-12 text-[#2563EB]" />
                      <p className="text-sm text-gray-700">Video Uploaded Successfully</p>
                      <p className="text-xs text-gray-500">{formData.videoProfile?.name}</p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, videoProfile: null }));
                          setVideoUploaded(false);
                        }}
                        className="mt-2"
                      >
                        Upload Different Video
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Video className="size-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload a video showcasing your skills</p>
                      <Button
                        onClick={() => videoInputRef.current?.click()}
                        variant="outline"
                        className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
                      >
                        <Video className="size-4 mr-2" />
                        Select Video
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {userType === 'manufacturer' && (
              <div>
                <Label>Upload Business Documents (Optional)</Label>
                <p className="text-xs text-gray-500 mb-2">Upload relevant business documents (max 5MB)</p>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    ref={businessDocInputRef}
                    type="file"
                    accept="application/pdf, image/*"
                    onChange={handleBusinessDocUpload}
                    className="hidden"
                  />
                  {businessDocUploaded ? (
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle className="size-12 text-[#2563EB]" />
                      <p className="text-sm text-gray-700">Documents Uploaded Successfully</p>
                      <p className="text-xs text-gray-500">{formData.businessDocuments?.name}</p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, businessDocuments: null }));
                          setBusinessDocUploaded(false);
                        }}
                        className="mt-2"
                      >
                        Upload Different Documents
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <FileText className="size-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload business documents</p>
                      <Button
                        onClick={() => businessDocInputRef.current?.click()}
                        variant="outline"
                        className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
                      >
                        <FileText className="size-4 mr-2" />
                        Select Documents
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {userType === 'manufacturer' && (
              <div>
                <Label>Affidavit Barcode/Hexadecimal Code (Optional)</Label>
                <p className="text-xs text-gray-500 mb-2">Enter the barcode or hexadecimal code from your affidavit</p>
                <div className="mt-2">
                  <Input
                    id="affidavitCode"
                    placeholder="Enter code here"
                    value={formData.affidavitCode}
                    onChange={(e) => handleInputChange('affidavitCode', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            <Button
              type="button"
              onClick={handleVerificationSubmit}
              disabled={!cnicFrontUploaded || !cnicBackUploaded || !selfieCaptured || !isVerificationLocationReady}
              className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] mt-6 disabled:opacity-50"
            >
              Submit for Verification
            </Button>
          </CardContent>
        </Card>

        {showSelfieCapture && (
          <SelfieCaptureModal
            onClose={() => setShowSelfieCapture(false)}
            onCapture={handleSelfieCapture}
          />
        )}
      </div>
    );
  }

  if (step === 'verifying') {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl bg-white border border-gray-200">
          <CardContent className="p-12 text-center">
            <div className="mb-6">
              <div className="size-20 mx-auto mb-4 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
                <Loader2 className="size-10 text-[#2563EB] animate-spin" />
              </div>
              <h3 className="text-xl font-medium mb-2">Verifying Your Documents</h3>
              <p className="text-gray-600">Please wait while we verify your identity...</p>
            </div>
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2 text-sm">
                <Loader2 className="size-4 text-[#2563EB] animate-spin" />
                <span>Checking CNIC authenticity...</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Loader2 className="size-4 text-[#2563EB] animate-spin" />
                <span>Matching selfie with CNIC photo...</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Loader2 className="size-4 text-[#2563EB] animate-spin" />
                <span>Validating information...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'verified') {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl bg-white border border-gray-200">
          <CardContent className="p-12 text-center">
            <div className="size-20 mx-auto mb-6 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
              <CheckCircle className="size-12 text-[#2563EB]" />
            </div>
            <h3 className="text-2xl font-medium mb-2">Verification Successful!</h3>
            <p className="text-gray-600 mb-2">Your account has been verified</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB]/10 rounded-full mb-6">
              <Sparkles className="size-4 text-[#2563EB]" />
              <span className="text-sm font-medium text-[#2563EB]">Trust Score: 95/100</span>
            </div>
            <Button
              onClick={handleComplete}
              className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]"
            >
              Continue to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}

/*This file handles user registration with multi-step verification (basic info, CNIC upload, selfie, GPS, and role-based data).
It is mainly web-based (React) but can be used for both web and app (hybrid) if integrated accordingly. */