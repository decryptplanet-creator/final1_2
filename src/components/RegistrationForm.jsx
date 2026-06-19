import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, Upload, Check, Eye, EyeOff, MapPin, Lock, 
  CreditCard, Camera, Loader2, CheckCircle, Video,
  Briefcase, Factory, HardHat, X, Sparkles, FileText, Barcode, ShieldCheck,
  Languages
} from 'lucide-react';

// ─── Nastaliq Font ────────────────────────────────────────────────────────────
const nastaliqStyle = {
  fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif",
  direction: 'rtl',
  lineHeight: '2.2',
};

// ─── Urdu Translations ────────────────────────────────────────────────────────
const translations = {
  en: {
    registerAs: 'Register as',
    step1: 'Step 1: Basic Information',
    step2: 'Step 2: Upload Documents',
    fullName: 'Full Name *',
    fullNamePlaceholder: 'Enter your full name',
    email: 'Email Address *',
    emailPlaceholder: 'your.email@example.com',
    phone: 'Phone Number *',
    phonePlaceholder: '+92 300 1234567',
    cnic: 'CNIC Number *',
    cnicPlaceholder: '12345-1234567-1',
    address: 'Address *',
    addressPlaceholder: 'Enter your address',
    verifyGPS: 'Verify GPS',
    update: 'Update',
    gpsVerified: 'GPS Verified',
    skills: 'Skills (comma separated) *',
    skillsPlaceholder: 'e.g. Stitching, Pattern Making, Embroidery',
    dailyRate: 'Daily Rate (PKR) *',
    dailyRatePlaceholder: 'e.g. 800',
    experience: 'Years of Experience',
    experiencePlaceholder: 'e.g. 5 years',
    workHistory: 'Work History',
    workHistoryPlaceholder: 'Describe your previous work experience...',
    password: 'Password *',
    passwordPlaceholder: 'Minimum 8 characters',
    confirmPassword: 'Confirm Password *',
    confirmPasswordPlaceholder: 'Re-enter password',
    continue: 'Continue to Verification',
    uploadCNIC: 'Upload CNIC (Front & Back) *',
    cnicFront: 'CNIC front',
    cnicBack: 'CNIC back',
    uploadFront: 'Upload front',
    uploadBack: 'Upload back',
    changeFront: 'Change front',
    changeBack: 'Change back',
    cnicUploaded: 'CNIC Uploaded Successfully',
    uploadDifferent: 'Upload Different Image',
    selfie: 'Capture Selfie for Verification *',
    selfieDesc: 'Capture a clear selfie for face verification',
    openCamera: 'Open Camera',
    selfieCaptured: 'Selfie Captured Successfully',
    retakeSelfie: 'Retake Selfie',
    skillsVideo: 'Upload Skills Video',
    videoDesc: 'Upload a video showcasing your skills',
    selectVideo: 'Select Video',
    videoUploaded: 'Video Uploaded Successfully',
    uploadDiffVideo: 'Upload Different Video',
    policies: 'Platform Policies',
    agreePolicy: 'I Agree to Policies',
    submit: 'Submit for Verification',
    verifying: 'Verifying Your Documents',
    verifyingDesc: 'Please wait while we verify your identity...',
    checkCNIC: 'Checking CNIC authenticity...',
    matchSelfie: 'Matching selfie with CNIC photo...',
    validating: 'Validating information...',
    verified: 'Verification Successful!',
    verifiedDesc: 'Your account has been verified',
    trustScore: 'Trust Score: 95/100',
    goToDashboard: 'Continue to Dashboard',
    labour: 'Labour',
    notUploaded: 'Not uploaded yet',
    coordinates: 'Coordinates',
  },
  ur: {
    registerAs: 'رجسٹر کریں بطور',
    step1: 'مرحلہ ۱: بنیادی معلومات',
    step2: 'مرحلہ ۲: دستاویزات اپلوڈ کریں',
    fullName: 'پورا نام *',
    fullNamePlaceholder: 'اپنا پورا نام لکھیں',
    email: 'ای میل *',
    emailPlaceholder: 'آپ کی ای میل',
    phone: 'فون نمبر *',
    phonePlaceholder: '۰۳۰۰-۱۲۳۴۵۶۷',
    cnic: 'شناختی کارڈ نمبر *',
    cnicPlaceholder: '12345-1234567-1',
    address: 'پتہ *',
    addressPlaceholder: 'اپنا پتہ لکھیں',
    verifyGPS: 'جی پی ایس تصدیق',
    update: 'تبدیل کریں',
    gpsVerified: 'جی پی ایس تصدیق شدہ',
    skills: 'ہنر (کاما سے الگ کریں) *',
    skillsPlaceholder: 'مثلاً سلائی، کٹائی، کڑھائی',
    dailyRate: 'روزانہ اجرت (روپے) *',
    dailyRatePlaceholder: 'مثلاً ۸۰۰',
    experience: 'تجربہ (سال)',
    experiencePlaceholder: 'مثلاً ۵ سال',
    workHistory: 'کام کی تاریخ',
    workHistoryPlaceholder: 'اپنا پچھلا کام کا تجربہ بتائیں...',
    password: 'پاس ورڈ *',
    passwordPlaceholder: 'کم از کم ۸ حروف',
    confirmPassword: 'پاس ورڈ دوبارہ *',
    confirmPasswordPlaceholder: 'پاس ورڈ دوبارہ لکھیں',
    continue: 'تصدیق کی طرف جائیں',
    uploadCNIC: 'شناختی کارڈ اپلوڈ کریں (آگے اور پیچھے) *',
    cnicFront: 'شناختی کارڈ سامنے',
    cnicBack: 'شناختی کارڈ پیچھے',
    uploadFront: 'سامنے اپلوڈ کریں',
    uploadBack: 'پیچھے اپلوڈ کریں',
    changeFront: 'سامنے تبدیل کریں',
    changeBack: 'پیچھے تبدیل کریں',
    cnicUploaded: 'شناختی کارڈ کامیابی سے اپلوڈ ہو گیا',
    uploadDifferent: 'دوسری تصویر اپلوڈ کریں',
    selfie: 'تصدیق کے لیے سیلفی لیں *',
    selfieDesc: 'اپنی واضح سیلفی لیں',
    openCamera: 'کیمرہ کھولیں',
    selfieCaptured: 'سیلفی کامیابی سے لی گئی',
    retakeSelfie: 'دوبارہ سیلفی لیں',
    skillsVideo: 'ہنر کی ویڈیو اپلوڈ کریں',
    videoDesc: 'اپنا ہنر دکھانے والی ویڈیو اپلوڈ کریں',
    selectVideo: 'ویڈیو منتخب کریں',
    videoUploaded: 'ویڈیو کامیابی سے اپلوڈ ہو گئی',
    uploadDiffVideo: 'دوسری ویڈیو اپلوڈ کریں',
    policies: 'پلیٹ فارم پالیسیاں',
    agreePolicy: 'میں پالیسیوں سے اتفاق کرتا/کرتی ہوں',
    submit: 'تصدیق کے لیے جمع کریں',
    verifying: 'دستاویزات کی تصدیق ہو رہی ہے',
    verifyingDesc: 'براہ کرم انتظار کریں...',
    checkCNIC: 'شناختی کارڈ کی جانچ ہو رہی ہے...',
    matchSelfie: 'سیلفی اور شناختی کارڈ کا موازنہ...',
    validating: 'معلومات کی تصدیق ہو رہی ہے...',
    verified: 'تصدیق کامیاب!',
    verifiedDesc: 'آپ کا اکاؤنٹ تصدیق شدہ ہے',
    trustScore: 'اعتماد اسکور: ۹۵/۱۰۰',
    goToDashboard: 'ڈیش بورڈ پر جائیں',
    labour: 'مزدور',
    notUploaded: 'ابھی اپلوڈ نہیں ہوا',
    coordinates: 'کوآرڈینیٹ',
  }
};

