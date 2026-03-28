// R.1.24: Reporting and Analytics
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  BarChart3, Users, DollarSign, Package, AlertTriangle,
  TrendingUp, TrendingDown, Download, Calendar, X, FileText
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ReportingDashboard({ onClose }) {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('last30days');

  // Mock data for reports
  const overviewStats = {
    totalUsers: 1245,
    totalTransactions: 856,
    totalRevenue: 4250000,
    activeDisputes: 12,
    userGrowth: '+12%',
    transactionGrowth: '+8%',
    revenueGrowth: '+15%',
    disputeChange: '-5%',
  };

  const userStats = {
    clients: 345,
    manufacturers: 278,
    labour: 622,
    verifiedUsers: 1089,
    pendingVerification: 45,
    suspendedAccounts: 8,
    terminatedAccounts: 3,
  };

  const transactionStats = {
    completed: 723,
    inProgress: 98,
    pending: 35,
    totalVolume: 4250000,
    averageOrderValue: 4967,
    escrowHeld: 1250000,
    escrowReleased: 3000000,
  };

  const disputeStats = {
    total: 47,
    autoResolved: 28,
    escalated: 12,
    resolved: 40,
    pending: 7,
    averageResolutionTime: '18 hours',
  };

  const performanceData = [
    { month: 'Jan', orders: 65, revenue: 325000 },
    { month: 'Feb', orders: 78, revenue: 390000 },
    { month: 'Mar', orders: 92, revenue: 460000 },
    { month: 'Apr', orders: 85, revenue: 425000 },
    { month: 'May', orders: 105, revenue: 525000 },
    { month: 'Jun', orders: 120, revenue: 600000 },
  ];

  const handleDownloadReport = (reportType) => {
    alert(`Downloading ${reportType} report for ${dateRange}...`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className={`w-full max-w-6xl my-8 ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardHeader className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                <BarChart3 className="size-5 text-[#2563EB]" />
                Admin Reporting & Analytics
              </CardTitle>
              <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Monitor system performance, users, transactions, and disputes
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Date Range Selector */}
          <div className="flex items-center gap-2 mb-6">
            <Calendar className={`size-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className={`px-3 py-1 rounded-lg text-sm border ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last3months">Last 3 Months</option>
              <option value="last6months">Last 6 Months</option>
              <option value="lastyear">Last Year</option>
            </select>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleDownloadReport('comprehensive')}
              className="ml-auto"
            >
              <Download className="size-4 mr-2" />
              Download Full Report
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className={isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-100'}>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="disputes">Disputes</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className={isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-gray-50 border-gray-200'}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="size-8 text-[#2563EB]" />
                      <Badge className="bg-green-500/10 text-green-600 border-green-500">
                        {overviewStats.userGrowth}
                      </Badge>
                    </div>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                      {overviewStats.totalUsers}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Users</p>
                  </CardContent>
                </Card>

                <Card className={isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-gray-50 border-gray-200'}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Package className="size-8 text-[#2563EB]" />
                      <Badge className="bg-green-500/10 text-green-600 border-green-500">
                        {overviewStats.transactionGrowth}
                      </Badge>
                    </div>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                      {overviewStats.totalTransactions}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Transactions</p>
                  </CardContent>
                </Card>

                <Card className={isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-gray-50 border-gray-200'}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign className="size-8 text-[#2563EB]" />
                      <Badge className="bg-green-500/10 text-green-600 border-green-500">
                        {overviewStats.revenueGrowth}
                      </Badge>
                    </div>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                      ₨{(overviewStats.totalRevenue / 1000000).toFixed(1)}M
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Revenue</p>
                  </CardContent>
                </Card>

                <Card className={isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-gray-50 border-gray-200'}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <AlertTriangle className="size-8 text-yellow-600" />
                      <Badge className="bg-green-500/10 text-green-600 border-green-500">
                        {overviewStats.disputeChange}
                      </Badge>
                    </div>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                      {overviewStats.activeDisputes}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Disputes</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className={isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-gray-50 border-gray-200'}>
                  <CardContent className="p-4">
                    <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>User Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Clients</span>
                        <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{userStats.clients}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Manufacturers</span>
                        <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{userStats.manufacturers}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Labour</span>
                        <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{userStats.labour}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-gray-50 border-gray-200'}>
                  <CardContent className="p-4">
                    <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Verification Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Verified</span>
                        <Badge className="bg-green-500/10 text-green-600 border-green-500">{userStats.verifiedUsers}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Pending</span>
                        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500">{userStats.pendingVerification}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-gray-50 border-gray-200'}>
                  <CardContent className="p-4">
                    <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Account Actions</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Suspended</span>
                        <Badge className="bg-orange-500/10 text-orange-600 border-orange-500">{userStats.suspendedAccounts}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Terminated</span>
                        <Badge className="bg-red-500/10 text-red-600 border-red-500">{userStats.terminatedAccounts}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Button 
                onClick={() => handleDownloadReport('users')} 
                variant="outline" 
                className="w-full"
              >
                <FileText className="size-4 mr-2" />
                Download User Report
              </Button>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className={isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-gray-50 border-gray-200'}>
                  <CardContent className="p-4">
                    <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Completed</h4>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                      {transactionStats.completed}
                    </p>
                  </CardContent>
                </Card>
                <Card className={isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-gray-50 border-gray-200'}>
                  <CardContent className="p-4">
                    <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>In Progress</h4>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                      {transactionStats.inProgress}
                    </p>
                  </CardContent>
                </Card>
                <Card className={isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-gray-50 border-gray-200'}>
                  <CardContent className="p-4">
                    <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Avg Order Value</h4>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                      ₨{transactionStats.averageOrderValue}
                    </p>
                  </CardContent>
                </Card>
                <Card className={isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-gray-50 border-gray-200'}>
                  <CardContent className="p-4">
                    <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Escrow Held</h4>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                      ₨{(transactionStats.escrowHeld / 1000000).toFixed(1)}M
                    </p>
                  </CardContent>
                </Card>
              </div>
              <Button 
                onClick={() => handleDownloadReport('transactions')} 
                variant="outline" 
                className="w-full"
              >
                <FileText className="size-4 mr-2" />
                Download Transaction Report
              </Button>
            </TabsContent>

            {/* Disputes Tab */}
            <TabsContent value="disputes" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className={isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-gray-50 border-gray-200'}>
                  <CardContent className="p-4">
                    <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Dispute Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total</span>
                        <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{disputeStats.total}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Resolved</span>
                        <span className={`font-medium text-green-600`}>{disputeStats.resolved}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Pending</span>
                        <span className={`font-medium text-yellow-600`}>{disputeStats.pending}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-gray-50 border-gray-200'}>
                  <CardContent className="p-4">
                    <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Resolution Method</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Auto-Resolved</span>
                        <Badge className="bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]">{disputeStats.autoResolved}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Escalated</span>
                        <Badge className="bg-orange-500/10 text-orange-600 border-orange-500">{disputeStats.escalated}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-gray-50 border-gray-200'}>
                  <CardContent className="p-4">
                    <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Performance</h4>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Avg Resolution Time</span>
                        <p className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{disputeStats.averageResolutionTime}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Button 
                onClick={() => handleDownloadReport('disputes')} 
                variant="outline" 
                className="w-full"
              >
                <FileText className="size-4 mr-2" />
                Download Dispute Report
              </Button>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-4 mt-4">
              <Card className={isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-gray-50 border-gray-200'}>
                <CardContent className="p-4">
                  <h4 className={`text-sm font-medium mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Monthly Performance (Last 6 Months)
                  </h4>
                  <div className="space-y-3">
                    {performanceData.map((data, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <span className={`text-sm font-medium w-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {data.month}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Orders: {data.orders}</span>
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Revenue: ₨{(data.revenue / 1000).toFixed(0)}K</span>
                          </div>
                          <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                            <div 
                              className="h-full bg-gradient-to-r from-[#2563EB] to-green-500 rounded-full"
                              style={{ width: `${(data.orders / 120) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Button 
                onClick={() => handleDownloadReport('performance')} 
                variant="outline" 
                className="w-full"
              >
                <FileText className="size-4 mr-2" />
                Download Performance Report
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

/* Admin dashboard for viewing reports & analytics (users, transactions, revenue, disputes, performance) with downloadable reports.

This is a web-based (React frontend) component, but can also be used in apps if adapted (so mainly web, usable for both). */