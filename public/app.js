const MAX_TOTAL_STATS = 510;
const STAT_KEYS = ['hp', 'atk', 'satk', 'def', 'sdef', 'spe'];
const STAT_LABELS = {
  hp: 'HP',
  atk: 'ATK',
  satk: 'SATK',
  def: 'DEF',
  sdef: 'SDEF',
  spe: 'SPE'
};
const TOKEN_KEY = 'pc_linhthu_token_v4';
const MAX_AVATAR_SOURCE_BYTES = 2 * 1024 * 1024;
const MAX_AVATAR_OUTPUT_BYTES = 40 * 1024;
const AVATAR_SIZE = 128;

let token = localStorage.getItem(TOKEN_KEY) || '';
let currentUser = null;
let creatures = [];
let selectedCreature = null;
let selectedBuilds = [];
let selectedBuildId = null;
let roles = [];
let modList = [];

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
  userBadge: document.querySelector('#userBadge'),
  currentUserAvatar: document.querySelector('#currentUserAvatar'),
  avatarLabel: document.querySelector('#avatarLabel'),
  avatarInput: document.querySelector('#avatarInput'),
  btnClearAvatar: document.querySelector('#btnClearAvatar'),
  btnUsers: document.querySelector('#btnUsers'),
  btnCreatures: document.querySelector('#btnCreatures'),
  btnExport: document.querySelector('#btnExport'),
  importLabel: document.querySelector('#importLabel'),
  importFile: document.querySelector('#importFile'),
  btnLogout: document.querySelector('#btnLogout'),
  searchInput: document.querySelector('#searchInput'),
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
  element: document.querySelector('#element'),
  nature: document.querySelector('#nature'),
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
  newRole: document.querySelector('#newRole'),
  usersTable: document.querySelector('#usersTable'),
  creaturesDialog: document.querySelector('#creaturesDialog'),
  btnCloseCreatures: document.querySelector('#btnCloseCreatures'),
  createCreatureForm: document.querySelector('#createCreatureForm'),
  newCreatureName: document.querySelector('#newCreatureName'),
  bulkCreatureForm: document.querySelector('#bulkCreatureForm'),
  bulkCreatureNames: document.querySelector('#bulkCreatureNames'),
  creaturesTable: document.querySelector('#creaturesTable')
};

init();

