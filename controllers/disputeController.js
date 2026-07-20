const axios = require('axios');
const Dispute = require('../models/Dispute');

// Roman Urdu + English fraud keywords
const FRAUD_KEYWORDS = [
  'dhoka', 'fraud', 'farzi', 'chor', 'scam', 'paise', 'paisy', 'wapis',
  'fake', 'jhoot', 'blackmail', 'threat', 'cheat', 'steal', 'refund',
];

function hasRomanUrduFraud(text) {
  const lower = text.toLowerCase();
  return FRAUD_KEYWORDS.some(word => lower.includes(word));
}

// Call BERT service — URL comes from FLASK_API_URL env var (set in .env.development / .env.production)
async function getBertScore(text) {
  try {
    const bertUrl = process.env.FLASK_API_URL;
    if (!bertUrl) return null; // BERT not configured — fallback to keyword only
    const res = await axios.post(`${bertUrl}/predict-dispute`, { message: text }, { timeout: 5000 });
    // Returns { status: "DISPUTE"/"NORMAL", confidence: "87.5%" }
    const status = res.data?.status;
    const confidence = parseFloat(res.data?.confidence) / 100 || 0;
    // Convert to score: DISPUTE → high score, NORMAL → low score
    return status === 'DISPUTE' ? confidence : 1 - confidence;
  } catch {
    return null; // BERT unavailable - fallback to keyword only
  }
}

exports.createDispute = async (req, res) => {
  try {
    const {
      orderId, title, reason, description,
      evidenceFiles, referenceId,
    } = req.body;

    // Fix 1: raisedBy fallback
    const raisedBy = req.body.raisedBy || req.user?._id || req.user?.id;

    if (!orderId) return res.status(400).json({ success: false, message: 'orderId is required' });

    // Fix 2: combine reason + description for BERT
    const disputeText = `${reason || ''} ${description || ''}`.trim();

    // Fix 6: duplicate check - if open dispute exists, update it
    const existingDispute = await Dispute.findOne({
      orderId,
      status: { $in: ['open', 'pending', 'escalated'] },
    });

    if (existingDispute) {
      existingDispute.messages.push({ text: disputeText, sender: raisedBy });
      existingDispute.updatedAt = new Date();
      await existingDispute.save();
      return res.status(200).json({
        success: true,
        autoResolved: existingDispute.autoResolved,
        status: existingDispute.status,
        message: 'Dispute updated with new message',
        dispute: existingDispute,
      });
    }

    // Fix 4: Roman Urdu keyword check
    const fraudFlagged = hasRomanUrduFraud(disputeText);

    // Fix 2 + 3: BERT score on full text
    const bertScore = await getBertScore(disputeText);

    // Fix 3: auto-resolve logic
    // escalate if: BERT high risk OR fraud keywords found OR BERT unavailable (play safe)
    let autoResolved = false;
    let status = 'escalated';

    if (!fraudFlagged && bertScore !== null && bertScore < 0.4) {
      autoResolved = true;
      status = 'resolved';
    }

    const dispute = new Dispute({
      orderId, title, reason, description,
      raisedBy, referenceId, evidenceFiles,
      status,
      bertScore,
      autoResolved,
      messages: [{ text: disputeText, sender: raisedBy }],
    });

    await dispute.save();

    // Fix 7: response shape frontend expects
    res.status(201).json({
      success: true,
      autoResolved,
      status,
      message: autoResolved ? 'Dispute auto resolved by AI' : 'Dispute escalated to admin',
      referenceId: dispute.referenceId,
      dispute,
    });
  } catch (err) {
    console.error('createDispute error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find().sort({ createdAt: -1 });
    res.json({ success: true, disputes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateDisputeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const dispute = await Dispute.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!dispute) return res.status(404).json({ success: false, message: 'Dispute not found' });
    res.json({ success: true, dispute });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
