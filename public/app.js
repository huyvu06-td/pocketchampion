const MAX_TOTAL_STATS = 510;
const SKILL_SLOT_COUNT = 4;
const STAT_KEYS = ['hp', 'atk', 'satk', 'def', 'sdef', 'spe'];
const STAT_LABELS = {
  hp: 'HP',
  atk: 'ATK',
  satk: 'SATK',
  def: 'DEF',
  sdef: 'SDEF',
  spe: 'SPE'
};
const STAT_COLORS = {
  hp: ['#22c55e', '#86efac'],
  atk: ['#ef4444', '#fca5a5'],
  satk: ['#8b5cf6', '#c4b5fd'],
  def: ['#f59e0b', '#fde68a'],
  sdef: ['#0ea5e9', '#7dd3fc'],
  spe: ['#ec4899', '#f9a8d4']
};
const POKEMON_ITEM_NAMES = [
  'Ability Shield',
  'Absorb Bulb',
  'Adrenaline Orb',
  'Air Balloon',
  'Amulet Coin',
  'Assault Vest',
  'Big Root',
  'Binding Band',
  'Black Belt',
  'Black Glasses',
  'Black Sludge',
  'Booster Energy',
  'Bright Powder',
  'Cell Battery',
  'Charcoal',
  'Choice Band',
  'Choice Scarf',
  'Choice Specs',
  'Clear Amulet',
  'Covert Cloak',
  'Damp Rock',
  'Destiny Knot',
  'Dragon Fang',
  'Eject Button',
  'Eject Pack',
  'Electric Seed',
  'Eviolite',
  'Expert Belt',
  'Flame Orb',
  'Float Stone',
  'Focus Band',
  'Focus Sash',
  'Grassy Seed',
  'Grip Claw',
  'Hard Stone',
  'Heat Rock',
  'Heavy-Duty Boots',
  'Icy Rock',
  'King\'s Rock',
  'Lagging Tail',
  'Leftovers',
  'Life Orb',
  'Light Ball',
  'Light Clay',
  'Loaded Dice',
  'Lucky Egg',
  'Luminous Moss',
  'Magnet',
  'Mental Herb',
  'Metal Coat',
  'Metronome',
  'Miracle Seed',
  'Mirror Herb',
  'Misty Seed',
  'Muscle Band',
  'Mystic Water',
  'Never-Melt Ice',
  'Protective Pads',
  'Punching Glove',
  'Quick Claw',
  'Razor Claw',
  'Razor Fang',
  'Red Card',
  'Ring Target',
  'Rocky Helmet',
  'Room Service',
  'Safety Goggles',
  'Scope Lens',
  'Sharp Beak',
  'Shed Shell',
  'Shell Bell',
  'Silk Scarf',
  'Silver Powder',
  'Smooth Rock',
  'Snowball',
  'Soft Sand',
  'Spell Tag',
  'Sticky Barb',
  'Terrain Extender',
  'Throat Spray',
  'Toxic Orb',
  'Twisted Spoon',
  'Utility Umbrella',
  'Weakness Policy',
  'White Herb',
  'Wide Lens',
  'Wise Glasses',
  'Zoom Lens',
  'Aguav Berry',
  'Apicot Berry',
  'Aspear Berry',
  'Babiri Berry',
  'Charti Berry',
  'Cheri Berry',
  'Chesto Berry',
  'Chilan Berry',
  'Chople Berry',
  'Coba Berry',
  'Colbur Berry',
  'Custap Berry',
  'Enigma Berry',
  'Figy Berry',
  'Ganlon Berry',
  'Grepa Berry',
  'Haban Berry',
  'Hondew Berry',
  'Iapapa Berry',
  'Jaboca Berry',
  'Kasib Berry',
  'Kebia Berry',
  'Kee Berry',
  'Kelpsy Berry',
  'Lansat Berry',
  'Leppa Berry',
  'Liechi Berry',
  'Lum Berry',
  'Mago Berry',
  'Maranga Berry',
  'Micle Berry',
  'Occa Berry',
  'Oran Berry',
  'Passho Berry',
  'Payapa Berry',
  'Pecha Berry',
  'Persim Berry',
  'Petaya Berry',
  'Qualot Berry',
  'Rawst Berry',
  'Rindo Berry',
  'Roseli Berry',
  'Rowap Berry',
  'Salac Berry',
  'Shuca Berry',
  'Sitrus Berry',
  'Starf Berry',
  'Tanga Berry',
  'Wacan Berry',
  'Wiki Berry',
  'Yache Berry',
  'Adamant Mint',
  'Bold Mint',
  'Brave Mint',
  'Calm Mint',
  'Careful Mint',
  'Gentle Mint',
  'Hasty Mint',
  'Impish Mint',
  'Jolly Mint',
  'Lax Mint',
  'Lonely Mint',
  'Mild Mint',
  'Modest Mint',
  'Naive Mint',
  'Naughty Mint',
  'Quiet Mint',
  'Rash Mint',
  'Relaxed Mint',
  'Sassy Mint',
  'Serious Mint',
  'Timid Mint',
  'Bug Gem',
  'Dark Gem',
  'Dragon Gem',
  'Electric Gem',
  'Fairy Gem',
  'Fighting Gem',
  'Fire Gem',
  'Flying Gem',
  'Ghost Gem',
  'Grass Gem',
  'Ground Gem',
  'Ice Gem',
  'Normal Gem',
  'Poison Gem',
  'Psychic Gem',
  'Rock Gem',
  'Steel Gem',
  'Water Gem',
  'Bug Memory',
  'Dark Memory',
  'Dragon Memory',
  'Electric Memory',
  'Fairy Memory',
  'Fighting Memory',
  'Fire Memory',
  'Flying Memory',
  'Ghost Memory',
  'Grass Memory',
  'Ground Memory',
  'Ice Memory',
  'Poison Memory',
  'Psychic Memory',
  'Rock Memory',
  'Steel Memory',
  'Water Memory',
  'Burn Drive',
  'Chill Drive',
  'Douse Drive',
  'Shock Drive',
  'Draco Plate',
  'Dread Plate',
  'Earth Plate',
  'Fist Plate',
  'Flame Plate',
  'Icicle Plate',
  'Insect Plate',
  'Iron Plate',
  'Meadow Plate',
  'Mind Plate',
  'Pixie Plate',
  'Sky Plate',
  'Splash Plate',
  'Spooky Plate',
  'Stone Plate',
  'Toxic Plate',
  'Zap Plate',
  'Blue Orb',
  'Red Orb',
  'Griseous Orb',
  'Griseous Core',
  'Rusted Shield',
  'Rusted Sword',
  'Adamant Crystal',
  'Lustrous Globe',
  'Soul Dew',
  'Light Stone',
  'Dark Stone',
  'Aloraichium Z',
  'Buginium Z',
  'Darkinium Z',
  'Decidium Z',
  'Dragonium Z',
  'Eevium Z',
  'Electrium Z',
  'Fairium Z',
  'Fightinium Z',
  'Firium Z',
  'Flyinium Z',
  'Ghostium Z',
  'Grassium Z',
  'Groundium Z',
  'Icium Z',
  'Incinium Z',
  'Kommonium Z',
  'Lunalium Z',
  'Lycanium Z',
  'Marshadium Z',
  'Mewnium Z',
  'Mimikium Z',
  'Normalium Z',
  'Pikanium Z',
  'Pikashunium Z',
  'Poisonium Z',
  'Primarium Z',
  'Psychium Z',
  'Rockium Z',
  'Snorlium Z',
  'Solganium Z',
  'Steelium Z',
  'Tapunium Z',
  'Ultranecrozium Z',
  'Waterium Z',
  'Power Anklet',
  'Power Band',
  'Power Belt',
  'Power Bracer',
  'Power Lens',
  'Power Weight',
  'Macho Brace',
  'Soothe Bell',
  'Smoke Ball',
  'Cleanse Tag',
  'Everstone',
  'Lucky Punch',
  'Stick',
  'Leek',
  'Thick Club',
  'Deep Sea Scale',
  'Deep Sea Tooth',
  'Quick Powder',
  'Metal Powder'
];
const TOKEN_KEY = 'pc_linhthu_token_v4';
const MAX_AVATAR_SOURCE_BYTES = 2 * 1024 * 1024;
const MAX_AVATAR_OUTPUT_BYTES = 256 * 1024;
const AVATAR_SIZE = 256;
const MAX_DONATE_SOURCE_BYTES = 2 * 1024 * 1024;
const MAX_DONATE_OUTPUT_BYTES = 180 * 1024;
const DONATE_IMAGE_SIZE = 420;
const MAX_TEAM_GUIDE_SOURCE_BYTES = 3 * 1024 * 1024;
const MAX_TEAM_GUIDE_IMAGE_BYTES = 520 * 1024;
const MAX_TEAM_GUIDE_THUMB_BYTES = 80 * 1024;
const TEAM_GUIDE_IMAGE_MAX_WIDTH = 1200;
const TEAM_GUIDE_IMAGE_MAX_HEIGHT = 900;
const TEAM_GUIDE_THUMB_MAX_WIDTH = 420;
const TEAM_GUIDE_THUMB_MAX_HEIGHT = 260;

let token = localStorage.getItem(TOKEN_KEY) || '';
let currentUser = null;
let creatures = [];
let selectedCreature = null;
let selectedBuilds = [];
let selectedBuildId = null;
let roles = [];
let roleDefinitions = [];
let modList = [];
let selectedBuilder = null;
let donationConfig = { enabled: false, visible: false, imageData: '', accountNumber: '', bankName: '' };
let pendingDonateImageData = '';
let teamGuides = [];
let pendingTeamGuideImageData = '';
let pendingTeamGuideThumbData = '';

