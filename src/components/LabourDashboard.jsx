import { ProfileModal } from './ProfileMangement';
import ChatModule from './ChatModule';
import { HorizontalProfiles } from './HorizontalProfiles';
import { NotificationsModal } from './NotificationsModal';
import { EmailModal } from './EmailModal(Optional)';
import { SettingsModal } from './SettingsModal';
import { JobDetailModal } from './JobDetailModal';
import { ReviewSubmissionModal } from './ReviewSubmissionModal';
import { EditProfileModal } from './EditProfileModal';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useEffect } from 'react'; // useEffect add kiya fetch ke liye
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
  const [reviewTarget, setReviewTarget] = useState(null);

  // --- 🔗 REAL DATA STATES (Initial Khali Hain) ---
  const [workOffers, setWorkOffers] = useState([]);
  const [activeWork, setActiveWork] = useState([]);
  const [completedWork, setCompletedWork] = useState([
    {
      id: 'cw1',
      orderTitle: 'Garment Stitching Batch',
      manufacturerName: 'ABC Textiles',
      rate: 650,
      duration: '5 days',
      status: 'completed'
    }
  ]);
  const [earnings, setEarnings] = useState({ total: 0, currentMonth: 0 });

  // --- 🔗 BACKEND SE DATA MANGWANE KA FUNCTION ---
  useEffect(() => {
    const fetchLabourData = async () => {
      try {
        // Misal ke tor par: backend se data lena
        // const response = await fetch(`http://localhost:5003/api/labour/jobs/${user.id}`);
        // const data = await response.json();
        // setWorkOffers(data.offers);
        // setActiveWork(data.active);
        // setCompletedWork(data.completed);
      } catch (error) {
        console.error("Data load nahi ho saka:", error);
      }
    };

    if (user && user.id) {
      fetchLabourData();
    }
  }, [user]);

  const handleAcceptOffer = (offer) => {
    // Backend API call here to update status
    setWorkOffers(workOffers.filter(o => o.id !== offer.id));
    setActiveWork([...activeWork, { ...offer, status: 'accepted' }]);
    setActiveTab('active');
  };

  const handleDeclineOffer = (offerId) => {
    // Backend API call here to delete offer
    setWorkOffers(workOffers.filter(o => o.id !== offerId));
  };

  const handleViewJobDetail = (job, type) => {
    setSelectedJob(job);
    setShowJobDetail(true);
  };

  const handleSubmitReview = (rating, comment) => {
    console.log('Labour review submitted:', { rating, comment, target: reviewTarget });
    alert('Review submitted successfully!');
    setReviewTarget(null);
  };

  const getFilteredWork = () => {
    if (activeTab === 'offers') return workOffers;
    if (activeTab === 'active') return activeWork;
    if (activeTab === 'completed') return completedWork;
    return [];
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1a1f2e]' : 'bg-[#F9FAFB]'}`}>
      <header className={`border-b ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
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
                <LogOut className="size-4 mr-2" /> Logout
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
                  {user.name?.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</h2>
                    {user.verified && <Shield className="size-5 text-[#2563EB]" />}
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-400">{user.rating || 0}</span>
                    </div>
                  </div>
                  {user.skills && (
                    <div className="flex flex-wrap gap-2">
                    {user.skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="bg-[#2563EB]/10 text-[#2563EB]">{skill}</Badge>
                    ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Hourly Rate</div>
                <div className="text-[#2563EB]">PKR {user.rate || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-gray-400">Pending Offers</CardDescription>
              <CardTitle className="text-[#2563EB]">{workOffers.length}</CardTitle>
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
              <CardTitle className="text-[#2563EB]">PKR {earnings.total.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs */}
        <div className={`flex gap-6 mb-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button onClick={() => setActiveTab('offers')} className={`pb-3 px-1 border-b-2 transition-colors ${activeTab === 'offers' ? 'border-[#2563EB] text-[#2563EB]' : 'text-gray-400'}`}>Work Offers</button>
          <button onClick={() => setActiveTab('active')} className={`pb-3 px-1 border-b-2 transition-colors ${activeTab === 'active' ? 'border-[#2563EB] text-[#2563EB]' : 'text-gray-400'}`}>Active Work</button>
          <button onClick={() => setActiveTab('completed')} className={`pb-3 px-1 border-b-2 transition-colors ${activeTab === 'completed' ? 'border-[#2563EB] text-[#2563EB]' : 'text-gray-400'}`}>Completed</button>
        </div>

        {/* Work List */}
        <div className="space-y-4">
          {getFilteredWork().map(work => (
            <Card key={work.id} className={isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{work.orderTitle}</CardTitle>
                      <Badge className="bg-[#2563EB]/20 text-[#2563EB]">{work.status}</Badge>
                    </div>
                    <CardDescription className="text-sm text-gray-400">Manufacturer: {work.manufacturerName}</CardDescription>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-[#2563EB]">PKR {work.rate}</div>
                    <div className="text-xs text-gray-500">per hour</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-gray-400" />
                      <div><div className="text-xs text-gray-500">Duration</div><div className="text-gray-300">{work.duration}</div></div>
                    </div>
                  </div>
                  {work.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => handleDeclineOffer(work.id)}>Decline</Button>
                      <Button className="bg-[#2563EB] text-white" onClick={() => handleAcceptOffer(work)}>Accept Offer</Button>
                    </div>
                  )}
                  {work.status !== 'pending' && (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => handleViewJobDetail(work)}>View Details</Button>
                      {work.status === 'completed' && (
                        <Button className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]" onClick={() => setReviewTarget(work)}>
                          <Star className="size-4 mr-2" />
                          Submit Review
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {getFilteredWork().length === 0 && (
            <div className="py-12 text-center">
              <Briefcase className="size-12 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">No work found</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals - Same as before */}
      {showProfile && <ProfileModal user={selectedProfileUser || user} onClose={() => setShowProfile(false)} />}
      {showChat && <ChatModule onClose={() => setShowChat(false)} />}
      {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
      {showEmail && <EmailModal onClose={() => setShowEmail(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} userType="labour" />}
      {showJobDetail && selectedJob && <JobDetailModal job={selectedJob} onClose={() => setShowJobDetail(false)} />}
      {reviewTarget && (
        <ReviewSubmissionModal
          onClose={() => setReviewTarget(null)}
          onSubmit={handleSubmitReview}
          targetName={reviewTarget.manufacturerName}
          targetRole="manufacturer"
          orderId={reviewTarget.id}
        />
      )}
    </div>
  );
}


