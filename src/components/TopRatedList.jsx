import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { X, Star, MapPin, Briefcase, Factory, HardHat, ChevronRight, Award, TrendingUp, Shield } from 'lucide-react';
import { ChatModal } from './ChatModal';
import { EmailModal } from './EmailModal(Optional)';
import { LocationModal } from './LocationModal';

export function TopRatedList({ userType, onClose, onViewProfile }) {
  const [showChat, setShowChat] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const topClients = [
    { 
      id: 1, 
      name: 'Fashion Hub Ltd', 
      type: 'Textile Orders', 
      rating: 4.9, 
      orders: 67,
      location: 'Karachi, Pakistan',
      verified: true,
      trustScore: 98,
      totalSpent: '15M PKR',
      completionRate: 97
    },
    { 
      id: 2, 
      name: 'Global Exports', 
      type: 'Garments', 
      rating: 4.9, 
      orders: 54,
      location: 'Lahore, Pakistan',
      verified: true,
      trustScore: 95,
      totalSpent: '12M PKR',
      completionRate: 96
    },
    { 
      id: 3, 
      name: 'Elite Textiles', 
      type: 'Export Orders', 
      rating: 4.8, 
      orders: 45,
      location: 'Faisalabad, Pakistan',
      verified: true,
      trustScore: 93,
      totalSpent: '9.5M PKR',
      completionRate: 95
    },
    { 
      id: 4, 
      name: 'Premium Fabrics', 
      type: 'Wholesale', 
      rating: 4.8, 
      orders: 41,
      location: 'Multan, Pakistan',
      verified: true,
      trustScore: 92,
      totalSpent: '8.2M PKR',
      completionRate: 94
    },
    { 
      id: 5, 
      name: 'Textile Masters', 
      type: 'Fabric Orders', 
      rating: 4.7, 
      orders: 32,
      location: 'Sialkot, Pakistan',
      verified: true,
      trustScore: 90,
      totalSpent: '6.8M PKR',
      completionRate: 93
    },
    { 
      id: 6, 
      name: 'Modern Apparel', 
      type: 'Clothing', 
      rating: 4.7, 
      orders: 28,
      location: 'Gujranwala, Pakistan',
      verified: true,
      trustScore: 89,
      totalSpent: '5.5M PKR',
      completionRate: 92
    },
  ];

  const topManufacturers = [
    { 
      id: 1, 
      name: 'Prime Manufacturing', 
      type: 'Textile Production', 
      rating: 4.9, 
      capacity: 'Large',
      location: 'Karachi, Pakistan',
      verified: true,
      trustScore: 97,
      completedOrders: 234,
      responseTime: '< 2 hours'
    },
    { 
      id: 2, 
      name: 'Supreme Textiles', 
      type: 'Manufacturing', 
      rating: 4.9, 
      capacity: 'Medium',
      location: 'Faisalabad, Pakistan',
      verified: true,
      trustScore: 96,
      completedOrders: 198,
      responseTime: '< 3 hours'
    },
    { 
      id: 3, 
      name: 'Apex Industries', 
      type: 'Fabric Production', 
      rating: 4.8, 
      capacity: 'Large',
      location: 'Lahore, Pakistan',
      verified: true,
      trustScore: 94,
      completedOrders: 176,
      responseTime: '< 4 hours'
    },
    { 
      id: 4, 
      name: 'Quality Textiles', 
      type: 'Fabric Manufacturing', 
      rating: 4.8, 
      capacity: 'Medium',
      location: 'Multan, Pakistan',
      verified: true,
      trustScore: 93,
      completedOrders: 165,
      responseTime: '< 3 hours'
    },
    { 
      id: 5, 
      name: 'Royal Industries', 
      type: 'Garment Production', 
      rating: 4.7, 
      capacity: 'Large',
      location: 'Sialkot, Pakistan',
      verified: true,
      trustScore: 91,
      completedOrders: 142,
      responseTime: '< 5 hours'
    },
    { 
      id: 6, 
      name: 'Elite Manufacturing', 
      type: 'Textile Processing', 
      rating: 4.7, 
      capacity: 'Medium',
      location: 'Gujrat, Pakistan',
      verified: true,
      trustScore: 89,
      completedOrders: 128,
      responseTime: '< 4 hours'
    },
  ];

  const topLabour = [
    { 
      id: 1, 
      name: 'Ahmed Khan', 
      skill: 'Master Tailor', 
      rating: 4.9, 
      rate: '800 PKR/hr',
      location: 'Karachi, Pakistan',
      verified: true,
      trustScore: 96,
      completedJobs: 187,
      availability: 'Available'
    },
    { 
      id: 2, 
      name: 'Bilal Ahmed', 
      skill: 'Pattern Maker', 
      rating: 4.8, 
      rate: '750 PKR/hr',
      location: 'Lahore, Pakistan',
      verified: true,
      trustScore: 95,
      completedJobs: 156,
      availability: 'Available'
    },
    { 
      id: 3, 
      name: 'Ali Raza', 
      skill: 'Fabric Cutter', 
      rating: 4.8, 
      rate: '700 PKR/hr',
      location: 'Faisalabad, Pakistan',
      verified: true,
      trustScore: 93,
      completedJobs: 143,
      availability: 'Available'
    },
    { 
      id: 4, 
      name: 'Hassan Malik', 
      skill: 'Stitching Expert', 
      rating: 4.7, 
      rate: '680 PKR/hr',
      location: 'Multan, Pakistan',
      verified: true,
      trustScore: 92,
      completedJobs: 134,
      availability: 'Busy'
    },
    { 
      id: 5, 
      name: 'Farhan Ali', 
      skill: 'Finishing Expert', 
      rating: 4.7, 
      rate: '680 PKR/hr',
      location: 'Sialkot, Pakistan',
      verified: true,
      trustScore: 90,
      completedJobs: 121,
      availability: 'Available'
    },
    { 
      id: 6, 
      name: 'Usman Sheikh', 
      skill: 'Quality Inspector', 
      rating: 4.6, 
      rate: '650 PKR/hr',
      location: 'Gujranwala, Pakistan',
      verified: true,
      trustScore: 88,
      completedJobs: 98,
      availability: 'Available'
    },
  ];

  const profiles = userType === 'client' ? topClients : userType === 'manufacturer' ? topManufacturers : topLabour;
  
  const getColor = () => {
    if (userType === 'client') return { primary: '#a78bfa', bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-500' };
    if (userType === 'manufacturer') return { primary: '#1a4d4d', bg: 'bg-teal-700', text: 'text-teal-500', border: 'border-teal-500' };
    return { primary: '#4ade80', bg: 'bg-green-500', text: 'text-green-500', border: 'border-green-500' };
  };

  const color = getColor();
  const Icon = userType === 'client' ? Briefcase : userType === 'manufacturer' ? Factory : HardHat;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="max-w-6xl w-full my-8">
        {/* Header */}
        <div className="bg-gray-900 border border-gray-800 rounded-t-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`size-12 rounded-lg ${color.bg} flex items-center justify-center`}>
                <Icon className="size-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl text-white flex items-center gap-2">
                  <Award className={`size-6 ${color.text}`} />
                  Top Rated {userType === 'client' ? 'Clients' : userType === 'manufacturer' ? 'Manufacturers' : 'Labour'}
                </h2>
                <p className="text-gray-400 text-sm">
                  {profiles.length} verified {userType}s with highest ratings
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="size-5" />
            </Button>
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="bg-gray-900 border-x border-b border-gray-800 rounded-b-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profiles.map((profile) => (
              <Card 
                key={profile.id} 
                className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all cursor-pointer group"
                onClick={() => onViewProfile(profile, userType)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`size-16 rounded-lg ${color.bg} flex items-center justify-center shrink-0`}>
                        <Icon className="size-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-semibold">{profile.name}</h3>
                          {profile.verified && (
                            <Shield className={`size-4 ${color.text}`} />
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{profile.type || profile.skill}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="size-3" />
                          <span>{profile.location}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="size-5 text-[#2563EB] group-hover:text-[#2563EB]/80 transition-colors" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className={`bg-gray-900 border ${color.border} rounded-lg p-2 text-center`}>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className={`size-4 fill-yellow-400 text-yellow-400`} />
                        <span className="text-white font-semibold">{profile.rating}</span>
                      </div>
                      <p className="text-xs text-gray-400">Rating</p>
                    </div>
                    <div className={`bg-gray-900 border ${color.border} rounded-lg p-2 text-center`}>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className={`size-4 ${color.text}`} />
                        <span className="text-white font-semibold">{profile.trustScore}</span>
                      </div>
                      <p className="text-xs text-gray-400">Trust Score</p>
                    </div>
                  </div>

                  {userType === 'client' && profile.orders !== undefined && (
                    <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-700">
                      <span className="text-gray-400">{profile.orders} Orders</span>
                      <span className={color.text}>{profile.totalSpent}</span>
                    </div>
                  )}

                  {userType === 'manufacturer' && profile.completedOrders !== undefined && (
                    <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-700">
                      <span className="text-gray-400">{profile.completedOrders} Completed</span>
                      <span className={color.text}>{profile.responseTime}</span>
                    </div>
                  )}

                  {userType === 'labour' && profile.rate !== undefined && (
                    <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-700">
                      <span className="text-gray-400">{profile.completedJobs !== undefined ? `${profile.completedJobs} Jobs` : ''}</span>
                      <span className={color.text}>{profile.rate}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showChat && <ChatModal onClose={() => setShowChat(false)} />}
      {showEmail && selectedProfile && (
        <EmailModal 
          onClose={() => setShowEmail(false)}
          recipientName={selectedProfile.name}
          recipientEmail={`${selectedProfile.name.toLowerCase().replace(/\s+/g, '.')}@example.com`}
        />
      )}
      {showLocation && selectedProfile && (
        <LocationModal 
          onClose={() => setShowLocation(false)}
          userName={selectedProfile.name}
          userType={userType}
        />
      )}
    </div>
  );
}
/* This file displays a top-rated list of clients, manufacturers, or labour with ratings, trust scores, and profile interaction options.

It is web-based (React UI component) but can also be used for both web & app (if adapted to mobile frontend). */