const el = {
  toast: document.querySelector('#toast'),
  authScreen: document.querySelector('#authScreen'),
  appScreen: document.querySelector('#appScreen'),
  tabLogin: document.querySelector('#tabLogin'),
  tabRegister: document.querySelector('#tabRegister'),
  loginForm: document.querySelector('#loginForm'),
  registerForm: document.querySelector('#registerForm'),
  loginUsername: document.querySelector('#loginUsername'),
  loginPassword: document.querySelector('#loginPassword'),
  registerDisplayName: document.querySelector('#registerDisplayName'),
  registerUsername: document.querySelector('#registerUsername'),
  registerPassword: document.querySelector('#registerPassword'),
  registerConfirmPassword: document.querySelector('#registerConfirmPassword'),
  userBadge: document.querySelector('#userBadge'),
  currentUserAvatar: document.querySelector('#currentUserAvatar'),
  avatarLabel: document.querySelector('#avatarLabel'),
  avatarInput: document.querySelector('#avatarInput'),
  btnClearAvatar: document.querySelector('#btnClearAvatar'),
  btnUsers: document.querySelector('#btnUsers'),
  btnCreatureLogs: document.querySelector('#btnCreatureLogs'),
  btnCreatures: document.querySelector('#btnCreatures'),
  btnExport: document.querySelector('#btnExport'),
  importLabel: document.querySelector('#importLabel'),
  importFile: document.querySelector('#importFile'),
  btnLogout: document.querySelector('#btnLogout'),
  btnHome: document.querySelector('#btnHome'),
  btnReload: document.querySelector('#btnReload'),
  btnReloadAuth: document.querySelector('#btnReloadAuth'),
  btnDonate: document.querySelector('#btnDonate'),
  btnDonateAuth: document.querySelector('#btnDonateAuth'),
  btnTeamGuides: document.querySelector('#btnTeamGuides'),
  teamGuidesDialog: document.querySelector('#teamGuidesDialog'),
  btnCloseTeamGuides: document.querySelector('#btnCloseTeamGuides'),
  teamGuideAdminPanel: document.querySelector('#teamGuideAdminPanel'),
  teamGuideForm: document.querySelector('#teamGuideForm'),
  teamGuideTitle: document.querySelector('#teamGuideTitle'),
  teamGuideNote: document.querySelector('#teamGuideNote'),
  teamGuideImageInput: document.querySelector('#teamGuideImageInput'),
  teamGuideImageStatus: document.querySelector('#teamGuideImageStatus'),
  teamGuidePreview: document.querySelector('#teamGuidePreview'),
  btnClearTeamGuideForm: document.querySelector('#btnClearTeamGuideForm'),
  teamGuidesGrid: document.querySelector('#teamGuidesGrid'),
  teamGuideViewerDialog: document.querySelector('#teamGuideViewerDialog'),
  btnCloseTeamGuideViewer: document.querySelector('#btnCloseTeamGuideViewer'),
  teamGuideViewerTitle: document.querySelector('#teamGuideViewerTitle'),
  teamGuideViewer: document.querySelector('#teamGuideViewer'),
  donateDialog: document.querySelector('#donateDialog'),
  btnCloseDonate: document.querySelector('#btnCloseDonate'),
  donateViewer: document.querySelector('#donateViewer'),
  donateAdminPanel: document.querySelector('#donateAdminPanel'),
  donateSettingsForm: document.querySelector('#donateSettingsForm'),
  donateEnabled: document.querySelector('#donateEnabled'),
  donateAccountNumber: document.querySelector('#donateAccountNumber'),
  donateBankName: document.querySelector('#donateBankName'),
  donateImageInput: document.querySelector('#donateImageInput'),
  btnClearDonateImage: document.querySelector('#btnClearDonateImage'),
  searchInput: document.querySelector('#searchInput'),
  btnSearch: document.querySelector('#btnSearch'),
  creatureSuggestions: document.querySelector('#creatureSuggestions'),
  skillSuggestions: document.querySelector('#skillSuggestions'),
  itemSuggestions: document.querySelector('#itemSuggestions'),
  homeLeaderboard: document.querySelector('#homeLeaderboard'),
  roleFilter: document.querySelector('#roleFilter'),
  modList: document.querySelector('#modList'),
  petList: document.querySelector('#petList'),
  emptyState: document.querySelector('#emptyState'),
  detailView: document.querySelector('#detailView'),
  dialog: document.querySelector('#petDialog'),
  form: document.querySelector('#petForm'),
  dialogTitle: document.querySelector('#dialogTitle'),
  btnCloseDialog: document.querySelector('#btnCloseDialog'),
  btnCancel: document.querySelector('#btnCancel'),
  btnDelete: document.querySelector('#btnDelete'),
  btnAddSkill: document.querySelector('#btnAddSkill'),
  petId: document.querySelector('#petId'),
  creatureId: document.querySelector('#creatureId'),
  name: document.querySelector('#name'),
  role: document.querySelector('#role'),
  nature: document.querySelector('#nature'),
  item: document.querySelector('#item'),
  passive: document.querySelector('#passive'),
  skillsWrap: document.querySelector('#skillsWrap'),
  hp: document.querySelector('#hp'),
  atk: document.querySelector('#atk'),
  satk: document.querySelector('#satk'),
  def: document.querySelector('#def'),
  sdef: document.querySelector('#sdef'),
  spe: document.querySelector('#spe'),
  statTotalText: document.querySelector('#statTotalText'),
  statTotalBar: document.querySelector('#statTotalBar'),
  notes: document.querySelector('#notes'),
  formError: document.querySelector('#formError'),
  usersDialog: document.querySelector('#usersDialog'),
  btnCloseUsers: document.querySelector('#btnCloseUsers'),
  createUserForm: document.querySelector('#createUserForm'),
  newDisplayName: document.querySelector('#newDisplayName'),
  newGameName: document.querySelector('#newGameName'),
  newUsername: document.querySelector('#newUsername'),
  newPassword: document.querySelector('#newPassword'),
  newConfirmPassword: document.querySelector('#newConfirmPassword'),
  newRole: document.querySelector('#newRole'),
  roleSettingsForm: document.querySelector('#roleSettingsForm'),
  roleKey: document.querySelector('#roleKey'),
  roleName: document.querySelector('#roleName'),
  roleLogo: document.querySelector('#roleLogo'),
  roleColor: document.querySelector('#roleColor'),
  roleBase: document.querySelector('#roleBase'),
  btnClearRoleForm: document.querySelector('#btnClearRoleForm'),
  roleSettingsTable: document.querySelector('#roleSettingsTable'),
  usersTable: document.querySelector('#usersTable'),
  creatureLogsDialog: document.querySelector('#creatureLogsDialog'),
  btnCloseCreatureLogs: document.querySelector('#btnCloseCreatureLogs'),
  btnRefreshCreatureLogs: document.querySelector('#btnRefreshCreatureLogs'),
  creatureLogsSummary: document.querySelector('#creatureLogsSummary'),
  creatureLogsTable: document.querySelector('#creatureLogsTable'),
  creaturesDialog: document.querySelector('#creaturesDialog'),
  btnCloseCreatures: document.querySelector('#btnCloseCreatures'),
  createCreatureForm: document.querySelector('#createCreatureForm'),
  newCreatureName: document.querySelector('#newCreatureName'),
  bulkCreatureForm: document.querySelector('#bulkCreatureForm'),
  bulkCreatureNames: document.querySelector('#bulkCreatureNames'),
  creatureAdminSummary: document.querySelector('#creatureAdminSummary'),
  btnSeedPokemon: document.querySelector('#btnSeedPokemon'),
  btnDeleteAllCreatures: document.querySelector('#btnDeleteAllCreatures'),
  creaturesTable: document.querySelector('#creaturesTable')
};

init();

function init() {
  removeSidebarModBoard();
  wireEvents();
  renderSiteTexts();
  renderOfficialLinks();
  renderItemSuggestions();
  loadDonationPublic();
  restoreSession();
}

function wireEvents() {
  el.tabLogin.addEventListener('click', () => setAuthMode('login'));
  el.tabRegister.addEventListener('click', () => setAuthMode('register'));

  el.loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    await login();
  });
  el.registerForm.addEventListener('submit', async event => {
    event.preventDefault();
    await register();
  });

  el.btnLogout.addEventListener('click', logout);
  el.btnHome?.addEventListener('click', goHome);
  el.btnReload?.addEventListener('click', reloadWeb);
  el.btnReloadAuth?.addEventListener('click', reloadWeb);
  el.btnDonate?.addEventListener('click', openDonateDialog);
  el.btnDonateAuth?.addEventListener('click', openDonateDialog);
  el.btnCloseDonate?.addEventListener('click', () => el.donateDialog.close());
  el.btnTeamGuides?.addEventListener('click', openTeamGuidesDialog);
  el.btnCloseTeamGuides?.addEventListener('click', () => el.teamGuidesDialog.close());
  el.btnCloseTeamGuideViewer?.addEventListener('click', () => el.teamGuideViewerDialog.close());
  el.teamGuideForm?.addEventListener('submit', async event => {
    event.preventDefault();
    await saveTeamGuide();
  });
  el.teamGuideImageInput?.addEventListener('change', handleTeamGuideImageUpload);
  el.btnClearTeamGuideForm?.addEventListener('click', clearTeamGuideForm);
  el.donateSettingsForm?.addEventListener('submit', async event => {
    event.preventDefault();
    await saveDonateSettings();
  });
  el.donateImageInput?.addEventListener('change', handleDonateImageUpload);
  el.btnClearDonateImage?.addEventListener('click', () => {
    pendingDonateImageData = '';
    donationConfig.imageData = '';
    renderDonateDialog();
  });
  el.avatarInput.addEventListener('change', handleAvatarUpload);
  el.btnClearAvatar.addEventListener('click', clearAvatar);
  el.btnExport.addEventListener('click', exportBuilds);
  el.importFile.addEventListener('change', importBuilds);
  el.searchInput.addEventListener('input', debounce(loadCreatures, 250));
  el.searchInput.addEventListener('change', selectCreatureFromTypedName);
  el.searchInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      performSearch();
    }
  });
  el.btnSearch?.addEventListener('click', performSearch);
  el.roleFilter.addEventListener('change', renderDetail);

  el.form.addEventListener('submit', async event => {
    event.preventDefault();
    await saveBuildFromForm();
  });
  el.btnCloseDialog.addEventListener('click', () => el.dialog.close());
  el.btnCancel.addEventListener('click', () => el.dialog.close());
  el.btnDelete.addEventListener('click', deleteCurrentBuild);
  el.btnAddSkill.addEventListener('click', () => addSkillRow());
  document.querySelectorAll('.stat-input').forEach(input => input.addEventListener('input', updateStatPreview));

  el.btnUsers.addEventListener('click', openUsersDialog);
  el.btnCloseUsers.addEventListener('click', () => el.usersDialog.close());
  el.createUserForm.addEventListener('submit', async event => {
    event.preventDefault();
    await createUser();
  });
  el.roleSettingsForm?.addEventListener('submit', async event => {
    event.preventDefault();
    await saveRoleSettingFromForm();
  });
  el.btnClearRoleForm?.addEventListener('click', clearRoleForm);

  el.btnCreatureLogs?.addEventListener('click', openCreatureLogsDialog);
  el.btnCloseCreatureLogs?.addEventListener('click', () => el.creatureLogsDialog.close());
  el.btnRefreshCreatureLogs?.addEventListener('click', loadCreatureLogs);

  el.btnCreatures.addEventListener('click', openCreaturesDialog);
  el.btnCloseCreatures.addEventListener('click', () => el.creaturesDialog.close());
  el.createCreatureForm.addEventListener('submit', async event => {
    event.preventDefault();
    await createCreature();
  });
  el.bulkCreatureForm.addEventListener('submit', async event => {
    event.preventDefault();
    await bulkCreateCreatures();
  });
  el.btnSeedPokemon?.addEventListener('click', seedPokemonCatalog);
  el.btnDeleteAllCreatures.addEventListener('click', deleteAllCreatures);

  window.addEventListener('popstate', () => applyRouteFromUrl(false));
}

async function restoreSession() {
  if (!token) return showAuthScreen();
  try {
    const data = await api('/api/auth/me');
    currentUser = data.user;
    showAppScreen();
    await loadAll();
    await applyRouteFromUrl(false);
  } catch (error) {
    console.warn(error);
    logout(false);
  }
}

function setAuthMode(mode) {
  const isLogin = mode === 'login';
  el.tabLogin.classList.toggle('active', isLogin);
  el.tabRegister.classList.toggle('active', !isLogin);
  el.loginForm.classList.toggle('hidden', !isLogin);
  el.registerForm.classList.toggle('hidden', isLogin);
}

