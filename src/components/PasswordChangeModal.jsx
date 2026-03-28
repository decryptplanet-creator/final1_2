import { useState } from 'react';
import { X, Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';

export function PasswordChangeModal({ onClose }) {
  const { isDarkMode } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    // Simulate password change
    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1000);
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className={`max-w-md w-full ${isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'}`}>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="mx-auto size-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="size-8 text-white" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                Password Changed Successfully!
              </h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Your password has been updated. You can now use your new password to login.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`max-w-md w-full ${isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
              >
                <ArrowLeft className="size-5" />
              </Button>
              <div>
                <CardTitle className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>
                  Change Password
                </CardTitle>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Update your account password
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
            >
              <X className="size-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <Label className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>
                Current Password
              </Label>
              <div className="relative mt-2">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <Input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className={`pl-10 pr-10 ${
                    isDarkMode 
                      ? 'bg-[#1F2933] border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-[#1F2933]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                    isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <Label className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>
                New Password
              </Label>
              <div className="relative mt-2">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  className={`pl-10 pr-10 ${
                    isDarkMode 
                      ? 'bg-[#1F2933] border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-[#1F2933]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                    isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <Label className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>
                Confirm New Password
              </Label>
              <div className="relative mt-2">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className={`pl-10 pr-10 ${
                    isDarkMode 
                      ? 'bg-[#1F2933] border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-[#1F2933]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                    isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                  {error}
                </p>
              </div>
            )}

            {/* Password Requirements */}
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
              <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                Password Requirements:
              </p>
              <ul className={`text-xs space-y-1 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                <li>• At least 6 characters long</li>
                <li>• Should not match your current password</li>
                <li>• Use a combination of letters and numbers for better security</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className={`flex-1 ${isDarkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-[#1F2933]'}`}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
/*User apna password change karne ke liye modal (form + validation + success message) use karta hai.

Yeh web-based React component hai, lekin concept mobile app me bhi use ho sakta hai (dono ke liye). */