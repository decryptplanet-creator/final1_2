import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/labelstatus';
import { Input } from './ui/input';
import { 
  LayoutDashboard, Users, AlertTriangle, FileText, ScrollText,
  DollarSign, TrendingUp, CheckCircle, Shield, Search,
  LogOut, Moon, Sun, X, Bell, Clock, MapPin, Download,
  UserCheck, UserX, MessageSquare, Calendar, Filter,
  Eye, Ban, RefreshCw, FileCheck, AlertCircle, ChevronRight,
  Lock, Unlock
} from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';
import { useTheme } from '../contexts/ThemeContext';

export function EnhancedAdminDashboard({ onLogout }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(null);

  // Mock Data
  const stats = {
    totalTransactions: 2458000,
    pendingVerifications: 8,
    activeDisputes: 5,
    ppcViolations: 3,
  };

  const pendingUsers = [
    {
      id: '1',
      name: 'Textile Industries Ltd',
      type: 'manufacturer',
      email: 'textile@example.com',
      phone: '+92 300 1234567',
      location: 'Sialkot',
      submittedDate: '2025-02-20',
      aiStatus: 'uncertain',
      trustScore: 72,
      documents: { cnic: true, affidavit: true, video: true },
    },
    {
      id: '2',
      name: 'Ahmed Hassan',
      type: 'labour',
      email: 'ahmed@example.com',
      phone: '+92 301 9876543',
      location: 'Lahore',
      submittedDate: '2025-02-21',
      aiStatus: 'flagged',
      trustScore: 65,
      documents: { cnic: true, affidavit: false, video: true },
    },
    {
      id: '3',
      name: 'Premium Garments Factory',
      type: 'manufacturer',
      email: 'premium@example.com',
      phone: '+92 302 5551234',
      location: 'Karachi',
      submittedDate: '2025-02-21',
      aiStatus: 'uncertain',
      trustScore: 78,
      documents: { cnic: true, affidavit: true, video: false },
    },
  ];

  const disputes = [
    {
      id: '1',
      orderId: '#104',
      client: 'Fashion House Ltd',
      manufacturer: 'ABC Manufacturing',
      amount: 125000,
      reason: 'Quality dispute - products not meeting specifications',
      status: 'escalated',
      escalatedDate: '2025-02-18',
      priority: 'high',
      ppcViolation: true,
    },
    {
      id: '2',
      orderId: '#098',
      client: 'Export Co.',
      manufacturer: 'XYZ Textiles',
      amount: 85000,
      reason: 'Delivery delay - missed deadline by 2 weeks',
      status: 'under-review',
      escalatedDate: '2025-02-19',
      priority: 'medium',
      ppcViolation: false,
    },
    {
      id: '3',
      orderId: '#112',
      client: 'Global Traders',
      manufacturer: 'Quality Mills',
      amount: 200000,
      reason: 'Payment dispute - escrow release disagreement',
      status: 'escalated',
      escalatedDate: '2025-02-20',
      priority: 'high',
      ppcViolation: true,
    },
  ];

  const systemLogs = [
    {
      id: '1',
      timestamp: '2025-02-22 10:45:23',
      action: 'User Approved',
      admin: 'Admin User',
      details: 'Verified manufacturer: Textile Industries Ltd',
      type: 'verification',
    },
    {
      id: '2',
      timestamp: '2025-02-22 09:30:15',
      action: 'Dispute Resolved',
      admin: 'Admin User',
      details: 'Refund issued for Order #087 - Amount: PKR 45,000',
      type: 'dispute',
    },
    {
      id: '3',
      timestamp: '2025-02-21 16:20:42',
      action: 'PPC Warning Issued',
      admin: 'Admin User',
      details: 'Account suspended for User #892 - Multiple violations',
      type: 'ppc',
    },
    {
      id: '4',
      timestamp: '2025-02-21 14:15:30',
      action: 'User Rejected',
      admin: 'Admin User',
      details: 'Verification rejected for manufacturer - Invalid documents',
      type: 'verification',
    },
  ];

  const handleApproveUser = (user) => {
    setShowConfirmation({
      show: true,
      action: 'Approve User',
      message: `Are you sure you want to approve ${user.name}? This will grant them full platform access.`,
      onConfirm: () => {
        // Simulate approval
        setShowConfirmation(null);
        setSelectedUser(null);
        alert(`✓ ${user.name} has been approved and notified via email.`);
      },
    });
  };

  const handleRejectUser = (user) => {
    setShowConfirmation({
      show: true,
      action: 'Reject User',
      message: `Are you sure you want to reject ${user.name}? They will be notified and can reapply.`,
      onConfirm: () => {
        setShowConfirmation(null);
        setSelectedUser(null);
        alert(`✗ ${user.name} has been rejected. Rejection notice sent.`);
      },
    });
  };

  const handleRequestInfo = (user) => {
    setShowConfirmation(null);
    setSelectedUser(null);
    alert(`📧 Information request sent to ${user.name}. They will receive an email with requirements.`);
  };

  const handleResolveDispute = (dispute, action) => {
    const messages = {
      refund: `Are you sure you want to refund PKR ${dispute.amount.toLocaleString()} to ${dispute.client}? This will reverse the transaction.`,
      release: `Are you sure you want to release PKR ${dispute.amount.toLocaleString()} to ${dispute.manufacturer}? This will complete the payment.`,
      suspend: `Are you sure you want to enforce PPC Law and suspend the account? This is a serious action that requires documentation.`,
    };

    setShowConfirmation({
      show: true,
      action: action === 'refund' ? 'Refund to Client' : action === 'release' ? 'Release Payment' : 'Suspend Account',
      message: messages[action],
      onConfirm: () => {
        setShowConfirmation(null);
        setSelectedDispute(null);
        const actionMessages = {
          refund: `✓ Refund of PKR ${dispute.amount.toLocaleString()} issued to ${dispute.client}`,
          release: `✓ Payment of PKR ${dispute.amount.toLocaleString()} released to ${dispute.manufacturer}`,
          suspend: `⚠ Account suspended. PPC violation recorded.`,
        };
        alert(actionMessages[action]);
      },
    });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1F2933]' : 'bg-[#F9FAFB]'}`}>
      {/* Header */}
      <header className={`border-b ${isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'} px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-[#2563EB] rounded-lg flex items-center justify-center">
              <Shield className="size-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                Admin Panel
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Skillora Platform Management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationCenter userType="client" />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}
            >
              {isDarkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>
            <Button 
              onClick={onLogout}
              variant="outline"
              className={isDarkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-[#1F2933]'}
            >
              <LogOut className="size-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`w-64 min-h-screen border-r ${isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'} p-4`}>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeView === 'dashboard'
                  ? 'bg-[#2563EB] text-white'
                  : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="size-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveView('verification')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeView === 'verification'
                  ? 'bg-[#2563EB] text-white'
                  : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="size-5" />
              <span>User Verification</span>
              {stats.pendingVerifications > 0 && (
                <Badge className="ml-auto bg-red-600 text-white">
                  {stats.pendingVerifications}
                </Badge>
              )}
            </button>
            <button
              onClick={() => setActiveView('disputes')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeView === 'disputes'
                  ? 'bg-[#2563EB] text-white'
                  : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <AlertTriangle className="size-5" />
              <span>Disputes</span>
              {stats.activeDisputes > 0 && (
                <Badge className="ml-auto bg-yellow-600 text-white">
                  {stats.activeDisputes}
                </Badge>
              )}
            </button>
            <button
              onClick={() => setActiveView('reports')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeView === 'reports'
                  ? 'bg-[#2563EB] text-white'
                  : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileText className="size-5" />
              <span>Reports</span>
            </button>
            <button
              onClick={() => setActiveView('logs')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeView === 'logs'
                  ? 'bg-[#2563EB] text-white'
                  : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ScrollText className="size-5" />
              <span>System Logs</span>
            </button>
          </nav>

          <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
            <div className="flex items-start gap-2">
              <Lock className={`size-4 mt-0.5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-700'}`} />
              <div>
                <p className={`text-xs font-medium ${isDarkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                  Authorized Access Only
                </p>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
                  All actions are logged
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Dashboard View */}
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                System Overview
              </h2>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign className="size-8 text-[#2563EB]" />
                      <TrendingUp className="size-5 text-green-600" />
                    </div>
                    <h3 className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Total Transactions
                    </h3>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                      PKR {stats.totalTransactions.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600 mt-1">Escrow Volume</p>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-transform hover:scale-105 ${
                    isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'
                  }`}
                  onClick={() => setActiveView('verification')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="size-8 text-yellow-500" />
                      <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30">
                        Pending
                      </Badge>
                    </div>
                    <h3 className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Pending Verifications
                    </h3>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                      {stats.pendingVerifications}
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">Awaiting Admin Approval</p>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-transform hover:scale-105 ${
                    isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'
                  }`}
                  onClick={() => setActiveView('disputes')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <AlertTriangle className="size-8 text-red-600" />
                      <Badge className="bg-red-600/20 text-red-400 border-red-600/30">
                        Active
                      </Badge>
                    </div>
                    <h3 className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Active Disputes
                    </h3>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                      {stats.activeDisputes}
                    </p>
                    <p className="text-xs text-red-600 mt-1">AI Escalated Cases</p>
                  </CardContent>
                </Card>

                <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Shield className="size-8 text-purple-600" />
                      <AlertCircle className="size-5 text-purple-600" />
                    </div>
                    <h3 className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      PPC Violations
                    </h3>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                      {stats.ppcViolations}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">AI Flagged Activities</p>
                  </CardContent>
                </Card>
              </div>

              {/* Trust Score & Order Statistics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'}>
                  <CardHeader>
                    <CardTitle className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>
                      Trust Score Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 flex items-end justify-between gap-2">
                      {[78, 81, 83, 85, 86, 87].map((score, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                          <div 
                            className="w-full bg-[#2563EB] rounded-t transition-all duration-1000"
                            style={{ height: `${(score / 100) * 180}px` }}
                          />
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}
                          </span>
                          <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                            {score}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'}>
                  <CardHeader>
                    <CardTitle className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>
                      Order Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { label: 'Completed', value: 342, color: 'bg-green-600', percentage: 85 },
                        { label: 'In Progress', value: 48, color: 'bg-[#2563EB]', percentage: 12 },
                        { label: 'Disputed', value: 12, color: 'bg-red-600', percentage: 3 },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {item.label}
                            </span>
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                              {item.value}
                            </span>
                          </div>
                          <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                            <div 
                              className={`h-full ${item.color} transition-all duration-1000`}
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* User Verification View */}
          {activeView === 'verification' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                  User Verification Hub
                </h2>
                <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30">
                  {pendingUsers.length} Pending
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Users List */}
                <div className={`lg:col-span-1 ${selectedUser ? '' : 'lg:col-span-3'}`}>
                  <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'}>
                    <CardHeader>
                      <CardTitle className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>
                        Verification Queue
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {pendingUsers.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => setSelectedUser(user)}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedUser && selectedUser.id === user.id
                              ? 'border-[#2563EB] bg-[#2563EB]/10'
                              : isDarkMode
                              ? 'border-gray-800 hover:border-gray-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                                {user.name}
                              </h4>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {user.type === 'manufacturer' ? 'Manufacturer' : 'Labour'}
                              </p>
                            </div>
                            <Badge className={
                              user.aiStatus === 'uncertain'
                                ? 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30'
                                : 'bg-red-600/20 text-red-400 border-red-600/30'
                            }>
                              {user.aiStatus === 'uncertain' ? 'Uncertain' : 'Flagged'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin className="size-3" />
                            {user.location}
                            <span>•</span>
                            <Clock className="size-3" />
                            {user.submittedDate}
                          </div>
                          <div className="mt-2 flex items-center gap-1">
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Trust Score:
                            </span>
                            <span className={`text-xs font-medium ${
                              user.trustScore >= 75 ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {user.trustScore}/100
                            </span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* User Detail View */}
                {selectedUser && (
                  <div className="lg:col-span-2">
                    <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>
                            Verification Details
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedUser(null)}
                            className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                          >
                            <X className="size-5" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* User Info */}
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
                          <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                            Personal Information
                          </h4>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Name:</span>
                              <p className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>{selectedUser.name}</p>
                            </div>
                            <div>
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Type:</span>
                              <p className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>
                                {selectedUser.type === 'manufacturer' ? 'Manufacturer' : 'Labour'}
                              </p>
                            </div>
                            <div>
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Email:</span>
                              <p className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>{selectedUser.email}</p>
                            </div>
                            <div>
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Phone:</span>
                              <p className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>{selectedUser.phone}</p>
                            </div>
                            <div>
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Location:</span>
                              <p className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>{selectedUser.location}</p>
                            </div>
                            <div>
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Submitted:</span>
                              <p className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>{selectedUser.submittedDate}</p>
                            </div>
                          </div>
                        </div>

                        {/* Documents */}
                        <div>
                          <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                            Submitted Documents
                          </h4>
                          <div className="space-y-2">
                            <div className={`flex items-center justify-between p-3 rounded-lg ${
                              isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'
                            }`}>
                              <div className="flex items-center gap-3">
                                <FileCheck className={`size-5 ${
                                  selectedUser.documents.cnic ? 'text-green-600' : 'text-gray-400'
                                }`} />
                                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                  CNIC (Front & Back)
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {selectedUser.documents.cnic ? (
                                  <CheckCircle className="size-5 text-green-600" />
                                ) : (
                                  <X className="size-5 text-red-600" />
                                )}
                                <Button variant="outline" size="sm" className={isDarkMode ? 'border-gray-700' : ''}>
                                  <Eye className="size-4 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>

                            <div className={`flex items-center justify-between p-3 rounded-lg ${
                              isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'
                            }`}>
                              <div className="flex items-center gap-3">
                                <FileCheck className={`size-5 ${
                                  selectedUser.documents.affidavit ? 'text-green-600' : 'text-gray-400'
                                }`} />
                                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                  Affidavit Document
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {selectedUser.documents.affidavit ? (
                                  <CheckCircle className="size-5 text-green-600" />
                                ) : (
                                  <X className="size-5 text-red-600" />
                                )}
                                <Button variant="outline" size="sm" className={isDarkMode ? 'border-gray-700' : ''}>
                                  <Eye className="size-4 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>

                            <div className={`flex items-center justify-between p-3 rounded-lg ${
                              isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'
                            }`}>
                              <div className="flex items-center gap-3">
                                <FileCheck className={`size-5 ${
                                  selectedUser.documents.video ? 'text-green-600' : 'text-gray-400'
                                }`} />
                                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                  Factory Tour / Live Selfie Video
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {selectedUser.documents.video ? (
                                  <CheckCircle className="size-5 text-green-600" />
                                ) : (
                                  <X className="size-5 text-red-600" />
                                )}
                                <Button variant="outline" size="sm" className={isDarkMode ? 'border-gray-700' : ''}>
                                  <Eye className="size-4 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* AI Analysis */}
                        <div className={`p-4 rounded-lg ${
                          selectedUser.aiStatus === 'uncertain'
                            ? isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'
                            : isDarkMode ? 'bg-red-900/20' : 'bg-red-50'
                        }`}>
                          <h4 className={`font-medium mb-2 ${
                            selectedUser.aiStatus === 'uncertain'
                              ? isDarkMode ? 'text-yellow-400' : 'text-yellow-700'
                              : isDarkMode ? 'text-red-400' : 'text-red-700'
                          }`}>
                            AI Verification Status
                          </h4>
                          <p className={`text-sm ${
                            selectedUser.aiStatus === 'uncertain'
                              ? isDarkMode ? 'text-yellow-300' : 'text-yellow-600'
                              : isDarkMode ? 'text-red-300' : 'text-red-600'
                          }`}>
                            {selectedUser.aiStatus === 'uncertain' 
                              ? 'AI verification returned uncertain results. Manual review required.'
                              : 'AI has flagged potential issues with submitted documents. Careful review recommended.'
                            }
                          </p>
                          <div className="mt-2">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              AI Trust Score: 
                            </span>
                            <span className={`text-sm font-medium ml-2 ${
                              selectedUser.trustScore >= 75 ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {selectedUser.trustScore}/100
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleApproveUser(selectedUser)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          >
                            <UserCheck className="size-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleRejectUser(selectedUser)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                          >
                            <UserX className="size-4 mr-2" />
                            Reject
                          </Button>
                          <Button
                            onClick={() => handleRequestInfo(selectedUser)}
                            variant="outline"
                            className={`flex-1 ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}
                          >
                            <MessageSquare className="size-4 mr-2" />
                            Request Info
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Disputes View */}
          {activeView === 'disputes' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                  Dispute Resolution Center
                </h2>
                <Badge className="bg-red-600/20 text-red-400 border-red-600/30">
                  {disputes.filter(d => d.status === 'escalated').length} Escalated
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Disputes List */}
                <div className={`lg:col-span-1 ${selectedDispute ? '' : 'lg:col-span-3'}`}>
                  <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'}>
                    <CardHeader>
                      <CardTitle className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>
                        Escalated Disputes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {disputes.map((dispute) => (
                        <div
                          key={dispute.id}
                          onClick={() => setSelectedDispute(dispute)}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedDispute && selectedDispute.id === dispute.id
                              ? 'border-[#2563EB] bg-[#2563EB]/10'
                              : isDarkMode
                              ? 'border-gray-800 hover:border-gray-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                                Order {dispute.orderId}
                              </h4>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                PKR {dispute.amount.toLocaleString()}
                              </p>
                            </div>
                            <Badge className={
                              dispute.priority === 'high'
                                ? 'bg-red-600/20 text-red-400 border-red-600/30'
                                : 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30'
                            }>
                              {dispute.priority}
                            </Badge>
                          </div>
                          <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {dispute.reason}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                              {dispute.escalatedDate}
                            </span>
                            {dispute.ppcViolation && (
                              <Badge className="bg-purple-600/20 text-purple-400 border-purple-600/30 text-xs">
                                PPC
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Dispute Detail View */}
                {selectedDispute && (
                  <div className="lg:col-span-2">
                    <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>
                            Dispute Details - Order {selectedDispute.orderId}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedDispute(null)}
                            className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                          >
                            <X className="size-5" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Order Details */}
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
                          <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                            Order Information
                          </h4>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Order ID:</span>
                              <p className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>{selectedDispute.orderId}</p>
                            </div>
                            <div>
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Amount:</span>
                              <p className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>PKR {selectedDispute.amount.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Client:</span>
                              <p className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>{selectedDispute.client}</p>
                            </div>
                            <div>
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Manufacturer:</span>
                              <p className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>{selectedDispute.manufacturer}</p>
                            </div>
                            <div className="col-span-2">
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Reason:</span>
                              <p className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>{selectedDispute.reason}</p>
                            </div>
                          </div>
                        </div>

                        {/* Payment History */}
                        <div>
                          <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                            Payment History
                          </h4>
                          <div className="space-y-2">
                            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
                              <div className="flex items-center justify-between">
                                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                  30% Advance
                                </span>
                                <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                                  Released
                                </Badge>
                              </div>
                              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                PKR {(selectedDispute.amount * 0.3).toLocaleString()}
                              </p>
                            </div>
                            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
                              <div className="flex items-center justify-between">
                                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                  70% Final Payment
                                </span>
                                <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30">
                                  In Escrow
                                </Badge>
                              </div>
                              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                PKR {(selectedDispute.amount * 0.7).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* AI Monitor - Chat History */}
                        <div className={`p-4 rounded-lg ${
                          selectedDispute.ppcViolation
                            ? isDarkMode ? 'bg-red-900/20' : 'bg-red-50'
                            : isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'
                        }`}>
                          <h4 className={`font-medium mb-3 ${
                            selectedDispute.ppcViolation
                              ? isDarkMode ? 'text-red-400' : 'text-red-700'
                              : isDarkMode ? 'text-white' : 'text-[#1F2933]'
                          }`}>
                            AI Monitored Chat History
                          </h4>
                          <div className="space-y-3">
                            <div className={`p-3 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <strong>Client:</strong> "The quality is not what we agreed on."
                              </p>
                            </div>
                            <div className={`p-3 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <strong>Manufacturer:</strong> "We followed all specifications."
                              </p>
                            </div>
                            {selectedDispute.ppcViolation && (
                              <div className={`p-3 rounded border-2 ${
                                isDarkMode ? 'bg-red-900/30 border-red-600' : 'bg-red-100 border-red-600'
                              }`}>
                                <div className="flex items-start gap-2">
                                  <AlertTriangle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <p className={`text-sm font-medium ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                                      PPC Violation Detected
                                    </p>
                                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
                                      AI has flagged threatening language in conversation. PPC Law enforcement may be required.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Decision Buttons */}
                        <div>
                          <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                            Final Decision
                          </h4>
                          <div className="grid grid-cols-1 gap-3">
                            <Button
                              onClick={() => handleResolveDispute(selectedDispute, 'refund')}
                              className="bg-blue-600 hover:bg-blue-700 text-white justify-start"
                            >
                              <RefreshCw className="size-4 mr-2" />
                              Refund to Client - PKR {selectedDispute.amount.toLocaleString()}
                            </Button>
                            <Button
                              onClick={() => handleResolveDispute(selectedDispute, 'release')}
                              className="bg-green-600 hover:bg-green-700 text-white justify-start"
                            >
                              <Unlock className="size-4 mr-2" />
                              Release to Manufacturer - PKR {selectedDispute.amount.toLocaleString()}
                            </Button>
                            <Button
                              onClick={() => handleResolveDispute(selectedDispute, 'suspend')}
                              className="bg-red-600 hover:bg-red-700 text-white justify-start"
                            >
                              <Ban className="size-4 mr-2" />
                              Issue PPC Warning / Suspend Account
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reports View */}
          {activeView === 'reports' && (
            <div className="space-y-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                Reporting & Analytics
              </h2>

              <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'}>
                <CardHeader>
                  <CardTitle className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>
                    Generate Audit Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`text-sm mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Date Range
                      </label>
                      <select className={`w-full p-2 rounded-lg border ${
                        isDarkMode ? 'bg-[#1F2933] border-gray-700 text-white' : 'bg-white border-gray-300'
                      }`}>
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Last 3 Months</option>
                        <option>Custom Range</option>
                      </select>
                    </div>
                    <div>
                      <label className={`text-sm mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        User Type
                      </label>
                      <select className={`w-full p-2 rounded-lg border ${
                        isDarkMode ? 'bg-[#1F2933] border-gray-700 text-white' : 'bg-white border-gray-300'
                      }`}>
                        <option>All Users</option>
                        <option>Clients</option>
                        <option>Manufacturers</option>
                        <option>Labour</option>
                      </select>
                    </div>
                  </div>

                  {/* Data Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                          <th className={`text-left p-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            User ID
                          </th>
                          <th className={`text-left p-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Trust Score
                          </th>
                          <th className={`text-left p-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Completion Rate
                          </th>
                          <th className={`text-left p-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            PPC Warnings
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 'USR001', score: 94, completion: 98, warnings: 0 },
                          { id: 'USR002', score: 87, completion: 92, warnings: 1 },
                          { id: 'USR003', score: 76, completion: 85, warnings: 2 },
                          { id: 'USR004', score: 91, completion: 96, warnings: 0 },
                        ].map((row) => (
                          <tr key={row.id} className={`border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                            <td className={`p-3 ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>{row.id}</td>
                            <td className={`p-3 ${row.score >= 85 ? 'text-green-600' : 'text-yellow-600'}`}>
                              {row.score}/100
                            </td>
                            <td className={`p-3 ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>{row.completion}%</td>
                            <td className={`p-3 ${row.warnings > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {row.warnings}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <Button className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white">
                    <Download className="size-4 mr-2" />
                    Download Audit Report (PDF)
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* System Logs View */}
          {activeView === 'logs' && (
            <div className="space-y-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                System Logs
              </h2>

              <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>
                      Recent Activity
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Search logs..."
                        className={`w-64 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-white' : ''}`}
                      />
                      <Button variant="outline" size="icon">
                        <Search className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {systemLogs.map((log) => (
                      <div
                        key={log.id}
                        className={`p-4 rounded-lg border ${isDarkMode ? 'bg-[#1F2933] border-gray-800' : 'bg-gray-50 border-gray-200'}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`size-2 rounded-full ${
                              log.type === 'verification' ? 'bg-green-600' :
                              log.type === 'dispute' ? 'bg-yellow-600' :
                              log.type === 'ppc' ? 'bg-red-600' :
                              'bg-blue-600'
                            }`} />
                            <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                              {log.action}
                            </h4>
                          </div>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {log.timestamp}
                          </span>
                        </div>
                        <p className={`text-sm ml-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {log.details}
                        </p>
                        <p className={`text-xs ml-5 mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          By: {log.admin}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className={`max-w-md w-full ${isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>
                Confirm Action
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`size-6 flex-shrink-0 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-700'}`} />
                  <div>
                    <p className={`font-medium mb-1 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                      {showConfirmation.action}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
                      {showConfirmation.message}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={showConfirmation.onConfirm}
                  className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                >
                  Yes, Confirm
                </Button>
                <Button
                  onClick={() => setShowConfirmation(null)}
                  variant="outline"
                  className={`flex-1 ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
/* Admin dashboard UI for managing users, disputes, reports, and system activity in a platform.
Yeh web-based application ke liye bana hai (React frontend), mobile app ke liye direct nahi hai. */