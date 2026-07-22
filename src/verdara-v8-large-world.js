const app=document.getElementById('app');
const SAVE_KEY='ascend_verdara_chapter_v2';
const V8_KEY='ascend_verdara_v8_world';

const style=document.createElement('style');
style.textContent=`
#game{background:#74c96f}
#game .world{left:0!important;top:0!important;right:auto!important;bottom:auto!important;width:190vw!important;height:170vh!important;transition:transform .18s ease-out,background .35s ease;will-change:transform;transform-origin:0 0;overflow:hidden}
#game .world:after{inset:35% 0 37%!important}
#game .player{z-index:15!important}
#game .world .player{position:absolute!important}
#game .top,#game .zone,#game .objective,#game .controls,#game .prompt,.v7-objective-toggle,.v7-drawer{position:fixed!important}
.v8-world-label{position:fixed;z-index:26;left:10px;top:166px;background:#17324de8;color:#fff;border:3px solid #fff;border-radius:999px;padding:5px 9px;font:800 10px system-ui;pointer-events:none}
.v8-transition{position:fixed;z-index:120;inset:0;display:grid;place-items:center;background:#17324d;color:#fff;font:900 22px system-ui;opacity:0;pointer-events:none;transition:opacity .18s}.v8-transition.show{opacity:1}
.v8-boundary{position:absolute;border:3px dashed #ffffff3d;border-radius:16px;pointer-events:none;z-index:3}
.v8-landmark{position:absolute;transform:translate(-50%,-50%);z-index:5;pointer-events:none;text-align:center;font-weight:900;color:#17324d}.v8-landmark span{display:grid;place-items:center;width:58px;height:58px;border:5px solid #fff;border-radius:18px;background:#fff8dfdd;font-size:31px;box-shadow:0 7px 16px #17324d28}.v8-landmark small{display:block;margin-top:4px;background:#fff8dfdd;border-radius:999px;padding:3px 7px}
.v8-camera-note{position:fixed;z-index:24;left:50%;bottom:145px;transform:translateX(-50%);display:none;background:#17324de8;color:#fff;border:3px solid #fff;border-radius:999px;padding:6px 10px;font:800 11px system-ui}.v8-camera-note.show{display:block}
@media(max-width:600px){.v8-world-label{top:158px;font-size:9px}.v8-landmark span{width:48px;height:48px;font-size:25px}.v8-landmark small{font-size:9px}}
`;
document.head.appendChild(style);

function load(key){try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return{}}}
function save(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}
function waitForGame(){return new Promise(resolve=>{let n=0;const t=setInterval(()=>{const game=app?.querySelector('#game'),world=game?.querySelector('.world'),player=game?.querySelector('.player');if(game&&world&&player){clearInterval(t);resolve({game,world,player})}else if(++n>180){clearInterval(t);resolve(null)}},80)})}

const dimensions={width:1.9,height:1.7};
const zoneLandmarks={
 'Springleaf Village':[['🏠','Garden Homes',22,72],['🥚','Incubator Centre',18,28],['📋','Village Square',52,69],['🌳','East Orchard',82,32]],
 'Sunpetal Meadow':[['🌼','Flower Basin',24,24],['🥚','Nest Ridge',76,68],['🌿','Tallgrass Walk',46,76],['🪨','Whisper Gate',88,25]],
 'Whisperwood Forest':[['🌲','Ranger Trail',28,28],['🪵','Fallen Grove',55,60],['🥚','Hidden Nest',78,72],['🕳️','Rootway Mouth',88,20]],
 'Rootway Caves':[['💎','Crystal Hall',28,30],['🪨','Deep Chamber',58,68],['🥚','Ancient Shelf',82,20],['🚪','Forest Exit',10,82]],
 'Mossmere Town':[['🧰','Workshop',58,42],['🥚','Incubator',25,65],['🛒','Supply Row',76,72],['🌉','Span Road',91,52]],
 'The Broken Span':[['🌊','Riverbank',24,52],['🌉','Bridge Works',52,50],['🥚','River Nest',18,18],['🌲','Canopy Gate',92,52]],
 'High Canopy Reserve':[['🌲','Lower Reserve',24,70],['🦜','Aerie Trail',50,30],['🥚','Ancient Nest',78,78],['🏙️','City Gate',91,30]],
 'Canopy City':[['🏛️','Collection Hall',74,70],['🥚','Incubator',25,28],['🏆','Trial Avenue',88,48],['🌳','Canopy Plaza',50,66]],
 'The Canopy Trial':[['🚪','Learning Rooms',34,44],['🏆','Aster Arena',72,50],['📜','Trial Archive',48,70]]
};

