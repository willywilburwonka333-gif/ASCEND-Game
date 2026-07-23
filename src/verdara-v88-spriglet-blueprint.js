import { getSpecies } from './creature-system.js';

const app=document.getElementById('app');
const SAVE_KEY='ascend_verdara_chapter_v2';
const BLUEPRINT_VERSION=1;

const style=document.createElement('style');
style.textContent=`
.v88-spriglet{width:100%;height:100%;display:block;overflow:visible;filter:drop-shadow(0 6px 5px #17324d38)}
.v88-spriglet .idle{transform-origin:50% 82%;animation:v88Idle 1.15s ease-in-out infinite alternate}
.v88-spriglet .earL,.v88-spriglet .earR{transform-box:fill-box;transform-origin:bottom center;animation:v88Ear 1.8s ease-in-out infinite alternate}
.v88-spriglet .earR{animation-delay:.35s}
.v88-spriglet .goldGlow{display:none}.v88-spriglet.gold .goldGlow{display:block;animation:v88Glow 1.1s ease-in-out infinite alternate}
@keyframes v88Idle{to{transform:translateY(-2px) rotate(1deg)}}
@keyframes v88Ear{to{transform:rotate(5deg)}}
@keyframes v88Glow{to{opacity:.35;transform:scale(1.08)}}
.v88-blueprint-chip{display:inline-flex;align-items:center;gap:5px;margin-top:5px;padding:3px 8px;border-radius:999px;background:#17324d;color:#fff;font:800 10px system-ui}
.fighter.playerSide .monsterBody.v88-battle-body{width:104px;height:88px;padding:0;background:transparent;border:0;box-shadow:none;border-radius:0;font-size:0}
.v85-world-follower.v88-blueprint-follower{width:64px!important;height:60px!important}
.v85-preview .v88-spriglet{width:92px;height:84px}.v85-mini .v88-spriglet{width:58px;height:54px}
`;
document.head.appendChild(style);

