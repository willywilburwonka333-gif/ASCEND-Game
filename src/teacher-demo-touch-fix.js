const stick = document.querySelector('.td-stick');
const knob = document.querySelector('.td-knob');
const act = document.querySelector('.td-act');

if (stick && knob) {
  const activeKeys = new Set();
  const keyFor = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' };

  function send(type, key) {
    window.dispatchEvent(new KeyboardEvent(type, { key, bubbles: true, cancelable: true }));
  }

  function releaseAll() {
    for (const key of activeKeys) send('keyup', key);
    activeKeys.clear();
    knob.style.transform = 'translate(0px, 0px)';
  }

  function applyDirection(dx, dy, max) {
    const next = new Set();
    const dead = 0.22;
    const nx = dx / max;
    const ny = dy / max;
    if (nx < -dead) next.add(keyFor.left);
    if (nx > dead) next.add(keyFor.right);
    if (ny < -dead) next.add(keyFor.up);
    if (ny > dead) next.add(keyFor.down);

    for (const key of activeKeys) {
      if (!next.has(key)) send('keyup', key);
    }
    for (const key of next) {
      if (!activeKeys.has(key)) send('keydown', key);
    }
    activeKeys.clear();
    for (const key of next) activeKeys.add(key);
  }

  function updateFromTouch(touch) {
    const r = stick.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    let dx = touch.clientX - cx;
    let dy = touch.clientY - cy;
    const max = r.width * 0.29;
    const length = Math.hypot(dx, dy) || 1;
    const scale = Math.min(1, max / length);
    dx *= scale;
    dy *= scale;
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    applyDirection(dx, dy, max);
  }

  stick.addEventListener('touchstart', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.touches[0]) updateFromTouch(event.touches[0]);
  }, { passive: false, capture: true });

  stick.addEventListener('touchmove', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.touches[0]) updateFromTouch(event.touches[0]);
  }, { passive: false, capture: true });

  stick.addEventListener('touchend', (event) => {
    event.preventDefault();
    event.stopPropagation();
    releaseAll();
  }, { passive: false, capture: true });

  stick.addEventListener('touchcancel', releaseAll, { passive: false, capture: true });
  window.addEventListener('blur', releaseAll);
  document.addEventListener('visibilitychange', () => { if (document.hidden) releaseAll(); });
}

if (act) {
  const activate = (event) => {
    event.preventDefault();
    event.stopPropagation();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', bubbles: true, cancelable: true }));
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'e', bubbles: true, cancelable: true }));
  };
  act.addEventListener('touchstart', activate, { passive: false, capture: true });
}
