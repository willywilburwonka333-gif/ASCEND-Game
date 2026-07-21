import { COUNTRIES, MISSION_TEMPLATES, countryById, createWorldState } from './world-data.js';
import { MONSTER_CATALOG, addCreatureToCollection, createCollectionState } from './creature-system.js';

const PROFILE_KEY = 'ascend_project_kayla_v4';

function loadProfile() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}'); } catch { return {}; }
}

function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function ensureExpansion(profile) {
  profile.world = createWorldState(profile.world || {});
  profile.collection = createCollectionState(profile.collection || {});
  return profile;
}

function activeMission(world, countryId) {
  const progress = world.progress[countryId];
  return MISSION_TEMPLATES[Math.min(progress.missionIndex, MISSION_TEMPLATES.length - 1)];
}

function regionalPool(country) {
  return MONSTER_CATALOG.filter((monster) => !monster.isGold && country.eggFamilies.includes(monster.familyId));
}

function weightedMonster(country) {
  const pool = regionalPool(country);
  const weights = { common: 60, uncommon: 25, rare: 10, epic: 4, legendary: 1 };
  const roll = Math.random() * 100;
  let cursor = 0;
  let rarity = 'common';
  for (const key of ['legendary', 'epic', 'rare', 'uncommon', 'common']) {
    cursor += weights[key];
    if (roll < cursor) { rarity = key; break; }
  }
  const rarityPool = pool.filter((monster) => monster.rarity === rarity);
  return rarityPool[Math.floor(Math.random() * rarityPool.length)] || pool[0];
}