function load(){try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'{}')}catch{return{}}}
function save(s){try{localStorage.setItem(SAVE_KEY,JSON.stringify(s))}catch{}}
function validHex(v,fallback){return /^#[0-9a-f]{6}$/i.test(v||'')?v:fallback}
function mix(hex,amount){const n=parseInt(hex.slice(1),16),r=Math.max(0,Math.min(255,(n>>16)+amount)),g=Math.max(0,Math.min(255,((n>>8)&255)+amount)),b=Math.max(0,Math.min(255,(n&255)+amount));return`#${((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}`}
function zoneColours(monster){
 const d=monster?.design||{};
 const body=validHex(d.base,monster?.familyId==='starlight'?'#9b83f4':monster?.familyId==='tide'?'#65c9cf':'#8fd875');
 const head=validHex(d.brush,mix(body,18));
 const marking=validHex(d.accent,mix(body,-38));
 return monster?.isGold?{body:'#e3bc45',head:'#ffe68a',marking:'#9d7410'}:{body,head,marking};
}
function patternSvg(pattern,marking){
 if(pattern==='spots')return`<g fill="${marking}" opacity=".95"><circle cx="43" cy="47" r="6"/><circle cx="64" cy="57" r="5"/><circle cx="50" cy="67" r="4"/></g>`;
 if(pattern==='stars')return`<g fill="${marking}"><path d="M46 42l2.2 5 5.4.5-4.1 3.6 1.2 5.3-4.7-2.7-4.7 2.7 1.2-5.3-4.1-3.6 5.4-.5z"/><path d="M66 61l1.5 3.3 3.6.3-2.7 2.4.8 3.5-3.2-1.8-3.1 1.8.8-3.5-2.7-2.4 3.6-.3z"/></g>`;
 if(pattern==='stripes')return`<g stroke="${marking}" stroke-width="5" stroke-linecap="round"><path d="M35 45l18 8"/><path d="M37 58l21 9"/><path d="M58 43l16 7"/></g>`;
 if(pattern==='wave')return`<path d="M31 58c9-10 17 9 27-1s17 6 25-3" fill="none" stroke="${marking}" stroke-width="6" stroke-linecap="round"/>`;
 return`<path d="M50 48c5-5 12-5 17 0-5 5-12 5-17 0z" fill="${marking}"/>`;
}
function sprigletSvg(monster,label='Spriglet'){
 const c=zoneColours(monster),pattern=monster?.design?.pattern||'none',gold=monster?.isGold?' gold':'';
 return`<svg class="v88-spriglet${gold}" viewBox="0 0 110 100" role="img" aria-label="${label}"><ellipse class="goldGlow" cx="55" cy="54" rx="49" ry="40" fill="#ffd85d" opacity=".18"/><g class="idle"><path class="earL" d="M31 31C14 19 15 7 38 19l7 17z" fill="${c.marking}" stroke="#fff" stroke-width="4"/><path class="earR" d="M75 31C93 17 96 8 72 19l-7 17z" fill="${c.marking}" stroke="#fff" stroke-width="4"/><path d="M30 56c-7 25 9 35 26 35s35-10 29-35C81 39 70 32 56 32S35 39 30 56z" fill="${c.body}" stroke="#fff" stroke-width="5"/><path d="M37 36c2-18 12-27 20-27s18 9 19 27c-6 6-13 9-20 9s-14-3-19-9z" fill="${c.head}" stroke="#fff" stroke-width="5"/><path d="M54 11c-7-7-5-12 2-9 7-4 10 2 3 9" fill="${c.marking}" stroke="#fff" stroke-width="3"/><circle cx="48" cy="30" r="3.3" fill="#17324d"/><circle cx="65" cy="30" r="3.3" fill="#17324d"/><path d="M54 37q3 3 6 0" fill="none" stroke="#17324d" stroke-width="2.5" stroke-linecap="round"/>${patternSvg(pattern,c.marking)}<path d="M31 66c-13 2-16 12-7 16 7 3 12-3 13-9" fill="${c.marking}" stroke="#fff" stroke-width="4"/><path d="M79 66c14 1 17 11 8 16-7 3-12-2-14-8" fill="${c.marking}" stroke="#fff" stroke-width="4"/><ellipse cx="45" cy="86" rx="11" ry="7" fill="${c.marking}" stroke="#fff" stroke-width="4"/><ellipse cx="69" cy="86" rx="11" ry="7" fill="${c.marking}" stroke="#fff" stroke-width="4"/></g></svg>`;
}
function migrateBlueprints(){
 const s=load();s.collection=Array.isArray(s.collection)?s.collection:[];let changed=false;
 for(const m of s.collection){
  if(!m.blueprintId){const species=getSpecies(m.speciesId);if((m.familyId||species?.familyId)==='bloom'){m.blueprintId='spriglet-v1';m.blueprintVersion=BLUEPRINT_VERSION;changed=true}}
 }
 if(changed)save(s);
 return s;
}
function activeMonster(){const s=migrateBlueprints();return s.collection.find(m=>m.uid===s.activeUid)||s.collection[0]||null}
function monsterForRow(row){const uid=row.querySelector('[data-uid]')?.dataset.uid;if(!uid)return null;return load().collection?.find(m=>m.uid===uid)||null}
function injectSvg(container,monster){if(!container||!monster||monster.blueprintId!=='spriglet-v1')return false;container.innerHTML=sprigletSvg(monster,monster.nickname||'Spriglet');return true}
function renderWorldFollower(){const m=activeMonster();if(!m)return;const follower=document.querySelector('.v85-world-follower');if(!follower)return;if(injectSvg(follower,m)){follower.classList.add('v88-blueprint-follower');follower.dataset.v88='1'}}
function renderCareAndSwap(){
 const s=load(),active=s.collection?.find(m=>m.uid===s.activeUid)||s.collection?.[0];
 document.querySelectorAll('.v85-preview').forEach(preview=>{if(active&&active.blueprintId==='spriglet-v1'){preview.innerHTML=sprigletSvg(active,active.nickname||'Spriglet');if(!preview.parentElement?.querySelector('.v88-blueprint-chip'))preview.insertAdjacentHTML('afterend','<span class="v88-blueprint-chip">🌱 SPRIGLET BLUEPRINT</span>')}});
 document.querySelectorAll('.v85-monster-row').forEach(row=>{const m=monsterForRow(row),mini=row.querySelector('.v85-mini');if(m&&mini)injectSvg(mini,m)});
}
function renderBattle(){
 const m=activeMonster();if(!m||m.blueprintId!=='spriglet-v1')return;
 const body=document.querySelector('.fighter.playerSide .monsterBody');if(!body||body.dataset.v88==='1')return;body.dataset.v88='1';body.classList.add('v88-battle-body');body.innerHTML=sprigletSvg(m,m.nickname||'Spriglet');
}
function keepCurrentBlueprints(){
 const s=load();let changed=false;
 for(const m of s.collection||[]){if(!m.blueprintId&&m.design){m.blueprintId='spriglet-v1';m.blueprintVersion=BLUEPRINT_VERSION;changed=true}}
 if(changed)save(s);
}
function refresh(){keepCurrentBlueprints();migrateBlueprints();renderWorldFollower();renderCareAndSwap();renderBattle()}

const observer=new MutationObserver(()=>queueMicrotask(refresh));
observer.observe(document.body,{subtree:true,childList:true});
window.addEventListener('focus',refresh);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});
setInterval(refresh,900);
setTimeout(refresh,350);
const badge=document.getElementById('build-badge');if(badge)badge.textContent='VERDARA V8.8 · SPRIGLET BLUEPRINT';
