import { useState } from 'react';
import { X, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';

export function DeactivateAccountModal({ onClose, onConfirm }) {
  const { isDarkMode } = useTheme();
  const [confirmation, setConfirmation] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleDeactivate = () => {
    setError('');

    if (confirmation.toLowerCase() !== 'deactivate') {
      setError('Please type "DEACTIVATE" to confirm');
      return;
    }

    if (!reason.trim()) {
      setError('Please provide a reason for deactivation');
      return;
    }

    // Simulate deactivation
    onConfirm();
  };

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
                  Deactivate Account
                </CardTitle>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  This action requires confirmation
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
        <CardContent className="space-y-4">
          {/* Warning */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className={`size-6 flex-shrink-0 ${isDarkMode ? 'text-red-400' : 'text-red-700'}`} />
              <div>
                <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                  Warning: Account Deactivation
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
                  Deactivating your account will:
                </p>
                <ul className={`text-sm mt-2 space-y-1 ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
                  <li>• Disable your profile visibility</li>
                  <li>• Cancel all pending orders</li>
                  <li>• Remove you from search results</li>
                  <li>• Prevent new interactions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <Label className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>
              Reason for Deactivation
            </Label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please tell us why you're leaving (required)"
              className={`w-full mt-2 p-3 rounded-lg border ${
                isDarkMode 
                  ? 'bg-[#1F2933] border-gray-700 text-white placeholder:text-gray-500' 
                  : 'bg-white border-gray-300 text-[#1F2933] placeholder:text-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-[#2563EB]`}
              rows={3}
            />
          </div>

          {/* Confirmation */}
          <div>
            <Label className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>
              Type "DEACTIVATE" to confirm
            </Label>
            <Input
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="DEACTIVATE"
              className={`mt-2 ${
                isDarkMode 
                  ? 'bg-[#1F2933] border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-[#1F2933]'
              }`}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                {error}
              </p>
            </div>
          )}

          {/* Info */}
          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
            <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
              💡 You can reactivate your account anytime by logging in again.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className={`flex-1 ${isDarkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-[#1F2933]'}`}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeactivate}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Deactivate Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* Purpose: This file creates a account deactivation confirmation modal with warning, reason input, and security confirmation.

Type: It is mainly for web-based apps (React UI) but can also be used in hybrid/mobile apps (so usable for both).

 */