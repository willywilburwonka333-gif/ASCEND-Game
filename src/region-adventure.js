import { COUNTRIES, countryById } from './world-data.js';
import { MONSTER_CATALOG } from './creature-system.js';

const PROFILE_KEY = 'ascend_project_kayla_v4';
const WORLD_W = 2200;
const WORLD_H = 1400;
const VIEW_W = 960;
const VIEW_H = 540;

const loadProfile = () => { try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}'); } catch { return {}; } };
const saveProfile = (p) => localStorage.setItem(PROFILE_KEY, JSON.stringify(p));

const css = document.createElement('style');
css.textContent = `
#ascend-region-button{position:fixed;left:max(14px,env(safe-area-inset-left));top:max(14px,env(safe-area-inset-top));z-index:140000;border:4px solid #fff;border-radius:18px;padding:12px 18px;background:#ffca57;color:#17324d;font:900 15px Nunito,sans-serif;box-shadow:0 8px 24px rgba(23,50,77,.28);cursor:pointer}
#ascend-region{position:fixed;inset:0;z-index:150000;display:none;background:#17324d;font-family:Nunito,sans-serif;color:#17324d;overflow:hidden}
#ascend-region.open{display:block}
#ascend-region canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none;background:#8ee7ff}
.ar-hud{position:absolute;z-index:4;top:max(10px,env(safe-area-inset-top));left:max(10px,env(safe-area-inset-left));right:max(10px,env(safe-area-inset-right));display:flex;justify-content:space-between;gap:10px;pointer-events:none}
.ar-card{padding:10px 14px;border:4px solid #fff;border-radius:17px;background:rgba(255,248,223,.94);box-shadow:0 6px 18px rgba(23,50,77,.2);font-weight:900;pointer-events:auto}
.ar-close{border:0;border-radius:12px;background:#17324d;color:#fff;padding:9px 13px;font-weight:900;cursor:pointer}
.ar-message{position:absolute;z-index:5;left:50%;bottom:108px;transform:translateX(-50%);width:min(680px,88vw);padding:13px 18px;border:4px solid #fff;border-radius:18px;background:rgba(255,248,223,.97);font-weight:900;text-align:center;display:none}
.ar-message.show{display:block}
.ar-controls{position:absolute;z-index:6;left:0;right:0;bottom:max(12px,env(safe-area-inset-bottom));display:flex;justify-content:space-between;align-items:end;padding:0 18px;pointer-events:none}
.ar-pad{display:grid;grid-template-columns:repeat(3,56px);grid-template-rows:repeat(2,56px);gap:5px;pointer-events:auto}.ar-pad button,.ar-act{border:4px solid #fff;background:rgba(255,255,255,.72);border-radius:50%;font-size:23px;font-weight:900;color:#315a78;touch-action:none}.ar-pad .up{grid-column:2}.ar-pad .left{grid-column:1}.ar-pad .down{grid-column:2}.ar-pad .right{grid-column:3}.ar-act{width:76px;height:76px;background:#ffca57;color:#61420c;pointer-events:auto;font-size:16px}
.ar-battle{position:absolute;z-index:20;inset:0;display:none;place-items:center;background:rgba(23,50,77,.82);padding:16px}.ar-battle.open{display:grid}.ar-battle-card{width:min(760px,94vw);border:7px solid #fff;border-radius:28px;background:#fff8df;padding:20px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.3)}.ar-arena{position:relative;height:180px;border-radius:22px;background:linear-gradient(#8ee7ff,#dff7d8 58%,#86dc72);overflow:hidden}.ar-fighter{position:absolute;bottom:28px;width:76px;height:76px;border-radius:50%;display:grid;place-items:center;font-size:42px;border:6px solid #fff;transition:transform .28s}.ar-fighter.player{left:90px;background:#9b83f4}.ar-fighter.enemy{right:90px;background:#ff8fbd}.ar-fighter.hit{transform:translateX(-22px) scale(.9)}.ar-fighter.player.attack{transform:translateX(100px) scale(1.08)}.ar-fighter.enemy.attack{transform:translateX(-100px) scale(1.08)}.ar-question{font-size:24px;font-weight:900;margin:16px}.ar-options{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.ar-options button{border:4px solid #fff;border-radius:15px;padding:13px;background:#d9d0ff;font:900 20px Nunito;cursor:pointer;box-shadow:0 4px 12px rgba(23,50,77,.12)}
@media(max-width:700px){#ascend-region-button{top:auto;bottom:calc(170px + env(safe-area-inset-bottom))}.ar-card{font-size:12px}.ar-message{bottom:96px}.ar-options{grid-template-columns:1fr}.ar-arena{height:150px}.ar-fighter.player{left:36px}.ar-fighter.enemy{right:36px}}
`;
document.head.appendChild(css);

