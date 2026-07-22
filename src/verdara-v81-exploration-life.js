const app=document.getElementById('app');
const SAVE_KEY='ascend_verdara_chapter_v2';
const V81_KEY='ascend_verdara_v81';

const style=document.createElement('style');
style.textContent=`
.v81-door,.v81-wild,.v81-nest{position:absolute;z-index:18;transform:translate(-50%,-50%);text-align:center;font-weight:900;touch-action:none}
.v81-door span,.v81-wild span,.v81-nest span{display:grid;place-items:center;width:56px;height:56px;border:5px solid #fff;border-radius:18px;background:#fff8dfef;box-shadow:0 8px 18px #17324d2b;font-size:30px}
.v81-door small,.v81-wild small,.v81-nest small{display:block;margin-top:3px;padding:3px 7px;border-radius:999px;background:#17324ddd;color:#fff;font-size:10px}
.v81-wild{animation:v81Roam 2.4s ease-in-out infinite alternate}.v81-wild:nth-of-type(even){animation-delay:.7s}@keyframes v81Roam{to{transform:translate(calc(-50% + 18px),calc(-50% - 8px))}}
.v81-companion{position:absolute;z-index:14;width:34px;height:34px;border:4px solid #fff;border-radius:50%;display:grid;place-items:center;background:#8d72e8;font-size:19px;transform:translate(-50%,-50%);transition:left .16s linear,top .16s linear;pointer-events:none;box-shadow:0 6px 12px #17324d2b}
.v81-toast{position:fixed;z-index:130;left:50%;bottom:145px;transform:translateX(-50%);display:none;background:#17324dee;color:#fff;border:4px solid #fff;border-radius:14px;padding:9px 13px;font-weight:900}.v81-toast.show{display:block}
.v81-card{padding:11px;border-radius:14px;background:#eef7ff;margin:8px 0;text-align:left}
.v81-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}.v81-actions button{min-height:50px}
@media(max-width:600px){.v81-door span,.v81-wild span,.v81-nest span{width:48px;height:48px;font-size:25px}.v81-companion{width:30px;height:30px;font-size:16px}.v81-actions{grid-template-columns:1fr}}
`;
document.head.appendChild(style);

function load(key){try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return{}}}
function save(key,v){try{localStorage.setItem(key,JSON.stringify(v))}catch{}}
function waitForGame(){return new Promise(resolve=>{let n=0;const t=setInterval(()=>{const game=app?.querySelector('#game'),world=game?.querySelector('.world'),player=game?.querySelector('.player');if(game&&world&&player){clearInterval(t);resolve({game,world,player})}else if(++n>180){clearInterval(t);resolve(null)}},80)})}
function zoneName(){return app.querySelector('.zone')?.textContent?.trim()||''}
function modalParts(){return{modal:app?.querySelector('.modal'),panel:app?.querySelector('.panel')}}
function openOwn(html){const{modal,panel}=modalParts();if(!modal||!panel)return;panel.innerHTML=html;modal.classList.add('open')}
function closeOwn(){modalParts().modal?.classList.remove('open')}
function toast(text){let el=document.querySelector('.v81-toast');if(!el){el=document.createElement('div');el.className='v81-toast';document.body.appendChild(el)}el.textContent=text;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),1300)}

const layouts={
 'Springleaf Village':{
  doors:[['Incubator Centre',18,28,'incubator'],['Garden Home',22,72,'home'],['Village Hall',52,69,'hall']],
  nests:[['Orchard Cache',84,28,'common']],wild:[]
 },
 'Sunpetal Meadow':{
  doors:[],nests:[['Flower Nest',24,22,'common'],['Nest Ridge',76,68,'uncommon']],
  wild:[['Petalhop',42,68,'🌼'],['Spriglet',68,34,'🌿'],['Flutterbud',82,54,'🦋']]
 }
};

