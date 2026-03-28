import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Send, AlertTriangle, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

export function ChatModal({ recipientName, onClose }) {
  const { isDarkMode } = useTheme();
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I saw your profile and I\'m interested in your services.', sender: 'me', timestamp: '10:30 AM' },
    { id: 2, text: 'Hi! Thank you for reaching out. How can I help you?', sender: 'other', timestamp: '10:32 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [aiWarning, setAiWarning] = useState(null);
  const [borderWarning, setBorderWarning] = useState(false);
  const messagesEndRef = useRef(null);

  // AI Fraud Detection Keywords
  const fraudKeywords = ['whatsapp', 'offline payment', 'outside platform', 'direct transfer', 'phone number', 'cash payment', 'bank transfer'];
  const violationKeywords = ['idiot', 'stupid', 'fool', 'cheat', 'fraud'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const detectAIViolation = (text) => {
    const lowerText = text.toLowerCase();
    
    if (fraudKeywords.some(keyword => lowerText.includes(keyword))) {
      return { detected: true, type: 'fraud' };
    }
    
    if (violationKeywords.some(keyword => lowerText.includes(keyword))) {
      return { detected: true, type: 'violation' };
    }
    
    return null;
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // AI Detection before sending
      const violation = detectAIViolation(newMessage);
      
      if (violation) {
        setBorderWarning(true);
        setAiWarning({
          message: newMessage,
          type: violation.type
        });
        // Don't send message, show warning instead
        setTimeout(() => setBorderWarning(false), 3000);
        return;
      }

      const message = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl h-[600px] flex flex-col"
      >
        <Card className={`flex-1 flex flex-col ${
          isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'
        } ${borderWarning ? 'border-4 border-red-500 animate-pulse' : ''}`}>
          <CardHeader className={`border-b flex-shrink-0 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <CardTitle className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>
                Chat with {recipientName}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="size-5" />
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#2563EB] mt-2">
              <Sparkles className="size-4" />
              <span>AI-Monitored for your safety</span>
            </div>
          </CardHeader>

          {/* AI Warning Alert */}
          <AnimatePresence>
            {aiWarning && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className={`p-4 border-b ${
                  isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="size-5 text-red-600 flex-shrink-0 mt-0.5 animate-pulse" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="size-4 text-red-600" />
                        <h4 className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                          AI Alert: {aiWarning.type === 'fraud' ? 'Potential Fraud Detected' : 'Policy Violation Detected'}
                        </h4>
                      </div>
                      <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {aiWarning.type === 'fraud' 
                          ? 'Your message contains keywords suggesting off-platform transactions. All payments must go through Skillora\'s secure escrow system.'
                          : 'Your message contains inappropriate language. Please maintain professional communication.'
                        }
                      </p>
                      <p className={`text-xs p-2 rounded ${isDarkMode ? 'bg-[#1F2933]' : 'bg-white'} text-red-600 font-medium`}>
                        "{aiWarning.message}"
                      </p>
                      <div className={`mt-3 p-3 rounded-lg ${isDarkMode ? 'bg-[#1F2933]' : 'bg-white'}`}>
                        <p className="text-xs text-red-600 font-medium mb-1">⚠️ Warning:</p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Your account is under AI review. Repeated violations may result in suspension or termination.
                        </p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setAiWarning(null);
                            setNewMessage('');
                          }}
                        >
                          Understood
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-[#2563EB] hover:bg-[#1d4ed8]"
                          onClick={() => setAiWarning(null)}
                        >
                          Revise Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages Area */}
          <CardContent className={`flex-1 overflow-y-auto p-4 space-y-3 ${
            isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'
          }`}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.sender === 'me'
                      ? 'bg-[#2563EB] text-white'
                      : isDarkMode
                      ? 'bg-[#2A3642] text-[#F9FAFB]'
                      : 'bg-white text-[#1F2933]'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${
                    msg.sender === 'me' ? 'text-blue-200' : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input Area */}
          <div className={`p-4 border-t flex-shrink-0 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className={`flex-1 ${
                  isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300'
                }`}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-[#2563EB] hover:bg-[#1d4ed8]"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
/* Purpose: This file creates an AI-monitored chat interface that detects fraud attempts and policy violations in real-time messaging.

Type: It is a */