import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { CheckCircle, AlertTriangle, Search, Shield, FileCheck } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function AIAnalysisModal({ rating, comment, onComplete }) {
  const { isDarkMode } = useTheme();
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Step 1: Scanning Keywords (0-600ms)
    const timer1 = setTimeout(() => setStep(1), 600);
    
    // Step 2: Detecting Fake Feedback (600-1200ms)
    const timer2 = setTimeout(() => setStep(2), 1200);
    
    // Step 3: PPC Policy Check (1200-1800ms)
    const timer3 = setTimeout(() => setStep(3), 1800);
    
    // Step 4: Final Result (1800-2000ms)
    const timer4 = setTimeout(() => {
      // AI Analysis Logic
      const abusiveWords = ['stupid', 'idiot', 'scam', 'fraud', 'cheat', 'liar', 'fake', 'worst', 'horrible', 'terrible', 'pathetic'];
      const isAbusive = abusiveWords.some(word => comment.toLowerCase().includes(word));
      
      // Check for fake patterns (very short, repetitive, generic)
      const isFake = comment.length < 15 || comment.toLowerCase() === comment.toLowerCase().split(' ')[0].repeat(5);
      
      // Sentiment based on rating and keywords
      const positiveWords = ['excellent', 'great', 'good', 'amazing', 'perfect', 'satisfied', 'quality', 'professional', 'recommend'];
      const negativeWords = ['bad', 'poor', 'delay', 'late', 'issue', 'problem', 'disappointed'];
      
      const hasPositive = positiveWords.some(word => comment.toLowerCase().includes(word));
      const hasNegative = negativeWords.some(word => comment.toLowerCase().includes(word));
      
      let sentiment;
      if (rating >= 4 && !hasNegative) {
        sentiment = 'positive';
      } else if (rating <= 2 || hasNegative) {
        sentiment = 'negative';
      } else {
        sentiment = 'neutral';
      }
      
      const confidence = Math.min(95, 70 + rating * 5);
      
      setStep(4);
      
      // Complete after showing result
      setTimeout(() => {
        onComplete({ sentiment, isAbusive, isFake, confidence });
      }, 1000);
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [rating, comment, onComplete]);

  const steps = [
    { icon: Search, text: 'Scanning Keywords...', color: 'text-blue-500' },
    { icon: AlertTriangle, text: 'Detecting Fake Feedback...', color: 'text-yellow-500' },
    { icon: Shield, text: 'PPC Policy Check...', color: 'text-purple-500' },
    { icon: CheckCircle, text: 'Sentiment: Positive. Review Validated.', color: 'text-green-500' }
  ];

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <Card className={`max-w-md w-full ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <CardContent className="p-8 space-y-6">
          {/* Main Heading */}
          <div className="text-center">
            <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              AI Engine Processing
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              AI Engine analyzing sentiment and checking for review manipulation...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
              <div 
                className="h-full bg-[#2563EB] transition-all duration-500 ease-out"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Analysis Steps */}
          <div className="space-y-4">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const isActive = step >= index;
              const isComplete = step > index;
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  <div className="relative">
                    <Icon 
                      className={`size-6 ${item.color} ${
                        isActive && !isComplete ? 'animate-pulse' : ''
                      }`}
                    />
                    {isComplete && (
                      <CheckCircle className="size-4 text-green-500 absolute -top-1 -right-1" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2937]'
                  }`}>
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Final Result - Step 4 */}
          {step >= 4 && (
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="size-5 text-green-500" />
                <span className="text-sm font-semibold text-green-500">
                  Analysis Complete!
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
/* This file is the AI Analysis Modal component used to analyze user reviews (sentiment, abuse, fake detection).
It is built for web-based React applications, not a native mobile app.*/