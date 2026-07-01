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
    generation: { type: Number, min: 1, max: 9, default: null, index: true },
    source: { type: String, trim: true, maxlength: 80, default: 'custom', index: true },
    suggestedSkills: { type: [{ type: String, trim: true, maxlength: 120 }], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

creatureSchema.methods.toClient = function toClient(buildCount = 0, options = {}) {
  const includeSkills = Boolean(options.includeSkills);
  const suggestedSkills = Array.isArray(this.suggestedSkills) ? this.suggestedSkills : [];
  const output = {
    id: this._id.toString(),
    name: this.name,
    generation: this.generation || null,
    source: this.source || 'custom',
    suggestedSkillCount: suggestedSkills.length,
    buildCount,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
  if (includeSkills) output.suggestedSkills = suggestedSkills;
  return output;
};

module.exports = {
  Creature: mongoose.model('Creature', creatureSchema),
  normalizeCreatureName,
  creatureKey
};
