import { NotificationCenter } from './NotificationCenter';
import { ToastContainer, useToast } from './Alerts&Notification';
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/labelstatus';
import { 
  Search, 
  Plus, 
  LogOut, 
  Factory, 
  HardHat, 
  Star, 
  Package, 
  Clock,
  MessageSquare,
  Wallet,
  FileText,
  Bell,
  Sparkles,
  Settings,
  Mail,
  Filter,
  Shield,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { PostOrderModal } from './PostOrderModal';
import { OrderDetailsModal } from './OrderDetailsModal';
import { SearchModal } from './SearchModal';
import { ProfileModal } from './ProfileMangement';
import { ChatModal } from './ChatModal';
import { HorizontalProfiles } from './HorizontalProfiles';
import { NotificationsModal } from './NotificationsModal';
import { EmailModal } from './EmailModal(Optional)';
import { SettingsModal } from './SettingsModal';
import { ViewAllModal } from './ViewAllModal';
import { HireConfirmationModal } from './HireConfirmationModal';
import { EditProfileModal } from './EditProfileModal';
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
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProfileUser, setSelectedProfileUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
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

  const [orders, setOrders] = useState([
    {
      id: '1',
      title: 'Cotton Shirts Manufacturing',
      description: 'Need 500 cotton shirts, size M-XL',
      quantity: 500,
      budget: 250000,
      deadline: '2025-12-20',
      status: 'in-progress',
      manufacturer: { id: 'm1', name: 'ABC Textiles', rating: 4.5 },
      escrowStatus: { total: 250000, deposited: 250000, released: 75000 }
    },
    {
      id: '2',
      title: 'Leather Bags Production',
      description: 'Premium leather bags, 200 units',
      quantity: 200,
      budget: 400000,
      deadline: '2025-12-25',
      status: 'pending',
      escrowStatus: { total: 400000, deposited: 0, released: 0 }
    },
    {
      id: '3',
      title: 'Sports Equipment Manufacturing',
      description: 'High-quality football and cricket equipment - 300 units',
      quantity: 300,
      budget: 350000,
      deadline: '2025-12-30',
      status: 'in-progress',
      manufacturer: { id: 'm2', name: 'Sialkot Sports Ltd', rating: 4.8 },
      escrowStatus: { total: 350000, deposited: 350000, released: 105000 }
    }
  ]);

  const handlePostOrder = (orderData) => {
    const newOrder = {
      id: Math.random().toString(36).substr(2, 9),
      title: orderData.title || '',
      description: orderData.description || '',
      quantity: orderData.quantity || 0,
      budget: orderData.budget || 0,
      deadline: orderData.deadline || '',
      status: 'pending',
      escrowStatus: { total: orderData.budget || 0, deposited: 0, released: 0 }
    };
    setOrders([newOrder, ...orders]);
    setShowPostOrder(false);
  };

  const handleUpdateOrder = (orderId, updates) => {
    setOrders(orders.map(order => order.id === orderId ? { ...order, ...updates } : order));
  };

  const getFilteredOrders = () => {
    if (activeTab === 'pending') return orders.filter(o => o.status === 'pending');
    if (activeTab === 'in-progress') return orders.filter(o => o.status === 'in-progress');
    if (activeTab === 'completed') return orders.filter(o => o.status === 'completed');
    return orders;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1F2933]' : 'bg-[#F9FAFB]'}`}>
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
              <div className={`hidden md:block h-6 w-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
              <div className="hidden md:block">
                <div className={`text-sm ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{user.name}</div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Client Dashboard</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <NotificationCenter userType="client" />

              <Button variant="ghost" size="icon" onClick={() => setShowEmail(true)} title="Email" className="text-[#2563EB] hover:bg-[#2563EB]/10">
                <Mail className="size-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowChat(true)} title="Messages" className="text-[#2563EB] hover:bg-[#2563EB]/10">
                <MessageSquare className="size-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} title="Settings" className="text-[#2563EB] hover:bg-[#2563EB]/10">
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
        <div className="flex gap-4 mb-6 items-center">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 size-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <Input 
              placeholder="Search for manufacturers" 
              className={`pl-10 ${isDarkMode ? 'bg-[#2A3642] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
              onClick={() => setShowSearch(true)}
            />
          </div>
          
          <Button 
            onClick={() => setShowPostOrder(true)} 
            className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white opacity-100 shadow-lg"
          >
            <Plus className="size-4 mr-2" />
            Post New Order
          </Button>
        </div>

        <HorizontalProfiles 
          userType="client" 
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
          onChatClick={() => setShowChat(true)}
          onViewAllClick={() => setShowViewAll('manufacturer')}
        />

        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => {
              setActiveFilter('verified');
              setShowViewAll('manufacturer');
            }}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeFilter === 'verified'
                ? 'bg-[#2563EB] text-white'
                : 'bg-white border border-gray-300 text-[#1F2933] hover:bg-gray-50'
            }`}
          >
            <Shield className="size-4" />
            Verified Only
          </button>
          <button
            onClick={() => {
              setActiveFilter('top-rated');
              setShowViewAll('manufacturer');
            }}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeFilter === 'top-rated'
                ? 'bg-[#2563EB] text-white'
                : 'bg-white border border-gray-300 text-[#1F2933] hover:bg-gray-50'
            }`}
          >
            <TrendingUp className="size-4" />
            Top Rated
          </button>
          <button
            onClick={() => {
              setActiveFilter('nearby');
              setShowViewAll('manufacturer');
            }}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeFilter === 'nearby'
                ? 'bg-[#2563EB] text-white'
                : 'bg-white border border-gray-300 text-[#1F2933] hover:bg-gray-50'
            }`}
          >
            <MapPin className="size-4" />
            Nearby
          </button>
        </div>

        <Card className="border bg-white border-gray-200 mb-6">
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2 text-[#1F2933]">
                <Factory className="size-5 text-[#2563EB]" />
                Verified Manufacturers
              </CardTitle>
              <CardDescription className="text-gray-500">Top-rated manufacturers for your needs</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: '1', name: 'ABC Textiles', specialty: 'Cotton Products', rating: 4.8, verified: true, projects: 45 },
                { id: '2', name: 'Premium Leather Co.', specialty: 'Leather Goods', rating: 4.9, verified: true, projects: 38 },
                { id: '3', name: 'Quality Garments', specialty: 'Garment Manufacturing', rating: 4.7, verified: true, projects: 52 },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedProfileUser({ ...m, type: 'manufacturer', skills: [m.specialty], totalReviews: m.projects });
                    setShowProfile(true);
                  }}
                  className="p-4 rounded-lg border cursor-pointer transition-all bg-white border-gray-200 hover:border-[#2563EB] hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="size-12 rounded-full bg-[#2563EB] flex items-center justify-center">
                      <Factory className="size-6 text-white" />
                    </div>
                    {m.verified && <Shield className="size-4 text-[#2563EB]" />}
                  </div>
                  <h3 className="font-medium mb-1 text-[#1F2933]">{m.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{m.specialty}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="size-4 fill-[#2563EB] text-[#2563EB]" />
                      <span className="text-sm text-[#1F2933]">{m.rating}</span>
                    </div>
                    <Badge variant="outline" className="bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/30">
                      {m.projects} Projects
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-gray-500">Total Orders</CardDescription>
              <CardTitle className="text-[#2563EB]">{orders.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-gray-500">Active Orders</CardDescription>
              <CardTitle className="text-[#2563EB]">{orders.filter(o => o.status === 'in-progress').length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-gray-500">Completed</CardDescription>
              <CardTitle className="text-[#2563EB]">{orders.filter(o => o.status === 'completed').length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-gray-500">In Escrow</CardDescription>
              <CardTitle className="text-[#2563EB]">
                PKR {orders.reduce((sum, o) => sum + o.escrowStatus.deposited, 0).toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="flex gap-6 mb-6 border-b border-gray-200">
          {['all', 'pending', 'in-progress', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 border-b-2 capitalize transition-colors ${
                activeTab === tab ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-gray-500 hover:text-[#2563EB]'
              }`}
            >
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
                      <Badge className={
                        order.status === 'completed' ? 'bg-[#2563EB]/20 text-[#2563EB] border-[#2563EB]/30' : 
                        order.status === 'in-progress' ? 'bg-[#2563EB]/20 text-[#2563EB] border-[#2563EB]/30' : 
                        'bg-gray-100 text-gray-600 border-gray-300'
                      }>
                        {order.status}
                      </Badge>
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
                  <div className="flex items-center gap-2">
                    <Package className="size-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Quantity</div>
                      <div className="text-[#1F2933]">{order.quantity} units</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Deadline</div>
                      <div className="text-[#1F2933]">{new Date(order.deadline).toLocaleDateString()}</div>
                    </div>
                  </div>
                  {order.manufacturer && (
                    <div className="flex items-center gap-2">
                      <Factory className="size-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">Manufacturer</div>
                        <div className="flex items-center gap-1">
                          <span className="text-[#1F2933]">{order.manufacturer.name}</span>
                          <Star className="size-3 fill-[#2563EB] text-[#2563EB]" />
                          <span className="text-xs text-gray-500">{order.manufacturer.rating}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Wallet className="size-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Escrow</div>
                      <div className="text-[#1F2933]">PKR {order.escrowStatus.deposited.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-gray-300 text-[#1F2933] hover:bg-gray-50"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <FileText className="size-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {showPostOrder && <PostOrderModal onClose={() => setShowPostOrder(false)} onSubmit={handlePostOrder} />}
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          userType="client" 
          onClose={() => setSelectedOrder(null)} 
          onUpdate={(u) => { handleUpdateOrder(selectedOrder.id, u); setSelectedOrder(null); }} 
        />
      )}
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} userType="client" />}
      {showProfile && (
        <ProfileModal 
          user={selectedProfileUser || user} 
          onClose={() => { setShowProfile(false); setSelectedProfileUser(null); }} 
          onChatClick={() => { setShowProfile(false); setShowChat(true); }} 
        />
      )}
      {showChat && <ChatModal onClose={() => setShowChat(false)} />}
      {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
      {showEmail && <EmailModal onClose={() => setShowEmail(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} userType="client" />}
      {showViewAll && (
        <ViewAllModal 
          type={showViewAll} 
          onClose={() => setShowViewAll(null)} 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
          onProfileClick={(i) => { setSelectedProfileUser(i); setShowProfile(true); }} 
        />
      )}
    </div>
  );
}


/*This file is the Client Dashboard, used to manage orders, interactions, and client activities within the platform.
It is a web-based file, not used for mobile apps.*/