const openButton = document.createElement('button');
openButton.id = 'ascend-region-button';
openButton.textContent = '🧭 EXPLORE';
document.body.appendChild(openButton);

const root = document.createElement('section');
root.id = 'ascend-region';
root.innerHTML = `
<canvas width="960" height="540"></canvas>
<div class="ar-hud"><div class="ar-card ar-info"></div><div class="ar-card"><button class="ar-close">BACK</button></div></div>
<div class="ar-message"></div>
<div class="ar-controls"><div class="ar-pad"><button class="up">▲</button><button class="left">◀</button><button class="down">▼</button><button class="right">▶</button></div><button class="ar-act">ACT</button></div>
<div class="ar-battle"><div class="ar-battle-card"><h2 class="ar-battle-title"></h2><div class="ar-arena"><div class="ar-fighter player">✨</div><div class="ar-fighter enemy">👾</div></div><div class="ar-question"></div><div class="ar-options"></div><div class="ar-feedback"></div></div></div>`;
document.body.appendChild(root);

const canvas = root.querySelector('canvas');
const ctx = canvas.getContext('2d');
const info = root.querySelector('.ar-info');
const message = root.querySelector('.ar-message');
const battle = root.querySelector('.ar-battle');
const battleTitle = root.querySelector('.ar-battle-title');
const questionEl = root.querySelector('.ar-question');
const optionsEl = root.querySelector('.ar-options');
const feedbackEl = root.querySelector('.ar-feedback');
const playerFighter = root.querySelector('.ar-fighter.player');
const enemyFighter = root.querySelector('.ar-fighter.enemy');

let running = false;
let last = 0;
let currentCountry = COUNTRIES[0];
let player = { x: 380, y: 680, speed: 230 };
let keys = { up:false,down:false,left:false,right:false };
let camera = { x:0,y:0 };
let near = null;
let battleState = null;
let npcs = [];
let monsters = [];
let buildings = [];

const countryThemes = {
  verdara: { ground:'#78cf72', path:'#e9cf8c', water:'#55c8f2', roof:'#ff9d8b', accent:'#58b96a' },
  solara: { ground:'#e7c77d', path:'#f6dfac', water:'#55c8f2', roof:'#e98758', accent:'#f4a84f' },
  mizuno: { ground:'#8fd28d', path:'#ded0a8', water:'#4ea9df', roof:'#d76f7d', accent:'#5aa9e6' },
  amaru: { ground:'#bea875', path:'#e6c58f', water:'#6eb9d8', roof:'#b676d8', accent:'#9b6bc5' },
  aurora: { ground:'#bce6da', path:'#e9f3f0', water:'#6ab9db', roof:'#65c9b8', accent:'#65c9b8' },
};

function setupCountry(id) {
  currentCountry = countryById(id);
  const locations = currentCountry.locations;
  player = { x: 360, y: 700, speed: 230 };
  buildings = locations.map((name, i) => ({ x: 260 + (i % 3) * 620, y: 250 + Math.floor(i / 3) * 720, w: 230, h: 155, name, interior:false }));
  npcs = currentCountry.npcs.map((npc, i) => ({ ...npc, x: 450 + i * 380, y: 600 + (i % 2) * 330, vx:(i%2?1:-1)*(25+i*3), vy:(i%3-1)*18, colour:['#ffca57','#ff8fbd','#73d8bd','#9b83f4'][i%4] }));
  const pool = MONSTER_CATALOG.filter(m => !m.isGold && currentCountry.eggFamilies.includes(m.familyId));
  monsters = Array.from({length:9},(_,i)=>({ species:pool[(i*7+3)%pool.length], x:650+(i*173)%1350, y:420+(i*239)%760, vx:(i%2?1:-1)*(18+i), vy:((i%3)-1)*15, hidden:false }));
  info.textContent = `${currentCountry.icon} ${currentCountry.name} · ${currentCountry.subtitle}`;
}

