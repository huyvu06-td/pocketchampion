const mongoose = require('mongoose');

function normalizeCreatureName(name = '') {
  return String(name || '').trim().replace(/\s+/g, ' ');
}

function creatureKey(name = '') {
  return normalizeCreatureName(name).toLocaleLowerCase('vi-VN');
}

const creatureSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120, index: true },
    key: { type: String, required: true, unique: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

creatureSchema.methods.toClient = function toClient(buildCount = 0) {
  return {
    id: this._id.toString(),
    name: this.name,
    buildCount,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = {
  Creature: mongoose.model('Creature', creatureSchema),
  normalizeCreatureName,
  creatureKey
};
