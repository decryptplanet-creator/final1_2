import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea input';
import { Label } from './ui/label';
import { 
  X, User, Mail, Phone, MapPin, Briefcase, Save, CheckCircle 
} from 'lucide-react';

export function EditProfileModal({ user, onSave, onClose }) {
  const [step, setStep] = useState('editing');
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || '',
    companyName: user.companyName || '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      companyName: formData.companyName,
    };

    setStep('saved');
    
    setTimeout(() => {
      onSave(updatedUser);
    }, 1500);
  };

  const getColor = () => {
    if (user.type === 'client') return { 
      bg: 'bg-purple-500', 
      text: 'text-purple-500',
      bgLight: 'bg-purple-500/10',
      border: 'border-purple-500'
    };
    if (user.type === 'manufacturer') return { 
      bg: 'bg-teal-700', 
      text: 'text-teal-500',
      bgLight: 'bg-teal-700/10',
      border: 'border-teal-500'
    };
    return { 
      bg: 'bg-[#2563EB]', 
      text: 'text-[#2563EB]',
      bgLight: 'bg-[#2563EB]/10',
      border: 'border-[#2563EB]'
    };
  };

  const color = getColor();

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full bg-gray-900 border-gray-800">
        <CardHeader className={`${color.bgLight} border-b border-gray-800`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`size-12 ${color.bg} rounded-lg flex items-center justify-center`}>
                <User className="size-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-white">
                  {step === 'editing' ? 'Edit Profile' : 'Profile Updated!'}
                </CardTitle>
                <p className="text-sm text-gray-400">Update your account information</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="size-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {step === 'editing' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300 flex items-center gap-2">
                    <User className="size-4" />
                    Full Name
                  </Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 flex items-center gap-2">
                    <Mail className="size-4" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300 flex items-center gap-2">
                    <Phone className="size-4" />
                    Phone Number
                  </Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">City</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-300 flex items-center gap-2">
                  <MapPin className="size-4" />
                  Address
                </Label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {user.type === 'client' && (
                <div>
                  <Label className="text-gray-300 flex items-center gap-2">
                    <Briefcase className="size-4" />
                    Company Name
                  </Label>
                  <Input
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-gray-700 text-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className={`flex-1 ${color.bg} hover:opacity-90 text-white`}
                >
                  <Save className="size-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            /* Save Success */
            <div className="py-8 text-center">
              <div className={`size-20 ${color.bgLight} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <CheckCircle className={`size-10 ${color.text}`} />
              </div>
              <h3 className="text-2xl text-white font-semibold mb-2">Profile Updated!</h3>
              <p className="text-gray-400 mb-6">
                Your profile information has been successfully updated.
              </p>
              <div className={`bg-gray-800 border ${color.border} rounded-lg p-4 max-w-md mx-auto mb-6`}>
                <div className="space-y-2 text-sm text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="text-white">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phone:</span>
                    <span className="text-white">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">City:</span>
                    <span className="text-white">{formData.city}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
/* Purpose: Yeh file user ko apni profile information edit aur update karne ke liye modal UI provide karti hai.
Type: Yeh web-based application ke liye hai (React frontend), mobile ke liye directly nahi. */