// Complete 4-Screen Escrow Payment Flow Demonstration
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/labelstatus';
import { 
  Shield, CreditCard, CheckCircle, Clock, Wallet, 
  Package, DollarSign, ArrowRight, Bell, Lock, 
  Unlock, Users, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

export function EscrowFlowDemo({ onClose }) {
  const { isDarkMode } = useTheme();
  const [currentScreen, setCurrentScreen] = useState(1);
  const [orderAmount] = useState(1000);
  const [advanceAmount] = useState(300); // 30%
  const [remainingAmount] = useState(700); // 70%
  const [labourCharges] = useState(200);
  const [transitionType, setTransitionType] = useState('instant');
  const [showLabourSuccessOverlay, setShowLabourSuccessOverlay] = useState(false);

  const screens = [
    { id: 1, title: 'Client Payment (Checkout)' },
    { id: 2, title: 'Manufacturer Dashboard (Advance Released)' },
    { id: 3, title: 'Order Execution (Advance Claimed)' },
    { id: 4, title: 'Final Settlement (Manufacturer & Labour)' },
  ];

  // Figma-style navigation with animation types
  const handleNext = () => {
    if (currentScreen < 4) {
      // Screen 1 → 2: Instant (no animation)
      if (currentScreen === 1) {
        setTransitionType('instant');
      }
      // Screen 2 → 3: Smart Animate
      else if (currentScreen === 2) {
        setTransitionType('smart');
      }
      // Screen 3 → 4: Smart Animate
      else if (currentScreen === 3) {
        setTransitionType('smart');
      }
      
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handlePrevious = () => {
    if (currentScreen > 1) {
      setTransitionType('smart');
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleScreenSelect = (screenId) => {
    setTransitionType('smart');
    setCurrentScreen(screenId);
  };

  // Labour Payment Success Overlay Handler
  const handleLabourPayment = () => {
    setShowLabourSuccessOverlay(true);
    setTimeout(() => {
      setShowLabourSuccessOverlay(false);
    }, 3000);
  };

  // Animation variants for Smart Animate
  const smartAnimateVariants = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  // Instant transition (no animation)
  const instantVariants = {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 1 }
  };

  // Number counter animation for Smart Animate
  const NumberAnimation = ({ value, color }) => {
    return (
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={color}
      >
        ${value}
      </motion.span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className={`w-full max-w-5xl my-8 ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardHeader className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                <Shield className="size-6 text-[#2563EB]" />
                Escrow Payment Flow - 4 Screens Demo
              </CardTitle>
              <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Interactive demonstration of complete escrow payment system
              </CardDescription>
            </div>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="size-5" />
              </Button>
            )}
          </div>
        </CardHeader>

        {/* Screen Navigation */}
        <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700 bg-[#1F2933]' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center justify-between gap-2">
            {screens.map((screen, index) => (
              <div key={screen.id} className="flex items-center flex-1">
                <button
                  onClick={() => handleScreenSelect(screen.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all w-full ${
                    currentScreen === screen.id
                      ? 'bg-[#2563EB] text-white shadow-lg scale-105'
                      : currentScreen > screen.id
                      ? isDarkMode ? 'bg-green-900/20 text-green-400 border border-green-700' : 'bg-green-50 text-green-700 border border-green-200'
                      : isDarkMode ? 'bg-[#2A3642] text-gray-400 border border-gray-700' : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                >
                  <div className={`size-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentScreen === screen.id
                      ? 'bg-white text-[#2563EB]'
                      : currentScreen > screen.id
                      ? 'bg-green-600 text-white'
                      : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentScreen > screen.id ? <CheckCircle className="size-4" /> : screen.id}
                  </div>
                  <span className="text-xs font-medium hidden md:block">{screen.title}</span>
                </button>
                {index < screens.length - 1 && (
                  <ArrowRight className={`size-4 mx-2 flex-shrink-0 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <CardContent className="p-6">
          {/* Screen 1: Client Payment (Checkout) */}
          {currentScreen === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center mb-6">
                <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  Screen 1: Client Payment (Checkout)
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Client initiates payment for order
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <Card className={`shadow-xl ${isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <CardHeader className="text-center border-b border-gray-700">
                    <div className="size-16 mx-auto mb-4 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
                      <Package className="size-8 text-[#2563EB]" />
                    </div>
                    <CardTitle className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>Order Summary</CardTitle>
                    <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Review and confirm your order
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-6 space-y-6">
                    {/* Order Details */}
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#2A3642]' : 'bg-white'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cotton Shirts Production</span>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>500 units</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Unit Price</span>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>$2.00</span>
                      </div>
                      <div className={`border-t pt-2 mt-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                          <span className={`font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Total Order:</span>
                          <span className="text-2xl font-bold text-[#2563EB]">${orderAmount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Escrow Shield */}
                    <div className={`p-4 rounded-lg border-2 ${isDarkMode ? 'bg-[#2563EB]/10 border-[#2563EB]' : 'bg-blue-50 border-[#2563EB]'}`}>
                      <div className="flex items-start gap-3">
                        <div className="size-12 rounded-full bg-[#2563EB]/20 flex items-center justify-center flex-shrink-0">
                          <Shield className="size-6 text-[#2563EB]" />
                        </div>
                        <div>
                          <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                            🛡️ Safety Net - Escrow Protection
                          </h4>
                          <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <strong>100% Commitment:</strong> Your entire payment of <strong>${orderAmount}</strong> is held securely to ensure you are serious.
                          </p>
                          <ul className={`mt-2 space-y-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="size-3 text-green-600" />
                              <span>Manufacturer gets 30% advance ($300) for materials</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Lock className="size-3 text-yellow-600" />
                              <span>70% locked until delivery confirmation ($700)</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Payment Button */}
                    <Button 
                      onClick={handleNext}
                      className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white py-6 text-lg shadow-lg"
                    >
                      <CreditCard className="size-5 mr-2" />
                      Pay ${orderAmount} & Place Order
                    </Button>

                    <p className={`text-xs text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      By placing this order, you agree to our escrow terms and conditions
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Screen 2: Manufacturer Dashboard (Advance Released) */}
          {currentScreen === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center mb-6">
                <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  Screen 2: Manufacturer Dashboard
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  New order received - funds in escrow
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                {/* Notification Banner */}
                <div className={`mb-6 p-4 rounded-lg border-2 ${isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-500'}`}>
                  <div className="flex items-start gap-3">
                    <Bell className="size-6 text-green-600 animate-bounce" />
                    <div className="flex-1">
                      <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                        🎉 New Order Received!
                      </h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Order #12345 - Cotton Shirts Production (500 units)
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]">
                          <Lock className="size-3 mr-1" />
                          Funds in Escrow: ${orderAmount}
                        </Badge>
                        <Badge className="bg-green-500/10 text-green-600 border-green-500">
                          30% Advance Available: ${advanceAmount}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Manufacturer Wallet */}
                  <Card className={`shadow-lg ${isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <CardHeader className="border-b border-gray-700">
                      <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                        <Wallet className="size-5 text-[#2563EB]" />
                        Manufacturer Wallet
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Balance</p>
                        <p className="text-5xl font-bold text-gray-500 mb-4">$0</p>
                        <Badge variant="outline" className={isDarkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-600'}>
                          No funds released yet
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Escrow Status */}
                  <Card className={`shadow-lg ${isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <CardHeader className="border-b border-gray-700">
                      <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                        <Shield className="size-5 text-[#2563EB]" />
                        Escrow Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total in Escrow</span>
                          <span className={`font-bold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>${orderAmount}</span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                          <div className="h-full bg-[#2563EB]" style={{ width: '100%' }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>30% Advance</span>
                          <span className="text-green-600 font-semibold">${advanceAmount}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>70% Remaining</span>
                          <span className="text-yellow-600 font-semibold">${remainingAmount}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Button */}
                <div className="mt-6">
                  <div className={`mb-4 p-4 rounded-lg border-2 ${isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-500'}`}>
                    <div className="flex items-start gap-3">
                      <DollarSign className="size-6 text-green-600 flex-shrink-0" />
                      <div>
                        <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                          💰 30% Advance - Materials Purchase
                        </h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          As soon as you accept this order, <strong className="text-green-600">${advanceAmount}</strong> will automatically move to your wallet so you can buy raw materials and start production immediately.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={handleNext}
                    className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white py-6 text-lg shadow-lg"
                  >
                    <CheckCircle className="size-5 mr-2" />
                    Accept Order & Claim 30% Advance (${advanceAmount})
                  </Button>
                  <p className={`text-xs text-center mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Remaining ${remainingAmount} (70%) will be held in escrow until delivery confirmation
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Screen 3: Order Execution (Advance Claimed) */}
          {currentScreen === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center mb-6">
                <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  Screen 3: Order Execution
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Advance claimed - order in progress
                </p>
              </div>

              <div className="max-w-4xl mx-auto space-y-6">
                {/* Status Update */}
                <div className={`p-6 rounded-lg border-2 ${isDarkMode ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-500'}`}>
                  <div className="flex items-center gap-3">
                    <Clock className="size-8 text-yellow-600 animate-pulse" />
                    <div>
                      <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                        Order in Progress...
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Manufacturing 500 Cotton Shirts | Est. Completion: 15 days
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Manufacturer View */}
                  <Card className={`shadow-lg ${isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <CardHeader className="border-b border-gray-700">
                      <CardTitle className={`flex items-center gap-2 text-[#2563EB]`}>
                        <Package className="size-5" />
                        Manufacturer View
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {/* Wallet Update */}
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#2A3642]' : 'bg-white'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manufacturer Wallet</span>
                          <Badge className="bg-green-500/10 text-green-600 border-green-500">
                            <Unlock className="size-3 mr-1" />
                            Released
                          </Badge>
                        </div>
                        <p className="text-4xl font-bold text-green-600">${advanceAmount}</p>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          30% Advance Received
                        </p>
                      </div>

                      {/* Remaining Escrow */}
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#2A3642]' : 'bg-white'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Remaining Escrow</span>
                          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500">
                            <Lock className="size-3 mr-1" />
                            Locked
                          </Badge>
                        </div>
                        <p className="text-4xl font-bold text-yellow-600">${remainingAmount}</p>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          Will be released on delivery
                        </p>
                      </div>

                      {/* Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Production Progress</span>
                          <span className={`text-xs font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>60%</span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                          <div className="h-full bg-[#2563EB]" style={{ width: '60%' }} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Client View */}
                  <Card className={`shadow-lg ${isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <CardHeader className="border-b border-gray-700">
                      <CardTitle className={`flex items-center gap-2 text-[#2563EB]`}>
                        <Users className="size-5" />
                        Client View
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {/* Order Status */}
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#2A3642]' : 'bg-white'}`}>
                        <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                          Order Status
                        </h4>
                        <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Your order is being manufactured
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="size-3 rounded-full bg-green-600 animate-pulse" />
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>In Progress - 60% Complete</span>
                        </div>
                      </div>

                      {/* Payment Status */}
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#2A3642]' : 'bg-white'}`}>
                        <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                          Payment Status
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Paid to Escrow</span>
                            <span className="text-[#2563EB] font-semibold">${orderAmount}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Released (30%)</span>
                            <span className="text-green-600 font-semibold">${advanceAmount}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Held (70%)</span>
                            <span className="text-yellow-600 font-semibold">${remainingAmount}</span>
                          </div>
                        </div>
                      </div>

                      {/* Client Action Button */}
                      <div className={`p-4 rounded-lg border-2 ${isDarkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-500'}`}>
                        <div className="flex items-start gap-2 mb-3">
                          <Shield className="size-5 text-[#2563EB] flex-shrink-0" />
                          <div>
                            <h4 className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                              🔒 70% Release - Client Protection
                            </h4>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              The remaining <strong className="text-yellow-600">${remainingAmount}</strong> only moves after you confirm delivery. This protects your investment.
                            </p>
                          </div>
                        </div>
                        <p className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Once you receive and verify the delivery:
                        </p>
                        <Button 
                          onClick={handleNext}
                          className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                        >
                          <CheckCircle className="size-4 mr-2" />
                          Mark as Delivered & Release 70%
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Screen 4: Final Settlement */}
          {currentScreen === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center mb-6">
                <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  Screen 4: Final Settlement
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Order completed - full payment released
                </p>
              </div>

              <div className="max-w-4xl mx-auto space-y-6">
                {/* Success Banner */}
                <div className={`p-6 rounded-lg border-2 ${isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-500'}`}>
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-full bg-green-600 flex items-center justify-center">
                      <CheckCircle className="size-6 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                        🎉 Order Successfully Completed!
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        All payments have been processed and released
                      </p>
                    </div>
                  </div>
                </div>

                {/* Manufacturer Financial Update */}
                <Card className={`shadow-lg ${isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <CardHeader className="border-b border-gray-700">
                    <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                      <Wallet className="size-5 text-[#2563EB]" />
                      Manufacturer Wallet - Final Settlement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols Ascending-descending order-1 md:grid-cols-3 gap-4 mb-6">
                      {/* Total Wallet */}
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#2A3642]' : 'bg-white'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Wallet</span>
                          <Badge className="bg-green-500/10 text-green-600 border-green-500">
                            <CheckCircle className="size-3 mr-1" />
                            Complete
                          </Badge>
                        </div>
                        <p className="text-4xl font-bold text-green-600">${orderAmount}</p>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          100% Released
                        </p>
                      </div>

                      {/* Escrow Balance */}
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#2A3642]' : 'bg-white'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Escrow Balance</span>
                          <Badge variant="outline" className={isDarkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-600'}>
                            Empty
                          </Badge>
                        </div>
                        <p className="text-4xl font-bold text-gray-500">$0</p>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          All funds released
                        </p>
                      </div>

                      {/* Breakdown */}
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#2A3642]' : 'bg-white'}`}>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Payment Breakdown</span>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Advance (30%)</span>
                            <span className="text-green-600">+${advanceAmount}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Final (70%)</span>
                            <span className="text-green-600">+${remainingAmount}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#2A3642]' : 'bg-white'}`}>
                      <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                        Payment Timeline
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="size-4 text-green-600 mt-0.5" />
                          <div className="flex-1">
                            <p className={`text-sm ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Order Accepted</p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>30% Advance Released: ${advanceAmount}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="size-4 text-green-600 mt-0.5" />
                          <div className="flex-1">
                            <p className={`text-sm ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Order Delivered</p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>70% Final Payment Released: ${remainingAmount}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Labour Payment Section */}
                <Card className={`shadow-lg ${isDarkMode ? 'bg-[#1F2933] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <CardHeader className="border-b border-gray-700">
                    <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                      <Users className="size-5 text-[#2563EB]" />
                      Labour Payment
                    </CardTitle>
                    <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Pay skilled workers for their contribution
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Labour Details */}
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#2A3642]' : 'bg-white'}`}>
                        <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                          Hired Labour
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Ahmed Ali (Master Tailor)</p>
                              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>10 days worked</p>
                            </div>
                            <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>$100</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={`text-sm font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Hassan Malik (Fabric Cutter)</p>
                              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>10 days worked</p>
                            </div>
                            <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>$100</span>
                          </div>
                          <div className={`border-t pt-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-center justify-between">
                              <span className={`font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Total Labour Charges:</span>
                              <span className="text-xl font-bold text-[#2563EB]">${labourCharges}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Action */}
                      <div className={`p-4 rounded-lg flex flex-col justify-between ${isDarkMode ? 'bg-[#2A3642]' : 'bg-white'}`}>
                        <div>
                          <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                            Release Payment
                          </h4>
                          <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Pay all workers for their contribution to this order
                          </p>
                          <div className={`p-3 rounded-lg mb-4 ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Your Wallet</span>
                              <span className="text-green-600 font-semibold">${orderAmount}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Labour Payment</span>
                              <span className="text-red-600 font-semibold">-${labourCharges}</span>
                            </div>
                            <div className={`border-t pt-1 mt-1 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                              <div className="flex items-center justify-between">
                                <span className={`font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Final Balance</span>
                                <span className="text-lg font-bold text-[#2563EB]">${orderAmount - labourCharges}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button 
                          onClick={handleLabourPayment}
                          className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                        >
                          <DollarSign className="size-4 mr-2" />
                          Pay Labour ${labourCharges}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary Box */}
                <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-[#2563EB]/10 border-2 border-[#2563EB]' : 'bg-blue-50 border-2 border-[#2563EB]'}`}>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="size-6 text-[#2563EB] flex-shrink-0" />
                    <div>
                      <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                        Transaction Complete
                      </h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Order #12345 has been successfully completed with full escrow payment released. 
                        Manufacturer received ${orderAmount} total and can now pay labour charges of ${labourCharges}.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge className="bg-green-500/10 text-green-600 border-green-500">
                          Client Satisfied
                        </Badge>
                        <Badge className="bg-green-500/10 text-green-600 border-green-500">
                          Payment Released
                        </Badge>
                        <Badge className="bg-green-500/10 text-green-600 border-green-500">
                          Order Completed
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
            <Button
              onClick={handlePrevious}
              disabled={currentScreen === 1}
              variant="outline"
              className={currentScreen === 1 ? 'opacity-50 cursor-not-allowed' : ''}
            >
              <ChevronLeft className="size-4 mr-2" />
              Previous Screen
            </Button>
            
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Screen {currentScreen} of 4
            </div>

            {currentScreen < 4 ? (
              <Button
                onClick={handleNext}
                className="bg-[#2563EB] hover:bg-[#1d4ed8]"
              >
                Next Screen
                <ChevronRight className="size-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentScreen(1)}
                className="bg-[#2563EB] hover:bg-[#1d4ed8]"
              >
                Restart Demo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Labour Payment Success Overlay */}
      <AnimatePresence>
        {showLabourSuccessOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]"
            onClick={() => setShowLabourSuccessOverlay(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className={`max-w-md w-full mx-4 p-8 rounded-2xl shadow-2xl ${isDarkMode ? 'bg-[#1F2933] border-2 border-green-700' : 'bg-white border-2 border-green-500'}`}
            >
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="size-20 rounded-full bg-green-600 flex items-center justify-center"
                >
                  <CheckCircle className="size-12 text-white" />
                </motion.div>
              </div>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  🎉 Labour Paid Successfully!
                </h3>
                <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  ${labourCharges} has been transferred to all workers
                </p>

                {/* Payment Details */}
                <div className={`p-4 rounded-lg mb-6 ${isDarkMode ? 'bg-[#2A3642]' : 'bg-gray-50'}`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Ahmed Ali</span>
                      <span className="text-green-600 font-semibold">+$100</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Hassan Malik</span>
                      <span className="text-green-600 font-semibold">+$100</span>
                    </div>
                    <div className={`border-t pt-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Total Paid</span>
                        <span className="text-lg font-bold text-green-600">${labourCharges}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transparency Message */}
                <div className={`p-4 rounded-lg mb-6 ${isDarkMode ? 'bg-[#2563EB]/10 border border-[#2563EB]' : 'bg-blue-50 border border-[#2563EB]'}`}>
                  <div className="flex items-start gap-2">
                    <Shield className="size-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <h4 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                        Labour Transparency
                      </h4>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        All labour payments are tracked and verified through Skillora platform, ensuring fair wages and transparency.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <Button 
                  onClick={() => setShowLabourSuccessOverlay(false)}
                  className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                >
                  Close
                </Button>

                <p className={`text-xs mt-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  This window will auto-close in 3 seconds
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/*Purpose: This file demonstrates a complete 4-step escrow payment workflow with interactive screens for client, manufacturer, and final settlement.

Type: It is a frontend component, so it can be used for both web apps and hybrid app (mobile/web) environments.
*/