const POLICIES = [
  { title: '1. Fraud Policy (PPC Sections 415–420)', text: 'Any user involved in fraud, deception, or dishonest activities shall be held accountable under applicable Pakistani laws.' },
  { title: '2. Payment Policy (PPC Sections 23, 24, 25)', text: 'Clients and manufacturers must make agreed payments on time. Intentional non-payment may result in legal action.' },
  { title: '3. False Information Policy (PPC Sections 24, 25)', text: 'Users must provide accurate personal, business, and professional information on the platform.' },
  { title: '4. Forgery Policy (PPC Sections 463–471)', text: 'Submitting fake documents, contracts, certificates, or identification records is strictly prohibited.' },
  { title: '5. Impersonation Policy (PPC Sections 416, 419)', text: "No user may create an account or conduct activities using another person's or company's identity." },
  { title: '6. Abuse and Harassment Policy (PPC Sections 504, 509)', text: 'Abusive language, harassment, offensive behavior, or misconduct toward any user is prohibited.' },
  { title: '7. Criminal Intimidation Policy (PPC Sections 503, 506)', text: 'Threats, coercion, blackmail, or intimidation of any user may result in legal action.' },
  { title: '8. Theft and Misuse Policy (PPC Sections 378, 379)', text: "Unauthorized use, theft, or misuse of another user's property, products, materials, or information is prohibited." },
  { title: '9. Account Suspension Policy', text: 'Users who repeatedly violate platform policies after warnings may have their accounts suspended or permanently terminated.' },
  { title: '10. Legal Compliance Policy', text: 'All users agree to comply with the laws of Pakistan, and serious violations may be reported to the relevant authorities for legal proceedings.' },
];

