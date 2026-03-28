import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea input';
import { X, Star } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ReviewSubmissionModal({ 
  onClose, 
  onSubmit,
  manufacturerName,
  orderId 
}) {
  const { isDarkMode } = useTheme();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    if (comment.trim().length < 10) {
      alert('Please write at least 10 characters in your review');
      return;
    }
    onSubmit(rating, comment);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className={`max-w-lg w-full ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <CardHeader className={`border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>
                Post-Delivery Feedback
              </CardTitle>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Order #{orderId} - {manufacturerName}
              </p>
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
          {/* Star Rating */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              Rate Your Experience
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`size-10 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-500 text-yellow-500'
                        : isDarkMode
                        ? 'fill-gray-700 text-gray-700'
                        : 'fill-gray-300 text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className={`ml-2 text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  {rating} / 5
                </span>
              )}
            </div>
          </div>

          {/* Comment Box */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              Write Your Experience
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with the manufacturer's service, quality, delivery time, communication, etc..."
              className={`min-h-[150px] ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-[#F9FAFB] placeholder:text-gray-500' 
                  : 'bg-white border-gray-300 text-[#1F2933] placeholder:text-gray-400'
              }`}
              maxLength={500}
            />
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {comment.length} / 500 characters
            </p>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
            disabled={rating === 0 || comment.trim().length < 10}
          >
            Submit for AI Verification
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
/*Purpose: This file creates a review submission modal where users give rating and feedback after completing an order.
Platform: Web-based (React UI), but can be used for both web and app if adapted.
 */