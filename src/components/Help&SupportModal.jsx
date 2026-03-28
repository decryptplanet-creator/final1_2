import { X, HelpCircle, MessageSquare, Phone, Mail, FileText, Search, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';
import { ChatModal } from './ChatModal';
import { EmailModal } from './EmailModal';

export function HelpModal({ onClose }) {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const helpTopics = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of using Skillora',
      icon: FileText,
    },
    {
      title: 'Account Verification',
      description: 'How to verify your account and documents',
      icon: FileText,
    },
    {
      title: 'Payment & Escrow',
      description: 'Understanding the escrow payment system',
      icon: FileText,
    },
    {
      title: 'Finding Workers/Jobs',
      description: 'How to search and connect with others',
      icon: FileText,
    },
    {
      title: 'Trust Score System',
      description: 'Learn about the trust scoring mechanism',
      icon: FileText,
    },
    {
      title: 'Safety & Security',
      description: 'Tips for staying safe on the platform',
      icon: FileText,
    },
  ];

  const filteredTopics = helpTopics.filter(topic =>
    searchQuery === '' ||
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
        <div className={`w-full max-w-3xl rounded-lg shadow-xl max-h-[90vh] overflow-hidden ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
                title="Back to Settings"
              >
                <ArrowLeft className="size-5" />
              </button>
              <HelpCircle className="size-6 text-[#10b981]" />
              <div>
                <h2 className="text-xl">Help & Support</h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  We're here to help you
                </p>
              </div>
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

          {/* Quick Contact Options */}
          <div className={`p-6 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <h3 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              CONTACT US
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={() => setShowChat(true)}
                className="flex flex-col items-center gap-2 h-auto py-4 bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
              >
                <MessageSquare className="size-6" />
                <span className="text-sm">Live Chat</span>
              </Button>
              <Button
                onClick={() => setShowEmail(true)}
                variant="outline"
                className={`flex flex-col items-center gap-2 h-auto py-4 ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-300'
                }`}
              >
                <Mail className="size-6" />
                <span className="text-sm">Email Us</span>
              </Button>
              <Button
                variant="outline"
                className={`flex flex-col items-center gap-2 h-auto py-4 ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-300'
                }`}
              >
                <Phone className="size-6" />
                <span className="text-sm">Call Support</span>
              </Button>
            </div>
          </div>

          {/* Search Help Topics */}
          <div className="p-6">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  placeholder="Search help topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                  }`}
                />
              </div>
            </div>

            {/* Help Topics */}
            <div className="space-y-3 max-h-[40vh] overflow-y-auto">
              <h3 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                HELP TOPICS
              </h3>
              {filteredTopics.map((topic, idx) => (
                <button
                  key={idx}
                  className={`w-full p-4 rounded-lg border text-left transition-colors ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700 hover:bg-gray-750'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-white'
                    }`}>
                      <topic.icon className="size-5 text-[#10b981]" />
                    </div>
                    <div>
                      <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {topic.title}
                      </h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {topic.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className={`p-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>Need immediate assistance? Contact us at:</p>
              <p className="text-[#10b981] font-medium mt-1">support@skillora.com | +92-300-1234567</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && <ChatModal onClose={() => setShowChat(false)} />}
      
      {/* Email Modal */}
      {showEmail && (
        <EmailModal
          onClose={() => setShowEmail(false)}
          recipientName="Skillora Support"
          recipientEmail="support@skillora.com"
        />
      )}
    </>
  );
}

/*Purpose: This file creates a Help & Support modal with search, FAQs, and contact options like chat, email, and call support.

Type: It is a frontend component, so it can be used for both web apps and hybrid (mobile/web) apps. */