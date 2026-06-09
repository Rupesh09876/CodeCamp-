const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  plan: { type: String, enum: ['free', 'pro'], default: 'free' },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
  subscription: {
    status: { type: String, enum: ['active', 'expired', 'cancelled'] },
    startDate: Date,
    endDate: Date,
    khaltiPaymentId: String
  },
  aiQueriesUsedToday: { type: Number, default: 0 },
  lastQueryReset: { type: Date, default: Date.now },
  lastActivityDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
