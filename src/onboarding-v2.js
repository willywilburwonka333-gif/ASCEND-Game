const PROFILE_KEY = 'ascend_project_kayla_v4';

const loadProfile = () => {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}'); } catch { return {}; }
};
const saveProfile = (profile) => localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));

const css = document.createElement('style');
css.textContent = `
  #ascend-clean-menu{position:fixed;right:max(12px,env(safe-area-inset-right));bottom:max(14px,env(safe-area-inset-bottom));z-index:250000;border:4px solid #fff;border-radius:50%;width:68px;height:68px;background:#6b4cc5;color:#fff;font:900 26px Nunito,sans-serif;box-shadow:0 10px 26px rgba(23,50,77,.3);cursor:pointer}
  #ascend-clean-drawer{position:fixed;right:max(12px,env(safe-area-inset-right));bottom:calc(92px + env(safe-area-inset-bottom));z-index:249999;display:none;width:min(290px,86vw);padding:12px;border:5px solid #fff;border-radius:24px;background:rgba(255,248,223,.98);box-shadow:0 16px 42px rgba(23,50,77,.28)}
  #ascend-clean-drawer.open{display:grid;gap:9px}
  #ascend-clean-drawer button{border:0;border-radius:16px;padding:14px 16px;text-align:left;background:#eef7ff;color:#17324d;font:900 17px Nunito,sans-serif;cursor:pointer}
  #ascend-clean-drawer button:nth-child(1){background:#ffca57}#ascend-clean-drawer button:nth-child(2){background:#73d8bd}#ascend-clean-drawer button:nth-child(3){background:#8d72e8;color:#fff}
  body.ascend-onboarding-active #ascend-clean-menu,body.ascend-onboarding-active #ascend-clean-drawer{display:none!important}
  #ascend-onboarding{position:fixed;inset:0;z-index:300000;display:none;overflow:auto;padding:calc(18px + env(safe-area-inset-top)) calc(16px + env(safe-area-inset-right)) calc(24px + env(safe-area-inset-bottom)) calc(16px + env(safe-area-inset-left));background:radial-gradient(circle at 20% 12%,rgba(255,255,255,.9),transparent 22%),linear-gradient(180deg,#8ee7ff 0%,#d7f8de 62%,#7ed672 100%);font-family:Nunito,sans-serif;color:#17324d}
  #ascend-onboarding.open{display:block}.ao-shell{width:min(980px,100%);margin:auto}.ao-progress{display:flex;gap:8px;margin:8px 0 18px}.ao-dot{height:10px;flex:1;border-radius:999px;background:rgba(255,255,255,.55)}.ao-dot.active{background:#6b4cc5}.ao-card{display:grid;grid-template-columns:minmax(260px,.9fr) minmax(300px,1.1fr);gap:20px;padding:24px;border:7px solid #fff;border-radius:34px;background:rgba(255,248,223,.97);box-shadow:0 22px 60px rgba(23,50,77,.22)}
  .ao-preview{min-height:430px;border-radius:27px;display:grid;place-items:center;position:relative;overflow:hidden;background:linear-gradient(180deg,#baf2ff,#dff8d8 67%,#88d975)}.ao-preview:after{content:'';position:absolute;inset:auto 15% 36px;height:28px;border-radius:50%;background:rgba(23,50,77,.16);filter:blur(2px)}
  .ao-egg{--egg:#9b83f4;--spot:#ffe57d;width:178px;height:230px;border-radius:52% 52% 48% 48%/62% 62% 38% 38%;position:relative;z-index:2;background:var(--egg);border:10px solid #fff;box-shadow:0 0 0 18px rgba(255,255,255,.22),0 20px 45px rgba(23,50,77,.22);animation:aoFloat 1.8s ease-in-out infinite alternate}.ao-egg.spots:before,.ao-egg.stars:before,.ao-egg.waves:before{content:'';position:absolute;inset:18px;border-radius:inherit}.ao-egg.spots:before{background:radial-gradient(circle at 28% 25%,var(--spot) 0 12px,transparent 13px),radial-gradient(circle at 70% 58%,var(--spot) 0 18px,transparent 19px),radial-gradient(circle at 38% 78%,var(--spot) 0 10px,transparent 11px)}.ao-egg.stars:before{background:radial-gradient(circle,var(--spot) 0 4px,transparent 5px) 0 0/42px 42px,radial-gradient(circle,var(--spot) 0 8px,transparent 9px) 18px 16px/74px 74px}.ao-egg.waves:before{background:repeating-radial-gradient(ellipse at 50% 120%,transparent 0 18px,var(--spot) 19px 25px,transparent 26px 42px)}.ao-egg.glow{filter:drop-shadow(0 0 24px var(--spot))}.ao-mark{position:absolute;left:50%;top:48%;transform:translate(-50%,-50%);font-size:48px;z-index:3;filter:drop-shadow(0 3px 0 rgba(255,255,255,.7))}@keyframes aoFloat{to{transform:translateY(-13px) rotate(1.5deg)}}
  .ao-copy h1{margin:0 0 6px;font:800 clamp(34px,5vw,58px) 'Baloo 2',sans-serif;color:#6b4cc5;line-height:1}.ao-copy h2{margin:0 0 14px;font:800 27px 'Baloo 2',sans-serif}.ao-copy p{font-size:18px;line-height:1.45}.ao-options{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:15px 0}.ao-option{border:4px solid #fff;border-radius:16px;padding:12px;background:#eef7ff;color:#17324d;font:900 16px Nunito;cursor:pointer}.ao-option.selected{outline:5px solid #ffca57;background:#fff3bd}.ao-colours{display:flex;flex-wrap:wrap;gap:10px;margin:12px 0}.ao-colour{width:46px;height:46px;border:5px solid #fff;border-radius:50%;box-shadow:0 3px 10px rgba(23,50,77,.18);cursor:pointer}.ao-colour.selected{outline:5px solid #17324d}.ao-field{width:100%;border:4px solid #d7e2eb;border-radius:15px;padding:13px 15px;font:800 18px Nunito;color:#17324d;background:#fff}.ao-actions{display:flex;gap:10px;justify-content:space-between;margin-top:18px}.ao-next,.ao-back{border:4px solid #fff;border-radius:17px;padding:13px 20px;font:900 18px Nunito;cursor:pointer}.ao-next{margin-left:auto;background:#6b4cc5;color:#fff}.ao-back{background:#eef7ff;color:#17324d}.ao-story{display:grid;gap:10px}.ao-story div{padding:13px 14px;border-radius:16px;background:#eef7ff;font-weight:800}.ao-note{font-size:14px;color:#46677c}
  @media(max-width:760px){.ao-card{grid-template-columns:1fr;padding:16px;border-radius:26px}.ao-preview{min-height:270px}.ao-egg{width:132px;height:174px}.ao-copy h1{font-size:38px}.ao-copy h2{font-size:23px}.ao-copy p{font-size:16px}.ao-options{grid-template-columns:1fr 1fr}}
`;
document.head.appendChild(css);

