const PROFILE_KEY = 'ascend_project_kayla_v4';

function loadProfile() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}'); } catch { return {}; }
}
function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

const style = document.createElement('style');
style.textContent = `
  #ascend-startup-recovery{position:fixed;inset:0;z-index:900000;display:none;place-items:center;padding:calc(18px + env(safe-area-inset-top)) calc(16px + env(safe-area-inset-right)) calc(24px + env(safe-area-inset-bottom)) calc(16px + env(safe-area-inset-left));background:linear-gradient(180deg,#8ee7ff,#dff8df 62%,#79d16e);font-family:Nunito,Arial;color:#17324d}
  #ascend-startup-recovery.open{display:grid}.asr-card{width:min(560px,100%);background:#fff8df;border:7px solid #fff;border-radius:28px;padding:22px;box-shadow:0 20px 55px #17324d33;text-align:center}.asr-card h1{margin:0 0 8px;color:#6b4cc5;font:800 34px 'Baloo 2',Nunito}.asr-card p{line-height:1.45}.asr-actions{display:grid;gap:10px;margin-top:18px}.asr-actions button{min-height:54px;border:4px solid #fff;border-radius:16px;padding:12px 16px;font:900 16px Nunito;cursor:pointer;touch-action:manipulation}.asr-resume{background:#6b4cc5;color:#fff}.asr-home{background:#73d8bd;color:#17324d}.asr-reset{background:#eef7ff;color:#17324d}.asr-note{font-size:13px;color:#526f80;margin-top:12px}
`;
document.head.appendChild(style);

const recovery = document.createElement('section');
recovery.id = 'ascend-startup-recovery';
recovery.innerHTML = `<div class="asr-card"><h1>ASCEND is waking up</h1><p>Your saved adventure stopped between two screens. Nothing has been deleted. Choose where to continue.</p><div class="asr-actions"><button class="asr-resume">CONTINUE MY OPENING ADVENTURE</button><button class="asr-home">OPEN THE GAME HOME</button><button class="asr-reset">RESTART ONLY THE TUTORIAL</button></div><div class="asr-note">Monster collection, progress and adult assignments are preserved.</div></div>`;
document.body.appendChild(recovery);

function visibleElement(selector) {
  return [...document.querySelectorAll(selector)].some((el) => {
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0 && rect.width > 20 && rect.height > 20;
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

function showRecovery() {
  clearBlockingClasses();
  recovery.classList.add('open');
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
  clearBlockingClasses();
  recovery.classList.remove('open');
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

window.addEventListener('error', (event) => {
  console.error('ASCEND startup error:', event.error || event.message);
});
window.addEventListener('unhandledrejection', (event) => {
  console.error('ASCEND startup rejection:', event.reason);
});

setTimeout(() => {
  if (!gameHasRendered()) showRecovery();
}, 2500);

setTimeout(() => {
  if (!gameHasRendered()) showRecovery();
}, 6000);
