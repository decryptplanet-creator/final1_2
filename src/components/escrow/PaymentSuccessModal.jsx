import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle, Lock, TrendingUp } from 'lucide-react';
import { EscrowStatusBadge } from './EscrowStatusBadge';
import { ProgressTimeline } from './ProgressTimeline';
import { useTheme } from '../../contexts/ThemeContext';

export function PaymentSuccessModal({ onClose, orderData }) {
  const { isDarkMode } = useTheme();
  
  const timelineSteps = [
    {
      label: 'Advance Paid',
      status: 'completed',
      date: new Date().toLocaleDateString()
    },
    {
      label: 'Work In Progress',
      status: 'in-progress'
    },
    {
      label: 'Client Review',
      status: 'pending'
    },
    {
      label: 'Final Payment',
      status: 'pending'
    },
    {
      label: 'Released to Manufacturer',
      status: 'pending'
    }
  ];

  const manufacturerAdvance = orderData.totalAmount * 0.05; // 5% = 5,000 PKR

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className={`max-w-2xl w-full ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardHeader className={`text-center border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <div className="size-20 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
              <CheckCircle className="size-12 text-[#2563EB]" />
            </div>
          </div>
          
          <CardTitle className={`text-2xl ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
            Payment Successful!
          </CardTitle>
          <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Your advance payment has been received and secured in escrow
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Payment Summary */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Order:</span>
                <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  {orderData.productName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-[#2563EB]" />
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Advance Received:</span>
                </div>
                <span className="font-semibold text-[#2563EB]">
                  PKR {orderData.advanceAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Escrow Status */}
          <div className="flex justify-center">
            <EscrowStatusBadge status="HOLD" size="lg" />
          </div>

          {/* Manufacturer Advance Info */}
          <div className="bg-[#2563EB]/10 border border-[#2563EB]/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="size-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-[#2563EB] mb-1">
                  Manufacturer Advance Released
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manufacturer ko kaam start karne ke liye <span className="font-semibold text-[#2563EB]">
                    PKR {manufacturerAdvance.toLocaleString()} (5%)
                  </span> release kar diya gaya hai.
                </p>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Baaki <span className="font-semibold">PKR {(orderData.totalAmount - orderData.advanceAmount - manufacturerAdvance).toLocaleString()}</span> escrow 
                  mein secure hai aur aapki final approval ke baad release hoga.
                </p>
              </div>
            </div>
          </div>

          {/* Order Progress Timeline */}
          <div>
            <h3 className={`font-medium mb-4 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              Order Progress Timeline
            </h3>
            <ProgressTimeline steps={timelineSteps} />
          </div>

          {/* Security Info */}
          <div className={`flex items-center gap-2 p-3 rounded-lg ${isDarkMode ? 'bg-[#2563EB]/10 border border-[#2563EB]/30' : 'bg-[#2563EB]/5 border border-[#2563EB]/20'}`}>
            <Lock className="size-4 text-[#2563EB]" />
            <span className="text-sm text-[#2563EB]">
              Your payment is protected by Skillora Escrow System
            </span>
          </div>

          {/* Action Button */}
          <Button 
            onClick={onClose}
            className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
          >
            View Order Details
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
/*Purpose: Yeh modal advance payment successful hone ke baad confirmation, escrow status aur order progress timeline show karta hai.
Type: Web-based React component hai (web app ke liye, mobile app ke liye direct nahi).





 */