async function login() {
  try {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: { username: el.loginUsername.value, password: el.loginPassword.value }
    });
    token = data.token;
    currentUser = data.user;
    localStorage.setItem(TOKEN_KEY, token);
    showAppScreen();
    await loadAll();
    await applyRouteFromUrl(false);
    showToast('Đăng nhập thành công.');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function register() {
  try {
    if (el.registerPassword.value !== el.registerConfirmPassword.value) {
      showToast('Hai lần nhập mật khẩu không khớp.', 'error');
      el.registerConfirmPassword.focus();
      return;
    }
    const data = await api('/api/auth/register', {
      method: 'POST',
      body: {
        displayName: el.registerDisplayName.value,
        username: el.registerUsername.value,
        password: el.registerPassword.value,
        confirmPassword: el.registerConfirmPassword.value
      }
    });
    token = data.token;
    currentUser = data.user;
    localStorage.setItem(TOKEN_KEY, token);
    showAppScreen();
    await loadAll();
    await applyRouteFromUrl(false);
    showToast(data.message || 'Đăng ký thành công.');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function reloadWeb() {
  window.location.reload();
}

function logout(showMessage = true) {
  token = '';
  currentUser = null;
  creatures = [];
  selectedCreature = null;
  selectedBuilds = [];
  selectedBuildId = null;
  selectedBuilder = null;
  localStorage.removeItem(TOKEN_KEY);
  showAuthScreen();
  if (showMessage) showToast('Đã đăng xuất.');
}

function showAuthScreen() {
  el.authScreen.classList.remove('hidden');
  el.appScreen.classList.add('hidden');
}

function showAppScreen() {
  el.authScreen.classList.add('hidden');
  el.appScreen.classList.remove('hidden');
  updatePermissionUI();
}

function canCreateBuild() {
  return currentUser && roleRank(currentBaseRole()) >= roleRank('cameo');
}

function canManageCreatureNames() {
  return currentUser && roleRank(currentBaseRole()) >= roleRank('mod');
}

function canAdminCreatureNames() {
  return currentBaseRole() === 'admin';
}

function canUseAvatar() {
  return currentUser && roleRank(currentBaseRole()) >= roleRank('cameo');
}

function canEditBuild(build) {
  return build && build.canEdit;
}

function isAdmin() {
  return currentBaseRole() === 'admin';
}

function builderProfile(build) {
  return build?.createdBy || { username: 'unknown', displayName: '', gameName: '' };
}

function builderLabel(build) {
  const builder = builderProfile(build);
  return builder.label || builder.gameName || builder.displayName || builder.username || 'Không rõ';
}


function defaultRoleDefinitions() {
  return [
    { key: 'user', name: 'user - chỉ xem', color: '#a7b4d6', logo: '👤', baseRole: 'user', locked: true },
    { key: 'cameo', name: 'Cameo - được build', color: '#f472b6', logo: '🎭', baseRole: 'cameo', locked: true },
    { key: 'mod', name: 'mod - thêm tên + build', color: '#38bdf8', logo: '🛡️', baseRole: 'mod', locked: true },
    { key: 'admin', name: 'admin - toàn quyền', color: '#facc15', logo: '👑', baseRole: 'admin', locked: true }
  ];
}

function normalizeRoleKeyClient(value = '') {
  const raw = String(value || '').trim().toLowerCase();
  return raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 32) || '';
}

function roleMeta(roleKey = 'user') {
  const key = normalizeRoleKeyClient(roleKey) || 'user';
  return roleDefinitions.find(role => role.key === key) || defaultRoleDefinitions().find(role => role.key === key) || defaultRoleDefinitions()[0];
}

function roleBase(roleKey = 'user') {
  return roleMeta(roleKey).baseRole || 'user';
}

function currentBaseRole() {
  return currentUser?.roleBase || roleBase(currentUser?.role || 'user');
}

function roleRank(baseRole = 'user') {
  return { user: 0, cameo: 1, mod: 2, admin: 3 }[baseRole] ?? 0;
}

function hasBaseAtLeast(userOrRole, minimum = 'user') {
  const base = typeof userOrRole === 'string' ? roleBase(userOrRole) : (userOrRole?.roleBase || roleBase(userOrRole?.role || 'user'));
  return roleRank(base) >= roleRank(minimum);
}

function roleBadgeHtml(roleKey = 'user', className = '') {
  const role = roleMeta(roleKey);
  return `<span class="role-pill ${escapeAttr(className)}" style="--role-color:${escapeAttr(role.color || '#a7b4d6')}"><span class="role-logo">${escapeHtml(role.logo || '🏷️')}</span>${escapeHtml(role.name || role.key)}</span>`;
}

function roleNameHtml(user, fallback = 'Không rõ') {
  const role = roleMeta(user?.role || 'user');
  const label = user?.gameName || user?.displayName || user?.username || fallback;
  return `<span class="role-colored-name" style="--role-color:${escapeAttr(role.color || '#a7b4d6')}"><span class="role-logo">${escapeHtml(role.logo || '🏷️')}</span>${escapeHtml(label)}</span>`;
}

async function loadRoleSettings() {
  try {
    const data = await api('/api/settings/roles');
    roleDefinitions = Array.isArray(data.roles) && data.roles.length ? data.roles : defaultRoleDefinitions();
  } catch (error) {
    console.warn('Không tải được role settings:', error.message);
    roleDefinitions = defaultRoleDefinitions();
  }
  renderRoleSelectOptions();
}

function renderRoleSelectOptions() {
  const options = (roleDefinitions.length ? roleDefinitions : defaultRoleDefinitions()).map(role =>
    `<option value="${escapeAttr(role.key)}">${escapeHtml((role.logo || '') + ' ' + (role.name || role.key))}</option>`
  ).join('');
  if (el.newRole) el.newRole.innerHTML = options;
}


function renderSiteTexts() {
  const config = window.POCKET_CHAMPION_TEXT || {};
  const mappings = [
    ['authTitle', '#authTitle', 'Tra cứu build linh thú online'],
    ['authSubtitle', '#authSubtitle', 'Đăng nhập hoặc tự tạo tài khoản để tra cứu. Tài khoản mới mặc định là user; Cameo/mod/admin được build và chỉ sửa build của mình, riêng admin toàn quyền.'],
    ['heroTitle', '#heroTitle', 'Tra cứu build linh thú'],
    ['heroSubtitle', '#heroSubtitle', 'Admin/mod có thể thêm tên linh thú. Cameo/mod/admin search tên rồi bấm Build để tạo cách build riêng; link linh thú có thể share trực tiếp.']
  ];

  if (config.documentTitle) {
    document.title = String(config.documentTitle);
  }

  mappings.forEach(([key, selector, fallback]) => {
    const node = document.querySelector(selector);
    if (node) {
      node.textContent = String(config[key] || fallback);
    }
  });
}

function getOfficialLinks() {
  return Array.isArray(window.POCKET_CHAMPION_LINKS) ? window.POCKET_CHAMPION_LINKS : [];
}

function isUsableExternalUrl(url = '') {
  return /^https?:\/\//i.test(String(url || '').trim());
}

function removeSidebarOfficialLinks() {
  document.querySelectorAll('.sidebar [data-official-links], .sidebar .official-links-block, .sidebar .official-box, .sidebar-links').forEach(node => {
    const wrapper = node.closest('.official-links-block, .official-box, .sidebar-links') || node;
    wrapper.remove();
  });
}

function renderOfficialLinks() {
  removeSidebarOfficialLinks();
  const containers = Array.from(document.querySelectorAll('[data-official-links]')).filter(container => !container.closest('.sidebar'));
  const links = getOfficialLinks();
  containers.forEach(container => {
    container.innerHTML = links.map(link => {
      const usable = isUsableExternalUrl(link.url);
      const tag = usable ? 'a' : 'span';
      const attrs = usable
        ? `href="${escapeAttr(link.url)}" target="_blank" rel="noopener noreferrer"`
        : 'aria-disabled="true"';
      return `
        <${tag} class="official-link ${usable ? '' : 'disabled'}" ${attrs}>
          <span class="official-icon">${escapeHtml(link.icon || '🔗')}</span>
          <span>
            <strong>${escapeHtml(link.label || 'Liên kết')}</strong>
            <small>${usable ? escapeHtml(link.description || 'Mở liên kết') : 'Chưa thêm link'}</small>
          </span>
        </${tag}>
      `;
    }).join('') || '<p class="muted">Chưa cấu hình liên kết.</p>';
  });
}


async function openTeamGuidesDialog() {
  await loadTeamGuides();
  renderTeamGuidesDialog();
  el.teamGuidesDialog.showModal();
}

async function loadTeamGuides() {
  try {
    const data = await api('/api/team-guides');
    teamGuides = data.guides || [];
  } catch (error) {
    showToast(error.message || 'Không tải được đội hình gợi ý.', 'error');
  }
}

function renderTeamGuidesDialog() {
  if (!el.teamGuidesGrid) return;
  el.teamGuideAdminPanel?.classList.toggle('hidden', !isAdmin());

  if (!teamGuides.length) {
    el.teamGuidesGrid.innerHTML = '<p class="muted">Chưa có ảnh đội hình gợi ý nào.</p>';
    return;
  }

  el.teamGuidesGrid.innerHTML = teamGuides.map(guide => `
    <article class="team-guide-card" data-id="${escapeAttr(guide.id)}">
      <button class="team-guide-thumb" data-id="${escapeAttr(guide.id)}" type="button" aria-label="Xem ${escapeAttr(guide.title)}">
        <img src="${escapeAttr(guide.thumbData || guide.imageData || '')}" alt="${escapeAttr(guide.title)}" loading="lazy" />
      </button>
      <div class="team-guide-card-body">
        <h4>${escapeHtml(guide.title)}</h4>
        ${guide.note ? `<p>${escapeHtml(guide.note)}</p>` : '<p class="muted">Không có ghi chú.</p>'}
        <div class="pet-meta">
          <span class="badge">${formatDate(guide.updatedAt || guide.createdAt)}</span>
          ${isAdmin() ? `<button class="danger ghost small delete-team-guide" data-id="${escapeAttr(guide.id)}" type="button">Xóa</button>` : ''}
        </div>
      </div>
    </article>
  `).join('');

  el.teamGuidesGrid.querySelectorAll('.team-guide-thumb').forEach(button => {
    button.addEventListener('click', () => viewTeamGuide(button.dataset.id));
  });

  el.teamGuidesGrid.querySelectorAll('.delete-team-guide').forEach(button => {
    button.addEventListener('click', async event => {
      event.stopPropagation();
      await deleteTeamGuide(button.dataset.id);
    });
  });
}

async function viewTeamGuide(id) {
  try {
    const data = await api(`/api/team-guides/${encodeURIComponent(id)}`);
    const guide = data.guide;
    el.teamGuideViewerTitle.textContent = guide.title || 'Đội hình';
    el.teamGuideViewer.innerHTML = `
      <div class="team-guide-full-card">
        <img src="${escapeAttr(guide.imageData || guide.thumbData || '')}" alt="${escapeAttr(guide.title || 'Đội hình')}" loading="lazy" />
        <div class="team-guide-full-info">
          <h3>${escapeHtml(guide.title || 'Đội hình')}</h3>
          ${guide.note ? `<p>${escapeHtml(guide.note).replace(/\n/g, '<br>')}</p>` : '<p class="muted">Không có ghi chú.</p>'}
          <div class="pet-meta">
            <span class="badge">Cập nhật: ${formatDate(guide.updatedAt || guide.createdAt)}</span>
            ${isAdmin() ? `<button id="btnDeleteTeamGuideFromViewer" class="danger ghost" type="button">Xóa ảnh này</button>` : ''}
          </div>
        </div>
      </div>
    `;
    document.querySelector('#btnDeleteTeamGuideFromViewer')?.addEventListener('click', async () => {
      await deleteTeamGuide(guide.id);
      el.teamGuideViewerDialog.close();
    });
    el.teamGuideViewerDialog.showModal();
  } catch (error) {
    showToast(error.message || 'Không mở được đội hình.', 'error');
  }
}

async function handleTeamGuideImageUpload(event) {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file) return;
  if (!isAdmin()) return showToast('Chỉ admin được up ảnh đội hình.', 'error');
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    return showToast('Ảnh đội hình chỉ nhận PNG, JPG hoặc WebP.', 'error');
  }
  if (file.size > MAX_TEAM_GUIDE_SOURCE_BYTES) {
    return showToast('Ảnh gốc tối đa 3MB. Hãy chọn ảnh nhỏ hơn.', 'error');
  }

  try {
    const [imageData, thumbData] = await Promise.all([
      resizeImageFitFile(file, TEAM_GUIDE_IMAGE_MAX_WIDTH, TEAM_GUIDE_IMAGE_MAX_HEIGHT, MAX_TEAM_GUIDE_IMAGE_BYTES, 'Ảnh đội hình'),
      resizeImageFitFile(file, TEAM_GUIDE_THUMB_MAX_WIDTH, TEAM_GUIDE_THUMB_MAX_HEIGHT, MAX_TEAM_GUIDE_THUMB_BYTES, 'Ảnh thu nhỏ đội hình')
    ]);
    pendingTeamGuideImageData = imageData;
    pendingTeamGuideThumbData = thumbData;
    el.teamGuideImageStatus.textContent = 'Đã chọn và nén ảnh. Bấm Lưu đội hình để đăng.';
    el.teamGuidePreview.classList.remove('hidden');
    el.teamGuidePreview.innerHTML = `<img src="${escapeAttr(thumbData)}" alt="Preview đội hình" />`;
  } catch (error) {
    showToast(error.message || 'Không xử lý được ảnh đội hình.', 'error');
  }
}

async function saveTeamGuide() {
  if (!isAdmin()) return showToast('Chỉ admin được lưu đội hình gợi ý.', 'error');
  if (!pendingTeamGuideImageData || !pendingTeamGuideThumbData) {
    return showToast('Hãy chọn ảnh đội hình trước khi lưu.', 'error');
  }

  try {
    const result = await api('/api/team-guides', {
      method: 'POST',
      body: {
        title: el.teamGuideTitle.value,
        note: el.teamGuideNote.value,
        imageData: pendingTeamGuideImageData,
        thumbData: pendingTeamGuideThumbData
      }
    });
    showToast(result.message || 'Đã lưu đội hình gợi ý.');
    clearTeamGuideForm();
    await loadTeamGuides();
    renderTeamGuidesDialog();
  } catch (error) {
    showToast(error.message || 'Không lưu được đội hình gợi ý.', 'error');
  }
}

