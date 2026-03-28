// R.1.18: AI Communication Monitoring
// R.1.22: Administrative Actions
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  AlertTriangle, Ban, CheckCircle, AlertCircle, UserX, FileWarning, X
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function AIMonitorAlert({ message, type, onClose, onEscalate }) {
  const { isDarkMode } = useTheme();
  
  const alertConfig = {
    abusive: {
      icon: <AlertTriangle className="size-5" />,
      title: 'Abusive Language Detected',
      color: 'text-red-600',
      bgColor: isDarkMode ? 'bg-red-900/20' : 'bg-red-50',
      borderColor: 'border-red-500',
      description: 'Our AI system has detected potentially abusive or inappropriate language in the conversation.',
    },
    fraud: {
      icon: <Ban className="size-5" />,
      title: 'Potential Fraud Attempt Detected',
      color: 'text-red-600',
      bgColor: isDarkMode ? 'bg-red-900/20' : 'bg-red-50',
      borderColor: 'border-red-500',
      description: 'Our AI system has detected suspicious patterns that may indicate fraudulent activity.',
    },
    misunderstanding: {
      icon: <AlertCircle className="size-5" />,
      title: 'Potential Misunderstanding Detected',
      color: 'text-yellow-600',
      bgColor: isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      description: 'Our AI system has detected potential confusion or misunderstanding in the conversation.',
    },
    clear: {
      icon: <CheckCircle className="size-5" />,
      title: 'Communication Clear',
      color: 'text-green-600',
      bgColor: isDarkMode ? 'bg-green-900/20' : 'bg-green-50',
      borderColor: 'border-green-500',
      description: 'All communications are professional and clear.',
    },
  };

  const config = alertConfig[type];

  return (
    <div className={`border-2 rounded-lg p-4 mb-4 ${config.bgColor} ${config.borderColor}`}>
      <div className="flex items-start gap-3">
        <div className={config.color}>{config.icon}</div>
        <div className="flex-1">
          <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{config.title}</h4>
          <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{config.description}</p>
          <p className={`text-sm p-2 rounded ${isDarkMode ? 'bg-[#1F2933]' : 'bg-white'} ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            "{message}"
          </p>
          {(type === 'abusive' || type === 'fraud') && (
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={onClose}>
                Dismiss
              </Button>
              <Button size="sm" className="bg-[#2563EB] hover:bg-[#1d4ed8]" onClick={onEscalate}>
                <FileWarning className="size-4 mr-2" />
                Report to Admin
              </Button>
            </div>
          )}
        </div>
        {type === 'clear' && (
          <button onClick={onClose} className={isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}>
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// R.1.22: Administrative Actions Panel
export function AdminActionsPanel({ userId, userName, violationType, onClose }) {
  const { isDarkMode } = useTheme();
  const [actionTaken, setActionTaken] = useState(null);
  const [notes, setNotes] = useState('');

  const handleAction = (action) => {
    // R.1.22: Admin can issue warnings, suspend, or terminate accounts
    setActionTaken(action);
    
    // Log admin action
    console.log({
      userId,
      userName,
      action,
      violationType,
      notes,
      timestamp: new Date().toISOString(),
      adminId: 'ADMIN_001'
    });
  };

  if (actionTaken) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className={`w-full max-w-md ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardContent className="p-8 text-center">
            <div className={`size-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
              <CheckCircle className="size-8 text-green-600" />
            </div>
            <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              Action Completed
            </h3>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {actionTaken === 'warn' && `Warning issued to ${userName}`}
              {actionTaken === 'suspend' && `Account suspended for ${userName}`}
              {actionTaken === 'terminate' && `Account permanently terminated for ${userName}`}
            </p>
            <div className={`text-left p-4 rounded-lg mb-4 ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <strong>User ID:</strong> {userId}<br/>
                <strong>Violation:</strong> {violationType}<br/>
                <strong>Action:</strong> {actionTaken.toUpperCase()}<br/>
                <strong>Timestamp:</strong> {new Date().toLocaleString()}
              </p>
            </div>
            <Button onClick={onClose} className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className={`w-full max-w-2xl ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardHeader className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>Administrative Action Required</CardTitle>
              <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                User: {userName} (ID: {userId})
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  Violation Type: {violationType.replace(/_/g, ' ').toUpperCase()}
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  This user requires administrative review and potential action.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className={`text-sm font-medium mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>
              Admin Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this action..."
              className={`w-full p-3 rounded-lg border text-sm ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>Select Action:</h4>
            
            {/* Warning */}
            <Card 
              className={`cursor-pointer transition-colors ${isDarkMode ? 'bg-[#1F2933] border-gray-700 hover:border-yellow-500' : 'bg-gray-50 border-gray-200 hover:border-yellow-500'}`}
              onClick={() => handleAction('warn')}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <div className={`size-10 rounded-full flex items-center justify-center flex-shrink-0 ${isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
                  <AlertCircle className="size-5 text-yellow-600" />
                </div>
                <div>
                  <h5 className={`font-medium mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Issue Warning</h5>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Send a formal warning to the user. Account remains active but marked.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Suspension */}
            <Card 
              className={`cursor-pointer transition-colors ${isDarkMode ? 'bg-[#1F2933] border-gray-700 hover:border-orange-500' : 'bg-gray-50 border-gray-200 hover:border-orange-500'}`}
              onClick={() => handleAction('suspend')}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <div className={`size-10 rounded-full flex items-center justify-center flex-shrink-0 ${isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50'}`}>
                  <UserX className="size-5 text-orange-600" />
                </div>
                <div>
                  <h5 className={`font-medium mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Suspend Account</h5>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Temporarily suspend account access for 30 days. Can be reactivated after review.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card 
              className={`cursor-pointer transition-colors ${isDarkMode ? 'bg-[#1F2933] border-gray-700 hover:border-red-500' : 'bg-gray-50 border-gray-200 hover:border-red-500'}`}
              onClick={() => handleAction('terminate')}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <div className={`size-10 rounded-full flex items-center justify-center flex-shrink-0 ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
                  <Ban className="size-5 text-red-600" />
                </div>
                <div>
                  <h5 className={`font-medium mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Terminate Account</h5>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Permanently terminate account. This action cannot be undone.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// R.1.18: AI Communication Monitor - Real-time component
export function AICommMonitor({ messages }) {
  const [alerts, setAlerts] = useState([]);
  
  useEffect(() => {
    // Simulate AI monitoring of each message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      analyzeMessage(lastMessage);
    }
  }, [messages]);

  const analyzeMessage = (message) => {
    // AI analysis logic (simplified simulation)
    const abusiveKeywords = ['idiot', 'stupid', 'fool', 'cheat'];
    const fraudKeywords = ['offline payment', 'outside platform', 'direct transfer', 'WhatsApp'];
    const confusionKeywords = ['confused', 'don\'t understand', 'unclear', 'what do you mean'];
    
    let alertType = 'clear';
    
    if (abusiveKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
      alertType = 'abusive';
    } else if (fraudKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
      alertType = 'fraud';
    } else if (confusionKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
      alertType = 'misunderstanding';
    }
    
    if (alertType !== 'clear') {
      setAlerts(prev => [...prev, { type: alertType, message, id: Date.now() }]);
    }
  };

  const handleCloseAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleEscalate = (message) => {
    alert(`Escalated to admin: "${message}"`);
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {alerts.map(alert => (
        <AIMonitorAlert
          key={alert.id}
          type={alert.type}
          message={alert.message}
          onClose={() => handleCloseAlert(alert.id)}
          onEscalate={() => handleEscalate(alert.message)}
        />
      ))}
    </div>
  );
}


/* Purpose: AI-based communication monitoring + admin control system jo messages ko analyze karke abusive/fraud detect karta hai aur admin ko actions (warn, suspend, terminate) lene deta hai.
Type: React component hai, is liye web-based hai (browser app), lekin same logic mobile app me bhi reuse ho sakta hai.*/