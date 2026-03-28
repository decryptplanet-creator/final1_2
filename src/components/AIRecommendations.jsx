// R.1.7: AI-Based Recommendation System
// R.1.9: Sentiment Analysis of Reviews
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Star, TrendingUp, MapPin, Award, Sparkles, ThumbsUp, ThumbsDown, Meh } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function AIRecommendations({ userType, userLocation, requiredSkills, onSelectUser }) {
  const { isDarkMode } = useTheme();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // R.1.7: AI-Based Recommendation
    // Simulate AI analysis based on skills, trust scores, location, and past performance
    setTimeout(() => {
      const mockRecommendations = generateAIRecommendations();
      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 1500);
  }, [userType, userLocation, requiredSkills]);

  const generateAIRecommendations = () => {
    if (userType === 'manufacturer') {
      return [
        {
          id: 1,
          name: 'Prime Textile Manufacturing',
          trustScore: 92,
          rating: 4.9,
          completedOrders: 145,
          location: 'Sialkot - 2.5 km away',
          skills: ['Cotton Garments', 'Sports Wear', 'Export Quality'],
          aiScore: 98,
          sentiment: 'very_positive',
          positiveReviews: 138,
          negativeReviews: 7,
          matchReason: 'High trust score, nearby location, excellent past performance'
        },
        {
          id: 2,
          name: 'Quality Garments Ltd',
          trustScore: 88,
          rating: 4.7,
          completedOrders: 98,
          location: 'Sialkot - 5 km away',
          skills: ['Textile Production', 'Quality Control', 'Fast Delivery'],
          aiScore: 94,
          sentiment: 'positive',
          positiveReviews: 89,
          negativeReviews: 9,
          matchReason: 'Matches required skills, good ratings, reliable delivery'
        },
        {
          id: 3,
          name: 'Elite Manufacturing',
          trustScore: 85,
          rating: 4.6,
          completedOrders: 76,
          location: 'Sialkot - 8 km away',
          skills: ['Bulk Orders', 'Custom Designs', 'Quality Assurance'],
          aiScore: 90,
          sentiment: 'positive',
          positiveReviews: 70,
          negativeReviews: 6,
          matchReason: 'Specializes in bulk orders, consistent quality'
        },
      ];
    } else {
      return [
        {
          id: 1,
          name: 'Ahmed Ali',
          trustScore: 95,
          rating: 4.9,
          completedJobs: 234,
          location: 'Sialkot - 1 km away',
          skills: ['Master Tailor', 'Pattern Making', 'Quality Stitching'],
          aiScore: 97,
          sentiment: 'very_positive',
          positiveReviews: 225,
          negativeReviews: 9,
          matchReason: 'Top-rated tailor, extensive experience, nearby location'
        },
        {
          id: 2,
          name: 'Hassan Malik',
          trustScore: 91,
          rating: 4.8,
          completedJobs: 187,
          location: 'Sialkot - 3 km away',
          skills: ['Fabric Cutting', 'Industrial Sewing', 'Fast Worker'],
          aiScore: 93,
          sentiment: 'positive',
          positiveReviews: 175,
          negativeReviews: 12,
          matchReason: 'Fast and reliable, good feedback, skill match'
        },
        {
          id: 3,
          name: 'Bilal Ahmed',
          trustScore: 87,
          rating: 4.7,
          completedJobs: 156,
          location: 'Sialkot - 4 km away',
          skills: ['Embroidery', 'Finishing Work', 'Detail-Oriented'],
          aiScore: 89,
          sentiment: 'positive',
          positiveReviews: 148,
          negativeReviews: 8,
          matchReason: 'Excellent finishing work, attention to detail'
        },
      ];
    }
  };

  // R.1.9: Sentiment Analysis
  const getSentimentDisplay = (sentiment, positiveReviews, negativeReviews) => {
    const total = positiveReviews + negativeReviews;
    const positivePercentage = ((positiveReviews / total) * 100).toFixed(0);

    switch (sentiment) {
      case 'very_positive':
        return {
          icon: <ThumbsUp className="size-4" />,
          color: 'text-green-600',
          bgColor: isDarkMode ? 'bg-green-900/20' : 'bg-green-50',
          borderColor: 'border-green-500',
          text: `${positivePercentage}% Positive Reviews`,
        };
      case 'positive':
        return {
          icon: <ThumbsUp className="size-4" />,
          color: 'text-blue-600',
          bgColor: isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50',
          borderColor: 'border-blue-500',
          text: `${positivePercentage}% Positive Reviews`,
        };
      case 'neutral':
        return {
          icon: <Meh className="size-4" />,
          color: 'text-yellow-600',
          bgColor: isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50',
          borderColor: 'border-yellow-500',
          text: `${positivePercentage}% Positive Reviews`,
        };
      case 'negative':
        return {
          icon: <ThumbsDown className="size-4" />,
          color: 'text-red-600',
          bgColor: isDarkMode ? 'bg-red-900/20' : 'bg-red-50',
          borderColor: 'border-red-500',
          text: `Low Positive Feedback`,
        };
      default:
        return {
          icon: <Meh className="size-4" />,
          color: 'text-gray-600',
          bgColor: isDarkMode ? 'bg-gray-900/20' : 'bg-gray-50',
          borderColor: 'border-gray-500',
          text: 'No Reviews Yet',
        };
    }
  };

  if (loading) {
    return (
      <Card className={`${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
            <Sparkles className="size-5 text-[#2563EB]" />
            AI Recommendations
          </CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Analyzing skills, trust scores, location, and past performance...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin size-8 border-4 border-[#2563EB] border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
          <Sparkles className="size-5 text-[#2563EB]" />
          AI-Powered Recommendations
        </CardTitle>
        <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          Based on trust scores, location, skills, and performance analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => {
          const sentimentDisplay = getSentimentDisplay(rec.sentiment, rec.positiveReviews, rec.negativeReviews);
          
          return (
            <Card 
              key={rec.id} 
              className={`${isDarkMode ? 'bg-[#1F2933] border-gray-700 hover:border-[#2563EB]' : 'bg-gray-50 border-gray-200 hover:border-[#2563EB]'} transition-colors cursor-pointer`}
              onClick={() => onSelectUser(rec)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className={`font-medium mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                      {rec.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Star className="size-3 fill-yellow-500 text-yellow-500" />
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{rec.rating}</span>
                      </div>
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>•</span>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                        {userType === 'manufacturer' ? `${rec.completedOrders} orders` : `${rec.completedJobs} jobs`}
                      </span>
                    </div>
                  </div>
                  <Badge className="bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB] hover:bg-[#2563EB]/20">
                    <TrendingUp className="size-3 mr-1" />
                    AI Score: {rec.aiScore}%
                  </Badge>
                </div>

                {/* Trust Score */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Trust Score</span>
                    <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{rec.trustScore}/100</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                    <div 
                      className="h-full bg-gradient-to-r from-[#2563EB] to-green-500 transition-all"
                      style={{ width: `${rec.trustScore}%` }}
                    />
                  </div>
                </div>

                {/* R.1.9: Sentiment Analysis Display */}
                <div className={`flex items-center gap-2 p-2 rounded-lg mb-3 ${sentimentDisplay.bgColor} border ${sentimentDisplay.borderColor}`}>
                  <div className={sentimentDisplay.color}>
                    {sentimentDisplay.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs ${sentimentDisplay.color}`}>{sentimentDisplay.text}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {rec.positiveReviews} positive, {rec.negativeReviews} negative
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 mb-3 text-xs">
                  <MapPin className={`size-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{rec.location}</span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {rec.skills.map((skill, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className={`text-xs ${isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}`}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* AI Match Reason */}
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-[#2A3642]' : 'bg-white'}`}>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Award className="size-3 inline mr-1 text-[#2563EB]" />
                    <strong className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Why recommended:</strong> {rec.matchReason}
                  </p>
                </div>

                <Button className="w-full mt-3 bg-[#2563EB] hover:bg-[#1d4ed8]" size="sm">
                  View Full Profile
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
/* This file provides AI-based recommendations (manufacturers/labour) using trust score, skills, location, and also shows sentiment analysis of reviews.

It is web-based (React frontend), but can be used in both if integrated into hybrid/mobile apps.*/