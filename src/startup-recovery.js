const PROFILE_KEY = 'ascend_project_kayla_v4';

function loadProfile() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}'); } catch { return {}; }
}
function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

const style = document.createElement('style');
style.textContent = `
  #ascend-startup-recovery{position:fixed;inset:0;z-index:900000;display:grid;place-items:center;padding:calc(18px + env(safe-area-inset-top)) calc(16px + env(safe-area-inset-right)) calc(24px + env(safe-area-inset-bottom)) calc(16px + env(safe-area-inset-left));background:linear-gradient(180deg,#8ee7ff,#dff8df 62%,#79d16e);font-family:Nunito,Arial;color:#17324d}
  #ascend-startup-recovery.hidden{display:none}.asr-card{width:min(560px,100%);background:#fff8df;border:7px solid #fff;border-radius:28px;padding:22px;box-shadow:0 20px 55px #17324d33;text-align:center}.asr-card h1{margin:0 0 8px;color:#6b4cc5;font:800 34px 'Baloo 2',Nunito}.asr-card p{line-height:1.45}.asr-spinner{width:58px;height:58px;margin:18px auto;border:8px solid #d9d0ff;border-top-color:#6b4cc5;border-radius:50%;animation:asrSpin .85s linear infinite}.asr-actions{display:none;gap:10px;margin-top:18px}.asr-actions.ready{display:grid}.asr-actions button{min-height:54px;border:4px solid #fff;border-radius:16px;padding:12px 16px;font:900 16px Nunito;cursor:pointer;touch-action:manipulation}.asr-resume{background:#6b4cc5;color:#fff}.asr-home{background:#73d8bd;color:#17324d}.asr-reset{background:#eef7ff;color:#17324d}.asr-note{font-size:13px;color:#526f80;margin-top:12px}@keyframes asrSpin{to{transform:rotate(360deg)}}
`;
document.head.appendChild(style);

const recovery = document.createElement('section');
recovery.id = 'ascend-startup-recovery';
recovery.innerHTML = `<div class="asr-card"><h1>ASCEND is waking up</h1><p class="asr-message">Loading your adventure…</p><div class="asr-spinner"></div><div class="asr-actions"><button class="asr-resume">CONTINUE MY OPENING ADVENTURE</button><button class="asr-home">OPEN THE GAME HOME</button><button class="asr-reset">RESTART ONLY THE TUTORIAL</button></div><div class="asr-note">Your monster collection, progress and adult assignments are preserved.</div></div>`;
document.body.appendChild(recovery);

const message = recovery.querySelector('.asr-message');
const spinner = recovery.querySelector('.asr-spinner');
const actions = recovery.querySelector('.asr-actions');

function visibleElement(selector) {
  return [...document.querySelectorAll(selector)].some((el) => {
    if (el === recovery) return false;
    const computed = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return computed.display !== 'none' && computed.visibility !== 'hidden' && Number(computed.opacity || 1) > 0 && rect.width > 20 && rect.height > 20;
  });
}

function gameHasRendered() {
  const selectors = [
    '#app canvas',
    '#ascend-onboarding-v3.open',
    '#ascend-opening-adventure.open',
    '#ascend-region.open',
    '#ascend-world-overlay.open',
    '#ascend-adventure-overlay.open',
    '#ascend-adult-overlay.open',
    '.phaser-game canvas'
  ];
  return selectors.some(visibleElement);
}

function clearBlockingClasses() {
  document.body.classList.remove('ascend-onboarding-active','ascend-overlay-open','ao3-open');
  document.documentElement.style.removeProperty('overflow');
  document.body.style.removeProperty('overflow');
}

function revealRecovery(reason = 'ASCEND could not choose the correct saved screen.') {
  clearBlockingClasses();
  message.textContent = `${reason} Nothing has been deleted. Choose where to continue.`;
  spinner.style.display = 'none';
  actions.classList.add('ready');
}

function finishBootIfVisible() {
  if (gameHasRendered()) {
    recovery.classList.add('hidden');
    return true;
  }
  return false;
}

recovery.querySelector('.asr-resume').onclick = () => {
  const profile = loadProfile();
  profile.onboardingComplete = true;
  profile.diagnosticComplete = false;
  profile.diagnosticIndex = Number(profile.diagnosticIndex || 0);
  profile.openingAdventure = { ...(profile.openingAdventure || {}), completed: false, step: Number(profile.openingAdventure?.step || 0) };
  saveProfile(profile);
  location.reload();
};

recovery.querySelector('.asr-home').onclick = () => {
  const profile = loadProfile();
  profile.onboardingComplete = true;
  profile.diagnosticComplete = true;
  profile.openingAdventure = { ...(profile.openingAdventure || {}), completed: true };
  saveProfile(profile);
  location.reload();
};

recovery.querySelector('.asr-reset').onclick = () => {
  const profile = loadProfile();
  profile.onboardingComplete = false;
  profile.diagnosticComplete = false;
  profile.diagnosticIndex = 0;
  delete profile.openingAdventure;
  saveProfile(profile);
  location.reload();
};

const startupErrors = [];
window.addEventListener('error', (event) => {
  startupErrors.push(event.message || 'Unknown startup error');
  console.error('ASCEND startup error:', event.error || event.message);
});
window.addEventListener('unhandledrejection', (event) => {
  startupErrors.push(String(event.reason || 'Unknown rejected startup action'));
  console.error('ASCEND startup rejection:', event.reason);
});

setTimeout(() => {
  if (!finishBootIfVisible()) {
    revealRecovery(startupErrors.length ? `A game module failed: ${startupErrors[0]}` : 'Your saved adventure stopped between two screens.');
  }
}, 1800);

setTimeout(() => {
  if (!recovery.classList.contains('hidden') && !actions.classList.contains('ready') && !finishBootIfVisible()) {
    revealRecovery('ASCEND took too long to render.');
  }
}, 4500);
