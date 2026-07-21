function ensureMobileShell() {
  if (!document.getElementById('ascend-mobile-bar')) {
    const bar = document.createElement('div');
    bar.id = 'ascend-mobile-bar';
    bar.innerHTML = '<span class="pill">Move with the pad</span><span class="pill">Tap ACT to interact</span>';
    document.body.appendChild(bar);
  }

  if (!document.getElementById('ascend-rotate-note')) {
    const note = document.createElement('div');
    note.id = 'ascend-rotate-note';
    note.innerHTML = '<div class="card"><strong>Turn your device sideways</strong><span>ASCEND is designed as a wide adventure world. Landscape mode gives you the clearest controls and largest play area.</span></div>';
    document.body.appendChild(note);
  }

  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
  }

  const stopGesture = (event) => event.preventDefault();
  document.addEventListener('gesturestart', stopGesture, { passive: false });
  document.addEventListener('dblclick', stopGesture, { passive: false });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ensureMobileShell, { once: true });
} else {
  ensureMobileShell();
}