function findOriginalButton(text) {
  return [...document.querySelectorAll('button')].find((button) => button.textContent.trim().toUpperCase().includes(text));
}

const menu = document.createElement('button');
menu.id = 'ascend-clean-menu';
menu.textContent = '☰';
menu.setAttribute('aria-label', 'Open game menu');
const drawer = document.createElement('div');
drawer.id = 'ascend-clean-drawer';
drawer.innerHTML = '<button data-target="EXPLORE">🧭 Explore country</button><button data-target="ADVENTURE">⚔️ Missions & battles</button><button data-target="WORLD">🗺️ World map</button>';
document.body.append(menu, drawer);
menu.onclick = () => drawer.classList.toggle('open');
drawer.onclick = (event) => {
  const action = event.target.closest('button')?.dataset.target;
  if (!action) return;
  drawer.classList.remove('open');
  findOriginalButton(action)?.click();
};

function tidyButtons() {
  for (const label of ['EXPLORE', 'ADVENTURE', 'WORLD']) {
    const button = findOriginalButton(label);
    if (button && button.id !== 'ascend-clean-menu' && !button.closest('#ascend-clean-drawer')) button.style.display = 'none';
  }
}
new MutationObserver(tidyButtons).observe(document.body, { childList: true, subtree: true });
setTimeout(tidyButtons, 0);
setTimeout(tidyButtons, 1000);

