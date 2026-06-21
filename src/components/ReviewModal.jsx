import { useState, useEffect } from 'react';
import { X, Star, Loader2, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Textarea } from './ui/textarea input';
import { useTheme } from '../contexts/ThemeContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5003';
const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token') || '';

function StarRating({ value, onChange, readonly = false }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`size-7 transition-colors ${
            star <= (hover || value) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          } ${readonly ? '' : 'cursor-pointer'}`}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        />
      ))}
    </div>
  );
}

export function ReviewModal({ revieweeId, revieweeName, onClose, onReviewed }) {
  const { isDarkMode } = useTheme();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!revieweeId) return;
    fetch(`${API}/api/reviews/${revieweeId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((data) => {
        // ✅ FIX: API returns { reviews: [...] } object
        const list = Array.isArray(data) ? data : (data.reviews || []);
        setReviews(list);
      })
      .catch(() => setReviews([]))
      .finally(() => setLoadingReviews(false));
  }, [revieweeId, submitted]);

  const handleSubmit = async () => {
    if (!rating) return setError('Rating zaroor dein');
    if (comment.trim().length < 5) return setError('Review thodi lambi likhein');
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/reviews/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ revieweeId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');
      setSubmitted(true);
      setRating(0);
      setComment('');
      if (onReviewed) onReviewed();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-lg max-h-[90vh] flex flex-col ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardHeader className={`border-b flex-shrink-0 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>
                Reviews — {revieweeName}
              </CardTitle>
              {avgRating && (
                <CardDescription className="flex items-center gap-1 mt-1">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-yellow-500">{avgRating}</span>
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>({reviews.length} reviews)</span>
                </CardDescription>
              )}
            </div>
            {/* ✅ FIX: Visible close button */}
            <Button variant="ghost" size="icon" onClick={onClose} className="bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 hover:text-white">
              <X className="size-5" />
            </Button>
          </div>
        </CardHeader>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              Apna Review Dein
            </p>

            {submitted ? (
              <div className="flex items-center gap-2 text-green-600 py-2">
                <CheckCircle className="size-5" />
                <span className="text-sm font-medium">Review submit ho gaya! Shukriya 🎉</span>
              </div>
            ) : (
              <>
                <StarRating value={rating} onChange={setRating} />
                <Textarea
                  className={`mt-3 resize-none ${isDarkMode ? 'bg-[#2A3642] border-gray-600 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                  placeholder="Apna experience likhein..."
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="mt-3 w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                >
                  {submitting ? <><Loader2 className="size-4 mr-2 animate-spin" />Submitting...</> : 'Submit Review'}
                </Button>
              </>
            )}
          </div>

          <div>
            <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              Sab Reviews ({reviews.length})
            </p>

            {loadingReviews ? (
              <div className="flex justify-center py-6">
                <Loader2 className="size-6 animate-spin text-[#2563EB]" />
              </div>
            ) : reviews.length === 0 ? (
              <p className={`text-sm text-center py-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Abhi koi review nahi hai
              </p>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev._id}
                    className={`p-4 rounded-lg border ${isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-white border-gray-200'}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                          {rev.reviewer?.name || 'Anonymous'}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {new Date(rev.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <StarRating value={rev.rating} readonly />
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{rev.comment}</p>
                    {rev.sentimentLabel && rev.sentimentLabel !== 'fallback_rating_only' && (
                      <span className={`mt-2 inline-block text-xs px-2 py-0.5 rounded-full ${
                        rev.sentimentLabel.includes('pos') ? 'bg-green-500/10 text-green-600' :
                        rev.sentimentLabel.includes('neg') ? 'bg-red-500/10 text-red-500' :
                        'bg-gray-500/10 text-gray-500'
                      }`}>
                        AI: {rev.sentimentLabel}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
