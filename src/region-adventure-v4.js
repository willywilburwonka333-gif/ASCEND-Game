import { COUNTRIES, countryById } from './world-data.js';
import { MONSTER_CATALOG } from './creature-system.js';

const KEY='ascend_project_kayla_v4';
const WORLD={w:2400,h:1600};
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
const save=p=>localStorage.setItem(KEY,JSON.stringify(p));

const themes={
 verdara:{sky:'#9ee9ff',ground:'#75cf73',dark:'#317a46',path:'#ecd48f',water:'#54bfe7',roof:'#e66f82',tree:'#3b9953'},
 solara:{sky:'#9fe7ff',ground:'#d9bd6f',dark:'#8f6b35',path:'#f5dfad',water:'#54bfe7',roof:'#e56e3e',tree:'#bb8738'},
 mizuno:{sky:'#a8edff',ground:'#79c998',dark:'#347e68',path:'#dccda7',water:'#3e9fd7',roof:'#527ee7',tree:'#39846c'},
 amaru:{sky:'#b8e7ff',ground:'#bfa56d',dark:'#715d3e',path:'#e8c98f',water:'#65b4d2',roof:'#b06048',tree:'#6e7651'},
 aurora:{sky:'#c6f0ef',ground:'#b9dfd3',dark:'#517f81',path:'#edf4ef',water:'#67b4d8',roof:'#7465c5',tree:'#70a99f'}
};

const css=document.createElement('style');
css.textContent=`
#ascend-region-button{position:fixed;left:14px;bottom:18px;z-index:140000;min-height:52px;border:4px solid #fff;border-radius:18px;padding:10px 16px;background:#ffca57;color:#17324d;font:900 15px Nunito,Arial;box-shadow:0 8px 24px #17324d44;touch-action:manipulation}
#ascend-region{position:fixed;inset:0;z-index:150000;display:none;overflow:hidden;background:#8ee7ff;font-family:Nunito,Arial;color:#17324d}#ascend-region.open{display:block}
#ascend-region canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
.rv-top{position:absolute;z-index:8;left:10px;right:10px;top:max(10px,env(safe-area-inset-top));display:flex;justify-content:space-between;gap:8px;pointer-events:none}.rv-card{pointer-events:auto;background:#fff8dff2;border:4px solid #fff;border-radius:17px;padding:8px 11px;font-weight:900;box-shadow:0 5px 18px #17324d33}.rv-close{min-height:44px;border:0;border-radius:12px;padding:9px 13px;background:#17324d;color:#fff;font-weight:900;touch-action:manipulation}
.rv-objective{position:absolute;z-index:8;top:82px;left:50%;transform:translateX(-50%);width:min(540px,88vw);padding:9px 13px;border:4px solid #fff;border-radius:15px;background:#fff8dfec;text-align:center;font-weight:900;box-shadow:0 5px 18px #17324d2d;pointer-events:none}
.rv-controls{position:absolute;z-index:12;left:0;right:0;bottom:max(14px,env(safe-area-inset-bottom));padding:0 18px;display:flex;justify-content:space-between;align-items:end;pointer-events:none}
.rv-stick{width:132px;height:132px;border:5px solid #ffffffd9;border-radius:50%;background:#17324d32;box-shadow:0 9px 25px #17324d33;position:relative;pointer-events:auto;touch-action:none}.rv-knob{position:absolute;left:50%;top:50%;width:64px;height:64px;margin:-32px;border:5px solid #fff;border-radius:50%;background:#ffffffdf;box-shadow:0 5px 14px #17324d33;transform:translate(0,0)}
.rv-act{pointer-events:auto;width:92px;height:92px;border:6px solid #fff;border-radius:50%;background:#ffca57;color:#553a05;font:900 19px Nunito;box-shadow:0 10px 28px #17324d44;touch-action:manipulation}.rv-act.ready{animation:actpulse .7s ease-in-out infinite alternate;background:#73d8bd}@keyframes actpulse{to{transform:scale(1.08)}}
.rv-prompt{position:absolute;z-index:10;left:50%;bottom:118px;transform:translateX(-50%);width:min(560px,82vw);padding:10px 13px;border:4px solid #fff;border-radius:16px;background:#17324de8;color:#fff;text-align:center;font-weight:900;display:none}.rv-prompt.show{display:block}
.rv-modal{position:absolute;z-index:30;inset:0;display:none;place-items:center;padding:14px;background:#17324ddd}.rv-modal.open{display:grid}.rv-panel{width:min(680px,94vw);max-height:88dvh;overflow:auto;background:#fff8df;border:7px solid #fff;border-radius:26px;padding:18px;text-align:center;box-shadow:0 20px 60px #0005}.rv-panel h2{margin:0 0 8px;color:#6b4cc5;font:900 30px 'Baloo 2',Nunito}.rv-panel p{font-size:17px;line-height:1.45}.rv-panel button{min-height:52px;border:4px solid #fff;border-radius:15px;padding:11px 16px;background:#73d8bd;color:#17324d;font:900 16px Nunito;box-shadow:0 5px 14px #17324d22;touch-action:manipulation}.rv-panel .battle{background:#8d72e8;color:#fff}.rv-panel .leave{background:#eef7ff}.rv-actions{display:flex;flex-wrap:wrap;gap:9px;justify-content:center}
@media(max-width:700px){#ascend-region-button{left:auto;right:14px}.rv-top{font-size:12px}.rv-objective{top:76px;font-size:13px}.rv-stick{width:118px;height:118px}.rv-knob{width:58px;height:58px;margin:-29px}.rv-act{width:84px;height:84px}.rv-prompt{bottom:106px;font-size:13px}.rv-panel{padding:14px}.rv-panel h2{font-size:25px}}
`;
document.head.appendChild(css);

