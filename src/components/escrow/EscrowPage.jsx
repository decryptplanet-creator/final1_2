import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { CreditCard, Building2, Smartphone, Info } from 'lucide-react';
import { PaymentSuccessModal } from './PaymentSuccessModal';
import { EscrowStatusBadge } from './EscrowStatusBadge';
import { useTheme } from '../../contexts/ThemeContext';

export function EscrowPage({ orderData: initialOrder, onClose, onPaymentSuccess }) {
  const { isDarkMode } = useTheme();
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [payerName, setPayerName] = useState('Demo Client');
  const [payerPhone, setPayerPhone] = useState('+92 300 0000000');
  const [paymentRef, setPaymentRef] = useState(`JZ-${Date.now().toString().slice(-6)}`);
  const [payerNote, setPayerNote] = useState('Paid via JazzCash mobile wallet');
  const [receiptFile, setReceiptFile] = useState(null);

  const orderData = initialOrder || {
    id: 'demo-order-001',
    productName: 'Demo Product',
    quantity: 1,
    deadline: new Date().toISOString(),
    totalAmount: 654,
    advancePercentage: 100,
    advanceAmount: 654,
  };

  const paymentMethods = [
    { id: 'card', label: 'Debit / Credit Card', detail: 'Visa or Mastercard', icon: CreditCard },
    { id: 'bank', label: 'Bank Transfer', detail: 'Instant online banking', icon: Building2 },
    { id: 'wallet', label: 'Mobile Wallet', detail: 'JazzCash or Easypaisa', icon: Smartphone }
  ];

  const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);

  const handlePay = () => {
    setIsProcessing(true);
    const txn = {
      id: `TXN-${Date.now().toString().slice(-8)}`,
      orderId: orderData.id,
      method: selectedMethod.label,
      amount: orderData.advanceAmount,
      date: new Date().toLocaleString(),
      payer: {
        name: payerName,
        phone: payerPhone,
        reference: paymentRef,
        note: payerNote,
        channel: 'JazzCash'
      }
    };

    setTimeout(() => {
      setIsProcessing(false);
      // include receipt filename if provided
      if (receiptFile) txn.receiptFileName = receiptFile.name;
      setTransaction(txn);
      setShowSuccess(true);
      // notify parent so orders can be updated (escrow deposited)
      if (onPaymentSuccess) onPaymentSuccess(txn);
    }, 1200);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0F1724]' : 'bg-[#F8FAFF]'} py-8`}> 
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Escrow Payment</h2>
          <div className="flex items-center gap-2">
            <EscrowStatusBadge status="PENDING" />
            <Button variant="ghost" onClick={() => onClose && onClose()}>Close</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className={isDarkMode ? 'bg-[#12202B] border-gray-700' : 'bg-white border-gray-200'}>
            <CardHeader>
              <CardTitle className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    disabled={isProcessing}
                    className={`p-4 rounded-lg text-left border transition-colors ${paymentMethod === method.id ? 'border-[#2563EB] bg-[#2563EB]/10' : isDarkMode ? 'border-gray-700 bg-[#0b1320]' : 'border-gray-200 bg-white'}`}
                  >
                    <div className="flex items-center gap-3">
                      <method.icon className={`size-5 ${paymentMethod === method.id ? 'text-[#2563EB]' : 'text-gray-500'}`} />
                      <div>
                        <div className={isDarkMode ? 'text-[#F9FAFB] font-medium' : 'text-[#1F2933] font-medium'}>{method.label}</div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{method.detail}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <Card className={isDarkMode ? 'bg-[#12202B] border-gray-700' : 'bg-white border-gray-200'}>
              <CardHeader>
                <CardTitle className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>Transaction Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#2563EB]/5 rounded-lg">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total Amount</span>
                    <span className="text-xl font-semibold text-[#2563EB]">PKR {orderData.totalAmount.toLocaleString()}</span>
                  </div>

                  <div className={`flex items-center justify-between p-3 rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Full Payment ({orderData.advancePercentage}%)</span>
                    <span className={`text-lg font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>PKR {orderData.advanceAmount.toLocaleString()}</span>
                  </div>

                  <div className={`flex items-center justify-between p-3 rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Payment Channel</span>
                    <span className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{selectedMethod.label}</span>
                  </div>

                  <div className="bg-[#2563EB]/10 border border-[#2563EB]/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="size-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Your payment will be secured in escrow as soon as this transaction succeeds.</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>- The full payment is held securely by Skillora escrow<br/>- Work will begin once payment verification succeeds<br/>- Funds are released only after your final approval</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handlePay} disabled={isProcessing} className="flex-1 bg-[#2563EB] text-white">
                      {isProcessing ? 'Processing...' : `Pay PKR ${orderData.advanceAmount.toLocaleString()} with JazzCash`}
                    </Button>
                    <Button variant="outline" onClick={() => { setTransaction(null); setShowSuccess(false); }} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                  {/* Dummy payer fields for JazzCash (client can enter transaction details) */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input value={payerName} onChange={(e) => setPayerName(e.target.value)} placeholder="Payer Name" />
                    <Input value={payerPhone} onChange={(e) => setPayerPhone(e.target.value)} placeholder="Payer Phone" />
                    <Input value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)} placeholder="Transaction Reference (e.g., JZ-123456)" />
                    <Input value={payerNote} onChange={(e) => setPayerNote(e.target.value)} placeholder="Note (optional)" />
                  </div>
                  <div className="mt-3">
                    <label className="text-sm text-gray-500">Upload Receipt / Screenshot (optional)</label>
                    <input type="file" accept="image/*,application/pdf" onChange={(e) => setReceiptFile(e.target.files[0] || null)} className="block mt-2" />
                    {receiptFile && <div className="text-xs text-gray-600 mt-1">Selected: {receiptFile.name}</div>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showSuccess && transaction && (
        <PaymentSuccessModal onClose={() => setShowSuccess(false)} orderData={orderData} transaction={transaction} />
      )}
    </div>
  );
}

export default EscrowPage;

/* Full-page escrow payment screen — use this component when you want a dedicated
   payment page instead of the modal. Import and render it from a route or a parent
   component (for example `ClientDashboard`) and pass `orderData` and `onClose`.
*/
