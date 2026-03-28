import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { AlertTriangle, X, Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ReviewWarningModal({ onClose, reason, trustScoreImpact }) {
  const { isDarkMode } = useTheme();

  const warningContent = {
    abusive: {
      title: 'Review Blocked - Abusive Content Detected',
      description: 'Your review contains abusive or inappropriate language that violates our community guidelines.',
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30'
    },
    fake: {
      title: 'Review Blocked - Suspicious Activity Detected',
      description: 'Our AI system has detected patterns suggesting this review may be fake or manipulated.',
      icon: Shield,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30'
    }
  };

  const { title, description, icon: Icon, color, bgColor, borderColor } = warningContent[reason];

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <Card className={`max-w-lg w-full ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <CardHeader className={`border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className={`size-6 ${color}`} />
              <CardTitle className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>
                Review Blocked
              </CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
            >
              <X className="size-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Warning Banner */}
          <div className={`${bgColor} border ${borderColor} rounded-lg p-4`}>
            <div className="flex items-start gap-3">
              <Icon className={`size-6 ${color} flex-shrink-0 mt-0.5`} />
              <div>
                <h3 className={`font-semibold mb-2 ${color}`}>
                  {title}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {description}
                </p>
              </div>
            </div>
          </div>

          {/* PPC Policy Notice */}
          <div className={`p-4 border rounded-lg ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-start gap-2">
              <Shield className={`size-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} flex-shrink-0 mt-0.5`} />
              <div>
                <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  PPC Policy Compliance
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  This incident has been logged under PPC Policy. Repeated violations may result in account restrictions.
                </p>
              </div>
            </div>
          </div>

          {/* Trust Score Impact */}
          <div className={`p-4 border rounded-lg ${
            isDarkMode 
              ? 'bg-red-900/20 border-red-700' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  Trust Score Impact
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your trust score has been affected
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-red-500">
                  -{trustScoreImpact}
                </span>
                <p className="text-xs text-red-500">
                  points
                </p>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div>
            <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              Review Guidelines:
            </h4>
            <ul className={`text-xs space-y-1 list-disc pl-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li>Be honest and constructive in your feedback</li>
              <li>Avoid abusive, offensive, or inappropriate language</li>
              <li>Provide genuine experiences based on your actual order</li>
              <li>Focus on specific aspects like quality, delivery, and service</li>
            </ul>
          </div>

          {/* Close Button */}
          <Button
            onClick={onClose}
            className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
          >
            I Understand
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/* Shows a warning modal when a user’s review is blocked due to abusive or fake content, including trust score impact and guidelines.

This is a web-based (React frontend) component, but can also be used in apps if built with React Native or similar (so mainly web, extendable to both). */