document.getElementById('ascend-region-button')?.remove();
document.getElementById('ascend-region')?.remove();
const openBtn=document.createElement('button');openBtn.id='ascend-region-button';openBtn.textContent='🧭 EXPLORE';document.body.appendChild(openBtn);
const root=document.createElement('section');root.id='ascend-region';root.innerHTML=`<canvas></canvas><div class="rv-top"><div class="rv-card rv-info"></div><div class="rv-card"><button class="rv-close">BACK</button></div></div><div class="rv-objective">Explore the village · Talk to Mira · Find a wild monster</div><div class="rv-prompt"></div><div class="rv-controls"><div class="rv-stick"><div class="rv-knob"></div></div><button class="rv-act">ACT</button></div><div class="rv-modal"><div class="rv-panel"></div></div>`;document.body.appendChild(root);
const canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d'),info=root.querySelector('.rv-info'),prompt=root.querySelector('.rv-prompt'),modal=root.querySelector('.rv-modal'),panel=root.querySelector('.rv-panel'),stick=root.querySelector('.rv-stick'),knob=root.querySelector('.rv-knob'),act=root.querySelector('.rv-act');

const assets={};
for(const [k,src] of Object.entries({player:'/assets/player-walk-sheet.svg',npc:'/assets/npc-guide.svg',companion:'/assets/companion.svg',monster:'/assets/monster-archetypes.svg',buildings:'/assets/country-buildings.svg'})){const img=new Image();img.src=src;assets[k]=img;}
let current=COUNTRIES[0],running=false,last=0,dpr=1,camera={x:0,y:0},move={x:0,y:0},near=null;
let player={x:430,y:840,speed:260,dir:1,frame:0,t:0},npcs=[],monsters=[],buildings=[];

