import { AdminDashboard } from './components/AdminDashboard';
import { EnhancedAdminDashboard } from './components/EnhancedAdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { useState, useEffect } from 'react'; // useEffect add kiya hai token check ke liye
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

// Icons
import { Smartphone, Monitor } from 'lucide-react';

function AppContent() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [currentUser, setCurrentUser] = useState(null);
  const [showVerification, setShowVerification] = useState(null);
  const [viewMode, setViewMode] = useState('web');
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // --- 1. PERSISTENT LOGIN (Token check) ---
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleUserTypeSelect = (userType) => {
    if (userType === 'admin') {
      setShowAdminLogin(true);
    } else {
      setShowVerification(userType);
    }
  };

  const handleAdminLogin = () => {
    const adminUser = { id: 'admin1', type: 'admin', name: 'Admin User', verified: true };
    setCurrentUser(adminUser);
    localStorage.setItem('user', JSON.stringify(adminUser));
    setShowAdminLogin(false);
  };

  // --- 2. LOGIN HANDLER (Naya function) ---
  const handleLogin = async (loginData) => {
    try {
      const response = await fetch('http://localhost:5002/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        // Role normalize kar rahe hain taake switch case chale
        const userData = { ...data.user, type: data.user.role.toLowerCase() };
        setCurrentUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setShowAdminLogin(false);
      } else {
        alert(data.message || "Login fail ho gaya");
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  // --- 3. REGISTRATION / VERIFICATION COMPLETE ---
  const handleVerificationComplete = async (formData) => { 
    try {
      let formattedRole = showVerification.charAt(0).toUpperCase() + showVerification.slice(1);

      // Convert file objects to base64 strings
      const toBase64 = (file) => new Promise((resolve) => {
        if (!file) return resolve('');
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result); // full data URL
        reader.readAsDataURL(file);
      });

      const cnicFrontFile = formData.documents?.find(d => d.type === 'CNIC Front')?.file;
      const cnicBackFile  = formData.documents?.find(d => d.type === 'CNIC Back')?.file;

      const [cnicFrontB64, cnicBackB64] = await Promise.all([
        toBase64(cnicFrontFile),
        toBase64(cnicBackFile),
      ]);

      // selfie comes from cnicVerification stored during CNIC step
      const selfieB64 = formData.cnicVerification?.face_result?.selfie_base64 || cnicFrontB64;

      const response = await fetch('http://localhost:5002/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name || '',
          email: formData.email || '',
          password: formData.password || '',
          role: formattedRole,
          cnic: formData.cnic || '',
          dob: formData.dob || '',
          city: formData.address || '',
          cnicFront: cnicFrontB64,
          cnicBack: cnicBackB64,
          selfie: selfieB64,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        let userType = data.user.role.toLowerCase();
        const userData = { ...data.user, type: userType };
        setCurrentUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setShowVerification(null);
      } else {
        alert(data.message || "Registration fail!");
      }
    } catch (error) { 
      console.error("Registration Error:", error);
      // Auth server offline — use local user so dashboard still loads
      const userType = showVerification.toLowerCase();
      const userData = {
        id: Date.now().toString(),
        name: formData.name || 'User',
        email: formData.email || '',
        type: userType,
        role: userType,
        verified: true,
        trustScore: formData.trustScore || 50,
      };
      setCurrentUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setShowVerification(null);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowVerification(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // --- 4. DASHBOARD VIEW (Role Match Fix) ---
  const renderDashboardView = () => {
    if (showAdminLogin) return <AdminLogin onLogin={handleAdminLogin} onBack={() => setShowAdminLogin(false)} />;
    
    // Yahan LandingPage par login handler pass kiya hai
    if (!currentUser && !showVerification) return <LandingPage onUserTypeSelect={handleUserTypeSelect} onLogin={handleLogin} onAiDemo={() => setViewMode('ai-demo')} />;
    
    if (showVerification) return <CompleteEnhancedRegistrationForm userType={showVerification} onComplete={handleVerificationComplete} onBack={() => setShowVerification(null)} />;

    switch (currentUser.type) {
      case 'client': return <ClientDashboard user={currentUser} onLogout={handleLogout} />;
      case 'manufacturer': return <ManufacturerDashboard user={currentUser} onLogout={handleLogout} />;
      // Dono spellings handle kar li hain taake koi error na aaye
      case 'labour': 
      case 'labor': 
        return <LabourDashboard user={currentUser} onLogout={handleLogout} />;
      case 'admin': return <EnhancedAdminDashboard onLogout={handleLogout} />;
      default: return <LandingPage onUserTypeSelect={handleUserTypeSelect} onLogin={handleLogin} />;
    }
  };

  const renderMainContent = () => {
    if (viewMode === 'diagram') return <SkilloraClassDiagram />;
    if (viewMode === 'escrow') return <EscrowDemoPage />;
    if (viewMode === 'ai-demo') return <AIFeaturesDemo onBack={() => setViewMode('web')} />;
    if (viewMode === 'mobile') return <MobileApp onBack={() => setViewMode('web')} currentUser={currentUser} renderContent={renderDashboardView} />;
    return renderDashboardView();
  };

  const isFrontendHomePage = (
    viewMode === 'web' &&
    !currentUser &&
    !showVerification &&
    !showAdminLogin
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {renderMainContent()}

      {/* Fixed bottom-right controls */}
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
