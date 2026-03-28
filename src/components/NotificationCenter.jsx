import { useState } from 'react';
import { Bell, CheckCircle, DollarSign, Star, AlertTriangle, X, FileText } from 'lucide-react';
import { Badge } from './ui/labelstatus';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';

export function NotificationCenter({ userType }) {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'verification',
      title: 'Verification Complete',
      message: 'Your CNIC & Affidavit have been verified. Welcome aboard!',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Released',
      message: '30% Advance released to Manufacturer for Order #102.',
      time: '5 hours ago',
      read: false,
    },
    {
      id: '3',
      type: 'trust-score',
      title: 'Trust Score Updated',
      message: 'AI Notice: Your trust score increased to 94 based on latest feedback.',
      time: '1 day ago',
      read: false,
    },
    {
      id: '4',
      type: 'dispute',
      title: 'Dispute Alert',
      message: 'A dispute has been raised regarding Order #105. Please review.',
      time: '2 days ago',
      read: true,
    },
    {
      id: '5',
      type: 'order',
      title: 'New Order Received',
      message: 'You have received a new order request. Check details now.',
      time: '3 days ago',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'verification':
        return <CheckCircle className="size-5 text-green-600" />;
      case 'payment':
        return <DollarSign className="size-5 text-[#2563EB]" />;
      case 'trust-score':
        return <Star className="size-5 text-yellow-500" />;
      case 'dispute':
        return <AlertTriangle className="size-5 text-red-600" />;
      case 'order':
        return <FileText className="size-5 text-[#2563EB]" />;
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="relative">
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-colors ${
          isDarkMode 
            ? 'hover:bg-gray-800 text-gray-300' 
            : 'hover:bg-gray-100 text-gray-700'
        }`}
        title="Notifications"
      >
        <Bell className="size-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 size-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Panel */}
          <div 
            className={`absolute right-0 top-12 w-96 max-h-[500px] rounded-lg shadow-2xl border z-50 overflow-hidden ${
              isDarkMode 
                ? 'bg-[#2A3642] border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
            style={{
              animation: 'slideDown 0.2s ease-out',
            }}
          >
            {/* Header */}
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                  Notifications
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                >
                  <X className="size-4" />
                </Button>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-[#2563EB] hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto max-h-[400px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className={`size-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    No notifications yet
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b cursor-pointer transition-colors relative group ${
                      isDarkMode 
                        ? 'border-gray-700 hover:bg-gray-800' 
                        : 'border-gray-100 hover:bg-gray-50'
                    } ${!notification.read ? (isDarkMode ? 'bg-[#2563EB]/10' : 'bg-blue-50') : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearNotification(notification.id);
                      }}
                      className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ${
                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                      }`}
                    >
                      <X className={`size-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    </button>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={`font-medium text-sm ${
                            isDarkMode ? 'text-white' : 'text-[#1F2933]'
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="size-2 bg-[#2563EB] rounded-full flex-shrink-0 mt-1.5"></span>
                          )}
                        </div>
                        <p className={`text-sm mb-2 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                        <span className={`text-xs ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className={`p-3 border-t text-center ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <button className="text-sm text-[#2563EB] hover:underline">
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
/*Purpose: Yeh file notification center banata hai jahan user ko alerts (orders, payments, verification, etc.) milte hain aur manage (read/delete) kar sakta hai.
Type: React component hai, is liye mainly web-based, lekin same logic React Native me use ho sakta hai (dono ke liye adaptable). */