function setup(id){current=countryById(id)||COUNTRIES[0];const ci=Math.max(0,COUNTRIES.findIndex(c=>c.id===current.id));player={x:430,y:840,speed:260,dir:1,frame:0,t:0};buildings=(current.locations||['Village Hall','Hatchery','Subject Gym']).slice(0,5).map((name,i)=>({name,x:430+(i%3)*650,y:300+Math.floor(i/3)*760,w:250,h:180,ci}));npcs=(current.npcs||[]).slice(0,6).map((n,i)=>({...n,x:520+(i*330)%1700,y:690+(i%2)*420,vx:(i%2?1:-1)*(18+i*3),vy:0}));const pool=MONSTER_CATALOG.filter(m=>!m.isGold&&current.eggFamilies?.includes(m.familyId));monsters=Array.from({length:12},(_,i)=>({species:pool[(i*7+ci*5)%Math.max(1,pool.length)]||MONSTER_CATALOG[i],x:650+(i*173)%1450,y:440+(i*219)%920,vx:(i%2?1:-1)*(12+i),arch:(i+ci)%4,phase:i}));info.textContent=`${current.icon} ${current.name} · ${current.subtitle}`;}
function resize(){const r=canvas.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.floor(r.width*dpr));canvas.height=Math.max(1,Math.floor(r.height*dpr));ctx.setTransform(dpr,0,0,dpr,0,0)}
window.addEventListener('resize',resize);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);

function rounded(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=5;ctx.stroke()}}
function img(i,sx,sy,sw,sh,x,y,w,h,flip=false){if(!i.complete||!i.naturalWidth)return;ctx.save();if(flip){ctx.translate(x+w,0);ctx.scale(-1,1);ctx.drawImage(i,sx,sy,sw,sh,0-x-w,y,w,h)}else ctx.drawImage(i,sx,sy,sw,sh,x,y,w,h);ctx.restore()}
function drawTree(x,y,t){ctx.fillStyle='#765234';ctx.fillRect(x-7,y+24,14,38);ctx.fillStyle=t.tree;for(const [ox,oy,r] of [[0,0,30],[-22,13,23],[22,13,23]]){ctx.beginPath();ctx.arc(x+ox,y+oy,r,0,Math.PI*2);ctx.fill()}ctx.fillStyle='#ffffff20';ctx.beginPath();ctx.arc(x-10,y-8,9,0,Math.PI*2);ctx.fill()}
function drawMap(){const w=canvas.clientWidth,h=canvas.clientHeight,t=themes[current.id]||themes.verdara;ctx.clearRect(0,0,w,h);const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,t.sky);sky.addColorStop(1,t.ground);ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);ctx.save();ctx.translate(-camera.x,-camera.y);
 ctx.fillStyle=t.ground;ctx.fillRect(0,0,WORLD.w,WORLD.h);
 // terrain patches
 for(let i=0;i<45;i++){ctx.fillStyle=i%2?'#ffffff0e':'#17324d0b';ctx.beginPath();ctx.ellipse(90+(i*193)%2200,100+(i*257)%1400,90+(i%4)*25,55+(i%3)*20,0,0,Math.PI*2);ctx.fill()}
 // river and bridge
 ctx.fillStyle=t.water;ctx.beginPath();ctx.moveTo(1770,0);ctx.bezierCurveTo(1650,400,1900,750,1750,1600);ctx.lineTo(2050,1600);ctx.bezierCurveTo(2170,1120,1940,560,2070,0);ctx.closePath();ctx.fill();ctx.strokeStyle='#ffffff55';ctx.lineWidth=8;for(let y=60;y<1550;y+=95){ctx.beginPath();ctx.moveTo(1790,y);ctx.quadraticCurveTo(1900,y+22,2010,y);ctx.stroke()}
 // paths
 ctx.strokeStyle=t.path;ctx.lineCap='round';ctx.lineWidth=150;ctx.beginPath();ctx.moveTo(120,820);ctx.lineTo(2200,820);ctx.stroke();ctx.beginPath();ctx.moveTo(1080,120);ctx.lineTo(1080,1480);ctx.stroke();ctx.strokeStyle='#ffffff30';ctx.lineWidth=10;ctx.setLineDash([22,28]);ctx.beginPath();ctx.moveTo(120,820);ctx.lineTo(2200,820);ctx.stroke();ctx.setLineDash([]);
 // bridge
 rounded(1715,735,350,170,18,'#b77a43','#fff2c4');for(let x=1740;x<2040;x+=42){ctx.fillStyle='#8c5935';ctx.fillRect(x,750,12,140)}
 // trees/rocks
 for(let i=0;i<64;i++){const x=80+(i*151)%2240,y=80+(i*239)%1430;if(Math.abs(y-820)<130||Math.abs(x-1080)<130||x>1660&&x<2100)continue;drawTree(x,y,t)}
 // buildings
 for(const b of buildings){rounded(b.x-b.w/2,b.y-b.h/2,b.w,b.h,20,'#fff8df','#fff');ctx.fillStyle=t.roof;ctx.beginPath();ctx.moveTo(b.x-b.w/2-16,b.y-b.h/2+20);ctx.lineTo(b.x,b.y-b.h/2-70);ctx.lineTo(b.x+b.w/2+16,b.y-b.h/2+20);ctx.closePath();ctx.fill();rounded(b.x-38,b.y+15,76,75,10,t.dark,'#fff');ctx.fillStyle='#17324d';ctx.font='900 18px Nunito';ctx.textAlign='center';ctx.fillText(b.name,b.x,b.y+b.h/2+34)}
 // NPCs
 for(const n of npcs){if(assets.npc.complete&&assets.npc.naturalWidth)ctx.drawImage(assets.npc,n.x-38,n.y-70,76,94);else{ctx.fillStyle='#73d8bd';ctx.beginPath();ctx.arc(n.x,n.y-20,30,0,Math.PI*2);ctx.fill()}rounded(n.x-50,n.y-105,100,28,10,'#fff8df','#fff');ctx.fillStyle='#17324d';ctx.font='900 13px Nunito';ctx.fillText(n.name,n.x,n.y-85)}
 // monsters
 for(const m of monsters){img(assets.monster,m.arch*80,0,80,80,m.x-44,m.y-45+Math.sin(m.phase)*5,88,88,m.vx<0)}
 // player and companion
 img(assets.companion,0,0,assets.companion.naturalWidth||100,assets.companion.naturalHeight||100,player.x-80,player.y-30,62,62,false);
 if(assets.player.complete&&assets.player.naturalWidth)img(assets.player,player.frame*64,0,64,80,player.x-32,player.y-58,64,80,player.dir<0);else{ctx.fillStyle='#55a7e8';ctx.beginPath();ctx.arc(player.x,player.y,28,0,Math.PI*2);ctx.fill()}
 ctx.restore();}

