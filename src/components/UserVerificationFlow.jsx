import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, Upload, Check, FileText, Image as ImageIcon, Video, Sparkles, Eye, EyeOff } from 'lucide-react';
import { Badge } from './ui/badge';
import { SelfieCapture } from './SelfieCapture';

function VerificationFlow({ userType, onComplete, onBack }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    cnic: '',
    skills: '',
    rate: '',
    businessName: '',
    businessAddress: '',
    acceptTerms: false,
    acceptPPC: false,
  });
  const [cnicUploaded, setCnicUploaded] = useState(false);
  const [selfieVerified, setSelfieVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // File input refs for handling file uploads
  const exportLicenseRef = useRef(null);
  const cnicFileRef = useRef(null);
  const businessDocsRef = useRef(null);
  const workPhotosRef = useRef(null);
  const skillVideosRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (fileType) => {
    alert(`${fileType} selected successfully! (Demo mode)`);
  };

  const handleComplete = () => {
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      type: userType,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      cnic: formData.cnic,
      verified: true,
      rating: 0,
      totalReviews: 0,
      skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
      rate: formData.rate ? parseFloat(formData.rate) : undefined,
    };
    onComplete(userData);
  };

  const renderProgressBar = () => {
    const totalSteps = userType === 'client' ? 3 : userType === 'manufacturer' ? 4 : 4;
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div key={idx} className="flex items-center flex-1">
              <div className={`size-8 rounded-full flex items-center justify-center ${
                step > idx + 1 ? 'bg-green-600' : step === idx + 1 ? 'bg-red-600' : 'bg-gray-700'
              } text-white`}>
                {step > idx + 1 ? <Check className="size-5" /> : idx + 1}
              </div>
              {idx < totalSteps - 1 && (
                <div className={`h-1 flex-1 ${step > idx + 1 ? 'bg-green-600' : 'bg-gray-700'}`} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderClientVerification = () => {
    if (step === 1) {
      return (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Basic Information</CardTitle>
            <CardDescription className="text-gray-400">Enter your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">Full Name</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
              <Input 
                id="phone" 
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+92 300 1234567"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Button onClick={() => setStep(2)} className="w-full bg-red-600 hover:bg-red-700">
              Continue
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (step === 2) {
      return (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Document Verification</CardTitle>
            <CardDescription className="text-gray-400">Upload legal documents to verify exporter status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-red-600 transition-colors bg-gray-800">
              <Upload className="size-12 mx-auto mb-4 text-gray-400" />
              <p className="mb-2 text-gray-300">Upload Export License / Business Registration</p>
              <input
                ref={exportLicenseRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => e.target.files && e.target.files.length > 0 && handleFileUpload('Export License')}
              />
              <Button 
                variant="outline" 
                onClick={() => exportLicenseRef.current?.click()}
                className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
              >
                Choose Files
              </Button>
            </div>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-red-600 transition-colors bg-gray-800">
              <FileText className="size-12 mx-auto mb-4 text-gray-400" />
              <p className="mb-2 text-gray-300">Upload CNIC</p>
              <input
                ref={cnicFileRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => e.target.files && e.target.files.length > 0 && handleFileUpload('CNIC')}
              />
              <Button 
                variant="outline"
                onClick={() => cnicFileRef.current?.click()}
                className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
              >
                Choose File
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1 bg-red-600 hover:bg-red-700">
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (step === 3) {
      return (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Verification Complete</CardTitle>
            <CardDescription className="text-gray-400">Your account is ready to use</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Check className="size-5 text-green-600" />
                <span className="text-green-400">Documents Verified</span>
              </div>
              <p className="text-sm text-gray-400">
                Your documents have been verified. You can now start posting orders.
              </p>
            </div>
            <Button onClick={handleComplete} className="w-full bg-red-600 hover:bg-red-700">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      );
    }
  };

  const renderManufacturerVerification = () => {
    if (step === 1) {
      return (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Business Information</CardTitle>
            <CardDescription className="text-gray-400">Enter your business details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">Full Name</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="businessName" className="text-gray-300">Business Name</Label>
              <Input 
                id="businessName" 
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                placeholder="Your manufacturing business"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="business@example.com"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
              <Input 
                id="phone" 
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+92 300 1234567"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="cnic" className="text-gray-300">CNIC Number</Label>
              <Input 
                id="cnic" 
                value={formData.cnic}
                onChange={(e) => handleInputChange('cnic', e.target.value)}
                placeholder="12345-1234567-1"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Button onClick={() => setStep(2)} className="w-full bg-red-600 hover:bg-red-700">
              Continue
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (step === 2) {
      return (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Legal Documents</CardTitle>
            <CardDescription className="text-gray-400">Upload required legal documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-red-600 transition-colors bg-gray-800">
              <FileText className="size-12 mx-auto mb-4 text-gray-400" />
              <p className="mb-2 text-gray-300">Business Registration Documents</p>
              <input
                ref={businessDocsRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => e.target.files && e.target.files.length > 0 && handleFileUpload('Business Documents')}
              />
              <Button 
                variant="outline"
                onClick={() => businessDocsRef.current?.click()}
                className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
              >
                Choose Files
              </Button>
            </div>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-red-600 transition-colors bg-gray-800">
              <FileText className="size-12 mx-auto mb-4 text-gray-400" />
              <p className="mb-2 text-gray-300">Upload CNIC Copy</p>
              <input
                ref={cnicFileRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => e.target.files && e.target.files.length > 0 && handleFileUpload('CNIC Copy')}
              />
              <Button 
                variant="outline"
                onClick={() => cnicFileRef.current?.click()}
                className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
              >
                Choose File
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1 bg-red-600 hover:bg-red-700">
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (step === 3) {
      return (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Affidavit & Terms</CardTitle>
            <CardDescription className="text-gray-400">Review and accept terms, policies & PPC law</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border border-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto bg-gray-800">
              <h4 className="mb-2 text-white">Terms & Conditions</h4>
              <p className="text-sm text-gray-400 mb-4">
                By accepting this affidavit, you agree to comply with all platform policies, 
                manufacturing standards, and legal requirements including PPC (Pakistan Penal Code) regulations.
              </p>
              <h4 className="mb-2 text-white">Key Policies:</h4>
              <ul className="text-sm text-gray-400 space-y-1 list-disc pl-5">
                <li>Maintain quality standards for all orders</li>
                <li>Complete orders within agreed timelines</li>
                <li>Comply with PPC legal framework</li>
                <li>Provide accurate information about capabilities</li>
                <li>Maintain ethical business practices</li>
              </ul>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
              />
              <label htmlFor="terms" className="text-sm text-gray-300">
                I accept the terms and conditions
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="ppc" 
                checked={formData.acceptPPC}
                onCheckedChange={(checked) => handleInputChange('acceptPPC', checked)}
              />
              <label htmlFor="ppc" className="text-sm text-gray-300">
                I agree to comply with PPC (Pakistan Penal Code) regulations
              </label>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)} className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">
                Back
              </Button>
              <Button 
                onClick={() => setStep(4)} 
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={!formData.acceptTerms || !formData.acceptPPC}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (step === 4) {
      return (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Verification Complete</CardTitle>
            <CardDescription className="text-gray-400">Your manufacturer account is ready</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Check className="size-5 text-green-600" />
                <span className="text-green-400">Account Verified</span>
              </div>
              <p className="text-sm text-gray-400">
                Your documents and affidavit have been verified. You can now accept orders and hire labour.
              </p>
            </div>
            <Button onClick={handleComplete} className="w-full bg-red-600 hover:bg-red-700">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      );
    }
  };

  const renderLabourVerification = () => {
    if (step === 1) {
      return (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Personal Information</CardTitle>
            <CardDescription className="text-gray-400">Enter your details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">Full Name</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
              <Input 
                id="phone" 
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+92 300 1234567"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="cnic" className="text-gray-300">CNIC Number</Label>
              <Input 
                id="cnic" 
                value={formData.cnic}
                onChange={(e) => handleInputChange('cnic', e.target.value)}
                placeholder="12345-1234567-1"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="skills" className="text-gray-300">Skills (comma separated)</Label>
              <Input 
                id="skills" 
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                placeholder="e.g., Welding, Carpentry, Electrical"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="rate" className="text-gray-300">Hourly Rate (PKR)</Label>
              <Input 
                id="rate" 
                type="number"
                value={formData.rate}
                onChange={(e) => handleInputChange('rate', e.target.value)}
                placeholder="e.g., 500"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Button onClick={() => setStep(2)} className="w-full bg-red-600 hover:bg-red-700">
              Continue
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (step === 2) {
      return (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Skill Verification</CardTitle>
            <CardDescription className="text-gray-400">Upload photos and videos demonstrating your skills</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-red-600 transition-colors bg-gray-800">
              <ImageIcon className="size-12 mx-auto mb-4 text-gray-400" />
              <p className="mb-2 text-gray-300">Upload Work Photos</p>
              <p className="text-sm text-gray-500 mb-2">Show examples of your work</p>
              <input
                ref={workPhotosRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => e.target.files && e.target.files.length > 0 && handleFileUpload('Work Photos')}
              />
              <Button 
                variant="outline"
                onClick={() => workPhotosRef.current?.click()}
                className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
              >
                Choose Photos
              </Button>
            </div>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-red-600 transition-colors bg-gray-800">
              <Video className="size-12 mx-auto mb-4 text-gray-400" />
              <p className="mb-2 text-gray-300">Upload Skill Demo Videos</p>
              <p className="text-sm text-gray-500 mb-2">Demonstrate your abilities</p>
              <input
                ref={skillVideosRef}
                type="file"
                multiple
                accept=".mp4,.mov,.avi"
                className="hidden"
                onChange={(e) => e.target.files && e.target.files.length > 0 && handleFileUpload('Skill Videos')}
              />
              <Button 
                variant="outline"
                onClick={() => skillVideosRef.current?.click()}
                className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
              >
                Choose Videos
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1 bg-red-600 hover:bg-red-700">
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (step === 3) {
      return (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Labour Policies</CardTitle>
            <CardDescription className="text-gray-400">Review and accept labour policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border border-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto bg-gray-800">
              <h4 className="mb-2 text-white">Labour Policies</h4>
              <ul className="text-sm text-gray-400 space-y-2 list-disc pl-5">
                <li>Maintain professional work standards</li>
                <li>Complete assigned tasks within deadlines</li>
                <li>Follow safety protocols and guidelines</li>
                <li>Maintain honesty about skill levels</li>
                <li>Respect manufacturer and client requirements</li>
                <li>Uphold quality standards in all work</li>
              </ul>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="labourTerms" 
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
              />
              <label htmlFor="labourTerms" className="text-sm text-gray-300">
                I accept the labour policies and terms
              </label>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)} className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">
                Back
              </Button>
              <Button 
                onClick={() => setStep(4)} 
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={!formData.acceptTerms}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (step === 4) {
      return (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Verification Complete</CardTitle>
            <CardDescription className="text-gray-400">Your labour profile is ready</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Check className="size-5 text-green-600" />
                <span className="text-green-400">Skills Verified</span>
              </div>
              <p className="text-sm text-gray-400">
                Your skills have been verified. You can now be hired by manufacturers for work.
              </p>
            </div>
            <Button onClick={handleComplete} className="w-full bg-red-600 hover:bg-red-700">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-300 hover:text-red-600"
          >
            <ArrowLeft className="size-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
              <Sparkles className="size-5 text-white" />
            </div>
            <span className="text-2xl text-red-600">Skillora</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl text-white mb-2">
            {userType === 'client' ? 'Client' : userType === 'manufacturer' ? 'Manufacturer' : 'Labour'} Verification
          </h1>
          <p className="text-gray-400">
            Complete the verification process to access your account
          </p>
        </div>

        {renderProgressBar()}

        {userType === 'client' && renderClientVerification()}
        {userType === 'manufacturer' && renderManufacturerVerification()}
        {userType === 'labour' && renderLabourVerification()}
      </div>
    </div>
  );
}

export { VerificationFlow };

/* This file handles the complete user verification process (client, manufacturer, labour) with multi-step forms, document uploads, and account setup.

It is mainly web-based (React frontend UI) but can also be used in both web & app (via React Native/WebView adaptation).


 */