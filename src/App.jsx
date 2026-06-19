import { EnhancedAdminDashboard } from './components/EnhancedAdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LandingPage } from './components/LandingPage';
import { ClientDashboard } from './components/ClientDashboard';
import { ManufacturerDashboard } from './components/ManufacturerDashboard';
import { LabourDashboard } from './components/LabourDashboard';
import { MobileApp } from './components/MobileApp';
import SkilloraClassDiagram from './components/SkilloraClassDiagram';
import { EscrowDemoPage } from './components/EscrowDemoPage';
import { CompleteEnhancedRegistrationForm } from './components/CompleteEnhancedRegistrationForm';
import { AIFeaturesDemo } from './components/AIFeaturesDemo';
import { PaymentSuccessPage } from './components/PaymentSuccessPage';
import { PaymentCancelPage } from './components/PaymentCancelPage';
import { Smartphone } from 'lucide-react';

const GUEST_USERS = {
  client:       { id: 'guest_client',       type: 'client',       role: 'client',       name: 'Guest Client',       verified: false, trustScore: 50 },
  manufacturer: { id: 'guest_manufacturer', type: 'manufacturer', role: 'manufacturer', name: 'Guest Manufacturer', verified: false, trustScore: 50 },
  labour:       { id: 'guest_labour',       type: 'labour',       role: 'labour',       name: 'Guest Labour',       verified: false, trustScore: 50 },
};

const ROLE_MAP = {
  client:       '/client',
  manufacturer: '/manufacturer',
  labour:       '/labour',
  labor:        '/labour',
  admin:        '/admin',
};

function getSavedUser() {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
}

function isAdmin(user) {
  if (!user) return false;
  return (user.role || '').toLowerCase() === 'admin' || (user.type || '').toLowerCase() === 'admin';
}

