const PROFILE_KEY = 'ascend_project_kayla_v4';

function loadProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
  } catch {
    return {};
  }
}

const style = document.createElement('style');
style.textContent = `
  #ascend-mobile-menu,
  #ascend-mobile-drawer { display: none; }

  @media (pointer: coarse), (max-width: 900px) {
    #ascend-region-button,
    #ascend-adventure-button,
    #ascend-world-button,
    #ascend-mobile-bar {
      display: none !important;
    }

    #ascend-mobile-menu.ready {
      position: fixed;
      z-index: 210000;
      right: calc(12px + env(safe-area-inset-right));
      bottom: calc(12px + env(safe-area-inset-bottom));
      display: grid;
      place-items: center;
      width: 62px;
      height: 62px;
      border: 4px solid #fff;
      border-radius: 50%;
      background: #6b4cc5;
      color: #fff;
      box-shadow: 0 8px 24px rgba(23,50,77,.28);
      font: 900 11px Nunito, sans-serif;
      letter-spacing: .4px;
      cursor: pointer;
      touch-action: manipulation;
    }

    #ascend-mobile-drawer.open {
      position: fixed;
      z-index: 209999;
      right: calc(10px + env(safe-area-inset-right));
      bottom: calc(82px + env(safe-area-inset-bottom));
      display: grid;
      width: min(260px, calc(100vw - 24px));
      gap: 9px;
      padding: 12px;
      border: 4px solid #fff;
      border-radius: 22px;
      background: rgba(255,248,223,.98);
      box-shadow: 0 14px 40px rgba(23,50,77,.3);
    }

    #ascend-mobile-drawer button {
      min-height: 52px;
      border: 0;
      border-radius: 15px;
      padding: 10px 14px;
      text-align: left;
      color: #17324d;
      font: 900 16px Nunito, sans-serif;
      cursor: pointer;
      touch-action: manipulation;
    }

    #ascend-mobile-drawer [data-target="ascend-region-button"] { background: #ffca57; }
    #ascend-mobile-drawer [data-target="ascend-adventure-button"] { background: #f4a84f; }
    #ascend-mobile-drawer [data-target="ascend-world-button"] { background: #8d72e8; color: #fff; }
    #ascend-mobile-drawer .close-drawer { background: #e7edf2; }

    body.ascend-overlay-open #ascend-mobile-menu,
    body.ascend-overlay-open #ascend-mobile-drawer {
      display: none !important;
    }
  }
`;
document.head.appendChild(style);

const menu = document.createElement('button');
menu.id = 'ascend-mobile-menu';
menu.type = 'button';
menu.setAttribute('aria-label', 'Open game menu');
menu.textContent = 'MENU';

document.body.appendChild(menu);

const drawer = document.createElement('nav');
drawer.id = 'ascend-mobile-drawer';
drawer.setAttribute('aria-label', 'Game navigation');
drawer.innerHTML = `
  <button type="button" data-target="ascend-region-button">🧭 Explore current country</button>
  <button type="button" data-target="ascend-adventure-button">⚔️ Missions and battles</button>
  <button type="button" data-target="ascend-world-button">🗺️ World map</button>
  <button type="button" class="close-drawer">Close</button>
`;
document.body.appendChild(drawer);

function onboardingComplete() {
  const profile = loadProfile();
  return Boolean(profile.stage && profile.companion && profile.diagnosticComplete);
}

function updateVisibility() {
  menu.classList.toggle('ready', onboardingComplete());
  if (!onboardingComplete()) drawer.classList.remove('open');
}

function closeDrawer() {
  drawer.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}

menu.addEventListener('click', () => {
  if (!onboardingComplete()) return;
  const open = drawer.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});

drawer.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.classList.contains('close-drawer')) return closeDrawer();
  const target = document.getElementById(button.dataset.target);
  closeDrawer();
  target?.click();
});

document.addEventListener('pointerdown', (event) => {
  if (!drawer.classList.contains('open')) return;
  if (drawer.contains(event.target) || menu.contains(event.target)) return;
  closeDrawer();
});

function detectOverlays() {
  const selectors = ['#ascend-region.open', '#ascend-world-overlay.open', '#ascend-adventure-overlay.open'];
  document.body.classList.toggle('ascend-overlay-open', selectors.some((selector) => document.querySelector(selector)));
}

const observer = new MutationObserver(() => {
  updateVisibility();
  detectOverlays();
});
observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });

window.addEventListener('storage', updateVisibility);
window.addEventListener('focus', updateVisibility);
setInterval(updateVisibility, 1000);
updateVisibility();
detectOverlays();
