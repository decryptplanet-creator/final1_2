import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Info, Loader2, ShieldCheck } from 'lucide-react';
import { EscrowStatusBadge } from './EscrowStatusBadge';
import { useTheme } from '../../contexts/ThemeContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5003';
const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token') || '';
const authHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` });

export function EscrowPage({ orderData: initialOrder, onClose, onPaymentSuccess }) {
  const { isDarkMode } = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const orderData = initialOrder || {
    id: 'demo-order-001', title: 'Demo Product',
    totalAmount: 1000, clientId: null, manufacturerId: null,
  };

  const advance   = Math.round((orderData.totalAmount || 0) * 0.3);
  const remaining = Math.round((orderData.totalAmount || 0) * 0.7);

  const handlePay = async () => {
    // Debug — console mein dekho kya aa raha hai
    console.log('orderData:', orderData);
    console.log('orderId:', orderData.id || orderData._id);

    setIsProcessing(true);
    setError('');

    const orderId = orderData.id || orderData._id;

    if (!orderId) {
      setError('Order ID nahi mila — please page reload karo');
      setIsProcessing(false);
      return;
    }

    try {
      const res = await fetch(`${API}/api/escrow/stripe/initiate/${orderId}`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          amount: orderData.totalAmount,
          title: orderData.title,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment shuru nahi ho saka');
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0F1724]' : 'bg-[#F8FAFF]'} py-8`}>
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
            Escrow Payment
          </h2>
          <div className="flex items-center gap-2">
            <EscrowStatusBadge status="PENDING" />
            <Button variant="ghost" onClick={() => onClose && onClose()}>Close</Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500 text-red-500 text-sm">{error}</div>
        )}

        <Card className={isDarkMode ? 'bg-[#12202B] border-gray-700' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>
              Order: {orderData.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between p-3 bg-[#2563EB]/5 rounded-lg">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total Amount</span>
              <span className="text-xl font-semibold text-[#2563EB]">PKR {(orderData.totalAmount || 0).toLocaleString()}</span>
            </div>
            <div className={`flex justify-between p-3 rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Advance (30%) — released to manufacturer after acceptance</span>
              <span className="font-medium text-green-600">PKR {advance.toLocaleString()}</span>
            </div>
            <div className={`flex justify-between p-3 rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Held in Escrow (70%) — released after your approval</span>
              <span className="font-medium text-yellow-600">PKR {remaining.toLocaleString()}</span>
            </div>

            <div className="bg-[#2563EB]/10 border border-[#2563EB]/30 rounded-lg p-4 flex gap-3">
              <Info className="size-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Aap Stripe secure checkout page par redirect honge. Payment ke baad escrow automatically update hoga.
                Manufacturer 30% tabhi milega jab wo order accept kare. 70% aapki final approval pe milega.
              </p>
            </div>

            <div className="flex gap-3 items-center p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
              <ShieldCheck className="size-5 text-green-600 flex-shrink-0" />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Powered by <strong>Stripe</strong> — Secure payment gateway
              </span>
            </div>

            <Button
              onClick={handlePay}
              disabled={isProcessing || !orderData.totalAmount}
              className="w-full bg-[#2563EB] text-white py-5 text-base"
            >
              {isProcessing
                ? <><Loader2 className="size-4 mr-2 animate-spin" />Redirecting to Safepay...</>
                : `Pay PKR ${(orderData.totalAmount || 0).toLocaleString()} via Stripe`
              }
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default EscrowPage;