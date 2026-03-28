import { X, ArrowLeft, Calendar, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/labelstatus';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';

export function PaymentDetailsModal({ payment, onClose }) {
  const { isDarkMode } = useTheme();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600/20 text-green-400 border-green-600/30">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-600/20 text-red-400 border-red-600/30">Failed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="size-12 text-green-600" />;
      case 'pending':
        return <Clock className="size-12 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="size-12 text-red-600" />;
      default:
        return <DollarSign className="size-12 text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`max-w-2xl w-full ${isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'}`}>
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
                  Transaction Details
                </CardTitle>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {payment.id}
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
        <CardContent className="space-y-6">
          {/* Status Icon */}
          <div className="flex flex-col items-center justify-center py-6">
            {getStatusIcon(payment.status)}
            <div className="mt-4 text-center">
              {getStatusBadge(payment.status)}
              <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                PKR {payment.amount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Transaction Details */}
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-[#1F2933] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
            <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
              Transaction Information
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Transaction ID</span>
                <span className={`font-mono ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>{payment.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Order ID</span>
                <span className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>{payment.orderId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Type</span>
                <span className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>{payment.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Payment Method</span>
                <span className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>{payment.method}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Date</span>
                <div className="flex items-center gap-2">
                  <Calendar className={`size-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>{payment.date}</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-t pt-3 mt-3">
                <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Amount</span>
                <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>
                  PKR {payment.amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {payment.status === 'completed' && (
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                ✓ This transaction has been successfully completed and verified.
              </p>
            </div>
          )}

          {payment.status === 'pending' && (
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                ⏳ This transaction is currently being processed. Please wait for confirmation.
              </p>
            </div>
          )}

          {payment.status === 'failed' && (
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                ✗ This transaction has failed. Please contact support if you need assistance.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
            >
              Back to Payment History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
/*Shows detailed information of a specific payment/transaction including status, amount, and method in a modal view.

This is web-based (React frontend) component, but can be used in hybrid apps too (so practically both). */