const onboarding = document.createElement('section');
onboarding.id = 'ascend-onboarding';
onboarding.innerHTML = '<div class="ao-shell"><div class="ao-progress"></div><div class="ao-card"><div class="ao-preview"></div><div class="ao-copy"></div></div></div>';
document.body.appendChild(onboarding);

let step = 0;
const creator = {
  stage: 'secondary', year: 7, affinity: 'starlight', colour: '#9b83f4', spot: '#ffe57d', pattern: 'stars', glow: true, mark: '✦', name: 'Nova'
};
const steps = ['Welcome', 'Create', 'Awaken', 'World', 'Begin'];

function eggPreview() {
  return `<div class="ao-egg ${creator.pattern} ${creator.glow ? 'glow' : ''}" style="--egg:${creator.colour};--spot:${creator.spot}"><div class="ao-mark">${creator.mark}</div></div>`;
}
function option(label, value, current, group) {
  return `<button class="ao-option ${value === current ? 'selected' : ''}" data-group="${group}" data-value="${value}">${label}</button>`;
}
function render() {
  onboarding.querySelector('.ao-progress').innerHTML = steps.map((_, index) => `<span class="ao-dot ${index <= step ? 'active' : ''}"></span>`).join('');
  const preview = onboarding.querySelector('.ao-preview');
  const copy = onboarding.querySelector('.ao-copy');
  preview.innerHTML = eggPreview();
  if (step === 0) {
    copy.innerHTML = `<h1>ASCEND</h1><h2>Your adventure begins before the first lesson.</h2><p>The five countries are losing their memories. Creatures called Ascendants can restore them—but only when they grow beside someone willing to explore, solve problems and keep trying.</p><div class="ao-story"><div>🥚 Create an egg nobody else has.</div><div>🧭 Explore living countries and meet their people.</div><div>⚔️ Use school knowledge as your battle power.</div><div>✨ Find, befriend and evolve 110 monsters.</div></div><div class="ao-actions"><button class="ao-next">CREATE MY EGG →</button></div>`;
  } else if (step === 1) {
    copy.innerHTML = `<h2>Shape your mysterious egg</h2><p>No two starter eggs need to look the same. Its affinity changes which monster family is most likely to awaken.</p><b>Affinity</b><div class="ao-options">${option('🌿 Bloom','bloom',creator.affinity,'affinity')}${option('✦ Starlight','starlight',creator.affinity,'affinity')}${option('🌊 Tide','tide',creator.affinity,'affinity')}</div><b>Shell colour</b><div class="ao-colours">${['#ff8fbd','#9b83f4','#73d8bd','#ffca57','#55c8f2','#b676d8'].map(c=>`<button class="ao-colour ${c===creator.colour?'selected':''}" data-colour="${c}" style="background:${c}"></button>`).join('')}</div><b>Pattern</b><div class="ao-options">${option('Spots','spots',creator.pattern,'pattern')}${option('Stars','stars',creator.pattern,'pattern')}${option('Waves','waves',creator.pattern,'pattern')}</div><b>Ancient mark</b><div class="ao-options">${['✦','❖','☾','⚡'].map(m=>option(m,m,creator.mark,'mark')).join('')}</div><label><input type="checkbox" class="ao-glow" ${creator.glow?'checked':''}> Add a magical glow</label><div class="ao-actions"><button class="ao-back">← BACK</button><button class="ao-next">AWAKEN IT →</button></div>`;
  } else if (step === 2) {
    copy.innerHTML = `<h2>The egg hears you</h2><p>A small heartbeat answers from inside. Choose what your first companion will be called. The exact species will remain a surprise until it hatches.</p><input class="ao-field ao-name" maxlength="14" value="${creator.name}" aria-label="Companion name"><p class="ao-note">Your egg can hatch into different monsters from its affinity family. Later you can discover eggs and wild monsters from every region and rarity.</p><div class="ao-actions"><button class="ao-back">← BACK</button><button class="ao-next">SHOW ME THE WORLD →</button></div>`;
  } else if (step === 3) {
    preview.innerHTML = `<div style="font-size:120px;filter:drop-shadow(0 12px 12px rgba(23,50,77,.2))">🗺️</div>`;
    copy.innerHTML = `<h2>Five countries are waiting</h2><div class="ao-story"><div>🌿 Verdara — forests, ecosystems and stories</div><div>☀️ Solara — trade, geometry and architecture</div><div>🌊 Mizuno — seasons, engineering and poetry</div><div>⛰️ Amaru — patterns, farming and astronomy</div><div>❄️ Aurora Reach — weather, navigation and safety</div></div><p>NPCs give missions. Subject trainers challenge you. Gyms teach school topics in depth. Wild monsters appear in habitats, ruins, festivals and hidden paths.</p><div class="ao-actions"><button class="ao-back">← BACK</button><button class="ao-next">CHOOSE MY START →</button></div>`;
  } else {
    preview.innerHTML = eggPreview();
    const years = creator.stage === 'primary' ? [1,2,3,4,5,6] : [7,8,9,10,11,12];
    copy.innerHTML = `<h2>Where should ASCEND begin?</h2><p>Your school year only chooses the first doorway. The hidden learning engine will quietly move each skill up or down to find the right challenge.</p><div class="ao-options">${option('PRIMARY · Years 1–6','primary',creator.stage,'stage')}${option('SECONDARY · Years 7–12','secondary',creator.stage,'stage')}</div><div class="ao-options">${years.map(y=>option(`Year ${y}`,String(y),String(creator.year),'year')).join('')}</div><p class="ao-note">The opening encounters are part of the story. They help your companion learn how to support you; they are not a grade.</p><div class="ao-actions"><button class="ao-back">← BACK</button><button class="ao-next ao-finish">BEGIN THE AWAKENING</button></div>`;
  }
  bind();
}

