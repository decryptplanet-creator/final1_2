import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea input';
import { X, Package, Calendar, DollarSign, Info, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function PlaceOrderModal({ onClose, onProceedToEscrow }) {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    deadline: '',
    description: ''
  });

  // Fixed values for FYP
  const totalAmount = 100000;
  const advancePercentage = 30;
  const advanceAmount = totalAmount * (advancePercentage / 100); // 30,000

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const orderData = {
      productName: formData.productName,
      quantity: parseInt(formData.quantity),
      deadline: formData.deadline,
      totalAmount,
      advancePercentage,
      advanceAmount,
      description: formData.description
    };

    onProceedToEscrow(orderData);
  };

  const isFormValid = formData.productName && formData.quantity && formData.deadline;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className={`max-w-2xl w-full ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardHeader className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>
                Place New Order
              </CardTitle>
              <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Create your order with secure escrow payment
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

        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-6">
            {/* Order Details Section */}
            <div className="space-y-4">
              <h3 className={`font-medium flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                <Package className="size-5 text-[#2563EB]" />
                Order Details
              </h3>
              
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="productName" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Product Name *
                </Label>
                <Input
                  id="productName"
                  placeholder="e.g., Cotton T-Shirts"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className={isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}
                  required
                />
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Quantity *
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="e.g., 500"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className={isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}
                  required
                  min="1"
                />
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <Label htmlFor="deadline" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Delivery Deadline *
                </Label>
                <div className="relative">
                  <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className={`pl-10 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Order Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Provide additional details about your order..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}
                  rows={3}
                />
              </div>
            </div>

            {/* Payment Section */}
            <div className="space-y-4">
              <h3 className={`font-medium flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                <DollarSign className="size-5 text-[#2563EB]" />
                Payment Details
              </h3>

              <div className={`p-4 rounded-lg space-y-3 ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total Amount:</span>
                  <span className={`text-2xl font-semibold text-[#2563EB]`}>
                    PKR {totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Advance Required (30%):</span>
                  <span className={`text-xl font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                    PKR {advanceAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Escrow Info Box */}
            <div className="bg-[#2563EB]/10 border border-[#2563EB]/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="size-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-[#2563EB] mb-1">
                    Secure Escrow Payment
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Advance payment platform ke paas secure tareeqay se hold rahe gi (Escrow). 
                    Funds sirf aapki final approval ke baad hi manufacturer ko release honge.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="button"
                variant="outline" 
                onClick={onClose}
                className={`flex-1 ${isDarkMode ? 'border-gray-600 text-[#F9FAFB] hover:bg-gray-700' : 'border-gray-300 text-[#1F2933] hover:bg-gray-100'}`}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
              >
                Proceed to Escrow Payment
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
/*Purpose: This file is used to create and submit a new order with product details and initiate escrow payment.
Type: It is for web-based application (React frontend). */