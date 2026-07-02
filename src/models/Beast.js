const mongoose = require('mongoose');
const { baseRoleForUser } = require('../utils/roles');

const STAT_KEYS = ['hp', 'atk', 'satk', 'def', 'sdef', 'spe'];
const MAX_TOTAL_STATS = 510;

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 120, default: '' }
  },
  { _id: false }
);

const statsSchema = new mongoose.Schema(
  {
    hp: { type: Number, min: 0, max: 510, default: 0 },
    atk: { type: Number, min: 0, max: 510, default: 0 },
    satk: { type: Number, min: 0, max: 510, default: 0 },
    def: { type: Number, min: 0, max: 510, default: 0 },
    sdef: { type: Number, min: 0, max: 510, default: 0 },
    spe: { type: Number, min: 0, max: 510, default: 0 }
  },
  { _id: false }
);

const beastSchema = new mongoose.Schema(
  {
    creature: { type: mongoose.Schema.Types.ObjectId, ref: 'Creature', index: true },
    name: { type: String, required: true, trim: true, maxlength: 120, index: true },
    role: { type: String, trim: true, maxlength: 80, default: 'Khác', index: true },
    nature: { type: String, trim: true, maxlength: 120, default: '' },
    item: { type: String, trim: true, maxlength: 120, default: '' },
    passive: { type: String, trim: true, maxlength: 4000, default: '' },
    skills: { type: [skillSchema], default: [] },
    stats: { type: statsSchema, default: () => ({}) },
    notes: { type: String, trim: true, maxlength: 6000, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// Cho phép nhiều mod cùng build một linh thú, nhưng mỗi mod chỉ có 1 build cho cùng tên linh thú.
beastSchema.index(
  { creature: 1, createdBy: 1 },
  { unique: true, name: 'unique_build_per_creature_builder', partialFilterExpression: { creature: { $exists: true }, createdBy: { $exists: true } } }
);

beastSchema.virtual('statTotal').get(function statTotal() {
  return STAT_KEYS.reduce((sum, key) => sum + Number(this.stats?.[key] || 0), 0);
});

function summarizeUser(user) {
  if (!user) return null;
  if (typeof user === 'string') return { id: user, label: 'Không rõ' };
  if (!user.username && !user.displayName && !user.gameName && typeof user.toString === 'function') {
    return { id: user.toString(), label: 'Không rõ' };
  }

  const id = user._id ? user._id.toString() : String(user.id || '');
  const username = user.username || '';
  const displayName = user.displayName || '';
  const gameName = user.gameName || '';
  const avatarData = user.avatarData || '';

  return {
    id,
    username,
    displayName,
    gameName,
    avatarData,
    role: user.role || '',
    roleBase: baseRoleForUser(user),
    label: gameName || displayName || username || 'Không rõ'
  };
}

function canViewerEdit(viewer, beast) {
  if (!viewer) return false;
  const baseRole = baseRoleForUser(viewer);
  if (baseRole === 'admin') return true;
  if (!['cameo', 'mod'].includes(baseRole)) return false;

  const ownerId = beast.createdBy?._id ? beast.createdBy._id.toString() : beast.createdBy?.toString();
  return Boolean(ownerId && ownerId === viewer._id.toString());
}

beastSchema.methods.toClient = function toClient(options = {}) {
  const viewer = options.viewer || null;
  return {
    id: this._id.toString(),
    creature: this.creature ? { id: this.creature._id ? this.creature._id.toString() : this.creature.toString(), name: this.creature.name || this.name } : null,
    name: this.creature?.name || this.name,
    role: this.role,
    nature: this.nature,
    item: this.item || '',
    passive: this.passive,
    skills: this.skills || [],
    stats: this.stats || {},
    statTotal: this.statTotal,
    notes: this.notes,
    createdBy: summarizeUser(this.createdBy),
    updatedBy: summarizeUser(this.updatedBy),
    canEdit: canViewerEdit(viewer, this),
    canDelete: Boolean(viewer && baseRoleForUser(viewer) === 'admin'),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

function statTotal(stats = {}) {
  return STAT_KEYS.reduce((sum, key) => sum + Number(stats[key] || 0), 0);
}

module.exports = {
  Beast: mongoose.model('Beast', beastSchema),
  STAT_KEYS,
  MAX_TOTAL_STATS,
  statTotal,
  canViewerEdit
};
