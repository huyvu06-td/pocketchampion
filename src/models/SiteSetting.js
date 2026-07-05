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

const donateHonorItemSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 80, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const donateHonorSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: false },
    names: { type: [donateHonorItemSchema], default: () => [] },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { _id: false }
);

const registrationSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    ipLimit: { type: Number, min: 1, max: 20, default: 3 },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { _id: false }
);

const siteSettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'main' },
    donate: { type: donateSchema, default: () => ({}) },
    donateHonor: { type: donateHonorSchema, default: () => ({}) },
    registration: { type: registrationSchema, default: () => ({}) },
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
  const donateHonor = this.donateHonor || {};
  const registration = this.registration || {};
  return {
    donate: {
      enabled: Boolean(donate.enabled),
      visible: Boolean(donate.enabled) || isAdmin,
      imageData: donate.imageData || '',
      accountNumber: donate.accountNumber || '',
      bankName: donate.bankName || '',
      updatedAt: this.updatedAt
    },
    donateHonor: {
      enabled: Boolean(donateHonor.enabled),
      visible: Boolean(donateHonor.enabled) || isAdmin,
      names: Array.isArray(donateHonor.names)
        ? donateHonor.names.map(item => ({
            id: item._id?.toString?.() || '',
            name: item.name || '',
            createdAt: item.createdAt || null
          })).filter(item => item.name)
        : [],
      updatedAt: this.updatedAt
    },
    registration: {
      enabled: registration.enabled !== false,
      ipLimit: Math.min(Math.max(Number(registration.ipLimit || 3), 1), 20)
    },
    roles: mergeRoleSettings(this.roles || [])
  };
};

module.exports = {
  SiteSetting: mongoose.model('SiteSetting', siteSettingSchema)
};
