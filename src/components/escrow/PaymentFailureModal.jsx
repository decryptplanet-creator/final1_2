import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { AlertCircle, ReceiptText, RotateCcw, ShieldCheck } from 'lucide-react';
import { EscrowStatusBadge } from './EscrowStatusBadge';
import { useTheme } from '../../contexts/ThemeContext';

export function PaymentFailureModal({ onClose, onRetry, orderData, transaction }) {
  const { isDarkMode } = useTheme();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className={`max-w-xl w-full ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardHeader className={`text-center border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-center mb-4">
            <div className="size-20 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="size-12 text-red-600" />
            </div>
          </div>
          <CardTitle className={`text-2xl ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
            Payment Failed
          </CardTitle>
          <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No funds were charged or deposited into escrow.
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-5">
          <div className="flex justify-center">
            <EscrowStatusBadge status="FAILED" size="lg" />
          </div>

          <div className={`p-4 rounded-lg space-y-3 ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
            <h3 className={`font-medium flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              <ReceiptText className="size-5 text-[#2563EB]" />
              Transaction Summary
            </h3>
            <div className="flex justify-between text-sm">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Transaction ID</span>
              <span className={`font-mono ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{transaction.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Payment Method</span>
              <span className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>{transaction.method}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Attempted Amount</span>
              <span className="font-medium text-red-600">PKR {orderData.advanceAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-[#2563EB]/10 border border-[#2563EB]/30 rounded-lg">
            <ShieldCheck className="size-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Your order is still protected. Retry with the same method or choose a different payment option.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button onClick={onRetry} className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white">
              <RotateCcw className="size-4 mr-2" />
              Retry Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
