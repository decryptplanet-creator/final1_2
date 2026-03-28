import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/labelstatus';
import { X, Calendar, DollarSign, Package, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function AcceptOrderModal({ order, onClose, onAccept }) {
  const { isDarkMode } = useTheme();
  const [step, setStep] = useState(1);
  const [quotedPrice, setQuotedPrice] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [message, setMessage] = useState('');

  if (!order) return null;

  const orderDetails = {
    title: order.title,
    client: order.client || 'ABC Company',
    quantity: order.quantity,
    deadline: order.deadline,
    budget: `PKR ${order.budget.toLocaleString()}`,
  };

  const handleSubmit = () => {
    // Handle order acceptance
    alert(`Order accepted! Quote: PKR ${quotedPrice}, Delivery: ${deliveryDate}`);
    if (onAccept) onAccept();
    onClose();
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${isDarkMode ? 'bg-black/90' : 'bg-black/50'}`}>
      <Card className={`max-w-2xl w-full ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <CardHeader className="border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Accept Order</CardTitle>
              <CardDescription className="text-gray-400">Provide your quotation and timeline</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="size-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {step === 1 ? (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <h3 className="text-white mb-3">Order Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Order:</span>
                    <span className="text-white">{orderDetails.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Client:</span>
                    <span className="text-white">{orderDetails.client}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Quantity:</span>
                    <span className="text-white">{orderDetails.quantity} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Deadline:</span>
                    <span className="text-white">{orderDetails.deadline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Budget:</span>
                    <span className="text-white">{orderDetails.budget}</span>
                  </div>
                </div>
              </div>

              {/* Your Quotation */}
              <div>
                <label className="text-sm text-gray-300 mb-2 block flex items-center gap-2">
                  <DollarSign className="size-4" />
                  Your Quoted Price (PKR)
                </label>
                <Input
                  type="number"
                  placeholder="Enter your quoted price"
                  value={quotedPrice}
                  onChange={(e) => setQuotedPrice(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  30% ({quotedPrice ? `PKR ${(parseFloat(quotedPrice) * 0.3).toLocaleString()}` : 'PKR 0'}) will be paid upfront via escrow
                </p>
              </div>

              {/* Delivery Date */}
              <div>
                <label className="text-sm text-gray-300 mb-2 block flex items-center gap-2">
                  <Calendar className="size-4" />
                  Proposed Delivery Date
                </label>
                <Input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* Message to Client */}
              <div>
                <label className="text-sm text-gray-300 mb-2 block flex items-center gap-2">
                  <Package className="size-4" />
                  Message to Client (Optional)
                </label>
                <Textarea
                  placeholder="Add any additional information or terms..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white min-h-24"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setStep(2)}
                  disabled={!quotedPrice || !deliveryDate}
                  className="flex-1 bg-[#138f8a] hover:bg-[#0d7973]"
                >
                  Review & Submit
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Review Summary */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-12 rounded-full bg-[#2563EB]/20 flex items-center justify-center">
                    <CheckCircle className="size-6 text-[#2563EB]" />
                  </div>
                  <div>
                    <h3 className="text-white">Review Your Quotation</h3>
                    <p className="text-sm text-gray-400">Please confirm the details before submitting</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Total Quote:</span>
                    <span className="text-white">PKR {parseFloat(quotedPrice).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Upfront Payment (30%):</span>
                    <span className="text-[#2563EB]">PKR {(parseFloat(quotedPrice) * 0.3).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400">After Completion (70%):</span>
                    <span className="text-white">PKR {(parseFloat(quotedPrice) * 0.7).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Delivery Date:</span>
                    <span className="text-white">{new Date(deliveryDate).toLocaleDateString()}</span>
                  </div>
                  {message && (
                    <div className="border-b border-gray-700 pb-2">
                      <span className="text-gray-400 block mb-1">Your Message:</span>
                      <p className="text-white text-sm">{message}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Terms Info */}
              <div className="bg-[#138f8a]/10 border border-[#138f8a]/30 rounded-lg p-4">
                <h4 className="text-[#138f8a] mb-2 flex items-center gap-2">
                  <Package className="size-4" />
                  Escrow Payment Terms
                </h4>
                <ul className="text-sm text-gray-400 space-y-1 list-disc pl-5">
                  <li>30% payment will be released to you immediately upon client approval</li>
                  <li>Remaining 70% will be held in escrow until order completion</li>
                  <li>Client must confirm delivery before final payment release</li>
                  <li>Dispute resolution available if needed</li>
                </ul>
              </div>

              {/* Final Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                >
                  ← Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-[#138f8a] hover:bg-[#0d7973]"
                >
                  Confirm & Accept Order
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


/* This file is the Accept Order Modal component for submitting quotations and delivery details for orders.
It is intended for web-based React applications, not a native mobile app.*/