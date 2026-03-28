import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/labelstatus';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  BarChart3, PieChart, TrendingUp, DollarSign, Users, 
  AlertTriangle, CheckCircle, Download, Filter, Calendar,
  MapPin, FileText, Shield, Search, LogOut, Moon, Sun,
  Loader2
} from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';
import { useTheme } from '../contexts/ThemeContext';

export function AdminDashboard({ onLogout }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeView, setActiveView] = useState('overview');
  const [reportGenerating, setReportGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportFilters, setReportFilters] = useState({
    dateRange: '',
    userType: '',
    location: '',
  });

  // Mock Data
  const stats = {
    totalTransactions: 2458000,
    activeDisputes: 5,
    verifiedUsers: 342,
    averageTrustScore: 87,
  };

  const monthlyOrders = [
    { month: 'Jan', orders: 45 },
    { month: 'Feb', orders: 52 },
    { month: 'Mar', orders: 61 },
    { month: 'Apr', orders: 58 },
    { month: 'May', orders: 73 },
    { month: 'Jun', orders: 68 },
  ];

  const userDistribution = [
    { type: 'Clients', count: 156, color: '#2563EB' },
    { type: 'Manufacturers', count: 98, color: '#10B981' },
    { type: 'Labour', count: 88, color: '#F59E0B' },
  ];

  const trustScoreTrend = [
    { month: 'Jan', score: 78 },
    { month: 'Feb', score: 81 },
    { month: 'Mar', score: 83 },
    { month: 'Apr', score: 85 },
    { month: 'May', score: 86 },
    { month: 'Jun', score: 87 },
  ];

  const recentActivities = [
    { id: '1', type: 'verification', message: 'New manufacturer verified: Textile Industries Ltd', time: '5 mins ago' },
    { id: '2', type: 'dispute', message: 'Dispute resolved for Order #245', time: '1 hour ago' },
    { id: '3', type: 'payment', message: 'Escrow payment of PKR 45,000 released', time: '2 hours ago' },
    { id: '4', type: 'violation', message: 'PPC violation flagged by AI for User #892', time: '4 hours ago' },
  ];

  const ppcViolations = [
    { id: '1', user: 'Manufacturer #892', violation: 'Suspicious document upload', status: 'Under Review', date: '2025-12-20' },
    { id: '2', user: 'Labour #453', violation: 'Location fraud detected', status: 'Resolved', date: '2025-12-18' },
    { id: '3', user: 'Client #234', violation: 'Multiple account creation attempt', status: 'Pending', date: '2025-12-15' },
  ];

  const handleGenerateReport = () => {
    setReportGenerating(true);
    setReportGenerated(false);
    
    // Simulate report generation
    setTimeout(() => {
      setReportGenerating(false);
      setReportGenerated(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setReportGenerated(false);
      }, 3000);
    }, 2000);
  };

  const maxOrders = Math.max(...monthlyOrders.map(m => m.orders));
  const maxScore = Math.max(...trustScoreTrend.map(t => t.score));

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1F2933]' : 'bg-[#F9FAFB]'}`}>
      {/* Header */}
      <header className={`border-b ${isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'} px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
              Admin Dashboard
            </h1>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Skillora Platform Management & Analytics
            </p>
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

      <div className="p-6">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => setActiveView('overview')}
            className={activeView === 'overview' 
              ? 'bg-[#2563EB] text-white' 
              : isDarkMode 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                : 'bg-white text-[#1F2933] hover:bg-gray-100'
            }
          >
            <BarChart3 className="size-4 mr-2" />
            Analytics Overview
          </Button>
          <Button
            onClick={() => setActiveView('reports')}
            className={activeView === 'reports' 
              ? 'bg-[#2563EB] text-white' 
              : isDarkMode 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                : 'bg-white text-[#1F2933] hover:bg-gray-100'
            }
          >
            <FileText className="size-4 mr-2" />
            Report Generation
          </Button>
        </div>

        {/* Overview View */}
        {activeView === 'overview' && (
          <div className="space-y-6">
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
                  <p className="text-xs text-green-600 mt-1">+12.5% from last month</p>
                </CardContent>
              </Card>

              <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <AlertTriangle className="size-8 text-yellow-500" />
                    <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30">
                      Active
                    </Badge>
                  </div>
                  <h3 className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Active Disputes
                  </h3>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                    {stats.activeDisputes}
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">2 require immediate attention</p>
                </CardContent>
              </Card>

              <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="size-8 text-green-600" />
                    <CheckCircle className="size-5 text-green-600" />
                  </div>
                  <h3 className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Verified Users
                  </h3>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                    {stats.verifiedUsers}
                  </p>
                  <p className="text-xs text-green-600 mt-1">+8 new this week</p>
                </CardContent>
              </Card>

              <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Shield className="size-8 text-[#2563EB]" />
                    <TrendingUp className="size-5 text-green-600" />
                  </div>
                  <h3 className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Avg Trust Score
                  </h3>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                    {stats.averageTrustScore}/100
                  </p>
                  <p className="text-xs text-green-600 mt-1">+2 points this month</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart - Monthly Orders */}
              <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'}>
                <CardHeader>
                  <CardTitle className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>
                    Monthly Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyOrders.map((item) => (
                      <div key={item.month}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {item.month}
                          </span>
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                            {item.orders}
                          </span>
                        </div>
                        <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                          <div 
                            className="h-full bg-[#2563EB] transition-all duration-1000 ease-out"
                            style={{ width: `${(item.orders / maxOrders) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pie Chart - User Distribution */}
              <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'}>
                <CardHeader>
                  <CardTitle className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>
                    User Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative size-48">
                      {/* Simple Pie Chart Representation */}
                      <svg viewBox="0 0 100 100" className="transform -rotate-90">
                        <circle cx="50" cy="50" r="40" fill="none" stroke={userDistribution[0].color} strokeWidth="20" strokeDasharray="73 100" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke={userDistribution[1].color} strokeWidth="20" strokeDasharray="28.6 100" strokeDashoffset="-73" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke={userDistribution[2].color} strokeWidth="20" strokeDasharray="25.7 100" strokeDashoffset="-101.6" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                            {userDistribution.reduce((sum, u) => sum + u.count, 0)}
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {userDistribution.map((item) => (
                      <div key={item.type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="size-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {item.type}
                          </span>
                        </div>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Line Graph - Trust Score Trends */}
              <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'}>
                <CardHeader>
                  <CardTitle className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>
                    Trust Score Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end justify-between gap-2">
                    {trustScoreTrend.map((item, index) => {
                      const height = (item.score / maxScore) * 100;
                      return (
                        <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                          <div className="relative w-full">
                            <div 
                              className={`w-full bg-[#2563EB] rounded-t transition-all duration-1000 ease-out ${
                                index > 0 ? 'opacity-90' : ''
                              }`}
                              style={{ height: `${height * 1.5}px` }}
                            />
                            {index > 0 && (
                              <div 
                                className="absolute top-0 left-1/2 w-full h-px bg-green-500"
                                style={{
                                  transform: `rotate(${Math.atan2(
                                    (trustScoreTrend[index].score - trustScoreTrend[index - 1].score) * 1.5,
                                    100 / trustScoreTrend.length
                                  )}rad) translateX(-50%)`
                                }}
                              />
                            )}
                          </div>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {item.month}
                          </span>
                          <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                            {item.score}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* PPC Violations */}
              <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'}>
                <CardHeader>
                  <CardTitle className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>
                    PPC Violations Flagged by AI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ppcViolations.map((item) => (
                      <div 
                        key={item.id} 
                        className={`p-3 rounded-lg border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                              {item.user}
                            </h4>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {item.violation}
                            </p>
                          </div>
                          <Badge 
                            className={
                              item.status === 'Resolved' 
                                ? 'bg-green-600/20 text-green-400 border-green-600/30'
                                : item.status === 'Pending'
                                ? 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30'
                                : 'bg-blue-600/20 text-blue-400 border-blue-600/30'
                            }
                          >
                            {item.status}
                          </Badge>
                        </div>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {item.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'}>
              <CardHeader>
                <CardTitle className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div 
                      key={activity.id}
                      className={`flex items-start gap-3 p-3 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
                    >
                      <div className={`size-2 rounded-full mt-2 ${
                        activity.type === 'verification' ? 'bg-green-600' :
                        activity.type === 'dispute' ? 'bg-yellow-600' :
                        activity.type === 'payment' ? 'bg-[#2563EB]' :
                        'bg-red-600'
                      }`} />
                      <div className="flex-1">
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {activity.message}
                        </p>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Report Generation View */}
        {activeView === 'reports' && (
          <div className="max-w-4xl mx-auto">
            <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'}>
              <CardHeader>
                <CardTitle className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>
                  Generate Performance Report
                </CardTitle>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Customize your report with filters below
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>
                      <Calendar className="size-4 inline mr-2" />
                      Date Range
                    </Label>
                    <select
                      value={reportFilters.dateRange}
                      onChange={(e) => setReportFilters({ ...reportFilters, dateRange: e.target.value })}
                      className={`w-full mt-2 p-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-[#1F2933] border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-[#1F2933]'
                      }`}
                    >
                      <option value="">Select Range</option>
                      <option value="last-7-days">Last 7 Days</option>
                      <option value="last-30-days">Last 30 Days</option>
                      <option value="last-3-months">Last 3 Months</option>
                      <option value="last-year">Last Year</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>

                  <div>
                    <Label className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>
                      <Users className="size-4 inline mr-2" />
                      User Type
                    </Label>
                    <select
                      value={reportFilters.userType}
                      onChange={(e) => setReportFilters({ ...reportFilters, userType: e.target.value })}
                      className={`w-full mt-2 p-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-[#1F2933] border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-[#1F2933]'
                      }`}
                    >
                      <option value="">All Users</option>
                      <option value="client">Clients</option>
                      <option value="manufacturer">Manufacturers</option>
                      <option value="labour">Labour</option>
                    </select>
                  </div>

                  <div>
                    <Label className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>
                      <MapPin className="size-4 inline mr-2" />
                      Location
                    </Label>
                    <select
                      value={reportFilters.location}
                      onChange={(e) => setReportFilters({ ...reportFilters, location: e.target.value })}
                      className={`w-full mt-2 p-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-[#1F2933] border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-[#1F2933]'
                      }`}
                    >
                      <option value="">All Locations</option>
                      <option value="sialkot">Sialkot</option>
                      <option value="lahore">Lahore</option>
                      <option value="karachi">Karachi</option>
                      <option value="islamabad">Islamabad</option>
                      <option value="faisalabad">Faisalabad</option>
                      <option value="multan">Multan</option>
                    </select>
                  </div>
                </div>

                {/* Report Info */}
                <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-blue-50 border-blue-200'}`}>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                    Report will include:
                  </h4>
                  <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li>• Total transactions and revenue breakdown</li>
                    <li>• User verification statistics</li>
                    <li>• Trust score analysis and trends</li>
                    <li>• Dispute resolution metrics</li>
                    <li>• PPC violations and compliance data</li>
                    <li>• Order completion rates</li>
                    <li>• Geographic distribution of users</li>
                  </ul>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerateReport}
                  disabled={reportGenerating}
                  className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-lg py-6"
                >
                  {reportGenerating ? (
                    <>
                      <Loader2 className="size-5 mr-2 animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <Download className="size-5 mr-2" />
                      Generate Performance Report (PDF)
                    </>
                  )}
                </Button>

                {/* Progress Bar */}
                {reportGenerating && (
                  <div className="space-y-2">
                    <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                      <div 
                        className="h-full bg-[#2563EB] transition-all duration-2000 ease-out animate-pulse"
                        style={{ width: '75%' }}
                      />
                    </div>
                    <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Compiling data and generating report...
                    </p>
                  </div>
                )}

                {/* Success State */}
                {reportGenerated && (
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'}`}>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="size-6 text-green-600" />
                      <div>
                        <h4 className={`font-medium ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                          Report Generated Successfully!
                        </h4>
                        <p className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
                          Your performance report has been created and is ready for download.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
