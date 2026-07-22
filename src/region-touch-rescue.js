const waitForRegion = () => {
  const root = document.getElementById('ascend-region');
  if (!root) {
    setTimeout(waitForRegion, 100);
    return;
  }
  if (root.dataset.touchRescue === '1') return;
  root.dataset.touchRescue = '1';

  const stick = root.querySelector('.rv-stick');
  const knob = root.querySelector('.rv-knob');
  const act = root.querySelector('.rv-act');
  const back = root.querySelector('.rv-close');
  const controls = root.querySelector('.rv-controls');
  const top = root.querySelector('.rv-top');

  root.style.setProperty('z-index', '2147483000', 'important');
  root.style.setProperty('pointer-events', 'auto', 'important');
  controls?.style.setProperty('z-index', '2147483100', 'important');
  controls?.style.setProperty('pointer-events', 'none', 'important');
  stick?.style.setProperty('pointer-events', 'auto', 'important');
  act?.style.setProperty('pointer-events', 'auto', 'important');
  top?.style.setProperty('z-index', '2147483100', 'important');
  back?.style.setProperty('pointer-events', 'auto', 'important');

  const down = new Set();
  const keyMap = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' };
  const sendKey = (key, pressed) => {
    const type = pressed ? 'keydown' : 'keyup';
    window.dispatchEvent(new KeyboardEvent(type, { key, code: key, bubbles: true, cancelable: true }));
  };
  const releaseAll = () => {
    for (const dir of [...down]) {
      sendKey(keyMap[dir], false);
      down.delete(dir);
    }
    if (knob) knob.style.transform = 'translate(0px, 0px)';
  };
  const updateStick = (clientX, clientY) => {
    if (!stick) return;
    const r = stick.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const max = r.width * 0.29;
    const length = Math.hypot(dx, dy) || 1;
    const scale = Math.min(1, max / length);
    dx *= scale;
    dy *= scale;
    if (knob) knob.style.transform = `translate(${dx}px, ${dy}px)`;

    const next = new Set();
    const threshold = max * 0.22;
    if (dx > threshold) next.add('right');
    if (dx < -threshold) next.add('left');
    if (dy > threshold) next.add('down');
    if (dy < -threshold) next.add('up');

    for (const dir of ['up', 'down', 'left', 'right']) {
      if (next.has(dir) && !down.has(dir)) {
        down.add(dir);
        sendKey(keyMap[dir], true);
      } else if (!next.has(dir) && down.has(dir)) {
        down.delete(dir);
        sendKey(keyMap[dir], false);
      }
    }
  };

  let stickTouchId = null;
  const pointIn = (touch, element) => {
    if (!element) return false;
    const r = element.getBoundingClientRect();
    return touch.clientX >= r.left && touch.clientX <= r.right && touch.clientY >= r.top && touch.clientY <= r.bottom;
  };

  document.addEventListener('touchstart', (event) => {
    if (!root.classList.contains('open')) return;
    for (const touch of event.changedTouches) {
      if (pointIn(touch, back)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        releaseAll();
        if (typeof back?.onclick === 'function') back.onclick(new Event('click'));
        else {
          root.classList.remove('open');
          document.getElementById('app')?.style.removeProperty('visibility');
        }
        return;
      }
      if (pointIn(touch, act)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        sendKey('e', true);
        setTimeout(() => sendKey('e', false), 40);
        return;
      }
      if (pointIn(touch, stick)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        stickTouchId = touch.identifier;
        updateStick(touch.clientX, touch.clientY);
        return;
      }
    }
  }, { capture: true, passive: false });

  document.addEventListener('touchmove', (event) => {
    if (!root.classList.contains('open') || stickTouchId === null) return;
    const touch = [...event.touches].find((item) => item.identifier === stickTouchId);
    if (!touch) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    updateStick(touch.clientX, touch.clientY);
  }, { capture: true, passive: false });

  const endTouch = (event) => {
    if (stickTouchId === null) return;
    if ([...event.changedTouches].some((item) => item.identifier === stickTouchId)) {
      stickTouchId = null;
      releaseAll();
    }
  };
  document.addEventListener('touchend', endTouch, { capture: true, passive: false });
  document.addEventListener('touchcancel', endTouch, { capture: true, passive: false });

  // Mouse and stylus fallback.
  act?.addEventListener('click', (event) => {
    event.preventDefault();
    sendKey('e', true);
    setTimeout(() => sendKey('e', false), 40);
  }, true);
  back?.addEventListener('click', () => releaseAll(), true);

  const observer = new MutationObserver(() => {
    if (!root.classList.contains('open')) releaseAll();
  });
  observer.observe(root, { attributes: true, attributeFilter: ['class'] });
};

waitForRegion();
