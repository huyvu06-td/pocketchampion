const mongoose = require('mongoose');

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
    donate: { type: donateSchema, default: () => ({}) }
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
  const isAdmin = viewer?.role === 'admin';
  const donate = this.donate || {};
  return {
    donate: {
      enabled: Boolean(donate.enabled),
      visible: Boolean(donate.enabled) || isAdmin,
      imageData: donate.imageData || '',
      accountNumber: donate.accountNumber || '',
      bankName: donate.bankName || '',
      updatedAt: this.updatedAt
    }
  };
};

module.exports = {
  SiteSetting: mongoose.model('SiteSetting', siteSettingSchema)
};
