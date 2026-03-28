// R.1.19, R.1.20, R.1.21: Dispute Management System
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { AlertTriangle, X, CheckCircle, Clock, AlertCircle, Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function DisputeModal({ onClose, orderId, orderTitle }) {
  const { isDarkMode } = useTheme();
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeDescription, setDisputeDescription] = useState('');
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [resolution, setResolution] = useState(null);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setEvidenceFiles(prev => [...prev, ...files]);
  };

  const handleSubmit = () => {
    if (!disputeReason || !disputeDescription) {
      alert('Please fill all required fields');
      return;
    }

    // R.1.20: Automated Dispute Resolution - AI analyzes dispute
    setSubmitted(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      // Check if dispute is minor (can be auto-resolved)
      const isMinorDispute = disputeDescription.length < 200 || 
                            disputeReason.toLowerCase().includes('delay') ||
                            disputeReason.toLowerCase().includes('quality issue');
      
      if (isMinorDispute && evidenceFiles.length > 0) {
        // R.1.20: Auto-resolve minor disputes
        setResolution('auto-resolved');
      } else {
        // R.1.21: Escalate major disputes to admin
        setResolution('escalated');
      }
    }, 3000);
  };

  if (submitted && !resolution) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className={`w-full max-w-md ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardContent className="p-8 text-center">
            <div className={`size-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-[#2563EB]/20' : 'bg-[#2563EB]/10'}`}>
              <Shield className="size-8 text-[#2563EB] animate-pulse" />
            </div>
            <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>AI Analyzing Dispute</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Our AI system is analyzing communication logs, order details, and evidence...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (resolution === 'auto-resolved') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className={`w-full max-w-md ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardContent className="p-8 text-center">
            <div className={`size-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
              <CheckCircle className="size-8 text-green-600" />
            </div>
            <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Dispute Resolved Automatically</h3>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Based on AI analysis of communication logs and order details, your dispute has been resolved:
            </p>
            <div className={`text-left p-4 rounded-lg mb-4 ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <strong>Resolution:</strong> 10% refund credited to your account. The manufacturer has been notified to improve quality standards.
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

  if (resolution === 'escalated') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className={`w-full max-w-md ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardContent className="p-8 text-center">
            <div className={`size-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
              <AlertTriangle className="size-8 text-yellow-600" />
            </div>
            <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Dispute Escalated to Admin</h3>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              This dispute requires manual review by our admin team.
            </p>
            <div className={`text-left p-4 rounded-lg mb-4 ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <strong>Status:</strong> Escalated
                <br/>
                <strong>Reference ID:</strong> DSP-{orderId}-{Date.now()}
                <br/>
                <strong>Expected Resolution:</strong> 24-48 hours
              </p>
            </div>
            <p className={`text-xs mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              You will receive a notification once the admin reviews your case.
            </p>
            <Button onClick={onClose} className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className={`w-full max-w-2xl ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardHeader className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>Raise Dispute</CardTitle>
              <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Order: {orderTitle}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          <div className={`flex items-start gap-3 p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
            <AlertCircle className="size-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
            <div>
              <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                AI-Powered Dispute Resolution
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Minor disputes are automatically resolved using AI analysis of communication logs and order details. Major disputes are escalated to admin for manual review.
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="disputeReason" className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>Dispute Reason *</Label>
            <Input
              id="disputeReason"
              placeholder="e.g., Quality issue, Delayed delivery, Wrong items"
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
            />
          </div>

          <div>
            <Label htmlFor="disputeDescription" className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>Detailed Description *</Label>
            <Textarea
              id="disputeDescription"
              placeholder="Describe the issue in detail..."
              value={disputeDescription}
              onChange={(e) => setDisputeDescription(e.target.value)}
              className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
              rows={4}
            />
          </div>

          <div>
            <Label className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>Upload Evidence (Optional)</Label>
            <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Upload images or documents to support your claim
            </p>
            <Input
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className={`mt-1 ${isDarkMode ? 'bg-[#1F2933] border-gray-700 text-[#F9FAFB]' : 'bg-white border-gray-300 text-[#1F2933]'}`}
            />
            {evidenceFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                {evidenceFiles.map((file, idx) => (
                  <div key={idx} className={`text-xs p-2 rounded ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{file.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8]">
              Submit Dispute
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


/* Purpose: This file creates a dispute management modal where users can submit complaints, upload evidence, and get AI-based resolution or admin escalation.

Type: It is mainly for web-based apps (React UI) but can also be used in hybrid/mobile apps (so usable for both).


 */