const collisionMap={
 'Springleaf Village':[{x1:14,y1:56,x2:30,y2:83},{x1:60,y1:56,x2:78,y2:83}],
 'Sunpetal Meadow':[{x1:40,y1:16,x2:48,y2:31},{x1:65,y1:58,x2:71,y2:75}],
 'Whisperwood Forest':[{x1:30,y1:37,x2:43,y2:52},{x1:57,y1:16,x2:67,y2:34}],
 'Rootway Caves':[{x1:18,y1:45,x2:38,y2:58},{x1:58,y1:55,x2:75,y2:68}],
 'Mossmere Town':[{x1:12,y1:18,x2:29,y2:38},{x1:55,y1:18,x2:72,y2:38}],
 'The Broken Span':[],
 'High Canopy Reserve':[{x1:34,y1:42,x2:48,y2:60},{x1:63,y1:18,x2:74,y2:36}],
 'Canopy City':[{x1:10,y1:18,x2:29,y2:40},{x1:59,y1:18,x2:80,y2:40}],
 'The Canopy Trial':[{x1:38,y1:18,x2:62,y2:34}]
};

function zoneName(){return app.querySelector('.zone')?.textContent?.trim()||'Verdara'}
function getPlayerPercent(player){return{x:parseFloat(player.style.left)||50,y:parseFloat(player.style.top)||72}}
function getSave(){return load(SAVE_KEY)}
function writeSave(s){save(SAVE_KEY,s)}

function decorate(world,name){world.querySelectorAll('.v8-landmark,.v8-boundary').forEach(e=>e.remove());
 (zoneLandmarks[name]||[]).forEach(([icon,label,x,y])=>{const el=document.createElement('div');el.className='v8-landmark';el.style.left=x+'%';el.style.top=y+'%';el.innerHTML=`<span>${icon}</span><small>${label}</small>`;world.appendChild(el)});
 (collisionMap[name]||[]).forEach(r=>{const el=document.createElement('div');el.className='v8-boundary';el.style.left=r.x1+'%';el.style.top=r.y1+'%';el.style.width=(r.x2-r.x1)+'%';el.style.height=(r.y2-r.y1)+'%';world.appendChild(el)});
}

function camera(world,player){const p=getPlayerPercent(player);const vw=window.innerWidth,vh=window.innerHeight;const worldW=vw*dimensions.width,worldH=vh*dimensions.height;const px=worldW*p.x/100,py=worldH*p.y/100;const targetX=vw*.5-px,targetY=vh*.52-py;const minX=vw-worldW,minY=vh-worldH;const x=Math.max(minX,Math.min(0,targetX));const y=Math.max(minY,Math.min(0,targetY));world.style.transform=`translate3d(${x}px,${y}px,0)`}
function blocked(name,p){return(collisionMap[name]||[]).some(r=>p.x>r.x1&&p.x<r.x2&&p.y>r.y1&&p.y<r.y2)}
function restorePosition(player,last){player.style.left=last.x+'%';player.style.top=last.y+'%';const s=getSave();s.x=last.x;s.y=last.y;writeSave(s)}

function rememberZonePosition(name,p){const v=load(V8_KEY);v.positions=v.positions||{};v.positions[name]=p;v.visited=v.visited||{};v.visited[name]=Date.now();save(V8_KEY,v)}
function restoreZonePosition(name,player){const v=load(V8_KEY),p=v.positions?.[name];if(!p)return;const s=getSave();if(s.zone&&Number.isFinite(p.x)&&Number.isFinite(p.y)){s.x=p.x;s.y=p.y;writeSave(s);player.style.left=p.x+'%';player.style.top=p.y+'%'}}
function flash(text){let el=document.querySelector('.v8-camera-note');if(!el){el=document.createElement('div');el.className='v8-camera-note';document.body.appendChild(el)}el.textContent=text;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),1100)}

waitForGame().then(parts=>{
 if(!parts)return;
 const{game,world,player}=parts;
 if(player.parentElement!==world)world.appendChild(player);
 const label=document.createElement('div');label.className='v8-world-label';label.textContent='V8 · LARGE WORLD ENGINE';document.body.appendChild(label);
 const transition=document.createElement('div');transition.className='v8-transition';transition.textContent='Travelling through Verdara…';document.body.appendChild(transition);
 let name=zoneName();restoreZonePosition(name,player);decorate(world,name);let last=getPlayerPercent(player);camera(world,player);rememberZonePosition(name,last);
 let correcting=false;
 const playerObserver=new MutationObserver(()=>{
   if(correcting)return;
   const now=getPlayerPercent(player),current=zoneName();
   if(blocked(current,now)){
     correcting=true;restorePosition(player,last);camera(world,player);flash('That way is blocked. Follow the path.');setTimeout(()=>correcting=false,40);return;
   }
   last=now;rememberZonePosition(current,now);camera(world,player);
 });
 playerObserver.observe(player,{attributes:true,attributeFilter:['style']});
 const zoneEl=game.querySelector('.zone');
 new MutationObserver(()=>{
   const next=zoneName();if(next===name)return;
   transition.classList.add('show');rememberZonePosition(name,last);name=next;setTimeout(()=>{restoreZonePosition(name,player);last=getPlayerPercent(player);decorate(world,name);camera(world,player);transition.classList.remove('show')},160);
 }).observe(zoneEl,{childList:true,characterData:true,subtree:true});
 window.addEventListener('resize',()=>camera(world,player));
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)camera(world,player)});
 const badge=document.getElementById('build-badge');if(badge)badge.textContent='VERDARA V8 · LARGE WORLD FOUNDATION';
});
