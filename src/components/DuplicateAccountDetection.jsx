import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { AlertTriangle, Shield, X, Ban } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'motion/react';

export function DuplicateAccountDetection({ cnicNumber, existingAccountName = 'John Doe', onClose, onContactSupport }) {
  const { isDarkMode } = useTheme();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: showAnimation ? 1 : 0.9, opacity: showAnimation ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={`w-full max-w-md ${isDarkMode ? 'bg-[#2A3642] border-red-700' : 'bg-white border-red-300'} border-2`}>
          <CardContent className="p-8">
            {/* Warning Icon with Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6 text-center"
            >
              <div className="relative inline-block">
                {/* Pulsing Background */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.2, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 -m-4 bg-red-500 rounded-full blur-xl"
                />
                
                {/* Icon Container */}
                <div className="relative size-24 mx-auto rounded-full bg-red-600 flex items-center justify-center">
                  <Ban className="size-16 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-6"
            >
              <h2 className={`text-2xl font-bold mb-2 text-red-600`}>
                Duplicate Identity Detected!
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                This CNIC is already registered on Skillora
              </p>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`p-5 rounded-lg border-2 mb-6 ${
                isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className={`text-sm font-medium mb Ascending1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2937]'}`}>
                    CNIC Already Linked
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    This CNIC number is already linked to an existing account. Each CNIC can only be registered once.
                  </p>
                </div>
              </div>

              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1F2937]' : 'bg-white'}`}>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>CNIC Number:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2937]'}`}>
                      {cnicNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Existing Account:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2937]'}`}>
                      {existingAccountName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Status:</span>
                    <span className="font-medium text-red-600">Access Restricted</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Security Notice */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`p-4 rounded-lg mb-6 ${
                isDarkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <Shield className="size-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                <div>
                  <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2937]'}`}>
                    Security Measure
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    This is a security measure to prevent fraud and identity theft. If you believe this is an error, please contact our support team.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              {onContactSupport && (
                <Button
                  onClick={onContactSupport}
                  className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]"
                >
                  Contact Support
                </Button>
              )}
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full"
              >
                {onContactSupport ? 'Close' : 'Go Back'}
              </Button>
            </motion.div>

            {/* Additional Info */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className={`text-xs text-center mt-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
            >
              For security reasons, registration cannot proceed with a duplicate CNIC.
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Component to trigger duplicate detection during registration
export function useDuplicateDetection() {
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [duplicateData, setDuplicateData] = useState(null);

  // Simulated CNIC database (in real app, this would be a backend check)
  const existingCNICs = new Map([
    ['12345-1234567-1', 'Ahmed Khan'],
    ['42101-1234567-1', 'Sara Ali'],
    ['35202-9876543-2', 'Muhammad Hassan'],
  ]);

  const checkForDuplicate = (cnicNumber) => {
    const cleanedCNIC = cnicNumber.replace(/\s/g, '');
    if (existingCNICs.has(cleanedCNIC)) {
      setDuplicateData({
        cnic: cleanedCNIC,
        existingName: existingCNICs.get(cleanedCNIC) || 'Unknown User'
      });
      setShowDuplicateAlert(true);
      return true;
    }
    return false;
  };

  const closeDuplicateAlert = () => {
    setShowDuplicateAlert(false);
    setDuplicateData(null);
  };

  return {
    showDuplicateAlert,
    duplicateData,
    checkForDuplicate,
    closeDuplicateAlert
  };
}


/*Yeh file duplicate CNIC detect karke user ko alert/show karti hai aur registration ko block karti hai (security & fraud prevention).
Type: Yeh web-based application ke liye hai (React frontend), mobile ke liye directly nahi. */
