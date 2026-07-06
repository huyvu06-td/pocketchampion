const mongoose = require('mongoose');

const modApplicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    message: { type: String, trim: true, maxlength: 1000, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
    reviewNote: { type: String, trim: true, maxlength: 1000, default: '' }
  },
  { timestamps: true }
);

modApplicationSchema.index({ user: 1, status: 1 });

module.exports = {
  ModApplication: mongoose.model('ModApplication', modApplicationSchema)
};
