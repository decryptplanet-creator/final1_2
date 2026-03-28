import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, Star, MapPin, Mail, MessageSquare, Shield, Award, Briefcase, Clock, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { ChatModal } from './ChatModal';
import { LocationModal } from './LocationModal';

export function ProfileDetailModal({ onClose, profile, onContact, onHire }) {
  const [showChat, setShowChat] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  const handleEmail = () => {
    window.location.href = `mailto:${profile.email}?subject=Inquiry from Skillora Platform`;
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`size-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <Card className="max-w-3xl w-full my-8 bg-gray-900 border-gray-800">
          <CardHeader className="border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Profile Avatar */}
                <div className="size-16 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-white text-2xl font-bold">
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-white">{profile.name}</CardTitle>
                    {profile.verified && (
                      <CheckCircle className="size-5 text-green-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="border-red-600 text-red-400">
                      {profile.type}
                    </Badge>
                    {profile.category && (
                      <Badge variant="outline" className="border-gray-600 text-gray-400">
                        {profile.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="size-5" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {/* Trust Score & Rating */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Shield className="size-4" />
                  <span className="text-sm">Trust Score</span>
                </div>
                <div className="text-2xl font-bold text-white">{profile.trustScore}%</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Star className="size-4" />
                  <span className="text-sm">Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">{profile.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({profile.totalReviews})</span>
                </div>
              </div>
              {profile.completedProjects !== undefined && (
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Briefcase className="size-4" />
                    <span className="text-sm">Completed</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{profile.completedProjects}</div>
                </div>
              )}
            </div>

            {/* Bio */}
            {profile.bio && (
              <div>
                <h3 className="text-white font-semibold mb-2">About</h3>
                <p className="text-gray-400">{profile.bio}</p>
              </div>
            )}

            {/* Skills (for Labour/Manufacturer) */}
            {profile.skills && profile.skills.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, idx) => (
                    <Badge key={idx} className="bg-red-600/20 text-red-400 border-red-600/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Rate (for Labour) */}
            {profile.rate && (
              <div>
                <h3 className="text-white font-semibold mb-2">Hourly Rate</h3>
                <div className="text-2xl font-bold text-red-400">PKR {profile.rate}/hour</div>
              </div>
            )}

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="size-4" />
              <span>{profile.location}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowLocation(true)}
                className="ml-2 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
              >
                View Map
              </Button>
            </div>

            {/* Response Time */}
            {profile.responseTime && (
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="size-4" />
                <span>Responds within {profile.responseTime}</span>
              </div>
            )}

            {/* Rating Display */}
            <div>
              <h3 className="text-white font-semibold mb-2">Reviews</h3>
              <div className="flex items-center gap-3">
                {renderStars(profile.rating)}
                <span className="text-gray-400">
                  {profile.rating.toFixed(1)} out of 5 ({profile.totalReviews} reviews)
                </span>
              </div>
            </div>

            {/* Sample Reviews */}
            <div className="space-y-3">
              {[
                { author: 'Ali Ahmed', rating: 5, comment: 'Excellent work quality and on-time delivery!', date: '2 weeks ago' },
                { author: 'Sarah Khan', rating: 4, comment: 'Professional and responsive. Highly recommended.', date: '1 month ago' },
              ].map((review, idx) => (
                <div key={idx} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-white font-medium">{review.author}</span>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-800">
              <Button
                onClick={handleEmail}
                variant="outline"
                className="flex-1 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
              >
                <Mail className="size-4 mr-2" />
                Email
              </Button>
              <Button
                onClick={() => {
                  setShowChat(true);
                  if (onContact) onContact();
                }}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                <MessageSquare className="size-4 mr-2" />
                {profile.type === 'labour' ? 'Contact' : 'Message'}
              </Button>
              {profile.type === 'labour' && onHire && (
                <Button
                  onClick={onHire}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Award className="size-4 mr-2" />
                  Hire
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {showChat && <ChatModal onClose={() => setShowChat(false)} />}
      {showLocation && (
        <LocationModal
          onClose={() => setShowLocation(false)}
          userName={profile.name}
          userType={profile.type}
        />
      )}
    </>
  );
}
/*User ka detailed profile modal (view profile, ratings, skills, reviews, contact/hire options show karne ke liye).

Yeh web-based React component hai, lekin same concept ko mobile app me bhi use kiya ja sakta hai (so dono ke liye adaptable). */