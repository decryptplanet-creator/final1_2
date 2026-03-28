import { useState } from 'react';
import { X, Mail, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea input';
import { useTheme } from '../contexts/ThemeContext';

export function EmailModal({ onClose, recipientName, recipientEmail }) {
  const { isDarkMode } = useTheme();
  const [to, setTo] = useState(recipientEmail || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSending(true);
    // Simulate sending
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl rounded-lg shadow-xl ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <Mail className="size-6 text-[#2563EB]" />
            <h2 className="text-xl">Compose Email</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {sent ? (
            <div className="py-12 text-center">
              <div className="size-16 rounded-full bg-[#2563EB]/20 flex items-center justify-center mx-auto mb-4">
                <Send className="size-8 text-[#2563EB]" />
              </div>
              <h3 className="text-xl mb-2">Email Sent Successfully!</h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Your message has been sent to {recipientName || to}
              </p>
            </div>
          ) : (
            <>
              {/* To Field */}
              <div>
                <label className={`block text-sm mb-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  To
                </label>
                <Input
                  type="email"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="recipient@example.com"
                  className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}
                />
                {recipientName && (
                  <p className={`text-xs mt-1 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {recipientName}
                  </p>
                )}
              </div>

              {/* Subject Field */}
              <div>
                <label className={`block text-sm mb-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Subject
                </label>
                <Input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter subject"
                  className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}
                />
              </div>

              {/* Message Field */}
              <div>
                <label className={`block text-sm mb-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Message
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows={8}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!sent && (
          <div className={`p-4 border-t flex gap-3 ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <Button 
              onClick={onClose} 
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSend}
              disabled={!to || !subject || !message || sending}
              className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
            >
              {sending ? (
                'Sending...'
              ) : (
                <>
                  <Send className="size-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
/*Purpose: Yeh file user ko email compose aur send karne ke liye modal UI provide karti hai.
Type: Yeh web-based application ke liye hai (React frontend), mobile ke liye directly nahi. */