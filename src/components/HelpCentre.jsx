import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea input';
import { 
  X, HelpCircle, Mail, Send, CheckCircle, 
  Briefcase, Factory, HardHat, ChevronRight 
} from 'lucide-react';

export function EnhancedHelpOverlay({ onClose }) {
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailForm, setEmailForm] = useState({ email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const helpContent = {
    client: {
      title: 'Client Help',
      icon: Briefcase,
      color: 'purple',
      topics: [
        {
          id: 'how-to-post-order',
          title: 'How to Post an Order',
          content: `Navigate to your dashboard and click "Post Order". Fill in product details, quantity, budget, and delivery date. Upload reference images if needed. Submit and wait for manufacturer bids.`
        },
        {
          id: 'select-manufacturer',
          title: 'How to Select a Manufacturer',
          content: `Review bids on your order. Check manufacturer's trust score, reviews, and response time. Compare pricing and portfolios. Select the best fit and confirm to proceed.`
        },
        {
          id: 'payment-process',
          title: 'Payment & Escrow',
          content: `Pay 100% amount to Skillora's secure escrow. 30% releases to manufacturer to start work. After completion and your approval, remaining 70% is released.`
        },
        {
          id: 'track-order',
          title: 'Track Your Order',
          content: `Monitor order status: Pending → Accepted → In Progress → Completed. Use chat feature to communicate with manufacturer. Get real-time updates.`
        },
        {
          id: 'dispute-resolution',
          title: 'Dispute Resolution',
          content: `If issues arise, contact Skillora support immediately. Our team mediates and ensures fair resolution. Your funds remain protected in escrow.`
        },
        {
          id: 'review-manufacturer',
          title: 'Leave Reviews',
          content: `After order completion, rate your experience. Reviews help other clients and maintain quality standards on the platform.`
        },
      ]
    },
    manufacturer: {
      title: 'Manufacturer Help',
      icon: Factory,
      color: 'teal',
      topics: [
        {
          id: 'bid-on-orders',
          title: 'How to Bid on Orders',
          content: `Browse available orders. Click "View Details" to see requirements. Calculate costs and timeline. Submit competitive bid with explanation of your expertise.`
        },
        {
          id: 'hire-labour',
          title: 'Hiring Labour',
          content: `Search labour by required skills. Check skill proof videos/photos and ratings. Verify hourly rates. Send hire request with job details and requirements.`
        },
        {
          id: 'manage-orders',
          title: 'Managing Orders',
          content: `Track all orders from your dashboard. Update order status regularly. Upload progress photos. Communicate with clients through chat feature.`
        },
        {
          id: 'receive-payment',
          title: 'Receiving Payments',
          content: `Get 30% upfront when starting work. Complete order as per specifications. Upload completion proof. After client approval, receive remaining 70% within 24 hours.`
        },
        {
          id: 'ppc-compliance',
          title: 'PPC Law Compliance',
          content: `Comply with Pakistan Penal Code: labor laws, worker safety, fair wages, business registration, tax compliance, and quality standards. Non-compliance may result in suspension.`
        },
        {
          id: 'verification-docs',
          title: 'Verification Documents',
          content: `Submit legal business documents, tax registration, affidavit, and PPC compliance proof. All documents reviewed by Skillora team for verification.`
        },
      ]
    },
    labour: {
      title: 'Labour Help',
      icon: HardHat,
      color: 'green',
      topics: [
        {
          id: 'skill-verification',
          title: 'Skill Verification Process',
          content: `Upload clear photos and videos of your work. Show before/after examples. Include close-ups of detailed work. Add 3-5 different examples per skill.`
        },
        {
          id: 'accept-offers',
          title: 'Accepting Job Offers',
          content: `Review job details and requirements. Check manufacturer's profile and rating. Verify payment terms. Confirm work location and timing. Accept or decline accordingly.`
        },
        {
          id: 'set-availability',
          title: 'Setting Availability',
          content: `Update your status regularly: Available, Busy, or Away. This helps manufacturers know when you can take on new work. Keep your profile active.`
        },
        {
          id: 'payment-labour',
          title: 'Getting Paid',
          content: `Manufacturer pays directly (not through escrow). Payment terms agreed before work starts. Track hours for hourly jobs. Submit timesheets. Payments processed in 3-5 business days.`
        },
        {
          id: 'build-profile',
          title: 'Building Your Profile',
          content: `Add all skills you're proficient in. Set competitive hourly rates. Upload high-quality proof media. Keep availability updated. Respond quickly to offers. Build positive reviews.`
        },
        {
          id: 'safety-rights',
          title: 'Safety & Rights',
          content: `Know your rights as a worker. Report unsafe conditions immediately. Fair wage payment is mandatory. Contact Skillora support for any workplace issues.`
        },
      ]
    }
  };

  const handleSendEmail = () => {
    if (!emailForm.email || !emailForm.subject || !emailForm.message) {
      alert('Please fill all fields');
      return;
    }
    
    console.log('Email sent:', emailForm);
    setSubmitted(true);
    
    setTimeout(() => {
      setSubmitted(false);
      setShowEmailForm(false);
      setEmailForm({ email: '', subject: '', message: '' });
    }, 3000);
  };

  const getColorClasses = (color) => {
    if (color === 'purple') return {
      bg: 'bg-purple-500',
      bgLight: 'bg-purple-500/10',
      border: 'border-purple-500',
      text: 'text-purple-500',
      hover: 'hover:bg-purple-500/20'
    };
    if (color === 'teal') return {
      bg: 'bg-teal-700',
      bgLight: 'bg-teal-700/10',
      border: 'border-teal-500',
      text: 'text-teal-500',
      hover: 'hover:bg-teal-700/20'
    };
    return {
      bg: 'bg-[#2563EB]',
      bgLight: 'bg-[#2563EB]/10',
      border: 'border-[#2563EB]',
      text: 'text-[#2563EB]',
      hover: 'hover:bg-[#2563EB]/20'
    };
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="max-w-6xl w-full my-8 bg-gray-900 border-gray-800">
        {/* Header */}
        <div className="border-b border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HelpCircle className="size-8 text-teal-500" />
              <div>
                <h2 className="text-2xl text-white font-semibold">Help Center</h2>
                <p className="text-gray-400 text-sm">Select your role to get started</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="size-5" />
            </Button>
          </div>
        </div>

        <CardContent className="p-6">
          {!selectedSection ? (
            /* Role Selection */
            <div className="space-y-4">
              <h3 className="text-lg text-white font-semibold mb-4">Choose Your Role</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(helpContent).map(([key, section]) => {
                  const Icon = section.icon;
                  const colors = getColorClasses(section.color);
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedSection(key)}
                      className={`${colors.bgLight} border ${colors.border} rounded-lg p-6 ${colors.hover} transition-all group`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className={`size-16 ${colors.bg} rounded-lg flex items-center justify-center mb-4`}>
                          <Icon className="size-8 text-white" />
                        </div>
                        <h3 className="text-white text-lg font-semibold mb-2">{section.title}</h3>
                        <p className="text-gray-400 text-sm mb-3">
                          {section.topics.length} help topics
                        </p>
                        <ChevronRight className="size-5 text-[#2563EB] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Topics & Content */
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = helpContent[selectedSection].icon;
                    const colors = getColorClasses(helpContent[selectedSection].color);
                    return (
                      <>
                        <div className={`size-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
                          <Icon className="size-6 text-white" />
                        </div>
                        <h3 className="text-xl text-white font-semibold">
                          {helpContent[selectedSection].title}
                        </h3>
                      </>
                    );
                  })()}
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedSection(null);
                    setSelectedTopic(null);
                  }}
                  className="border-gray-700 text-gray-300"
                >
                  Back to Roles
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Topics List */}
                <div className="space-y-2">
                  {helpContent[selectedSection].topics.map((topic) => {
                    const colors = getColorClasses(helpContent[selectedSection].color);
                    return (
                      <button
                        key={topic.id}
                        onClick={() => setSelectedTopic(topic.id)}
                        className={`w-full p-4 rounded-lg border text-left transition-all ${
                          selectedTopic === topic.id
                            ? `${colors.bgLight} ${colors.border}`
                            : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">{topic.title}</span>
                          <ChevronRight className={`size-4 ${selectedTopic === topic.id ? 'text-[#2563EB]' : 'text-[#2563EB]/50'}`} />
                        </div>
                      </button>
                    );
                  })}

                  {/* Email Button */}
                  <button
                    onClick={() => setShowEmailForm(true)}
                    className="w-full p-4 rounded-lg border bg-blue-600/10 border-blue-600 hover:bg-blue-600/20 transition-all"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="size-5 text-blue-500" />
                      <span className="text-white font-medium">Email Support</span>
                    </div>
                  </button>
                </div>

                {/* Content Display */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 min-h-[500px]">
                  {showEmailForm ? (
                    /* Email Form */
                    !submitted ? (
                      <div className="space-y-4">
                        <h4 className="text-lg text-white font-semibold mb-4">Contact Support</h4>
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">Your Email</label>
                          <Input
                            type="email"
                            placeholder="your.email@example.com"
                            value={emailForm.email}
                            onChange={(e) => setEmailForm({...emailForm, email: e.target.value})}
                            className="bg-gray-900 border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">Subject</label>
                          <Input
                            placeholder="What do you need help with?"
                            value={emailForm.subject}
                            onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                            className="bg-gray-900 border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">Message</label>
                          <Textarea
                            placeholder="Describe your issue in detail..."
                            rows={8}
                            value={emailForm.message}
                            onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
                            className="bg-gray-900 border-gray-700 text-white"
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={handleSendEmail}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                          >
                            <Send className="size-4 mr-2" />
                            Send Message
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowEmailForm(false)}
                            className="border-gray-700 text-gray-300"
                          >
                            Cancel
                          </Button>
                        </div>
                        <p className="text-center text-sm text-gray-400 flex items-center justify-center gap-2">
                          <Mail className="size-4" />
                          support@skillora.com
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <CheckCircle className="size-16 text-[#2563EB] mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                          <p className="text-gray-400">
                            Our support team will get back to you within 24 hours.
                          </p>
                        </div>
                      </div>
                    )
                  ) : selectedTopic ? (
                    /* Topic Content */
                    <div>
                      <h4 className="text-lg text-white font-semibold mb-4">
                        {helpContent[selectedSection].topics.find(t => t.id === selectedTopic)?.title}
                      </h4>
                      <div className="text-gray-300 leading-relaxed">
                        {helpContent[selectedSection].topics.find(t => t.id === selectedTopic)?.content}
                      </div>
                    </div>
                  ) : (
                    /* Placeholder */
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Select a topic to view help content
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
/*Help center overlay UI jahan user apni role (client, manufacturer, labour) select karke guidance aur support topics dekh sakta hai aur email support contact kar sakta hai.
Yeh web-based application ke liye bana hai (React frontend), mobile app ke liye direct nahi hai.*/