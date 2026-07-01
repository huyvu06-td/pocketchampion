const BUILTIN_ROLE_KEYS = ['user', 'cameo', 'mod', 'admin'];
const ROLE_BASES = ['user', 'cameo', 'mod', 'admin'];
const ROLE_RANK = { user: 0, cameo: 1, mod: 2, admin: 3 };

const DEFAULT_ROLE_SETTINGS = [
  { key: 'user', name: 'user - chỉ xem', color: '#a7b4d6', logo: '👤', baseRole: 'user', locked: true },
  { key: 'cameo', name: 'Cameo - được build', color: '#f472b6', logo: '🎭', baseRole: 'cameo', locked: true },
  { key: 'mod', name: 'mod - thêm tên + build', color: '#38bdf8', logo: '🛡️', baseRole: 'mod', locked: true },
  { key: 'admin', name: 'admin - toàn quyền', color: '#facc15', logo: '👑', baseRole: 'admin', locked: true }
];

function normalizeRoleKey(value = '') {
  const raw = String(value || '').trim().toLowerCase();
  const slug = raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 32);
  return slug || '';
}

function normalizeRoleBase(value = 'user') {
  return ROLE_BASES.includes(value) ? value : 'user';
}

function sanitizeRoleColor(value = '') {
  const color = String(value || '').trim();
  return /^#[0-9a-f]{6}$/i.test(color) ? color : '#a7b4d6';
}

function cleanRoleLogo(value = '') {
  return String(value || '').trim().slice(0, 12) || '🏷️';
}

function cleanRoleName(value = '', fallback = '') {
  return String(value || fallback || '').trim().slice(0, 48) || fallback || 'Role';
}

function builtinMap() {
  return new Map(DEFAULT_ROLE_SETTINGS.map(role => [role.key, { ...role }]));
}

function mergeRoleSettings(customRoles = []) {
  const map = builtinMap();

  for (const item of Array.isArray(customRoles) ? customRoles : []) {
    const key = normalizeRoleKey(item?.key || item?.name);
    if (!key) continue;
    const isBuiltin = BUILTIN_ROLE_KEYS.includes(key);
    const fallback = map.get(key) || {};
    map.set(key, {
      key,
      name: cleanRoleName(item?.name, fallback.name || key),
      color: sanitizeRoleColor(item?.color || fallback.color),
      logo: cleanRoleLogo(item?.logo || fallback.logo),
      baseRole: normalizeRoleBase(item?.baseRole || fallback.baseRole),
      locked: isBuiltin
    });
  }

  // built-in roles can be restyled, but their permission base and locked status are protected.
  for (const builtin of DEFAULT_ROLE_SETTINGS) {
    const current = map.get(builtin.key) || builtin;
    map.set(builtin.key, {
      ...current,
      key: builtin.key,
      baseRole: builtin.baseRole,
      locked: true
    });
  }

  return Array.from(map.values()).sort((a, b) => {
    const aBuilt = BUILTIN_ROLE_KEYS.indexOf(a.key);
    const bBuilt = BUILTIN_ROLE_KEYS.indexOf(b.key);
    if (aBuilt !== -1 || bBuilt !== -1) {
      if (aBuilt === -1) return 1;
      if (bBuilt === -1) return -1;
      return aBuilt - bBuilt;
    }
    return a.name.localeCompare(b.name, 'vi');
  });
}

function roleMapFromSettings(customRoles = []) {
  return new Map(mergeRoleSettings(customRoles).map(role => [role.key, role]));
}

function getRoleDefinition(customRoles = [], key = 'user') {
  const roleKey = normalizeRoleKey(key) || 'user';
  const roles = roleMapFromSettings(customRoles);
  return roles.get(roleKey) || roles.get('user');
}

function roleBaseForKey(customRoles = [], key = 'user') {
  return getRoleDefinition(customRoles, key)?.baseRole || 'user';
}

function roleRank(baseRole = 'user') {
  return ROLE_RANK[normalizeRoleBase(baseRole)] ?? 0;
}

function canBaseAtLeast(baseRole, minimumBaseRole) {
  return roleRank(baseRole) >= roleRank(minimumBaseRole);
}

function baseRoleForUser(user) {
  if (!user) return 'user';
  if (ROLE_BASES.includes(user.roleBase)) return user.roleBase;
  if (ROLE_BASES.includes(user.role)) return user.role;
  return 'user';
}

module.exports = {
  BUILTIN_ROLE_KEYS,
  ROLE_BASES,
  ROLE_RANK,
  DEFAULT_ROLE_SETTINGS,
  normalizeRoleKey,
  normalizeRoleBase,
  sanitizeRoleColor,
  cleanRoleLogo,
  cleanRoleName,
  mergeRoleSettings,
  getRoleDefinition,
  roleBaseForKey,
  roleRank,
  canBaseAtLeast,
  baseRoleForUser
};
