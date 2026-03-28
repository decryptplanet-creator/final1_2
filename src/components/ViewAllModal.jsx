import { X, Star, Shield, MapPin, HardHat, Factory, User, MessageSquare, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/labelstatus';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';
import { IndividualProfile } from './IndividualProfile';
import { ChatModal } from './ChatModal';
import { EmailModal } from './EmailModal(Optional)';

export function ViewAllModal({ onClose, type, onProfileClick, activeFilter, onFilterChange }) {
  const { isDarkMode } = useTheme();
  const [showProfile, setShowProfile] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [selectedForContact, setSelectedForContact] = useState(null);

  const labourData = [
    { id: '1', name: 'Ahmed Khan', skill: 'Stitching Expert', rating: 4.9, verified: true, rate: 650, location: 'Karachi' },
    { id: '2', name: 'Ali Raza', skill: 'Cutting Specialist', rating: 4.7, verified: true, rate: 600, location: 'Lahore' },
    { id: '3', name: 'Hassan Ahmed', skill: 'Finishing', rating: 4.8, verified: true, rate: 580, location: 'Faisalabad' },
    { id: '4', name: 'Bilal Khan', skill: 'Quality Check', rating: 4.6, verified: false, rate: 550, location: 'Karachi' },
    { id: '5', name: 'Usman Ali', skill: 'Packaging', rating: 4.5, verified: true, rate: 500, location: 'Sialkot' },
    { id: '6', name: 'Kamran Shah', skill: 'Machine Operator', rating: 4.9, verified: true, rate: 700, location: 'Gujranwala' },
    { id: '7', name: 'Rizwan Ahmed', skill: 'Dyeing Expert', rating: 4.8, verified: true, rate: 620, location: 'Karachi' },
    { id: '8', name: 'Farhan Malik', skill: 'Weaving', rating: 4.7, verified: false, rate: 590, location: 'Multan' },
  ];

  const manufacturerData = [
    { id: '1', name: 'ABC Textiles', specialty: 'Cotton Products', rating: 4.8, verified: true, location: 'Karachi', projects: 45 },
    { id: '2', name: 'Premium Leather Co.', specialty: 'Leather Goods', rating: 4.9, verified: true, location: 'Lahore', projects: 38 },
    { id: '3', name: 'Furniture Masters', specialty: 'Wooden Furniture', rating: 4.7, verified: true, location: 'Faisalabad', projects: 52 },
    { id: '4', name: 'Quality Garments', specialty: 'Garment Manufacturing', rating: 4.6, verified: true, location: 'Sialkot', projects: 67 },
    { id: '5', name: 'Elite Manufacturing', specialty: 'Multi-Product', rating: 4.8, verified: true, location: 'Gujranwala', projects: 41 },
    { id: '6', name: 'Precision Works', specialty: 'Metal Works', rating: 4.5, verified: false, location: 'Karachi', projects: 29 },
  ];

  const clientData = [
    { id: '1', name: 'Fashion House Ltd', type: 'Retail Chain', rating: 4.7, verified: true, orders: 23, location: 'Karachi' },
    { id: '2', name: 'Global Exports Inc', type: 'Export Company', rating: 4.9, verified: true, orders: 45, location: 'Lahore' },
    { id: '3', name: 'Mega Mart', type: 'Retail', rating: 4.6, verified: true, orders: 31, location: 'Islamabad' },
    { id: '4', name: 'Style Boutique', type: 'Boutique', rating: 4.8, verified: true, orders: 18, location: 'Karachi' },
    { id: '5', name: 'Premium Brands', type: 'Brand Owner', rating: 4.5, verified: false, orders: 12, location: 'Faisalabad' },
  ];

  const data = type === 'labour' ? labourData : type === 'manufacturer' ? manufacturerData : clientData;
  
  // Apply filters
  const filteredData = data.filter(item => {
    if (activeFilter === 'verified') {
      return item.verified === true;
    }
    if (activeFilter === 'top-rated') {
      return item.rating >= 4.7;
    }
    if (activeFilter === 'nearby') {
      return item.location === 'Karachi'; // Example: filter by location
    }
    return true; // 'all' filter
  });
  
  const getIcon = () => {
    switch (type) {
      case 'labour':
        return <HardHat className="size-6 text-[#10b981]" />;
      case 'manufacturer':
        return <Factory className="size-6 text-[#138f8a]" />;
      case 'client':
        return <User className="size-6 text-[#138f8a]" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'labour':
        return 'All Skilled Labour';
      case 'manufacturer':
        return 'All Manufacturers';
      case 'client':
        return 'All Clients';
    }
  };

  const handleProfileClick = (item) => {
    const profileData = {
      ...item,
      type: type,
      specialty: 'skill' in item ? item.skill : 'specialty' in item ? item.specialty : 'type' in item ? item.type : '',
      email: `${item.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: '+92 300 1234567',
      verified: item.verified,
      rating: item.rating,
      totalReviews: 'reviews' in item ? item.reviews : 'projects' in item ? item.projects : 'orders' in item ? item.orders : 0,
      address: item.location,
      city: item.location,
    };
    setSelectedProfile(profileData);
    setShowProfile(true);
  };

  const handleContactClick = (item, contactType) => {
    const contactData = {
      ...item,
      email: `${item.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    };
    setSelectedForContact(contactData);
    if (contactType === 'chat') {
      setShowChat(true);
    } else {
      setShowEmail(true);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className={`w-full max-w-4xl rounded-lg shadow-xl max-h-[90vh] flex flex-col ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              {getIcon()}
              <h2 className="text-2xl">{getTitle()}</h2>
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

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border transition-all ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 hover:border-[#138f8a]' 
                      : 'bg-white border-gray-200 hover:border-[#138f8a] hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`size-12 rounded-full bg-gradient-to-br flex items-center justify-center flex-shrink-0 ${
                      type === 'manufacturer' ? 'from-[#138f8a] to-[#0d7973]' : 'from-[#10b981] to-[#059669]'
                    }`}>
                      {type === 'labour' && <HardHat className="size-6 text-white" />}
                      {type === 'manufacturer' && <Factory className="size-6 text-white" />}
                      {type === 'client' && <User className="size-6 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-medium">{item.name}</h3>
                        {item.verified && (
                          <Shield className="size-4 text-green-500" />
                        )}
                      </div>
                      <p className={`text-sm mb-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {'skill' in item && item.skill}
                        {'specialty' in item && item.specialty}
                        {'type' in item && item.type}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="size-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{item.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="size-3" />
                          {item.location}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleProfileClick(item)}
                          className="flex-1"
                        >
                          View Profile
                        </Button>
                        {type === 'manufacturer' && (
                          <Button
                            size="sm"
                            onClick={() => handleContactClick(item, 'chat')}
                            className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                          >
                            <MessageSquare className="size-3 mr-1" />
                            Contact
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className={`p-4 border-t ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <Button 
              onClick={onClose} 
              className="w-full bg-[#138f8a] hover:bg-[#0d7973]"
            >
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && selectedProfile && (
        <IndividualProfile
          profile={selectedProfile}
          userType={type}
          onClose={() => {
            setShowProfile(false);
            setSelectedProfile(null);
          }}
        />
      )}

      {/* Chat Modal */}
      {showChat && selectedForContact && (
        <ChatModal
          onClose={() => {
            setShowChat(false);
            setSelectedForContact(null);
          }}
          recipientName={selectedForContact.name}
        />
      )}

      {/* Email Modal */}
      {showEmail && selectedForContact && (
        <EmailModal
          onClose={() => {
            setShowEmail(false);
            setSelectedForContact(null);
          }}
          recipientName={selectedForContact.name}
          recipientEmail={selectedForContact.email}
        />
      )}
    </>
  );
}
/* Displays a modal to view and filter all users (labour, manufacturers, clients) with options to see profiles and contact them.

This is for web-based (React frontend) but can also be used in hybrid apps → so dono (web + app UI). */