const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const USER_ROLES = ['user', 'cameo', 'mod', 'admin'];

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 32,
      match: /^[a-z0-9_.-]+$/
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: 60,
      default: ''
    },
    gameName: {
      type: String,
      trim: true,
      maxlength: 80,
      default: ''
    },
    avatarData: {
      type: String,
      trim: true,
      maxlength: 60000,
      default: ''
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: 'user',
      index: true
    }
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.hashPassword = function hashPassword(password) {
  return bcrypt.hash(password, 12);
};

userSchema.methods.safeJSON = function safeJSON() {
  return {
    id: this._id.toString(),
    username: this.username,
    displayName: this.displayName,
    gameName: this.gameName,
    avatarData: this.avatarData,
    role: this.role,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

userSchema.methods.publicModJSON = function publicModJSON(buildCount = 0) {
  return {
    id: this._id.toString(),
    username: this.username,
    displayName: this.displayName,
    gameName: this.gameName,
    avatarData: this.avatarData,
    role: this.role,
    buildCount
  };
};

module.exports = {
  User: mongoose.model('User', userSchema),
  USER_ROLES
};
