const mongoose = require('mongoose');

const teamGuideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    note: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ''
    },
    thumbData: {
      type: String,
      required: true,
      trim: true,
      maxlength: 130000
    },
    imageData: {
      type: String,
      required: true,
      trim: true,
      maxlength: 760000
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  { timestamps: true }
);

teamGuideSchema.index({ updatedAt: -1, createdAt: -1 });

teamGuideSchema.methods.toClient = function toClient(options = {}) {
  const includeImage = Boolean(options.includeImage);
  return {
    id: this._id.toString(),
    title: this.title,
    note: this.note || '',
    thumbData: this.thumbData || '',
    imageData: includeImage ? (this.imageData || '') : '',
    createdBy: this.createdBy && typeof this.createdBy === 'object'
      ? {
          id: this.createdBy._id?.toString?.() || this.createdBy.toString?.() || '',
          username: this.createdBy.username || '',
          displayName: this.createdBy.displayName || '',
          gameName: this.createdBy.gameName || '',
          avatarData: this.createdBy.avatarData || '',
          role: this.createdBy.role || ''
        }
      : null,
    updatedAt: this.updatedAt,
    createdAt: this.createdAt
  };
};

module.exports = {
  TeamGuide: mongoose.model('TeamGuide', teamGuideSchema)
};
