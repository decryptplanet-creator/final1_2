import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { X, ShieldCheck, Info, CreditCard, Building2, Smartphone, ReceiptText, AlertCircle } from 'lucide-react';
import { EscrowStatusBadge } from './EscrowStatusBadge';
import { useTheme } from '../../contexts/ThemeContext';

export function EscrowPaymentModal({ onClose, orderData, onPaymentResult }) {
  const { isDarkMode } = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [transactionId] = useState(() => `TXN-${Date.now().toString().slice(-8)}`);

  const paymentMethods = [
    { id: 'card', label: 'Debit / Credit Card', detail: 'Visa or Mastercard', icon: CreditCard },
    { id: 'bank', label: 'Bank Transfer', detail: 'Instant online banking', icon: Building2 },
    { id: 'wallet', label: 'Mobile Wallet', detail: 'JazzCash or Easypaisa', icon: Smartphone }
  ];
  const selectedMethod = paymentMethods.find((method) => method.id === paymentMethod);

  const handleConfirmPayment = (shouldSucceed = true) => {
    setIsProcessing(true);

    setTimeout(() => {
      onPaymentResult(shouldSucceed ? 'success' : 'failed', {
        id: transactionId,
        orderId: orderData.id || 'ORD-DEMO-001',
        method: selectedMethod.label,
        amount: orderData.advanceAmount,
        date: new Date().toLocaleString()
      });
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className={`max-w-2xl w-full max-h-[95vh] overflow-y-auto ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
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

          {/* Payment Method */}
          <div className="space-y-3">
            <h3 className={`font-medium flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              <CreditCard className="size-5 text-[#2563EB]" />
              Payment Method
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {paymentMethods.map((method) => (
                <button
                  type="button"
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  disabled={isProcessing}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    paymentMethod === method.id
                      ? 'border-[#2563EB] bg-[#2563EB]/10'
                      : isDarkMode ? 'border-gray-700 bg-[#1F2933]' : 'border-gray-200 bg-white'
                  }`}
                >
                  <method.icon className={`size-5 mb-2 ${paymentMethod === method.id ? 'text-[#2563EB]' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{method.label}</div>
                  <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{method.detail}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Transaction Summary */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ReceiptText className="size-5 text-[#2563EB]" />
              <h3 className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2937]'}`}>
                Transaction Summary
              </h3>
            </div>

            <div className="space-y-3">
              <div className={`flex items-center justify-between p-3 rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Transaction ID</span>
                <span className={`text-sm font-mono ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{transactionId}</span>
              </div>
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
              <div className={`flex items-center justify-between p-3 rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Pay With</span>
                <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{selectedMethod.label}</span>
              </div>
            </div>
          </div>

          {/* Escrow Status Badge */}
          <div className="flex justify-center">
            <EscrowStatusBadge status="PENDING" size="lg" />
          </div>

          {/* Escrow Information */}
          <div className="bg-[#2563EB]/10 border border-[#2563EB]/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="size-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Your payment will be secured in escrow as soon as this transaction succeeds.
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  - The advance payment is held securely by Skillora<br />
                  - A work-start advance is released after confirmation<br />
                  - Remaining funds release only after your final approval
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

          {/* Action Buttons */}
          <Button
            onClick={() => handleConfirmPayment(true)}
            disabled={isProcessing}
            className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white h-12 text-base"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing Payment...
              </div>
            ) : (
              `Pay PKR ${orderData.advanceAmount.toLocaleString()} Securely`
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleConfirmPayment(false)}
            disabled={isProcessing}
            className={`w-full ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            <AlertCircle className="size-4 mr-2" />
            Simulate Failed Payment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
/*Purpose: Yeh file escrow payment confirmation modal hai jo order summary aur advance payment details dikha kar secure payment confirm karwata hai.
Type: Yeh web-based (React frontend) ke liye hai, mobile app ke liye direct nahi. */
