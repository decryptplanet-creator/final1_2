import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/labelstatus';
import { Sparkles, Camera, MessageSquare, Search, Scale, Star, Ban, ArrowLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { AICNICVerification } from './AICNICVerification';
import { ChatModal } from './ChatModal';
import { AIDisputeResolution } from './AIDisputeResolution';
import { AISentimentAnalysis } from './AISentimentAnalysis';
import { DuplicateAccountDetection } from './DuplicateAccountDetection';
import { EnhancedSearchModal } from './EnhancedSearchModal';

export function AIFeaturesDemo({ onBack }) {
  const { isDarkMode } = useTheme();
  const [activeDemo, setActiveDemo] = useState(null);

  const features = [
    {
      id: 'cnic-verification',
      title: 'AI CNIC Verification',
      description: 'Experience AI-powered identity verification with scanning animation and live selfie matching',
      icon: Camera,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'chat-monitoring',
      title: 'AI Chat Monitoring',
      description: 'See how AI detects fraud attempts and policy violations in real-time messaging',
      icon: MessageSquare,
      color: 'from-green-500 to-emerald-600',
    },
    {
      id: 'ai-search',
      title: 'AI-Based Search & Recommendations',
      description: 'Search with intelligent AI recommendations based on trust score and quality history',
      icon: Search,
      color: 'from-purple-500 to-pink-600',
    },
    {
      id: 'sentiment-analysis',
      title: 'AI Sentiment Analysis',
      description: 'Submit reviews and watch AI analyze sentiment with automatic trust score updates',
      icon: Star,
      color: 'from-yellow-500 to-orange-600',
    },
    {
      id: 'dispute-resolution',
      title: 'AI Dispute Resolution',
      description: 'Automated dispute resolution with AI analyzing evidence and providing fair decisions',
      icon: Scale,
      color: 'from-red-500 to-rose-600',
    },
    {
      id: 'duplicate-detection',
      title: 'Duplicate Account Detection',
      description: 'Fraud prevention system that detects duplicate CNIC registrations instantly',
      icon: Ban,
      color: 'from-gray-700 to-gray-900',
    },
  ];

  const renderActiveDemo = () => {
    switch (activeDemo) {
      case 'cnic-verification':
        return (
          <AICNICVerification
            onVerificationComplete={(verified, accuracy) => {
              console.log('Verification complete:', verified, accuracy);
              setTimeout(() => setActiveDemo(null), 3000);
            }}
            onBack={() => setActiveDemo(null)}
          />
        );
      
      case 'chat-monitoring':
        return (
          <ChatModal
            recipientName="ABC Manufacturing"
            onClose={() => setActiveDemo(null)}
          />
        );
      
      case 'ai-search':
        return (
          <EnhancedSearchModal
            searchType="manufacturer"
            onClose={() => setActiveDemo(null)}
            onProfileClick={(profile) => console.log('Profile:', profile)}
            onContactClick={(profile) => console.log('Contact:', profile)}
          />
        );
      
      case 'sentiment-analysis':
        return (
          <AISentimentAnalysis
            manufacturerName="ABC Manufacturing"
            currentTrustScore={78}
            onSubmit={(review, rating, sentiment, newScore) => {
              console.log('Review submitted:', { review, rating, sentiment, newScore });
              setActiveDemo(null);
            }}
            onClose={() => setActiveDemo(null)}
          />
        );
      
      case 'dispute-resolution':
        return (
          <AIDisputeResolution
            orderId="ORD-12345"
            clientName="John Smith"
            manufacturerName="ABC Manufacturing"
            orderAmount={150000}
            onClose={() => setActiveDemo(null)}
          />
        );
      
      case 'duplicate-detection':
        return (
          <DuplicateAccountDetection
            cnicNumber="12345-1234567-1"
            existingAccountName="Ahmed Khan"
            onClose={() => setActiveDemo(null)}
            onContactSupport={() => alert('Support contact feature coming soon!')}
          />
        );
      
      default:
        return null;
    }
  };

  if (activeDemo) {
    return renderActiveDemo();
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1F2933]' : 'bg-[#F9FAFB]'} p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className={`size-12 rounded-full ${
              isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
            } flex items-center justify-center`}>
              <Sparkles className="size-6 text-[#2563EB]" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                Skillora AI Features
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                "Trust in Every Talent" - Powered by Artificial Intelligence
              </p>
            </div>
          </div>
          
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            isDarkMode ? 'bg-[#2563EB]/20' : 'bg-blue-50'
          } border border-[#2563EB]/30`}>
            <Sparkles className="size-4 text-[#2563EB]" />
            <span className="text-sm text-[#2563EB] font-medium">
              6 Advanced AI Features Implemented
            </span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                className={`group cursor-pointer transition-all hover:scale-105 hover:shadow-xl ${
                  isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'
                }`}
                onClick={() => setActiveDemo(feature.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`size-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="size-6 text-white" />
                    </div>
                    <Badge className="bg-[#2563EB]">
                      <Sparkles className="size-3 mr-1" />
                      AI
                    </Badge>
                  </div>
                  <CardTitle className={`text-lg ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {feature.description}
                  </p>
                  <Button
                    className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]"
                    size="sm"
                  >
                    Try Demo
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Summary */}
        <Card className={`mt-8 ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              <Sparkles className="size-5 text-[#2563EB]" />
              AI Features Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  Implemented Features
                </h4>
                <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>AI CNIC scanning with animated verification flow</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Live selfie capture with AI face matching overlay</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Real-time fraud detection in chat with red border warnings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>AI-powered search with recommendation badges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Sentiment analysis with animated trust score updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Automated dispute resolution with AI decision system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Duplicate account detection with animated alerts</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  Animation Features
                </h4>
                <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li className="flex items-start gap-2">
                    <span className="text-[#2563EB]">⚡</span>
                    <span>Smooth scanning lines with glow effects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#2563EB]">⚡</span>
                    <span>Face circle overlay turns green on match</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#2563EB]">⚡</span>
                    <span>Chat border pulses red on violation detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#2563EB]">⚡</span>
                    <span>AI recommended cards have glow animation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#2563EB]">⚡</span>
                    <span>Trust score bar animates on review submission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#2563EB]">⚡</span>
                    <span>Progress indicators with smooth transitions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#2563EB]">⚡</span>
                    <span>All modals have scale and fade animations</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
/* This file is a demo dashboard showcasing multiple AI features (verification, chat monitoring, search, sentiment, dispute resolution, etc.) and lets users interact with them.

It is web-based (React frontend), but can also be used in hybrid apps (both) if deployed via frameworks like React Native/WebView. */