function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.floor(rect.width*dpr));
  canvas.height = Math.max(1, Math.floor(rect.height*dpr));
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
window.addEventListener('resize', resize);

function worldToScreen(x,y){ return {x:x-camera.x,y:y-camera.y}; }
function dist(a,b){ return Math.hypot(a.x-b.x,a.y-b.y); }

function update(dt){
  if (battle.classList.contains('open')) return;
  let dx=(keys.right?1:0)-(keys.left?1:0), dy=(keys.down?1:0)-(keys.up?1:0);
  const len=Math.hypot(dx,dy)||1; dx/=len; dy/=len;
  player.x=Math.max(30,Math.min(WORLD_W-30,player.x+dx*player.speed*dt));
  player.y=Math.max(30,Math.min(WORLD_H-30,player.y+dy*player.speed*dt));
  for(const n of npcs){ n.x+=n.vx*dt;n.y+=n.vy*dt;if(n.x<120||n.x>WORLD_W-120)n.vx*=-1;if(n.y<180||n.y>WORLD_H-100)n.vy*=-1; }
  for(const m of monsters){ m.x+=m.vx*dt;m.y+=m.vy*dt;if(m.x<100||m.x>WORLD_W-100)m.vx*=-1;if(m.y<180||m.y>WORLD_H-100)m.vy*=-1; }
  camera.x=Math.max(0,Math.min(WORLD_W-innerWidth,player.x-innerWidth/2));
  camera.y=Math.max(0,Math.min(WORLD_H-innerHeight,player.y-innerHeight/2));
  near=null;
  for(const n of npcs) if(dist(player,n)<95){near={type:'npc',data:n};break;}
  if(!near) for(const m of monsters) if(!m.hidden&&dist(player,m)<90){near={type:'monster',data:m};break;}
  if(!near) for(const b of buildings){const door={x:b.x,y:b.y+b.h/2+32};if(dist(player,door)<90){near={type:'building',data:b};break;}}
  if(near){
    message.textContent=near.type==='npc'?`ACT: Talk to ${near.data.name}, ${near.data.role}`:near.type==='monster'?`ACT: Approach wild ${near.data.species.name}`:`ACT: Enter ${near.data.name}`;
    message.classList.add('show');
  }else message.classList.remove('show');
}

