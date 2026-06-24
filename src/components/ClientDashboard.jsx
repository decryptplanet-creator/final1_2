import { ChatInbox, useChatNotifications } from './ChatInbox';
import { NotificationCenter } from './NotificationCenter';
import { ToastContainer, useToast } from './Alerts&Notification';
import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/labelstatus';
import { Search, Plus, LogOut, Factory, HardHat, Star, Package, Clock, MessageSquare, Wallet, FileText, Bell, Sparkles, Settings, Mail, Filter, Shield, TrendingUp, MapPin } from 'lucide-react';
import { PostOrderModal } from './PostOrderModal';
import { OrderDetailsModal } from './OrderDetailsModal';
import { SearchModal } from './SearchModal';
import { ProfileModal } from './ProfileMangement';
import ChatModule from './ChatModule';
import { HorizontalProfiles } from './HorizontalProfiles';
import { NotificationsModal } from './NotificationsModal';
import { EmailModal } from './EmailModal(Optional)';
import { SettingsModal } from './SettingsModal';
import { ViewAllModal } from './ViewAllModal';
import { HireConfirmationModal } from './HireConfirmationModal';
import { EditProfileModal } from './EditProfileModal';
import { EscrowDemoPage } from './EscrowDemoPage';
import EscrowPage from './escrow/EscrowPage';
import { ReviewModal } from './ReviewModal';
import { IndividualProfile } from './IndividualProfile';
import { FilterModal } from './AdvancedFilterModal';
import { PaymentDetailsModal } from './PaymentDetailsModal';
import { PasswordChangeModal } from './PasswordChangeModal';
import { DeactivateAccountModal } from './DeactivateAccountModal';
import { OrderListModal } from './OrderListModal';
import { useTheme } from '../contexts/ThemeContext';

