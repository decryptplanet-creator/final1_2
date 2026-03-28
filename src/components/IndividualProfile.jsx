import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/labelstatus';
import { 
  X, Star, MapPin, Briefcase, Factory, HardHat, Shield, Award, 
  TrendingUp, Clock, CheckCircle, MessageSquare, Mail, 
  Calendar, DollarSign, Users, FileText, Video, Image as ImageIcon, ArrowLeft 
} from 'lucide-react';
import { useState } from 'react';
import { ChatModal } from './ChatModal';
import { EmailModal } from './EmailModal(Optional)';
import { LocationModal } from './LocationModal';

export function IndividualProfile({ profile, userType, onClose }) {
  const [showChat, setShowChat] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  const getColor = () => {
    if (userType === 'client') return { 
      primary: '#2563EB', 
      bg: 'bg-[#2563EB]', 
      text: 'text-[#2563EB]', 
      border: 'border-[#2563EB]',
      bgLight: 'bg-[#2563EB]/10'
    };
    if (userType === 'manufacturer') return { 
      primary: '#2563EB', 
      bg: 'bg-[#2563EB]', 
      text: 'text-[#2563EB]', 
      border: 'border-[#2563EB]',
      bgLight: 'bg-[#2563EB]/10'
    };
    return { 
      primary: '#2563EB', 
      bg: 'bg-[#2563EB]', 
      text: 'text-[#2563EB]', 
      border: 'border-[#2563EB]',
      bgLight: 'bg-[#2563EB]/10'
    };
  };

  const color = getColor();
  const Icon = userType === 'client' ? Briefcase : userType === 'manufacturer' ? Factory : HardHat;

  // Mock data for reviews
  const reviews = [
    { 
      id: 1, 
      reviewer: 'Asad Malik', 
      rating: 5, 
      comment: 'Excellent work quality and professional service. Highly recommended!',
      date: '2 weeks ago'
    },
    { 
      id: 2, 
      reviewer: 'Saira Khan', 
      rating: 5, 
      comment: 'Very reliable and delivers on time. Great communication throughout.',
      date: '1 month ago'
    },
    { 
      id: 3, 
      reviewer: 'Imran Sheikh', 
      rating: 4, 
      comment: 'Good work overall. Minor delays but quality was excellent.',
      date: '2 months ago'
    },
  ];

  // Mock portfolio/work samples
  const workSamples = [
    'https://images.unsplash.com/photo-1558769132-cb1aea41f438?w=400',
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400',
    'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400',
    'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=400',
  ];

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="max-w-5xl w-full my-8">
        <div className="bg-gray-900 border border-gray-800 rounded-lg">
          {/* Header */}
          <div className={`${color.bgLight} border-b border-gray-800 p-6 rounded-t-lg`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
                  title="Back to Search"
                >
                  <ArrowLeft className="size-5" />
                </button>
                <div className={`size-20 rounded-xl ${color.bg} flex items-center justify-center shrink-0`}>
                  <Icon className="size-10 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl text-white font-semibold">{profile.name}</h2>
                    {profile.verified && (
                      <Badge className={`${color.bg} text-white`}>
                        <Shield className="size-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-300 mb-2">{profile.type}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-4" />
                      {profile.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      {profile.rating} Rating
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="size-5" />
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-4 p-6 border-b border-gray-800">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className={`size-5 ${color.text}`} />
                <span className="text-2xl text-white font-semibold">{profile.trustScore}</span>
              </div>
              <p className="text-xs text-gray-400">Trust Score</p>
            </div>
            
            {userType === 'client' && 'orders' in profile && (
              <>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <FileText className={`size-5 ${color.text}`} />
                    <span className="text-2xl text-white font-semibold">{profile.orders}</span>
                  </div>
                  <p className="text-xs text-gray-400">Total Orders</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <DollarSign className={`size-5 ${color.text}`} />
                    <span className="text-xl text-white font-semibold">{'totalSpent' in profile ? profile.totalSpent : ''}</span>
                  </div>
                  <p className="text-xs text-gray-400">Total Spent</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <CheckCircle className={`size-5 ${color.text}`} />
                    <span className="text-2xl text-white font-semibold">{'completionRate' in profile ? profile.completionRate + '%' : ''}</span>
                  </div>
                  <p className="text-xs text-gray-400">Completion Rate</p>
                </div>
              </>
            )}

            {userType === 'manufacturer' && 'completedOrders' in profile && (
              <>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <CheckCircle className={`size-5 ${color.text}`} />
                    <span className="text-2xl text-white font-semibold">{profile.completedOrders}</span>
                  </div>
                  <p className="text-xs text-gray-400">Completed Orders</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Clock className={`size-5 ${color.text}`} />
                    <span className="text-lg text-white font-semibold">{'responseTime' in profile ? profile.responseTime : ''}</span>
                  </div>
                  <p className="text-xs text-gray-400">Response Time</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Factory className={`size-5 ${color.text}`} />
                    <span className="text-lg text-white font-semibold">{profile.capacity}</span>
                  </div>
                  <p className="text-xs text-gray-400">Capacity</p>
                </div>
              </>
            )}

            {userType === 'labour' && 'rate' in profile && (
              <>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <CheckCircle className={`size-5 ${color.text}`} />
                    <span className="text-2xl text-white font-semibold">{'completedJobs' in profile ? profile.completedJobs : ''}</span>
                  </div>
                  <p className="text-xs text-gray-400">Completed Jobs</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <DollarSign className={`size-5 ${color.text}`} />
                    <span className="text-lg text-white font-semibold">{profile.rate}</span>
                  </div>
                  <p className="text-xs text-gray-400">Hourly Rate</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Clock className={`size-5 ${color.text}`} />
                    <span className="text-lg text-white font-semibold">{'availability' in profile ? profile.availability : ''}</span>
                  </div>
                  <p className="text-xs text-gray-400">Status</p>
                </div>
              </>
            )}
          </div>

          <div className="p-6 space-y-6">
            {/* Contact Actions */}
            <div>
              <h3 className="text-lg text-white font-semibold mb-3">Contact</h3>
              <div className="flex flex-wrap gap-3">
                <Button className={`${color.bg} hover:opacity-90 text-white`} onClick={() => setShowChat(true)}>
                  <MessageSquare className="size-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white" onClick={() => setShowEmail(true)}>
                  <Mail className="size-4 mr-2" />
                  Email
                </Button>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white" onClick={() => setShowLocation(true)}>
                  <MapPin className="size-4 mr-2" />
                  Location
                </Button>
              </div>
            </div>

            {/* Work Samples / Portfolio */}
            {userType === 'labour' && (
              <div>
                <h3 className="text-lg text-white font-semibold mb-3 flex items-center gap-2">
                  <Video className="size-5" />
                  Skill Proof & Work Samples
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {workSamples.map((sample, idx) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer group">
                      <img 
                        src={sample} 
                        alt={`Work sample ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* About / Description */}
            <div>
              <h3 className="text-lg text-white font-semibold mb-3">About</h3>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <p className="text-gray-300 leading-relaxed">
                  {userType === 'client' && `${profile.name} is a verified client with an excellent track record on Skillora. They have consistently placed quality orders and maintained strong professional relationships with manufacturers.`}
                  {userType === 'manufacturer' && `${profile.name} is a verified manufacturer specializing in ${profile.type}. With state-of-the-art facilities and experienced workforce, they deliver high-quality products on time.`}
                  {userType === 'labour' && `${profile.name} is a skilled ${profile.skill} with extensive experience in the textile industry. They maintain high quality standards and have built a strong reputation through reliable work.`}
                </p>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h3 className="text-lg text-white font-semibold mb-3 flex items-center gap-2">
                <Star className="size-5 fill-yellow-400 text-yellow-400" />
                Reviews & Ratings
              </h3>
              <div className="space-y-3">
                {reviews.map((review) => (
                  <Card key={review.id} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-white font-medium">{review.reviewer}</p>
                          <p className="text-xs text-gray-400">{review.date}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Certifications (for manufacturer) */}
            {userType === 'manufacturer' && (
              <div>
                <h3 className="text-lg text-white font-semibold mb-3 flex items-center gap-2">
                  <Award className="size-5" />
                  Certifications & Compliance
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex items-center gap-3">
                    <CheckCircle className="size-5 text-[#2563EB]" />
                    <div>
                      <p className="text-white text-sm font-medium">PPC Law Compliant</p>
                      <p className="text-xs text-gray-400">Verified legal documents</p>
                    </div>
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex items-center gap-3">
                    <CheckCircle className="size-5 text-[#2563EB]" />
                    <div>
                      <p className="text-white text-sm font-medium">Tax Registered</p>
                      <p className="text-xs text-gray-400">Active business license</p>
                    </div>
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex items-center gap-3">
                    <CheckCircle className="size-5 text-[#2563EB]" />
                    <div>
                      <p className="text-white text-sm font-medium">Quality Certified</p>
                      <p className="text-xs text-gray-400">ISO 9001:2015</p>
                    </div>
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex items-center gap-3">
                    <CheckCircle className="size-5 text-[#2563EB]" />
                    <div>
                      <p className="text-white text-sm font-medium">Safety Standards</p>
                      <p className="text-xs text-gray-400">OSHA compliant</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {showChat && <ChatModal onClose={() => setShowChat(false)} />}
      {showEmail && (
        <EmailModal 
          onClose={() => setShowEmail(false)}
          recipientName={profile.name}
          recipientEmail={`${profile.name.toLowerCase().replace(/\s+/g, '.')}@example.com`}
        />
      )}
      {showLocation && (
        <LocationModal 
          onClose={() => setShowLocation(false)}
          userName={profile.name}
          userType={userType}
        />
      )}
    </div>
  );
}
/*Purpose: Detailed individual profile UI showing user info, stats, reviews, portfolio, and contact options (chat, email, location).
Type: Web-based (React component), but can be adapted for both web and mobile apps. */