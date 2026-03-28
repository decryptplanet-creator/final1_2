import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea input';
import { Badge } from './ui/labelstatus';
import { X, Sparkles, Smile, Meh, Frown, TrendingUp, Star } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

export function AISentimentAnalysis({ manufacturerName, currentTrustScore, onSubmit, onClose }) {
  const { isDarkMode } = useTheme();
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [sentiment, setSentiment] = useState(null);
  const [showTrustScoreUpdate, setShowTrustScoreUpdate] = useState(false);
  const [newTrustScore, setNewTrustScore] = useState(currentTrustScore);

  // AI Analysis Animation
  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            // Analyze sentiment
            const analyzedSentiment = analyzeSentiment(review, rating);
            setSentiment(analyzedSentiment);
            
            // Calculate new trust score
            const scoreImpact = calculateTrustScoreImpact(analyzedSentiment, rating);
            const updatedScore = Math.min(100, Math.max(0, currentTrustScore + scoreImpact));
            setNewTrustScore(updatedScore);
            
            setTimeout(() => {
              setShowTrustScoreUpdate(true);
            }, 500);
            return 100;
          }
          return prev + 5;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing, review, rating, currentTrustScore]);

  const analyzeSentiment = (text, stars) => {
    const lowerText = text.toLowerCase();
    
    // Positive keywords
    const positiveWords = ['excellent', 'great', 'amazing', 'perfect', 'quality', 'recommend', 'professional', 'happy', 'satisfied', 'good'];
    const negativeWords = ['bad', 'poor', 'delay', 'late', 'disappointing', 'issue', 'problem', 'unhappy', 'worst'];
    
    const foundPositive = positiveWords.filter(word => lowerText.includes(word));
    const foundNegative = negativeWords.filter(word => lowerText.includes(word));
    
    let type;
    let score;
    let keywords;
    
    if (stars >= 4 && foundPositive.length > foundNegative.length) {
      type = 'positive';
      score = 80 + (stars * 4);
      keywords = foundPositive.slice(0, 3);
    } else if (stars <= 2 || foundNegative.length > foundPositive.length) {
      type = 'negative';
      score = 30 + (stars * 5);
      keywords = foundNegative.slice(0, 3);
    } else {
      type = 'neutral';
      score = 50 + (stars * 5);
      keywords = [...foundPositive, ...foundNegative].slice(0, 3);
    }
    
    return { type, score, keywords };
  };

  const calculateTrustScoreImpact = (sentiment, stars) => {
    if (sentiment.type === 'positive' && stars >= 4) {
      return 3; // Increase by 3%
    } else if (sentiment.type === 'negative' && stars <= 2) {
      return -5; // Decrease by 5%
    } else {
      return 1; // Small increase for neutral
    }
  };

  const handleSubmitReview = () => {
    if (review && rating > 0) {
      setIsAnalyzing(true);
      setAnalysisProgress(0);
    }
  };

  const handleConfirmSubmit = () => {
    if (sentiment) {
      onSubmit(review, rating, sentiment.type, newTrustScore);
    }
  };

  const getSentimentIcon = (type) => {
    switch (type) {
      case 'positive':
        return <Smile className="size-8 text-green-600" />;
      case 'neutral':
        return <Meh className="size-8 text-yellow-600" />;
      case 'negative':
        return <Frown className="size-8 text-red-600" />;
      default:
        return null;
    }
  };

  const getSentimentColor = (type) => {
    switch (type) {
      case 'positive':
        return isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200';
      case 'neutral':
        return isDarkMode ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200';
      case 'negative':
        return isDarkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-2xl ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardHeader className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2937]'}`}>
                <Sparkles className="size-6 text-[#2563EB]" />
                Submit Review - AI Analysis
              </CardTitle>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                For: {manufacturerName}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {!isAnalyzing && !sentiment ? (
            <>
              {/* AI Info Banner */}
              <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex items-start gap-3">
                  <Sparkles className="size-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2937]'}`}>
                      AI Sentiment Analysis
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Our AI will analyze your review sentiment and automatically update the manufacturer's trust score based on your feedback.
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-[#1F2937]'}`}>
                  Your Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`size-10 ${
                          star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : isDarkMode
                            ? 'text-gray-600'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#1F2937]'}`}>
                  Your Review
                </label>
                <Textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your experience with this manufacturer..."
                  className={`min-h-[120px] ${
                    isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitReview}
                disabled={!review || rating === 0}
                className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] disabled:opacity-50"
              >
                <Sparkles className="size-4 mr-2" />
                Submit for AI Analysis
              </Button>
            </>
          ) : isAnalyzing && !sentiment ? (
            <>
              {/* Analyzing Animation */}
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className={`size-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
                  }`}
                >
                  <Sparkles className="size-8 text-[#2563EB]" />
                </motion.div>
                <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2937]'}`}>
                  AI Analyzing Sentiment...
                </h3>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Processing your review and calculating impact on trust score
                </p>
                
                {/* Progress Bar */}
                <div className="max-w-md mx-auto">
                  <div className="flex justify-between text-sm mb-2">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Analyzing...</span>
                    <span className="text-[#2563EB] font-medium">{analysisProgress}%</span>
                  </div>
                  <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                    <motion.div
                      className="h-full bg-[#2563EB]"
                      initial={{ width: 0 }}
                      animate={{ width: `${analysisProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : sentiment ? (
            <>
              {/* Sentiment Result */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`p-6 rounded-lg border-2 ${getSentimentColor(sentiment.type)}`}
              >
                <div className="text-center mb-4">
                  <div className="flex justify-center mb-3">
                    {getSentimentIcon(sentiment.type)}
                  </div>
                  <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2937]'}`}>
                    {sentiment.type.charAt(0).toUpperCase() + sentiment.type.slice(1)} Sentiment Detected
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <Badge className="bg-[#2563EB]">AI Confidence: {sentiment.score}%</Badge>
                  </div>
                </div>

                {sentiment.keywords.length > 0 && (
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1F2933]' : 'bg-white'}`}>
                    <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Key words detected:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sentiment.keywords.map((keyword, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Trust Score Impact */}
              <AnimatePresence>
                {showTrustScoreUpdate && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className={`p-6 rounded-lg border ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`size-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
                      }`}>
                        <TrendingUp className="size-6 text-[#2563EB]" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2937]'}`}>
                          Trust Score Update
                        </h4>
                        <div className="space-y-3">
                          {/* Old Score */}
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Current Score</span>
                              <span className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2937]'}>{currentTrustScore}%</span>
                            </div>
                            <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                              <div className="h-full bg-gray-500" style={{ width: `${currentTrustScore}%` }} />
                            </div>
                          </div>

                          {/* New Score with Animation */}
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>New Score</span>
                              <span className="text-[#2563EB] font-medium">{newTrustScore}%</span>
                            </div>
                            <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                              <motion.div
                                className="h-full bg-[#2563EB]"
                                initial={{ width: `${currentTrustScore}%` }}
                                animate={{ width: `${newTrustScore}%` }}
                                transition={{ duration: 1, ease: "easeInOut" }}
                              />
                            </div>
                          </div>

                          <div className={`flex items-center gap-2 text-xs ${
                            newTrustScore > currentTrustScore ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <Sparkles className="size-3" />
                            <span>
                              {newTrustScore > currentTrustScore ? '+' : ''}{newTrustScore - currentTrustScore}% 
                              {newTrustScore > currentTrustScore ? ' increase' : ' decrease'} based on your review
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8]"
                  onClick={handleConfirmSubmit}
                >
                  Confirm & Submit Review
                </Button>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}


/* Purpose: This file handles AI-based sentiment analysis of user reviews and updates the manufacturer’s trust score based on feedback.

Type: It is a frontend component, so it can be used in both web apps and hybrid app (React Native/WebView) setups.*/ 