import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/labelstatus';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs list';
import { X, Search, Factory, HardHat, Star, MapPin, Award, MessageSquare } from 'lucide-react';
import { ChatModal } from './ChatModal';
import { IndividualProfile } from './IndividualProfile';

export function SearchModal({ onClose, userType }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showChat, setShowChat] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Enhanced search results with semantic keywords
  const searchResults = [
    // Stitching-related results
    {
      id: 'l1',
      name: 'Ahmed Khan',
      type: 'labour',
      rating: 4.9,
      reviews: 67,
      skills: ['Stitching', 'Pattern Making', 'Quality Control'],
      location: 'Lahore',
      rate: 650,
      verified: true,
    },
    {
      id: 'l2',
      name: 'Muhammad Ali',
      type: 'labour',
      rating: 4.7,
      reviews: 45,
      skills: ['Cutting', 'Measuring', 'Fabric Handling', 'Stitching'],
      location: 'Faisalabad',
      rate: 600,
      verified: true,
    },
    {
      id: 'l7',
      name: 'Fatima Bibi',
      type: 'labour',
      rating: 4.8,
      reviews: 78,
      skills: ['Expert Stitching', 'Hand Embroidery', 'Alterations'],
      location: 'Karachi',
      rate: 680,
      verified: true,
    },
    {
      id: 'l8',
      name: 'Salman Rasheed',
      type: 'labour',
      rating: 4.6,
      reviews: 42,
      skills: ['Machine Stitching', 'Garment Assembly', 'Finishing'],
      location: 'Sialkot',
      rate: 620,
      verified: true,
    },
    {
      id: 'm1',
      name: 'ABC Textiles',
      type: 'manufacturer',
      rating: 4.8,
      reviews: 156,
      specialization: 'Cotton & Textile Manufacturing, Stitching Services',
      location: 'Faisalabad',
      verified: true,
    },
    {
      id: 'm6',
      name: 'Elite Stitching House',
      type: 'manufacturer',
      rating: 4.7,
      reviews: 134,
      specialization: 'Professional Stitching Services, Garment Manufacturing',
      location: 'Lahore',
      verified: true,
    },
    {
      id: 'm2',
      name: 'Premium Leather Co.',
      type: 'manufacturer',
      rating: 4.6,
      reviews: 89,
      specialization: 'Leather Goods Manufacturing',
      location: 'Karachi',
      verified: true,
    },
    {
      id: 'l3',
      name: 'Hassan Raza',
      type: 'labour',
      rating: 4.8,
      reviews: 52,
      skills: ['Welding', 'Metal Work', 'Fabrication'],
      location: 'Gujranwala',
      rate: 700,
      verified: true,
    },
    {
      id: 'm3',
      name: 'Furniture Masters',
      type: 'manufacturer',
      rating: 4.5,
      reviews: 123,
      specialization: 'Wooden Furniture Manufacturing',
      location: 'Lahore',
      verified: true,
    },
    // Export unit results
    {
      id: 'm4',
      name: 'Global Export Unit',
      type: 'manufacturer',
      rating: 4.9,
      reviews: 234,
      specialization: 'Export Manufacturing, International Quality Standards',
      location: 'Karachi',
      verified: true,
    },
    {
      id: 'm5',
      name: 'Prime Export Industries',
      type: 'manufacturer',
      rating: 4.7,
      reviews: 178,
      specialization: 'Export Unit, Garment Manufacturing for International Markets',
      location: 'Sialkot',
      verified: true,
    },
    {
      id: 'm7',
      name: 'International Export Hub',
      type: 'manufacturer',
      rating: 4.8,
      reviews: 198,
      specialization: 'Export-Oriented Manufacturing, Compliance with International Standards',
      location: 'Faisalabad',
      verified: true,
    },
    {
      id: 'm8',
      name: 'Eastern Export Manufacturing',
      type: 'manufacturer',
      rating: 4.6,
      reviews: 145,
      specialization: 'Export Unit, Textile & Garment Export',
      location: 'Gujranwala',
      verified: true,
    },
    // Skilled labour results
    {
      id: 'l4',
      name: 'Bilal Ahmed',
      type: 'labour',
      rating: 4.8,
      reviews: 89,
      skills: ['Skilled Tailor', 'Embroidery', 'Finishing'],
      location: 'Karachi',
      rate: 680,
      verified: true,
    },
    {
      id: 'l5',
      name: 'Usman Malik',
      type: 'labour',
      rating: 4.6,
      reviews: 56,
      skills: ['Skilled Carpenter', 'Furniture Making', 'Wood Carving'],
      location: 'Lahore',
      rate: 720,
      verified: true,
    },
    {
      id: 'l6',
      name: 'Farhan Sheikh',
      type: 'labour',
      rating: 4.9,
      reviews: 112,
      skills: ['Skilled Electrician', 'Wiring', 'Installation'],
      location: 'Islamabad',
      rate: 750,
      verified: true,
    },
    {
      id: 'l9',
      name: 'Asif Mahmood',
      type: 'labour',
      rating: 4.7,
      reviews: 94,
      skills: ['Skilled Welder', 'Metal Fabrication', 'Industrial Work'],
      location: 'Rawalpindi',
      rate: 710,
      verified: true,
    },
    {
      id: 'l10',
      name: 'Kamran Ali',
      type: 'labour',
      rating: 4.8,
      reviews: 103,
      skills: ['Skilled Mason', 'Construction', 'Tile Work'],
      location: 'Multan',
      rate: 690,
      verified: true,
    },
    {
      id: 'l11',
      name: 'Zubair Khan',
      type: 'labour',
      rating: 4.9,
      reviews: 87,
      skills: ['Skilled Plumber', 'Pipe Fitting', 'Drainage Systems'],
      location: 'Peshawar',
      rate: 670,
      verified: true,
    },
    // Additional manufacturer results
    {
      id: 'm9',
      name: 'Quality Manufacturing Co.',
      type: 'manufacturer',
      rating: 4.7,
      reviews: 167,
      specialization: 'Precision Manufacturing, Quality Control Systems',
      location: 'Karachi',
      verified: true,
    },
    {
      id: 'm10',
      name: 'Modern Industrial Works',
      type: 'manufacturer',
      rating: 4.6,
      reviews: 142,
      specialization: 'Industrial Manufacturing, Machine Parts Production',
      location: 'Lahore',
      verified: true,
    },
  ];

  // Enhanced semantic search filter
  const filteredResults = searchResults.filter(result => {
    // Filter out labour for clients
    if (userType === 'client' && result.type === 'labour') {
      return false;
    }
    
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    
    // Semantic matching for common keywords
    const semanticMatches = 
      // Stitching variations
      ((query.includes('stitch') || query.includes('sew') || query.includes('tailor')) && (
        result.skills?.some(s => s.toLowerCase().includes('stitch') || s.toLowerCase().includes('tailor')) ||
        result.specialization?.toLowerCase().includes('stitch')
      )) ||
      // Export variations
      ((query.includes('export') || query.includes('international') || query.includes('global')) && 
        result.specialization?.toLowerCase().includes('export')) ||
      // Skilled labour variations
      ((query.includes('skilled') || query.includes('expert') || query.includes('professional')) && 
        (result.skills?.some(s => s.toLowerCase().includes('skilled') || s.toLowerCase().includes('expert')) ||
         result.type === 'labour')) ||
      // Labour/Labor variations
      ((query.includes('labour') || query.includes('labor') || query.includes('worker')) && 
        result.type === 'labour') ||
      // Manufacturer variations
      ((query.includes('manufacturer') || query.includes('manufacturing') || query.includes('factory') || query.includes('unit')) && 
        result.type === 'manufacturer') ||
      // Garment/textile variations
      ((query.includes('garment') || query.includes('textile') || query.includes('fabric') || query.includes('cloth')) && (
        result.skills?.some(s => s.toLowerCase().includes('fabric') || s.toLowerCase().includes('garment')) ||
        result.specialization?.toLowerCase().includes('garment') ||
        result.specialization?.toLowerCase().includes('textile')
      )) ||
      // Direct matches
      result.name.toLowerCase().includes(query) ||
      result.skills?.some(skill => skill.toLowerCase().includes(query)) ||
      result.specialization?.toLowerCase().includes(query) ||
      result.location.toLowerCase().includes(query);
    
    if (activeTab === 'manufacturers') return semanticMatches && result.type === 'manufacturer';
    if (activeTab === 'labour') return semanticMatches && result.type === 'labour';
    return semanticMatches;
  });

  const handleViewProfile = (result) => {
    setSelectedProfile(result);
    setShowProfile(true);
  };

  const handleChat = (result) => {
    setSelectedProfile(result);
    setShowChat(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col bg-white border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-[#1F2933]">Search Manufacturers & Labour</CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-[#1F2933]">
                <X className="size-5" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <Input 
                placeholder="Search by name, skill, or specialization..." 
                className="pl-10 bg-white border-gray-300 text-[#1F2933]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)} className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 pt-4">
              <TabsList className={`grid w-full ${userType === 'client' ? 'grid-cols-2' : 'grid-cols-3'} bg-gray-100 border-gray-200`}>
                <TabsTrigger value="all" className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white">
                  All ({filteredResults.length === searchResults.length ? searchResults.length : filteredResults.length})
                </TabsTrigger>
                <TabsTrigger value="manufacturers" className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white">
                  Manufacturers ({searchResults.filter(r => r.type === 'manufacturer').length})
                </TabsTrigger>
                {userType !== 'client' && (
                  <TabsTrigger value="labour" className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white">
                    Labour ({searchResults.filter(r => r.type === 'labour').length})
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <TabsContent value={activeTab} className="mt-4 space-y-4">
                {filteredResults.map(result => (
                  <Card key={result.id} className="hover:shadow-md transition-shadow bg-white border-gray-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="size-12 rounded-full flex items-center justify-center bg-[#2563EB]">
                            {result.type === 'manufacturer' ? (
                              <Factory className="size-6 text-white" />
                            ) : (
                              <HardHat className="size-6 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg text-[#1F2933]">{result.name}</h3>
                              {result.verified && (
                                <Badge variant="secondary" className="text-xs bg-green-600/20 text-green-600 border-green-600/30">
                                  <Award className="size-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                                <span>{result.rating}</span>
                                <span className="text-gray-500">({result.reviews} reviews)</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="size-4" />
                                <span>{result.location}</span>
                              </div>
                            </div>
                            {result.specialization && (
                              <p className="text-sm text-gray-600">{result.specialization}</p>
                            )}
                            {result.skills && (
                              <div className="flex gap-2 mt-2">
                                {result.skills.map(skill => (
                                  <Badge key={skill} variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">{skill}</Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {result.rate && (
                            <div>
                              <div className="text-[#2563EB]">PKR {result.rate}</div>
                              <div className="text-sm text-gray-500">per hour</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1 border-gray-300 text-[#1F2933] hover:bg-gray-50"
                          onClick={() => handleViewProfile(result)}
                        >
                          View Profile
                        </Button>
                        <Button 
                          className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                          onClick={() => handleChat(result)}
                        >
                          <MessageSquare className="size-4 mr-2" />
                          {result.type === 'manufacturer' ? 'Contact' : 'Hire'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredResults.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="size-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">No results found</p>
                    <p className="text-sm text-gray-500 mt-1">Try different search terms</p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>

      {/* Chat Modal */}
      {showChat && selectedProfile && (
        <ChatModal 
          onClose={() => {
            setShowChat(false);
            setSelectedProfile(null);
          }} 
          recipientName={selectedProfile.name}
        />
      )}

      {/* Profile Modal */}
      {showProfile && selectedProfile && (
        <IndividualProfile
          profile={{
            ...selectedProfile,
            specialty: selectedProfile.specialization || selectedProfile.skills?.join(', '),
            address: selectedProfile.location,
            city: selectedProfile.location,
          }}
          userType={selectedProfile.type === 'manufacturer' ? 'manufacturer' : 'labour'}
          onClose={() => {
            setShowProfile(false);
            setSelectedProfile(null);
          }}
        />
      )}
    </>
  );
}
/* Purpose: This file creates a search modal to find manufacturers and labour with filters, ratings, and chat/profile options.
Platform: Web-based (React UI), but can be used for both web and app if adapted. */