const POLICIES_UR = [
  { title: '۱. دھوکہ دہی پالیسی', text: 'کوئی بھی صارف جو دھوکہ دہی میں ملوث ہو، پاکستانی قانون کے تحت جوابدہ ہوگا۔' },
  { title: '۲. ادائیگی پالیسی', text: 'طے شدہ ادائیگی وقت پر کرنا ضروری ہے۔ جان بوجھ کر نہ دینے پر قانونی کارروائی ہو سکتی ہے۔' },
  { title: '۳. غلط معلومات پالیسی', text: 'صارفین کو درست ذاتی اور پیشہ ورانہ معلومات فراہم کرنی ہوں گی۔' },
  { title: '۴. جعل سازی پالیسی', text: 'جعلی دستاویزات یا شناخت جمع کرانا سختی سے منع ہے۔' },
  { title: '۵. نقالی پالیسی', text: 'کسی اور کی شناخت سے اکاؤنٹ بنانا یا کام کرنا ممنوع ہے۔' },
  { title: '۶. بدسلوکی پالیسی', text: 'کسی بھی صارف سے بدتمیزی یا ہراسانی ممنوع ہے۔' },
  { title: '۷. دھمکی پالیسی', text: 'کسی کو دھمکی دینا یا بلیک میل کرنا قانونی کارروائی کا باعث بن سکتا ہے۔' },
  { title: '۸. چوری پالیسی', text: 'کسی کی چیز یا معلومات کا غیر مجاز استعمال ممنوع ہے۔' },
  { title: '۹. اکاؤنٹ معطلی پالیسی', text: 'بار بار خلاف ورزی پر اکاؤنٹ بند کیا جا سکتا ہے۔' },
  { title: '۱۰. قانونی تعمیل پالیسی', text: 'تمام صارفین پاکستانی قوانین کی پابندی کریں۔ سنگین خلاف ورزی پر قانونی کارروائی ہو سکتی ہے۔' },
];

import { SelfieCaptureModal } from './SelfieCaptureModal';
import { LocationModal } from './LocationModal';
import { useTheme } from '../contexts/ThemeContext';

