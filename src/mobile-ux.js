const coarsePointer = window.matchMedia('(pointer: coarse)');

function ensureMobileUi() {
  if (!document.getElementById('ascend-mobile-bar')) {
    const bar = document.createElement('div');
    bar.id = 'ascend-mobile-bar';
    bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = '<span class="pill">Touch controls enabled</span><span class="pill">Best in landscape</span>';
    document.body.appendChild(bar);
  }

  if (!document.getElementById('ascend-rotate-note')) {
    const note = document.createElement('div');
    note.id = 'ascend-rotate-note';
    note.innerHTML = `
      <div class="card">
        <strong>Turn your device sideways</strong>
        <div>ASCEND uses a wide adventure view so movement, quests and answer buttons stay large and easy to tap.</div>
      </div>`;
    document.body.appendChild(note);
  }
}

function resizeCanvasForDevice() {
  const canvas = document.querySelector('canvas');
  if (!canvas) return;

  const viewport = window.visualViewport;
  const width = viewport?.width || window.innerWidth;
  const height = viewport?.height || window.innerHeight;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.style.maxWidth = '100vw';
  canvas.style.maxHeight = '100dvh';
}

function preventMobileBrowserGestures(event) {
  if (!coarsePointer.matches) return;
  if (event.touches?.length > 1) event.preventDefault();
}

ensureMobileUi();
resizeCanvasForDevice();

window.addEventListener('resize', resizeCanvasForDevice, { passive: true });
window.addEventListener('orientationchange', () => setTimeout(resizeCanvasForDevice, 250), { passive: true });
window.visualViewport?.addEventListener('resize', resizeCanvasForDevice, { passive: true });
document.addEventListener('gesturestart', (event) => event.preventDefault(), { passive: false });
document.addEventListener('touchmove', preventMobileBrowserGestures, { passive: false });

const observer = new MutationObserver(resizeCanvasForDevice);
observer.observe(document.getElementById('app'), { childList: true, subtree: true });
