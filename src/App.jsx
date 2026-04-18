import { AdminDashboard } from './components/AdminDashboard';
import { EnhancedAdminDashboard } from './components/EnhancedAdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { useState } from 'react';
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
import { Smartphone, Monitor, Moon, Sun, ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react';


function AppContent() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [currentUser, setCurrentUser] = useState(null);
  const [showVerification, setShowVerification] = useState(null);
  const [viewMode, setViewMode] = useState('web');
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleUserTypeSelect = (userType) => {
    if (userType === 'admin') {
      setShowAdminLogin(true);
    } else {
      setShowVerification(userType);
    }
  };

  const handleAdminLogin = () => {
    const adminUser = {
      id: 'admin1',
      type: 'admin',
      name: 'Admin User',
      email: 'admin@skillora.com',
      phone: '+92 300 0000000',
      verified: true,
      rating: 5,
      totalReviews: 0,
    };
    setCurrentUser(adminUser);
    setShowAdminLogin(false);
  };

  const handleVerificationComplete = () => {
    const demoUser = {
      id: Math.random().toString(36).substr(2, 9),
      type: showVerification,
      name: showVerification === 'client' ? 'John Smith' : showVerification === 'manufacturer' ? 'ABC Manufacturing' : 'Ahmed Khan',
      email: 'demo@skillora.com',
      phone: '+92 300 1234567',
      cnic: '12345-1234567-1',
      verified: true,
      rating: 4.8,
      totalReviews: 125,
      skills: showVerification === 'labour' ? ['Stitching', 'Pattern Making'] : undefined,
      rate: showVerification === 'labour' ? 650 : undefined,
    };
    setCurrentUser(demoUser);
    setShowVerification(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowVerification(null);
  };

  const renderDashboardView = () => {
    if (showAdminLogin) {
      return <AdminLogin onLogin={handleAdminLogin} onBack={() => setShowAdminLogin(false)} />;
    }

    if (showVerification) {
      return (
        <CompleteEnhancedRegistrationForm
          userType={showVerification}
          onComplete={handleVerificationComplete}
          onBack={() => setShowVerification(null)}
        />
      );
    }

    if (!currentUser) {
      return <LandingPage onUserTypeSelect={handleUserTypeSelect} />;
    }

    switch (currentUser.type) {
      case 'client': return <ClientDashboard user={currentUser} onLogout={handleLogout} />;
      case 'manufacturer': return <ManufacturerDashboard user={currentUser} onLogout={handleLogout} />;
      case 'labour': return <LabourDashboard user={currentUser} onLogout={handleLogout} />;
      case 'admin': return <EnhancedAdminDashboard onLogout={handleLogout} />;
      default: return null;
    }
  };

  const renderMainContent = () => {
    if (viewMode === 'diagram') return <SkilloraClassDiagram />;
    if (viewMode === 'escrow') return <EscrowDemoPage />;
    if (viewMode === 'ai-demo') return <AIFeaturesDemo onBack={() => setViewMode('web')} />;
    
    if (viewMode === 'mobile') {
      return (
        <MobileApp 
          onBack={() => setViewMode('web')} 
          currentUser={currentUser} 
          renderContent={renderDashboardView} 
        />
      );
    }

    return renderDashboardView();
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {renderMainContent()}
      
      {/* Escrow Demo Button (Left Side logic handled inside the component or here) */}
      <EscrowFlowDemoButton />
      
      {/* Fixed Floating Action Buttons (Right Side) - Updated Styling */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[9999]">
        
        {/* Back to Web Button (Only visible in special modes) */}
        {viewMode !== 'web' && (
          <button
            onClick={() => setViewMode('web')}
            className="size-14 rounded-full bg-black text-white shadow-xl flex items-center justify-center transition-all hover:scale-110 border border-white/20"
            title="Back to Web View"
          >
            <Monitor className="size-6 text-white" />
          </button>
        )}

        {/* Theme Toggle Button - Styled Black with White Icon */}
        <button
          onClick={toggleTheme}
          className="size-14 rounded-full bg-black text-white shadow-xl flex items-center justify-center transition-all hover:scale-110 border border-white/20"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="size-6 text-white" /> : <Moon className="size-6 text-white" />}
        </button>

        {/* Mobile View Toggle - Styled Black with White Icon */}
        {viewMode === 'web' && (
          <button
            onClick={() => setViewMode('mobile')}
            className="size-14 rounded-full bg-black text-white shadow-xl flex items-center justify-center transition-all hover:scale-110 border border-white/20"
            title="Switch to Mobile App View"
          >
            <Smartphone className="size-6 text-white" />
          </button>
        )}

        {/* AI Features Demo Button - Styled Black with White Icon */}
        <button
          onClick={() => setViewMode('ai-demo')}
          className="size-14 rounded-full bg-black text-white shadow-xl flex items-center justify-center transition-all hover:scale-110 border border-white/20"
          title="View AI Features Demo"
        >
          <Sparkles className="size-6 text-white" />
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

/*
This file is the main application controller (App component) that manages routing, user flow, dashboards, and UI modes.
It is both web and mobile related, but primarily web-based with a mobile view simulation included. 
All TypeScript types/interfaces/generics removed. Pure JSX/JS ready.
*/