function clearTeamGuideForm() {
  pendingTeamGuideImageData = '';
  pendingTeamGuideThumbData = '';
  el.teamGuideForm?.reset();
  if (el.teamGuideImageStatus) el.teamGuideImageStatus.textContent = 'Chưa chọn ảnh.';
  if (el.teamGuidePreview) {
    el.teamGuidePreview.classList.add('hidden');
    el.teamGuidePreview.innerHTML = '';
  }
}

async function deleteTeamGuide(id) {
  if (!isAdmin()) return showToast('Chỉ admin được xóa đội hình gợi ý.', 'error');
  if (!confirm('Xóa ảnh đội hình gợi ý này?')) return;
  try {
    await api(`/api/team-guides/${encodeURIComponent(id)}`, { method: 'DELETE' });
    showToast('Đã xóa đội hình gợi ý.');
    await loadTeamGuides();
    renderTeamGuidesDialog();
  } catch (error) {
    showToast(error.message || 'Không xóa được đội hình gợi ý.', 'error');
  }
}


async function loadDonationPublic() {
  try {
    const data = await apiPublic('/api/settings/public');
    donationConfig = data.donate || donationConfig;
    updateDonateButtons();
    if (el.donateDialog?.open) renderDonateDialog();
  } catch (error) {
    console.warn('Không tải được donate config:', error.message);
    updateDonateButtons();
  }
}

async function loadDonateAdmin() {
  if (!isAdmin()) return;
  try {
    const data = await api('/api/settings/donate');
    donationConfig = data.donate || donationConfig;
    pendingDonateImageData = donationConfig.imageData || '';
    updateDonateButtons();
    renderDonateDialog();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function updateDonateButtons() {
  const visibleForViewer = Boolean(donationConfig?.enabled || donationConfig?.visible || isAdmin());
  if (el.btnDonate) el.btnDonate.classList.toggle('hidden', !visibleForViewer);
  if (el.btnDonateAuth) el.btnDonateAuth.classList.toggle('hidden', !Boolean(donationConfig?.enabled || donationConfig?.visible));
}

async function openDonateDialog() {
  if (isAdmin()) {
    await loadDonateAdmin();
  } else {
    renderDonateDialog();
  }
  el.donateDialog.showModal();
}

function renderDonateDialog() {
  if (!el.donateViewer) return;
  const imageData = pendingDonateImageData || donationConfig.imageData || '';
  const enabled = Boolean(donationConfig.enabled);
  const accountNumber = donationConfig.accountNumber || '';
  const bankName = donationConfig.bankName || '';

  el.donateViewer.innerHTML = `
    <div class="donate-card">
      <div class="donate-image-box">
        ${imageData && isSafeAvatarDataUrl(imageData)
          ? `<img src="${escapeAttr(imageData)}" alt="Ảnh donate" loading="lazy" />`
          : '<div class="donate-placeholder">Chưa có ảnh donate / QR</div>'}
      </div>
      <div class="donate-info">
        ${isAdmin() && !enabled ? '<span class="badge danger-badge">Đang ẩn với người xem</span>' : '<span class="badge strong-badge">Donate / Ủng hộ</span>'}
        <h3>Cảm ơn bạn đã ủng hộ admin</h3>
        <div class="copy-line">
          <div><span>STK</span><strong>${escapeHtml(accountNumber || 'Chưa nhập')}</strong></div>
          <button class="ghost small" data-copy-value="${escapeAttr(accountNumber)}" ${accountNumber ? '' : 'disabled'} type="button">Copy STK</button>
        </div>
        <div class="copy-line">
          <div><span>Ngân hàng</span><strong>${escapeHtml(bankName || 'Chưa nhập')}</strong></div>
          <button class="ghost small" data-copy-value="${escapeAttr(bankName)}" ${bankName ? '' : 'disabled'} type="button">Copy ngân hàng</button>
        </div>
      </div>
    </div>
  `;

  el.donateViewer.querySelectorAll('[data-copy-value]').forEach(button => {
    button.addEventListener('click', () => copyText(button.dataset.copyValue || '', 'Đã copy thông tin donate.'));
  });

  const admin = isAdmin();
  el.donateAdminPanel?.classList.toggle('hidden', !admin);
  if (admin) {
    el.donateEnabled.checked = enabled;
    el.donateAccountNumber.value = accountNumber;
    el.donateBankName.value = bankName;
  }
}

async function handleDonateImageUpload(event) {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file) return;
  if (!isAdmin()) return showToast('Chỉ admin được đổi ảnh donate.', 'error');
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    return showToast('Ảnh donate chỉ nhận PNG, JPG hoặc WebP.', 'error');
  }
  if (file.size > MAX_DONATE_SOURCE_BYTES) {
    return showToast('Ảnh gốc tối đa 2MB. Hãy chọn ảnh nhỏ hơn.', 'error');
  }

  try {
    pendingDonateImageData = await resizeSquareImageFile(file, DONATE_IMAGE_SIZE, MAX_DONATE_OUTPUT_BYTES, 'Ảnh donate');
    donationConfig.imageData = pendingDonateImageData;
    renderDonateDialog();
    showToast('Đã nén ảnh donate. Bấm Lưu donate để áp dụng.');
  } catch (error) {
    showToast(error.message || 'Không thể xử lý ảnh donate.', 'error');
  }
}

async function saveDonateSettings() {
  if (!isAdmin()) return showToast('Chỉ admin được lưu donate.', 'error');
  try {
    const result = await api('/api/settings/donate', {
      method: 'PATCH',
      body: {
        enabled: el.donateEnabled.checked,
        accountNumber: el.donateAccountNumber.value,
        bankName: el.donateBankName.value,
        imageData: pendingDonateImageData || ''
      }
    });
    donationConfig = result.donate || donationConfig;
    pendingDonateImageData = donationConfig.imageData || '';
    updateDonateButtons();
    renderDonateDialog();
    showToast(result.message || 'Đã lưu donate.');
  } catch (error) {
    showToast(error.message || 'Không thể lưu donate.', 'error');
  }
}

function copyText(text, successMessage = 'Đã copy.') {
  if (!text) return showToast('Không có nội dung để copy.', 'error');
  navigator.clipboard.writeText(text).then(
    () => showToast(successMessage),
    () => showToast('Không thể copy.', 'error')
  );
}

function updatePermissionUI() {
  el.userBadge.innerHTML = `${escapeHtml(currentUser.displayName || currentUser.username)} · ${roleBadgeHtml(currentUser.role)}`;
  renderAvatar(el.currentUserAvatar, currentUser);
  el.btnUsers.classList.toggle('hidden', !isAdmin());
  el.btnCreatureLogs?.classList.toggle('hidden', !isAdmin());
  el.btnCreatures.classList.toggle('hidden', !canManageCreatureNames());
  el.btnExport.classList.toggle('hidden', !isAdmin());
  el.importLabel.classList.toggle('hidden', !isAdmin());
  el.avatarLabel.classList.toggle('hidden', !canUseAvatar());
  el.btnClearAvatar.classList.toggle('hidden', !canUseAvatar() || !currentUser.avatarData);
  el.btnLogout.classList.toggle('hidden', !isAdmin());
  updateDonateButtons();
}

async function loadAll() {
  await loadRoleSettings();
  updatePermissionUI();
  await Promise.all([loadRoles(), loadMods(), loadCreatures(), loadDonationPublic()]);
}

async function goHome() {
  selectedCreature = null;
  selectedBuilder = null;
  selectedBuilds = [];
  selectedBuildId = '';
  renderSkillSuggestions();
  if (el.searchInput) el.searchInput.value = '';
  if (el.roleFilter) el.roleFilter.value = '';
  setRoute('', '', false);
  await loadCreatures();
  renderDetail();
}

async function loadRoles() {
  try {
    const data = await api('/api/beasts/roles');
    roles = data.roles || [];
    renderRoleFilter();
  } catch (error) {
    console.warn(error);
  }
}

async function loadMods() {
  try {
    const data = await api('/api/users/mods');
    modList = data.mods || [];
    renderModList();
  } catch (error) {
    console.warn(error);
  }
}

function removeSidebarModBoard() {
  document.querySelectorAll('.mod-board, #modList').forEach(node => {
    const board = node.closest('.mod-board') || node;
    board.remove();
  });
}

function renderModList() {
  // Sidebar mod list is removed completely from v2.30.
  // Keep mod data only for the home leaderboard contribution ranking.
  removeSidebarModBoard();
  renderHomeLeaderboard();
}

function renderHomeLeaderboard() {
  if (!el.homeLeaderboard) return;
  if (!modList.length) {
    el.homeLeaderboard.innerHTML = '';
    return;
  }

  const top = modList.slice(0, 10);
  el.homeLeaderboard.innerHTML = `
    <div class="leaderboard-card">
      <div class="section-title compact">
        <h3>Bảng xếp hạng đóng góp build</h3>
        <p>Top Cameo/mod/admin có nhiều bài build nhất. Bấm vào tên để xem toàn bộ linh thú người đó đã build.</p>
      </div>
      <div class="leaderboard-list">
        ${top.map((mod, index) => `
          <button class="leaderboard-row" data-id="${escapeAttr(mod.id)}" type="button">
            <span class="rank-medal">${index + 1}</span>
            ${avatarHtml(mod, 'avatar-sm')}
            <span class="leaderboard-name">${roleNameHtml(mod)}</span>
            <span class="badge">${Number(mod.buildCount || 0)} build</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;

  el.homeLeaderboard.querySelectorAll('.leaderboard-row').forEach(button => {
    button.addEventListener('click', () => selectBuilder(button.dataset.id));
  });
}

function renderRoleFilter() {
  el.roleFilter.innerHTML = '<option value="">Tất cả vai trò build</option>' + roles
    .map(role => `<option value="${escapeAttr(role)}">${escapeHtml(role)}</option>`)
    .join('');
}