function bind() {
  onboarding.querySelectorAll('[data-group]').forEach(button => button.onclick = () => {
    const group = button.dataset.group;
    const value = button.dataset.value;
    if (group === 'year') creator.year = Number(value);
    else creator[group] = value;
    if (group === 'stage') creator.year = value === 'primary' ? 1 : 7;
    render();
  });
  onboarding.querySelectorAll('[data-colour]').forEach(button => button.onclick = () => { creator.colour = button.dataset.colour; render(); });
  onboarding.querySelector('.ao-glow')?.addEventListener('change', event => { creator.glow = event.target.checked; render(); });
  onboarding.querySelector('.ao-name')?.addEventListener('input', event => { creator.name = event.target.value.replace(/[^a-zA-Z0-9 '\-]/g, '').slice(0,14); });
  onboarding.querySelector('.ao-back')?.addEventListener('click', () => { step = Math.max(0, step - 1); render(); });
  onboarding.querySelector('.ao-next')?.addEventListener('click', () => {
    if (step < steps.length - 1) { step += 1; render(); return; }
    const profile = loadProfile();
    profile.stage = creator.stage;
    profile.schoolYear = creator.year;
    profile.egg = `${creator.affinity[0].toUpperCase()+creator.affinity.slice(1)} Custom Egg`;
    profile.companion = creator.name.trim() || 'Nova';
    profile.diagnosticComplete = false;
    profile.diagnosticIndex = 0;
    profile.onboardingComplete = true;
    profile.eggDesign = { affinity: creator.affinity, colour: creator.colour, spot: creator.spot, pattern: creator.pattern, glow: creator.glow, mark: creator.mark };
    saveProfile(profile);
    location.reload();
  });
}

const profile = loadProfile();
if (!profile.onboardingComplete && !profile.diagnosticComplete) {
  document.body.classList.add('ascend-onboarding-active');
  onboarding.classList.add('open');
  render();
}
