const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { baseRoleForUser } = require('../utils/roles');

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
      maxlength: 360000,
      default: ''
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 32,
      default: 'user',
      index: true
    },
    roleBase: {
      type: String,
      enum: USER_ROLES,
      default: 'user',
      index: true
    },
    registrationIp: {
      type: String,
      trim: true,
      maxlength: 80,
      default: '',
      index: true
    },
    createdVia: {
      type: String,
      enum: ['self-register', 'admin', 'backup', 'seed'],
      default: 'admin',
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
    roleBase: baseRoleForUser(this),
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
    roleBase: baseRoleForUser(this),
    buildCount
  };
};

module.exports = {
  User: mongoose.model('User', userSchema),
  USER_ROLES
};