function init() {
  wireEvents();
  renderOfficialLinks();
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
  el.avatarInput.addEventListener('change', handleAvatarUpload);
  el.btnClearAvatar.addEventListener('click', clearAvatar);
  el.btnExport.addEventListener('click', exportBuilds);
  el.importFile.addEventListener('change', importBuilds);
  el.searchInput.addEventListener('input', debounce(loadCreatures, 250));
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
    const data = await api('/api/auth/register', {
      method: 'POST',
      body: {
        displayName: el.registerDisplayName.value,
        username: el.registerUsername.value,
        password: el.registerPassword.value
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

function logout(showMessage = true) {
  token = '';
  currentUser = null;
  creatures = [];
  selectedCreature = null;
  selectedBuilds = [];
  selectedBuildId = null;
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
  return currentUser && ['mod', 'admin'].includes(currentUser.role);
}

function canEditBuild(build) {
  return build && build.canEdit;
}

function isAdmin() {
  return currentUser?.role === 'admin';
}

function builderProfile(build) {
  return build?.createdBy || { username: 'unknown', displayName: '', gameName: '' };
}

function builderLabel(build) {
  const builder = builderProfile(build);
  return builder.label || builder.gameName || builder.displayName || builder.username || 'Không rõ';
}

function getOfficialLinks() {
  return Array.isArray(window.POCKET_CHAMPION_LINKS) ? window.POCKET_CHAMPION_LINKS : [];
}

function isUsableExternalUrl(url = '') {
  return /^https?:\/\//i.test(String(url || '').trim());
}

function renderOfficialLinks() {
  const containers = document.querySelectorAll('[data-official-links]');
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

function updatePermissionUI() {
  const badgeText = `${currentUser.displayName || currentUser.username} · ${roleLabel(currentUser.role)}`;
  el.userBadge.textContent = badgeText;
  renderAvatar(el.currentUserAvatar, currentUser);
  el.btnUsers.classList.toggle('hidden', !isAdmin());
  el.btnCreatures.classList.toggle('hidden', !isAdmin());
  el.importLabel.classList.toggle('hidden', !canCreateBuild());
  el.avatarLabel.classList.toggle('hidden', !['mod', 'admin'].includes(currentUser.role));
  el.btnClearAvatar.classList.toggle('hidden', !['mod', 'admin'].includes(currentUser.role) || !currentUser.avatarData);
}

async function loadAll() {
  await Promise.all([loadRoles(), loadMods(), loadCreatures()]);
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

function renderModList() {
  if (!modList.length) {
    el.modList.innerHTML = '<p class="muted">Chưa có mod nào.</p>';
    return;
  }
  el.modList.innerHTML = modList.map(mod => `
    <div class="mod-item">
      ${avatarHtml(mod, 'avatar-xs')}
      <div>
        <strong>${escapeHtml(mod.gameName || mod.displayName || mod.username)}</strong>
        <span>${escapeHtml(roleLabel(mod.role))}</span>
      </div>
      <span class="badge">${Number(mod.buildCount || 0)} build</span>
    </div>
  `).join('');
}

function renderRoleFilter() {
  el.roleFilter.innerHTML = '<option value="">Tất cả vai trò build</option>' + roles
    .map(role => `<option value="${escapeAttr(role)}">${escapeHtml(role)}</option>`)
    .join('');
}

async function loadCreatures() {
  try {
    const params = new URLSearchParams();
    if (el.searchInput.value.trim()) params.set('search', el.searchInput.value.trim());
    const data = await api(`/api/creatures?${params.toString()}`);
    creatures = data.creatures || [];
    renderList();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function renderList() {
  if (!creatures.length) {
    el.petList.innerHTML = isAdmin()
      ? '<p class="muted">Chưa có tên linh thú. Bấm “Quản lý tên linh thú” để thêm.</p>'
      : '<p class="muted">Không tìm thấy tên linh thú. Hãy báo admin thêm tên trước.</p>';
    return;
  }

  el.petList.innerHTML = creatures.map(creature => `
    <button class="pet-card ${selectedCreature?.id === creature.id ? 'active' : ''}" data-id="${escapeAttr(creature.id)}" type="button">
      <div>
        <h3>${escapeHtml(creature.name)}</h3>
        <div class="pet-meta">
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
    selectedBuilds = [];
    selectedBuildId = null;
    renderList();
    renderDetail();
  }
}

async function selectCreature(creatureId, buildId = '', updateUrl = true) {
  try {
    const data = await api(`/api/creatures/${encodeURIComponent(creatureId)}`);
    selectedCreature = data.creature;
    selectedBuilds = data.builds || [];
    selectedBuildId = buildId && selectedBuilds.some(build => build.id === buildId) ? buildId : '';

    if (!creatures.some(item => item.id === selectedCreature.id)) {
      creatures = [selectedCreature, ...creatures];
    } else {
      creatures = creatures.map(item => item.id === selectedCreature.id ? selectedCreature : item);
    }

    if (updateUrl) setRoute(selectedCreature.id, selectedBuildId);
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

function renderDetail() {
  if (!selectedCreature) {
    el.emptyState.classList.remove('hidden');
    el.detailView.classList.add('hidden');
    el.detailView.innerHTML = '';
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
          <span class="badge strong-badge">${Number(selectedCreature.buildCount || selectedBuilds.length || 0)} build</span>
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
        <h3>Các bài build của mod/admin</h3>
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
}

function buildCardHtml(build) {
  const builder = builderProfile(build);
  return `
    <button class="build-card ${selectedBuildId === build.id ? 'active' : ''}" data-id="${escapeAttr(build.id)}" type="button">
      <div class="build-card-main">
        ${avatarHtml(builder, 'avatar-sm')}
        <div>
          <h4>${escapeHtml(builderLabel(build))}</h4>
          <p>${escapeHtml(build.role || 'Khác')} · ${escapeHtml(build.nature || 'Chưa nhập Nature')}</p>
        </div>
      </div>
      <div class="build-card-side">
        <span class="badge">Berry ${Number(build.statTotal || 0)}/510</span>
        <small>${formatDate(build.updatedAt)}</small>
      </div>
    </button>
  `;
}

function sixSkillSlots(skills = []) {
  const cleaned = Array.isArray(skills) ? skills : [];
  return Array.from({ length: 6 }, (_, index) => cleaned[index] || { name: '', desc: '' });
}

function buildDetailHtml(build) {
  return `
    <div class="detail-head build-head">
      <div>
        <p class="eyebrow">Bài build</p>
        <h2>${escapeHtml(build.name)}</h2>
        <div class="pet-meta">
          <span class="badge strong-badge builder-badge">${avatarHtml(builderProfile(build), 'avatar-xs')} Người build: ${escapeHtml(builderLabel(build))}</span>
          <span class="badge">${escapeHtml(build.role || 'Khác')}</span>
          <span class="badge">Berry ${Number(build.statTotal || 0)}/510</span>
        </div>
      </div>
      <div class="detail-actions">
        <button id="btnCopyBuild" class="ghost" type="button">Copy build</button>
        ${canEditBuild(build) ? '<button id="btnEditBuild" class="primary" type="button">Sửa build</button>' : ''}
      </div>
    </div>

    <div class="info-grid">
      <div class="info-box"><span>Hệ / thuộc tính (Element)</span><strong>${escapeHtml(build.element || 'Chưa nhập')}</strong></div>
      <div class="info-box"><span>Tính cách (Nature)</span><strong>${escapeHtml(build.nature || 'Chưa nhập')}</strong></div>
      <div class="info-box builder-info"><span>Người build</span><strong>${avatarHtml(builderProfile(build), 'avatar-sm')} ${escapeHtml(builderLabel(build))}</strong></div>
      <div class="info-box"><span>Cập nhật</span><strong>${formatDate(build.updatedAt)}</strong></div>
    </div>

    <section class="content-section">
      <h3>Nội tại (Ability)</h3>
      <p>${escapeHtml(build.passive || 'Chưa nhập Ability.').replace(/\n/g, '<br>')}</p>
    </section>

    <section class="content-section">
      <h3>Kỹ năng (Skills)</h3>
      <div class="skill-list">
        ${sixSkillSlots(build.skills).map((skill, index) => {
          const hasContent = Boolean((skill.name || '').trim() || (skill.desc || '').trim());
          return `
            <div class="skill-card ${hasContent ? '' : 'empty'}">
              <span>${index + 1}</span>
              <div><strong>${escapeHtml(skill.name || `Skill ${index + 1}`)}</strong><p>${escapeHtml(skill.desc || 'Chưa nhập.').replace(/\n/g, '<br>')}</p></div>
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
  const percent = Math.min(100, Math.round((Number(value || 0) / MAX_TOTAL_STATS) * 100));
  return `
    <div class="stat-row">
      <div><strong>${STAT_LABELS[key]}</strong><span>${Number(value || 0)}</span></div>
      <div class="bar small"><span style="width:${percent}%"></span></div>
    </div>
  `;
}

function openBuildDialog(build = null) {
  if (!canCreateBuild()) return showToast('Bạn không có quyền build linh thú.', 'error');
  if (build && !canEditBuild(build)) return showToast('Mod chỉ được sửa build do chính mình tạo.', 'error');
  if (!selectedCreature && !build?.creature) return showToast('Hãy chọn linh thú trước khi build.', 'error');

  clearFormError();
  el.form.reset();
  el.skillsWrap.innerHTML = '';

  const creature = build?.creature || selectedCreature;
  el.petId.value = build?.id || '';
  el.creatureId.value = creature?.id || selectedCreature?.id || '';
  el.name.value = creature?.name || selectedCreature?.name || build?.name || '';

  if (build) {
    el.dialogTitle.textContent = 'Sửa build linh thú';
    el.role.value = build.role || '';
    el.element.value = build.element || '';
    el.nature.value = build.nature || '';
    el.passive.value = build.passive || '';
    el.notes.value = build.notes || '';
    STAT_KEYS.forEach(key => { el[key].value = build.stats?.[key] || 0; });
    sixSkillSlots(build.skills).forEach((skill, index) => addSkillRow(skill, index));
    el.btnDelete.classList.toggle('hidden', !build.canDelete);
  } else {
    el.dialogTitle.textContent = `Build ${selectedCreature.name}`;
    STAT_KEYS.forEach(key => { el[key].value = 0; });
    sixSkillSlots().forEach((skill, index) => addSkillRow(skill, index));
    el.btnDelete.classList.add('hidden');
  }

  while (el.skillsWrap.children.length < 6) addSkillRow({ name: '', desc: '' }, el.skillsWrap.children.length);
  updateStatPreview();
  el.dialog.showModal();
}

function addSkillRow(skill = { name: '', desc: '' }, index = el.skillsWrap.children.length) {
  if (el.skillsWrap.children.length >= 6) return;
  const slotNumber = Number(index) + 1;
  const row = document.createElement('div');
  row.className = 'skill-row fixed-skill-row';
  row.innerHTML = `
    <span class="skill-slot-label">Skill ${slotNumber}</span>
    <input class="skill-name" placeholder="Tên skill ${slotNumber}" value="${escapeAttr(skill.name || '')}" />
    <textarea class="skill-desc" rows="2" placeholder="Mô tả skill ${slotNumber}">${escapeHtml(skill.desc || '')}</textarea>
  `;
  el.skillsWrap.appendChild(row);
}

function buildPayloadFromForm() {
  const skills = [...el.skillsWrap.querySelectorAll('.skill-row')].map(row => ({
    name: row.querySelector('.skill-name').value,
    desc: row.querySelector('.skill-desc').value
  })).filter(skill => skill.name.trim() || skill.desc.trim());

  return {
    creatureId: el.creatureId.value,
    name: el.name.value,
    role: el.role.value,
    element: el.element.value,
    nature: el.nature.value,
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
  if (!confirm('Xóa build linh thú này? Thao tác này không thể hoàn tác.')) return;
  try {
    await api(`/api/beasts/${id}`, { method: 'DELETE' });
    el.dialog.close();
    showToast('Đã xóa build.');
    selectedBuildId = '';
    await Promise.all([loadRoles(), loadMods(), loadCreatures()]);
    if (selectedCreature) await selectCreature(selectedCreature.id, '');
  } catch (error) {
    showFormError(error.message);
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
    `Hệ: ${build.element || 'Chưa nhập'}`,
    `Tính cách (Nature): ${build.nature || 'Chưa nhập'}`,
    `Nội tại (Ability): ${build.passive || 'Chưa nhập'}`,
    'Kỹ năng (Skills):',
    ...sixSkillSlots(build.skills).map((skill, index) => `${index + 1}. ${skill.name || `Skill ${index + 1}`}: ${skill.desc || 'Chưa nhập.'}`),
    `Berry / Chỉ số 510 điểm: ${STAT_KEYS.map(key => `${STAT_LABELS[key]} ${build.stats?.[key] || 0}`).join(' / ')}`,
    `Ghi chú (Notes): ${build.notes || 'Không có'}`
  ];
  navigator.clipboard.writeText(lines.join('\n')).then(
    () => showToast('Đã copy build.'),
    () => showToast('Không thể copy build.', 'error')
  );
}

async function exportBuilds() {
  try {
    const data = await api('/api/beasts');
    const blob = new Blob([JSON.stringify(data.beasts || [], null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pocket-champion-builds-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function importBuilds(event) {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    const items = Array.isArray(data) ? data : data.beasts;
    const result = await api('/api/beasts/bulk/import', {
      method: 'POST',
      body: { beasts: items }
    });
    showToast(`Nhập xong: thêm ${result.created}, cập nhật ${result.updated}, lỗi ${result.errors?.length || 0}.`);
    if (result.errors?.length) console.warn(result.errors);
    await Promise.all([loadRoles(), loadMods(), loadCreatures()]);
    if (selectedCreature) await selectCreature(selectedCreature.id, selectedBuildId);
  } catch (error) {
    showToast(error.message || 'File JSON không hợp lệ.', 'error');
  }
}

async function openCreaturesDialog() {
  if (!isAdmin()) return;
  await loadCreaturesForAdmin();
  el.creaturesDialog.showModal();
}

async function loadCreaturesForAdmin() {
  const data = await api('/api/creatures');
  renderCreaturesTable(data.creatures || []);
}

function renderCreaturesTable(items) {
  if (!items.length) {
    el.creaturesTable.innerHTML = '<tr><td colspan="3">Chưa có tên linh thú.</td></tr>';
    return;
  }
  el.creaturesTable.innerHTML = items.map(item => `
    <tr>
      <td><input class="creature-name-input" data-id="${escapeAttr(item.id)}" value="${escapeAttr(item.name)}" /></td>
      <td>${Number(item.buildCount || 0)}</td>
      <td class="table-actions">
        <button class="ghost small save-creature" data-id="${escapeAttr(item.id)}" type="button">Lưu tên</button>
        <button class="danger ghost small delete-creature" data-id="${escapeAttr(item.id)}" ${Number(item.buildCount || 0) > 0 ? 'disabled' : ''} type="button">Xóa</button>
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
  el.creaturesTable.querySelectorAll('.delete-creature').forEach(button => {
    button.addEventListener('click', async () => {
      if (!confirm('Xóa tên linh thú này? Chỉ xóa được khi chưa có build.')) return;
      await deleteCreature(button.dataset.id);
    });
  });
}

async function createCreature() {
  try {
    await api('/api/creatures', { method: 'POST', body: { name: el.newCreatureName.value } });
    el.createCreatureForm.reset();
    showToast('Đã thêm tên linh thú.');
    await Promise.all([loadCreatures(), loadCreaturesForAdmin()]);
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

async function openUsersDialog() {
  if (!isAdmin()) return;
  await loadUsers();
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
          <option value="user" ${user.role === 'user' ? 'selected' : ''}>user</option>
          <option value="mod" ${user.role === 'mod' ? 'selected' : ''}>mod</option>
          <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>admin</option>
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

async function createUser() {
  try {
    await api('/api/users', {
      method: 'POST',
      body: {
        displayName: el.newDisplayName.value,
        gameName: el.newGameName.value,
        username: el.newUsername.value,
        password: el.newPassword.value,
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

async function resizeAvatarFile(file) {
  const img = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');
  canvas.width = AVATAR_SIZE;
  canvas.height = AVATAR_SIZE;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
  const side = Math.min(img.naturalWidth || img.width, img.naturalHeight || img.height);
  const sx = ((img.naturalWidth || img.width) - side) / 2;
  const sy = ((img.naturalHeight || img.height) - side) / 2;
  ctx.drawImage(img, sx, sy, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE);

  for (const quality of [0.82, 0.74, 0.66, 0.58, 0.5]) {
    const blob = await canvasToBlob(canvas, 'image/jpeg', quality);
    if (blob.size <= MAX_AVATAR_OUTPUT_BYTES) {
      return blobToDataUrl(blob);
    }
  }

  throw new Error('Ảnh avatar vẫn quá lớn sau khi nén. Hãy chọn ảnh đơn giản hơn.');
}

function roleLabel(role) {
  if (role === 'admin') return 'admin - toàn quyền';
  if (role === 'mod') return 'mod - build của mình';
  return 'user - chỉ xem';
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
