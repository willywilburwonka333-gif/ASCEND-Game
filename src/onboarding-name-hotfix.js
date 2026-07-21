const style = document.createElement('style');
style.textContent = `
  @media (max-width: 760px) {
    #ascend-onboarding .ao-actions {
      display: grid !important;
      grid-template-columns: 1fr !important;
      gap: 10px !important;
      width: 100% !important;
    }
    #ascend-onboarding .ao-actions .ao-next,
    #ascend-onboarding .ao-actions .ao-back {
      width: 100% !important;
      margin: 0 !important;
      min-height: 58px !important;
      white-space: normal !important;
      text-align: center !important;
    }
    #ascend-onboarding .ao-next { order: 1; }
    #ascend-onboarding .ao-back { order: 2; }
    #ascend-onboarding .ao-copy { min-width: 0 !important; }
    #ascend-onboarding .ao-card { overflow: visible !important; }
  }
`;
document.head.appendChild(style);

function submitNameStep() {
  const onboarding = document.getElementById('ascend-onboarding');
  if (!onboarding?.classList.contains('open')) return false;
  const name = onboarding.querySelector('.ao-name');
  const next = onboarding.querySelector('.ao-next');
  if (!name || !next) return false;
  name.blur();
  next.click();
  return true;
}

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;
  if (document.activeElement?.classList.contains('ao-name')) {
    event.preventDefault();
    submitNameStep();
  }
});

document.addEventListener('click', (event) => {
  const target = event.target.closest('.ao-next');
  if (!target) return;
  target.style.pointerEvents = 'auto';
}, true);

const observer = new MutationObserver(() => {
  const onboarding = document.getElementById('ascend-onboarding');
  const name = onboarding?.querySelector('.ao-name');
  const next = onboarding?.querySelector('.ao-next');
  if (!name || !next) return;
  next.hidden = false;
  next.style.display = 'block';
  next.style.visibility = 'visible';
  next.style.opacity = '1';
});
observer.observe(document.body, { childList: true, subtree: true });
