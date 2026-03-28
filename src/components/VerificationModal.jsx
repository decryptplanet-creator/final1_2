import { X, Shield, CheckCircle, Clock, FileText, Camera, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTheme } from '../contexts/ThemeContext';

export function VerificationInfoModal({ onClose, userType = 'client' }) {
  const { isDarkMode } = useTheme();

  const verificationSteps = {
    client: [
      { icon: FileText, title: 'Legal Documents', description: 'Business registration and license', status: 'verified' },
      { icon: FileText, title: 'Order History', description: 'Previous order documentation', status: 'verified' },
      { icon: Camera, title: 'CNIC + Selfie', description: 'Identity verification', status: 'verified' },
      { icon: MapPin, title: 'Location Verification', description: 'Business address confirmation', status: 'pending' }
    ],
    manufacturer: [
      { icon: FileText, title: 'Legal Documents', description: 'Factory registration and permits', status: 'verified' },
      { icon: FileText, title: 'PPC Law Affidavit', description: 'PPC compliance documentation', status: 'verified' },
      { icon: Camera, title: 'CNIC + Selfie', description: 'Identity verification', status: 'verified' },
      { icon: Shield, title: 'Factory Inspection', description: 'On-site verification', status: 'pending' }
    ],
    labour: [
      { icon: Camera, title: 'Skills Verification', description: 'Photos/videos of work', status: 'verified' },
      { icon: Camera, title: 'CNIC + Selfie', description: 'Identity verification', status: 'verified' },
      { icon: FileText, title: 'Experience Certificate', description: 'Work history proof', status: 'verified' },
      { icon: MapPin, title: 'Location Verification', description: 'Current location confirmation', status: 'verified' }
    ]
  };

  const steps = verificationSteps[userType];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className={`w-full max-w-2xl rounded-lg shadow-xl max-h-[90vh] overflow-hidden ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
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
            <Shield className="size-6 text-green-500" />
            <div>
              <h2 className="text-xl">Verification Status</h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Your account verification details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Verification Steps */}
        <div className="p-6">
          {/* Overall Status */}
          <div className={`p-4 rounded-lg mb-6 ${
            isDarkMode ? 'bg-green-950/30 border border-green-900' : 'bg-green-50 border border-green-200'
          }`}>
            <div className="flex items-center gap-3">
              <CheckCircle className="size-8 text-green-500" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-500">Account Verified</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Your account has been verified and is active on Skillora
                </p>
              </div>
              <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                Trust in Every Talent
              </Badge>
            </div>
          </div>

          {/* Verification Steps List */}
          <div className="space-y-3">
            <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Verification Checklist
            </h3>
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`size-10 rounded-full flex items-center justify-center ${
                      step.status === 'verified'
                        ? 'bg-green-600/20 border border-green-600/30'
                        : 'bg-yellow-600/20 border border-yellow-600/30'
                    }`}>
                      <Icon className={`size-5 ${
                        step.status === 'verified' ? 'text-green-400' : 'text-yellow-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                        {step.title}
                      </h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {step.description}
                      </p>
                    </div>
                    {step.status === 'verified' ? (
                      <CheckCircle className="size-5 text-green-500" />
                    ) : (
                      <Clock className="size-5 text-yellow-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Info */}
          <div className={`mt-6 p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong>Note:</strong> Verified accounts have higher visibility and trust on Skillora. 
              Complete all verification steps to unlock premium features.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-6 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <Button onClick={onClose} className="w-full bg-[#1a4d4d] hover:bg-[#1e5252]">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
/* Shows user verification status with checklist (documents, CNIC, location, etc.) and overall account trust status.

This is web-based (React UI) but can be reused in hybrid/mobile apps → so dono (web + app). */