import { hatchCreature, addCreatureToCollection, createCollectionState, getSpecies } from './creature-system.js';

const KEY = 'ascend_project_kayla_v4';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } };
const save = (profile) => localStorage.setItem(KEY, JSON.stringify(profile));

const profileAtLoad = load();
if (profileAtLoad.onboardingComplete && !profileAtLoad.openingAdventureComplete) {
  const style = document.createElement('style');
  style.textContent = `
  #ascend-opening-adventure{position:fixed;inset:0;z-index:490000;display:grid;place-items:center;overflow:auto;padding:max(14px,env(safe-area-inset-top)) max(12px,env(safe-area-inset-right)) max(18px,env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left));background:radial-gradient(circle at 18% 8%,#fff9,transparent 22%),linear-gradient(180deg,#82e4ff,#d9f8df 62%,#74cf6d);font-family:Nunito,Arial;color:#17324d}
  .oa-shell{width:min(980px,100%);margin:auto}.oa-progress{display:flex;gap:7px;margin:0 0 12px}.oa-progress i{height:9px;flex:1;border-radius:99px;background:#fff8}.oa-progress i.on{background:#6b4cc5}.oa-card{display:grid;grid-template-columns:minmax(260px,.9fr) minmax(320px,1.1fr);gap:20px;padding:22px;border:7px solid #fff;border-radius:32px;background:#fff8df;box-shadow:0 22px 60px #17324d35}.oa-stage{min-height:420px;position:relative;display:grid;place-items:center;overflow:hidden;border-radius:25px;background:linear-gradient(#b8f1ff,#e4f8da 65%,#80d471)}.oa-stage:after{content:'';position:absolute;bottom:36px;width:55%;height:25px;border-radius:50%;background:#17324d22;filter:blur(3px)}.oa-copy h1{margin:0;color:#6b4cc5;font:800 clamp(36px,5vw,58px) 'Baloo 2',Arial}.oa-copy h2{margin:0 0 10px;font:800 28px 'Baloo 2',Arial}.oa-copy p{font-size:18px;line-height:1.45}.oa-actions{display:flex;gap:10px;margin-top:18px}.oa-btn{min-height:54px;border:4px solid #fff;border-radius:17px;padding:12px 18px;background:#6b4cc5;color:#fff;font:900 17px Nunito;cursor:pointer;touch-action:manipulation}.oa-btn.secondary{background:#eef7ff;color:#17324d}.oa-btn.gold{background:#ffca57;color:#61420c}.oa-egg{width:190px;height:245px;border-radius:52% 52% 47% 47%/63% 63% 38% 38%;position:relative;z-index:2;border:10px solid var(--edge,#fff);background:var(--shell,#9b83f4);box-shadow:0 0 0 17px #fff3,0 20px 44px #17324d35;animation:oaPulse .8s ease-in-out infinite alternate}.oa-egg.cracking{animation:oaCrack .22s linear infinite alternate}.oa-egg span{position:absolute;inset:0;display:grid;place-items:center;font-size:58px;color:var(--mark,#ffd75e);filter:drop-shadow(0 3px #fff)}.oa-burst{position:absolute;font-size:150px;z-index:4;animation:oaBurst .9s ease-out forwards}.oa-creature{position:relative;z-index:3;font-size:145px;animation:oaRise .8s ease-out}.oa-mira{font-size:150px;position:relative;z-index:2}.oa-mission{display:grid;gap:10px}.oa-task{padding:13px 14px;border-radius:16px;background:#eef7ff;font-weight:900}.oa-task.done{background:#dff6df}.oa-shard{position:relative;z-index:3;width:110px;height:145px;clip-path:polygon(50% 0,90% 70%,50% 100%,10% 70%);background:linear-gradient(135deg,#fff,#6fdcff 40%,#8d72e8);filter:drop-shadow(0 12px 10px #17324d44);cursor:pointer;animation:oaFloat 1.2s infinite alternate}.oa-battle-head{display:flex;justify-content:space-between;gap:10px;margin-bottom:12px}.oa-health{height:14px;flex:1;border-radius:99px;background:#d7e2eb;overflow:hidden}.oa-health i{display:block;height:100%;width:100%;background:#73d8bd;transition:width .3s}.oa-question{padding:15px;border-radius:17px;background:#fff;font-size:22px;font-weight:900}.oa-options{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:12px}.oa-options button{min-height:54px;border:4px solid #fff;border-radius:15px;background:#d9d0ff;color:#17324d;font:900 18px Nunito;cursor:pointer;touch-action:manipulation}.oa-support{display:flex;gap:8px;margin-top:10px}.oa-support button{min-height:46px;border:3px solid #fff;border-radius:14px;padding:9px 13px;background:#eef7ff;color:#17324d;font:900 15px Nunito;cursor:pointer}.oa-help{display:none;margin-top:9px;padding:13px;border-radius:14px;background:#fff0b8;font-weight:800;line-height:1.4}.oa-help.open{display:block}.oa-feedback{min-height:28px;margin-top:10px;font-weight:900}.oa-reward{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:14px 0}.oa-reward div{padding:13px;border-radius:15px;background:#eef7ff;text-align:center;font-weight:900}@keyframes oaPulse{to{transform:translateY(-8px) scale(1.02)}}@keyframes oaCrack{to{transform:rotate(3deg) scale(1.03)}}@keyframes oaBurst{from{transform:scale(.2);opacity:1}to{transform:scale(1.8);opacity:0}}@keyframes oaRise{from{transform:translateY(70px) scale(.4);opacity:0}to{transform:none;opacity:1}}@keyframes oaFloat{to{transform:translateY(-13px) rotate(2deg)}}
  @media(max-width:760px){#ascend-opening-adventure{align-items:start}.oa-card{grid-template-columns:1fr;padding:14px;border-radius:24px}.oa-stage{min-height:250px}.oa-copy h2{font-size:24px}.oa-copy p{font-size:16px}.oa-egg{width:130px;height:170px}.oa-creature,.oa-mira{font-size:100px}.oa-options{grid-template-columns:1fr}.oa-actions{position:sticky;bottom:0;padding:10px 0 calc(4px + env(safe-area-inset-bottom));background:linear-gradient(transparent,#fff8df 25%);z-index:8}}
  `;
  document.head.appendChild(style);

  const root = document.createElement('section');
  root.id = 'ascend-opening-adventure';
  root.innerHTML = '<div class="oa-shell"><div class="oa-progress"></div><div class="oa-card"><div class="oa-stage"></div><div class="oa-copy"></div></div></div>';
  document.body.appendChild(root);
  document.body.classList.add('ascend-onboarding-active');

  const state = { step: 0, shard: false, round: 0, correct: 0, revealed: null };
  const questions = [
    { subject:'Mathematics', prompt:'A bridge needs 4 crystal rows with 6 crystals in each row. How many crystals are needed?', answer:'24', options:['10','20','24','46'], hint:'Think of four groups of six, or add 6 + 6 + 6 + 6.', explanation:'Four equal groups of six means 4 × 6. That equals 24.' },
    { subject:'English', prompt:'Which sentence gives the clearest complete instruction?', answer:'Place the crystal beside the blue marker.', options:['Crystal there.','Place the crystal beside the blue marker.','Beside it maybe','The blue.'], hint:'Look for a sentence with an action, an object and a clear location.', explanation:'“Place” tells the action, “the crystal” tells what to move, and “beside the blue marker” tells exactly where.' },
    { subject:'Science', prompt:'Why does the crystal glow more brightly when placed in sunlight?', answer:'It receives more light energy.', options:['It becomes heavier.','It receives more light energy.','The air disappears.','Its colour stops existing.'], hint:'Think about what sunlight supplies to the crystal.', explanation:'Sunlight carries energy. In this story, the crystal absorbs more light energy and releases it as a brighter glow.' },
    { subject:'Humanities', prompt:'Which map feature helps you work out direction?', answer:'A compass rose', options:['A title','A compass rose','A picture border','A page number'], hint:'Look for the feature that shows north, south, east and west.', explanation:'A compass rose labels the main directions and helps readers orient themselves on a map.' },
    { subject:'Mathematics', prompt:'One half of 18 path stones are restored. How many stones is that?', answer:'9', options:['6','8','9','36'], hint:'One half means split the total into two equal groups.', explanation:'18 divided into two equal groups gives 9 in each group, so one half of 18 is 9.' }
  ];

  function eggHtml(cracking=false) {
    const d = load().eggDesign || {};
    return `<div class="oa-egg ${cracking?'cracking':''}" style="--shell:${d.shell||d.colour||'#9b83f4'};--edge:${d.accent||'#fff'};--mark:${d.markColour||'#ffd75e'}"><span>${d.mark||'✦'}</span></div>`;
  }
  function progress() { root.querySelector('.oa-progress').innerHTML = [0,1,2,3,4].map(i=>`<i class="${i<=state.step?'on':''}"></i>`).join(''); }
  function nextButton(label='CONTINUE →', extra='') { return `<div class="oa-actions"><button class="oa-btn ${extra}" data-next>${label}</button></div>`; }

  function render() {
    progress();
    const stage = root.querySelector('.oa-stage');
    const copy = root.querySelector('.oa-copy');
    const p = load();
    if (state.step === 0) {
      stage.innerHTML = eggHtml(false);
      copy.innerHTML = `<h1>The Awakening</h1><h2>${p.companion || 'Your companion'} is ready.</h2><p>Your painted egg has carried a mystery through the first gate. It will now reveal the species that chose to begin this journey beside you.</p><div class="oa-mission"><div class="oa-task">🥚 Hatch your personalised egg</div><div class="oa-task">✨ Meet the creature inside</div><div class="oa-task">🧭 Complete your first world mission</div></div>${nextButton('BEGIN HATCHING →','gold')}`;
    } else if (state.step === 1) {
      if (!state.revealed) {
        const family = (p.eggDesign?.affinity || 'starlight');
        state.revealed = hatchCreature(family);
      }
      const species = getSpecies(state.revealed.speciesId);
      stage.innerHTML = `<div class="oa-burst">✨</div><div class="oa-creature">${state.revealed.familyId==='bloom'?'🌱':state.revealed.familyId==='tide'?'🐳':'🌟'}</div>`;
      copy.innerHTML = `<h2>${p.companion || species?.name || 'Your companion'} has hatched!</h2><p><b>Species:</b> ${species?.name || state.revealed.nickname}<br><b>Rarity:</b> ${String(state.revealed.rarity).toUpperCase()}<br><b>Affinity:</b> ${state.revealed.familyId}</p><p>This creature has four evolution stages. It grows through exploration, learning battles, care and the bond you build together.</p>${nextButton('MEET MIRA →')}`;
    } else if (state.step === 2) {
      stage.innerHTML = '<div class="oa-mira">🧙🏽‍♀️</div>';
      copy.innerHTML = `<h2>Mira, Keeper of the First Path</h2><p>“Welcome, ${p.companion || 'traveller'}. The world does not need perfect answers. It needs explorers who notice, test ideas and try again.”</p><p>A Memory Shard has fallen near the village gate. Find it, then use what you know to restore its power.</p><div class="oa-mission"><div class="oa-task done">✓ Hatch your companion</div><div class="oa-task">Find the Memory Shard</div><div class="oa-task">Restore it through a learning battle</div></div>${nextButton('SEARCH THE PATH →','gold')}`;
    } else if (state.step === 3 && !state.shard) {
      stage.innerHTML = '<button class="oa-shard" aria-label="Collect Memory Shard"></button>';
      copy.innerHTML = `<h2>A light flickers beside the path</h2><p>Tap the crystal to collect it. This is exploration—not a question. The world will contain hidden objects, tracks, eggs, NPC requests and secret habitats.</p><div class="oa-feedback">Memory Shard: not collected</div>`;
      stage.querySelector('.oa-shard').onclick = () => { state.shard = true; render(); };
    } else if (state.step === 3) {
      stage.innerHTML = '<div class="oa-creature">💎</div>';
      copy.innerHTML = `<h2>Memory Shard collected!</h2><p>The shard contains five broken memories. Each restored memory helps your companion understand how you learn.</p><div class="oa-mission"><div class="oa-task done">✓ Explore and collect</div><div class="oa-task">Complete five short learning encounters</div><div class="oa-task">Use Hint or Explain whenever needed</div></div>${nextButton('RESTORE THE SHARD →','gold')}`;
    } else if (state.step === 4 && state.round < questions.length) {
      const q = questions[state.round];
      stage.innerHTML = `<div style="width:82%;z-index:3"><div class="oa-battle-head"><b>${p.companion || 'Companion'}</b><div class="oa-health"><i style="width:${Math.max(20,100-state.round*16)}%"></i></div><b>Memory ${state.round+1}/5</b></div><div class="oa-creature" style="font-size:90px;text-align:center">${state.revealed?.familyId==='bloom'?'🌱':state.revealed?.familyId==='tide'?'🐳':'🌟'} ⚔️ 👾</div></div>`;
      copy.innerHTML = `<h2>${q.subject} memory</h2><div class="oa-question">${q.prompt}</div><div class="oa-options">${q.options.map(o=>`<button data-answer="${o.replace(/"/g,'&quot;')}">${o}</button>`).join('')}</div><div class="oa-support"><button data-hint>💡 Hint</button><button data-explain>📖 Explain it</button></div><div class="oa-help"></div><div class="oa-feedback">Choose an answer, or ask for support first.</div>`;
      const help = copy.querySelector('.oa-help');
      copy.querySelector('[data-hint]').onclick = () => { help.textContent = q.hint; help.classList.add('open'); };
      copy.querySelector('[data-explain]').onclick = () => { help.textContent = q.explanation; help.classList.add('open'); };
      copy.querySelectorAll('[data-answer]').forEach(btn => btn.onclick = () => {
        if (btn.dataset.answer === q.answer) {
          state.correct += 1; state.round += 1;
          copy.querySelector('.oa-feedback').textContent = 'Correct—memory restored!';
          copy.querySelectorAll('[data-answer]').forEach(b=>b.disabled=true);
          setTimeout(render, 650);
        } else {
          btn.disabled = true;
          copy.querySelector('.oa-feedback').textContent = 'Not yet. Try another answer or open Hint / Explain it.';
        }
      });
    } else {
      stage.innerHTML = '<div class="oa-creature">🏡✨</div>';
      copy.innerHTML = `<h2>The village path is restored</h2><p>${p.companion || 'Your companion'} learned that support is part of strength. You can use hints and explanations throughout ASCEND without losing the chance to learn.</p><div class="oa-reward"><div>+100 XP</div><div>+60 coins</div><div>Verdara unlocked</div></div><p>Your first full loop is complete: hatch → explore → collect → learn → restore → earn a reward.</p>${nextButton('ENTER CRYSTALBROOK →','gold')}`;
    }
    root.querySelector('[data-next]')?.addEventListener('click', advance);
  }

  function advance() {
    if (state.step < 4) { state.step += 1; render(); return; }
    if (state.round < questions.length) return;
    const p = load();
    p.collection = createCollectionState(p.collection || {});
    if (!p.collection.creatures.some(c => c.isStarter)) {
      state.revealed.nickname = p.companion || state.revealed.nickname;
      state.revealed.isStarter = true;
      p.collection = addCreatureToCollection(p.collection, state.revealed);
    }
    p.xp = (p.xp || 0) + 100;
    p.coins = (p.coins || 0) + 60;
    p.openingAdventureComplete = true;
    p.diagnosticComplete = true;
    p.tutorialEvidence = { correct: state.correct, total: questions.length, completedAt: new Date().toISOString() };
    p.mastery = p.mastery || {};
    p.mastery.placeValue = Math.max(.25, Number(p.mastery.placeValue || 0));
    save(p);
    document.body.classList.remove('ascend-onboarding-active');
    root.remove();
    setTimeout(() => document.getElementById('ascend-region-button')?.click(), 250);
  }
  render();
}
