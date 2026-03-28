import { ProfileModal } from './ProfileMangement';
import { ChatModal } from './ChatModal';
import { HorizontalProfiles } from './HorizontalProfiles';
import { NotificationsModal } from './NotificationsModal';
import { EmailModal } from './EmailModal(Optional)';
import { SettingsModal } from './SettingsModal';
import { JobDetailModal } from './JobDetailModal';
import { EditProfileModal } from './EditProfileModal';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/labelstatus';
import { Sparkles, MessageSquare, Bell, LogOut, Star, Clock, Settings, Mail, Shield, TrendingUp, Award, Briefcase } from 'lucide-react';

export function LabourDashboard({ user, onLogout }) {
  const { isDarkMode } = useTheme();
  const [showProfile, setShowProfile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState('offers');
  const [selectedProfileUser, setSelectedProfileUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [workOffers, setWorkOffers] = useState([
    {
      id: '1',
      manufacturerName: 'ABC Textiles',
      orderTitle: 'Cotton Shirts Manufacturing',
      duration: '10 days',
      rate: 650,
      status: 'pending',
    },
    {
      id: '2',
      manufacturerName: 'Premium Leather Co.',
      orderTitle: 'Leather Bags Production',
      duration: '15 days',
      rate: 700,
      status: 'pending',
    }
  ]);

  const [activeWork, setActiveWork] = useState([
    {
      id: 'a1',
      manufacturerName: 'Sports Gear Ltd.',
      orderTitle: 'Sports Shoes Production',
      duration: '8 days remaining',
      rate: 600,
      status: 'accepted',
    }
  ]);

  const [completedWork, setCompletedWork] = useState([
    {
      id: 'c1',
      manufacturerName: 'Fashion House',
      orderTitle: 'Designer Suits',
      duration: '12 days',
      rate: 620,
      status: 'completed',
    }
  ]);

  const totalEarnings = 45000;
  const currentMonthEarnings = 12000;

  const handleAcceptOffer = (offer) => {
    // Remove from pending offers
    setWorkOffers(workOffers.filter(o => o.id !== offer.id));
    // Add to active work
    setActiveWork([...activeWork, { ...offer, status: 'accepted' }]);
    // Switch to active tab
    setActiveTab('active');
  };

  const handleDeclineOffer = (offerId) => {
    setWorkOffers(workOffers.filter(o => o.id !== offerId));
  };

  const handleViewJobDetail = (job, type) => {
    setSelectedJob(job);
    setShowJobDetail(true);
  };

  const getFilteredWork = () => {
    if (activeTab === 'offers') return workOffers;
    if (activeTab === 'active') return activeWork;
    if (activeTab === 'completed') return completedWork;
    return [];
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1a1f2e]' : 'bg-[#F9FAFB]'}`}>
      {/* Header - Professional style */}
      <header className={`border-b ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded bg-[#2563EB] flex items-center justify-center">
                  <Sparkles className="size-5 text-white" />
                </div>
                <span className="text-2xl font-medium text-[#2563EB]">Skillora</span>
              </div>
              <div className="hidden md:block h-6 w-px bg-gray-300" />
              <div className="hidden md:block">
                <div className="text-sm text-[#1F2933]">{user.name}</div>
                <div className="text-xs text-gray-500">Labour Dashboard</div>
              </div>
            </div>
            
            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setShowEmail(true)} title="Email" className="text-[#2563EB] hover:bg-[#2563EB]/10">
                <Mail className="size-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowChat(true)} title="Messages" className="text-[#2563EB] hover:bg-[#2563EB]/10">
                <MessageSquare className="size-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowNotifications(true)} title="Notifications" className="text-[#2563EB] hover:bg-[#2563EB]/10">
                <Bell className="size-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} title="Settings" className={`${isDarkMode ? 'text-[#F9FAFB] hover:bg-gray-700' : 'text-[#1F2933] hover:bg-gray-100'}`}>
                <Settings className="size-5" />
              </Button>
              <Button variant="ghost" onClick={() => setShowProfile(true)} className={`${isDarkMode ? 'text-[#F9FAFB] hover:bg-gray-700' : 'text-[#1F2933] hover:bg-gray-100'}`}>
                Profile
              </Button>
              <Button variant="outline" onClick={onLogout} className={`${isDarkMode ? 'border-gray-600 text-[#F9FAFB] hover:bg-gray-700' : 'border-gray-300 text-[#1F2933] hover:bg-gray-100'}`}>
                <LogOut className="size-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Profile Summary */}
        <Card className={`mb-6 ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-2xl">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</h2>
                    {user.verified && (
                      <Shield className="size-5 text-[#2563EB]" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-400">{user.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="size-4 text-[#2563EB]" />
                      <span className="text-sm text-gray-400">{user.totalReviews || 23} Reviews</span>
                    </div>
                  </div>
                  {user.skills && (
                    <div className="flex flex-wrap gap-2">
                    {user.skills.map(skill => (
                      <Badge key={skill} variant="secondary" className={`${isDarkMode ? 'bg-[#2563EB]/20 text-[#2563EB] border-[#2563EB]/30' : 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20'}`}>{skill}</Badge>
                    ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Hourly Rate</div>
                <div className="text-[#2563EB]">PKR {user.rate || 600}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instagram-style Horizontal Profiles */}
        <HorizontalProfiles 
          userType="labour" 
          onProfileClick={(profile) => {
            const profileUser = {
              id: profile.id,
              name: profile.name,
              type: profile.type,
              email: `${profile.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
              phone: '+92 300 1234567',
              verified: profile.verified,
              rating: profile.rating,
              totalReviews: 23,
              skills: profile.specialty ? [profile.specialty] : [],
            };
            setSelectedProfileUser(profileUser);
            setShowProfile(true);
          }}
          onChatClick={(profile) => {
            setShowChat(true);
          }}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-gray-400">Pending Offers</CardDescription>
              <CardTitle className="text-[#2563EB]">{workOffers.filter(w => w.status === 'pending').length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-gray-400">Active Work</CardDescription>
              <CardTitle className="text-[#2563EB]">{activeWork.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-gray-400">Completed Jobs</CardDescription>
              <CardTitle className="text-[#2563EB]">{completedWork.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-gray-400">Total Earnings</CardDescription>
              <CardTitle className="text-[#2563EB]">
                PKR {(activeWork.length * 650 * 8 + completedWork.length * 5000).toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs - Alibaba style */}
        <div className={`flex gap-6 mb-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={() => setActiveTab('offers')}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'offers' 
                ? 'border-[#2563EB] text-[#2563EB]' 
                : isDarkMode ? 'border-transparent text-gray-400 hover:text-[#2563EB]' : 'border-transparent text-gray-500 hover:text-[#2563EB]'
            }`}
          >
            Work Offers
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'active' 
                ? 'border-[#2563EB] text-[#2563EB]' 
                : isDarkMode ? 'border-transparent text-gray-400 hover:text-[#2563EB]' : 'border-transparent text-gray-500 hover:text-[#2563EB]'
            }`}
          >
            Active Work
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'completed' 
                ? 'border-[#2563EB] text-[#2563EB]' 
                : isDarkMode ? 'border-transparent text-gray-400 hover:text-[#2563EB]' : 'border-transparent text-gray-500 hover:text-[#2563EB]'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Work List */}
        <div className="space-y-4">
          {getFilteredWork().map(work => (
            <Card key={work.id} className={`hover:shadow-md transition-shadow ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{work.orderTitle}</CardTitle>
                      <Badge variant={
                        work.status === 'completed' ? 'default' : 
                        work.status === 'accepted' ? 'secondary' : 
                        'outline'
                      } className={
                        work.status === 'completed' ? 'bg-[#2563EB]/20 text-[#2563EB] border-[#2563EB]/30' : 
                        work.status === 'accepted' ? 'bg-[#2563EB]/20 text-[#2563EB] border-[#2563EB]/30' : 
                        isDarkMode ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-100 text-gray-600 border-gray-300'
                      }>
                        {work.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm text-gray-400">Manufacturer: {work.manufacturerName}</CardDescription>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-[#2563EB]">
                      PKR {work.rate}
                    </div>
                    <div className="text-xs text-gray-500">per hour</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">Duration</div>
                        <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{work.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="size-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">Type</div>
                        <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>On-site</div>
                      </div>
                    </div>
                  </div>
                  {work.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button variant="outline" className={isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-600 hover:bg-gray-100'} onClick={() => handleDeclineOffer(work.id)}>Decline</Button>
                      <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white" onClick={() => handleAcceptOffer(work)}>Accept Offer</Button>
                    </div>
                  )}
                  {work.status === 'accepted' && (
                    <Button variant="outline" className={isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-600 hover:bg-gray-100'} onClick={() => handleViewJobDetail(work, 'active')}>View Details</Button>
                  )}
                  {work.status === 'completed' && (
                    <Button variant="ghost" className="text-[#2563EB] hover:text-[#2563EB]/80 hover:bg-[#2563EB]/10" onClick={() => handleViewJobDetail(work, 'completed')}>
                      <Star className="size-4 fill-[#2563EB] mr-1" />
                      <span className="text-sm">Rated 5.0 • View Details</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {getFilteredWork().length === 0 && (
            <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}>
              <CardContent className="py-12 text-center">
                <Briefcase className="size-12 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">No work found in this category</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Performance Insights */}
        <Card className={`mt-6 ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader className="pb-3">
            <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Performance Insights</CardTitle>
            <CardDescription className="text-sm text-gray-400">Your work statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className={`size-12 rounded-full ${isDarkMode ? 'bg-[#2563EB]/20 border border-[#2563EB]/30' : 'bg-[#2563EB]/10 border border-[#2563EB]/20'} flex items-center justify-center`}>
                  <TrendingUp className="size-6 text-[#2563EB]" />
                </div>
                <div>
                  <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>98%</div>
                  <div className="text-xs text-gray-400">On-time Completion</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-full bg-yellow-600/20 border border-yellow-600/30 flex items-center justify-center">
                  <Star className="size-6 text-yellow-400" />
                </div>
                <div>
                  <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>4.7/5.0</div>
                  <div className="text-xs text-gray-400">Average Rating</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`size-12 rounded-full ${isDarkMode ? 'bg-[#2563EB]/20 border border-[#2563EB]/30' : 'bg-[#2563EB]/10 border border-[#2563EB]/20'} flex items-center justify-center`}>
                  <Award className="size-6 text-[#2563EB]" />
                </div>
                <div>
                  <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>12</div>
                  <div className="text-xs text-gray-400">Jobs Completed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {showProfile && (
        <ProfileModal 
          user={selectedProfileUser || user}
          onClose={() => {
            setShowProfile(false);
            setSelectedProfileUser(null);
          }}
          onChatClick={() => {
            setShowProfile(false);
            setShowChat(true);
          }}
        />
      )}

      {showChat && (
        <ChatModal 
          onClose={() => setShowChat(false)}
        />
      )}

      {showNotifications && (
        <NotificationsModal 
          onClose={() => setShowNotifications(false)}
        />
      )}

      {showEmail && (
        <EmailModal 
          onClose={() => setShowEmail(false)}
        />
      )}

      {showSettings && (
        <SettingsModal 
          onClose={() => setShowSettings(false)}
          userType="labour"
        />
      )}

      {showJobDetail && selectedJob && (
        <JobDetailModal 
          job={selectedJob}
          onClose={() => {
            setShowJobDetail(false);
            setSelectedJob(null);
          }}
          userType={selectedJob.status === 'completed' ? 'completed' : 'active'}
        />
      )}
    </div>
  );
}
/*Purpose: Labour dashboard UI that manages work offers, active jobs, completed tasks, earnings, and user interactions (chat, profile, notifications, etc.).
Type: Web-based (React component), but can be used in both web and mobile apps if integrated with frameworks like React Native. */