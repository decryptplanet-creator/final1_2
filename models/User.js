const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:               { type: String, default: '' },
  email:              { type: String, required: true, unique: true, lowercase: true },
  password:           { type: String, required: true },
  role:               { type: String, required: true, lowercase: true },
  cnic:               { type: String, default: '' },
  dob:                { type: String, default: '' },
  city:               { type: String, default: '' },
  affidavit:          { type: String, default: '' },  // base64 or url
  labourVideo:        { type: String, default: '' },  // base64 or url
  status:             { type: String, enum: ['active','blocked','suspended','pending'], default: 'active' },
  verificationStatus: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  rejectionReason:    { type: String, default: '' },
  verified:           { type: Boolean, default: true },
  trustScore:         { type: Number, default: 50 },
  latitude:           { type: Number, default: null },
  longitude:          { type: Number, default: null },
  capturedAddress:    { type: String, default: '' },
  locationVerified:   { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
