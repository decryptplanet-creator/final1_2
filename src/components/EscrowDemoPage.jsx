import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { 
  ShieldCheck, 
  Package, 
  DollarSign, 
  Factory, 
  CheckCircle, 
  FileText,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { PlaceOrderModal } from './escrow/PlaceOrderModal';
import { EscrowPaymentModal } from './escrow/EscrowPaymentModal';
import { PaymentSuccessModal } from './escrow/PaymentSuccessModal';
import { ManufacturerOrderDetailsModal } from './escrow/ManufacturerOrderDetailsModal';
import { OrderReviewModal } from './escrow/OrderReviewModal';
import { FinalPaymentModal } from './escrow/FinalPaymentModal';
import { OrderCompletedModal } from './escrow/OrderCompletedModal';
import { PaymentHistoryModal } from './escrow/PaymentHistoryModal';
import { useTheme } from '../contexts/ThemeContext';

export function EscrowDemoPage() {
  const { isDarkMode } = useTheme();
  const [currentScreen, setCurrentScreen] = useState('home');
  const [orderData, setOrderData] = useState(null);

  // Mock data
  const mockOrder = {
    id: 'ORD-2025-001',
    productName: 'Cotton T-Shirts',
    quantity: 500,
    deadline: '2025-02-28',
    totalAmount: 100000,
    advanceAmount: 30000,
    manufacturerAdvance: 5000,
    clientName: 'ABC Corporation',
    status: 'advance-received',
    images: [],
    trackingId: 'TRK-SKL-2025-001'
  };

  const mockTransactions = [
    {
      id: 'TXN-001',
      type: 'advance-paid',
      amount: 30000,
      date: '2025-01-15T10:30:00',
      status: 'completed',
      description: 'Advance Payment Received from Client'
    },
    {
      id: 'TXN-002',
      type: 'manufacturer-advance',
      amount: 5000,
      date: '2025-01-15T10:35:00',
      status: 'completed',
      description: '5% Released to Manufacturer for Work Start'
    },
    {
      id: 'TXN-003',
      type: 'final-payment',
      amount: 70000,
      date: '2025-01-25T14:20:00',
      status: 'completed',
      description: 'Final Payment (70%) Released'
    },
    {
      id: 'TXN-004',
      type: 'full-release',
      amount: 100000,
      date: '2025-01-25T14:25:00',
      status: 'completed',
      description: 'Full Amount Released to Manufacturer'
    }
  ];

  const demoSteps = [
    {
      id: 'place-order',
      title: '1. Place Order',
      description: 'Client creates order with escrow payment',
      icon: Package,
      color: 'text-[#2563EB]'
    },
    {
      id: 'escrow-payment',
      title: '2. Escrow Payment',
      description: 'Confirm advance payment to escrow',
      icon: DollarSign,
      color: 'text-[#2563EB]'
    },
    {
      id: 'payment-success',
      title: '3. Payment Success',
      description: 'Advance secured, timeline started',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 'manufacturer-view',
      title: '4. Manufacturer View',
      description: 'Manufacturer sees order details',
      icon: Factory,
      color: 'text-[#2563EB]'
    },
    {
      id: 'order-review',
      title: '5. Client Review',
      description: 'Review completed work',
      icon: CheckCircle,
      color: 'text-[#2563EB]'
    },
    {
      id: 'final-payment',
      title: '6. Final Payment',
      description: 'Release remaining amount',
      icon: DollarSign,
      color: 'text-[#2563EB]'
    },
    {
      id: 'order-completed',
      title: '7. Order Complete',
      description: 'Funds released, ready to dispatch',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 'payment-history',
      title: '8. Payment History',
      description: 'Complete audit trail',
      icon: FileText,
      color: 'text-[#2563EB]'
    }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1F2933]' : 'bg-[#F9FAFB]'}`}>
      {/* Header */}
      <header className={`border-b ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded bg-[#2563EB] flex items-center justify-center">
                <Sparkles className="size-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-medium text-[#2563EB]`}>
                  Skillora Escrow System
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Complete Escrow Payment Workflow - FYP Demo
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <Card className={`mb-8 ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="size-20 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
                <ShieldCheck className="size-12 text-[#2563EB]" />
              </div>
            </div>
            <CardTitle className={`text-3xl mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              Trust-Based Escrow Payment System
            </CardTitle>
            <CardDescription className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Complete order & payment workflow with fraud prevention and transparency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg text-center ${isDarkMode ? 'bg-[#1F2933]' : 'bg-[#2563EB]/5'}`}>
                <ShieldCheck className="size-8 text-[#2563EB] mx-auto mb-2" />
                <h3 className={`font-medium mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  Trust Based
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Platform as middle authority
                </p>
              </div>
              <div className={`p-4 rounded-lg text-center ${isDarkMode ? 'bg-[#1F2933]' : 'bg-[#2563EB]/5'}`}>
                <CheckCircle className="size-8 text-green-600 mx-auto mb-2" />
                <h3 className={`font-medium mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  Fraud Prevention
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Secure escrow holding
                </p>
              </div>
              <div className={`p-4 rounded-lg text-center ${isDarkMode ? 'bg-[#1F2933]' : 'bg-[#2563EB]/5'}`}>
                <FileText className="size-8 text-[#2563EB] mx-auto mb-2" />
                <h3 className={`font-medium mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  Full Transparency
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Complete audit trail
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {demoSteps.map((step, index) => (
            <Card 
              key={step.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isDarkMode ? 'bg-[#2A3642] border-gray-700 hover:border-[#2563EB]' : 'bg-white border-gray-200 hover:border-[#2563EB]'
              }`}
              onClick={() => setCurrentScreen(step.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`size-10 rounded-full ${isDarkMode ? 'bg-[#2563EB]/10' : 'bg-[#2563EB]/5'} flex items-center justify-center flex-shrink-0`}>
                    <step.icon className={`size-5 ${step.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm"
                  className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                >
                  View Screen
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Access */}
        <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>
              Quick Access
            </CardTitle>
            <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Jump to any screen in the workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {demoSteps.map((step) => (
                <Button
                  key={step.id}
                  variant="outline"
                  onClick={() => setCurrentScreen(step.id)}
                  className={isDarkMode ? 'border-gray-600 text-[#F9FAFB]' : 'border-gray-300 text-[#1F2933]'}
                >
                  <step.icon className="size-4 mr-2" />
                  {step.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {currentScreen === 'place-order' && (
        <PlaceOrderModal
          onClose={() => setCurrentScreen('home')}
          onProceedToEscrow={(data) => {
            setOrderData(data);
            setCurrentScreen('escrow-payment');
          }}
        />
      )}

      {currentScreen === 'escrow-payment' && orderData && (
        <EscrowPaymentModal
          onClose={() => setCurrentScreen('home')}
          orderData={orderData}
          onPaymentConfirm={() => setCurrentScreen('payment-success')}
        />
      )}

      {currentScreen === 'payment-success' && orderData && (
        <PaymentSuccessModal
          onClose={() => setCurrentScreen('home')}
          orderData={orderData}
        />
      )}

      {currentScreen === 'manufacturer-view' && (
        <ManufacturerOrderDetailsModal
          onClose={() => setCurrentScreen('home')}
          order={mockOrder}
          onStartWork={() => setCurrentScreen('home')}
        />
      )}

      {currentScreen === 'order-review' && (
        <OrderReviewModal
          onClose={() => setCurrentScreen('home')}
          order={mockOrder}
          onProceedToPayment={() => setCurrentScreen('final-payment')}
        />
      )}

      {currentScreen === 'final-payment' && (
        <FinalPaymentModal
          onClose={() => setCurrentScreen('home')}
          order={mockOrder}
          onPaymentComplete={() => setCurrentScreen('order-completed')}
        />
      )}

      {currentScreen === 'order-completed' && (
        <OrderCompletedModal
          onClose={() => setCurrentScreen('home')}
          order={mockOrder}
        />
      )}

      {currentScreen === 'payment-history' && (
        <PaymentHistoryModal
          onClose={() => setCurrentScreen('home')}
          orderId={mockOrder.id}
          transactions={mockTransactions}
        />
      )}
    </div>
  );
}
/*Demo page for showing complete escrow workflow (order → payment → completion) with different screens and modals.

This is web-based (React UI) but can also be used in mobile apps via frameworks like React Native (so practically both). */