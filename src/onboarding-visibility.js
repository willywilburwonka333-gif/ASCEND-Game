const PROFILE_KEY = 'ascend_project_kayla_v4';

function profile() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}'); } catch { return {}; }
}

function hideLegacyButtons() {
  const labels = ['EXPLORE', 'ADVENTURE', 'WORLD'];
  document.querySelectorAll('button').forEach((button) => {
    const text = button.textContent.trim().toUpperCase();
    if (labels.some((label) => text.includes(label)) && !button.closest('#ascend-clean-drawer')) {
      if (button.id !== 'ascend-clean-menu') button.style.setProperty('display', 'none', 'important');
    }
  });
}

function syncNavigation() {
  hideLegacyButtons();
  const data = profile();
  const ready = Boolean(data.onboardingComplete && data.diagnosticComplete);
  const onboarding = document.getElementById('ascend-onboarding');
  const onboardingOpen = onboarding?.classList.contains('open');
  const menu = document.getElementById('ascend-clean-menu');
  const drawer = document.getElementById('ascend-clean-drawer');
  if (menu) menu.style.setProperty('display', ready && !onboardingOpen ? 'block' : 'none', 'important');
  if (drawer && (!ready || onboardingOpen)) drawer.classList.remove('open');
}

new MutationObserver(syncNavigation).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
window.addEventListener('storage', syncNavigation);
window.addEventListener('focus', syncNavigation);
setInterval(syncNavigation, 600);
syncNavigation();
