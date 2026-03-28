import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Shield, Lock, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from './ui/labelstatus';
import { Switch } from './ui/switch/On&Off control';

export function SecurityPrivacyModal({ onClose, userType }) {
  const [activeTab, setActiveTab] = useState('security');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  // Privacy settings
  const [settings, setSettings] = useState({
    profileVisibility: true,
    showEmail: false,
    showLocation: true,
    allowMessages: true,
    showRating: true,
    dataSharing: false
  });

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill all password fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    // Simulate password change
    console.log('Password changed successfully');
    setPasswordChanged(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      setPasswordChanged(false);
    }, 3000);
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="max-w-3xl w-full my-8 bg-gray-900 border-gray-800">
        <CardHeader className="border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="size-5 text-red-600" />
              <div>
                <CardTitle className="text-white">Security & Privacy</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your account security and privacy settings
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="size-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-800">
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 font-medium transition-colors relative ${
                activeTab === 'security' ? 'text-red-400' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Security
              {activeTab === 'security' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-4 py-2 font-medium transition-colors relative ${
                activeTab === 'privacy' ? 'text-red-400' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Privacy
              {activeTab === 'privacy' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
              )}
            </button>
          </div>

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Account Status */}
              <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-5 text-green-600" />
                  <div>
                    <p className="text-green-400 font-semibold">Account Secure</p>
                    <p className="text-sm text-gray-400">Your account is verified and protected</p>
                  </div>
                </div>
              </div>

              {/* Change Password */}
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Lock className="size-5" />
                  Change Password
                </h3>
                
                {passwordChanged && (
                  <div className="mb-4 bg-green-600/10 border border-green-600/30 rounded-lg p-3">
                    <p className="text-green-400 text-sm flex items-center gap-2">
                      <CheckCircle className="size-4" />
                      Password changed successfully!
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Current Password</label>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="bg-gray-800 border-gray-700 text-white pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">New Password</label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min 8 characters)"
                        className="bg-gray-800 border-gray-700 text-white pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Confirm New Password</label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <Button
                    onClick={handleChangePassword}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    Update Password
                  </Button>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div>
                <h3 className="text-white font-semibold mb-4">Two-Factor Authentication</h3>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white mb-1">Enable 2FA</p>
                      <p className="text-sm text-gray-400">Add an extra layer of security</p>
                    </div>
                    <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30">
                      Coming Soon
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Login History */}
              <div>
                <h3 className="text-white font-semibold mb-4">Recent Login Activity</h3>
                <div className="space-y-2">
                  {[
                    { device: 'Chrome on Windows', location: 'Karachi, Pakistan', time: '2 hours ago', current: true },
                    { device: 'Safari on iPhone', location: 'Lahore, Pakistan', time: 'Yesterday', current: false },
                  ].map((login, idx) => (
                    <div key={idx} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm">{login.device}</p>
                          <p className="text-xs text-gray-400">{login.location} • {login.time}</p>
                        </div>
                        {login.current && (
                          <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                            Current
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              {/* Privacy Info */}
              <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="size-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-blue-400 font-semibold">Your Privacy Matters</p>
                    <p className="text-sm text-gray-400">Control who can see your information and how it's used</p>
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="space-y-4">
                <SettingToggle
                  title="Profile Visibility"
                  description="Make your profile visible to others on the platform"
                  enabled={settings.profileVisibility}
                  onToggle={() => toggleSetting('profileVisibility')}
                />
                <SettingToggle
                  title="Show Email Address"
                  description="Allow others to see your email on your profile"
                  enabled={settings.showEmail}
                  onToggle={() => toggleSetting('showEmail')}
                />
                <SettingToggle
                  title="Show Location"
                  description="Display your city/location to other users"
                  enabled={settings.showLocation}
                  onToggle={() => toggleSetting('showLocation')}
                />
                <SettingToggle
                  title="Allow Direct Messages"
                  description="Let others send you messages through the platform"
                  enabled={settings.allowMessages}
                  onToggle={() => toggleSetting('allowMessages')}
                />
                <SettingToggle
                  title="Show Ratings & Reviews"
                  description="Display your ratings and reviews publicly"
                  enabled={settings.showRating}
                  onToggle={() => toggleSetting('showRating')}
                />
                <SettingToggle
                  title="Data Sharing"
                  description="Share anonymized data for platform improvement"
                  enabled={settings.dataSharing}
                  onToggle={() => toggleSetting('dataSharing')}
                />
              </div>

              {/* Data Management */}
              <div>
                <h3 className="text-white font-semibold mb-4">Data Management</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-gray-800 border-gray-700 text-gray-300"
                  >
                    Download My Data
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-gray-800 border-gray-700 text-gray-300"
                  >
                    Request Account Data Deletion
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SettingToggle({ title, description, enabled, onToggle }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex-1 pr-4">
          <p className="text-white font-medium mb-1">{title}</p>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-red-600"
        />
      </div>
    </div>
  );
}
/* Purpose: This file creates a Security & Privacy settings modal where users can change passwords and control privacy options.
Platform: Web-based (React UI), but can be used for both web and app if adapted (React Native / hybrid). */