import { useState, useEffect } from 'react';
import { CheckCircle, DollarSign, Star, AlertTriangle, X, Info } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

function Toast({ id, type, message, duration = 3000, onClose }) {
  const { isDarkMode } = useTheme();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600/90 text-white border-green-500';
      case 'error':
        return 'bg-red-600/90 text-white border-red-500';
      case 'warning':
        return 'bg-yellow-600/90 text-white border-yellow-500';
      case 'payment':
        return 'bg-[#2563EB]/90 text-white border-[#2563EB]';
      case 'trust-score':
        return 'bg-yellow-500/90 text-white border-yellow-400';
      default:
        return isDarkMode 
          ? 'bg-[#2A3642] text-white border-gray-700' 
          : 'bg-white text-[#1F2933] border-gray-300';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="size-5" />;
      case 'error':
        return <AlertTriangle className="size-5" />;
      case 'warning':
        return <AlertTriangle className="size-5" />;
      case 'payment':
        return <DollarSign className="size-5" />;
      case 'trust-score':
        return <Star className="size-5" />;
      default:
        return <Info className="size-5" />;
    }
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg shadow-lg border min-w-[300px] max-w-md ${getToastStyles()}`}
      style={{
        animation: isExiting 
          ? 'slideOut 0.3s ease-in forwards' 
          : 'slideIn 0.3s ease-out forwards',
      }}
    >
      {getIcon()}
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onClose(id), 300);
        }}
        className="hover:opacity-70 transition-opacity"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <div className="pointer-events-auto">
        {toasts.map((toast) => (
          <div key={toast.id} className="mb-3">
            <Toast {...toast} onClose={onRemove} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

// Hook for using toasts
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (type, message, duration) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, type, message, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, showToast, removeToast };
}

/* Purpose: This file creates a toast notification system (alerts like success, error, payment, etc.) with auto-hide and animation.
Platform: Web-based (React UI), but can be used in both web and app if built with React Native/web hybrid. */