import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { X, Package, Calendar, DollarSign, Lock, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import { EscrowStatusBadge } from './EscrowStatusBadge';
import { PaymentSummaryCard } from './PaymentSummaryCard';
import { useTheme } from '../../contexts/ThemeContext';

export function ManufacturerOrderDetailsModal({ 
  onClose, 
  order, 
  onStartWork 
}) {
  const { isDarkMode } = useTheme();
  const [isStarting, setIsStarting] = useState(false);

  const escrowBalance = order.totalAmount - order.advanceAmount - order.manufacturerAdvance;

  const handleStartWork = () => {
    setIsStarting(true);
    setTimeout(() => {
      onStartWork();
      setIsStarting(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className={`max-w-3xl w-full my-8 ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardHeader className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>
                Order Details
              </CardTitle>
              <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Order #{order.id}
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
          {/* Order Information */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
            <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              Order Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package className={`size-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Product</span>
                </div>
                <p className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  {order.productName}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package className={`size-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Quantity</span>
                </div>
                <p className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  {order.quantity} units
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className={`size-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Deadline</span>
                </div>
                <p className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  {new Date(order.deadline).toLocaleDateString()}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className={`size-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Client</span>
                </div>
                <p className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  {order.clientName}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Status Panel */}
          <div className="space-y-4">
            <h3 className={`font-medium flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              <DollarSign className="size-5 text-[#2563EB]" />
              Payment Status
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Client Advance */}
              <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-[#1F2933]' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="size-5 text-[#2563EB]" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Client Advance
                  </span>
                </div>
                <p className="text-xl font-semibold text-[#2563EB]">
                  ✔ Received
                </p>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  PKR {order.advanceAmount.toLocaleString()}
                </p>
              </div>

              {/* Escrow Balance */}
              <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-[#1F2933]' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="size-5 text-yellow-600" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Escrow Balance
                  </span>
                </div>
                <p className="text-xl font-semibold text-yellow-600">
                  🔒 Locked
                </p>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  PKR {escrowBalance.toLocaleString()}
                </p>
              </div>

              {/* Manufacturer Advance */}
              <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-[#1F2933]' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="size-5 text-[#2563EB]" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Your Advance
                  </span>
                </div>
                <p className="text-xl font-semibold text-[#2563EB]">
                  5% Received
                </p>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  PKR {order.manufacturerAdvance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Escrow Status */}
          <div className="flex justify-center">
            <EscrowStatusBadge status="HOLD" size="lg" />
          </div>

          {/* Info Text */}
          <div className="bg-[#2563EB]/10 border border-[#2563EB]/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-[#2563EB] mb-1">
                  Payment Release Information
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Baaki payment <span className="font-semibold">PKR {escrowBalance.toLocaleString()}</span> client 
                  approval ke baad automatically release hogi. Kaam complete karne ke baad client ko order review 
                  ke liye submit karein.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Summary Card */}
          <PaymentSummaryCard
            totalAmount={order.totalAmount}
            advancePaid={order.advanceAmount}
            manufacturerAdvance={order.manufacturerAdvance}
            remainingAmount={escrowBalance}
            escrowStatus="PARTIAL"
            showBreakdown={true}
          />

          {/* Action Button */}
          {order.status === 'advance-received' && (
            <Button 
              onClick={handleStartWork}
              disabled={isStarting}
              className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white h-12 text-base"
            >
              {isStarting ? (
                <div className="flex items-center gap-2">
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Starting Work...
                </div>
              ) : (
                'Start Work'
              )}
            </Button>
          )}

          {order.status === 'in-progress' && (
            <div className={`text-center p-4 rounded-lg ${isDarkMode ? 'bg-[#2563EB]/10' : 'bg-[#2563EB]/5'}`}>
              <p className="text-[#2563EB] font-medium">
                Work in progress... Complete the order to proceed
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
/*Purpose: Yeh modal manufacturer ko order details, payment status aur escrow info show karta hai aur “start work” action allow karta hai.
Type: Yeh web-based React UI component hai (web app ke liye, mobile native ke liye nahi).





 */