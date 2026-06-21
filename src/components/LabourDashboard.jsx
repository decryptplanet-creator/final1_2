import { ChatInbox, useChatNotifications } from './ChatInbox';
import { ProfileModal } from './ProfileMangement';
import ChatModule from './ChatModule';
import { HorizontalProfiles } from './HorizontalProfiles';
import { NotificationsModal } from './NotificationsModal';
import { EmailModal } from './EmailModal(Optional)';
import { SettingsModal } from './SettingsModal';
import { JobDetailModal } from './JobDetailModal';
import { ReviewSubmissionModal } from './ReviewSubmissionModal';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/labelstatus';
import { Sparkles, MessageSquare, Bell, LogOut, Star, Clock, Settings, Mail, Shield, Briefcase, CheckCircle, XCircle, Eye, Search } from 'lucide-react';
import { SearchModal } from './SearchModal';

export function LabourDashboard({ user, onLogout }) {
  const { isDarkMode } = useTheme();
  const [showProfile, setShowProfile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showInbox, setShowInbox] = useState(false); // ✅ NEW
  const [chatTarget, setChatTarget] = useState(null);
  const [activeTab, setActiveTab] = useState('offers');
  const [selectedProfileUser, setSelectedProfileUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifUnread, setNotifUnread] = useState(0);
  const [showEmail, setShowEmail] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewedIds, setReviewedIds] = useState(new Set());
  const [showSearch, setShowSearch] = useState(false);

  const [workOffers, setWorkOffers] = useState([]);
  const [activeWork, setActiveWork] = useState([]);
  const [completedWork, setCompletedWork] = useState([]);
  const [earnings] = useState({ total: 47500, currentMonth: 12300 });

  const { unread: chatUnread, clearUnread } = useChatNotifications(user?.id || user?._id);

  const API = import.meta.env.VITE_API_URL || 'http://localhost:5003';
  const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  const authHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` });

  const fetchLabourData = async () => {
    try {
      const res = await fetch(`${API}/api/orders/labour`, { headers: authHeaders() });
      if (!res.ok) return;
      const { available, accepted } = await res.json();
      const myId = String(user?.id || user?._id || '');
      const toOffer = (o) => ({
        id: o._id,
        orderTitle: o.title,
        manufacturerName: o.clientId?.companyName || o.clientId?.name || 'Manufacturer',
        manufacturerId: o.clientId?._id,
        rate: o.budget,
        duration: o.deadline,
        status: 'pending',
        description: o.description,
        applicants: o.applicants || [],
        hiredLabour: o.hiredLabour,
        appliedByMe: (o.applicants || []).some(a => String(a.labourId) === myId || String(a.labourId?._id) === myId),
      });
      const toActive = (o) => ({ ...toOffer(o), status: 'accepted' });
      setWorkOffers(available?.length ? available.map(toOffer) : [
        { id: 'wo1', orderTitle: 'Fabric Cutting & Stitching', manufacturerName: 'Faisal Garments', manufacturerId: 'guest_manufacturer', rate: 700, duration: '3 days', status: 'pending', applicants: [] },
        { id: 'wo2', orderTitle: 'Embroidery Work - 500 Units', manufacturerName: 'Zara Textiles Pvt.', manufacturerId: 'guest_manufacturer', rate: 850, duration: '7 days', status: 'pending', applicants: [] },
        { id: 'wo3', orderTitle: 'Button Fitting & Finishing', manufacturerName: 'Hassan Fabrics', manufacturerId: 'guest_manufacturer', rate: 550, duration: '2 days', status: 'pending', applicants: [] },
      ]);
      setActiveWork(accepted?.length ? accepted.map(toActive) : [
        { id: 'aw1', orderTitle: 'Denim Jeans Stitching - 200 Pcs', manufacturerName: 'Punjab Denim Co.', manufacturerId: 'guest_manufacturer', rate: 900, duration: '10 days', status: 'accepted', applicants: [] },
        { id: 'aw2', orderTitle: 'Collar Finishing - Shirt Batch', manufacturerName: 'Metro Apparel', manufacturerId: 'guest_manufacturer', rate: 600, duration: '4 days', status: 'accepted', applicants: [] },
      ]);
    } catch (error) {
      console.error("Data load nahi ho saka:", error);
      setWorkOffers([
        { id: 'wo1', orderTitle: 'Fabric Cutting & Stitching', manufacturerName: 'Faisal Garments', manufacturerId: 'guest_manufacturer', rate: 700, duration: '3 days', status: 'pending', applicants: [] },
        { id: 'wo2', orderTitle: 'Embroidery Work - 500 Units', manufacturerName: 'Zara Textiles Pvt.', manufacturerId: 'guest_manufacturer', rate: 850, duration: '7 days', status: 'pending', applicants: [] },
      ]);
    }
  };

  const fetchNotifUnread = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/admin/my-notifications`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setNotifUnread(data.filter(n => !n.isRead).length);
      }
    } catch {}
  };

  useEffect(() => { fetchLabourData(); fetchNotifUnread(); }, []); // eslint-disable-line

  const handleApplyOffer = async (offer) => {
    if (!offer.id || offer.id.startsWith('wo') || offer.id.startsWith('aw')) {
      alert('Ye demo data hai — real orders manufacturer se aayenge!');
      return;
    }
    const token = getToken();
    if (!token) {
      alert('Apply karne ke liye pehle login karein!');
      return;
    }
    // Already applied?
    const myId = user?.id || user?._id;
    if ((offer.applicants || []).some(a => a.labourId === myId)) {
      alert('Aap pehle se apply kar chuke hain!');
      return;
    }
    try {
      const res = await fetch(`${API}/api/orders/labour/apply/${offer.id}`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ labourId: myId, labourName: user?.name || 'Labour' }),
      });
      const d = await res.json();
      if (!res.ok) return alert(d.message || d.error || 'Apply nahi ho saka');
      // Mark as applied in local state
      setWorkOffers(prev => prev.map(o => o.id === offer.id ? { ...o, appliedByMe: true } : o));
      alert('✅ Apply ho gaya! Manufacturer hire kare ga tab active work mein aayega.');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeclineOffer = (offerId) => {
    setWorkOffers(workOffers.filter(o => o.id !== offerId));
  };

  const handleSubmitReview = (rating, comment) => {
    console.log('Labour review submitted:', { rating, comment, target: reviewTarget });
    alert('Review submitted successfully!');
    setReviewedIds(prev => new Set([...prev, reviewTarget?.id]));
    setReviewTarget(null);
  };

  const getFilteredWork = () => {
    const myId = user?.id || user?._id;
    if (activeTab === 'offers')    return workOffers.filter(w => w.status === 'pending' && !w.appliedByMe);
    if (activeTab === 'applied')   return workOffers.filter(w => w.appliedByMe || (w.applicants || []).some(a => a.labourId === myId));
    if (activeTab === 'active')    return activeWork;
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
              <Button variant="ghost" size="icon" onClick={() => setShowEmail(true)} className="text-[#2563EB] hover:bg-[#2563EB]/10"><Mail className="size-5" /></Button>
              {/* ✅ MessageSquare opens Inbox now */}
              <Button variant="ghost" size="icon" onClick={() => { setShowInbox(true); clearUnread(); }} className="text-[#2563EB] hover:bg-[#2563EB]/10 relative">
                <MessageSquare className="size-5" />
                {chatUnread > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{chatUnread}</span>}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => { setShowNotifications(true); setNotifUnread(0); }} className="text-[#2563EB] hover:bg-[#2563EB]/10 relative">
                <Bell className="size-5" />
                {notifUnread > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{notifUnread}</span>}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} className={isDarkMode ? 'text-[#F9FAFB] hover:bg-gray-700' : 'text-[#1F2933] hover:bg-gray-100'}><Settings className="size-5" /></Button>
              <Button variant="ghost" onClick={() => setShowProfile(true)} className={isDarkMode ? 'text-[#F9FAFB] hover:bg-gray-700' : 'text-[#1F2933] hover:bg-gray-100'}>Profile</Button>
              <Button variant="outline" onClick={onLogout} className={isDarkMode ? 'border-gray-600 text-[#F9FAFB] hover:bg-gray-700' : 'border-gray-300 text-[#1F2933] hover:bg-gray-100'}>
                <LogOut className="size-4 mr-2" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 size-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <Input placeholder="Search manufacturers, jobs..." className={`pl-10 ${isDarkMode ? 'bg-[#2A3642] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`} onClick={() => setShowSearch(true)} />
          </div>
        </div>

        <Card className={`mb-6 ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-2xl">{user.name?.charAt(0)}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</h2>
                    {user.verified && <Shield className="size-5 text-[#2563EB]" />}
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-400">{user.rating || 0}</span>
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Pending Offers', value: workOffers.length },
            { label: 'Active Work', value: activeWork.length },
            { label: 'Completed Jobs', value: completedWork.length },
            { label: 'Total Earnings', value: `PKR ${earnings.total.toLocaleString()}` },
          ].map(({ label, value }) => (
            <Card key={label} className={isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs text-gray-400">{label}</CardDescription>
                <CardTitle className="text-[#2563EB]">{value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className={`flex gap-6 mb-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {['offers', 'applied', 'active', 'completed'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 px-1 border-b-2 capitalize transition-colors ${activeTab === tab ? 'border-[#2563EB] text-[#2563EB]' : 'text-gray-400'}`}>
              {tab === 'offers' ? 'Work Offers' : tab === 'applied' ? 'Applied' : tab === 'active' ? 'Active Work' : 'Completed'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {getFilteredWork().map(work => (
            <Card key={work.id} className={isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{work.orderTitle}</CardTitle>
                      <Badge className={work.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : work.status === 'accepted' ? 'bg-green-500/20 text-green-400' : 'bg-[#2563EB]/20 text-[#2563EB]'}>
                        {work.status}
                      </Badge>
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
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Duration</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{work.duration}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" onClick={() => {
                      setChatTarget({ id: work.manufacturerId, name: work.manufacturerName, orderId: work.id });
                      setShowChat(true);
                    }} className="flex items-center gap-1">
                      <MessageSquare className="size-4" /> Chat
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { setSelectedJob(work); setShowJobDetail(true); }} className="flex items-center gap-1">
                      <Eye className="size-4" /> View Details
                    </Button>
                    {work.status === 'pending' && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handleDeclineOffer(work.id)} className="flex items-center gap-1 border-red-400 text-red-400 hover:bg-red-400/10">
                          <XCircle className="size-4" /> Decline
                        </Button>
                        {work.appliedByMe ? (
                          <Badge className="bg-yellow-500/20 text-yellow-400">Applied — Awaiting Hire</Badge>
                        ) : (
                          <Button size="sm" className="bg-[#2563EB] text-white hover:bg-[#1d4ed8] flex items-center gap-1" onClick={() => handleApplyOffer(work)}>
                            <CheckCircle className="size-4" /> Apply
                          </Button>
                        )}
                      </>
                    )}
                    {work.status === 'accepted' && (
                      <Button size="sm" className="bg-green-600 text-white hover:bg-green-700 flex items-center gap-1" onClick={async () => {
                        // Call API if real order (not demo)
                        if (work.id && !work.id.startsWith('aw')) {
                          const token = getToken();
                          if (token) {
                            await fetch(`${API}/api/orders/labour/complete/${work.id}`, {
                              method: 'PUT', headers: authHeaders(),
                            }).catch(() => {});
                          }
                        }
                        setActiveWork(activeWork.filter(w => w.id !== work.id));
                        setCompletedWork([...completedWork, { ...work, status: 'completed' }]);
                        setActiveTab('completed');
                      }}>
                        <CheckCircle className="size-4" /> Mark Complete
                      </Button>
                    )}
                    {/* Applied tab: show hired / rejected status */}
                    {activeTab === 'applied' && (() => {
                      const myId = user?.id || user?._id;
                      const myApp = (work.applicants || []).find(a => a.labourId === myId);
                      if (myApp?.status === 'hired') return <Badge className="bg-green-500/20 text-green-400">✅ Hired!</Badge>;
                      if (myApp?.status === 'rejected') return <Badge className="bg-red-500/20 text-red-400">❌ Rejected</Badge>;
                      return <Badge className="bg-yellow-500/20 text-yellow-400">⏳ Awaiting Decision</Badge>;
                    })()}
                    {work.status === 'completed' && (
                      reviewedIds.has(work.id)
                        ? <Badge className="bg-green-500/20 text-green-400">✅ Reviewed</Badge>
                        : <Button size="sm" className="bg-[#2563EB] text-white hover:bg-[#1d4ed8] flex items-center gap-1" onClick={() => setReviewTarget(work)}>
                            <Star className="size-4" /> Submit Review
                          </Button>
                    )}
                  </div>
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

      {showProfile && <ProfileModal user={selectedProfileUser || user} onClose={() => setShowProfile(false)} />}
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} userType="labour" currentUserId={user?.id} />}
      {showChat && (
        <ChatModule
          currentUserId={user?.id || user?._id || 'labour_user'}
          currentUserName={user?.name || 'Labour'}
          receiverId={chatTarget?.id || 'manufacturer_user'}
          receiverName={chatTarget?.name || 'Manufacturer'}
          orderId={chatTarget?.orderId || `chat_${user?.id || 'general'}`}
          onClose={() => { setShowChat(false); setChatTarget(null); }}
        />
      )}
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
      {/* ✅ ChatInbox Modal */}
      {showInbox && (
        <ChatInbox
          currentUserId={user?.id || user?._id}
          onClose={() => setShowInbox(false)}
          onOpenChat={(conv) => {
            setChatTarget({
              id: conv.with?.id,
              name: conv.with?.name,
              orderId: conv.orderId,
            });
            setShowInbox(false);
            setShowChat(true);
          }}
        />
      )}
    </div>
  );
}
