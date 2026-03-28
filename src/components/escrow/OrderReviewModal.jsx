import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { X, Video, Image as ImageIcon, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function OrderReviewModal({ onClose, order, onProceedToPayment }) {
  const { isDarkMode } = useTheme();
  const [reviewCompleted, setReviewCompleted] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);

  const handleProceed = () => {
    if (reviewCompleted) {
      onProceedToPayment();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className={`max-w-3xl w-full my-8 ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardHeader className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>
                Order Ready for Review
              </CardTitle>
              <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Review your order before final payment
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
          {/* Order Summary */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
            <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              Order Summary
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Product:</span>
                <span className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>{order.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Quantity:</span>
                <span className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>{order.quantity} units</span>
              </div>
            </div>
          </div>

          {/* Order Preview Images */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="size-5 text-[#2563EB]" />
              <h3 className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                Order Preview - Manufacturing Quality
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Stitching Quality */}
              <div className="space-y-2">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1759310224719-ab86f84245b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXh0aWxlJTIwbWFudWZhY3R1cmluZyUyMHN0aXRjaGluZ3xlbnwxfHx8fDE3Njk0MDQxOTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Stitching Quality"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Premium Stitching
                </p>
              </div>

              {/* Cutting & Fabric */}
              <div className="space-y-2">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1673201230274-c4dbd20c3f79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWJyaWMlMjBjdXR0aW5nJTIwZ2FybWVudHxlbnwxfHx8fDE3Njk0MDQxOTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Fabric Cutting"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Precision Cutting
                </p>
              </div>

              {/* Packing */}
              <div className="space-y-2">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1700165644892-3dd6b67b25bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWNraW5nJTIwd2FyZWhvdXNlJTIwYm94ZXN8ZW58MXx8fHwxNzY5NDA0MTk4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Professional Packing"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Secure Packing
                </p>
              </div>

              {/* Finished Product - Jacket */}
              <div className="space-y-2">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1587374835842-eb10d35a0725?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYWNrZXQlMjBtYW51ZmFjdHVyaW5nJTIwcHJvZHVjdHxlbnwxfHx8fDE3Njk0MDQxOTl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Finished Jacket"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Finished Product
                </p>
              </div>

              {/* Quality Control */}
              <div className="space-y-2">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1768796372175-b4495c84a085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWFsaXR5JTIwY29udHJvbCUyMGluc3BlY3Rpb258ZW58MXx8fHwxNzY5MzgzMDc3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Quality Control"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Quality Inspection
                </p>
              </div>

              {/* Final Product - Shirt */}
              <div className="space-y-2">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1768734831178-4898bca7225c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGlydCUyMHByb2R1Y3QlMjBnYXJtZW50fGVufDF8fHx8MTc2OTQwNDE5OXww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Finished Shirt"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Complete Garment
                </p>
              </div>
            </div>
          </div>

          {/* Video Call Option */}
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-[#1F2933]' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
                  <Video className="size-5 text-[#2563EB]" />
                </div>
                <div>
                  <h4 className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                    Live Video Inspection
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Request a live video call with manufacturer
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowVideoCall(!showVideoCall)}
                className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
              >
                <Video className="size-4 mr-2" />
                Join Video Call
              </Button>
            </div>
          </div>

          {/* Review Confirmation */}
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-[#1F2933]' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-start gap-3">
              <Checkbox 
                id="review-completed"
                checked={reviewCompleted}
                onCheckedChange={(checked) => setReviewCompleted(checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <label 
                  htmlFor="review-completed" 
                  className={`font-medium cursor-pointer ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}
                >
                  I have reviewed the order
                </label>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  By checking this box, you confirm that you have reviewed the order and are ready to proceed with final payment.
                </p>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          {!reviewCompleted && (
            <div className={`flex items-start gap-3 p-4 rounded-lg ${isDarkMode ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-200'}`}>
              <AlertTriangle className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-700">
                Please review the order carefully before proceeding to final payment. Once payment is released, it cannot be reversed.
              </p>
            </div>
          )}

          {/* Success Message */}
          {reviewCompleted && (
            <div className={`flex items-center gap-3 p-4 rounded-lg ${isDarkMode ? 'bg-[#2563EB]/10 border border-[#2563EB]/30' : 'bg-[#2563EB]/5 border border-[#2563EB]/20'}`}>
              <CheckCircle className="size-5 text-[#2563EB]" />
              <p className="text-sm text-[#2563EB]">
                Review completed! You can now proceed to final payment.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className={`flex-1 ${isDarkMode ? 'border-gray-600 text-[#F9FAFB] hover:bg-gray-700' : 'border-gray-300 text-[#1F2933] hover:bg-gray-100'}`}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleProceed}
              disabled={!reviewCompleted}
              className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
            >
              Proceed to Final Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
/*Purpose: Order review modal jahan client images/video dekh kar order verify karta hai before final payment.
Type: Web-based (React UI), but same logic mobile app (React Native) mein bhi use ho sakta hai. */