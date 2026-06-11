import { useEffect, useState } from 'react';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5003';
const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token') || '';

export function PaymentSuccessPage({ onGoToDashboard }) {
  const { isDarkMode } = useTheme();
  const [status, setStatus] = useState('verifying'); // verifying | success | failed
  const [escrow, setEscrow] = useState(null);

  useEffect(() => {
    const params    = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (!sessionId) { setStatus('failed'); return; }

    fetch(`${API}/api/escrow/verify/${sessionId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.status === 'paid') {
          setEscrow(data.escrow);
          setStatus('success');
          setTimeout(() => onGoToDashboard(), 3000);
        } else setStatus('failed');
      })
      .catch(() => setStatus('failed'));
  }, []); // eslint-disable-line

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-md p-8 rounded-2xl shadow-xl text-center ${isDarkMode ? 'bg-[#2A3642]' : 'bg-white'}`}>
        {status === 'verifying' && (
          <>
            <Loader2 className="size-16 animate-spin text-[#2563EB] mx-auto mb-4" />
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Payment Verify Ho Raha Hai...</h2>
            <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Thori der wait karein</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle className="size-16 text-green-500 mx-auto mb-4" />
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Payment Successful! 🎉</h2>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Aapka payment escrow mein secure ho gaya hai.
              {escrow && <><br />Total: <strong>PKR {escrow.totalAmount?.toLocaleString()}</strong></>}
              <br /><span className="text-xs text-gray-400">3 seconds mein automatically redirect ho raha hai...</span>
            </p>
            <Button onClick={onGoToDashboard} className="w-full bg-[#2563EB] text-white">
              Dashboard Par Wapis Jao
            </Button>
          </>
        )}
        {status === 'failed' && (
          <>
            <XCircle className="size-16 text-red-500 mx-auto mb-4" />
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Payment Verify Nahi Hua</h2>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Payment complete hua lekin verification mein delay hai. Dashboard check karein.
            </p>
            <Button onClick={onGoToDashboard} className="w-full bg-[#2563EB] text-white">
              Dashboard Par Jao
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