async function loadCreatures() {
  try {
    const params = new URLSearchParams();
    const searchText = el.searchInput.value.trim();
    if (searchText) params.set('search', searchText);

    // Trang chủ chỉ hiện Pokémon đã có ít nhất 1 build.
    // User thường khi search cũng chỉ thấy Pokémon đã build; Cameo/mod/admin vẫn search được tên chưa build để tạo build mới.
    if (!searchText || !canCreateBuild()) params.set('builtOnly', 'true');

    const data = await api(`/api/creatures?${params.toString()}`);
    creatures = data.creatures || [];
    renderCreatureSuggestions();
    renderList();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function renderList() {
  if (!creatures.length) {
    const searchText = el.searchInput.value.trim();
    if (!searchText) {
      el.petList.innerHTML = '<p class="muted">Chưa có Pokémon nào được build nên chưa hiển thị ở trang chủ.</p>';
    } else {
      el.petList.innerHTML = canCreateBuild()
        ? '<p class="muted">Không tìm thấy tên linh thú. Cameo cần chọn tên đã có; mod/admin có thể thêm trong “Quản lý tên linh thú”.</p>'
        : '<p class="muted">Không tìm thấy Pokémon đã có build phù hợp.</p>';
    }
    return;
  }

  el.petList.innerHTML = creatures.map(creature => `
    <button class="pet-card ${selectedCreature?.id === creature.id ? 'active' : ''}" data-id="${escapeAttr(creature.id)}" type="button">
      <div>
        <h3>${escapeHtml(creature.name)}</h3>
        <div class="pet-meta">
          ${creature.generation ? `<span class="badge">Gen ${Number(creature.generation)}</span>` : ''}
          ${Number(creature.suggestedSkillCount || 0) ? `<span class="badge">${Number(creature.suggestedSkillCount)} skill</span>` : ''}
          <span class="badge">${Number(creature.buildCount || 0)} build</span>
        </div>
      </div>
      <span class="chevron">›</span>
    </button>
  `).join('');

  el.petList.querySelectorAll('.pet-card').forEach(btn => {
    btn.addEventListener('click', () => selectCreature(btn.dataset.id));
  });
}

function renderCreatureSuggestions() {
  if (!el.creatureSuggestions) return;
  el.creatureSuggestions.innerHTML = creatures
    .slice(0, 80)
    .map(creature => `<option value="${escapeAttr(creature.name)}"></option>`)
    .join('');
}

function renderSkillSuggestions() {
  if (!el.skillSuggestions) return;
  const skills = Array.isArray(selectedCreature?.suggestedSkills) ? selectedCreature.suggestedSkills : [];
  const uniqueSkills = [...new Set(skills.map(skill => String(skill || '').trim()).filter(Boolean))].slice(0, 500);
  el.skillSuggestions.innerHTML = uniqueSkills
    .map(skill => `<option value="${escapeAttr(skill)}"></option>`)
    .join('');
}

function renderItemSuggestions() {
  if (!el.itemSuggestions) return;
  el.itemSuggestions.innerHTML = POKEMON_ITEM_NAMES
    .map(item => `<option value="${escapeAttr(item)}"></option>`)
    .join('');
}

function setItemValue(value = '') {
  if (el.item) el.item.value = String(value || '');
}

function getItemValue() {
  return el.item ? el.item.value : '';
}

function openDialogSafely(dialog) {
  if (!dialog) return;
  if (typeof dialog.showModal === 'function') {
    try {
      dialog.showModal();
      return;
    } catch (error) {
      console.warn('Không thể mở dialog bằng showModal:', error);
    }
  }
  dialog.setAttribute('open', 'open');
}

function skillPoolHtml() {
  return '';
}

async function performSearch() {
  await loadCreatures();
  const typedRaw = el.searchInput.value.trim();
  if (!typedRaw) return;
  const typed = typedRaw.toLocaleLowerCase('vi-VN');
  const exact = creatures.find(creature => String(creature.name || '').trim().toLocaleLowerCase('vi-VN') === typed);
  if (exact) {
    await selectCreature(exact.id);
    return;
  }
  if (creatures.length === 1) {
    await selectCreature(creatures[0].id);
    return;
  }
  if (!creatures.length) {
    showToast(canCreateBuild()
      ? 'Không tìm thấy tên Pokémon này. Mod/admin có thể thêm tên trong Quản lý tên linh thú.'
      : 'Không tìm thấy Pokémon đã có build phù hợp.', 'error');
  }
}

async function selectCreatureFromTypedName() {
  const typed = el.searchInput.value.trim().toLocaleLowerCase('vi-VN');
  if (!typed) return;
  const exact = creatures.find(creature => String(creature.name || '').trim().toLocaleLowerCase('vi-VN') === typed);
  if (exact) await selectCreature(exact.id);
}

function currentRoute() {
  const params = new URLSearchParams(window.location.search);
  return {
    creatureId: params.get('beast') || params.get('creature') || '',
    buildId: params.get('build') || ''
  };
}

function setRoute(creatureId, buildId = '', replace = false) {
  const url = new URL(window.location.href);
  url.searchParams.delete('creature');
  if (creatureId) url.searchParams.set('beast', creatureId);
  else url.searchParams.delete('beast');
  if (buildId) url.searchParams.set('build', buildId);
  else url.searchParams.delete('build');
  const method = replace ? 'replaceState' : 'pushState';
  window.history[method]({}, '', url.toString());
}

async function applyRouteFromUrl(updateUrl = false) {
  if (!currentUser) return;
  const route = currentRoute();
  if (route.creatureId) {
    await selectCreature(route.creatureId, route.buildId, updateUrl);
  } else {
    selectedCreature = null;
    selectedBuilder = null;
    selectedBuilds = [];
    selectedBuildId = null;
    renderList();
    renderSkillSuggestions();
    renderDetail();
  }
}

async function selectCreature(creatureId, buildId = '', updateUrl = true) {
  try {
    const data = await api(`/api/creatures/${encodeURIComponent(creatureId)}`);
    selectedCreature = data.creature;
    selectedBuilder = null;
    selectedBuilds = data.builds || [];
    selectedBuildId = buildId && selectedBuilds.some(build => build.id === buildId) ? buildId : '';

    if (!creatures.some(item => item.id === selectedCreature.id)) {
      creatures = [selectedCreature, ...creatures];
    } else {
      creatures = creatures.map(item => item.id === selectedCreature.id ? selectedCreature : item);
    }

    if (updateUrl) setRoute(selectedCreature.id, selectedBuildId);
    renderList();
    renderSkillSuggestions();
    renderDetail();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function selectBuilder(userId) {
  try {
    const data = await api(`/api/users/${encodeURIComponent(userId)}/builds`);
    selectedBuilder = data.user;
    selectedCreature = null;
    selectedBuilds = data.builds || [];
    selectedBuildId = '';
    renderSkillSuggestions();
    setRoute('', '', false);
    renderList();
    renderDetail();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function filteredBuilds() {
  const selectedRole = el.roleFilter.value;
  if (!selectedRole) return selectedBuilds;
  return selectedBuilds.filter(build => build.role === selectedRole);
}

function renderBuilderDetail() {
  el.emptyState.classList.add('hidden');
  el.detailView.classList.remove('hidden');

  const builds = selectedBuilds || [];
  const label = selectedBuilder?.gameName || selectedBuilder?.displayName || selectedBuilder?.username || 'Mod/Admin';

  el.detailView.innerHTML = `
    <div class="detail-head builder-page-head">
      <div>
        <p class="eyebrow">Người build</p>
        <h2>${avatarHtml(selectedBuilder, 'avatar-lg')} ${roleNameHtml(selectedBuilder, label)}</h2>
        <div class="pet-meta">
          ${roleBadgeHtml(selectedBuilder?.role || 'mod', 'strong-badge')}
          <span class="badge">${Number(builds.length || selectedBuilder?.buildCount || 0)} build</span>
        </div>
      </div>
      <div class="detail-actions">
        <button id="btnBackHome" class="ghost" type="button">Về bảng xếp hạng</button>
      </div>
    </div>

    <section class="form-section">
      <div class="section-title">
        <h3>Toàn bộ linh thú đã build</h3>
        <p>Bấm vào một linh thú để mở trang linh thú đó và xem toàn bộ build của Cameo/mod/admin.</p>
      </div>
      <div class="builder-build-grid">
        ${builds.length ? builds.map(build => `
          <button class="builder-build-card" data-creature-id="${escapeAttr(build.creature?.id || '')}" data-build-id="${escapeAttr(build.id)}" type="button">
            <div>
              <h4>${escapeHtml(build.name)}</h4>
              <p>${escapeHtml(build.role || 'Khác')} · ${escapeHtml(build.nature || 'Chưa nhập Nature')}${build.item ? ` · Item: ${escapeHtml(build.item)}` : ''}</p>
            </div>
            <span class="badge">Berry ${Number(build.statTotal || 0)}/510</span>
          </button>
        `).join('') : '<p class="muted">Người này chưa có bài build nào.</p>'}
      </div>
    </section>
  `;

  document.querySelector('#btnBackHome')?.addEventListener('click', goHome);

  document.querySelectorAll('.builder-build-card').forEach(button => {
    button.addEventListener('click', async () => {
      const creatureId = button.dataset.creatureId;
      const buildId = button.dataset.buildId;
      if (!creatureId) return showToast('Build này chưa gắn với tên linh thú.', 'error');
      await selectCreature(creatureId, buildId);
    });
  });
}

function renderDetail() {
  if (!selectedCreature) {
    if (selectedBuilder) {
      renderBuilderDetail();
      return;
    }
    el.emptyState.classList.remove('hidden');
    el.detailView.classList.add('hidden');
    el.detailView.innerHTML = '';
    renderHomeLeaderboard();
    return;
  }

  el.emptyState.classList.add('hidden');
  el.detailView.classList.remove('hidden');

  const builds = filteredBuilds();
  const selectedBuild = selectedBuildId ? selectedBuilds.find(build => build.id === selectedBuildId) : null;
  const canBuild = canCreateBuild();
  const alreadyBuilt = currentUser && selectedBuilds.some(build => build.createdBy?.id === currentUser.id);

  el.detailView.innerHTML = `
    <div class="detail-head creature-head">
      <div>
        <p class="eyebrow">Linh thú</p>
        <h2>${escapeHtml(selectedCreature.name)}</h2>
        <div class="pet-meta">
          ${selectedCreature.generation ? `<span class="badge strong-badge">Pokémon Gen ${Number(selectedCreature.generation)}</span>` : ''}
          <span class="badge strong-badge">${Number(selectedCreature.buildCount || selectedBuilds.length || 0)} build</span>
          ${Number(selectedCreature.suggestedSkillCount || selectedCreature.suggestedSkills?.length || 0) ? `<span class="badge">${Number(selectedCreature.suggestedSkillCount || selectedCreature.suggestedSkills?.length || 0)} skill</span>` : ''}
          ${alreadyBuilt ? '<span class="badge">Bạn đã có build</span>' : ''}
        </div>
      </div>
      <div class="detail-actions">
        <button id="btnCopyCreatureLink" class="ghost" type="button">Copy link linh thú</button>
        ${canBuild ? `<button id="btnBuildCreature" class="primary" type="button">${alreadyBuilt ? 'Sửa build của tôi' : 'Build linh thú này'}</button>` : ''}
      </div>
    </div>

    <section class="form-section">
      <div class="section-title">
        <h3>Các bài build của Cameo/mod/admin</h3>
        <p>Bấm vào một bài build để xem đầy đủ Ability, Nature, Skills, Berry và ghi chú.</p>
      </div>
      <div class="build-list">
        ${builds.length ? builds.map(buildCardHtml).join('') : '<p class="muted">Chưa có build phù hợp bộ lọc.</p>'}
      </div>
    </section>

    <section id="selectedBuildView" class="selected-build-view">
      ${selectedBuild ? buildDetailHtml(selectedBuild) : '<div class="empty-state inline"><h2>Chưa chọn bài build</h2><p>Hãy bấm vào một bài build phía trên để xem chi tiết.</p></div>'}
    </section>
  `;

  document.querySelector('#btnCopyCreatureLink').addEventListener('click', copyCreatureLink);
  const buildButton = document.querySelector('#btnBuildCreature');
  if (buildButton) {
    buildButton.addEventListener('click', () => {
      const ownBuild = selectedBuilds.find(build => build.createdBy?.id === currentUser.id);
      openBuildDialog(ownBuild || null);
    });
  }

  document.querySelectorAll('.build-card').forEach(button => {
    button.addEventListener('click', () => {
      selectedBuildId = button.dataset.id;
      setRoute(selectedCreature.id, selectedBuildId);
      renderDetail();
    });
  });


  const copyBuildButton = document.querySelector('#btnCopyBuild');
  if (copyBuildButton && selectedBuild) copyBuildButton.addEventListener('click', () => copyBuild(selectedBuild));
  const editButton = document.querySelector('#btnEditBuild');
  if (editButton && selectedBuild) editButton.addEventListener('click', () => openBuildDialog(selectedBuild));
  const deleteSelectedButton = document.querySelector('#btnDeleteSelectedBuild');
  if (deleteSelectedButton && selectedBuild) deleteSelectedButton.addEventListener('click', () => deleteBuildById(selectedBuild.id));
}

function buildCardHtml(build) {
  const builder = builderProfile(build);
  return `
    <button class="build-card ${selectedBuildId === build.id ? 'active' : ''}" data-id="${escapeAttr(build.id)}" type="button">
      <div class="build-card-main">
        ${avatarHtml(builder, 'avatar-sm')}
        <div>
          <h4>${roleNameHtml(builder, builderLabel(build))}</h4>
          <p>${escapeHtml(build.role || 'Khác')} · ${escapeHtml(build.nature || 'Chưa nhập Nature')}${build.item ? ` · Item: ${escapeHtml(build.item)}` : ''}</p>
        </div>
      </div>
      <div class="build-card-side">
        <span class="badge">Berry ${Number(build.statTotal || 0)}/510</span>
        <small>${formatDate(build.updatedAt)}</small>
      </div>
    </button>
  `;
}

function skillSlots(skills = []) {
  const cleaned = Array.isArray(skills) ? skills : [];
  return Array.from({ length: SKILL_SLOT_COUNT }, (_, index) => {
    const skill = cleaned[index];
    if (typeof skill === 'string') return { name: skill };
    return { name: skill?.name || '' };
  });
}

function buildDetailHtml(build) {
  return `
    <div class="detail-head build-head">
      <div>
        <p class="eyebrow">Bài build</p>
        <h2>${escapeHtml(build.name)}</h2>
        <div class="pet-meta">
          <span class="badge strong-badge builder-badge">${avatarHtml(builderProfile(build), 'avatar-xs')} Người build: ${roleNameHtml(builderProfile(build), builderLabel(build))}</span>
          <span class="badge">${escapeHtml(build.role || 'Khác')}</span>
          ${build.item ? `<span class="badge item-badge">Item: ${escapeHtml(build.item)}</span>` : ''}
          <span class="badge">Berry ${Number(build.statTotal || 0)}/510</span>
        </div>
      </div>
      <div class="detail-actions">
        <button id="btnCopyBuild" class="ghost" type="button">Copy build</button>
        ${build.canDelete ? '<button id="btnDeleteSelectedBuild" class="danger ghost" type="button">Xóa build</button>' : ''}
        ${canEditBuild(build) ? '<button id="btnEditBuild" class="primary" type="button">Sửa build</button>' : ''}
      </div>
    </div>

    <div class="info-grid">
      <div class="info-box"><span>Tính cách (Nature)</span><strong>${escapeHtml(build.nature || 'Chưa nhập')}</strong></div>
      <div class="info-box"><span>Vật phẩm (Item)</span><strong>${escapeHtml(build.item || 'Chưa nhập')}</strong></div>
      <div class="info-box builder-info"><span>Người build</span><strong>${avatarHtml(builderProfile(build), 'avatar-sm')} ${roleNameHtml(builderProfile(build), builderLabel(build))}</strong></div>
      <div class="info-box"><span>Cập nhật</span><strong>${formatDate(build.updatedAt)}</strong></div>
    </div>

    <section class="content-section">
      <h3>Nội tại (Ability)</h3>
      <p>${escapeHtml(build.passive || 'Chưa nhập Ability.').replace(/\n/g, '<br>')}</p>
    </section>

    <section class="content-section">
      <h3>Kỹ năng (Skills)</h3>
      <div class="skill-list">
        ${skillSlots(build.skills).map((skill, index) => {
          const hasContent = Boolean((skill.name || '').trim());
          return `
            <div class="skill-card ${hasContent ? '' : 'empty'}">
              <span>${index + 1}</span>
              <div><strong>${escapeHtml(skill.name || `Skill ${index + 1}`)}</strong>${hasContent ? '' : '<p>Chưa nhập.</p>'}</div>
            </div>
          `;
        }).join('')}
      </div>
    </section>

    <section class="content-section">
      <h3>Berry / Chỉ số 510 điểm</h3>
      <div class="stat-grid">
        ${STAT_KEYS.map(key => statRow(key, build.stats?.[key] || 0)).join('')}
      </div>
    </section>

    <section class="content-section">
      <h3>Ghi chú (Notes)</h3>
      <p>${escapeHtml(build.notes || 'Chưa có ghi chú.').replace(/\n/g, '<br>')}</p>
    </section>
  `;
}

function statRow(key, value) {
  const numericValue = Number(value || 0);
  const percent = Math.min(100, Math.round((numericValue / MAX_TOTAL_STATS) * 100));
  const [from, to] = STAT_COLORS[key] || ['#22d3ee', '#7c5cff'];
  return `
    <div class="stat-row stat-row-${escapeAttr(key)}">
      <div><strong>${STAT_LABELS[key]}</strong><span>${numericValue}</span></div>
      <div class="bar small stat-bar"><span style="width:${percent}%; background: linear-gradient(90deg, ${from}, ${to}); box-shadow: 0 0 18px ${from}66;"></span></div>
    </div>
  `;
}

function openBuildDialog(build = null) {
  if (!canCreateBuild()) return showToast('Bạn không có quyền build linh thú.', 'error');
  if (build && !canEditBuild(build)) return showToast('Cameo/mod chỉ được sửa build do chính mình tạo.', 'error');
  if (!selectedCreature && !build?.creature) return showToast('Hãy chọn linh thú trước khi build.', 'error');

  clearFormError();
  el.form.reset();
  el.skillsWrap.innerHTML = '';

  const creature = build?.creature || selectedCreature;
  el.petId.value = build?.id || '';
  el.creatureId.value = creature?.id || selectedCreature?.id || '';
  el.name.value = creature?.name || selectedCreature?.name || build?.name || '';
  renderSkillSuggestions();

  if (build) {
    el.dialogTitle.textContent = 'Sửa build linh thú';
    el.role.value = build.role || '';
    el.nature.value = build.nature || '';
    setItemValue(build.item || '');
    el.passive.value = build.passive || '';
    el.notes.value = build.notes || '';
    STAT_KEYS.forEach(key => { el[key].value = build.stats?.[key] || 0; });
    skillSlots(build.skills).forEach((skill, index) => addSkillRow(skill, index));
    el.btnDelete.classList.toggle('hidden', !build.canDelete);
  } else {
    el.dialogTitle.textContent = `Build ${selectedCreature.name}`;
    setItemValue('');
    STAT_KEYS.forEach(key => { el[key].value = 0; });
    skillSlots().forEach((skill, index) => addSkillRow(skill, index));
    el.btnDelete.classList.add('hidden');
  }

  while (el.skillsWrap.children.length < SKILL_SLOT_COUNT) addSkillRow({ name: '' }, el.skillsWrap.children.length);
  updateStatPreview();
  openDialogSafely(el.dialog);
}

function addSkillRow(skill = { name: '' }, index = el.skillsWrap.children.length) {
  if (el.skillsWrap.children.length >= SKILL_SLOT_COUNT) return;
  const slotNumber = Number(index) + 1;
  const row = document.createElement('div');
  row.className = 'skill-row fixed-skill-row';
  row.innerHTML = `
    <span class="skill-slot-label">Skill ${slotNumber}</span>
    <input class="skill-name" list="skillSuggestions" placeholder="Tên skill ${slotNumber}" value="${escapeAttr(skill.name || '')}" autocomplete="off" />
  `;
  el.skillsWrap.appendChild(row);
}

function buildPayloadFromForm() {
  const skills = [...el.skillsWrap.querySelectorAll('.skill-row')]
    .map(row => ({ name: row.querySelector('.skill-name').value }))
    .filter(skill => skill.name.trim());

  return {
    creatureId: el.creatureId.value,
    name: el.name.value,
    role: el.role.value,
    nature: el.nature.value,
    item: getItemValue(),
    passive: el.passive.value,
    skills,
    stats: Object.fromEntries(STAT_KEYS.map(key => [key, Number(el[key].value || 0)])),
    notes: el.notes.value
  };
}

async function saveBuildFromForm() {
  clearFormError();
  const payload = buildPayloadFromForm();
  const total = statTotal(payload.stats);
  if (total !== MAX_TOTAL_STATS) return showFormError(`Tổng chỉ số phải đúng ${MAX_TOTAL_STATS}. Hiện tại là ${total}.`);
  if (payload.skills.length < 1) return showFormError('Cần nhập ít nhất 1 kỹ năng (Skill).');

  const id = el.petId.value;
  try {
    const data = await api(id ? `/api/beasts/${id}` : '/api/beasts', {
      method: id ? 'PUT' : 'POST',
      body: payload
    });
    el.dialog.close();
    showToast(id ? 'Đã sửa build.' : 'Đã thêm build linh thú.');
    await Promise.all([loadRoles(), loadMods(), loadCreatures()]);
    await selectCreature((data.beast.creature && data.beast.creature.id) || payload.creatureId, data.beast.id);
  } catch (error) {
    showFormError(error.message);
  }
}

async function deleteCurrentBuild() {
  const id = el.petId.value;
  if (!id) return;
  await deleteBuildById(id, { fromDialog: true });
}

async function deleteBuildById(id, options = {}) {
  if (!id) return;
  if (!confirm('Xóa bài build này? Dùng khi build troll/sai dữ liệu. Thao tác này không thể hoàn tác.')) return;
  try {
    await api(`/api/beasts/${id}`, { method: 'DELETE' });
    if (options.fromDialog && el.dialog.open) el.dialog.close();
    showToast('Đã xóa build.');
    selectedBuildId = '';
    await Promise.all([loadRoles(), loadMods(), loadCreatures()]);
    if (selectedCreature) await selectCreature(selectedCreature.id, '');
    else if (selectedBuilder) await selectBuilder(selectedBuilder.id);
  } catch (error) {
    if (options.fromDialog) showFormError(error.message);
    else showToast(error.message, 'error');
  }
}

function updateStatPreview() {
  const total = STAT_KEYS.reduce((sum, key) => sum + Number(el[key].value || 0), 0);
  el.statTotalText.textContent = `Đã dùng ${total}/${MAX_TOTAL_STATS}`;
  el.statTotalText.classList.toggle('bad', total !== MAX_TOTAL_STATS);
  el.statTotalBar.style.width = `${Math.min(100, (total / MAX_TOTAL_STATS) * 100)}%`;
}

function statTotal(stats = {}) {
  return STAT_KEYS.reduce((sum, key) => sum + Number(stats[key] || 0), 0);
}

function creatureLink(creatureId = selectedCreature?.id, buildId = '') {
  const url = new URL(window.location.href);
  url.searchParams.delete('creature');
  url.searchParams.set('beast', creatureId);
  if (buildId) url.searchParams.set('build', buildId);
  else url.searchParams.delete('build');
  return url.toString();
}

function copyCreatureLink() {
  if (!selectedCreature) return;
  navigator.clipboard.writeText(creatureLink(selectedCreature.id)).then(
    () => showToast('Đã copy link linh thú.'),
    () => showToast('Không thể copy link.', 'error')
  );
}

function copyBuild(build) {
  const lines = [
    `POCKET CHAMPION - ${build.name}`,
    `Link linh thú: ${creatureLink(build.creature?.id || selectedCreature?.id, build.id)}`,
    `Người build: ${builderLabel(build)}`,
    `Vai trò: ${build.role || 'Khác'}`,
    `Tính cách (Nature): ${build.nature || 'Chưa nhập'}`,
    `Vật phẩm (Item): ${build.item || 'Chưa nhập'}`,
    `Nội tại (Ability): ${build.passive || 'Chưa nhập'}`,
    'Kỹ năng (Skills):',
    ...skillSlots(build.skills).map((skill, index) => `${index + 1}. ${skill.name || 'Chưa nhập'}`),
    `Berry / Chỉ số 510 điểm: ${STAT_KEYS.map(key => `${STAT_LABELS[key]} ${build.stats?.[key] || 0}`).join(' / ')}`,
    `Ghi chú (Notes): ${build.notes || 'Không có'}`
  ];
  navigator.clipboard.writeText(lines.join('\n')).then(
    () => showToast('Đã copy build.'),
    () => showToast('Không thể copy build.', 'error')
  );
}

async function exportBuilds() {
  if (!isAdmin()) return showToast('Chỉ admin được sao lưu toàn bộ dữ liệu.', 'error');
  try {
    const data = await api('/api/beasts/backup/export');
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pocket-champion-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Đã tải backup: ${data.counts?.creatures || 0} linh thú, ${data.counts?.builds || 0} build, ${data.counts?.teamGuides || 0} ảnh đội hình.`);
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function importBuilds(event) {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file) return;
  if (!isAdmin()) return showToast('Chỉ admin được khôi phục backup.', 'error');
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    const clearExisting = confirm(`Bạn muốn XÓA dữ liệu linh thú/build hiện tại rồi khôi phục từ file này không?

OK = xóa dữ liệu hiện tại rồi khôi phục.
Cancel = nhập chồng/cập nhật, không xóa dữ liệu cũ.`);
    const body = { backup: data, clearExisting };
    if (clearExisting) body.confirmText = 'KHOI PHUC';
    const result = await api('/api/beasts/backup/import', {
      method: 'POST',
      body
    });
    showToast(result.message || `Khôi phục xong, lỗi ${result.errors?.length || 0}.`);
    if (result.errors?.length) console.warn(result.errors);
    await Promise.all([loadRoles(), loadMods(), loadCreatures()]);
    if (selectedCreature) await selectCreature(selectedCreature.id, selectedBuildId);
    else renderDetail();
  } catch (error) {
    showToast(error.message || 'File backup JSON không hợp lệ.', 'error');
  }
}


async function openCreatureLogsDialog() {
  if (!isAdmin()) return showToast('Chỉ admin được xem thông báo thêm Pokémon.', 'error');
  await loadCreatureLogs();
  el.creatureLogsDialog.showModal();
}

async function loadCreatureLogs() {
  if (!isAdmin()) return;
  try {
    const data = await api('/api/creatures/additions?limit=300');
    renderCreatureLogs(data.logs || [], data.total || 0);
  } catch (error) {
    showToast(error.message || 'Không thể tải thông báo thêm Pokémon.', 'error');
  }
}

function renderCreatureLogs(items = [], total = items.length) {
  if (!el.creatureLogsTable) return;
  if (el.creatureLogsSummary) {
    el.creatureLogsSummary.textContent = `Có ${Number(total || items.length)} thông báo thêm Pokémon/linh thú`;
  }

  if (!items.length) {
    el.creatureLogsTable.innerHTML = '<tr><td colspan="7">Chưa có Pokémon/linh thú nào do mod/admin tự thêm.</td></tr>';
    return;
  }

  el.creatureLogsTable.innerHTML = items.map((item, index) => {
    const user = item.createdBy || {};
    const role = roleMeta(user.role || 'user');
    return `
      <tr>
        <td class="stt-cell">${index + 1}</td>
        <td>
          <strong>${escapeHtml(item.name)}</strong>
          <div class="tiny-note">${escapeHtml(item.source || 'custom')}${item.generation ? ` · Gen ${Number(item.generation)}` : ''}</div>
        </td>
        <td>
          <div class="log-user-cell">
            ${avatarHtml(user, 'avatar-sm')}
            <span>${roleNameHtml(user, 'Không rõ')}</span>
          </div>
        </td>
        <td><span class="badge"><span class="role-logo">${escapeHtml(role.logo || '🏷️')}</span> ${escapeHtml(role.name || role.key || 'user')}</span></td>
        <td><span class="badge">${Number(item.buildCount || 0)} build</span></td>
        <td>${formatDate(item.createdAt)}</td>
        <td><button class="ghost small open-creature-log" data-id="${escapeAttr(item.id)}" type="button">Mở</button></td>
      </tr>
    `;
  }).join('');

  el.creatureLogsTable.querySelectorAll('.open-creature-log').forEach(button => {
    button.addEventListener('click', async () => {
      el.creatureLogsDialog.close();
      await selectCreature(button.dataset.id);
    });
  });
}

async function openCreaturesDialog() {
  if (!canManageCreatureNames()) return showToast('Chỉ mod và admin được thêm tên linh thú.', 'error');
  updateCreaturesDialogPermissions();
  await loadCreaturesForAdmin();
  el.creaturesDialog.showModal();
}

function updateCreaturesDialogPermissions() {
  if (el.bulkCreatureForm) el.bulkCreatureForm.classList.toggle('hidden', !canManageCreatureNames());
  if (el.btnSeedPokemon) el.btnSeedPokemon.classList.toggle('hidden', !canAdminCreatureNames());
  if (el.btnDeleteAllCreatures) el.btnDeleteAllCreatures.classList.toggle('hidden', !canAdminCreatureNames());
  const title = document.querySelector('#creaturesDialog .eyebrow');
  if (title) title.textContent = canAdminCreatureNames() ? 'Admin / Mod' : 'Mod';
}

async function loadCreaturesForAdmin() {
  const data = await api('/api/creatures?limit=3000');
  renderCreaturesTable(data.creatures || [], data.total || 0);
}

function renderCreaturesTable(items, total = items.length) {
  const admin = canAdminCreatureNames();
  if (el.creatureAdminSummary) {
    const buildTotal = items.reduce((sum, item) => sum + Number(item.buildCount || 0), 0);
    el.creatureAdminSummary.textContent = `Tổng: ${Number(total || items.length)} linh thú · ${buildTotal} build trong bảng`;
  }

  if (!items.length) {
    el.creaturesTable.innerHTML = '<tr><td colspan="7">Chưa có tên linh thú.</td></tr>';
    return;
  }
  el.creaturesTable.innerHTML = items.map((item, index) => `
    <tr>
      <td class="stt-cell">${index + 1}</td>
      <td><input class="creature-name-input" data-id="${escapeAttr(item.id)}" value="${escapeAttr(item.name)}" ${admin ? '' : 'readonly'} /></td>
      <td>${item.generation ? `<span class="badge">Gen ${Number(item.generation)}</span>` : '<span class="muted">-</span>'}</td>
      <td><span class="badge">${Number(item.suggestedSkillCount || 0)} skill</span></td>
      <td><span class="badge">${Number(item.buildCount || 0)} build</span></td>
      <td>${formatDate(item.updatedAt || item.createdAt)}</td>
      <td class="table-actions">
        ${admin ? `<button class="ghost small save-creature" data-id="${escapeAttr(item.id)}" type="button">Lưu tên</button>` : ''}
        <button class="ghost small open-creature" data-id="${escapeAttr(item.id)}" type="button">Mở</button>
        ${admin ? `<button class="danger ghost small delete-creature" data-id="${escapeAttr(item.id)}" ${Number(item.buildCount || 0) > 0 ? 'disabled' : ''} type="button">Xóa</button>` : ''}
      </td>
    </tr>
  `).join('');

  el.creaturesTable.querySelectorAll('.save-creature').forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.dataset.id;
      const name = [...el.creaturesTable.querySelectorAll('.creature-name-input')].find(input => input.dataset.id === id)?.value || '';
      await updateCreatureName(id, name);
    });
  });
  el.creaturesTable.querySelectorAll('.open-creature').forEach(button => {
    button.addEventListener('click', async () => {
      el.creaturesDialog.close();
      await selectCreature(button.dataset.id);
    });
  });
  el.creaturesTable.querySelectorAll('.delete-creature').forEach(button => {
    button.addEventListener('click', async () => {
      if (!confirm('Xóa tên linh thú này? Chỉ xóa được khi chưa có build.')) return;
      await deleteCreature(button.dataset.id);
    });
  });
}


async function seedPokemonCatalog() {
  if (!isAdmin()) return showToast('Chỉ admin được nhập sẵn Pokémon.', 'error');
  if (!confirm('Nhập sẵn 568 Pokémon tiến hóa cuối Gen 1-9 kèm danh sách skill? Tên trùng sẽ được cập nhật skill, build cũ vẫn giữ nguyên. Các tên Pokémon cũ chưa có build sẽ được dọn khỏi danh sách.')) return;
  try {
    const result = await api('/api/creatures/seed-pokemon', { method: 'POST', body: {} });
    showToast(result.message || 'Đã nhập sẵn Pokémon tiến hóa cuối.');
    await Promise.all([loadCreatures(), loadCreaturesForAdmin()]);
  } catch (error) {
    showToast(error.message || 'Không thể nhập sẵn Pokémon.', 'error');
  }
}

async function createCreature() {
  try {
    await api('/api/creatures', { method: 'POST', body: { name: el.newCreatureName.value } });
    el.createCreatureForm.reset();
    showToast('Đã thêm tên linh thú.');
    await Promise.all([loadCreatures(), loadCreaturesForAdmin()]);
    if (el.creatureLogsDialog?.open) await loadCreatureLogs();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function bulkCreateCreatures() {
  try {
    const result = await api('/api/creatures/bulk', { method: 'POST', body: { names: el.bulkCreatureNames.value } });
    el.bulkCreatureForm.reset();
    showToast(result.message || 'Đã nhập danh sách linh thú.');
    await Promise.all([loadCreatures(), loadCreaturesForAdmin()]);
    if (el.creatureLogsDialog?.open) await loadCreatureLogs();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function updateCreatureName(id, name) {
  try {
    const result = await api(`/api/creatures/${id}`, { method: 'PATCH', body: { name } });
    showToast(result.message || 'Đã đổi tên linh thú.');
    await Promise.all([loadCreatures(), loadCreaturesForAdmin()]);
    if (selectedCreature?.id === id) await selectCreature(id, selectedBuildId);
  } catch (error) {
    showToast(error.message, 'error');
    await loadCreaturesForAdmin();
  }
}

async function deleteCreature(id) {
  try {
    await api(`/api/creatures/${id}`, { method: 'DELETE' });
    showToast('Đã xóa tên linh thú.');
    await Promise.all([loadCreatures(), loadCreaturesForAdmin()]);
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function deleteAllCreatures() {
  if (!isAdmin()) return;
  const firstConfirm = confirm('CẢNH BÁO: thao tác này sẽ xóa TẤT CẢ tên linh thú và TẤT CẢ bài build. Không thể hoàn tác. Bạn chắc chắn muốn tiếp tục?');
  if (!firstConfirm) return;

  const confirmText = prompt('Nhập chính xác XOA TAT CA để xác nhận xóa toàn bộ linh thú và build:');
  if (String(confirmText || '').trim().toUpperCase() !== 'XOA TAT CA') {
    return showToast('Đã hủy xóa tất cả.', 'error');
  }

  try {
    const result = await api('/api/creatures/all', { method: 'DELETE', body: { confirmText: 'XOA TAT CA' } });
    selectedCreature = null;
    selectedBuilder = null;
    selectedBuilds = [];
    selectedBuildId = '';
    showToast(result.message || 'Đã xóa tất cả linh thú.');
    await Promise.all([loadRoles(), loadMods(), loadCreatures(), loadCreaturesForAdmin()]);
    renderDetail();
  } catch (error) {
    showToast(error.message, 'error');
  }
}


async function openUsersDialog() {
  if (!isAdmin()) return;
  await loadRoleSettings();
  await loadUsers();
  renderRoleSettingsTable();
  renderRoleSelectOptions();
  el.usersDialog.showModal();
}

async function loadUsers() {
  const data = await api('/api/users');
  renderUsers(data.users || []);
}

function renderUsers(users) {
  el.usersTable.innerHTML = users.map(user => `
    <tr>
      <td>${avatarHtml(user, 'avatar-xs')}</td>
      <td><strong>${escapeHtml(user.username)}</strong></td>
      <td><input class="display-name-input" data-id="${escapeAttr(user.id)}" value="${escapeAttr(user.displayName || '')}" placeholder="Tên hiển thị" /></td>
      <td><input class="game-name-input" data-id="${escapeAttr(user.id)}" value="${escapeAttr(user.gameName || '')}" placeholder="Tên trong game" /></td>
      <td>
        <select class="role-select" data-id="${escapeAttr(user.id)}" ${user.id === currentUser.id ? 'disabled' : ''}>
          ${roleOptionsHtml(user.role)}
        </select>
      </td>
      <td>${formatDate(user.createdAt)}</td>
      <td class="table-actions">
        <button class="ghost small save-profile" data-id="${escapeAttr(user.id)}" type="button">Lưu tên</button>
        <button class="ghost small reset-password" data-id="${escapeAttr(user.id)}" data-name="${escapeAttr(user.username)}" type="button">Reset mật khẩu</button>
        <button class="danger ghost small delete-user" data-id="${escapeAttr(user.id)}" ${user.id === currentUser.id ? 'disabled' : ''} type="button">Xóa</button>
      </td>
    </tr>
  `).join('');

  el.usersTable.querySelectorAll('.role-select').forEach(select => {
    select.addEventListener('change', async () => {
      await updateUserRole(select.dataset.id, select.value);
    });
  });

  el.usersTable.querySelectorAll('.save-profile').forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.dataset.id;
      const displayName = [...el.usersTable.querySelectorAll('.display-name-input')].find(input => input.dataset.id === id)?.value || '';
      const gameName = [...el.usersTable.querySelectorAll('.game-name-input')].find(input => input.dataset.id === id)?.value || '';
      await updateUserProfile(id, displayName, gameName);
    });
  });

  el.usersTable.querySelectorAll('.reset-password').forEach(button => {
    button.addEventListener('click', async () => {
      const password = prompt(`Nhập mật khẩu mới cho ${button.dataset.name} (6–32 ký tự):`);
      if (!password) return;
      if (password.length < 6 || password.length > 32) {
        return showToast('Mật khẩu cần dài 6–32 ký tự.', 'error');
      }
      await resetUserPassword(button.dataset.id, password);
    });
  });

  el.usersTable.querySelectorAll('.delete-user').forEach(button => {
    button.addEventListener('click', async () => {
      if (!confirm('Xóa tài khoản này?')) return;
      await deleteUser(button.dataset.id);
    });
  });
}


function roleOptionsHtml(selectedRole = 'user') {
  const defs = roleDefinitions.length ? roleDefinitions : defaultRoleDefinitions();
  return defs.map(role => `<option value="${escapeAttr(role.key)}" ${role.key === selectedRole ? 'selected' : ''}>${escapeHtml((role.logo || '') + ' ' + (role.name || role.key))}</option>`).join('');
}

function renderRoleSettingsTable() {
  if (!el.roleSettingsTable) return;
  const defs = roleDefinitions.length ? roleDefinitions : defaultRoleDefinitions();
  el.roleSettingsTable.innerHTML = defs.map(role => `
    <div class="role-setting-row" data-key="${escapeAttr(role.key)}">
      <div class="role-preview-box">
        ${roleBadgeHtml(role.key)}
        <small>key: ${escapeHtml(role.key)} · quyền nền: ${escapeHtml(role.baseRole)}</small>
      </div>
      <div class="role-setting-actions">
        <button class="ghost small edit-role" data-key="${escapeAttr(role.key)}" type="button">Sửa</button>
        ${role.locked ? '' : `<button class="danger ghost small delete-role" data-key="${escapeAttr(role.key)}" type="button">Xóa</button>`}
      </div>
    </div>
  `).join('');

  el.roleSettingsTable.querySelectorAll('.edit-role').forEach(button => {
    button.addEventListener('click', () => fillRoleForm(button.dataset.key));
  });
  el.roleSettingsTable.querySelectorAll('.delete-role').forEach(button => {
    button.addEventListener('click', async () => {
      if (!confirm('Xóa role custom này? Tài khoản đang dùng role này sẽ mất style/quyền custom sau khi đổi role.')) return;
      roleDefinitions = roleDefinitions.filter(role => role.key !== button.dataset.key);
      await saveRoleDefinitions(roleDefinitions);
    });
  });
}

function fillRoleForm(key) {
  const role = roleMeta(key);
  if (!role) return;
  el.roleKey.value = role.key;
  el.roleName.value = role.name || role.key;
  el.roleLogo.value = role.logo || '';
  el.roleColor.value = /^#[0-9a-f]{6}$/i.test(role.color || '') ? role.color : '#38bdf8';
  el.roleBase.value = role.baseRole || 'user';
  el.roleBase.disabled = Boolean(role.locked);
  el.roleName.focus();
}

function clearRoleForm() {
  el.roleKey.value = '';
  el.roleName.value = '';
  el.roleLogo.value = '';
  el.roleColor.value = '#38bdf8';
  el.roleBase.value = 'cameo';
  el.roleBase.disabled = false;
}

function roleKeyFromFormName(name) {
  return 'custom_' + normalizeRoleKeyClient(name).replace(/^custom_/, '');
}

async function saveRoleSettingFromForm() {
  if (!isAdmin()) return showToast('Chỉ admin được sửa role.', 'error');
  const existingKey = el.roleKey.value || '';
  const key = existingKey || roleKeyFromFormName(el.roleName.value);
  if (!normalizeRoleKeyClient(key)) return showToast('Tên role không hợp lệ.', 'error');
  const current = roleDefinitions.find(role => role.key === key);
  const role = {
    key,
    name: el.roleName.value.trim() || key,
    logo: el.roleLogo.value.trim() || '🏷️',
    color: el.roleColor.value || '#38bdf8',
    baseRole: current?.locked ? current.baseRole : el.roleBase.value,
    locked: Boolean(current?.locked)
  };
  const next = roleDefinitions.filter(item => item.key !== key).concat(role);
  await saveRoleDefinitions(next);
  clearRoleForm();
}

async function saveRoleDefinitions(nextRoles) {
  try {
    const result = await api('/api/settings/roles', { method: 'PUT', body: { roles: nextRoles } });
    roleDefinitions = result.roles || roleDefinitions;
    renderRoleSelectOptions();
    renderRoleSettingsTable();
    await Promise.all([loadUsers(), loadMods()]);
    updatePermissionUI();
    showToast(result.message || 'Đã lưu role.');
  } catch (error) {
    showToast(error.message || 'Không thể lưu role.', 'error');
  }
}

async function createUser() {
  try {
    if (el.newPassword.value !== el.newConfirmPassword.value) {
      showToast('Hai lần nhập mật khẩu không khớp.', 'error');
      el.newConfirmPassword.focus();
      return;
    }
    await api('/api/users', {
      method: 'POST',
      body: {
        displayName: el.newDisplayName.value,
        gameName: el.newGameName.value,
        username: el.newUsername.value,
        password: el.newPassword.value,
        confirmPassword: el.newConfirmPassword.value,
        role: el.newRole.value
      }
    });
    el.createUserForm.reset();
    showToast('Đã tạo tài khoản.');
    await Promise.all([loadUsers(), loadMods()]);
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function updateUserProfile(id, displayName, gameName) {
  try {
    await api(`/api/users/${id}/profile`, { method: 'PATCH', body: { displayName, gameName } });
    showToast('Đã cập nhật tên.');
    await Promise.all([loadUsers(), loadMods()]);
    if (selectedCreature) await selectCreature(selectedCreature.id, selectedBuildId, false);
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function updateUserRole(id, role) {
  try {
    await api(`/api/users/${id}/role`, { method: 'PATCH', body: { role } });
    showToast('Đã đổi quyền tài khoản.');
    await Promise.all([loadUsers(), loadMods()]);
    if (selectedCreature) await selectCreature(selectedCreature.id, selectedBuildId, false);
  } catch (error) {
    showToast(error.message, 'error');
    await loadUsers();
  }
}

async function resetUserPassword(id, password) {
  try {
    await api(`/api/users/${id}/password`, { method: 'PATCH', body: { password } });
    showToast('Đã đặt lại mật khẩu.');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function deleteUser(id) {
  try {
    await api(`/api/users/${id}`, { method: 'DELETE' });
    showToast('Đã xóa tài khoản.');
    await Promise.all([loadUsers(), loadMods(), loadCreatures()]);
    if (selectedCreature) await selectCreature(selectedCreature.id, selectedBuildId, false);
  } catch (error) {
    showToast(error.message, 'error');
  }
}


async function apiPublic(path, options = {}) {
  const response = await fetch(path, {
    method: options.method || 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) throw new Error(data.message || 'Có lỗi xảy ra.');
  return data;
}

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(path, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    if (response.status === 401) logout(false);
    throw new Error(data.message || 'Có lỗi xảy ra.');
  }
  return data;
}

function showFormError(message) {
  el.formError.textContent = message;
  el.formError.classList.remove('hidden');
}

function clearFormError() {
  el.formError.textContent = '';
  el.formError.classList.add('hidden');
}

function showToast(message, type = 'success') {
  el.toast.textContent = message;
  el.toast.className = `toast ${type}`;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => el.toast.classList.add('hidden'), 3200);
}

function initialsForAvatar(user, fallback = '?') {
  const label = user?.gameName || user?.displayName || user?.username || fallback;
  const words = String(label).trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function avatarHtml(user, className = 'avatar-sm') {
  const src = user?.avatarData && isSafeAvatarDataUrl(user.avatarData) ? user.avatarData : '';
  const label = user?.gameName || user?.displayName || user?.username || 'avatar';
  if (src) {
    return `<span class="avatar ${className}"><img src="${escapeAttr(src)}" alt="Avatar ${escapeAttr(label)}" loading="lazy" /></span>`;
  }
  return `<span class="avatar ${className}" aria-label="Avatar ${escapeAttr(label)}">${escapeHtml(initialsForAvatar(user, '?'))}</span>`;
}

function renderAvatar(target, user) {
  if (!target) return;
  target.outerHTML = avatarHtml(user, 'avatar-sm');
  el.currentUserAvatar = document.querySelector('#currentUserMini .avatar');
}

function isSafeAvatarDataUrl(value = '') {
  return /^data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+/=]+$/i.test(String(value));
}

async function handleAvatarUpload(event) {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file) return;
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    return showToast('Avatar chỉ nhận ảnh PNG, JPG hoặc WebP.', 'error');
  }
  if (file.size > MAX_AVATAR_SOURCE_BYTES) {
    return showToast('Ảnh gốc tối đa 2MB. Hãy chọn ảnh nhỏ hơn.', 'error');
  }

  try {
    const avatarData = await resizeAvatarFile(file);
    const data = await api('/api/auth/me/avatar', {
      method: 'PATCH',
      body: { avatarData }
    });
    currentUser = data.user;
    updatePermissionUI();
    await Promise.all([loadMods(), selectedCreature ? selectCreature(selectedCreature.id, selectedBuildId, false) : Promise.resolve()]);
    showToast('Đã cập nhật avatar.');
  } catch (error) {
    showToast(error.message || 'Không thể cập nhật avatar.', 'error');
  }
}

async function clearAvatar() {
  if (!currentUser?.avatarData) return;
  if (!confirm('Xóa avatar hiện tại?')) return;
  try {
    const data = await api('/api/auth/me/avatar', {
      method: 'PATCH',
      body: { avatarData: '' }
    });
    currentUser = data.user;
    updatePermissionUI();
    await Promise.all([loadMods(), selectedCreature ? selectCreature(selectedCreature.id, selectedBuildId, false) : Promise.resolve()]);
    showToast('Đã xóa avatar.');
  } catch (error) {
    showToast(error.message || 'Không thể xóa avatar.', 'error');
  }
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Không đọc được ảnh avatar.'));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Không thể nén ảnh avatar.')), type, quality);
  });
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Không thể đọc ảnh đã nén.'));
    reader.readAsDataURL(blob);
  });
}

async function resizeSquareImageFile(file, size, maxBytes, label = 'Ảnh') {
  const img = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, size, size);
  const side = Math.min(img.naturalWidth || img.width, img.naturalHeight || img.height);
  const sx = ((img.naturalWidth || img.width) - side) / 2;
  const sy = ((img.naturalHeight || img.height) - side) / 2;
  ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);

  for (const quality of [0.88, 0.8, 0.72, 0.64, 0.56, 0.48]) {
    const blob = await canvasToBlob(canvas, 'image/jpeg', quality);
    if (blob.size <= maxBytes) {
      return blobToDataUrl(blob);
    }
  }

  throw new Error(`${label} vẫn quá lớn sau khi nén. Hãy chọn ảnh đơn giản hơn.`);
}

async function resizeImageFitFile(file, maxWidth, maxHeight, maxBytes, label = 'Ảnh') {
  const img = await loadImageFromFile(file);
  const sourceWidth = img.naturalWidth || img.width;
  const sourceHeight = img.naturalHeight || img.height;
  const ratio = Math.min(1, maxWidth / sourceWidth, maxHeight / sourceHeight);
  const width = Math.max(1, Math.round(sourceWidth * ratio));
  const height = Math.max(1, Math.round(sourceHeight * ratio));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  for (const quality of [0.9, 0.82, 0.74, 0.66, 0.58, 0.5, 0.42, 0.35]) {
    const blob = await canvasToBlob(canvas, 'image/jpeg', quality);
    if (blob.size <= maxBytes) {
      return blobToDataUrl(blob);
    }
  }

  throw new Error(`${label} vẫn quá lớn sau khi nén. Hãy chọn ảnh nhỏ hoặc ít chi tiết hơn.`);
}


async function resizeAvatarFile(file) {
  return resizeSquareImageFile(file, AVATAR_SIZE, MAX_AVATAR_OUTPUT_BYTES, 'Ảnh avatar');
}

function roleLabel(role) {
  return roleMeta(role).name || role || 'user - chỉ xem';
}

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('vi-VN');
}

function debounce(fn, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeAttr(value = '') {
  return escapeHtml(value).replaceAll('`', '&#096;');
}
