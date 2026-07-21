const style = document.createElement('style');
style.textContent = `
  #ascend-rotate-note,
  #ascend-mobile-bar { display:none !important; pointer-events:none !important; }
  html,body,#app { width:100%; height:100%; min-height:100dvh; overflow:hidden; }
  body { padding:0 !important; touch-action:manipulation; }
  #app { display:flex; align-items:center; justify-content:center; }
  #app canvas {
    display:block;
    width:100vw !important;
    height:100dvh !important;
    max-width:100vw !important;
    max-height:100dvh !important;
    object-fit:contain;
    touch-action:none !important;
    box-shadow:none !important;
  }
  @media (orientation:portrait) {
    #app canvas { width:100vw !important; height:100dvh !important; }
  }
  button,[role="button"] { touch-action:manipulation; -webkit-tap-highlight-color:transparent; }
`;
document.head.appendChild(style);

document.getElementById('ascend-rotate-note')?.remove();
document.getElementById('ascend-mobile-bar')?.remove();

function bindCanvas(canvas) {
  if (!canvas || canvas.dataset.ascendImmediateTouch === '1') return;
  canvas.dataset.ascendImmediateTouch = '1';

  let start = null;
  canvas.addEventListener('touchstart', (event) => {
    const touch = event.changedTouches?.[0];
    if (!touch) return;
    start = { x: touch.clientX, y: touch.clientY, time: performance.now() };
    event.preventDefault();

    const target = document.elementFromPoint(touch.clientX, touch.clientY) || canvas;
    target.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      pointerId: 1,
      pointerType: 'touch',
      isPrimary: true,
      clientX: touch.clientX,
      clientY: touch.clientY,
      buttons: 1,
    }));
  }, { passive: false });

  canvas.addEventListener('touchend', (event) => {
    const touch = event.changedTouches?.[0];
    if (!touch) return;
    event.preventDefault();

    const target = document.elementFromPoint(touch.clientX, touch.clientY) || canvas;
    target.dispatchEvent(new PointerEvent('pointerup', {
      bubbles: true,
      cancelable: true,
      pointerId: 1,
      pointerType: 'touch',
      isPrimary: true,
      clientX: touch.clientX,
      clientY: touch.clientY,
      buttons: 0,
    }));

    const moved = start ? Math.hypot(touch.clientX - start.x, touch.clientY - start.y) : 0;
    const elapsed = start ? performance.now() - start.time : 0;
    if (moved < 18 && elapsed < 700) {
      target.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        clientX: touch.clientX,
        clientY: touch.clientY,
      }));
    }
    start = null;
  }, { passive: false });
}

function bindAll() {
  document.querySelectorAll('#app canvas').forEach(bindCanvas);
  document.getElementById('ascend-rotate-note')?.remove();
  document.getElementById('ascend-mobile-bar')?.remove();
}

new MutationObserver(bindAll).observe(document.body, { childList:true, subtree:true });
window.addEventListener('resize', bindAll, { passive:true });
window.addEventListener('orientationchange', () => setTimeout(bindAll, 100), { passive:true });
bindAll();