export function EnhancedRegistrationForm({ userType, onComplete, onBack }) {
  const { isDarkMode } = useTheme();
  const [step, setStep] = useState('basic');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSelfieCapture, setShowSelfieCapture] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [policiesAccepted, setPoliciesAccepted] = useState(false);

  // ✅ Urdu toggle — sirf Labour ke liye
  const [isUrdu, setIsUrdu] = useState(false);
  const t = isUrdu ? translations.ur : translations.en;
  // Normalized check: trims spaces aur case ko ignore karta hai, taake agar
  // parent se "Labour" / " labour " / "LABOUR" jaisi value aaye to bhi button dikhe.
  const isLabour = String(userType || '').trim().toLowerCase() === 'labour';

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', password: '', confirmPassword: '',
    cnic: '', skills: [], rate: '', experience: '', videoProfile: null, workHistory: '',
    companyName: '', productionCapacity: '', pricing: '', affidavitCode: '',
    businessDocuments: null, businessType: '',
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

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleCnicFrontUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) { setCnicFrontFile(file); setCnicFrontUploaded(true); e.target.value = ''; }
  };
  const handleCnicBackUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) { setCnicBackFile(file); setCnicBackUploaded(true); e.target.value = ''; }
  };
  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) { setFormData(prev => ({ ...prev, videoProfile: file })); setVideoUploaded(true); }
  };
  const handleBusinessDocUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) { setFormData(prev => ({ ...prev, businessDocuments: file })); setBusinessDocUploaded(true); }
  };
  const handleSelfieCapture = (imageData) => {
    setSelfieData(imageData); setSelfieCaptured(true); setShowSelfieCapture(false);
  };
  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setFormData(prev => ({ ...prev, address: selectedLocation.address }));
    setLocationVerified(true);
    setShowLocationModal(false);
  };

  const isVerificationLocationReady =
    (locationVerified && location != null) || Boolean(formData.address?.trim());

  const handleBasicSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.password) {
      alert(isUrdu ? 'براہ کرم تمام ضروری خانے بھریں' : 'Please fill all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert(isUrdu ? 'پاس ورڈ مماثل نہیں ہیں' : 'Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      alert(isUrdu ? 'پاس ورڈ کم از کم ۸ حروف کا ہونا چاہیے' : 'Password must be at least 8 characters');
      return;
    }
    if (userType === 'manufacturer' && (!formData.companyName || !formData.productionCapacity)) {
      alert('Please fill manufacturer details'); return;
    }
    if (userType === 'labour' && (!formData.skills.length || !formData.rate)) {
      alert(isUrdu ? 'براہ کرم ہنر اور اجرت بھریں' : 'Please fill labour details'); return;
    }
    setStep('verification');
  };

  const handleVerificationSubmit = () => {
    if (!cnicFrontUploaded || !cnicFrontFile) {
      alert(isUrdu ? 'شناختی کارڈ کا سامنے والا حصہ اپلوڈ کریں' : 'Please upload CNIC front image'); return;
    }
    if (!cnicBackUploaded || !cnicBackFile) {
      alert(isUrdu ? 'شناختی کارڈ کا پیچھے والا حصہ اپلوڈ کریں' : 'Please upload CNIC back image'); return;
    }
    if (!selfieCaptured || !selfieData) {
      alert(isUrdu ? 'سیلفی لینا ضروری ہے' : 'Please capture your live selfie for AI verification'); return;
    }
    if (!isVerificationLocationReady) {
      alert(isUrdu ? 'پتہ درج کریں' : 'Please enter your address'); return;
    }
    if (!policiesAccepted) {
      alert(isUrdu ? 'پالیسیوں سے اتفاق کریں' : 'Please accept the Platform Policies to continue'); return;
    }
    setStep('verifying');
    setTimeout(() => setStep('verified'), 3000);
  };

  const handleComplete = () => {
    const userData = {
      name: formData.name, email: formData.email, phone: formData.phone,
      cnic: formData.cnic, address: formData.address,
      location: location || undefined,
      skills: formData.skills.length > 0 ? formData.skills : undefined,
      rate: formData.rate ? Number(formData.rate) : undefined,
      videoProfile: formData.videoProfile ? URL.createObjectURL(formData.videoProfile) : undefined,
      documents: [], isVerified: true, trustScore: 50,
    };
    if (cnicFrontFile) userData.documents.push({ type: 'CNIC Front', file: cnicFrontFile });
    if (cnicBackFile) userData.documents.push({ type: 'CNIC Back', file: cnicBackFile });
    if (userType === 'manufacturer' && formData.businessDocuments) {
      userData.documents.push({ type: 'Business Documents', file: formData.businessDocuments });
    }
    onComplete(userData);
  };

  const getUserTypeIcon = () => {
    if (userType === 'client') return <Briefcase className="size-6" />;
    if (userType === 'manufacturer') return <Factory className="size-6" />;
    if (userType === 'labour') return <HardHat className="size-6" />;
  };

  // ✅ Language toggle — sirf Labour ke liye render hota hai (isLabour check).
  // Ye component CardHeader ke andar, title ke saath same row mein render hoga,
  // taake hamesha visible rahe — kisi separate bar par depend nahi karta.
  const LanguageToggle = () => !isLabour ? null : (
    <button
      type="button"
      onClick={() => setIsUrdu(!isUrdu)}
      aria-label={isUrdu ? 'Switch to English' : 'اردو میں دیکھیں'}
      className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-bold transition-all"
      style={{
        background: isUrdu ? '#fff' : 'rgba(255,255,255,0.18)',
        color: isUrdu ? '#2563EB' : '#fff',
        border: '1.5px solid #fff',
        fontFamily: "'Noto Nastaliq Urdu', serif",
        direction: 'ltr',
        cursor: 'pointer',
      }}
    >
      <Languages className="size-4" />
      {isUrdu ? 'English' : 'اردو'}
    </button>
  );

  // ─── STEP: BASIC ─────────────────────────────────────────────────────────────
  if (step === 'basic') {
    return (
      <div
        className={`min-h-screen ${isDarkMode ? 'bg-[#1F2933]' : 'bg-[#F9FAFB]'} flex items-center justify-center p-4`}
        style={isUrdu ? { direction: 'rtl' } : {}}
      >
        {/* Nastaliq font load */}
        {isUrdu && (
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap"
            rel="stylesheet"
          />
        )}

        <Card className={`w-full max-w-2xl shadow-xl ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader className="bg-[#2563EB] text-white rounded-t-lg">
            <div className="flex items-center justify-between gap-3">
              <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-[#1d4ed8] shrink-0">
                <ArrowLeft className="size-5" />
              </Button>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="size-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  {getUserTypeIcon()}
                </div>
                <div className="min-w-0" style={isUrdu ? nastaliqStyle : {}}>
                  <CardTitle className="text-xl truncate">
                    {t.registerAs} {isLabour ? t.labour : userType === 'manufacturer' ? 'Manufacturer' : 'Client'}
                  </CardTitle>
                  <p className="text-sm text-white/90">{t.step1}</p>
                </div>
              </div>
              <LanguageToggle />
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">

            {/* Full Name */}
            <div>
              <Label style={isUrdu ? nastaliqStyle : {}} className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>
                {t.fullName}
              </Label>
              <Input
                placeholder={t.fullNamePlaceholder}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                style={isUrdu ? { direction: 'rtl' } : {}}
                className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
              />
            </div>

            {/* Email */}
            <div>
              <Label style={isUrdu ? nastaliqStyle : {}} className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>
                {t.email}
              </Label>
              <Input
                type="email"
                placeholder={t.emailPlaceholder}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                style={{ direction: 'ltr' }}
              />
            </div>

            {/* Phone */}
            <div>
              <Label style={isUrdu ? nastaliqStyle : {}} className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>
                {t.phone}
              </Label>
              <Input
                placeholder={t.phonePlaceholder}
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                style={{ direction: 'ltr' }}
              />
            </div>

            {/* CNIC */}
            <div>
              <Label style={isUrdu ? nastaliqStyle : {}} className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>
                {t.cnic}
              </Label>
              <Input
                placeholder={t.cnicPlaceholder}
                value={formData.cnic}
                onChange={(e) => handleInputChange('cnic', e.target.value)}
                className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                style={{ direction: 'ltr' }}
              />
            </div>

            {/* Address */}
            <div>
              <Label style={isUrdu ? nastaliqStyle : {}} className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>
                {t.address}{' '}
                {locationVerified && (
                  <Badge variant="outline" className="ml-2 text-xs bg-green-500/10 text-green-600 border-green-500">
                    {t.gpsVerified}
                  </Badge>
                )}
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  placeholder={t.addressPlaceholder}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  style={isUrdu ? { direction: 'rtl' } : {}}
                  className={`flex-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                />
                <Button type="button" onClick={() => setShowLocationModal(true)} className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white">
                  <MapPin className="size-4 mr-1" />
                  <span style={isUrdu ? nastaliqStyle : {}}>{locationVerified ? t.update : t.verifyGPS}</span>
                </Button>
              </div>
              {location && (
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} style={{ direction: 'ltr' }}>
                  {t.coordinates}: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              )}
            </div>

            {/* Labour Fields */}
            {userType === 'labour' && (
              <>
                <div>
                  <Label style={isUrdu ? nastaliqStyle : {}} className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>
                    {t.skills}
                  </Label>
                  <Input
                    placeholder={t.skillsPlaceholder}
                    value={formData.skills.join(', ')}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                    }))}
                    style={isUrdu ? { direction: 'rtl' } : {}}
                    className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                  />
                </div>
                <div>
                  <Label style={isUrdu ? nastaliqStyle : {}} className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>
                    {t.dailyRate}
                  </Label>
                  <Input
                    type="number"
                    placeholder={t.dailyRatePlaceholder}
                    value={formData.rate}
                    onChange={(e) => handleInputChange('rate', e.target.value)}
                    className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                    style={{ direction: 'ltr' }}
                  />
                </div>
                <div>
                  <Label style={isUrdu ? nastaliqStyle : {}} className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>
                    {t.experience}
                  </Label>
                  <Input
                    placeholder={t.experiencePlaceholder}
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    style={isUrdu ? { direction: 'rtl' } : {}}
                    className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                  />
                </div>
                <div>
                  <Label style={isUrdu ? nastaliqStyle : {}} className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>
                    {t.workHistory}
                  </Label>
                  <Textarea
                    placeholder={t.workHistoryPlaceholder}
                    value={formData.workHistory}
                    onChange={(e) => handleInputChange('workHistory', e.target.value)}
                    style={isUrdu ? { ...nastaliqStyle, direction: 'rtl' } : {}}
                    className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                    rows={3}
                  />
                </div>
              </>
            )}

            {/* Manufacturer Fields */}
            {userType === 'manufacturer' && (
              <>
                <div>
                  <Label className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>Company Name *</Label>
                  <Input
                    placeholder="Enter company/factory name"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                  />
                </div>
                <div>
                  <Label className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>Production Capacity *</Label>
                  <Input
                    placeholder="e.g., 1000 units/month"
                    value={formData.productionCapacity}
                    onChange={(e) => handleInputChange('productionCapacity', e.target.value)}
                    className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                  />
                </div>
                <div>
                  <Label className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>Pricing (PKR/unit)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 500"
                    value={formData.pricing}
                    onChange={(e) => handleInputChange('pricing', e.target.value)}
                    className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                  />
                </div>
              </>
            )}

            {/* Client Field */}
            {userType === 'client' && (
              <div>
                <Label className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>Business Type</Label>
                <Input
                  placeholder="e.g., Textile Exporter"
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                />
              </div>
            )}

            {/* Password */}
            <div>
              <Label style={isUrdu ? nastaliqStyle : {}} className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>
                {t.password}
              </Label>
              <div className="relative mt-1">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t.passwordPlaceholder}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  style={{ direction: 'ltr' }}
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

            {/* Confirm Password */}
            <div>
              <Label style={isUrdu ? nastaliqStyle : {}} className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>
                {t.confirmPassword}
              </Label>
              <div className="relative mt-1">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={t.confirmPasswordPlaceholder}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  style={{ direction: 'ltr' }}
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
              style={isUrdu ? nastaliqStyle : {}}
            >
              {t.continue}
            </Button>

          </CardContent>
        </Card>

        {showLocationModal && (
          <LocationModal onClose={() => setShowLocationModal(false)} onSelect={handleLocationSelect} />
        )}
      </div>
    );
  }

  // ─── STEP: VERIFICATION ───────────────────────────────────────────────────────
  if (step === 'verification') {
    return (
      <div
        className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4"
        style={isUrdu ? { direction: 'rtl' } : {}}
      >
        {isUrdu && (
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap"
            rel="stylesheet"
          />
        )}

        <Card className="w-full max-w-2xl shadow-xl bg-white border border-gray-200">
          <CardHeader className="bg-[#2563EB] text-white rounded-t-lg">
            <div className="flex items-center justify-between gap-3">
              <Button variant="ghost" size="icon" onClick={() => setStep('basic')} className="text-white hover:bg-[#1d4ed8] shrink-0">
                <ArrowLeft className="size-5" />
              </Button>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="size-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <CreditCard className="size-6" />
                </div>
                <div className="min-w-0" style={isUrdu ? nastaliqStyle : {}}>
                  <CardTitle className="text-xl truncate">
                    {isUrdu ? 'شناخت کی تصدیق' : 'Identity Verification'}
                  </CardTitle>
                  <p className="text-sm text-white/90">{t.step2}</p>
                </div>
              </div>
              <LanguageToggle />
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">

            {/* CNIC Upload */}
            <div>
              <Label style={isUrdu ? nastaliqStyle : {}}>{t.uploadCNIC}</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input ref={cnicFrontInputRef} type="file" accept="image/*" onChange={handleCnicFrontUpload} className="sr-only" />
                <input ref={cnicBackInputRef} type="file" accept="image/*" onChange={handleCnicBackUpload} className="sr-only" />
                {cnicFrontUploaded && cnicBackUploaded ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="size-12 text-[#2563EB]" />
                    <p className="text-sm text-gray-700" style={isUrdu ? nastaliqStyle : {}}>{t.cnicUploaded}</p>
                    <p className="text-xs text-gray-500" style={{ direction: 'ltr' }}>
                      {cnicFrontFile?.name}, {cnicBackFile?.name}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setCnicFrontFile(null); setCnicBackFile(null);
                        setCnicFrontUploaded(false); setCnicBackUploaded(false);
                      }}
                      className="mt-2"
                      style={isUrdu ? nastaliqStyle : {}}
                    >
                      {t.uploadDifferent}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 text-left">
                    {/* Front */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-md border border-gray-200 p-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800" style={isUrdu ? nastaliqStyle : {}}>{t.cnicFront}</p>
                        <p className="text-xs text-gray-500 mt-1" style={isUrdu ? nastaliqStyle : {}}>
                          {cnicFrontUploaded ? cnicFrontFile?.name : t.notUploaded}
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={() => cnicFrontInputRef.current?.click()}
                        className="bg-[#2563EB] hover:bg-[#1d4ed8]"
                        style={isUrdu ? nastaliqStyle : {}}
                      >
                        <Upload className="size-4 mr-2" />
                        {cnicFrontUploaded ? t.changeFront : t.uploadFront}
                      </Button>
                    </div>
                    {/* Back */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-md border border-gray-200 p-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800" style={isUrdu ? nastaliqStyle : {}}>{t.cnicBack}</p>
                        <p className="text-xs text-gray-500 mt-1" style={isUrdu ? nastaliqStyle : {}}>
                          {cnicBackUploaded ? cnicBackFile?.name : t.notUploaded}
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={() => cnicBackInputRef.current?.click()}
                        className="bg-[#2563EB] hover:bg-[#1d4ed8]"
                        style={isUrdu ? nastaliqStyle : {}}
                      >
                        <Upload className="size-4 mr-2" />
                        {cnicBackUploaded ? t.changeBack : t.uploadBack}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Selfie */}
            <div>
              <Label style={isUrdu ? nastaliqStyle : {}}>{t.selfie}</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {selfieCaptured ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                      <img src={selfieData} alt="Selfie" className="size-32 rounded-full object-cover" />
                      <CheckCircle className="absolute -top-1 -right-1 size-8 text-[#2563EB] bg-white rounded-full" />
                    </div>
                    <p className="text-sm text-gray-700" style={isUrdu ? nastaliqStyle : {}}>{t.selfieCaptured}</p>
                    <Button
                      variant="outline"
                      onClick={() => { setSelfieData(null); setSelfieCaptured(false); setShowSelfieCapture(true); }}
                      className="mt-2"
                      style={isUrdu ? nastaliqStyle : {}}
                    >
                      {t.retakeSelfie}
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Camera className="size-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2" style={isUrdu ? nastaliqStyle : {}}>{t.selfieDesc}</p>
                    <Button
                      onClick={() => setShowSelfieCapture(true)}
                      className="bg-[#2563EB] hover:bg-[#1d4ed8]"
                      style={isUrdu ? nastaliqStyle : {}}
                    >
                      <Camera className="size-4 mr-2" />{t.openCamera}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Labour Video */}
            {userType === 'labour' && (
              <div>
                <Label style={isUrdu ? nastaliqStyle : {}}>{t.skillsVideo}</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                  {videoUploaded ? (
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle className="size-12 text-[#2563EB]" />
                      <p className="text-sm text-gray-700" style={isUrdu ? nastaliqStyle : {}}>{t.videoUploaded}</p>
                      <p className="text-xs text-gray-500" style={{ direction: 'ltr' }}>{formData.videoProfile?.name}</p>
                      <Button
                        variant="outline"
                        onClick={() => { setFormData(prev => ({ ...prev, videoProfile: null })); setVideoUploaded(false); }}
                        className="mt-2"
                        style={isUrdu ? nastaliqStyle : {}}
                      >
                        {t.uploadDiffVideo}
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Video className="size-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2" style={isUrdu ? nastaliqStyle : {}}>{t.videoDesc}</p>
                      <Button
                        onClick={() => videoInputRef.current?.click()}
                        variant="outline"
                        className="border-[#2563EB] text-[#2563EB]"
                        style={isUrdu ? nastaliqStyle : {}}
                      >
                        <Video className="size-4 mr-2" />{t.selectVideo}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Manufacturer Docs */}
            {userType === 'manufacturer' && (
              <>
                <div>
                  <Label>Upload Business Documents</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input ref={businessDocInputRef} type="file" accept="application/pdf,image/*" onChange={handleBusinessDocUpload} className="hidden" />
                    {businessDocUploaded ? (
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle className="size-12 text-[#2563EB]" />
                        <p className="text-sm text-gray-700">Documents Uploaded Successfully</p>
                        <p className="text-xs text-gray-500">{formData.businessDocuments?.name}</p>
                        <Button
                          variant="outline"
                          onClick={() => { setFormData(prev => ({ ...prev, businessDocuments: null })); setBusinessDocUploaded(false); }}
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
                          className="border-[#2563EB] text-[#2563EB]"
                        >
                          <FileText className="size-4 mr-2" />Select Documents
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Affidavit Barcode/Hexadecimal Code</Label>
                  <Input
                    placeholder="Enter code here"
                    value={formData.affidavitCode}
                    onChange={(e) => handleInputChange('affidavitCode', e.target.value)}
                    className="w-full mt-1"
                  />
                </div>
              </>
            )}

            {/* Policies */}
            <div>
              <Label className="flex items-center gap-2 mb-2" style={isUrdu ? nastaliqStyle : {}}>
                <ShieldCheck className="size-4 text-[#2563EB]" />
                {t.policies}
              </Label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="h-52 overflow-y-scroll p-4 bg-gray-50 space-y-3">
                  {(isUrdu ? POLICIES_UR : POLICIES).map((p, i) => (
                    <div key={i}>
                      <p className="text-sm font-semibold text-[#1F2933]" style={isUrdu ? nastaliqStyle : {}}>{p.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5" style={isUrdu ? nastaliqStyle : {}}>{p.text}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-gray-300 bg-white">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={policiesAccepted}
                      onChange={(e) => setPoliciesAccepted(e.target.checked)}
                      className="size-4 accent-[#2563EB] cursor-pointer"
                    />
                    <span className="text-sm font-medium text-[#1F2933]" style={isUrdu ? nastaliqStyle : {}}>
                      {t.agreePolicy}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleVerificationSubmit}
              disabled={!cnicFrontUploaded || !cnicBackUploaded || !selfieCaptured || !isVerificationLocationReady || !policiesAccepted}
              className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] mt-6 disabled:opacity-50"
              style={isUrdu ? nastaliqStyle : {}}
            >
              {t.submit}
            </Button>

          </CardContent>
        </Card>

        {showSelfieCapture && (
          <SelfieCaptureModal onClose={() => setShowSelfieCapture(false)} onCapture={handleSelfieCapture} />
        )}
      </div>
    );
  }

  // ─── STEP: VERIFYING ──────────────────────────────────────────────────────────
  if (step === 'verifying') {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
        {isUrdu && (
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap"
            rel="stylesheet"
          />
        )}
        <Card className="w-full max-w-md shadow-xl bg-white border border-gray-200">
          <CardContent className="p-12 text-center">
            <div className="mb-6">
              <div className="size-20 mx-auto mb-4 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
                <Loader2 className="size-10 text-[#2563EB] animate-spin" />
              </div>
              <h3 className="text-xl font-medium mb-2" style={isUrdu ? nastaliqStyle : {}}>{t.verifying}</h3>
              <p className="text-gray-600" style={isUrdu ? nastaliqStyle : {}}>{t.verifyingDesc}</p>
            </div>
            <div className="space-y-2 text-left">
              {[t.checkCNIC, t.matchSelfie, t.validating].map((msg, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Loader2 className="size-4 text-[#2563EB] animate-spin" />
                  <span style={isUrdu ? nastaliqStyle : {}}>{msg}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── STEP: VERIFIED ───────────────────────────────────────────────────────────
  if (step === 'verified') {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
        {isUrdu && (
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap"
            rel="stylesheet"
          />
        )}
        <Card className="w-full max-w-md shadow-xl bg-white border border-gray-200">
          <CardContent className="p-12 text-center">
            <div className="size-20 mx-auto mb-6 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
              <CheckCircle className="size-12 text-[#2563EB]" />
            </div>
            <h3 className="text-2xl font-medium mb-2" style={isUrdu ? nastaliqStyle : {}}>{t.verified}</h3>
            <p className="text-gray-600 mb-2" style={isUrdu ? nastaliqStyle : {}}>{t.verifiedDesc}</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB]/10 rounded-full mb-6">
              <Sparkles className="size-4 text-[#2563EB]" />
              <span className="text-sm font-medium text-[#2563EB]" style={isUrdu ? nastaliqStyle : {}}>{t.trustScore}</span>
            </div>
            <Button
              onClick={handleComplete}
              className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]"
              style={isUrdu ? nastaliqStyle : {}}
            >
              {t.goToDashboard}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