function draw(){
  const w=canvas.clientWidth,h=canvas.clientHeight;
  const t=countryThemes[currentCountry.id];
  ctx.clearRect(0,0,w,h);ctx.fillStyle=t.ground;ctx.fillRect(0,0,w,h);
  ctx.save();ctx.translate(-camera.x,-camera.y);
  ctx.fillStyle=t.path;ctx.fillRect(80,610,WORLD_W-160,190);ctx.fillRect(900,100,190,WORLD_H-200);
  ctx.fillStyle=t.water;ctx.fillRect(1450,0,260,WORLD_H);
  for(let y=30;y<WORLD_H;y+=80){ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(1470,y,210,8);}
  for(let i=0;i<42;i++){const x=80+(i*137)%2050,y=80+(i*223)%1250;ctx.fillStyle=i%2?'#4fae5d':'#69bd6d';ctx.beginPath();ctx.arc(x,y,25+(i%3)*6,0,Math.PI*2);ctx.fill();ctx.fillStyle='#805a3a';ctx.fillRect(x-5,y+18,10,30);}
  for(const b of buildings){ctx.fillStyle='#fff1c9';ctx.fillRect(b.x-b.w/2,b.y-b.h/2,b.w,b.h);ctx.fillStyle=t.roof;ctx.beginPath();ctx.moveTo(b.x-b.w/2-15,b.y-b.h/2);ctx.lineTo(b.x,b.y-b.h/2-90);ctx.lineTo(b.x+b.w/2+15,b.y-b.h/2);ctx.fill();ctx.fillStyle='#8f684e';ctx.fillRect(b.x-24,b.y+12,48,66);ctx.fillStyle='#17324d';ctx.font='800 18px Nunito';ctx.textAlign='center';ctx.fillText(b.name,b.x,b.y+b.h/2+28);}
  for(const n of npcs){ctx.fillStyle='rgba(23,50,77,.18)';ctx.beginPath();ctx.ellipse(n.x,n.y+22,30,10,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=n.colour;ctx.beginPath();ctx.arc(n.x,n.y,22,0,Math.PI*2);ctx.fill();ctx.fillStyle='#17324d';ctx.font='900 14px Nunito';ctx.fillText(n.name,n.x,n.y-32);}
  for(const m of monsters){if(m.hidden)continue;ctx.fillStyle=m.species.rarity==='legendary'?'#ffca57':m.species.rarity==='epic'?'#b676d8':'#8d72e8';ctx.beginPath();ctx.arc(m.x,m.y,25,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.font='24px sans-serif';ctx.fillText('✦',m.x,m.y+8);ctx.fillStyle='#17324d';ctx.font='800 13px Nunito';ctx.fillText(m.species.name,m.x,m.y-34);}
  ctx.fillStyle='#2f6f9f';ctx.beginPath();ctx.arc(player.x,player.y,24,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f6c8a7';ctx.beginPath();ctx.arc(player.x,player.y-11,13,0,Math.PI*2);ctx.fill();ctx.fillStyle='#9b83f4';ctx.beginPath();ctx.arc(player.x-42,player.y+22,17,0,Math.PI*2);ctx.fill();
  ctx.restore();
}

function loop(ts){if(!running)return;const dt=Math.min(.033,(ts-last)/1000||0);last=ts;update(dt);draw();requestAnimationFrame(loop);}

function interact(){
  if(!near)return;
  if(near.type==='npc') startBattle('trainer',near.data);
  else if(near.type==='monster') startBattle('wild',near.data);
  else enterBuilding(near.data);
}

function enterBuilding(b){
  const subjects=['Mathematics','English','Science','Humanities','Technologies','Health & PE','The Arts','Languages'];
  const subject=subjects[buildings.indexOf(b)%subjects.length];
  message.textContent=`Inside ${b.name}: ${subject} challenge available. ACT again near the guide to begin.`;message.classList.add('show');
  startBattle('gym',{name:`${subject} Gym Leader`,role:b.name,subject});
}

function makeQuestion(subject){
  const year=loadProfile().schoolYear||7;
  const sets={
    Mathematics:[['What is 25% of 80?','20',['10','20','25','40']],['7 × 8 = ?','56',['48','54','56','64']]],
    English:[['Which word is an adjective?','bright',['quickly','bright','jumped','under']],['Choose the correctly punctuated sentence.','After lunch, we left.',['After lunch we left','After lunch, we left.','after lunch, we left','After lunch we left.']]],
    Science:[['Which process turns liquid water into vapour?','evaporation',['condensation','evaporation','freezing','melting']],['What force pulls objects toward Earth?','gravity',['friction','gravity','magnetism','pressure']]],
    Humanities:[['Which tool best shows places and distance?','map',['poem','map','microscope','thermometer']]],
    Technologies:[['What should an algorithm contain?','ordered steps',['random guesses','ordered steps','only pictures','no instructions']]],
    'Health & PE':[['Which choice best supports recovery?','sleep and hydration',['skip sleep','sleep and hydration','avoid water','never rest']]],
    'The Arts':[['Rhythm is mainly a pattern of what?','beats',['colours','beats','angles','temperatures']]],
    Languages:[['What helps when learning a new greeting?','listen and practise',['avoid speaking','listen and practise','guess silently','never repeat']]],
  };
  const list=sets[subject]||sets.Mathematics;const q=list[Math.floor(Math.random()*list.length)];return {prompt:q[0],answer:q[1],options:q[2],year};
}

function startBattle(type,data){
  const subject=data.subject||({Canopy Guide:'Science','Seed Archivist':'English','Bridge Maker':'Mathematics','Habitat Keeper':'Science'}[data.role])||['Mathematics','English','Science','Humanities'][Math.floor(Math.random()*4)];
  battleState={type,data,subject,round:0,wins:0};battleTitle.textContent=type==='wild'?`Wild ${data.species.name} Encounter`:`${data.name} · ${subject}`;battle.classList.add('open');showBattleQuestion();
}

function showBattleQuestion(){
  const q=makeQuestion(battleState.subject);battleState.question=q;questionEl.textContent=q.prompt;feedbackEl.textContent=`Year ${q.year} adaptive ${battleState.subject} encounter`;
  optionsEl.innerHTML='';
  q.options.forEach(opt=>{const btn=document.createElement('button');btn.textContent=opt;btn.onclick=()=>answerBattle(opt,btn);optionsEl.appendChild(btn);});
}

function animateAttack(correct){
  const attacker=correct?playerFighter:enemyFighter;const target=correct?enemyFighter:playerFighter;attacker.classList.add('attack');setTimeout(()=>{attacker.classList.remove('attack');target.classList.add('hit');setTimeout(()=>target.classList.remove('hit'),260);},220);
}

function answerBattle(opt,btn){
  const correct=String(opt)===String(battleState.question.answer);animateAttack(correct);
  if(!correct){btn.disabled=true;feedbackEl.textContent='Not yet. Try another answer—the monster is still watching.';return;}
  battleState.wins++;battleState.round++;feedbackEl.textContent='Correct! Your companion strikes with knowledge.';
  optionsEl.querySelectorAll('button').forEach(b=>b.disabled=true);
  setTimeout(()=>{if(battleState.round<3)showBattleQuestion();else finishBattle();},850);
}

function finishBattle(){
  const profile=loadProfile();profile.xp=(profile.xp||0)+45;profile.coins=(profile.coins||0)+20;
  if(battleState.type==='wild'){
    const m=battleState.data;const caught=Math.random()<.72;
    if(caught){
      profile.collection=profile.collection||{creatures:[],discoveredSpecies:[],eggs:[]};
      const s=m.species;profile.collection.creatures.push({uid:`${s.id}-${Date.now()}`,speciesId:s.id,familyId:s.familyId,nickname:s.name,rarity:s.rarity,evolutionStage:0,bondXp:0,level:1});
      profile.collection.discoveredSpecies=[...new Set([...(profile.collection.discoveredSpecies||[]),s.id])];m.hidden=true;
      feedbackEl.textContent=`${s.name} trusts you and joined the collection! +45 XP`;
    } else feedbackEl.textContent=`${m.species.name} escaped, but your field notes improved. +45 XP`;
  } else feedbackEl.textContent=`Battle cleared! +45 XP and +20 coins.`;
  saveProfile(profile);setTimeout(()=>{battle.classList.remove('open');battleState=null;},1500);
}

function bindHold(selector,key){const el=root.querySelector(selector);const on=()=>keys[key]=true,off=()=>keys[key]=false;['pointerdown','touchstart'].forEach(e=>el.addEventListener(e,on,{passive:true}));['pointerup','pointercancel','pointerout','touchend'].forEach(e=>el.addEventListener(e,off,{passive:true}));}
bindHold('.up','up');bindHold('.down','down');bindHold('.left','left');bindHold('.right','right');
root.querySelector('.ar-act').addEventListener('pointerdown',interact);
root.querySelector('.ar-close').onclick=()=>{root.classList.remove('open');running=false;};
window.addEventListener('keydown',e=>{if(!root.classList.contains('open'))return;if(['ArrowUp','w','W'].includes(e.key))keys.up=true;if(['ArrowDown','s','S'].includes(e.key))keys.down=true;if(['ArrowLeft','a','A'].includes(e.key))keys.left=true;if(['ArrowRight','d','D'].includes(e.key))keys.right=true;if(['e','E',' '].includes(e.key))interact();if(e.key==='Escape'&&!battle.classList.contains('open'))root.querySelector('.ar-close').click();});
window.addEventListener('keyup',e=>{if(['ArrowUp','w','W'].includes(e.key))keys.up=false;if(['ArrowDown','s','S'].includes(e.key))keys.down=false;if(['ArrowLeft','a','A'].includes(e.key))keys.left=false;if(['ArrowRight','d','D'].includes(e.key))keys.right=false;});

openButton.onclick=()=>{
  const p=loadProfile();setupCountry(p.world?.currentCountry||'verdara');root.classList.add('open');resize();running=true;last=performance.now();requestAnimationFrame(loop);
};

window.addEventListener('ascend-country-changed',e=>{if(e.detail?.countryId)setupCountry(e.detail.countryId);});
