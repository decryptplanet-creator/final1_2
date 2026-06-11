import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea input';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, Upload, Eye, EyeOff, MapPin, Lock, 
  CreditCard, Camera, Loader2, CheckCircle, Clock,
  Briefcase, Factory, HardHat, Moon, Sun, ShieldCheck
} from 'lucide-react';
import { SelfieCaptureModal } from './SelfieCaptureModal';
import { LocationModal } from './LocationModal';
import { useTheme } from '../contexts/ThemeContext';

const POLICIES = [
  { title: '1. Fraud Policy (PPC Sections 415–420)', text: 'Any user involved in fraud, deception, or dishonest activities shall be held accountable under applicable Pakistani laws.' },
  { title: '2. Payment Policy (PPC Sections 23, 24, 25)', text: 'Clients and manufacturers must make agreed payments on time. Intentional non-payment may result in legal action.' },
  { title: '3. False Information Policy (PPC Sections 24, 25)', text: 'Users must provide accurate personal, business, and professional information on the platform.' },
  { title: '4. Forgery Policy (PPC Sections 463–471)', text: 'Submitting fake documents, contracts, certificates, or identification records is strictly prohibited.' },
  { title: '5. Impersonation Policy (PPC Sections 416, 419)', text: 'No user may create an account or conduct activities using another person\'s or company\'s identity.' },
  { title: '6. Abuse and Harassment Policy (PPC Sections 504, 509)', text: 'Abusive language, harassment, offensive behavior, or misconduct toward any user is prohibited.' },
  { title: '7. Criminal Intimidation Policy (PPC Sections 503, 506)', text: 'Threats, coercion, blackmail, or intimidation of any user may result in legal action.' },
  { title: '8. Theft and Misuse Policy (PPC Sections 378, 379)', text: 'Unauthorized use, theft, or misuse of another user\'s property, products, materials, or information is prohibited.' },
  { title: '9. Account Suspension Policy', text: 'Users who repeatedly violate platform policies after warnings may have their accounts suspended or permanently terminated.' },
  { title: '10. Legal Compliance Policy', text: 'All users agree to comply with the laws of Pakistan, and serious violations may be reported to the relevant authorities for legal proceedings.' },
];

