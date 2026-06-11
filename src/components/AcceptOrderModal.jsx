import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { X, Calendar, DollarSign, Package, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5003';
const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token') || '';

export function AcceptOrderModal({ order, onClose, onAccept }) {
  const { isDarkMode } = useTheme();
  const [step, setStep] = useState(1);
  const [quotedPrice, setQuotedPrice] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!order) return null;

  const orderDetails = {
    title: order.title,
    client: order.client || 'ABC Company',
    quantity: order.quantity,
    deadline: order.deadline,
    budget: `PKR ${order.budget?.toLocaleString()}`,
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // ✅ FIX: orderId sahi se nikalo
    const orderId = order._id || order.id;
    console.log('Order:', order);
    console.log('OrderId:', orderId);

    if (!orderId) {
      alert('Order ID nahi mila!');
      setIsSubmitting(false);
      return;
    }

    try {
      // ✅ FIX: Sahi URL — /api/orders/accept/:id
      const res = await fetch(`${API}/api/orders/accept/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          quotedPrice: parseFloat(quotedPrice),
          deliveryDate,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Order accept nahi ho saka');
      if (onAccept) onAccept(data);
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/70">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
        <CardHeader className="border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
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

              <div>
                <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
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
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
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

              <div>
                <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
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
                  disabled={isSubmitting}
                  className="flex-1 bg-[#138f8a] hover:bg-[#0d7973]"
                >
                  {isSubmitting ? 'Submitting...' : 'Confirm & Accept Order'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
