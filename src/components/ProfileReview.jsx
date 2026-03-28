import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/labelstatus';
import { X, Star, MapPin, TrendingUp, Award, CheckCircle, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { TrustScoreGauge } from './TrustScore';

export function ProfileViewWithReview({ 
  onClose, 
  manufacturer,
  newReview,
  previousTrustScore
}) {
  const { isDarkMode } = useTheme();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className={`max-w-3xl w-full my-8 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <CardHeader className={`border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`size-12 rounded-full flex items-center justify-center ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <span className="text-xl font-bold text-[#2563EB]">
                  {manufacturer.name.charAt(0)}
                </span>
              </div>
              <div>
                <CardTitle className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2937]'}>
                  {manufacturer.name}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="size-3 text-gray-500" />
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {manufacturer.location}
                  </span>
                </div>
              </div>
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
          {/* Trust Score Section */}
          <div className={`p-6 rounded-lg border ${
            isDarkMode 
              ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800/30' 
              : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2937]'}`}>
                  Trust Score
                </h3>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  AI-verified performance metric
                </p>
                
                {/* Rank Display */}
                {manufacturer.rank && manufacturer.city && (
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="size-4 text-green-500" />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2937]'}`}>
                      Rank: #{manufacturer.rank} in {manufacturer.city}
                    </span>
                  </div>
                )}

                {/* Show update notification if new review */}
                {newReview && previousTrustScore && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full">
                    <TrendingUp className="size-4 text-green-500" />
                    <span className="text-sm font-medium text-green-500">
                      +{manufacturer.trustScore - previousTrustScore} points from new review
                    </span>
                  </div>
                )}
              </div>
              
              {/* Trust Score Gauge */}
              <TrustScoreGauge
                initialScore={previousTrustScore || manufacturer.trustScore}
                finalScore={manufacturer.trustScore}
                size="lg"
                showAnimation={!!newReview}
              />
            </div>
          </div>

          {/* AI Tags */}
          {manufacturer.tags && manufacturer.tags.length > 0 && (
            <div>
              <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2937]'
              }`}>
                <Award className="size-4" />
                AI-Generated Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {manufacturer.tags.map((tag, index) => (
                  <Badge 
                    key={index}
                    className="bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20 hover:bg-[#2563EB]/20"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Recent Reviews */}
          <div>
            <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
              isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2937]'
            }`}>
              <Star className="size-4 fill-yellow-500 text-yellow-500" />
              Recent Reviews ({manufacturer.reviews.length})
            </h3>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {/* Show new review at top if exists */}
              {newReview && (
                <div className={`p-4 rounded-lg border-2 ${
                  isDarkMode 
                    ? 'bg-green-900/20 border-green-700' 
                    : 'bg-green-50 border-green-300'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="size-4 text-green-500" />
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2937]'}`}>
                        Your Review (Just Added)
                      </span>
                      <Badge className="bg-green-500/20 text-green-500 border-0">
                        {newReview.sentiment}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3 ${
                            i < newReview.rating
                              ? 'fill-yellow-500 text-yellow-500'
                              : isDarkMode
                              ? 'fill-gray-700 text-gray-700'
                              : 'fill-gray-300 text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {newReview.comment}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="size-3 text-green-500" />
                    <span className="text-xs text-green-500">Just now</span>
                  </div>
                </div>
              )}

              {/* Existing reviews */}
              {manufacturer.reviews.map((review) => (
                <div 
                  key={review.id}
                  className={`p-4 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2937]'}`}>
                      {review.clientName}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3 ${
                            i < review.rating
                              ? 'fill-yellow-500 text-yellow-500'
                              : isDarkMode
                              ? 'fill-gray-700 text-gray-700'
                              : 'fill-gray-300 text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {review.comment}
                  </p>
                  <span className={`text-xs mt-2 inline-block ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {review.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
/*Displays manufacturer profile with trust score, AI tags, and reviews including new review impact.

This is a React frontend component, mainly for web-based apps (can be adapted for mobile but built for web UI). */