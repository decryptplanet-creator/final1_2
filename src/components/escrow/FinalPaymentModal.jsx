import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { X, DollarSign, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { EscrowStatusBadge } from './EscrowStatusBadge';
import { useTheme } from '../../contexts/ThemeContext';

export function FinalPaymentModal({ onClose, order, onPaymentComplete }) {
  const { isDarkMode } = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);

  const remainingAmount = order.totalAmount - order.advanceAmount; // 70,000
  const remainingPercentage = 70; // 70%

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      onPaymentComplete();
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className={`max-w-xl w-full ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardHeader className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>
                Release Final Payment
              </CardTitle>
              <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Complete your order payment
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className={isDarkMode ? 'text-gray-400 hover:text-[#F9FAFB]' : 'text-gray-400 hover:text-[#1F2933]'}
              disabled={isProcessing}
            >
              <X className="size-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Order Info */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
            <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              Order: {order.productName}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total Amount:</span>
                <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  PKR {order.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Advance Paid:</span>
                <span className="text-[#2563EB] font-medium">
                  - PKR {order.advanceAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Remaining Amount - Prominent Display */}
          <div className="text-center p-6 bg-gradient-to-br from-[#2563EB]/10 to-[#2563EB]/5 rounded-lg border border-[#2563EB]/30">
            <div className="flex justify-center mb-3">
              <div className="size-16 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
                <DollarSign className="size-8 text-[#2563EB]" />
              </div>
            </div>
            <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Remaining Amount ({remainingPercentage}%)
            </p>
            <p className="text-4xl font-bold text-[#2563EB] mb-1">
              PKR {remainingAmount.toLocaleString()}
            </p>
          </div>

          {/* Escrow Status */}
          <div className="space-y-3">
            <div className="flex justify-center">
              <EscrowStatusBadge status="PENDING" size="lg" />
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-700">
                  🟡 <span className="font-medium">Client confirmation ka intezar hai</span>
                  <br />
                  Payment escrow mein secure hai. Aapki confirmation ke baad manufacturer ko release hogi.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              Payment Breakdown
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-[#2563EB]" />
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Advance (30%)</span>
                </div>
                <span className="text-[#2563EB] font-medium">Paid</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-[#2563EB]" />
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Manufacturer Advance (5%)</span>
                </div>
                <span className="text-[#2563EB] font-medium">Released</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  Final Payment (70%)
                </span>
                <span className="text-[#2563EB] font-semibold">
                  PKR {remainingAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Security Message */}
          <div className={`flex items-center gap-3 p-4 rounded-lg ${isDarkMode ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
            <ShieldCheck className="size-5 text-green-600" />
            <p className="text-sm text-green-700">
              Funds sirf client approval ke baad hi release kiye jaenge
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isProcessing}
              className={`flex-1 ${isDarkMode ? 'border-gray-600 text-[#F9FAFB] hover:bg-gray-700' : 'border-gray-300 text-[#1F2933] hover:bg-gray-100'}`}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white h-12 text-base"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                'Pay Remaining Amount'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
/*Purpose: Yeh file final payment modal hai jo remaining amount calculate karke user se escrow ke through final payment confirm karwata hai.
Type: Yeh web-based (React frontend) ke liye hai, lekin hybrid apps mein bhi use ho sakta hai. */