const app=document.getElementById('app');
const SAVE_KEY='ascend_verdara_chapter_v2';
let lastTravel=0;

function loadSave(){
  try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'{}')}catch{return{}}
}
function writeSave(s){
  try{localStorage.setItem(SAVE_KEY,JSON.stringify(s))}catch{}
}
function pointOf(el){
  return {x:parseFloat(el?.style?.left||'0'),y:parseFloat(el?.style?.top||'0')};
}
function nearestUnlockedLink(){
  const player=app?.querySelector('.player');
  if(!player)return null;
  const p=pointOf(player);
  let best=null,bestD=Infinity;
  app.querySelectorAll('.link[data-to]:not(.locked)').forEach(link=>{
    const q=pointOf(link);
    const d=Math.hypot(p.x-q.x,p.y-q.y);
    if(d<bestD){bestD=d;best=link}
  });
  return bestD<13?best:null;
}
function promptSaysTravel(){
  return /travel/i.test(app?.querySelector('.prompt')?.textContent||'');
}
function performTravel(link){
  const now=Date.now();
  if(now-lastTravel<900)return;
  lastTravel=now;
  const to=link?.dataset?.to;
  if(!to)return;
  const s=loadSave();
  s.zone=to;
  s.x=50;
  s.y=72;
  s.lastTravelAt=now;
  writeSave(s);
  document.querySelectorAll('.modal,.v7-drawer').forEach(el=>el.classList.remove('open'));
  document.body.style.pointerEvents='none';
  setTimeout(()=>location.reload(),40);
}
function intercept(e){
  const act=e.target?.closest?.('.act');
  if(!act||!promptSaysTravel())return;
  const link=nearestUnlockedLink();
  if(!link)return;
  e.preventDefault();
  e.stopImmediatePropagation();
  performTravel(link);
}
function install(){
  const game=app?.querySelector('#game');
  const act=game?.querySelector('.act');
  if(!game||!act||act.dataset.travelFix==='1')return false;
  act.dataset.travelFix='1';
  act.addEventListener('touchstart',intercept,{capture:true,passive:false});
  act.addEventListener('pointerdown',intercept,{capture:true,passive:false});
  act.addEventListener('click',intercept,true);
  return true;
}
let tries=0;
const timer=setInterval(()=>{
  tries++;
  if(install()||tries>160)clearInterval(timer);
},75);
