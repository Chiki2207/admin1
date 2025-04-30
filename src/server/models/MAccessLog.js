const mongoose = require('mongoose');

const accessLogSchema = new mongoose.Schema({
  username: { type: String, required: true },
  loginTime: { type: Date, default: Date.now },
  success: { type: Boolean, required: true },
  ipAddress: { type: String },
  token: { type: String }
}, {
  timestamps: true,
  collection: 'access_logs'
});

module.exports = mongoose.model('AccessLog', accessLogSchema);