function update(dt){if(modal.classList.contains('open'))return;const len=Math.hypot(move.x,move.y);if(len>.08){const dx=move.x/Math.max(1,len),dy=move.y/Math.max(1,len);player.x=clamp(player.x+dx*player.speed*dt,40,WORLD.w-40);player.y=clamp(player.y+dy*player.speed*dt,80,WORLD.h-40);player.t+=dt;player.frame=Math.floor(player.t*9)%4;if(dx)player.dir=dx>0?1:-1}
 for(const n of npcs){n.x+=n.vx*dt;if(n.x<160||n.x>WORLD.w-160)n.vx*=-1}for(const m of monsters){m.x+=m.vx*dt;m.phase+=dt*2;if(m.x<120||m.x>WORLD.w-120)m.vx*=-1}
 const vw=canvas.clientWidth,vh=canvas.clientHeight;camera.x=clamp(player.x-vw/2,0,Math.max(0,WORLD.w-vw));camera.y=clamp(player.y-vh/2,0,Math.max(0,WORLD.h-vh));near=null;for(const n of npcs){if(distance(player,n)<115){near={type:'npc',data:n};break}}if(!near)for(const m of monsters){if(distance(player,m)<105){near={type:'monster',data:m};break}}if(!near)for(const b of buildings){if(distance(player,{x:b.x,y:b.y+b.h/2+20})<120){near={type:'building',data:b};break}}
 if(near){act.classList.add('ready');prompt.classList.add('show');prompt.textContent=near.type==='npc'?`Talk to ${near.data.name}`:near.type==='monster'?`Approach ${near.data.species?.name||'wild monster'}`:`Enter ${near.data.name}`}else{act.classList.remove('ready');prompt.classList.remove('show')}}