function createCaughtCreature(species) {
  return {
    uid: `${species.id}-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    catalogNumber: species.number,
    familyId: species.familyId,
    speciesId: species.id,
    baseSpeciesId: species.baseSpeciesId || species.id,
    nickname: species.name,
    rarity: species.rarity,
    isGold: Boolean(species.isGold),
    evolutionStage: 0,
    bondXp: 0,
    level: 1,
    discoveredAt: new Date().toISOString(),
    caughtIn: null,
  };
}

const style = document.createElement('style');
style.textContent = `
  #ascend-world-button{position:fixed;right:max(14px,env(safe-area-inset-right));top:max(14px,env(safe-area-inset-top));z-index:120000;border:4px solid #fff;border-radius:18px;padding:12px 18px;background:#6b4cc5;color:#fff;font:800 15px Nunito,sans-serif;box-shadow:0 8px 24px rgba(23,50,77,.28);cursor:pointer}
  #ascend-world-overlay{position:fixed;inset:0;z-index:130000;display:none;overflow:auto;padding:calc(18px + env(safe-area-inset-top)) calc(18px + env(safe-area-inset-right)) calc(24px + env(safe-area-inset-bottom)) calc(18px + env(safe-area-inset-left));background:linear-gradient(180deg,#8ee7ff,#dff7d8 58%,#7fd778);font-family:Nunito,sans-serif;color:#17324d}
  #ascend-world-overlay.open{display:block}
  .aw-shell{max-width:1100px;margin:auto}.aw-top{display:flex;justify-content:space-between;align-items:center;gap:12px}.aw-close{border:0;border-radius:14px;padding:11px 16px;background:#17324d;color:#fff;font-weight:800;cursor:pointer}
  .aw-map{display:grid;grid-template-columns:repeat(5,minmax(150px,1fr));gap:12px;margin:18px 0}.aw-country{min-height:150px;border:5px solid #fff;border-radius:24px;padding:16px;background:var(--c);color:#17324d;box-shadow:0 10px 25px rgba(23,50,77,.16);cursor:pointer;text-align:left}.aw-country.locked{filter:grayscale(.9);opacity:.55}.aw-country.active{outline:6px solid #ffca57}.aw-country strong{display:block;font:800 23px 'Baloo 2',sans-serif}.aw-country small{font-weight:800}
  .aw-panel{background:rgba(255,248,223,.96);border:5px solid #fff;border-radius:26px;padding:20px;box-shadow:0 14px 35px rgba(23,50,77,.16)}.aw-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:16px}.aw-card{background:#fff;border-radius:18px;padding:15px;margin-bottom:12px}.aw-card h3{margin:0 0 8px;color:#6b4cc5}.aw-npcs{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.aw-npc{padding:11px;border-radius:14px;background:#eaf8ef}.aw-actions{display:flex;flex-wrap:wrap;gap:10px}.aw-action{border:4px solid #fff;border-radius:15px;padding:12px 16px;background:#73d8bd;color:#17324d;font-weight:900;cursor:pointer}.aw-action.primary{background:#ffca57}.aw-action.purple{background:#8d72e8;color:#fff}.aw-result{min-height:76px;margin-top:12px;padding:14px;border-radius:16px;background:#eef7ff;font-weight:800;white-space:pre-line}.aw-progress{height:16px;border-radius:999px;background:#ddd;overflow:hidden}.aw-progress span{display:block;height:100%;background:#73d8bd}.aw-note{font-size:13px;color:#46677c}
  @media(max-width:850px){.aw-map{grid-template-columns:repeat(2,1fr)}.aw-grid{grid-template-columns:1fr}.aw-country{min-height:110px}.aw-npcs{grid-template-columns:1fr}#ascend-world-button{top:auto;bottom:calc(92px + env(safe-area-inset-bottom));right:12px}}
`;
document.head.appendChild(style);

const button = document.createElement('button');
button.id = 'ascend-world-button';
button.textContent = '🗺️ WORLD';
document.body.appendChild(button);

const overlay = document.createElement('section');
overlay.id = 'ascend-world-overlay';
overlay.innerHTML = `<div class="aw-shell"><div class="aw-top"><div><h1 style="margin:0;font-family:'Baloo 2',sans-serif;color:#6b4cc5">The Five Countries</h1><div>Explore, meet people, learn local traditions and discover regional monsters.</div></div><button class="aw-close">BACK TO GAME</button></div><div class="aw-map"></div><div class="aw-panel"></div></div>`;
document.body.appendChild(overlay);

let selectedCountryId = 'verdara';
let encounter = null;
let trackingClues = 0;

function render() {
  const profile = ensureExpansion(loadProfile());
  saveProfile(profile);
  const world = profile.world;
  selectedCountryId = selectedCountryId || world.currentCountry;
  const map = overlay.querySelector('.aw-map');
  map.innerHTML = '';

  COUNTRIES.forEach((country) => {
    const progress = world.progress[country.id];
    const card = document.createElement('button');
    card.className = `aw-country ${progress.unlocked ? '' : 'locked'} ${country.id === selectedCountryId ? 'active' : ''}`;
    card.style.setProperty('--c', country.colour);
    card.innerHTML = `<div style="font-size:32px">${country.icon}</div><strong>${country.name}</strong><small>${country.subtitle}</small><div style="margin-top:8px">Mission ${Math.min(progress.missionIndex + 1, 5)}/5 · Caught ${progress.monstersCaught}</div>`;
    card.onclick = () => {
      if (!progress.unlocked) return;
      selectedCountryId = country.id;
      world.currentCountry = country.id;
      if (!world.visitedCountries.includes(country.id)) world.visitedCountries.push(country.id);
      saveProfile(profile);
      encounter = null;
      trackingClues = 0;
      render();
    };
    map.appendChild(card);
  });

  const country = countryById(selectedCountryId);
  const progress = world.progress[country.id];
  const mission = activeMission(world, country.id);
  const missionPercent = Math.min(100, (progress.missionProgress / mission.goal) * 100);
  const panel = overlay.querySelector('.aw-panel');
  panel.innerHTML = `
    <div class="aw-grid">
      <div>
        <h2 style="margin-top:0;font-family:'Baloo 2',sans-serif;color:${country.colour}">${country.icon} ${country.name}: ${country.subtitle}</h2>
        <div class="aw-card"><h3>Culture Journal</h3><p><b>Greeting:</b> “${country.culture.greeting}”</p><p><b>Community values:</b> ${country.culture.values.join(', ')}.</p><p><b>Arts:</b> ${country.culture.arts}.</p><p><b>Food traditions:</b> ${country.culture.food}.</p><p><b>Learning themes:</b> ${country.culture.learning}.</p><div class="aw-note">These are fictional cultures designed to teach curiosity, comparison and respect. Any future real-world culture packs should be reviewed by cultural educators and community representatives.</div></div>
        <div class="aw-card"><h3>People to Meet</h3><div class="aw-npcs">${country.npcs.map((npc) => `<div class="aw-npc"><b>${npc.name}</b><br>${npc.role}<br><small>${npc.teaches}</small></div>`).join('')}</div></div>
        <div class="aw-card"><h3>Places</h3>${country.locations.map((place) => `<span style="display:inline-block;margin:4px;padding:7px 10px;border-radius:999px;background:#eef7ff;font-weight:800">${place}</span>`).join('')}</div>
      </div>
      <div>
        <div class="aw-card"><h3>Current Mission</h3><b>${mission.title}</b><p>${mission.description}</p><div class="aw-progress"><span style="width:${missionPercent}%"></span></div><p>${progress.missionProgress}/${mission.goal}</p><div class="aw-actions"><button class="aw-action primary" data-action="mission">DO MISSION</button><button class="aw-action purple" data-action="expedition">TRACK MONSTER</button></div><div class="aw-result">Choose a mission or begin tracking a regional monster.</div></div>
        <div class="aw-card"><h3>Regional Monster Habitat</h3><p>${country.eggFamilies.map((family) => `${family[0].toUpperCase() + family.slice(1)} creatures`).join(' and ')} live here.</p><p>Monsters are found through habitat clues, NPC knowledge, story missions, shrines, eggs and rare field encounters. They are befriended rather than harmed.</p><div class="aw-actions"><button class="aw-action" data-action="clue">SEARCH FOR CLUE</button><button class="aw-action" data-action="catch">BOND / CATCH</button></div></div>
        <div class="aw-card"><h3>Country Progress</h3><p>Culture lessons: ${progress.cultureLessons}<br>Monsters caught: ${progress.monstersCaught}<br>Guardian: ${progress.guardianCleared ? 'Restored' : 'Waiting'}</p></div>
      </div>
    </div>`;

  const result = panel.querySelector('.aw-result');
  panel.querySelector('[data-action="mission"]').onclick = () => completeMissionStep(profile, country, result);
  panel.querySelector('[data-action="expedition"]').onclick = () => startEncounter(country, result);
  panel.querySelector('[data-action="clue"]').onclick = () => findClue(country, result);
  panel.querySelector('[data-action="catch"]').onclick = () => catchEncounter(profile, country, result);
}

function completeMissionStep(profile, country, result) {
  const progress = profile.world.progress[country.id];
  const mission = activeMission(profile.world, country.id);
  const npc = country.npcs[(progress.missionIndex + progress.missionProgress) % country.npcs.length];
  progress.missionProgress += 1;
  if (mission.type === 'culture') progress.cultureLessons += 1;
  result.textContent = `${npc.name}, ${npc.role}, shares a lesson about ${npc.teaches}.\n\nMission progress: ${Math.min(progress.missionProgress, mission.goal)}/${mission.goal}.`;

  if (progress.missionProgress >= mission.goal) {
    progress.missionIndex += 1;
    progress.missionProgress = 0;
    profile.xp = (profile.xp || 0) + 40;
    profile.coins = (profile.coins || 0) + 20;
    if (mission.type === 'guardian') {
      progress.guardianCleared = true;
      profile.collection.eggs.push({ familyId: country.eggFamilies[0], source: country.id, earnedAt: new Date().toISOString() });
      const index = COUNTRIES.findIndex((item) => item.id === country.id);
      if (COUNTRIES[index + 1]) profile.world.progress[COUNTRIES[index + 1].id].unlocked = true;
      result.textContent += '\n\nCountry restored! A regional egg was earned and the next country is unlocked.';
    } else {
      result.textContent += `\n\nMission complete: +40 XP, +20 coins. Next mission unlocked.`;
    }
  }
  saveProfile(profile);
  setTimeout(render, 900);
}

function startEncounter(country, result) {
  encounter = weightedMonster(country);
  trackingClues = 0;
  result.textContent = `A ${encounter.rarity.toUpperCase()} presence has been detected near ${country.locations[Math.floor(Math.random() * country.locations.length)]}. Find three habitat clues before trying to bond with it.`;
}

function findClue(country, result) {
  if (!encounter) startEncounter(country, result);
  trackingClues = Math.min(3, trackingClues + 1);
  const clues = ['unusual tracks beside the path', 'a call that matches the habitat', 'food or nesting signs left nearby'];
  result.textContent = `Clue ${trackingClues}/3: You found ${clues[trackingClues - 1]}.\n${trackingClues === 3 ? `${encounter.name} has appeared. Complete the bonding step to invite it to join you.` : 'Keep searching.'}`;
}

function catchEncounter(profile, country, result) {
  if (!encounter) return result.textContent = 'Track a monster first.';
  if (trackingClues < 3) return result.textContent = `You need ${3 - trackingClues} more habitat clue${3 - trackingClues === 1 ? '' : 's'} before approaching safely.`;
  const baseChance = { common: .94, uncommon: .78, rare: .58, epic: .34, legendary: .14 }[encounter.rarity] || .5;
  const knowledgeBonus = Math.min(.2, ((profile.totalCorrect || 0) / Math.max(20, profile.totalAttempts || 20)) * .2);
  if (Math.random() > baseChance + knowledgeBonus) {
    trackingClues = 1;
    result.textContent = `${encounter.name} is still cautious. It left safely, but you retained one clue. Learn more, then try again.`;
    return;
  }
  const creature = createCaughtCreature(encounter);
  creature.caughtIn = country.id;
  profile.collection = addCreatureToCollection(profile.collection, creature);
  profile.world.progress[country.id].monstersCaught += 1;
  profile.xp = (profile.xp || 0) + 55;
  saveProfile(profile);
  result.textContent = `${encounter.name} chose to join your collection!\nRarity: ${encounter.rarity.toUpperCase()} · +55 XP`;
  encounter = null;
  trackingClues = 0;
  setTimeout(render, 1200);
}

button.onclick = () => { overlay.classList.add('open'); render(); };
overlay.querySelector('.aw-close').onclick = () => overlay.classList.remove('open');
window.addEventListener('keydown', (event) => { if (event.key === 'Escape') overlay.classList.remove('open'); });
