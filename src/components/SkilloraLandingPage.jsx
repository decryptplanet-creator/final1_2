import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { 
  Search, 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  MapPin, 
  Wallet, 
  Star, 
  Phone, 
  Mail, 
  Briefcase, 
  Factory, 
  HardHat, 
  X,
  Moon,
  Sun,
  Shield,
  Sparkles
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { TopRatedList } from './TopRatedList';
import { IndividualProfile } from './IndividualProfile';
import { EnhancedHelpOverlay } from './HelpCentre';
import { useTheme } from '../contexts/ThemeContext';

// Animated Counter Component
function AnimatedNumber({ value, duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const totalSteps = 60; // Smoothness ke liye steps badha diye hain
    const increment = end / totalSteps;
    const intervalTime = duration / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}+</span>;
}

export function LandingPage({ onUserTypeSelect }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [showTopRated, setShowTopRated] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedProfileType, setSelectedProfileType] = useState(null);

  const handleGetStarted = () => {
    setShowRoleSelection(true);
  };

  const handleRoleSelect = (role) => {
    onUserTypeSelect(role);
  };

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    
    // Enhanced keyword mapping for semantic search
    const clientKeywords = ['client', 'buyer', 'order', 'business', 'company', 'export', 'fashion', 'textile company'];
    const manufacturerKeywords = ['manufacturer', 'manufacture', 'factory', 'production', 'producer', 'industry', 'plant'];
    const labourKeywords = ['labour', 'labor', 'worker', 'tailor', 'cutter', 'stitching', 'skill', 'employee', 'craftsman'];
    
    if (clientKeywords.some(keyword => query.includes(keyword))) {
      setSearchResults('client');
      setActiveTab(null);
    } else if (manufacturerKeywords.some(keyword => query.includes(keyword))) {
      setSearchResults('manufacturer');
      setActiveTab(null);
    } else if (labourKeywords.some(keyword => query.includes(keyword))) {
      setSearchResults('labour');
      setActiveTab(null);
    } else {
      setSearchResults(null);
    }
  };

  const handleViewTopRated = (type) => {
    setShowTopRated(type);
    setActiveTab(null);
    setSearchResults(null);
  };

  const handleViewProfile = (profile, type) => {
    setSelectedProfile(profile);
    setSelectedProfileType(type);
    setShowTopRated(null);
  };

  // Dummy Data
  const dummyClients = [
    { id: 1, name: 'Fashion Hub Ltd', type: 'Textile Orders', rating: 4.8, orders: 45 },
    { id: 2, name: 'Global Exports', type: 'Garments', rating: 4.9, orders: 67 },
    { id: 3, name: 'Textile Masters', type: 'Fabric Orders', rating: 4.7, orders: 32 },
    { id: 4, name: 'Modern Apparel', type: 'Clothing', rating: 4.6, orders: 28 },
    { id: 5, name: 'Elite Textiles', type: 'Export Orders', rating: 4.9, orders: 54 },
    { id: 6, name: 'Premium Fabrics', type: 'Wholesale', rating: 4.7, orders: 41 },
  ];

  const dummyManufacturers = [
    { id: 1, name: 'Prime Manufacturing', type: 'Textile Production', rating: 4.9, capacity: 'Large' },
    { id: 2, name: 'Quality Textiles', type: 'Fabric Manufacturing', rating: 4.8, capacity: 'Medium' },
    { id: 3, name: 'Royal Industries', type: 'Garment Production', rating: 4.7, capacity: 'Large' },
    { id: 4, name: 'Elite Manufacturing', type: 'Textile Processing', rating: 4.6, capacity: 'Medium' },
    { id: 5, name: 'Apex Industries', type: 'Fabric Production', rating: 4.8, capacity: 'Large' },
    { id: 6, name: 'Supreme Textiles', type: 'Manufacturing', rating: 4.9, capacity: 'Medium' },
  ];

  const dummyLabour = [
    { id: 1, name: 'Ahmed Khan', skill: 'Master Tailor', rating: 4.9, rate: '800 PKR/hr' },
    { id: 2, name: 'Ali Raza', skill: 'Fabric Cutter', rating: 4.8, rate: '600 PKR/hr' },
    { id: 3, name: 'Hassan Malik', skill: 'Stitching Expert', rating: 4.7, rate: '700 PKR/hr' },
    { id: 4, name: 'Usman Sheikh', skill: 'Quality Inspector', rating: 4.6, rate: '650 PKR/hr' },
    { id: 5, name: 'Bilal Ahmed', skill: 'Pattern Maker', rating: 4.8, rate: '750 PKR/hr' },
    { id: 6, name: 'Farhan Ali', skill: 'Finishing Expert', rating: 4.7, rate: '680 PKR/hr' },
  ];

  const featuredImages = [
    'https://images.unsplash.com/photo-1768746350424-ee28a364dcf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMHRleHRpbGUlMjBtYW51ZmFjdHVyaW5nJTIwZmFjdG9yeXxlbnwxfHx8fDE3NzExNTczMjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1684259499086-93cb3e555803?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJtZW50JTIwcHJvZHVjdGlvbiUyMHdvcmtlcnMlMjBzZXdpbmd8ZW58MXx8fHwxNzcxMTU3MzI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1684259499086-93cb3e555803?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXh0aWxlJTIwZmFjdG9yeSUyMHdvcmtlcnMlMjBjbG90aGVzfGVufDF8fHx8MTc3MTE1NzMyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1673201230274-c4dbd20c3f79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZ2FybWVudCUyMG1hbnVmYWN0dXJpbmclMjBpbmR1c3RyeXxlbnwxfHx8fDE3NzExNTczMjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1625479144604-ae69462778b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWlsb3IlMjBzZXdpbmclMjBtYWNoaW5lJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzcxMTU3MzI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1718117059204-8380b0706219?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWJyaWMlMjBjdXR0aW5nJTIwdGV4dGlsZSUyMHByb2R1Y3Rpb258ZW58MXx8fHwxNzcxMTU3MzI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1F2933]' : 'bg-[#F9FAFB]'}`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-[#F9FAFB] border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="size-8 rounded bg-[#2563EB] flex items-center justify-center">
                <Sparkles className="size-5 text-white" />
              </div>
              <span className={`text-2xl ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Skillora</span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => {
                  setActiveTab(activeTab === 'client' ? null : 'client');
                  setSearchResults(null);
                }}
                className={`${isDarkMode ? 'text-[#F9FAFB] hover:text-[#2563EB]' : 'text-[#1F2933] hover:text-[#2563EB]'}`}
              >
                Clients
              </button>
              <button 
                onClick={() => {
                  setActiveTab(activeTab === 'manufacturer' ? null : 'manufacturer');
                  setSearchResults(null);
                }}
                className={`${isDarkMode ? 'text-[#F9FAFB] hover:text-[#2563EB]' : 'text-[#1F2933] hover:text-[#2563EB]'}`}
              >
                Manufacturers
              </button>
              <button 
                onClick={() => {
                  setActiveTab(activeTab === 'labour' ? null : 'labour');
                  setSearchResults(null);
                }}
                className={`${isDarkMode ? 'text-[#F9FAFB] hover:text-[#2563EB]' : 'text-[#1F2933] hover:text-[#2563EB]'}`}
              >
                Labour
              </button>
              <button 
                onClick={() => setShowHelp(true)}
                className={`${isDarkMode ? 'text-[#F9FAFB] hover:text-[#2563EB]' : 'text-[#1F2933] hover:text-[#2563EB]'}`}
              >
                Help
              </button>
              <button 
                onClick={() => setShowAbout(true)}
                className={`${isDarkMode ? 'text-[#F9FAFB] hover:text-[#2563EB]' : 'text-[#1F2933] hover:text-[#2563EB]'}`}
              >
                About Us
              </button>
            </nav>
            
            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${isDarkMode ? 'text-[#F9FAFB] hover:bg-gray-700' : 'text-[#1F2933] hover:bg-gray-200'}`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </button>
              <button 
                onClick={() => setShowLogin(true)}
                className={`${isDarkMode ? 'text-[#F9FAFB] hover:text-[#2563EB]' : 'text-[#1F2933] hover:text-[#2563EB]'}`}
              >
                Login
              </button>
              <Button onClick={handleGetStarted} className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white">
                Join Free
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner with Search */}
      <div className="bg-[#2563EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Featured Images Row */}
          <div className="grid grid-cols-6 gap-3 mb-8">
            {featuredImages.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: idx * 0.1,
                  ease: "easeOut"
                }}
                className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <motion.img 
                  src={img} 
                  alt={`Featured ${idx + 1}`} 
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>

          <h1 className="text-4xl text-white mb-6 text-center">
            Verified Manufacturers and Skilled Labour
          </h1>
          
          {/* Search Box */}
          <div className={`max-w-3xl mx-auto ${isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg overflow-hidden`}>
            <div className="flex">
              <div className="flex-1 flex items-center px-4">
                <Search className={`size-5 mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <Input
                  type="text"
                  placeholder="Search for clients, manufacturers, or labour..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className={`border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 ${isDarkMode ? 'bg-[#1F2933] text-[#F9FAFB] placeholder:text-gray-500' : 'bg-white text-[#1F2933] placeholder:text-gray-400'}`}
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-none px-10"
              >
                Search
              </Button>
            </div>
          </div>
          
          <p className="text-center text-white mt-4">
            Trust in every talent
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Search Results */}
{searchResults && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
{searchResults === 'client' && 'Clients'}
{searchResults === 'manufacturer' && 'Manufacturers'}
{searchResults === 'labour' && 'Labour'}
              </h2>
              <button 
                onClick={() => setSearchResults(null)}
                className="text-[#2563EB] hover:text-[#1d4ed8]"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults === 'client' && dummyClients.map((client) => (
                <Card 
                  key={client.id} 
                  onClick={() => handleViewProfile(client, 'client')}
                  className={`${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'} hover:shadow-md transition-shadow cursor-pointer`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="size-16 rounded-full bg-[#2563EB]/10 flex items-center justify-center shrink-0">
                        <Briefcase className="size-8 text-[#2563EB]" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-sm mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{client.name}</h3>
                        <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{client.type}</p>
                        <div className="flex items-center gap-1">
                          <Star className="size-3 fill-yellow-400 text-yellow-400" />
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{client.rating}</span>
                          <span className={`text-xs ml-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{client.orders} Orders</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {searchResults === 'manufacturer' && dummyManufacturers.map((manufacturer) => (
                <Card 
                  key={manufacturer.id} 
                  onClick={() => handleViewProfile(manufacturer, 'manufacturer')}
                  className={`${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'} hover:shadow-md transition-shadow cursor-pointer`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="size-16 rounded-full bg-[#2563EB]/10 flex items-center justify-center shrink-0">
                        <Factory className="size-8 text-[#2563EB]" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-sm mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{manufacturer.name}</h3>
                        <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{manufacturer.type}</p>
                        <div className="flex items-center gap-1">
                          <Star className="size-3 fill-yellow-400 text-yellow-400" />
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{manufacturer.rating}</span>
                          <span className={`text-xs ml-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{manufacturer.capacity}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {searchResults === 'labour' && dummyLabour.map((labour) => (
                <Card 
                  key={labour.id} 
                  onClick={() => handleViewProfile(labour, 'labour')}
                  className={`${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'} hover:shadow-md transition-shadow cursor-pointer`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="size-16 rounded-full bg-[#2563EB]/10 flex items-center justify-center shrink-0">
                        <HardHat className="size-8 text-[#2563EB]" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-sm mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{labour.name}</h3>
                        <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{labour.skill}</p>
                        <div className="flex items-center gap-1">
                          <Star className="size-3 fill-yellow-400 text-yellow-400" />
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{labour.rating}</span>
                          <span className={`text-xs ml-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{labour.rate}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Tab Content */}
{activeTab && !searchResults && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
{activeTab === 'client' && 'Featured Clients'}
{activeTab === 'manufacturer' && 'Top Manufacturers'}
{activeTab === 'labour' && 'Skilled Labour'}
              </h2>
              <button 
                onClick={() => setActiveTab(null)}
                className="text-[#2563EB] hover:text-[#1d4ed8]"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeTab === 'client' && dummyClients.map((client) => (
                <Card key={client.id} className={`${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'} hover:shadow-md transition-shadow cursor-pointer`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="size-16 rounded-full bg-[#2563EB]/10 flex items-center justify-center shrink-0">
                        <Briefcase className="size-8 text-[#2563EB]" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-sm mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{client.name}</h3>
                        <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{client.type}</p>
                        <div className="flex items-center gap-1">
                          <Star className="size-3 fill-yellow-400 text-yellow-400" />
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{client.rating}</span>
                          <span className={`text-xs ml-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{client.orders} Orders</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {activeTab === 'manufacturer' && dummyManufacturers.map((manufacturer) => (
                <Card key={manufacturer.id} className={`${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'} hover:shadow-md transition-shadow cursor-pointer`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="size-16 rounded-full bg-[#2563EB]/10 flex items-center justify-center shrink-0">
                        <Factory className="size-8 text-[#2563EB]" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-sm mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{manufacturer.name}</h3>
                        <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{manufacturer.type}</p>
                        <div className="flex items-center gap-1">
                          <Star className="size-3 fill-yellow-400 text-yellow-400" />
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{manufacturer.rating}</span>
                          <span className={`text-xs ml-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{manufacturer.capacity}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {activeTab === 'labour' && dummyLabour.map((labour) => (
                <Card key={labour.id} className={`${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'} hover:shadow-md transition-shadow cursor-pointer`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="size-16 rounded-full bg-[#2563EB]/10 flex items-center justify-center shrink-0">
                        <HardHat className="size-8 text-[#2563EB]" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-sm mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{labour.name}</h3>
                        <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{labour.skill}</p>
                        <div className="flex items-center gap-1">
                          <Star className="size-3 fill-yellow-400 text-yellow-400" />
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{labour.rating}</span>
                          <span className={`text-xs ml-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{labour.rate}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Top Rated List */}
{showTopRated && (
          <TopRatedList 
            userType={showTopRated}
            onClose={() => setShowTopRated(null)}
            onViewProfile={handleViewProfile}
          />
        )}

        {/* Individual Profile View */}
{selectedProfile && selectedProfileType && (
          <IndividualProfile 
            profile={selectedProfile}
            userType={selectedProfileType}
            onClose={() => {
              setSelectedProfile(null);
              setSelectedProfileType(null);
            }}
          />
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className={`${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`size-12 rounded flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <ShieldCheck className="size-6 text-[#2563EB]" />
                </div>
                <div>
                  <CardTitle className={`text-base ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Verified Users</CardTitle>
                  <CardDescription className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Complete verification with legal documents, CNIC & affidavits
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
          
          <Card className={`${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`size-12 rounded flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Wallet className="size-6 text-[#2563EB]" />
                </div>
                <div>
                  <CardTitle className={`text-base ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Escrow Payment</CardTitle>
                  <CardDescription className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Secure payment system - 30% upfront, rest after completion
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
          
          <Card className={`${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`size-12 rounded flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Star className="size-6 text-[#2563EB]" />
                </div>
                <div>
                  <CardTitle className={`text-base ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Rating System</CardTitle>
                  <CardDescription className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Rate and review to build trust and improve profiles
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Stats */}
        {/* Stats Section inside LandingPage.jsx */}
<div className={`grid grid-cols-1 md:grid-cols-3 gap-8 text-center py-12 border-y mb-12 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
  
  {/* Stat 1 */}
  <div className="flex flex-col items-center">
    <div className="text-4xl font-bold text-blue-600 mb-2">
      <AnimatedNumber value={500} />
    </div>
    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Verified Manufacturers</p>
  </div>

  {/* Stat 2 */}
  <div className="flex flex-col items-center">
    <div className="text-4xl font-bold text-blue-600 mb-2">
      <AnimatedNumber value={1000} />
    </div>
    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Skilled Labour</p>
  </div>

  {/* Stat 3 */}
  <div className="flex flex-col items-center">
    <div className="text-4xl font-bold text-blue-600 mb-2">
      <AnimatedNumber value={300} />
    </div>
    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Clients</p>
  </div>

</div>

        {/* CTA Section */}
        <div className="bg-[#2563EB] rounded-2xl p-12 text-center text-white mb-12">
          <h2 className="text-3xl mb-4">Ready to get started?</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Join thousands of clients, manufacturers, and skilled labour on Skillora
          </p>
          <Button 
            onClick={handleGetStarted} 
            className="bg-white text-[#2563EB] hover:bg-gray-100 px-8 py-6 text-lg"
          >
            Choose Your Role
          </Button>
        </div>

        {/* Contact Section */}
        <div className={`${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl p-8 mb-12`}>
          <div className="text-center mb-6">
            <h2 className={`text-2xl mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Get In Touch</h2>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>We're here to help you</p>
          </div>
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <Phone className="size-5 text-[#2563EB]" />
              <span className={`${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>0307069990</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="size-5 text-[#2563EB]" />
              <span className={`${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>info@skillora.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Selection Modal */}
{showRoleSelection && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`${isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl max-w-4xl w-full p-8`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Choose Your Role</h2>
              <button onClick={() => setShowRoleSelection(false)}>
                <X className={`size-6 ${isDarkMode ? 'text-gray-400 hover:text-[#F9FAFB]' : 'text-gray-500 hover:text-[#1F2933]'}`} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card 
                onClick={() => handleRoleSelect('client')} 
                className={`cursor-pointer transition-all hover:shadow-lg ${isDarkMode ? 'bg-[#2A3642] border-gray-700 hover:border-[#2563EB]' : 'bg-white border-gray-200 hover:border-[#2563EB]'}`}
              >
                <CardHeader>
                  <div className="size-16 rounded-full bg-[#2563EB]/10 flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="size-8 text-[#2563EB]" />
                  </div>
                  <CardTitle className={`text-center ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Client</CardTitle>
                  <CardDescription className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Post orders and hire manufacturers or labour
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                onClick={() => handleRoleSelect('manufacturer')} 
                className={`cursor-pointer transition-all hover:shadow-lg ${isDarkMode ? 'bg-[#2A3642] border-gray-700 hover:border-[#2563EB]' : 'bg-white border-gray-200 hover:border-[#2563EB]'}`}
              >
                <CardHeader>
                  <div className="size-16 rounded-full bg-[#2563EB]/10 flex items-center justify-center mx-auto mb-4">
                    <Factory className="size-8 text-[#2563EB]" />
                  </div>
                  <CardTitle className={`text-center ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Manufacturer</CardTitle>
                  <CardDescription className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Accept orders and hire skilled labour
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                onClick={() => handleRoleSelect('labour')} 
                className={`cursor-pointer transition-all hover:shadow-lg ${isDarkMode ? 'bg-[#2A3642] border-gray-700 hover:border-[#2563EB]' : 'bg-white border-gray-200 hover:border-[#2563EB]'}`}
              >
                <CardHeader>
                  <div className="size-16 rounded-full bg-[#2563EB]/10 flex items-center justify-center mx-auto mb-4">
                    <HardHat className="size-8 text-[#2563EB]" />
                  </div>
                  <CardTitle className={`text-center ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Labour</CardTitle>
                  <CardDescription className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Find work opportunities with verified clients
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                onClick={() => handleRoleSelect('admin')} 
                className={`cursor-pointer transition-all hover:shadow-lg ${isDarkMode ? 'bg-[#2A3642] border-gray-700 hover:border-[#2563EB]' : 'bg-white border-gray-200 hover:border-[#2563EB]'}`}
              >
                <CardHeader>
                  <div className="size-16 rounded-full bg-purple-600/10 flex items-center justify-center mx-auto mb-4">
                    <Shield className="size-8 text-purple-600" />
                  </div>
                  <CardTitle className={`text-center ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Admin</CardTitle>
                  <CardDescription className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Platform management and system control
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
{showLogin && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`${isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl max-w-md w-full p-8`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Login</h2>
              <button onClick={() => setShowLogin(false)}>
                <X className={`size-6 ${isDarkMode ? 'text-gray-400 hover:text-[#F9FAFB]' : 'text-gray-500 hover:text-[#1F2933]'}`} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your.email@example.com" 
                  className={`${isDarkMode ? 'bg-[#2A3642] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`} 
                />
              </div>
              <div>
                <Label htmlFor="password" className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password" 
                  className={`${isDarkMode ? 'bg-[#2A3642] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`} 
                />
              </div>
              <Button className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white">
                Login
              </Button>
              <div className="text-center">
                <button 
                  onClick={() => {
                    setShowLogin(false);
                    setShowRoleSelection(true);
                  }}
                  className="text-sm text-[#2563EB] hover:text-[#1d4ed8]"
                >
                  Don't have an account? Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
{showHelp && <EnhancedHelpOverlay onClose={() => setShowHelp(false)} />}

      {/* About Us Modal */}
{showAbout && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`${isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl max-w-2xl w-full p-8`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>About Skillora</h2>
              <button onClick={() => setShowAbout(false)}>
                <X className={`size-6 ${isDarkMode ? 'text-gray-400 hover:text-[#F9FAFB]' : 'text-gray-500 hover:text-[#1F2933]'}`} />
              </button>
            </div>
            <div className="space-y-4">
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>
                Skillora is a trusted platform connecting clients, manufacturers, and skilled labour in the textile industry.
              </p>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>
                Our mission is to build trust through verified profiles, secure escrow payments, and transparent rating systems.
              </p>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>
                Every user on Skillora undergoes complete verification including CNIC verification, document uploads, and identity confirmation.
              </p>
              <div className={`border-t pt-4 mt-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Our Values</h3>
                <ul className={`list-disc list-inside space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>
                  <li>Trust and Transparency</li>
                  <li>Quality and Excellence</li>
                  <li>Security and Safety</li>
                  <li>Fair and Timely Payments</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/*This file is the Landing Page (homepage UI) that handles user entry, search, navigation, and initial interactions.
It is a web-based file, not used for mobile apps.*/