function frame(ts){if(!running)return;const dt=Math.min(.034,(ts-last)/1000||0);last=ts;update(dt);drawMap();requestAnimationFrame(frame)}

function openInteraction(){if(!near){prompt.textContent='Move closer to a person, monster or building.';prompt.classList.add('show');setTimeout(()=>{if(!near)prompt.classList.remove('show')},1200);return}modal.classList.add('open');const n=near;if(n.type==='npc')panel.innerHTML=`<h2>${n.data.name}</h2><p><b>${n.data.role||'Guide'}</b></p><p>${n.data.teaches?`I can teach you about ${n.data.teaches}.`:'Every path in this country holds something worth learning.'}</p><div class="rv-actions"><button class="battle">BEGIN MISSION</button><button class="leave">KEEP EXPLORING</button></div>`;else if(n.type==='monster')panel.innerHTML=`<h2>Wild ${n.data.species?.name||'Ascendant'}</h2><p>This creature is watching carefully. Complete a learning encounter to earn its trust.</p><div class="rv-actions"><button class="battle">START ENCOUNTER</button><button class="leave">LEAVE IT</button></div>`;else panel.innerHTML=`<h2>${n.data.name}</h2><p>This location will contain its own interior, NPCs and subject challenge.</p><div class="rv-actions"><button class="battle">ENTER</button><button class="leave">NOT YET</button></div>`;
 panel.querySelector('.leave').onclick=()=>modal.classList.remove('open');panel.querySelector('.battle').onclick=()=>{panel.innerHTML=`<h2>Mission ready</h2><p>The full adaptive battle opens from the Adventure system. This interaction now works instantly and will be connected next without replacing this map.</p><button class="leave">RETURN TO MAP</button>`;panel.querySelector('.leave').onclick=()=>modal.classList.remove('open')};}

function bindStick(){let active=false,id=null;const set=e=>{const r=stick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,max=r.width*.29,l=Math.hypot(dx,dy)||1,scale=Math.min(1,max/l);dx*=scale;dy*=scale;knob.style.transform=`translate(${dx}px,${dy}px)`;move.x=dx/max;move.y=dy/max};stick.addEventListener('pointerdown',e=>{e.preventDefault();active=true;id=e.pointerId;stick.setPointerCapture(id);set(e)});stick.addEventListener('pointermove',e=>{if(active&&e.pointerId===id){e.preventDefault();set(e)}});const end=e=>{if(!active||e.pointerId!==id)return;active=false;move={x:0,y:0};knob.style.transform='translate(0,0)'};stick.addEventListener('pointerup',end);stick.addEventListener('pointercancel',end)}
bindStick();act.addEventListener('pointerdown',e=>{e.preventDefault();openInteraction()});root.querySelector('.rv-close').onclick=()=>{running=false;root.classList.remove('open')};
openBtn.onclick=()=>{const p=load();const id=p.world?.currentCountry||p.currentCountry||'verdara';setup(id);root.classList.add('open');resize();running=true;last=performance.now();requestAnimationFrame(frame)};
window.addEventListener('keydown',e=>{if(!running)return;if(['ArrowUp','w','W'].includes(e.key))move.y=-1;if(['ArrowDown','s','S'].includes(e.key))move.y=1;if(['ArrowLeft','a','A'].includes(e.key))move.x=-1;if(['ArrowRight','d','D'].includes(e.key))move.x=1;if(['e','E',' '].includes(e.key)){e.preventDefault();openInteraction()}});window.addEventListener('keyup',e=>{if(['ArrowUp','ArrowDown','w','W','s','S'].includes(e.key))move.y=0;if(['ArrowLeft','ArrowRight','a','A','d','D'].includes(e.key))move.x=0});
