import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/labelstatus';
import { Sparkles, MessageSquare, Bell, LogOut, Search, HardHat, Star, Package, Clock, Wallet, Settings, Mail, Filter, Shield, TrendingUp, MapPin, Factory } from 'lucide-react';
import { OrderDetailsModal } from './OrderDetailsModal';
import { SearchModal } from './SearchModal';
import { ProfileModal } from './ProfileMangement';
import { ChatModal } from './ChatModal';
import { HireLabourModal } from './HireLabourModal';
import { HorizontalProfiles } from './HorizontalProfiles';
import { AcceptOrderModal } from './AcceptOrderModal';
import { NotificationsModal } from './NotificationsModal';
import { EmailModal } from './EmailModal(Optional)';
import { SettingsModal } from './SettingsModal';
import { ViewAllModal } from './ViewAllModal';
import { useTheme } from '../contexts/ThemeContext';

export function ManufacturerDashboard({ user, onLogout }) {
  const { isDarkMode } = useTheme();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showHireLabour, setShowHireLabour] = useState(false);
  const [showAcceptOrder, setShowAcceptOrder] = useState(false);
  const [activeTab, setActiveTab] = useState('available');
  const [selectedProfileUser, setSelectedProfileUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showViewAll, setShowViewAll] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const [availableOrders] = useState([
    {
      id: '1',
      title: 'Cotton Shirts Manufacturing',
      description: 'Need 500 cotton shirts, size M-XL, premium quality cotton',
      quantity: 500,
      budget: 250000,
      deadline: '2025-12-20',
      status: 'pending',
      escrowStatus: {
        total: 250000,
        deposited: 0,
        released: 0,
      }
    },
    {
      id: '2',
      title: 'Leather Bags Production',
      description: 'Premium leather bags, 200 units, custom design',
      quantity: 200,
      budget: 400000,
      deadline: '2025-12-25',
      status: 'pending',
      escrowStatus: {
        total: 400000,
        deposited: 0,
        released: 0,
      }
    },
    {
      id: '3',
      title: 'Wooden Furniture Set',
      description: '50 dining table sets with chairs',
      quantity: 50,
      budget: 500000,
      deadline: '2025-12-30',
      status: 'pending',
      escrowStatus: {
        total: 500000,
        deposited: 0,
        released: 0,
      }
    }
  ]);

  const [acceptedOrders, setAcceptedOrders] = useState([
    {
      id: 'a1',
      title: 'Sports Shoes Production',
      description: '1000 pairs of athletic shoes',
      quantity: 1000,
      budget: 800000,
      deadline: '2025-12-18',
      status: 'in-progress',
      manufacturer: {
        id: user.id,
        name: user.name,
        rating: user.rating,
      },
      escrowStatus: {
        total: 800000,
        deposited: 800000,
        released: 240000,
      }
    }
  ]);

  const [hiredLabour] = useState([
    { id: 'l1', name: 'Ahmed Khan', skill: 'Stitching', rate: 600, rating: 4.8 },
    { id: 'l2', name: 'Ali Raza', skill: 'Cutting', rate: 550, rating: 4.6 },
  ]);

  const handleAcceptOrder = (order) => {
    const updatedOrder = { 
      ...order, 
      status: 'in-progress',
      manufacturer: {
        id: user.id,
        name: user.name,
        rating: user.rating,
      }
    };
    setAcceptedOrders([...acceptedOrders, updatedOrder]);
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
                <div className="text-xs text-gray-500">Manufacturer Dashboard</div>
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

        {/* Instagram-style Horizontal Profiles */}
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

        {/* Tabs - Alibaba style */}
        <div className={`flex gap-6 mb-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={() => setActiveTab('available')}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'available' 
                ? 'border-[#2563EB] text-[#2563EB]' 
                : isDarkMode ? 'border-transparent text-gray-400 hover:text-[#2563EB]' : 'border-transparent text-gray-500 hover:text-[#2563EB]'
            }`}
          >
            Available Orders
          </button>
          <button
            onClick={() => setActiveTab('accepted')}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'accepted' 
                ? 'border-[#2563EB] text-[#2563EB]' 
                : isDarkMode ? 'border-transparent text-gray-400 hover:text-[#2563EB]' : 'border-transparent text-gray-500 hover:text-[#2563EB]'
            }`}
          >
            Accepted Orders
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
                    <div className="text-[#2563EB]">
                      PKR {order.budget.toLocaleString()}
                    </div>
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
                          <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>PKR {order.escrowStatus.released.toLocaleString()}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  {activeTab === 'available' && (
                    <Button onClick={(e) => {
                      e.stopPropagation();
                      setShowAcceptOrder(true);
                      setSelectedOrder(order);
                    }} className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white">
                      Accept Order
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {getFilteredOrders().length === 0 && (
            <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}>
              <CardContent className="py-12 text-center">
                <Package className="size-12 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">No orders found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder}
          userType="manufacturer"
          onClose={() => setSelectedOrder(null)}
          onUpdate={() => setSelectedOrder(null)}
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
            setShowChat(true);
          }}
        />
      )}

      {showChat && (
        <ChatModal 
          onClose={() => setShowChat(false)}
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

      {showAcceptOrder && selectedOrder && (
        <AcceptOrderModal 
          order={{
            title: selectedOrder.title,
            client: 'ABC Company',
            quantity: selectedOrder.quantity,
            deadline: selectedOrder.deadline,
            budget: selectedOrder.budget
          }}
          onClose={() => {
            setShowAcceptOrder(false);
            setSelectedOrder(null);
          }}
          onAccept={() => {
            console.log('Order accepted');
            setShowAcceptOrder(false);
            setSelectedOrder(null);
          }}
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
          userType="manufacturer"
        />
      )}

      {showViewAll && (
        <ViewAllModal 
          type={showViewAll}
          onClose={() => setShowViewAll(null)}
        />
      )}
    </div>
  );
}
/* This file is the Manufacturer Dashboard component for managing orders, labour, and user interactions.
It is designed for web-based React applications, not a native mobile app. */