export function ClientDashboard({ user, onLogout }) {
  const { isDarkMode } = useTheme();
  const [showPostOrder, setShowPostOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showInbox, setShowInbox] = useState(false); // ✅ NEW
  const [selectedChat, setSelectedChat] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProfileUser, setSelectedProfileUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showEscrowDemo, setShowEscrowDemo] = useState(false);
  const [showEscrowPage, setShowEscrowPage] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showViewAll, setShowViewAll] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showHireConfirmation, setShowHireConfirmation] = useState(false);
  const [selectedLabour, setSelectedLabour] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [showManufacturerProfile, setShowManufacturerProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterType, setFilterType] = useState('manufacturer');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showOrderList, setShowOrderList] = useState(null);
  const [showReview, setShowReview] = useState(null);
  const [reviewedIds, setReviewedIds] = useState(new Set());
  const [releasingId, setReleasingId] = useState(null);

  const { unread: chatUnread, clearUnread } = useChatNotifications(user?.id || user?._id);
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5003';
  const getAuthHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token') || ''}` });

  const [escrowMap, setEscrowMap] = useState({});

  const fetchEscrow = useCallback(async (orderId) => {
    try {
      const res = await fetch(`${API_BASE}/api/escrow/order/${orderId}`, { headers: getAuthHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      setEscrowMap((prev) => ({ ...prev, [orderId]: data }));
    } catch (_) {}
  }, []); // eslint-disable-line

  const handleClientApproval = async (order) => {
    const escrow = escrowMap[order.id];
    if (!escrow) return alert('Escrow not found');
    try {
      const res = await fetch(`${API_BASE}/api/escrow/client-approval/${escrow._id}`, { method: 'PUT', headers: getAuthHeaders() });
      const data = await res.json();
      if (!res.ok) return alert(data.message);
      alert('Delivery approved! 70% payment will now be released to manufacturer.');
      fetchEscrow(order.id);
    } catch (err) { alert('Error: ' + err.message); }
  };

  const handleRelease70 = async (order) => {
    const escrow = escrowMap[order.id];
    if (!escrow) return alert('Escrow not found');
    setReleasingId(escrow._id);
    try {
      const res = await fetch(`${API_BASE}/api/escrow/release/remaining/${escrow._id}`, { method: 'PUT', headers: getAuthHeaders() });
      const data = await res.json();
      if (!res.ok) return alert(data.message);
      alert(`70% (PKR ${escrow.remainingAmount}) manufacturer ko release ho gaya!`);
      fetchEscrow(order.id);
      if (order.manufacturer?.id) {
        setShowReview({ orderId: order.id, manufacturerId: order.manufacturer.id, manufacturerName: order.manufacturer.name });
      }
    } catch (err) { alert('Error: ' + err.message); }
    finally { setReleasingId(null); }
  };

  const [orders, setOrders] = useState([]);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/client`, { headers: getAuthHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      const normalized = data.map(o => ({
        ...o,
        id: o._id,
        budget: o.budget,
        totalAmount: o.budget,
        advanceAmount: Math.round(o.budget * 0.3),
        manufacturer: o.manufacturerId ? {
          id: o.manufacturerId._id,
          name: o.manufacturerId.companyName || o.manufacturerId.name,
        } : null,
        escrowStatus: { total: o.budget, deposited: 0, released: 0 },
      }));
      setOrders(normalized);
      // fetchEscrow calls disabled — backend escrow route not available yet
      // normalized.forEach(o => fetchEscrow(o.id));
    } catch (_) {}
  }, []); // eslint-disable-line

  const handlePostOrder = async (orderData) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST', headers: getAuthHeaders(),
        body: JSON.stringify({ title: orderData.title, description: orderData.description, category: orderData.category, quantity: orderData.quantity, budget: orderData.budget, deadline: orderData.deadline, specifications: orderData.specifications }),
      });
      const created = await res.json();
      if (!res.ok) return alert(created.error || created.message || 'Failed to create order');
      const newOrder = { ...created, id: created._id, clientId: created.clientId || user?.id || user?._id, totalAmount: created.budget, advanceAmount: Math.round(created.budget * 0.3), manufacturer: null, escrowStatus: { total: created.budget, deposited: 0, released: 0 } };
      setOrders(prev => [newOrder, ...prev]);
      setSelectedOrder(newOrder);
      setShowPostOrder(false);
      setShowEscrowPage(true);
    } catch (err) { alert('Error: ' + err.message); }
  };

  const handleUpdateOrder = (orderId, updates) => {
    setOrders(orders.map(order => order.id === orderId ? { ...order, ...updates } : order));
  };

  useEffect(() => { fetchOrders(); }, []); // eslint-disable-line

  const handleEscrowPaymentSuccess = () => { setShowEscrowPage(false); fetchOrders(); };
  const getCurrentUserId = () => user.id || user._id || currentUser?.id || currentUser?._id || 'client_user';

  const openChat = ({ receiverId, receiverName, orderId } = {}) => {
    setSelectedChat({ receiverId: receiverId || 'support', receiverName: receiverName || 'Skillora Support', orderId: orderId || `general_${getCurrentUserId()}` });
    setShowChat(true);
  };

  const openChatWithProfile = (profile) => {
    openChat({ receiverId: profile?.id || profile?._id, receiverName: profile?.name || 'Manufacturer', orderId: `profile_${profile?.id || profile?._id || 'general'}` });
  };

  const openChatForOrder = (order) => {
    openChat({ receiverId: order.manufacturer?.id, receiverName: order.manufacturer?.name || 'Manufacturer', orderId: order.id });
  };

  const getFilteredOrders = () => {
    if (activeTab === 'pending') return orders.filter(o => o.status === 'pending');
    if (activeTab === 'in-progress') return orders.filter(o => o.status === 'in-progress');
    if (activeTab === 'completed') return orders.filter(o => o.status === 'completed');
    if (activeTab === 'disputed') return orders.filter(o => o.status === 'disputed');
    return orders;
  };

  if (showEscrowPage && selectedOrder) {
    return <EscrowPage orderData={selectedOrder} onClose={() => setShowEscrowPage(false)} onPaymentSuccess={handleEscrowPaymentSuccess} />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1F2933]' : 'bg-[#F9FAFB]'}`}>
      <header className={`border-b ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded bg-[#2563EB] flex items-center justify-center"><Sparkles className="size-5 text-white" /></div>
                <span className="text-2xl font-medium text-[#2563EB]">Skillora</span>
              </div>
              <div className={`hidden md:block h-6 w-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
              <div className="hidden md:block">
                <div className={`text-sm ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{user.name}</div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Client Dashboard</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setShowNotifications(true)} className="text-[#2563EB] hover:bg-[#2563EB]/10 relative">
                <Bell className="size-5" />
              </Button>
              <Button variant="ghost" onClick={() => setShowEscrowDemo(true)} className="text-[#2563EB] hover:bg-[#2563EB]/10">
                <Shield className="size-4 mr-2" /> Open Escrow
              </Button>
              {/* ✅ MessageSquare opens Inbox now */}
              <Button variant="ghost" size="icon" onClick={() => { setShowInbox(true); clearUnread(); }} title="Messages" className="text-[#2563EB] hover:bg-[#2563EB]/10 relative">
                <MessageSquare className="size-5" />
                {chatUnread > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{chatUnread}</span>}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} className="text-[#2563EB] hover:bg-[#2563EB]/10"><Settings className="size-5" /></Button>
              <Button variant="ghost" onClick={() => setShowProfile(true)} className={`${isDarkMode ? 'text-[#F9FAFB] hover:bg-gray-700' : 'text-[#1F2933] hover:bg-gray-100'}`}>Profile</Button>
              <Button variant="outline" onClick={onLogout} className={`${isDarkMode ? 'border-gray-600 text-[#F9FAFB] hover:bg-gray-700' : 'border-gray-300 text-[#1F2933] hover:bg-gray-100'}`}>
                <LogOut className="size-4 mr-2" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-4 mb-6 items-center">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 size-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <Input placeholder="Search for manufacturers" className={`pl-10 ${isDarkMode ? 'bg-[#2A3642] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`} onClick={() => setShowSearch(true)} />
          </div>
          <Button onClick={() => setShowPostOrder(true)} className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white opacity-100 shadow-lg">
            <Plus className="size-4 mr-2" /> Post New Order
          </Button>
        </div>

        <HorizontalProfiles userType="client"
          onProfileClick={(profile) => { setSelectedProfileUser({ id: profile.id, name: profile.name, type: profile.type, email: `${profile.name.toLowerCase().replace(/\s+/g, '.')}@example.com`, phone: '+92 300 1234567', verified: profile.verified, rating: profile.rating, totalReviews: 23, skills: profile.specialty ? [profile.specialty] : [] }); setShowProfile(true); }}
          onChatClick={openChatWithProfile}
          onViewAllClick={() => setShowViewAll('manufacturer')}
        />

        <div className="flex items-center gap-3 mb-6">
          {[{ key: 'verified', icon: Shield, label: 'Verified Only' }, { key: 'top-rated', icon: TrendingUp, label: 'Top Rated' }, { key: 'nearby', icon: MapPin, label: 'Nearby' }].map(({ key, icon: Icon, label }) => (
            <button key={key} onClick={() => { setActiveFilter(key); setShowViewAll('manufacturer'); }} className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${activeFilter === key ? 'bg-[#2563EB] text-white' : 'bg-white border border-gray-300 text-[#1F2933] hover:bg-gray-50'}`}>
              <Icon className="size-4" /> {label}
            </button>
          ))}
        </div>

        <Card className="border bg-white border-gray-200 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1F2933]"><Factory className="size-5 text-[#2563EB]" />Verified Manufacturers</CardTitle>
            <CardDescription className="text-gray-500">Top-rated manufacturers for your needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[{ id: '1', name: 'ABC Textiles', specialty: 'Cotton Products', rating: 4.8, verified: true, projects: 45 }, { id: '2', name: 'Premium Leather Co.', specialty: 'Leather Goods', rating: 4.9, verified: true, projects: 38 }, { id: '3', name: 'Quality Garments', specialty: 'Garment Manufacturing', rating: 4.7, verified: true, projects: 52 }].map((m) => (
                <div key={m.id} onClick={() => { setSelectedProfileUser({ ...m, type: 'manufacturer', skills: [m.specialty], totalReviews: m.projects }); setShowProfile(true); }} className="p-4 rounded-lg border cursor-pointer transition-all bg-white border-gray-200 hover:border-[#2563EB] hover:shadow-md">
                  <div className="flex items-start justify-between mb-2">
                    <div className="size-12 rounded-full bg-[#2563EB] flex items-center justify-center"><Factory className="size-6 text-white" /></div>
                    {m.verified && <Shield className="size-4 text-[#2563EB]" />}
                  </div>
                  <h3 className="font-medium mb-1 text-[#1F2933]">{m.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{m.specialty}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1"><Star className="size-4 fill-[#2563EB] text-[#2563EB]" /><span className="text-sm text-[#1F2933]">{m.rating}</span></div>
                    <Badge variant="outline" className="bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/30">{m.projects} Projects</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[{ label: 'Total Orders', value: orders.length }, { label: 'Active Orders', value: orders.filter(o => o.status === 'in-progress').length }, { label: 'Completed', value: orders.filter(o => o.status === 'completed').length }, { label: 'In Escrow', value: `PKR ${orders.reduce((sum, o) => sum + o.escrowStatus.deposited, 0).toLocaleString()}` }].map(({ label, value }) => (
            <Card key={label} className="bg-white border-gray-200">
              <CardHeader className="pb-2"><CardDescription className="text-xs text-gray-500">{label}</CardDescription><CardTitle className="text-[#2563EB]">{value}</CardTitle></CardHeader>
            </Card>
          ))}
        </div>

        <div className="flex gap-6 mb-6 border-b border-gray-200">
          {['all', 'pending', 'in-progress', 'completed', 'disputed'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 px-1 border-b-2 capitalize transition-colors ${activeTab === tab ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-gray-500 hover:text-[#2563EB]'}`}>
              {tab === 'all' ? 'All Orders' : tab}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {getFilteredOrders().map(order => (
            <Card key={order.id} className="hover:shadow-md transition-shadow bg-white border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg text-[#1F2933]">{order.title}</CardTitle>
                      <Badge className={order.status === 'completed' ? 'bg-[#2563EB]/20 text-[#2563EB] border-[#2563EB]/30' : order.status === 'in-progress' ? 'bg-[#2563EB]/20 text-[#2563EB] border-[#2563EB]/30' : order.status === 'disputed' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-100 text-gray-600 border-gray-300'}>{order.status}</Badge>
                    </div>
                    <CardDescription className="text-sm text-gray-500">{order.description}</CardDescription>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-[#2563EB] font-medium">PKR {order.budget.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Budget</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2"><Package className="size-4 text-gray-400" /><div><div className="text-xs text-gray-500">Quantity</div><div className="text-[#1F2933]">{order.quantity} units</div></div></div>
                  <div className="flex items-center gap-2"><Clock className="size-4 text-gray-400" /><div><div className="text-xs text-gray-500">Deadline</div><div className="text-[#1F2933]">{new Date(order.deadline).toLocaleDateString()}</div></div></div>
                  {order.manufacturer && <div className="flex items-center gap-2"><Factory className="size-4 text-gray-400" /><div><div className="text-xs text-gray-500">Manufacturer</div><div className="flex items-center gap-1"><span className="text-[#1F2933]">{order.manufacturer.name}</span></div></div></div>}
                  <div className="flex items-center gap-2"><Wallet className="size-4 text-gray-400" /><div><div className="text-xs text-gray-500">Escrow</div><div className="text-[#1F2933]">PKR {(escrowMap[order.id]?.totalAmount ?? order.escrowStatus.deposited).toLocaleString()}{escrowMap[order.id]?.status && <span className="ml-1 text-xs text-gray-400">({escrowMap[order.id].status})</span>}</div></div></div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-gray-200">
                  <Button variant="outline" className="flex-1 border-gray-300 text-[#1F2933] hover:bg-gray-50" onClick={() => setSelectedOrder(order)}><FileText className="size-4 mr-2" />View Details</Button>
                  {order.status === 'in-progress' && (!escrowMap[order.id] || ['pending', 'awaiting_payment'].includes(escrowMap[order.id]?.status)) && (
                    <Button className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white" onClick={() => { setSelectedOrder(order); setShowEscrowPage(true); }}>Pay via Stripe</Button>
                  )}
                  {escrowMap[order.id]?.advanceReleased && !escrowMap[order.id]?.clientApproved && (
                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => handleClientApproval(order)}>Approve Delivery</Button>
                  )}
                  {escrowMap[order.id]?.clientApproved && !escrowMap[order.id]?.remainingReleased && (
                    <Button className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white" disabled={releasingId === escrowMap[order.id]?._id} onClick={() => handleRelease70(order)}>
                      {releasingId === escrowMap[order.id]?._id ? 'Releasing...' : 'Release 70%'}
                    </Button>
                  )}
                  {escrowMap[order.id]?.remainingReleased && <Badge className="bg-green-500/10 text-green-600 border-green-500 px-3 py-1 text-xs">Order Complete</Badge>}
                  {escrowMap[order.id]?.clientApproved && <Badge className="bg-green-500/10 text-green-600 border-green-500 px-3 py-1 text-xs">Delivery Approved</Badge>}
                  {order.manufacturer && (
                    <Button variant="outline" className="flex-1 border-gray-300 text-[#1F2933] hover:bg-gray-50" onClick={() => openChatForOrder(order)}>
                      <MessageSquare className="size-4 mr-2" />Chat
                    </Button>
                  )}
                  {escrowMap[order.id]?.remainingReleased && order.manufacturer?.id && (
                    reviewedIds.has(order.id)
                      ? <Badge className="bg-green-500/10 text-green-600 border-green-500 px-3 py-1 text-xs">✅ Reviewed</Badge>
                      : <Button className="bg-yellow-500 hover:bg-yellow-600 text-white" onClick={() => setShowReview({ orderId: order.id, manufacturerId: order.manufacturer.id, manufacturerName: order.manufacturer.name })}>Leave Review</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {showPostOrder && <PostOrderModal onClose={() => setShowPostOrder(false)} onSubmit={handlePostOrder} />}
      {selectedOrder && <OrderDetailsModal order={selectedOrder} userType="client" onClose={() => setSelectedOrder(null)} onUpdate={(updates) => { handleUpdateOrder(selectedOrder.id, updates); setSelectedOrder((current) => ({ ...current, ...updates })); }} />}
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} userType="client" currentUserId={user?.id} />}
      {showProfile && <ProfileModal user={selectedProfileUser || user} onClose={() => { setShowProfile(false); setSelectedProfileUser(null); }} onChatClick={() => { setShowProfile(false); openChatWithProfile(selectedProfileUser || user); }} />}
      {showChat && <ChatModule currentUserId={getCurrentUserId()} currentUserName={user?.name || currentUser?.name || 'Client'} receiverId={selectedChat?.receiverId} receiverName={selectedChat?.receiverName} orderId={selectedChat?.orderId} onClose={() => { setShowChat(false); setSelectedChat(null); }} />}
      {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
      {showEmail && <EmailModal onClose={() => setShowEmail(false)} />}
      {showEscrowDemo && <EscrowDemoPage onClose={() => setShowEscrowDemo(false)} />}
      {showEscrowPage && selectedOrder && <EscrowPage orderData={selectedOrder} onClose={() => setShowEscrowPage(false)} onPaymentSuccess={handleEscrowPaymentSuccess} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} userType="client" />}
      {showViewAll && <ViewAllModal type={showViewAll} onClose={() => setShowViewAll(null)} activeFilter={activeFilter} onFilterChange={setActiveFilter} onProfileClick={(i) => { setSelectedProfileUser(i); setShowProfile(true); }} currentUserId={user?.id} />}
      {showReview && <ReviewModal revieweeId={showReview.manufacturerId} revieweeName={showReview.manufacturerName} onClose={() => setShowReview(null)} onReviewed={() => { setReviewedIds(prev => new Set([...prev, showReview.orderId])); setShowReview(null); fetchOrders(); }} />}
      {/* ✅ ChatInbox Modal */}
      {showInbox && (
        <ChatInbox
          currentUserId={getCurrentUserId()}
          onClose={() => setShowInbox(false)}
          onOpenChat={(conv) => {
            openChat({ receiverId: conv.with?.id, receiverName: conv.with?.name, orderId: conv.orderId });
            setShowInbox(false);
          }}
        />
      )}
    </div>
  );
}
