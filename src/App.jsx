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
import { EscrowFlowDemoButton } from './components/EscrowFlowDemoButton';
import { CompleteEnhancedRegistrationForm } from './components/CompleteEnhancedRegistrationForm';
import { AIFeaturesDemo } from './components/AIFeaturesDemo';

// Icons
import { Smartphone, Monitor, Moon, Sun, Sparkles, Bot, X, ArrowLeft } from 'lucide-react';

function AppContent() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [currentUser, setCurrentUser] = useState(null);
  const [showVerification, setShowVerification] = useState(null);
  const [viewMode, setViewMode] = useState('web');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

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
      const response = await fetch('http://localhost:5003/api/auth/login', {
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
      // Backend expects 'Labor' or 'Labour'. Hum pehle letter ko capital kar dete hain.
      let formattedRole = showVerification.charAt(0).toUpperCase() + showVerification.slice(1);
      
      const response = await fetch('http://localhost:5003/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: formattedRole })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        // Type set karte waqt spelling fix
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
    if (!currentUser && !showVerification) return <LandingPage onUserTypeSelect={handleUserTypeSelect} onLogin={handleLogin} />;
    
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
      
      {!isChatOpen && renderMainContent()}
      {!isChatOpen && <EscrowFlowDemoButton />}
      
      {!isChatOpen && (
        <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-[9999]">
          {isFrontendHomePage && (
            <button
              onClick={() => setIsChatOpen(true)}
              className="size-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 bg-gradient-to-tr from-blue-700 to-blue-400 border-4 border-white dark:border-slate-800"
            >
              <Bot className="size-9 text-white" />
            </button>
          )}

          <div className="flex flex-col gap-2 items-center">
            <button onClick={toggleTheme} className="size-12 rounded-full bg-slate-800 text-white shadow-lg flex items-center justify-center">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setViewMode('mobile')} className="size-12 rounded-full bg-slate-800 text-white shadow-lg flex items-center justify-center">
              <Smartphone size={20} />
            </button>
          </div>
        </div>
      )}

      {isChatOpen && (
        <div className="fixed inset-0 z-[10000] bg-white dark:bg-slate-900 flex flex-col">
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
            <button onClick={() => setIsChatOpen(false)} className="flex items-center gap-2">
              <ArrowLeft size={24} /> <span>Back to Platform</span>
            </button>
            <X size={24} onClick={() => setIsChatOpen(false)} className="cursor-pointer" />
          </div>
          <iframe src="http://localhost:8501/?embed=true" className="w-full h-full border-none" title="Legal AI Assistant" />
        </div>
      )}
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
