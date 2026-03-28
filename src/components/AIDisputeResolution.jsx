import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea input';
import { Badge } from './ui/labelstatus';
import { X, Sparkles, FileText, Scale, AlertCircle, CheckCircle, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

export function AIDisputeResolution({ 
  orderId, 
  clientName, 
  manufacturerName, 
  orderAmount, 
  onClose 
}) {
  const { isDarkMode } = useTheme();
  const [step, setStep] = useState('form');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [aiDecision, setAiDecision] = useState(null);

  // AI Analysis Animation
  useEffect(() => {
    if (step === 'analyzing') {
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            // Simulate AI decision
            const decision = {
              verdict: 'Partial Refund Recommended',
              refundPercentage: 15,
              reasoning: [
                'Chat logs show manufacturer acknowledged 2-day delivery delay',
                'Delivery proof uploaded shows late timestamp',
                'Client requested deadline was clearly communicated',
                'No previous disputes found for this manufacturer',
                'Quality of work meets agreed standards'
              ],
              confidence: 87
            };
            setAiDecision(decision);
            setTimeout(() => setStep('decision'), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleSubmitDispute = () => {
    if (reason && description) {
      setStep('analyzing');
      setAnalysisProgress(0);
    }
  };

  // Step 1: Dispute Form
  if (step === 'form') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className={`w-full max-w-2xl ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                  <Scale className="size-6 text-[#2563EB]" />
                  Raise Dispute - AI Resolution
                </CardTitle>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Order ID: {orderId}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="size-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Order Details */}
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Client</p>
                  <p className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{clientName}</p>
                </div>
                <div>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Manufacturer</p>
                  <p className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>{manufacturerName}</p>
                </div>
                <div>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Order Amount</p>
                  <p className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Rs. {orderAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Status</p>
                  <Badge className="bg-yellow-600">In Progress</Badge>
                </div>
              </div>
            </div>

            {/* AI Info Banner */}
            <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-start gap-3">
                <Sparkles className="size-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                <div>
                  <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2937]'}`}>
                    AI-Powered Resolution
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Our AI will analyze chat history, delivery proofs, and order timeline to provide a fair resolution. You can escalate to human admin if needed.
                  </p>
                </div>
              </div>
            </div>

            {/* Dispute Reason */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>
                Dispute Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300'
                }`}
              >
                <option value="">Select a reason</option>
                <option value="late_delivery">Late Delivery</option>
                <option value="quality_issues">Quality Issues</option>
                <option value="incomplete_order">Incomplete Order</option>
                <option value="wrong_specifications">Wrong Specifications</option>
                <option value="damaged_goods">Damaged Goods</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>
                Detailed Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed information about your dispute..."
                className={`min-h-[120px] ${
                  isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300'
                }`}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8]"
                onClick={handleSubmitDispute}
                disabled={!reason || !description}
              >
                <Sparkles className="size-4 mr-2" />
                Submit for AI Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 2: AI Analyzing
  if (step === 'analyzing') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className={`w-full max-w-2xl ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              <Sparkles className="size-6 text-[#2563EB] animate-pulse" />
              AI Analyzing Dispute...
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Analysis Steps */}
            <div className="space-y-3">
              {[
                { label: 'Reviewing chat history', done: analysisProgress > 20 },
                { label: 'Analyzing delivery proofs', done: analysisProgress > 40 },
                { label: 'Checking order timeline', done: analysisProgress > 60 },
                { label: 'Evaluating quality standards', done: analysisProgress > 80 },
                { label: 'Generating resolution', done: analysisProgress >= 100 }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'
                  }`}
                >
                  {item.done ? (
                    <CheckCircle className="size-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <div className={`size-5 rounded-full border-2 flex-shrink-0 ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    }`} />
                  )}
                  <span className={`text-sm ${
                    item.done 
                      ? isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'
                      : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <Sparkles className="size-4 text-[#2563EB]" />
                  AI Processing...
                </span>
                <span className="text-[#2563EB] font-medium">{analysisProgress}%</span>
              </div>
              <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                <motion.div
                  className="h-full bg-[#2563EB]"
                  initial={{ width: 0 }}
                  animate={{ width: `${analysisProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 3: AI Decision
  if (step === 'decision' && aiDecision) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-2xl"
        >
          <Card className={isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}>
            <CardHeader className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                    <Sparkles className="size-6 text-[#2563EB]" />
                    AI Decision - Dispute #{orderId}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-green-600">AI Analyzed</Badge>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {aiDecision.confidence}% Confidence
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="size-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Verdict */}
              <div className={`p-6 rounded-lg border-2 ${isDarkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
                <div className="text-center mb-4">
                  <Scale className="size-12 text-[#2563EB] mx-auto mb-3" />
                  <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                    {aiDecision.verdict}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-bold text-[#2563EB]">{aiDecision.refundPercentage}%</span>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Refund</span>
                  </div>
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Rs. {((orderAmount * aiDecision.refundPercentage) / 100).toLocaleString()} to be refunded
                  </p>
                </div>
              </div>

              {/* AI Reasoning */}
              <div>
                <h4 className={`text-sm font-medium mb-3 flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}`}>
                  <FileText className="size-4 text-[#2563EB]" />
                  AI Analysis & Reasoning
                </h4>
                <div className="space-y-2">
                  {aiDecision.reasoning.map((point, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`flex items-start gap-3 p-3 rounded-lg ${
                        isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'
                      }`}
                    >
                      <CheckCircle className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {point}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]"
                  onClick={() => {
                    alert('Refund processed! Amount will be credited to your account within 2-3 business days.');
                    onClose();
                  }}
                >
                  <CheckCircle className="size-4 mr-2" />
                  Accept AI Decision
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep('escalate')}
                >
                  <User className="size-4 mr-2" />
                  Request Human Admin Review
                </Button>
              </div>

              <p className={`text-xs text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                AI decisions are based on platform policies and evidence analysis. You can escalate to human review if you disagree.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Step 4: Escalate to Human
  if (step === 'escalate') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className={`w-full max-w-md ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardContent className="p-8 text-center">
            <div className={`size-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
            }`}>
              <User className="size-8 text-[#2563EB]" />
            </div>
            <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              Escalated to Admin Review
            </h3>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Your dispute has been escalated to our human admin team. You will receive a response within 24-48 hours.
            </p>
            <div className={`text-left p-4 rounded-lg mb-4 ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <strong>Case ID:</strong> ESC-{orderId}<br/>
                <strong>Status:</strong> Pending Admin Review<br/>
                <strong>Expected Resolution:</strong> 24-48 hours
              </p>
            </div>
            <Button onClick={onClose} className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
/* This file handles AI-powered dispute resolution between client and manufacturer, analyzing issues and giving automated decisions (refund, verdict, etc.).

It is for web-based apps (React frontend), but can also be used in hybrid apps (both) if built with React frameworks.*/