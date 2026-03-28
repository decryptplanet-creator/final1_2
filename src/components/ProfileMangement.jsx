import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/labelstatus';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea input';
import { X, Star, Award, CheckCircle, Calendar, MapPin, Phone, Mail, Edit, FileText, DollarSign, MessageSquare, Settings, Upload, User as UserIcon, ArrowLeft } from 'lucide-react';
import { useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export function ProfileModal({ user, onClose, onChatClick }) {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    bio: 'Experienced professional with 5+ years in the industry',
  });
  const [savedData, setSavedData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    bio: 'Experienced professional with 5+ years in the industry',
  });
  const fileInputRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState({});

  const mockPaymentHistory = [
    { id: '1', date: '2025-12-01', amount: 15000, description: 'Order #1234 - Cotton Shirts', status: 'Completed' },
    { id: '2', date: '2025-11-28', amount: 25000, description: 'Order #1233 - Leather Bags', status: 'Completed' },
    { id: '3', date: '2025-11-20', amount: 18000, description: 'Order #1232 - Furniture Set', status: 'Completed' },
  ];

  const mockReviews = [
    { id: '1', from: 'ABC Textiles', rating: 5, comment: 'Excellent work quality and on-time delivery!', date: '2025-12-01' },
    { id: '2', from: 'Premium Leather Co.', rating: 4, comment: 'Good work, minor delays but quality was great.', date: '2025-11-28' },
    { id: '3', from: 'Fashion House', rating: 5, comment: 'Outstanding craftsmanship!', date: '2025-11-20' },
  ];

  const mockDocuments = [
    { id: '1', name: 'CNIC Copy', status: 'Verified', uploadedDate: '2025-10-15' },
    { id: '2', name: 'Business License', status: 'Verified', uploadedDate: '2025-10-15' },
    { id: '3', name: 'Affidavit', status: 'Verified', uploadedDate: '2025-10-16' },
  ];

  const handleSaveProfile = () => {
    // Update saved data to reflect changes
    setSavedData(formData);
    console.log('Profile saved:', formData);
    setIsEditing(false);
    // Show success message
    alert('Profile updated successfully!');
  };

  const handleFileUpload = (docType) => {
    // Trigger file input click
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('data-doc-type', docType);
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    const docType = e.target.getAttribute('data-doc-type');
    if (file && docType) {
      console.log(`Uploading ${docType}:`, file.name);
      setUploadedFiles(prev => ({ ...prev, [docType]: file.name }));
      // Here you would typically upload to a server
      alert(`File "${file.name}" selected for ${docType}. In production, this would be uploaded to server.`);
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${isDarkMode ? 'bg-[#1F2933]/95' : 'bg-black/50'}`}>
      {/* Hidden file input */}
      <input 
        ref={fileInputRef}
        type="file" 
        className="hidden" 
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
      />
      
      <Card className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-white'} ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <CardHeader className={`border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
                title="Back"
              >
                <ArrowLeft className="size-5" />
              </button>
              <div>
                <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>Profile</CardTitle>
                <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>View profile details and manage settings</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              {onChatClick && (
                <Button 
                  onClick={onChatClick} 
                  className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                >
                  <MessageSquare className="size-4 mr-2" />
                  Chat
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={onClose} className={isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}>
                <X className="size-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Tabs */}
        <div className={`flex gap-4 px-6 pt-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-2 border-b-2 transition-colors ${
              activeTab === 'profile' 
                ? 'border-[#2563EB] text-[#2563EB]' 
                : 'border-transparent text-gray-400 hover:text-[#2563EB]'
            }`}
          >
            <UserIcon className="size-4 inline mr-2" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`pb-3 px-2 border-b-2 transition-colors ${
              activeTab === 'documents' 
                ? 'border-[#2563EB] text-[#2563EB]' 
                : 'border-transparent text-gray-400 hover:text-[#2563EB]'
            }`}
          >
            <FileText className="size-4 inline mr-2" />
            Documents
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`pb-3 px-2 border-b-2 transition-colors ${
              activeTab === 'payments' 
                ? 'border-[#2563EB] text-[#2563EB]' 
                : 'border-transparent text-gray-400 hover:text-[#2563EB]'
            }`}
          >
            <DollarSign className="size-4 inline mr-2" />
            Payments
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 px-2 border-b-2 transition-colors ${
              activeTab === 'reviews' 
                ? 'border-[#2563EB] text-[#2563EB]' 
                : 'border-transparent text-gray-400 hover:text-[#2563EB]'
            }`}
          >
            <Star className="size-4 inline mr-2" />
            Reviews
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-2 border-b-2 transition-colors ${
              activeTab === 'settings' 
                ? 'border-[#2563EB] text-[#2563EB]' 
                : 'border-transparent text-gray-400 hover:text-[#2563EB]'
            }`}
          >
            <Settings className="size-4 inline mr-2" />
            Settings
          </button>
        </div>

        <CardContent className="space-y-6 p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <>
              {/* Profile Header */}
              <div className={`flex items-center gap-4 pb-6 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="relative">
                  <div className="size-20 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] flex items-center justify-center text-white">
                    {user.name.charAt(0)}
                  </div>
                  <button 
                    onClick={() => handleFileUpload('profile-photo')}
                    className="absolute bottom-0 right-0 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-full p-1.5"
                  >
                    <Upload className="size-3" />
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>{savedData.name}</h2>
                    {user.verified && (
                      <CheckCircle className="size-5 text-green-600" />
                    )}
                  </div>
                  <div className={`flex items-center gap-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <div className="flex items-center gap-1">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      <span>{user.rating || 4.7} Rating</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Award className="size-4" />
                      <span>{user.totalReviews || 23} Reviews</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className={`mt-2 ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-[#1F2933]'}`}>
                    {user.type?.charAt(0).toUpperCase()}{user.type?.slice(1)}
                  </Badge>
                </div>
                <Button 
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  className={isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-[#1F2933] hover:bg-gray-100'}
                >
                  <Edit className="size-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>

              {/* Editable Form */}
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>Full Name</Label>
                    <Input 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-[#1F2933]'}
                    />
                  </div>
                  <div>
                    <Label className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>Email</Label>
                    <Input 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-[#1F2933]'}
                    />
                  </div>
                  <div>
                    <Label className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>Phone</Label>
                    <Input 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-[#1F2933]'}
                    />
                  </div>
                  <div>
                    <Label className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>Bio</Label>
                    <Textarea 
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className={isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-[#1F2933]'}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white">
                      Save Changes
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline" className={isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-[#1F2933] hover:bg-gray-100'}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Contact Information */}
                  <div>
                    <h3 className={`mb-3 ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>Contact Information</h3>
                    <div className="space-y-2">
                      <div className={`flex items-center gap-3 p-3 rounded-lg border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                        <Mail className={`size-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                        <span className={isDarkMode ? 'text-gray-200' : 'text-[#1F2933]'}>{user.email}</span>
                      </div>
                      <div className={`flex items-center gap-3 p-3 rounded-lg border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                        <Phone className={`size-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                        <span className={isDarkMode ? 'text-gray-200' : 'text-[#1F2933]'}>{user.phone}</span>
                      </div>
                      {user.cnic && (
                        <div className={`flex items-center gap-3 p-3 rounded-lg border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                          <Award className={`size-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                          <span className={isDarkMode ? 'text-gray-200' : 'text-[#1F2933]'}>CNIC: {user.cnic}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio Section - Always visible */}
                  <div>
                    <h3 className={`mb-3 ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>About</h3>
                    <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {savedData.bio}
                      </p>
                    </div>
                  </div>

                  {/* Skills (for labour) */}
                  {user.type === 'labour' && user.skills && user.skills.length > 0 && (
                    <div>
                      <h3 className={`mb-3 ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map(skill => (
                          <Badge key={skill} variant="secondary" className={isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-[#1F2933]'}>{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rate (for labour) */}
                  {user.type === 'labour' && user.rate && (
                    <div>
                      <h3 className={`mb-3 ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>Hourly Rate</h3>
                      <div className="p-4 bg-gradient-to-r from-[#2563EB]/20 to-[#1d4ed8]/20 border border-[#2563EB]/30 rounded-lg">
                        <div className="text-[#2563EB]">PKR {user.rate}</div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>per hour</div>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div>
                    <h3 className={`mb-3 ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>Statistics</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className={`p-4 rounded-lg border text-center ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="text-[#2563EB]">
                          {user.type === 'client' ? '5' : user.type === 'manufacturer' ? '12' : '18'}
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {user.type === 'client' ? 'Orders' : user.type === 'manufacturer' ? 'Completed' : 'Jobs Done'}
                        </div>
                      </div>
                      <div className={`p-4 rounded-lg border text-center ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="text-[#2563EB]">{user.rating || 4.7}</div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Rating</div>
                      </div>
                      <div className={`p-4 rounded-lg border text-center ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="text-[#2563EB]">98%</div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Success Rate</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>Your Documents</h3>
                <Button onClick={() => handleFileUpload('new-document')} className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white">
                  <Upload className="size-4 mr-2" />
                  Upload New
                </Button>
              </div>
              
              {/* Upload status messages */}
              {Object.keys(uploadedFiles).length > 0 && (
                <div className="p-3 bg-green-600/10 border border-green-600/30 rounded-lg">
                  <p className="text-green-400 text-sm">Recently uploaded files:</p>
                  <ul className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {Object.entries(uploadedFiles).map(([type, filename]) => (
                      <li key={type}>• {filename} ({type})</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {mockDocuments
                .filter(doc => !(user.type === 'manufacturer' && doc.name === 'Affidavit'))
                .map(doc => (
                <div key={doc.id} className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${isDarkMode ? 'bg-gray-900 border-gray-800 hover:border-gray-700' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                    <FileText className="size-8 text-[#2563EB]" />
                    <div>
                      <div className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>{doc.name}</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Uploaded: {doc.uploadedDate}</div>
                    </div>
                  </div>
                  <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                    <CheckCircle className="size-3 mr-1" />
                    {doc.status}
                  </Badge>
                </div>
              ))}
              {user.type === 'manufacturer' && (
                <div className="p-4 bg-[#2563EB]/10 border border-[#2563EB]/30 rounded-lg">
                  <h4 className="text-[#2563EB] mb-2">Required Documents</h4>
                  <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li>• CNIC Copy (Front & Back)</li>
                    <li>• Business License/Registration</li>
                    <li>• Affidavit (including PPC law compliance)</li>
                    <li>• Factory/Workshop Photos</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Earnings</div>
                  <div className="text-[#2563EB]">PKR 58,000</div>
                </div>
                <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>This Month</div>
                  <div className="text-[#2563EB]">PKR 25,000</div>
                </div>
              </div>
              <h3 className={`mb-3 ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>Payment History</h3>
              {mockPaymentHistory.map(payment => (
                <div key={payment.id} className={`flex items-center justify-between p-4 rounded-lg border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                  <div>
                    <div className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>{payment.description}</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{payment.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#2563EB]">PKR {payment.amount.toLocaleString()}</div>
                    <Badge className="bg-green-600/20 text-green-400 border-green-600/30 text-xs">
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className={`flex items-center gap-6 mb-6 p-4 rounded-lg border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <div className="text-center">
                  <div className="text-[#2563EB]">{user.rating || 4.7}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className="size-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Overall Rating</div>
                </div>
                <div className="flex-1">
                  <div className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>{user.totalReviews || 23} Total Reviews</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Based on completed work</div>
                </div>
              </div>
              <h3 className={`mb-3 ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>Recent Reviews</h3>
              {mockReviews.map(review => (
                <div key={review.id} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>{review.from}</div>
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{review.comment}</p>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{review.date}</div>
                </div>
              ))}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div>
                <h3 className={`mb-3 ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>Notification Settings</h3>
                <div className="space-y-3">
                  {['Email Notifications', 'SMS Alerts', 'Order Updates', 'Payment Alerts'].map(setting => (
                    <div key={setting} className={`flex items-center justify-between p-3 rounded-lg border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                      <span className={isDarkMode ? 'text-gray-200' : 'text-[#1F2933]'}>{setting}</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className={`mb-3 ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>Privacy Settings</h3>
                <div className="space-y-3">
                  {['Show Profile to Others', 'Allow Direct Messages', 'Public Rating Display'].map(setting => (
                    <div key={setting} className={`flex items-center justify-between p-3 rounded-lg border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                      <span className={isDarkMode ? 'text-gray-200' : 'text-[#1F2933]'}>{setting}</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className={`mb-3 ${isDarkMode ? 'text-white' : 'text-[#1F2933]'}`}>Account Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className={`w-full ${isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-[#1F2933] hover:bg-gray-100'}`}>
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-600/10">
                    Deactivate Account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
/*User profile management modal (view/edit profile, documents, payments, reviews, settings).

Yeh web-based React component hai, lekin same logic app (React Native) me adapt ho sakta hai — so basically dono ke liye usable.





 */