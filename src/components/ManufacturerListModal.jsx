import { X, Factory, Star, Shield, MapPin, MessageSquare, Mail, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/labelstatus';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';
import { ChatModal } from './ChatModal';
import { EmailModal } from './EmailModal(Optional)';
import { IndividualProfile } from './IndividualProfile';

const manufacturers = [
  {
    id: 'm1',
    name: 'ABC Textiles',
    specialty: 'Cotton & Textile Manufacturing',
    rating: 4.8,
    reviews: 156,
    location: 'Faisalabad',
    verified: true,
    completedProjects: 234,
    responseTime: '2 hours',
  },
  {
    id: 'm2',
    name: 'Premium Leather Co.',
    specialty: 'Leather Goods Manufacturing',
    rating: 4.6,
    reviews: 89,
    location: 'Karachi',
    verified: true,
    completedProjects: 189,
    responseTime: '1 hour',
  },
  {
    id: 'm3',
    name: 'Quality Garments',
    specialty: 'Garment Manufacturing',
    rating: 4.9,
    reviews: 203,
    location: 'Lahore',
    verified: true,
    completedProjects: 312,
    responseTime: '30 min',
  },
  {
    id: 'm4',
    name: 'Furniture Masters',
    specialty: 'Wooden Furniture Manufacturing',
    rating: 4.5,
    reviews: 123,
    location: 'Lahore',
    verified: true,
    completedProjects: 167,
    responseTime: '3 hours',
  },
  {
    id: 'm5',
    name: 'Elite Stitching House',
    specialty: 'Professional Stitching Services',
    rating: 4.7,
    reviews: 134,
    location: 'Sialkot',
    verified: true,
    completedProjects: 201,
    responseTime: '1 hour',
  },
  {
    id: 'm6',
    name: 'Global Export Unit',
    specialty: 'Export Manufacturing',
    rating: 4.9,
    reviews: 234,
    location: 'Karachi',
    verified: true,
    completedProjects: 456,
    responseTime: '2 hours',
  },
];

export function ManufacturerListModal({ onClose, orderTitle }) {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const filteredManufacturers = manufacturers.filter(m =>
    searchQuery === '' ||
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactManufacturer = (manufacturer, type) => {
    setSelectedManufacturer(manufacturer);
    if (type === 'chat') {
      setShowChat(true);
    } else {
      setShowEmail(true);
    }
  };

  const handleViewProfile = (manufacturer) => {
    const profileData = {
      ...manufacturer,
      type: 'manufacturer',
      trustScore: 92,
      email: `${manufacturer.name.toLowerCase().replace(/\\s+/g, '.')}@example.com`,
      phone: '+92 300 1234567',
    };
    setSelectedManufacturer(profileData);
    setShowProfile(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
        <div className={`w-full max-w-4xl rounded-lg shadow-xl max-h-[90vh] overflow-hidden ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
                title="Back to Order"
              >
                <ArrowLeft className="size-5" />
              </button>
              <Factory className="size-6 text-[#138f8a]" />
              <div>
                <h2 className="text-xl">Contact Manufacturers</h2>
                {orderTitle && (
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    For: {orderTitle}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-gray-800">
            <Input
              placeholder="Search manufacturers by name, specialty, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}
            />
          </div>

          {/* Manufacturers List */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              {filteredManufacturers.map((manufacturer) => (
                <div
                  key={manufacturer.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700 hover:border-[#138f8a]'
                      : 'bg-gray-50 border-gray-200 hover:border-[#138f8a]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="size-16 rounded-lg bg-gradient-to-br from-[#138f8a] to-[#0d7973] flex items-center justify-center shrink-0">
                      <Factory className="size-8 text-white" />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 
                              className={`text-lg cursor-pointer hover:text-[#138f8a] transition-colors ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}
                              onClick={() => handleViewProfile(manufacturer)}
                            >
                              {manufacturer.name}
                            </h3>
                            {manufacturer.verified && (
                              <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                                <Shield className="size-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {manufacturer.specialty}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Star className="size-4 fill-yellow-400 text-yellow-400" />
                          <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                            {manufacturer.rating} ({manufacturer.reviews})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="size-4 text-gray-400" />
                          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {manufacturer.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Factory className="size-4 text-gray-400" />
                          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {manufacturer.completedProjects} Projects
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="size-4 text-gray-400" />
                          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            Responds in {manufacturer.responseTime}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleContactManufacturer(manufacturer, 'chat')}
                          className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                        >
                          <MessageSquare className="size-4 mr-2" />
                          Chat Now
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleContactManufacturer(manufacturer, 'email')}
                          className={isDarkMode ? 'border-gray-700' : 'border-gray-300'}
                        >
                          <Mail className="size-4 mr-2" />
                          Email
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewProfile(manufacturer)}
                          className={isDarkMode ? 'border-gray-700' : 'border-gray-300'}
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className={`p-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <Button onClick={onClose} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Sub-Modals */}
      {showChat && (
        <ChatModal
          onClose={() => {
            setShowChat(false);
            setSelectedManufacturer(null);
          }}
        />
      )}

      {showEmail && selectedManufacturer && (
        <EmailModal
          onClose={() => {
            setShowEmail(false);
            setSelectedManufacturer(null);
          }}
          recipientName={selectedManufacturer.name}
          recipientEmail={`${selectedManufacturer.name.toLowerCase().replace(/\\s+/g, '.')}@example.com`}
        />
      )}

      {showProfile && selectedManufacturer && (
        <IndividualProfile
          profile={selectedManufacturer}
          userType="manufacturer"
          onClose={() => {
            setShowProfile(false);
            setSelectedManufacturer(null);
          }}
        />
      )}
    </>
  );
}
/* Purpose: This file shows a list of manufacturers, allows searching, viewing profiles, and contacting them via chat or email.

Type: It is for web-based application (React frontend). */