import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/labelstatus';
import { Sparkles, MessageSquare, Bell, LogOut, Search, HardHat, Star, Package, Clock, Wallet, Settings, Mail, Filter, Shield, TrendingUp, MapPin, Factory, Plus, Inbox, Users, X } from 'lucide-react';
import { OrderDetailsModal } from './OrderDetailsModal';
import { SearchModal } from './SearchModal';
import { ProfileModal } from './ProfileMangement';
import ChatModule from './ChatModule';
import { HireLabourModal } from './HireLabourModal';
import { HorizontalProfiles } from './HorizontalProfiles';
import { AcceptOrderModal } from './AcceptOrderModal';
import { ChatInbox, useChatNotifications } from './ChatInbox';
import { NotificationsModal } from './NotificationsModal';
import { EmailModal } from './EmailModal(Optional)';
import { SettingsModal } from './SettingsModal';
import { ViewAllModal } from './ViewAllModal';
import { PostOrderModal } from './PostOrderModal';
import { ReviewSubmissionModal } from './ReviewSubmissionModal';
import { useTheme } from '../contexts/ThemeContext';

// ✅ FIX 1: Port 5001 → 5003
const API = import.meta.env.VITE_API_URL || 'http://localhost:5003';
function getToken() { return localStorage.getItem('token') || sessionStorage.getItem('token') || ''; }
const authHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` });

export function ManufacturerDashboard({ user, onLogout }) {
  const { isDarkMode } = useTheme();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const { unread: chatUnread, clearUnread, sendNotification } = useChatNotifications(user?.id || user?._id);
  const [chatTarget, setChatTarget] = useState(null);
  const [showHireLabour, setShowHireLabour] = useState(false);
  const [showAcceptOrder, setShowAcceptOrder] = useState(false);
  const [activeTab, setActiveTab] = useState('available');
  const [selectedProfileUser, setSelectedProfileUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifUnread, setNotifUnread] = useState(0);
  const [showEmail, setShowEmail] = useState(false);
  const [showLabourOrderForm, setShowLabourOrderForm] = useState(false);
  const [labourOrderForm, setLabourOrderForm] = useState({ title: '', description: '', budget: '', deadline: '', quantity: 1 });
  const [postingLabourOrder, setPostingLabourOrder] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showViewAll, setShowViewAll] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showPostOrder, setShowPostOrder] = useState(false);

  // ── Labour Orders (posted by this manufacturer) ──
  const [labourOrders, setLabourOrders] = useState([]);
  const [applicationsOrder, setApplicationsOrder] = useState(null); // order whose applicants to view
  const [reviewLabourTarget, setReviewLabourTarget] = useState(null); // { orderId, labourId, labourName }
  const [reviewedIds, setReviewedIds] = useState(new Set());

  const fetchLabourOrders = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/orders/labour/mine`, { headers: authHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      setLabourOrders(Array.isArray(data) ? data : []);
    } catch (_) {}
  }, []); // eslint-disable-line

  const handleHireLabour = async (order, applicant) => {
    try {
      const res = await fetch(`${API}/api/orders/labour/hire/${order._id || order.id}`, {
        method: 'PUT', headers: authHeaders(),
        body: JSON.stringify({ labourId: applicant.labourId }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      fetchLabourOrders();
      sendNotification(applicant.labourId, `✅ Mubarak! Aapko "${order.title}" order ke liye hire kar liya gaya hai.`, order._id || order.id);
      // Auto-open chat with hired labour
      setChatTarget({ id: applicant.labourId, name: applicant.labourName, orderId: order._id || order.id });
      setApplicationsOrder(null);
      setShowChat(true);
    } catch (err) { alert('Error: ' + err.message); }
  };

  const handleRejectLabour = async (order, applicant) => {
    try {
      const res = await fetch(`${API}/api/orders/labour/reject/${order._id || order.id}`, {
        method: 'PUT', headers: authHeaders(),
        body: JSON.stringify({ labourId: applicant.labourId }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      fetchLabourOrders();
      sendNotification(applicant.labourId, `❌ Afsos, "${order.title}" order ke liye aapki application reject ho gayi.`, order._id || order.id);
      // Refresh applications modal with updated data
      setApplicationsOrder(prev => prev ? { ...prev, applicants: prev.applicants.map(a => a.labourId === applicant.labourId ? { ...a, status: 'rejected' } : a) } : null);
    } catch (err) { alert('Error: ' + err.message); }
  };

  const handleSubmitLabourReview = async (rating, comment) => {
    if (!reviewLabourTarget) return;
    try {
      await fetch(`${API}/api/reviews/add`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ revieweeId: reviewLabourTarget.labourId, rating, comment }),
      });
      alert('✅ Review submitted!');
      setReviewedIds(prev => new Set([...prev, reviewLabourTarget.orderId]));
      setReviewLabourTarget(null);
    } catch (err) { alert('Error: ' + err.message); }
  };

  // ── Real escrow status map: { [orderId]: escrow } ──
  const [escrowMap, setEscrowMap] = useState({});

  const fetchEscrow = useCallback(async (orderId) => {
    try {
      const res = await fetch(`${API}/api/escrow/order/${orderId}`, { headers: authHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      setEscrowMap((prev) => ({ ...prev, [orderId]: data }));
    } catch (_) {}
  }, []);

  const handleReleaseAdvance = async (order) => {
    const escrow = escrowMap[order.id];
    if (!escrow) return alert('Escrow not found for this order');
    try {
      const res = await fetch(`${API}/api/escrow/release/advance/${escrow._id}`, {
        method: 'PUT', headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message);
      alert(`✅ 30% advance (PKR ${escrow.advanceAmount}) released to your wallet!`);
      fetchEscrow(order.id);
    } catch (err) {
      alert('Error releasing advance: ' + err.message);
    }
  };

  const handleMarkDelivered = async (order) => {
    const escrow = escrowMap[order.id];
    if (!escrow) return alert('Escrow not found for this order');
    try {
      const res = await fetch(`${API}/api/escrow/mark-delivered/${escrow._id}`, {
        method: 'PUT', headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message);
      alert('✅ Kaam complete mark ho gaya! Client ko notification bhej di.');
      fetchEscrow(order.id);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const [availableOrders, setAvailableOrders] = useState([]);
  const [acceptedOrders,  setAcceptedOrders]  = useState([]);

  const normalizeOrder = (o) => ({
    ...o,
    id:     o._id,
    budget: o.budget,
    escrowStatus: { total: o.budget, deposited: 0, released: 0 },
    client: o.clientId ? { id: o.clientId._id, name: o.clientId.name } : null,
  });

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/orders/manufacturer`, { headers: authHeaders() });
      if (!res.ok) return;
      const { available, accepted } = await res.json();
      setAvailableOrders((available || []).map(normalizeOrder));
      const normalizedAccepted = (accepted || []).map(normalizeOrder);
      setAcceptedOrders(normalizedAccepted);
      // normalizedAccepted.forEach(o => fetchEscrow(o.id)); // disabled — backend route not available
    } catch (_) {}
  }, []); // eslint-disable-line

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

  useEffect(() => { fetchOrders(); fetchLabourOrders(); fetchNotifUnread(); }, []); // eslint-disable-line

  // Auto-refresh labour orders every 15 seconds to catch new applicants
  useEffect(() => {
    const interval = setInterval(fetchLabourOrders, 15000);
    return () => clearInterval(interval);
  }, [fetchLabourOrders]);

  const handlePostOrder = async (orderData) => {
    try {
      const res = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(orderData),
      });
      const created = await res.json();
      if (!res.ok) return alert(created.error || created.message || 'Failed to create order');
      setShowPostOrder(false);
      fetchOrders();
    } catch (_) {
      setShowPostOrder(false);
    }
  };

  const [hiredLabour] = useState([
    { id: 'l1', name: 'Ahmed Khan', skill: 'Stitching', rate: 600, rating: 4.8 },
    { id: 'l2', name: 'Ali Raza', skill: 'Cutting', rate: 550, rating: 4.6 },
  ]);

  const handleAcceptOrder = async (order) => {
    try {
      const res = await fetch(`${API}/api/orders/accept/${order.id}`, {
        method: 'PUT', headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || 'Failed to accept order');
      fetchOrders();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleUpdateAcceptedOrder = (orderId, updates) => {
    setAcceptedOrders(acceptedOrders.map(order => (
      order.id === orderId ? { ...order, ...updates } : order
    )));
  };

  const getFilteredOrders = () => {
    if (activeTab === 'available') {
      return availableOrders;
    }
    if (activeTab === 'accepted') {
      return acceptedOrders.filter(o => o.status === 'in-progress');
    }
    if (activeTab === 'completed') {
      return acceptedOrders.filter(o => o.status === 'completed');
    }
    return [];
  };

  const submitLabourOrder = async () => {
    if (!labourOrderForm.title || !labourOrderForm.budget || !labourOrderForm.deadline) return alert('Title, budget, deadline required');
    setPostingLabourOrder(true);
    try {
      const res = await fetch(`${API}/api/orders/labour`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ ...labourOrderForm, budget: Number(labourOrderForm.budget), quantity: Number(labourOrderForm.quantity) || 1, postedBy: user?.id || user?._id }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      alert('✅ Labour order posted!');
      setShowLabourOrderForm(false);
      setLabourOrderForm({ title: '', description: '', budget: '', deadline: '', quantity: 1 });
      fetchLabourOrders();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setPostingLabourOrder(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1a1f2e]' : 'bg-[#F9FAFB]'}`}>
      {/* Header */}
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
                <div className="text-xs text-gray-500">Manufacturer Dashboard</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => setShowLabourOrderForm(true)} className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]">
                + Post Labour Order
              </Button>
              <Button size="sm" onClick={() => setShowPostOrder(true)} className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]">
                <Plus className="size-4 mr-1" />
                Post New Order
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowEmail(true)} title="Email" className="text-[#2563EB] hover:bg-[#2563EB]/10">
                <Mail className="size-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => { setShowInbox(true); clearUnread(); }} title="Inbox" className="text-[#2563EB] hover:bg-[#2563EB]/10 relative">
                <Inbox className="size-5" />
                {chatUnread > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{chatUnread}</span>}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowChat(true)} title="Messages" className="text-[#2563EB] hover:bg-[#2563EB]/10">
                <MessageSquare className="size-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => { setShowNotifications(true); setNotifUnread(0); }} title="Notifications" className="text-[#2563EB] hover:bg-[#2563EB]/10 relative">
                <Bell className="size-5" />
                {notifUnread > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{notifUnread}</span>}
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
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 size-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <Input 
              placeholder="Search orders, labour..." 
              className={`pl-10 ${isDarkMode ? 'bg-[#2A3642] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
              onClick={() => setShowSearch(true)}
            />
          </div>
        </div>

        {/* Horizontal Profiles */}
        <HorizontalProfiles 
          userType="manufacturer"
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
            setChatTarget({ id: profile?.id, name: profile?.name, orderId: `chat_${profile?.id || 'general'}` });
            setShowChat(true);
          }}
          onViewAllClick={() => setShowViewAll('labour')}
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className={`${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-gray-500">Available Orders</CardDescription>
              <CardTitle className="text-[#2563EB]">{availableOrders.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className={`${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-gray-500">Accepted Orders</CardDescription>
              <CardTitle className="text-[#2563EB]">{acceptedOrders.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className={`${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-gray-500">Hired Labour</CardDescription>
              <CardTitle className="text-[#2563EB]">{hiredLabour.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className={`${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-gray-500">Total Earnings</CardDescription>
              <CardTitle className="text-[#2563EB]">
                PKR {acceptedOrders.reduce((sum, o) => sum + o.escrowStatus.released, 0).toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Hired Labour Section */}
        <Card className={`mb-6 ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader className="pb-3">
            <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Hired Labour</CardTitle>
            <CardDescription className="text-sm text-gray-400">Your current workforce</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {hiredLabour.map(labour => (
                <div 
                  key={labour.id} 
                  onClick={() => {
                    const profileUser = {
                      id: labour.id,
                      name: labour.name,
                      type: 'labour',
                      email: `${labour.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
                      phone: '+92 300 1234567',
                      verified: true,
                      rating: labour.rating,
                      totalReviews: 45,
                      skills: [labour.skill],
                    };
                    setSelectedProfileUser(profileUser);
                    setShowProfile(true);
                  }}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${isDarkMode ? 'bg-[#1a1f2e] border-gray-700 hover:border-[#2563EB]' : 'bg-gray-50 border-gray-200 hover:border-[#2563EB]'}`}
                >
                  <div className="size-10 rounded-full bg-[#2563EB] flex items-center justify-center">
                    <HardHat className="size-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>{labour.name}</div>
                    <div className="text-xs text-gray-400">{labour.skill}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="size-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-400">{labour.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className={`flex gap-6 mb-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {['available', 'accepted', 'completed', 'labour'].map(tab => {
            const newApplicants = tab === 'labour'
              ? labourOrders.reduce((sum, o) => sum + (o.applicants||[]).filter(a => a.status === 'pending').length, 0)
              : 0;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 border-b-2 transition-colors capitalize flex items-center gap-1 ${
                  activeTab === tab
                    ? 'border-[#2563EB] text-[#2563EB]'
                    : isDarkMode ? 'border-transparent text-gray-400 hover:text-[#2563EB]' : 'border-transparent text-gray-500 hover:text-[#2563EB]'
                }`}
              >
                {tab === 'available' ? 'Available Orders' : tab === 'accepted' ? 'Accepted Orders' : tab === 'completed' ? 'Completed' : 'Labour Orders'}
                {newApplicants > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                    {newApplicants}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {getFilteredOrders().map(order => (
            <Card 
              key={order.id} 
              className={`hover:shadow-md transition-shadow cursor-pointer ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}
              onClick={() => setSelectedOrder(order)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{order.title}</CardTitle>
                      <Badge variant={
                        order.status === 'completed' ? 'default' : 
                        order.status === 'in-progress' ? 'secondary' : 
                        'outline'
                      } className={
                        order.status === 'completed' ? 'bg-green-600/20 text-green-400 border-green-600/30' : 
                        order.status === 'in-progress' ? 'bg-teal-600/20 text-teal-400 border-teal-600/30' : 
                        isDarkMode ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-100 text-gray-600 border-gray-300'
                      }>
                        {order.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm text-gray-400">{order.description}</CardDescription>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-[#2563EB]">PKR {order.budget.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Budget</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Package className="size-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">Quantity</div>
                        <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{order.quantity} units</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">Deadline</div>
                        <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{new Date(order.deadline).toLocaleDateString()}</div>
                      </div>
                    </div>
                    {order.escrowStatus.deposited > 0 && (
                      <div className="flex items-center gap-2">
                        <Wallet className="size-4 text-gray-400" />
                        <div>
                          <div className="text-xs text-gray-500">Received</div>
                          <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            PKR {(escrowMap[order.id]?.advanceReleased
                              ? escrowMap[order.id]?.advanceAmount
                              : order.escrowStatus.released
                            ).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {activeTab === 'available' && (
                    <Button onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrder(order);
                      setShowAcceptOrder(true);
                    }} className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white">
                      Accept Order
                    </Button>
                  )}
                  {activeTab === 'accepted' && escrowMap[order.id]?.status === 'paid' && !escrowMap[order.id]?.advanceReleased && (
                    <Button
                      onClick={(e) => { e.stopPropagation(); handleReleaseAdvance(order); }}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm"
                    >
                      Claim 30% Advance
                    </Button>
                  )}
                  {activeTab === 'accepted' && escrowMap[order.id]?.advanceReleased && (
                    <Badge className="bg-green-500/10 text-green-600 border-green-500 text-xs">
                      30% Advance Received
                    </Badge>
                  )}
                  {activeTab === 'accepted' && escrowMap[order.id]?.advanceReleased && !escrowMap[order.id]?.delivered && (
                    <Button
                      onClick={(e) => { e.stopPropagation(); handleMarkDelivered(order); }}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                      ✅ Kaam Complete
                    </Button>
                  )}
                  {activeTab === 'accepted' && escrowMap[order.id]?.delivered && (
                    <Badge className="bg-blue-500/10 text-blue-600 border-blue-500 text-xs">Delivered</Badge>
                  )}
                  {activeTab === 'accepted' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setChatTarget({
                          id: order.client?.id,
                          name: order.client?.name || 'Client',
                          orderId: order.id,
                        });
                        setShowChat(true);
                      }}
                      className="text-[#2563EB] border-[#2563EB] hover:bg-[#2563EB]/10 text-sm ml-2"
                    >
                      💬 Chat
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {getFilteredOrders().length === 0 && activeTab !== 'labour' && (
            <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}>
              <CardContent className="py-12 text-center">
                <Package className="size-12 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">No orders found</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Labour Orders Tab */}
        {activeTab === 'labour' && (
          <div className="space-y-4">
            {labourOrders.length === 0 && (
              <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}>
                <CardContent className="py-12 text-center">
                  <HardHat className="size-12 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">Koi labour order nahi. "Post Labour Order" se post karein.</p>
                </CardContent>
              </Card>
            )}
            {labourOrders.map(order => (
              <Card key={order._id} className={isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{order.title}</CardTitle>
                        <Badge className={order.status === 'active' ? 'bg-green-500/20 text-green-400' : order.status === 'completed' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}>
                          {order.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm text-gray-400">
                        {(order.applicants || []).length} applicants · Budget: PKR {order.budget?.toLocaleString()}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setApplicationsOrder(order)} className="text-[#2563EB] border-[#2563EB] hover:bg-[#2563EB]/10">
                        <Users className="size-4 mr-1" /> View Applications
                      </Button>
                      {order.status === 'completed' && order.labourId && (
                        reviewedIds.has(String(order._id))
                          ? <Badge className="bg-green-500/20 text-green-400">✅ Reviewed</Badge>
                          : <Button size="sm" className="bg-[#2563EB] text-white" onClick={() => setReviewLabourTarget({ orderId: String(order._id), labourId: order.labourId?._id || order.labourId, labourName: order.labourId?.name || 'Labour' })}>
                              <Star className="size-4 mr-1" /> Review Labour
                            </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedOrder && !showAcceptOrder && (
        <OrderDetailsModal 
          order={selectedOrder}
          userType="manufacturer"
          onClose={() => setSelectedOrder(null)}
          onUpdate={(updates) => {
            handleUpdateAcceptedOrder(selectedOrder.id, updates);
            setSelectedOrder((current) => ({ ...current, ...updates }));
          }}
          onAccept={() => {
            handleAcceptOrder(selectedOrder);
            setSelectedOrder(null);
          }}
        />
      )}

      {showSearch && (
        <SearchModal 
          onClose={() => setShowSearch(false)}
          userType="manufacturer"
          currentUserId={user?.id}
        />
      )}

      {showProfile && (
        <ProfileModal 
          user={selectedProfileUser || user}
          onClose={() => {
            setShowProfile(false);
            setSelectedProfileUser(null);
          }}
          onChatClick={() => {
            setShowProfile(false);
            if (selectedProfileUser) setChatTarget({ id: selectedProfileUser.id, name: selectedProfileUser.name, orderId: `chat_${selectedProfileUser.id}` });
            setShowChat(true);
          }}
        />
      )}

      {showChat && (
        <ChatModule 
          currentUserId={user?.id || 'manufacturer_user'}
          currentUserName={user?.name || 'Manufacturer'}
          receiverId={chatTarget?.id || 'client_user'}
          receiverName={chatTarget?.name || 'Client'}
          orderId={chatTarget?.orderId || `chat_${user?.id || 'general'}`}
          onClose={() => { setShowChat(false); setChatTarget(null); }}
        />
      )}

      {/* ✅ FIX 3: Inbox modal now correctly rendered with valid currentUserId */}
      {showInbox && (
        <ChatInbox
          currentUserId={user?.id}
          onClose={() => setShowInbox(false)}
          onOpenChat={(conv) => {
            setChatTarget({
              id: conv.with?.id,
              name: conv.with?.name || 'User',
              orderId: conv.orderId,
            });
            setShowInbox(false);
            setShowChat(true);
          }}
        />
      )}

      {showHireLabour && (
        <HireLabourModal 
          onClose={() => setShowHireLabour(false)}
          onHire={(labourData) => {
            console.log('Hired labour:', labourData);
            setShowHireLabour(false);
          }}
        />
      )}

      {/* ✅ FIX 2: _id pass kiya, client name sahi, onAccept mein fetchOrders */}
      {showAcceptOrder && selectedOrder && (
        <AcceptOrderModal 
          order={{
            _id: selectedOrder._id || selectedOrder.id,
            title: selectedOrder.title,
            client: selectedOrder.client?.name || 'ABC Company',
            quantity: selectedOrder.quantity,
            deadline: selectedOrder.deadline,
            budget: selectedOrder.budget,
          }}
          onClose={() => {
            setShowAcceptOrder(false);
            setSelectedOrder(null);
          }}
          onAccept={() => {
            fetchOrders();
            // ✅ Open chat with this client right after accepting
            const clientId   = selectedOrder.client?.id   || selectedOrder.clientId || 'client_user';
            const clientName = selectedOrder.client?.name || 'Client';
            const orderId    = selectedOrder._id || selectedOrder.id;
            setChatTarget({ id: clientId, name: clientName, orderId });
            setShowAcceptOrder(false);
            setSelectedOrder(null);
            setShowChat(true);
          }}
        />
      )}

      {showNotifications && (
        <NotificationsModal onClose={() => setShowNotifications(false)} />
      )}

      {showEmail && (
        <EmailModal onClose={() => setShowEmail(false)} />
      )}

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} userType="manufacturer" />
      )}

      {showViewAll && (
        <ViewAllModal type={showViewAll} onClose={() => setShowViewAll(null)} currentUserId={user?.id} />
      )}

      {/* Post Labour Order Modal */}
      {showLabourOrderForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-xl p-6 space-y-4 ${isDarkMode ? 'bg-[#2A3642]' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>Post Labour Order</h3>
              <button onClick={() => setShowLabourOrderForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            {[
              { label: 'Job Title *', key: 'title', type: 'text', placeholder: 'e.g. Fabric Cutting - 500 pcs' },
              { label: 'Description', key: 'description', type: 'text', placeholder: 'Job details...' },
              { label: 'Budget (PKR) *', key: 'budget', type: 'number', placeholder: '0' },
              { label: 'Deadline *', key: 'deadline', type: 'date', placeholder: '' },
              { label: 'Quantity', key: 'quantity', type: 'number', placeholder: '1' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className={`text-sm mb-1 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}</label>
                <Input
                  type={type}
                  placeholder={placeholder}
                  value={labourOrderForm[key]}
                  onChange={e => setLabourOrderForm(p => ({ ...p, [key]: e.target.value }))}
                  className={isDarkMode ? 'bg-[#1F2933] border-gray-600 text-white' : ''}
                />
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowLabourOrderForm(false)}>Cancel</Button>
              <Button className="flex-1 bg-[#2563EB] text-white" onClick={submitLabourOrder} disabled={postingLabourOrder}>
                {postingLabourOrder ? 'Posting...' : 'Post Order'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showPostOrder && (
        <PostOrderModal
          onClose={() => setShowPostOrder(false)}
          onSubmit={handlePostOrder}
        />
      )}

      {/* Applications Modal */}
      {applicationsOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-[#2A3642]' : 'bg-white'}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Applications — {applicationsOrder.title}
              </h3>
              <button onClick={() => setApplicationsOrder(null)} className="text-gray-400 hover:text-gray-600"><X className="size-5" /></button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto divide-y divide-gray-700">
              {(!applicationsOrder.applicants || applicationsOrder.applicants.length === 0) ? (
                <div className="py-12 text-center text-gray-400">Koi applicant nahi abhi tak</div>
              ) : applicationsOrder.applicants.map((applicant, idx) => {
                // R_Back populate karta hai — labourId object ho sakta hai ya string
                const labourId  = applicant.labourId?._id || applicant.labourId || '';
                const labourName = applicant.labourId?.name || applicant.labourName || `Labour ${idx + 1}`;
                return (
                  <div key={String(labourId) || idx} className={`flex items-center justify-between px-5 py-4 ${isDarkMode ? '' : 'border-gray-100'}`}>
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-bold">
                        {labourName[0].toUpperCase()}
                      </div>
                      <div>
                        <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{labourName}</p>
                        <p className="text-xs text-gray-400">
                          Applied: {applicant.appliedAt ? new Date(applicant.appliedAt).toLocaleDateString() : '—'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {applicant.status === 'pending' && (
                        <>
                          <Button size="sm" className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
                            onClick={() => handleHireLabour(applicationsOrder, { ...applicant, labourId, labourName })}>
                            Hire
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-400 text-red-400 hover:bg-red-400/10"
                            onClick={() => handleRejectLabour(applicationsOrder, { ...applicant, labourId, labourName })}>
                            Reject
                          </Button>
                        </>
                      )}
                      {applicant.status === 'hired' && (
                        <>
                          <Badge className="bg-green-500/20 text-green-400">Hired</Badge>
                          <Button size="sm" variant="outline" className="text-[#2563EB] border-[#2563EB] hover:bg-[#2563EB]/10"
                            onClick={() => {
                              setChatTarget({ id: String(labourId), name: labourName, orderId: applicationsOrder._id || applicationsOrder.id });
                              setApplicationsOrder(null);
                              setShowChat(true);
                            }}>
                            💬 Chat
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-400 text-red-400 hover:bg-red-400/10"
                            onClick={() => handleRejectLabour(applicationsOrder, { ...applicant, labourId, labourName })}>
                            Reject
                          </Button>
                        </>
                      )}
                      {applicant.status === 'rejected' && <Badge className="bg-red-500/20 text-red-400">Rejected</Badge>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Review Labour Modal */}
      {reviewLabourTarget && (
        <ReviewSubmissionModal
          onClose={() => setReviewLabourTarget(null)}
          onSubmit={handleSubmitLabourReview}
          targetName={reviewLabourTarget.labourName}
          targetRole="labour"
          orderId={reviewLabourTarget.orderId}
        />
      )}
    </div>
  );
}
