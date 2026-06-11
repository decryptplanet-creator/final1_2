import { XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';

export function PaymentCancelPage({ onGoToDashboard }) {
  const { isDarkMode } = useTheme();
  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-md p-8 rounded-2xl shadow-xl text-center ${isDarkMode ? 'bg-[#2A3642]' : 'bg-white'}`}>
        <XCircle className="size-16 text-red-500 mx-auto mb-4" />
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Payment Cancel Ho Gaya</h2>
        <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Aap ne payment cancel kar diya. Order abhi pending hai — dobara try kar saktay hain.
        </p>
        <Button onClick={onGoToDashboard} className="w-full bg-[#2563EB] text-white">
          Dashboard Par Wapis Jao
        </Button>
      </div>
    </div>
  );
}
