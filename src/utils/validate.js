const { STAT_KEYS, MAX_TOTAL_STATS, statTotal } = require('../models/Beast');

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 32;
const MAX_AVATAR_BYTES = 40 * 1024;
const MAX_AVATAR_DATA_URL_LENGTH = 60000;

function cleanText(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function normalizeStats(stats = {}) {
  const output = {};
  for (const key of STAT_KEYS) {
    const value = Number(stats[key] ?? 0);
    if (!Number.isInteger(value) || value < 0 || value > MAX_TOTAL_STATS) {
      throw new Error(`${key.toUpperCase()} phải là số nguyên từ 0 đến ${MAX_TOTAL_STATS}.`);
    }
    output[key] = value;
  }
  const total = statTotal(output);
  if (total !== MAX_TOTAL_STATS) {
    throw new Error(`Tổng Berry / chỉ số phải đúng ${MAX_TOTAL_STATS}. Hiện tại là ${total}.`);
  }
  return output;
}

function normalizeSkills(skills = []) {
  if (!Array.isArray(skills)) return [];
  const cleaned = skills
    .map(skill => ({
      name: cleanText(typeof skill === 'string' ? skill : skill?.name)
    }))
    .filter(skill => skill.name);

  if (cleaned.length < 1) {
    throw new Error('Cần nhập ít nhất 1 kỹ năng (Skill).');
  }
  if (cleaned.length > 6) {
    throw new Error('Mỗi build chỉ có tối đa 6 kỹ năng (Skills).');
  }
  return cleaned;
}

function normalizeBeastPayload(body = {}) {
  const name = cleanText(body.name);
  if (!name) throw new Error('Tên linh thú không được để trống.');
  if (name.length > 120) throw new Error('Tên linh thú quá dài.');

  return {
    name,
    role: cleanText(body.role, 'Khác') || 'Khác',
    element: cleanText(body.element),
    nature: cleanText(body.nature),
    passive: cleanText(body.passive),
    skills: normalizeSkills(body.skills),
    stats: normalizeStats(body.stats),
    notes: cleanText(body.notes)
  };
}

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Mật khẩu cần ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`);
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    throw new Error(`Mật khẩu tối đa ${MAX_PASSWORD_LENGTH} ký tự.`);
  }
}

function validateAvatarData(avatarData) {
  const value = cleanText(avatarData);
  if (!value) return '';

  if (value.length > MAX_AVATAR_DATA_URL_LENGTH) {
    throw new Error('Avatar quá lớn. Hãy dùng ảnh nhỏ hơn.');
  }

  const match = value.match(/^data:image\/(png|jpe?g|webp);base64,([A-Za-z0-9+/=]+)$/i);
  if (!match) {
    throw new Error('Avatar chỉ nhận ảnh PNG, JPG hoặc WebP.');
  }

  const byteLength = Buffer.byteLength(match[2], 'base64');
  if (byteLength > MAX_AVATAR_BYTES) {
    throw new Error('Avatar sau khi nén phải nhỏ hơn 40KB.');
  }

  return value;
}

function validateUsername(username) {
  const value = cleanText(username).toLowerCase();
  if (!/^[a-z0-9_.-]{3,32}$/.test(value)) {
    throw new Error('Tên đăng nhập dài 3–32 ký tự, chỉ dùng chữ thường, số, dấu gạch ngang, gạch dưới hoặc dấu chấm.');
  }
  return value;
}

module.exports = {
  cleanText,
  normalizeBeastPayload,
  validatePassword,
  validateUsername,
  validateAvatarData,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  MAX_AVATAR_BYTES
};
