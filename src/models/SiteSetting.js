const mongoose = require('mongoose');
const { mergeRoleSettings, baseRoleForUser } = require('../utils/roles');


const roleSettingSchema = new mongoose.Schema(
  {
    key: { type: String, trim: true, lowercase: true, maxlength: 32, required: true },
    name: { type: String, trim: true, maxlength: 48, required: true },
    color: { type: String, trim: true, maxlength: 7, default: '#a7b4d6' },
    logo: { type: String, trim: true, maxlength: 12, default: '🏷️' },
    baseRole: { type: String, enum: ['user', 'cameo', 'mod', 'admin'], default: 'user' },
    locked: { type: Boolean, default: false }
  },
  { _id: false }
);

const donateSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: false },
    imageData: { type: String, trim: true, maxlength: 260000, default: '' },
    accountNumber: { type: String, trim: true, maxlength: 80, default: '' },
    bankName: { type: String, trim: true, maxlength: 120, default: '' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { _id: false }
);

const siteSettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'main' },
    donate: { type: donateSchema, default: () => ({}) },
    roles: { type: [roleSettingSchema], default: () => [] }
  },
  { timestamps: true }
);

siteSettingSchema.statics.getMain = async function getMain() {
  let setting = await this.findOne({ key: 'main' });
  if (!setting) {
    setting = await this.create({ key: 'main' });
  }
  return setting;
};

siteSettingSchema.methods.publicJSON = function publicJSON(viewer = null) {
  const isAdmin = baseRoleForUser(viewer) === 'admin';
  const donate = this.donate || {};
  return {
    donate: {
      enabled: Boolean(donate.enabled),
      visible: Boolean(donate.enabled) || isAdmin,
      imageData: donate.imageData || '',
      accountNumber: donate.accountNumber || '',
      bankName: donate.bankName || '',
      updatedAt: this.updatedAt
    },
    roles: mergeRoleSettings(this.roles || [])
  };
};

module.exports = {
  SiteSetting: mongoose.model('SiteSetting', siteSettingSchema)
};
