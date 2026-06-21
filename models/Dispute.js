const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  title: String,
  reason: String,
  description: String,
  raisedBy: String,
  referenceId: String,
  evidenceFiles: [String],
  status: { type: String, enum: ['open', 'resolved', 'escalated', 'pending'], default: 'open' },
  bertScore: Number,
  autoResolved: { type: Boolean, default: false },
  messages: [{ text: String, sender: String, createdAt: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Dispute', disputeSchema);