function AppContent() {
  const { isDarkMode } = useTheme();
  const [currentUser, setCurrentUser]       = useState(null);
  const [showVerification, setShowVerification] = useState(null);
  const [viewMode, setViewMode]             = useState('web');
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const pathLower = window.location.pathname.toLowerCase();

  // ── Payment pages ──────────────────────────────────────────────────────────
  if (pathLower === '/payment/success') {
    return <PaymentSuccessPage onGoToDashboard={() => { window.location.href = '/'; }} />;
  }
  if (pathLower === '/payment/cancel') {
    return <PaymentCancelPage onGoToDashboard={() => { window.location.href = '/'; }} />;
  }

  const savedUser = getSavedUser();

  const logoutFn = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  // ── Direct URL routes ──────────────────────────────────────────────────────
  if (pathLower === '/client') {
    const user = (savedUser?.role === 'client' || savedUser?.type === 'client') ? savedUser : GUEST_USERS.client;
    return <ClientDashboard user={user} onLogout={logoutFn} />;
  }
  if (pathLower === '/manufacturer') {
    const user = (savedUser?.role === 'manufacturer' || savedUser?.type === 'manufacturer') ? savedUser : GUEST_USERS.manufacturer;
    return <ManufacturerDashboard user={user} onLogout={logoutFn} />;
  }
  if (pathLower === '/labour' || pathLower === '/labor') {
    const user = (savedUser?.role === 'labour' || savedUser?.role === 'labor' || savedUser?.type === 'labour' || savedUser?.type === 'labor') ? savedUser : GUEST_USERS.labour;
    return <LabourDashboard user={user} onLogout={logoutFn} />;
  }
  if (pathLower === '/admin') {
    if (!isAdmin(savedUser)) {
      return (
        <AdminLogin
          onLogin={() => { window.location.href = '/admin'; }}
          onBack={() => { window.location.href = '/'; }}
        />
      );
    }
    return <EnhancedAdminDashboard onLogout={logoutFn} />;
  }

  // ── Persistent login ───────────────────────────────────────────────────────
  useEffect(() => {
    const user  = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user && token) setCurrentUser(JSON.parse(user));
  }, []);

  const handleUserTypeSelect = (userType) => {
    if (userType === 'admin') setShowAdminLogin(true);
    else setShowVerification(userType);
  };

  const handleAdminLogin = () => {
    const adminUser = { id: 'admin1', type: 'admin', role: 'admin', name: 'Admin User', verified: true };
    setCurrentUser(adminUser);
    localStorage.setItem('user', JSON.stringify(adminUser));
    setShowAdminLogin(false);
    window.location.href = '/admin';
  };

  // ── Login ──────────────────────────────────────────────────────────────────
  const handleLogin = async (loginData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(loginData),
      });
      const data = await response.json();

      if (response.ok) {
        const userType = (data.user.role || '').toLowerCase();
        const userData = { ...data.user, type: userType, role: userType };
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setCurrentUser(userData);
        setShowAdminLogin(false);
        if (ROLE_MAP[userType]) window.location.href = ROLE_MAP[userType];
      } else {
        // Check if user registered offline (fallback user in localStorage)
        const savedUser = getSavedUser();
        if (savedUser && savedUser.email === loginData.email) {
          setCurrentUser(savedUser);
          if (ROLE_MAP[savedUser.role]) window.location.href = ROLE_MAP[savedUser.role];
        } else {
          alert(data.message || 'Login fail ho gaya');
        }
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('Server se connection nahi ho raha. Backend chal raha hai?');
    }
  };

  // ── Registration ───────────────────────────────────────────────────────────
  const handleVerificationComplete = async (formData) => {
    const userType = showVerification.toLowerCase();

    // Helper to save user and redirect
    const saveAndRedirect = (userData) => {
      setCurrentUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setShowVerification(null);
      if (ROLE_MAP[userType]) window.location.href = ROLE_MAP[userType];
    };

    try {
      const formattedRole = showVerification.charAt(0).toUpperCase() + showVerification.slice(1);

      const toBase64 = (file) => new Promise((resolve) => {
        if (!file) return resolve('');
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      const cnicFrontFile = formData.documents?.find(d => d.type === 'CNIC Front')?.file;
      const cnicBackFile  = formData.documents?.find(d => d.type === 'CNIC Back')?.file;

      const [cnicFrontB64, cnicBackB64] = await Promise.all([
        toBase64(cnicFrontFile),
        toBase64(cnicBackFile),
      ]);

      const selfieB64 = formData.cnicVerification?.face_result?.selfie_base64 || cnicFrontB64;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:      formData.name     || '',
          email:     formData.email    || '',
          password:  formData.password || '',
          role:      formattedRole,
          cnic:      formData.cnic     || '',
          dob:       formData.dob      || '',
          city:      formData.address  || '',
          cnicFront: cnicFrontB64,
          cnicBack:  cnicBackB64,
          selfie:    selfieB64,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const registeredType = (data.user.role || '').toLowerCase();
        const userData = { ...data.user, type: registeredType, role: registeredType };
        localStorage.setItem('token', data.token);
        saveAndRedirect(userData);
      } else {
        // Server error — use offline fallback so user is not stuck
        console.warn('Registration server error:', data.message);
        const fallbackUser = {
          id:         Date.now().toString(),
          name:       formData.name  || 'User',
          email:      formData.email || '',
          type:       userType,
          role:       userType,
          verified:   true,
          trustScore: formData.trustScore || 50,
        };
        saveAndRedirect(fallbackUser);
      }
    } catch (error) {
      // Network error — offline fallback
      console.error('Registration Error:', error);
      const fallbackUser = {
        id:         Date.now().toString(),
        name:       formData.name  || 'User',
        email:      formData.email || '',
        type:       userType,
        role:       userType,
        verified:   true,
        trustScore: formData.trustScore || 50,
      };
      saveAndRedirect(fallbackUser);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowVerification(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  // ── Dashboard view ─────────────────────────────────────────────────────────
  const renderDashboardView = () => {
    if (showAdminLogin) {
      return <AdminLogin onLogin={handleAdminLogin} onBack={() => setShowAdminLogin(false)} />;
    }
    if (!currentUser && !showVerification) {
      return <LandingPage onUserTypeSelect={handleUserTypeSelect} onLogin={handleLogin} onAiDemo={() => setViewMode('ai-demo')} />;
    }
    if (showVerification) {
      return <CompleteEnhancedRegistrationForm userType={showVerification} onComplete={handleVerificationComplete} onBack={() => setShowVerification(null)} />;
    }
    switch (currentUser?.type) {
      case 'client':       return <ClientDashboard user={currentUser} onLogout={handleLogout} />;
      case 'manufacturer': return <ManufacturerDashboard user={currentUser} onLogout={handleLogout} />;
      case 'labour':
      case 'labor':        return <LabourDashboard user={currentUser} onLogout={handleLogout} />;
      case 'admin':        return <EnhancedAdminDashboard onLogout={handleLogout} />;
      default:             return <LandingPage onUserTypeSelect={handleUserTypeSelect} onLogin={handleLogin} />;
    }
  };

  const renderMainContent = () => {
    if (viewMode === 'diagram') return <SkilloraClassDiagram />;
    if (viewMode === 'escrow')  return <EscrowDemoPage />;
    if (viewMode === 'ai-demo') return <AIFeaturesDemo onBack={() => setViewMode('web')} />;
    if (viewMode === 'mobile')  return <MobileApp onBack={() => setViewMode('web')} currentUser={currentUser} renderContent={renderDashboardView} />;
    return renderDashboardView();
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {renderMainContent()}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[9999] items-end">
        <button onClick={() => setViewMode('mobile')} className="size-12 rounded-full bg-slate-800 text-white shadow-lg flex items-center justify-center">
          <Smartphone size={20} />
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
