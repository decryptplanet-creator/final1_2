import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/labelstatus';
import { Progress } from './ui/Progressbar';
import { 
  X, 
  Package, 
  Clock, 
  Wallet, 
  Star, 
  MessageSquare, 
  Edit,
  CheckCircle,
  Factory,
  AlertTriangle,
  CreditCard,
  FileText,
  Upload,
  Truck,
  ReceiptText,
  ShieldCheck
} from 'lucide-react';
import { ManufacturerListModal } from './ManufacturerListModal';
import ChatModule from './ChatModule';
import { ReviewSubmissionModal } from './ReviewSubmissionModal';
import { AIAnalysisModal } from './AIAnalysisModal';
import { ReviewWarningModal } from './ReviewWarningModal';
import { ProfileViewWithReview } from './ProfileReview';
import { DisputeModal } from './DisputeManagementModal';

export function OrderDetailsModal({ order, userType, onClose, onUpdate, onAccept }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuantity, setEditedQuantity] = useState(order.quantity.toString());
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [showManufacturerList, setShowManufacturerList] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showDeliveryDecision, setShowDeliveryDecision] = useState(false);
  
  // Review System States
  const [showReviewSubmission, setShowReviewSubmission] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [showReviewWarning, setShowReviewWarning] = useState(false);
  const [showProfileView, setShowProfileView] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [aiAnalysisResult, setAIAnalysisResult] = useState(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [deliveryProofs, setDeliveryProofs] = useState(order.deliveryProofs || []);
  const [agreementAccepted, setAgreementAccepted] = useState(
    order.agreementAccepted ?? order.status !== 'pending'
  );

  const escrowTotal = order.escrowStatus?.total || order.budget || 0;
  const escrowDeposited = order.escrowStatus?.deposited || 0;
  const escrowReleased = order.escrowStatus?.released || 0;
  const advanceRelease = Math.round(escrowTotal * 0.3);
  const finalRelease = escrowTotal - advanceRelease;
  const escrowProgress = escrowTotal > 0 ? (escrowReleased / escrowTotal) * 100 : 0;
  const reviewTargetName = userType === 'client'
    ? order.manufacturer?.name || 'Manufacturer'
    : order.client?.name || order.clientName || 'Client';
  const reviewTargetRole = userType === 'client' ? 'manufacturer' : 'client';
  const agreementId = `AGR-${order.id.toString().padStart(5, '0')}`;
  const displayProofs = order.deliveryProofs || deliveryProofs;
  const paymentHistory = order.paymentHistory?.length
    ? order.paymentHistory
    : [
        ...(escrowDeposited > 0 ? [{
          id: `TXN-${order.id}-DEP`,
          description: 'Payment deposited into escrow',
          amount: escrowDeposited,
          date: order.deadline,
          status: 'completed'
        }] : []),
        ...(escrowReleased > 0 ? [{
          id: `TXN-${order.id}-ADV`,
          description: 'Advance released to manufacturer',
          amount: escrowReleased,
          date: order.deadline,
          status: 'completed'
        }] : [])
      ];

  const addTransaction = (description, amount) => ([
    ...paymentHistory,
    {
      id: `TXN-${order.id}-${Date.now()}`,
      description,
      amount,
      date: new Date().toISOString(),
      status: 'completed'
    }
  ]);

  const handleUpdateQuantity = () => {
    if (onUpdate) {
      onUpdate({ quantity: parseInt(editedQuantity) });
      setIsEditing(false);
    }
  };

  const handleSubmitRating = () => {
    // Handle rating submission
    setShowRating(false);
    onClose();
  };

  const handleMarkAsCompleted = () => {
    if (onUpdate) {
      onUpdate({ status: 'completed' });
    }
    alert('Order marked as completed! Awaiting client confirmation for final payment release.');
  };

  const handleConfirmOrderAndPay = () => {
    if (onUpdate) {
      onUpdate({
        status: 'in-progress',
        agreementAccepted: true,
        escrowStatus: {
          total: escrowTotal,
          deposited: escrowTotal,
          released: advanceRelease
        },
        escrowNotification: 'Client paid full order amount to escrow. 30% advance released to manufacturer.',
        paymentHistory: addTransaction('Full payment deposited; 30% advance released', escrowTotal)
      });
    }
    setAgreementAccepted(true);
    alert(`Order confirmed. Full payment PKR ${escrowTotal.toLocaleString()} is now in escrow and 30% advance has been released to the manufacturer.`);
  };

  const handleDeliveryDecision = (decision) => {
    if (decision === 'success') {
      if (onUpdate) {
        onUpdate({
          status: 'in-progress',
          deliveryStatus: 'successful',
          escrowStatus: {
            total: escrowTotal,
            deposited: escrowTotal,
            released: escrowReleased
          },
          escrowNotification: `Successful delivery confirmed. Release remaining 70% (PKR ${finalRelease.toLocaleString()}) when ready.`
        });
      }
      setShowDeliveryDecision(false);
      alert(`Successful delivery confirmed. Remaining 70% (PKR ${finalRelease.toLocaleString()}) is ready for release.`);
      return;
    }

    if (onUpdate) {
      onUpdate({
        status: 'disputed',
        deliveryStatus: 'failed',
        escrowStatus: {
          total: escrowTotal,
          deposited: escrowDeposited,
          released: escrowReleased
        },
        escrowNotification: 'Failed delivery reported. Escrow notified to hold remaining funds for review.'
      });
    }
    alert('Failed delivery reported. Escrow has been notified to hold the remaining payment for review.');
  };

  const handleReleasePayment = () => {
    if (onUpdate) {
      onUpdate({
        status: 'completed',
        escrowStatus: {
          total: escrowTotal,
          deposited: escrowTotal,
          released: escrowTotal
        },
        escrowNotification: `Final payment of PKR ${finalRelease.toLocaleString()} released to the manufacturer.`,
        paymentHistory: addTransaction('Final payment released to manufacturer', finalRelease)
      });
    }
    alert(`Payment released successfully. PKR ${finalRelease.toLocaleString()} has been sent to the manufacturer.`);
  };

  const handleProofUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const uploaded = files.map((file) => ({
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      type: file.type || 'Document',
      uploadedBy: userType === 'client' ? 'Client' : 'Manufacturer',
      uploadedAt: new Date().toLocaleString()
    }));
    const updatedProofs = [...displayProofs, ...uploaded];
    setDeliveryProofs(updatedProofs);
    if (onUpdate) onUpdate({ deliveryProofs: updatedProofs });
    event.target.value = '';
  };

  const handleAgreementAcceptance = (checked) => {
    setAgreementAccepted(checked);
    if (onUpdate) onUpdate({ agreementAccepted: checked });
  };

  // New: Handle Confirm Delivery - Triggers Review Flow
  const handleConfirmDelivery = () => {
    setShowReviewSubmission(true);
  };

  // Handle Review Submission
  const handleReviewSubmit = (rating, comment) => {
    setReviewData({ rating, comment });
    setShowReviewSubmission(false);
    setShowAIAnalysis(true);
  };

  // Handle AI Analysis Complete
  const handleAIAnalysisComplete = (result) => {
    setAIAnalysisResult(result);
    setShowAIAnalysis(false);

    // Check if review is blocked
    if (result.isAbusive || result.isFake) {
      setShowReviewWarning(true);
    } else {
      // Valid review - show profile with updated trust score
      if (onUpdate) {
        onUpdate({ status: 'completed' });
      }
      setShowProfileView(true);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle>Transaction Details</CardTitle>
                  <Badge variant={
                    order.status === 'completed' ? 'default' : 
                    order.status === 'in-progress' ? 'secondary' : 
                    'outline'
                  }>
                    {order.status}
                  </Badge>
                </div>
                <CardDescription>{order.title} - {order.description}</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="size-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Package className="size-8 text-indigo-600" />
                <div>
                  <div className="text-sm text-gray-500">Quantity</div>
                  {isEditing ? (
                    <div className="flex items-center gap-2 mt-1">
                      <Input 
                        type="number" 
                        value={editedQuantity}
                        onChange={(e) => setEditedQuantity(e.target.value)}
                        className="w-24 h-8"
                      />
                      <Button size="sm" onClick={handleUpdateQuantity}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{order.quantity} units</span>
                      {userType === 'client' && order.status === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit className="size-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Wallet className="size-8 text-green-600" />
                <div>
                  <div className="text-sm text-gray-500">Budget</div>
                  <div className="text-xl">PKR {order.budget.toLocaleString()}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Clock className="size-8 text-[#2563EB]" />
                <div>
                  <div className="text-sm text-gray-500">Deadline</div>
                  <div className="text-xl">{new Date(order.deadline).toLocaleDateString()}</div>
                </div>
              </div>

              {order.manufacturer && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Factory className="size-8 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-500">Manufacturer</div>
                    <div className="flex items-center gap-1">
                      <span className="text-xl">{order.manufacturer.name}</span>
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      <span>{order.manufacturer.rating}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Escrow Status */}
            <div className="border rounded-lg p-4">
              <h4 className="mb-3">Escrow Payment Status</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Payment Progress</span>
                    <span className="text-sm">
                      PKR {order.escrowStatus.released.toLocaleString()} / PKR {order.escrowStatus.total.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={escrowProgress} />
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded">
                    <div className="text-sm text-gray-600">Total Budget</div>
                    <div>PKR {order.escrowStatus.total.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded">
                    <div className="text-sm text-gray-600">In Escrow</div>
                    <div>PKR {order.escrowStatus.deposited.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <div className="text-sm text-gray-600">Released</div>
                    <div>PKR {order.escrowStatus.released.toLocaleString()}</div>
                  </div>
                </div>
                {order.escrowNotification && (
                  <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                    <Wallet className="size-4 mt-0.5 flex-shrink-0" />
                    <span>{order.escrowNotification}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Agreement */}
            <div className="border rounded-lg p-4">
              <h4 className="mb-3 flex items-center gap-2">
                <FileText className="size-5 text-[#2563EB]" />
                Agreement
              </h4>
              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="text-gray-500">Agreement ID</div>
                  <div className="font-mono">{agreementId}</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="text-gray-500">Terms</div>
                  <div>30% advance, 70% after approved delivery</div>
                </div>
              </div>
              <div className="mt-3 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
                <ShieldCheck className="size-5 flex-shrink-0 text-[#2563EB]" />
                <div className="text-sm text-gray-700">
                  Payment remains protected in escrow until delivery is approved and final payment is released.
                </div>
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={agreementAccepted}
                  disabled={userType !== 'client' || order.status !== 'pending'}
                  onChange={(event) => handleAgreementAcceptance(event.target.checked)}
                  className="size-4 accent-[#2563EB]"
                />
                <span>{agreementAccepted ? 'Agreement accepted by client' : 'Client agreement pending'}</span>
              </label>
            </div>

            {/* Delivery Status and Proof Uploads */}
            <div className="border rounded-lg p-4">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="flex items-center gap-2">
                  <Truck className="size-5 text-[#2563EB]" />
                  Delivery Status & Proof Uploads
                </h4>
                <Badge variant="outline">
                  {order.deliveryStatus === 'successful'
                    ? 'Approved'
                    : order.deliveryStatus === 'failed'
                    ? 'Failed / Disputed'
                    : order.status === 'completed'
                    ? 'Completed'
                    : 'Awaiting Delivery'}
                </Badge>
              </div>
              <label className="mb-4 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-700 hover:border-[#2563EB]">
                <Upload className="size-4 text-[#2563EB]" />
                Upload delivery proof
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,application/pdf"
                  className="hidden"
                  onChange={handleProofUpload}
                />
              </label>
              {displayProofs.length > 0 ? (
                <div className="space-y-2">
                  {displayProofs.map((proof) => (
                    <div key={proof.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 text-sm">
                      <div>
                        <div className="font-medium">{proof.name}</div>
                        <div className="text-xs text-gray-500">{proof.uploadedBy} - {proof.uploadedAt}</div>
                      </div>
                      <Badge variant="outline">Uploaded</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No proof files uploaded yet.</p>
              )}
            </div>

            {/* Payment History */}
            <div className="border rounded-lg p-4">
              <h4 className="mb-3 flex items-center gap-2">
                <ReceiptText className="size-5 text-[#2563EB]" />
                Payment History
              </h4>
              {paymentHistory.length > 0 ? (
                <div className="space-y-3">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="flex items-start justify-between rounded-lg bg-gray-50 p-3 text-sm">
                      <div>
                        <div className="font-medium">{payment.description}</div>
                        <div className="font-mono text-xs text-gray-500">{payment.id}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-700">PKR {payment.amount.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{new Date(payment.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No payments recorded for this transaction.</p>
              )}
            </div>

            {/* Rating Section */}
            {showRating && (
              <div className="border rounded-lg p-4">
                <h4 className="mb-3">Rate this {userType === 'client' ? 'Manufacturer' : 'Client'}</h4>
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star 
                        className={`size-8 ${
                          star <= rating 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
                <Button onClick={handleSubmitRating} disabled={rating === 0}>
                  Submit Rating
                </Button>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {userType === 'manufacturer' && order.status === 'pending' && onAccept && (
                <Button onClick={onAccept} className="flex-1">
                  Accept Order
                </Button>
              )}
              
              {userType === 'client' && order.status === 'pending' && (
                <Button variant="outline" className="flex-1" onClick={() => setShowManufacturerList(true)}>
                  <MessageSquare className="size-4 mr-2" />
                  Contact Manufacturers
                </Button>
              )}

              {userType === 'client' && order.status === 'pending' && (
                <Button
                  onClick={handleConfirmOrderAndPay}
                  disabled={!agreementAccepted}
                  className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8]"
                >
                  <CreditCard className="size-4 mr-2" />
                  {agreementAccepted ? 'Confirm Order & Pay' : 'Accept Agreement to Pay'}
                </Button>
              )}

              {order.manufacturer && (
                <Button variant="outline" className="flex-1" onClick={() => setShowChat(true)}>
                  <MessageSquare className="size-4 mr-2" />
                  Chat with {userType === 'client' ? 'Manufacturer' : 'Client'}
                </Button>
              )}

              {/* NEW: Confirm Delivery Button for Client on In-Progress Orders */}
              {userType === 'client' && order.status === 'in-progress' && !order.deliveryStatus && (
                <Button 
                  onClick={() => setShowDeliveryDecision(!showDeliveryDecision)}
                  className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8]"
                >
                  <CheckCircle className="size-4 mr-2" />
                  Delivery Decision
                </Button>
              )}

              {order.status === 'completed' && !showRating && (
                <Button onClick={() => setShowReviewSubmission(true)} className="flex-1">
                  <Star className="size-4 mr-2" />
                  Submit Review
                </Button>
              )}

              {userType === 'manufacturer' && order.status === 'in-progress' && (
                <Button variant="outline" className="flex-1" onClick={handleMarkAsCompleted}>
                  <CheckCircle className="size-4 mr-2" />
                  Mark as Completed
                </Button>
              )}

              {userType === 'client' && order.deliveryStatus === 'successful' && escrowReleased < escrowTotal && (
                <Button
                  onClick={handleReleasePayment}
                  className="flex-1 bg-green-600 text-white hover:bg-green-700"
                >
                  <Wallet className="size-4 mr-2" />
                  Release Payment
                </Button>
              )}

              {(userType === 'client' || userType === 'manufacturer') && order.status === 'in-progress' && (
                <Button
                  variant="outline"
                  className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                  onClick={() => setShowDisputeModal(true)}
                >
                  <AlertTriangle className="size-4 mr-2" />
                  Raise Dispute
                </Button>
              )}
            </div>

            {userType === 'client' && order.status === 'in-progress' && !order.deliveryStatus && showDeliveryDecision && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h4 className="mb-2">Delivery Result</h4>
                <p className="mb-4 text-sm text-gray-600">
                  Successful delivery escrow ko notify karegi aur remaining 70% manufacturer ko release ho jayegi. Failed delivery par payment hold rahegi.
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Button
                    onClick={() => handleDeliveryDecision('success')}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    <CheckCircle className="size-4 mr-2" />
                    Successful Delivery
                  </Button>
                  <Button
                    onClick={() => handleDeliveryDecision('failed')}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <AlertTriangle className="size-4 mr-2" />
                    Failed Delivery
                  </Button>
                </div>
              </div>
            )}

            {/* Info */}
            {order.status === 'pending' && order.escrowStatus.deposited === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  {userType === 'client' 
                    ? 'Confirm Order & Pay se full amount escrow mein deposit ho gi. Manufacturer ko 30% advance release ho ga aur 70% delivery decision tak hold rahe ga.'
                    : 'Waiting for client to deposit funds to escrow before you can start work.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {showManufacturerList && (
        <ManufacturerListModal
          order={order}
          onClose={() => setShowManufacturerList(false)}
        />
      )}
      
      {showChat && (
        <ChatModule
          order={order}
          onClose={() => setShowChat(false)}
        />
      )}

      {/* Review Flow Modals */}
      {showReviewSubmission && (
        <ReviewSubmissionModal
          onClose={() => setShowReviewSubmission(false)}
          onSubmit={handleReviewSubmit}
          targetName={reviewTargetName}
          targetRole={reviewTargetRole}
          orderId={order.id}
        />
      )}

      {showAIAnalysis && reviewData && (
        <AIAnalysisModal
          rating={reviewData.rating}
          comment={reviewData.comment}
          onComplete={handleAIAnalysisComplete}
        />
      )}

      {showReviewWarning && aiAnalysisResult && (
        <ReviewWarningModal
          onClose={() => {
            setShowReviewWarning(false);
            onClose();
          }}
          reason={aiAnalysisResult.isAbusive ? 'abusive' : 'fake'}
          trustScoreImpact={10}
        />
      )}

      {showProfileView && order.manufacturer && reviewData && aiAnalysisResult && (
        <ProfileViewWithReview
          onClose={() => {
            setShowProfileView(false);
            onClose();
          }}
          manufacturer={{
            id: order.manufacturer.id,
            name: order.manufacturer.name,
            rating: order.manufacturer.rating,
            location: 'Sialkot, Punjab',
            trustScore: 90,
            reviews: [
              {
                id: '1',
                clientName: 'Ahmed Khan',
                rating: 5,
                comment: 'Excellent service and quality products. Delivered on time!',
                date: '2 weeks ago'
              },
              {
                id: '2',
                clientName: 'Fatima Ali',
                rating: 4,
                comment: 'Good work but could improve communication.',
                date: '1 month ago'
              }
            ],
            tags: ['Top Rated', 'Fast Delivery', 'Policy Compliant'],
            rank: 1,
            city: 'Sialkot'
          }}
          newReview={{
            rating: reviewData.rating,
            comment: reviewData.comment,
            sentiment: aiAnalysisResult.sentiment
          }}
          previousTrustScore={85}
        />
      )}

      {showDisputeModal && (
        <DisputeModal
          onClose={() => setShowDisputeModal(false)}
          orderId={order.id}
          orderTitle={order.title}
          onSubmitted={(updates) => {
            if (onUpdate) {
              onUpdate(updates);
            }
            setShowDisputeModal(false);
          }}
        />
      )}
    </>
  );
}
/*User ko orders (total / active / completed) list view me dikhata hai aur unki details open karne ka option deta hai.

Yeh web-based React component hai, lekin hybrid apps me bhi use ho sakta hai (dono ke liye). */


