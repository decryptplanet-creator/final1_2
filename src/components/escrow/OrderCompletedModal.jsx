import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle, Package, Truck, MapPin, X } from 'lucide-react';
import { EscrowStatusBadge } from './EscrowStatusBadge';
import { useTheme } from '../../contexts/ThemeContext';

export function OrderCompletedModal({ onClose, order }) {
  const { isDarkMode } = useTheme();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className={`max-w-xl w-full ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardHeader className={`text-center border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-end">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className={isDarkMode ? 'text-gray-400 hover:text-[#F9FAFB]' : 'text-gray-400 hover:text-[#1F2933]'}
            >
              <X className="size-5" />
            </Button>
          </div>
          
          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <div className="size-20 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="size-12 text-green-600" />
            </div>
          </div>
          
          <CardTitle className={`text-2xl ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2937]'}`}>
            Order Completed!
          </CardTitle>
          <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Your order has been successfully completed
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Payment Status Badge */}
          <div className="flex justify-center">
            <EscrowStatusBadge status="RELEASED" size="lg" />
          </div>

          {/* Order Details */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
            <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              Order Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Product:</span>
                <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  {order.productName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Quantity:</span>
                <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  {order.quantity} units
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total Amount Paid:</span>
                <span className="font-semibold text-green-600">
                  PKR {order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Dispatch Status */}
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-[#1F2933]' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="size-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Truck className="size-6 text-green-600" />
              </div>
              <div>
                <h4 className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  Ready to Dispatch
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your order is ready for shipment
                </p>
              </div>
            </div>

            {/* Tracking Information */}
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#2A3642]' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className={`size-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Tracking ID:
                  </span>
                </div>
                <span className={`font-mono font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  {order.trackingId}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Release Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-700 mb-1">
                  Payment Successfully Released
                </h4>
                <p className="text-sm text-green-700">
                  Funds sirf client approval ke baad hi release kiye gaye hain. 
                  Total amount <span className="font-semibold">PKR {order.totalAmount.toLocaleString()}</span> manufacturer 
                  ko successfully transfer ho gaya hai.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline Summary */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
            <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              Transaction Summary
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-green-600" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Advance Payment Received
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-green-600" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manufacturer Advance Released (5%)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-green-600" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Work Completed & Reviewed
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-green-600" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Final Payment Released (70%)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-green-600" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Order Ready for Dispatch
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={onClose}
              variant="outline"
              className={`flex-1 ${isDarkMode ? 'border-gray-600 text-[#F9FAFB]' : 'border-gray-300 text-[#1F2933]'}`}
            >
              <MapPin className="size-4 mr-2" />
              Track Shipment
            </Button>
            <Button 
              onClick={onClose}
              className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
            >
              View Order History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/*Purpose: Yeh file order completion ka final success modal show karti hai jisme payment release, tracking aur summary display hoti hai.
Type: Yeh web-based React frontend component hai (mobile ke liye direct nahi, lekin adapt ho sakta hai). */