function currentPlayer(){const p=app.querySelector('.player');return{x:parseFloat(p?.style.left)||50,y:parseFloat(p?.style.top)||72}}
function distance(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function activeMonster(){const s=load(SAVE_KEY);return (s.collection||[]).find(m=>m.uid===s.activeUid)||(s.collection||[])[0]||null}

function showInterior(type,label){
 const s=load(SAVE_KEY);
 if(type==='incubator'){
  openOwn(`<h2>${label}</h2><p>This is the physical entrance to Springleaf's incubator.</p><div class="v81-card"><b>Waiting eggs:</b> ${(s.eggs||[]).length}<br><b>Hatched monsters:</b> ${(s.collection||[]).length}</div><p>Use ACT at the original incubator station inside the village to paint and hatch eggs while the walkable interior is expanded.</p><button data-close>LEAVE</button>`)
 }else if(type==='hall'){
  openOwn(`<h2>${label}</h2><div class="v81-card"><b>Verdara progress</b><br>Level ${s.level||1} · Trainers ${s.trainers||0}/4 · Bridge ${s.bridgeStage||0}/4</div><button data-close>LEAVE</button>`)
 }else{
  openOwn(`<h2>${label}</h2><p>A quiet family home with books, maps and garden supplies. More indoor missions will connect here.</p><button data-close>LEAVE</button>`)
 }
 modalParts().panel.querySelector('[data-close]').onclick=closeOwn;
}

function hiddenNest(label,rarity){
 const s=load(SAVE_KEY),v=load(V81_KEY);v.nests=v.nests||{};const id=`${zoneName()}-${label}`;
 if(v.nests[id]){toast('This nest has already been searched.');return}
 const reward=Math.random()<.45;
 if(reward){
  const egg={id:`v81-${Date.now()}`,name:`${label} Egg`,rarity,familyId:zoneName().includes('Meadow')?'bloom':'starlight'};
  s.eggs=s.eggs||[];s.eggs.push(egg);save(SAVE_KEY,s);v.nests[id]=true;save(V81_KEY,v);
  openOwn(`<h2>Hidden egg discovered!</h2><p><b>${egg.name}</b></p><p>${rarity.toUpperCase()}</p><p>Take it to an incubator to paint and hatch it.</p><button data-close>CONTINUE</button>`)
 }else{
  v.nests[id]=true;save(V81_KEY,v);openOwn(`<h2>${label}</h2><p>You found 15 coins and fresh creature tracks.</p><button data-close>CONTINUE</button>`);s.coins=(s.coins||0)+15;save(SAVE_KEY,s)
 }
 modalParts().panel.querySelector('[data-close]').onclick=()=>{closeOwn();renderLife()};
}

function beginWild(name,icon){
 const monster=activeMonster();
 if(!monster){openOwn('<h2>No companion ready</h2><p>Hatch an egg before approaching wild creatures.</p><button data-close>CLOSE</button>');modalParts().panel.querySelector('[data-close]').onclick=closeOwn;return}
 openOwn(`<h2>Wild ${name}</h2><div class="v81-card" style="text-align:center;font-size:54px">${icon}</div><p>${name} is roaming this habitat.</p><div class="v81-actions"><button data-battle>START LEARNING BATTLE</button><button data-leave>BACK AWAY</button></div>`);
 const p=modalParts().panel;
 p.querySelector('[data-battle]').onclick=()=>{closeOwn();const hidden=app.querySelector('.v6-tools [data-wild]');if(hidden)hidden.click();else toast('Battle system is still loading.')};
 p.querySelector('[data-leave]').onclick=closeOwn;
}

let companion=null,lastZone='';
function renderLife(){
 const world=app.querySelector('.world');if(!world)return;
 world.querySelectorAll('.v81-door,.v81-wild,.v81-nest').forEach(e=>e.remove());
 const name=zoneName(),data=layouts[name];
 if(!data)return;
 (data.doors||[]).forEach(([label,x,y,type])=>{const e=document.createElement('button');e.className='v81-door';e.style.left=x+'%';e.style.top=y+'%';e.dataset.kind='door';e.dataset.type=type;e.dataset.label=label;e.innerHTML=`<span>🚪</span><small>${label}</small>`;world.appendChild(e)});
 (data.nests||[]).forEach(([label,x,y,rarity])=>{const v=load(V81_KEY);if(v.nests?.[`${name}-${label}`])return;const e=document.createElement('button');e.className='v81-nest';e.style.left=x+'%';e.style.top=y+'%';e.dataset.kind='nest';e.dataset.label=label;e.dataset.rarity=rarity;e.innerHTML=`<span>🥚</span><small>${label}</small>`;world.appendChild(e)});
 (data.wild||[]).forEach(([label,x,y,icon])=>{const e=document.createElement('button');e.className='v81-wild';e.style.left=x+'%';e.style.top=y+'%';e.dataset.kind='wild';e.dataset.label=label;e.dataset.icon=icon;e.innerHTML=`<span>${icon}</span><small>${label}</small>`;world.appendChild(e)});
 lastZone=name;
}

function updateCompanion(player){
 const world=app.querySelector('.world'),m=activeMonster();
 if(!world||!m){companion?.remove();companion=null;return}
 if(!companion){companion=document.createElement('div');companion.className='v81-companion';companion.textContent=m.isGold?'✨':'🐾';world.appendChild(companion)}
 const p=currentPlayer();companion.style.left=Math.max(3,p.x-4.2)+'%';companion.style.top=Math.min(94,p.y+4.8)+'%';
}

function installInteraction(game){
 const act=game.querySelector('.act');if(!act)return;
 const handler=e=>{
  const p=currentPlayer(),targets=[...game.querySelectorAll('.v81-door,.v81-wild,.v81-nest')];
  let best=null,bestD=999;
  for(const el of targets){const q={x:parseFloat(el.style.left),y:parseFloat(el.style.top)},d=distance(p,q);if(d<bestD){best=el;bestD=d}}
  if(!best||bestD>8)return;
  e.preventDefault();e.stopImmediatePropagation();
  if(best.dataset.kind==='door')showInterior(best.dataset.type,best.dataset.label);
  if(best.dataset.kind==='nest')hiddenNest(best.dataset.label,best.dataset.rarity);
  if(best.dataset.kind==='wild')beginWild(best.dataset.label,best.dataset.icon);
 };
 act.addEventListener('touchstart',handler,{capture:true,passive:false});
 act.addEventListener('click',handler,true);
}

waitForGame().then(parts=>{
 if(!parts)return;
 const{game,player}=parts;renderLife();updateCompanion(player);installInteraction(game);
 new MutationObserver(()=>{updateCompanion(player)}).observe(player,{attributes:true,attributeFilter:['style']});
 const zone=game.querySelector('.zone');new MutationObserver(()=>{if(zoneName()!==lastZone){renderLife();updateCompanion(player)}}).observe(zone,{childList:true,characterData:true,subtree:true});
 const badge=document.getElementById('build-badge');if(badge)badge.textContent='VERDARA V8.1 · EXPLORATION LIFE';
});
