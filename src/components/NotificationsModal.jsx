import { X, Bell, Package, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';

export function NotificationsModal({ onClose }) {
  const { isDarkMode } = useTheme();
  
  const notifications = [
    {
      id: '1',
      type: 'order',
      title: 'New Order Received',
      message: 'Cotton Shirts Manufacturing - 500 units',
      time: '5 min ago',
      read: false,
    },
    {
      id: '2',
      type: 'message',
      title: 'New Message',
      message: 'ABC Textiles sent you a message',
      time: '1 hour ago',
      read: false,
    },
    {
      id: '3',
      type: 'success',
      title: 'Payment Released',
      message: 'PKR 75,000 has been released to your account',
      time: '2 hours ago',
      read: true,
    },
    {
      id: '4',
      type: 'alert',
      title: 'Deadline Approaching',
      message: 'Leather Bags Production - 2 days remaining',
      time: '5 hours ago',
      read: true,
    },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'order':
        return <Package className="size-5 text-[#2563EB]" />;
      case 'message':
        return <MessageSquare className="size-5 text-[#2563EB]" />;
      case 'success':
        return <CheckCircle className="size-5 text-green-500" />;
      case 'alert':
        return <AlertCircle className="size-5 text-yellow-500" />;
      default:
        return <Bell className="size-5 text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl rounded-lg shadow-xl ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <Bell className="size-6 text-[#2563EB]" />
            <h2 className="text-2xl">Notifications</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-6 max-h-[600px] overflow-y-auto">
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                  isDarkMode 
                    ? notification.read 
                      ? 'bg-gray-900 border-gray-800 hover:bg-gray-800' 
                      : 'bg-gray-800 border-gray-700 hover:bg-gray-750'
                    : notification.read
                      ? 'bg-white border-gray-200 hover:bg-gray-50'
                      : 'bg-[#2563EB]/5 border-[#2563EB]/20 hover:bg-[#2563EB]/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className={`font-medium ${!notification.read && 'text-[#2563EB]'}`}>
                        {notification.title}
                      </h3>
                      <span className={`text-xs ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        {notification.time}
                      </span>
                    </div>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {notification.message}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="size-2 rounded-full bg-[#2563EB] mt-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <Button 
            onClick={onClose} 
            className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

/*User ko app ke notifications (orders, messages, alerts, payments) list form me show karta hai.

Yeh web-based React component hai, lekin hybrid/mobile apps me bhi use ho sakta hai (dono ke liye). */