export function RegistrationForm({ userType, onComplete, onBack }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [step, setStep] = useState('basic');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSelfieCapture, setShowSelfieCapture] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [policiesAccepted, setPoliciesAccepted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    password: '',
    confirmPassword: '',
    cnic: '',
    // Client specific
    companyName: '',
    // Manufacturer specific
    businessName: '',
    factoryAddress: '',
    // Labour specific
    skill: '',
    experience: '',
  });

  const [location, setLocation] = useState(null);
  const [cnicFile, setCnicFile] = useState(null);
  const [cnicUploaded, setCnicUploaded] = useState(false);
  const [selfieData, setSelfieData] = useState(null);
  const [selfieCaptured, setSelfieCaptured] = useState(false);
  const [trustScore, setTrustScore] = useState(0);
  const cnicInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setFormData(prev => ({ ...prev, address: selectedLocation.address }));
    setShowLocationModal(false);
  };

  const handleCnicUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCnicFile(file);
      setCnicUploaded(true);
    }
  };

  const handleSelfieCapture = (imageData) => {
    setSelfieData(imageData);
    setSelfieCaptured(true);
    setShowSelfieCapture(false);
  };

  const handleBasicSubmit = () => {
    // Validate basic info
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.password) {
      alert('Please fill all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setStep('verification');
  };

  const handleVerificationSubmit = () => {
    if (!cnicUploaded || !cnicFile) {
      alert('Please upload your CNIC');
      return;
    }
    if (!selfieCaptured || !selfieData) {
      alert('Please capture your selfie');
      return;
    }
    if (!policiesAccepted) {
      alert('Please accept the Platform Policies to continue');
      return;
    }
    setStep('verifying');
    setTimeout(() => setStep('verified'), 2000);
  };

  const handleComplete = () => {
    onComplete();
  };

  const Icon = userType === 'client' ? Briefcase : userType === 'manufacturer' ? Factory : HardHat;
  const title = userType === 'client' ? 'Client Registration' : userType === 'manufacturer' ? 'Manufacturer Registration' : 'Labour Registration';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'bg-[#1F2933]' : 'bg-[#F9FAFB]'}`}>
      <Card className={`max-w-2xl w-full ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardHeader className={`${isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-[#F9FAFB] border-gray-200'} border-b`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 bg-[#2563EB] rounded-lg flex items-center justify-center">
                <Icon className="size-6 text-white" />
              </div>
              <div>
                <CardTitle className={`${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{title}</CardTitle>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {step === 'basic' && 'Step 1: Basic Information'}
                  {step === 'verification' && 'Step 2: Verification Documents'}
                  {step === 'verifying' && 'Verification in Progress...'}
                  {step === 'verified' && 'Verified Successfully!'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${isDarkMode ? 'text-[#F9FAFB] hover:bg-gray-700' : 'text-[#1F2933] hover:bg-gray-100'}`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </button>
              <Button variant="ghost" size="icon" onClick={onBack} className={`${isDarkMode ? 'text-gray-400 hover:text-[#F9FAFB]' : 'text-gray-600 hover:text-[#1F2933]'}`}>
                <ArrowLeft className="size-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* BASIC INFORMATION STEP */}
          {step === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>Full Name *</Label>
                  <Input
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                  />
                </div>
                <div>
                  <Label className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>Email *</Label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>Phone Number *</Label>
                  <Input
                    placeholder="+92 300 1234567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                  />
                </div>
                <div>
                  <Label className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>CNIC Number *</Label>
                  <Input
                    placeholder="12345-1234567-1"
                    value={formData.cnic}
                    onChange={(e) => handleInputChange('cnic', e.target.value)}
                    className={`${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                  />
                </div>
              </div>

              {/* Address Field */}
              <div>
                <Label className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'} flex items-center gap-2`}>
                  <MapPin className="size-4" />
                  Address *
                </Label>
                <Textarea
                  placeholder="Enter your complete address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className={`${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLocationModal(true)}
                  className={`mt-2 ${isDarkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-[#1F2933]'}`}
                >
                  <MapPin className="size-4 mr-2" />
                  Select Location
                </Button>
              </div>

              <div>
                <Label className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>City *</Label>
                <Input
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                />
              </div>

              {/* User Type Specific Fields */}
              {userType === 'client' && (
                <div>
                  <Label className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>Company Name (Optional)</Label>
                  <Input
                    placeholder="Your company name"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className={`${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                  />
                </div>
              )}

              {userType === 'manufacturer' && (
                <>
                  <div>
                    <Label className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>Business Name *</Label>
                    <Input
                      placeholder="Your business name"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      className={`${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                    />
                  </div>
                  <div>
                    <Label className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>Factory Address</Label>
                    <Textarea
                      placeholder="Factory location"
                      value={formData.factoryAddress}
                      onChange={(e) => handleInputChange('factoryAddress', e.target.value)}
                      rows={2}
                      className={`${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                    />
                  </div>
                </>
              )}

              {userType === 'labour' && (
                <>
                  <div>
                    <Label className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>Primary Skill *</Label>
                    <Input
                      placeholder="e.g. Master Tailor, Fabric Cutter"
                      value={formData.skill}
                      onChange={(e) => handleInputChange('skill', e.target.value)}
                      className={`${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                    />
                  </div>
                  <div>
                    <Label className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>Years of Experience</Label>
                    <Input
                      placeholder="e.g. 5 years"
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      className={`${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                    />
                  </div>
                </>
              )}

              {/* Password Creation Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'} flex items-center gap-2`}>
                    <Lock className="size-4" />
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`pr-10 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400 hover:text-[#F9FAFB]' : 'text-gray-500 hover:text-[#1F2933]'}`}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`pr-10 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400 hover:text-[#F9FAFB]' : 'text-gray-500 hover:text-[#1F2933]'}`}
                    >
                      {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleBasicSubmit}
                className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white mt-6"
              >
                Continue to Verification
              </Button>
            </div>
          )}

          {/* VERIFICATION STEP */}
          {step === 'verification' && (
            <div className="space-y-6">
              {/* CNIC Upload */}
              <div>
                <Label className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'} flex items-center gap-2 mb-3`}>
                  <CreditCard className="size-4" />
                  CNIC Upload *
                </Label>
                <input
                  type="file"
                  ref={cnicInputRef}
                  onChange={handleCnicUpload}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                <div 
                  onClick={() => cnicInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    cnicFile 
                      ? `border-[#2563EB] ${isDarkMode ? 'bg-[#2563EB]/10' : 'bg-[#2563EB]/5'}` 
                      : `${isDarkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'}`
                  }`}
                >
                  {cnicFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <CheckCircle className="size-6 text-[#2563EB]" />
                      <div className="text-left">
                        <p className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{cnicFile.name}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>CNIC uploaded successfully</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload className={`size-8 mx-auto mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <p className={`mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Click to upload CNIC</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Supported: JPG, PNG, PDF</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Selfie Capture */}
              <div>
                <Label className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'} flex items-center gap-2 mb-3`}>
                  <Camera className="size-4" />
                  Selfie Verification *
                </Label>
                {selfieData ? (
                  <div className={`border-2 border-[#2563EB] rounded-lg p-4 ${isDarkMode ? 'bg-[#2563EB]/10' : 'bg-[#2563EB]/5'}`}>
                    <div className="flex items-center gap-4">
                      <img 
                        src={selfieData} 
                        alt="Selfie" 
                        className="size-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="size-5 text-[#2563EB]" />
                          <p className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Selfie captured successfully</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowSelfieCapture(true)}
                          className={`${isDarkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-[#1F2933]'}`}
                        >
                          Retake Selfie
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => setShowSelfieCapture(true)}
                    variant="outline"
                    className={`w-full ${isDarkMode ? 'border-gray-700 text-gray-300 hover:text-[#F9FAFB]' : 'border-gray-300 text-[#1F2933] hover:text-[#1F2933]'}`}
                  >
                    <Camera className="size-4 mr-2" />
                    Capture Selfie
                  </Button>
                )}
              </div>

              {/* Policies Box */}
              <div>
                <Label className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'} flex items-center gap-2 mb-3`}>
                  <ShieldCheck className="size-4" />
                  Platform Policies
                </Label>
                <div className={`border rounded-lg overflow-hidden ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                  <div className={`h-52 overflow-y-scroll p-4 space-y-3 ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
                    {POLICIES.map((p, i) => (
                      <div key={i}>
                        <p className={`text-sm font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{p.title}</p>
                        <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{p.text}</p>
                      </div>
                    ))}
                  </div>
                  <div className={`px-4 py-3 border-t ${isDarkMode ? 'border-gray-700 bg-[#2A3642]' : 'border-gray-300 bg-white'}`}>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={policiesAccepted}
                        onChange={(e) => setPoliciesAccepted(e.target.checked)}
                        className="size-4 accent-[#2563EB] cursor-pointer"
                      />
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                        I Agree to Policies
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep('basic')}
                  className={`flex-1 ${isDarkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-[#1F2933]'}`}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleVerificationSubmit}
                  disabled={!policiesAccepted}
                  className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit for Verification
                </Button>
              </div>
            </div>
          )}

          {/* VERIFYING STATE */}
          {step === 'verifying' && (
            <div className="py-12 text-center">
              <div className={`size-24 rounded-full flex items-center justify-center mx-auto mb-6 ${isDarkMode ? 'bg-[#2563EB]/10' : 'bg-[#2563EB]/5'}`}>
                <Loader2 className="size-12 text-[#2563EB] animate-spin" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="size-5 text-[#2563EB]" />
                <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Verification in Progress</h3>
              </div>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Please wait while we verify your documents...
              </p>
              <div className="max-w-md mx-auto space-y-3">
                <div className={`flex items-center gap-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="size-2 bg-[#2563EB] rounded-full animate-pulse"></div>
                  <span>Validating CNIC document</span>
                </div>
                <div className={`flex items-center gap-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="size-2 bg-[#2563EB] rounded-full animate-pulse"></div>
                  <span>Verifying selfie with CNIC</span>
                </div>
                <div className={`flex items-center gap-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="size-2 bg-[#2563EB] rounded-full animate-pulse"></div>
                  <span>Checking information accuracy</span>
                </div>
              </div>
            </div>
          )}

          {/* VERIFIED STATE */}
          {step === 'verified' && (
            <div className="py-12 text-center">
              <div className={`size-24 rounded-full flex items-center justify-center mx-auto mb-6 ${isDarkMode ? 'bg-[#2563EB]/10' : 'bg-[#2563EB]/5'}`}>
                <CheckCircle className="size-12 text-[#2563EB]" />
              </div>
              <h3 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Verified ✔</h3>
              <p className={`mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Your account has been successfully verified!
              </p>
              <div className={`max-w-md mx-auto border-2 border-[#2563EB] rounded-lg p-6 mb-6 ${isDarkMode ? 'bg-[#2563EB]/10' : 'bg-[#2563EB]/5'}`}>
                <div className="space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Name:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{formData.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{formData.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>CNIC:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{formData.cnic}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status:</span>
                    <Badge className="bg-[#2563EB] text-white">
                      <CheckCircle className="size-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>
              </div>
              <Button 
                onClick={handleComplete}
                className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-8"
              >
                Continue to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selfie Capture Modal */}
      {showSelfieCapture && (
        <SelfieCaptureModal 
          onCapture={handleSelfieCapture}
          onClose={() => setShowSelfieCapture(false)}
        />
      )}

      {/* Location Modal */}
      {showLocationModal && (
        <LocationModal
          onSelect={handleLocationSelect}
          onClose={() => setShowLocationModal(false)}
        />
      )}
    </div>
  );
}
/*Handles user registration with multi-step verification (basic info + CNIC, selfie, video) and account validation process.

This is a frontend React component, mainly for web-based apps (can be adapted for mobile but built for web UI). */