import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { X, ShieldCheck, Info, DollarSign } from 'lucide-react';
import { EscrowStatusBadge } from './EscrowStatusBadge';
import { useTheme } from '../../contexts/ThemeContext';

export function EscrowPaymentModal({ onClose, orderData, onPaymentConfirm }) {
  const { isDarkMode } = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      onPaymentConfirm();
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className={`max-w-xl w-full ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardHeader className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>
                Escrow Payment Confirmation
              </CardTitle>
              <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Review and confirm your escrow payment
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
            <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              Order Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Product:</span>
                <span className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>{orderData.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Quantity:</span>
                <span className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>{orderData.quantity} units</span>
              </div>
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Deadline:</span>
                <span className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>
                  {new Date(orderData.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="size-5 text-[#2563EB]" />
              <h3 className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2937]'}`}>
                Payment Breakdown
              </h3>
            </div>

            <div className="space-y-3">
              {/* Total Amount */}
              <div className="flex items-center justify-between p-3 bg-[#2563EB]/5 rounded-lg">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total Amount</span>
                <span className="text-xl font-semibold text-[#2563EB]">
                  PKR {orderData.totalAmount.toLocaleString()}
                </span>
              </div>

              {/* Advance Payment */}
              <div className={`flex items-center justify-between p-3 rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Advance Payment ({orderData.advancePercentage}%)
                </span>
                <span className={`text-lg font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  PKR {orderData.advanceAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Escrow Status Badge */}
          <div className="flex justify-center">
            <EscrowStatusBadge status="HOLD" size="lg" />
          </div>

          {/* Escrow Information */}
          <div className="bg-[#2563EB]/10 border border-[#2563EB]/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="size-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Payment safely hold mein hai. Manufacturer confirmation ke baad kaam start kare ga.
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  • Platform advance payment ko secure escrow mein hold karega<br />
                  • Manufacturer ko kaam start karne ke liye 5% advance release hoga<br />
                  • Baaki payment aapki final approval ke baad release hogi
                </p>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${isDarkMode ? 'bg-[#2563EB]/10' : 'bg-[#2563EB]/5'}`}>
            <ShieldCheck className="size-5 text-[#2563EB]" />
            <span className="text-sm font-medium text-[#2563EB]">
              100% Secure Payment with Escrow Protection
            </span>
          </div>

          {/* Action Button */}
          <Button 
            onClick={handleConfirmPayment}
            disabled={isProcessing}
            className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white h-12 text-base"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing Payment...
              </div>
            ) : (
              'Confirm & Pay Advance'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
/*Purpose: Yeh file escrow payment confirmation modal hai jo order summary aur advance payment details dikha kar secure payment confirm karwata hai.
Type: Yeh web-based (React frontend) ke liye hai, mobile app ke liye direct nahi. */