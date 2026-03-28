import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch/On&Off control';
import { Slider } from './ui/slider';
import { Badge } from './ui/labelstatus';
import { 
  X, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Palette, 
  Lock, 
  UserX, 
  ChevronRight,
  Mail,
  MessageSquare,
  CreditCard,
  TrendingUp,
  SunDim
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { PasswordChangeModal } from './PasswordChangeModal';
import { SecurityPrivacyModal } from './PrivacySetting';
import { DeactivateAccountModal } from './DeactivateAccountModal';

export function SettingsModal({ onClose, userType, currentUser, onProfileUpdate }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showSecurityPrivacy, setShowSecurityPrivacy] = useState(false);
  const [showDeactivateAccount, setShowDeactivateAccount] = useState(false);
  const [brightness, setBrightness] = useState([80]);
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    messages: true,
    payments: true,
    marketing: false
  });

  const handleBrightnessChange = (value) => {
    setBrightness(value);
    // Apply brightness to the entire app
    document.documentElement.style.filter = `brightness(${value[0]}%)`;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <Card className={`max-w-2xl w-full my-8 ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>
                  Settings
                </CardTitle>
                <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Manage your account preferences
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className={isDarkMode ? 'text-gray-400 hover:text-[#F9FAFB]' : 'text-gray-400 hover:text-[#1F2933]'}
              >
                <X className="size-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Appearance Settings */}
            <div className="space-y-4">
              <h3 className={`text-lg font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                Appearance
              </h3>

              {/* Dark Mode Toggle */}
              <div className={`flex items-center justify-between p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-[#1F2933]' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  {isDarkMode ? (
                    <Moon className="size-5 text-[#2563EB]" />
                  ) : (
                    <SunDim className="size-5 text-[#2563EB]" />
                  )}
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                      Dark Mode
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Switch between light and dark theme
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={isDarkMode} 
                  onCheckedChange={toggleTheme}
                  className="data-[state=checked]:bg-[#2563EB]"
                />
              </div>

              {/* Brightness Control */}
              <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-[#1F2933]' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <SunDim className="size-5 text-[#2563EB]" />
                  <div className="flex-1">
                    <p className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                      Brightness
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Adjust screen brightness across all screens
                    </p>
                  </div>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                    {brightness[0]}%
                  </span>
                </div>
                <Slider
                  value={brightness}
                  onValueChange={handleBrightnessChange}
                  max={100}
                  min={30}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>

            {/* Notification Settings */}
            <div className="space-y-4">
              <h3 className={`text-lg font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                Notifications
              </h3>

              <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-[#1F2933]' : 'border-gray-200 bg-gray-50'}`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="size-5 text-[#2563EB]" />
                      <div>
                        <p className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                          Order Updates
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Get notified about order status changes
                        </p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.orderUpdates} 
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, orderUpdates: checked})
                      }
                      className="data-[state=checked]:bg-[#2563EB]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <Bell className="size-5 text-[#2563EB]" />
                      <div>
                        <p className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                          Messages
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Get notified about new messages
                        </p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.messages} 
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, messages: checked})
                      }
                      className="data-[state=checked]:bg-[#2563EB]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <Bell className="size-5 text-[#2563EB]" />
                      <div>
                        <p className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                          Payment Alerts
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Get notified about payment activities
                        </p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.payments} 
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, payments: checked})
                      }
                      className="data-[state=checked]:bg-[#2563EB]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Account & Security */}
            <div className="space-y-4">
              <h3 className={`text-lg font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                Account & Security
              </h3>

              <div className="space-y-2">
                {/* Change Password */}
                <button
                  onClick={() => setShowChangePassword(true)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'border-gray-700 bg-[#1F2933] hover:border-[#2563EB]' 
                      : 'border-gray-200 bg-gray-50 hover:border-[#2563EB]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Lock className="size-5 text-[#2563EB]" />
                    <div className="text-left">
                      <p className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                        Change Password
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Update your account password
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-[#2563EB]" />
                </button>

                {/* Security & Privacy */}
                <button
                  onClick={() => setShowSecurityPrivacy(true)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'border-gray-700 bg-[#1F2933] hover:border-[#2563EB]' 
                      : 'border-gray-200 bg-gray-50 hover:border-[#2563EB]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Shield className="size-5 text-[#2563EB]" />
                    <div className="text-left">
                      <p className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                        Security & Privacy
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Manage your security settings
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-[#2563EB]" />
                </button>

                {/* Deactivate Account */}
                <button
                  onClick={() => setShowDeactivateAccount(true)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'border-red-500/30 bg-red-500/10 hover:border-red-500' 
                      : 'border-red-200 bg-red-50 hover:border-red-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserX className="size-5 text-red-600" />
                    <div className="text-left">
                      <p className="font-medium text-red-600">
                        Deactivate Account
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                        Temporarily disable your account
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-red-600" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={onClose}
                className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
              >
                Done
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sub-Modals */}
      {showChangePassword && (
        <PasswordChangeModal onClose={() => setShowChangePassword(false)} />
      )}

      {showSecurityPrivacy && (
        <SecurityPrivacyModal 
          onClose={() => setShowSecurityPrivacy(false)}
          userType={userType}
        />
      )}

      {showDeactivateAccount && (
        <DeactivateAccountModal 
          onClose={() => setShowDeactivateAccount(false)}
          onConfirm={() => {
            setShowDeactivateAccount(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
/* Purpose: This file creates a Settings modal where users manage theme, notifications, security, and account options.
Platform: Web-based (React UI), but can be used for both web and app (if adapted with React Native). */