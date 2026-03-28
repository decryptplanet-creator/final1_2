import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea input';
import { Label } from './ui/label';
import { 
  X, HardHat, Calendar, DollarSign, MapPin, Clock, 
  CheckCircle, AlertCircle 
} from 'lucide-react';
import { Badge } from './ui/labelstatus';

export function HireConfirmationModal({ labour, onConfirm, onClose }) {
  const [step, setStep] = useState('details');
  const [hireDetails, setHireDetails] = useState({
    startDate: '',
    duration: '',
    workLocation: '',
    budget: '',
    jobDescription: '',
    paymentTerms: 'hourly',
  });

  const handleInputChange = (field, value) => {
    setHireDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirm = () => {
    if (!hireDetails.startDate || !hireDetails.duration || !hireDetails.workLocation || !hireDetails.jobDescription) {
      alert('Please fill all required fields');
      return;
    }
    
    setStep('confirmed');
    
    setTimeout(() => {
      onConfirm({
        labour,
        ...hireDetails
      });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full bg-gray-900 border-gray-800">
        <CardHeader className="border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 bg-[#2563EB] rounded-lg flex items-center justify-center">
                <HardHat className="size-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-white">
                  {step === 'details' ? 'Hire Labour' : 'Hire Request Sent!'}
                </CardTitle>
                <p className="text-sm text-gray-400">{labour.name} - {labour.skill}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="size-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {step === 'details' ? (
            <div className="space-y-5">
              {/* Labour Info Summary */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold mb-1">{labour.name}</h3>
                    <p className="text-sm text-gray-400">{labour.skill}</p>
                  </div>
                  <Badge className="bg-[#2563EB] text-white">
                    ⭐ {labour.rating}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="size-4" />
                    <span>{labour.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <DollarSign className="size-4" />
                    <span>{labour.rate}</span>
                  </div>
                </div>
              </div>

              {/* Hire Details Form */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300 flex items-center gap-2">
                    <Calendar className="size-4" />
                    Start Date *
                  </Label>
                  <Input
                    type="date"
                    value={hireDetails.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 flex items-center gap-2">
                    <Clock className="size-4" />
                    Duration *
                  </Label>
                  <Input
                    placeholder="e.g., 2 weeks, 1 month"
                    value={hireDetails.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-300 flex items-center gap-2">
                  <MapPin className="size-4" />
                  Work Location *
                </Label>
                <Input
                  placeholder="Where will the work take place?"
                  value={hireDetails.workLocation}
                  onChange={(e) => handleInputChange('workLocation', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Job Description *</Label>
                <Textarea
                  placeholder="Describe the work requirements..."
                  value={hireDetails.jobDescription}
                  onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                  rows={4}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300 flex items-center gap-2">
                  <DollarSign className="size-4" />
                  Budget (Optional)
                </Label>
                <Input
                  type="number"
                  placeholder="Total budget in PKR"
                  value={hireDetails.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Payment Terms</Label>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => handleInputChange('paymentTerms', 'hourly')}
                    className={`flex-1 p-3 rounded-lg border transition-colors ${
                      hireDetails.paymentTerms === 'hourly'
                        ? 'bg-[#2563EB]/20 border-[#2563EB] text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <p className="font-medium">Hourly</p>
                    <p className="text-xs">{labour.rate}</p>
                  </button>
                  <button
                    onClick={() => handleInputChange('paymentTerms', 'fixed')}
                    className={`flex-1 p-3 rounded-lg border transition-colors ${
                      hireDetails.paymentTerms === 'fixed'
                        ? 'bg-[#2563EB]/20 border-[#2563EB] text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <p className="font-medium">Fixed Price</p>
                    <p className="text-xs">One-time payment</p>
                  </button>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="size-5 text-blue-500 shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-300">
                    <p className="font-medium text-white mb-1">Payment Information</p>
                    <p>Labour payments are made directly to the worker, not through Skillora's escrow system. Please agree on payment terms before work begins.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-gray-700 text-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                >
                  Send Hire Request
                </Button>
              </div>
            </div>
          ) : (
            /* Confirmation Success */
            <div className="py-8 text-center">
              <div className="size-20 bg-[#2563EB]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="size-10 text-[#2563EB]" />
              </div>
              <h3 className="text-2xl text-white font-semibold mb-2">Hire Request Sent!</h3>
              <p className="text-gray-400 mb-6">
                Your hire request has been sent to <span className="text-white font-medium">{labour.name}</span>
              </p>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 max-w-md mx-auto mb-6">
                <div className="space-y-2 text-sm text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Start Date:</span>
                    <span className="text-white">{hireDetails.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">{hireDetails.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location:</span>
                    <span className="text-white">{hireDetails.workLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment:</span>
                    <span className="text-white capitalize">{hireDetails.paymentTerms}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-6">
                You will be notified once {labour.name} responds to your request.
              </p>
              <Button
                onClick={onClose}
                className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
              >
                Done
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
/*Purpose: This file creates a hire confirmation modal where a user fills job details and sends a hiring request to a labour, with success confirmation.

Type: It is a frontend component, so it can be used for both web apps and hybrid (mobile/web) apps. */