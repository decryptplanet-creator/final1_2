import { useState } from 'react';
import { X, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useTheme } from '../contexts/ThemeContext';

export function ChangePasswordModal({ onClose }) {
  const { isDarkMode } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    alert('Password changed successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className={`w-full max-w-md rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              title="Back to Settings"
            >
              <ArrowLeft className="size-5" />
            </button>
            <Lock className="size-6 text-[#1a4d4d]" />
            <h2 className="text-xl">Change Password</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Current Password */}
          <div>
            <Label htmlFor="current" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              Current Password
            </Label>
            <div className="relative mt-1">
              <Input
                id="current"
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white pr-10' : 'bg-white border-gray-300 text-gray-900 pr-10'}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <Label htmlFor="new" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              New Password
            </Label>
            <div className="relative mt-1">
              <Input
                id="new"
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white pr-10' : 'bg-white border-gray-300 text-gray-900 pr-10'}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
          </div>

          {/* Confirm New Password */}
          <div>
            <Label htmlFor="confirm" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              Confirm New Password
            </Label>
            <div className="relative mt-1">
              <Input
                id="confirm"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white pr-10' : 'bg-white border-gray-300 text-gray-900 pr-10'}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#1a4d4d] hover:bg-[#1e5252]"
            >
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* Purpose: This file provides a UI modal for users to securely change their password with validation (match & length).

Type: It is a frontend component, mainly for web apps but can also work in hybrid/mobile apps using React-based frameworks.*/