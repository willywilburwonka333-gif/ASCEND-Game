import { hatchCreature, getSpecies } from './creature-system.js';

const SAVE_KEY='ascend_verdara_chapter_v2';
const DESIGN_KEY='ascend_verdara_egg_design_v87';
const app=document.getElementById('app');
let completing=false;

function read(key){try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return{}}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
function panel(){return app?.querySelector('.panel')}
function state(){const s=read(SAVE_KEY);s.eggs=Array.isArray(s.eggs)?s.eggs:[];s.collection=Array.isArray(s.collection)?s.collection:[];return s}
function designs(){const d=read(DESIGN_KEY);d.eggs=d.eggs||{};return d}
function hash(value=''){let h=0;for(let i=0;i<value.length;i++)h=(h*31+value.charCodeAt(i))>>>0;return h}
const TYPES=['dog','cat','bird','duck','lizard','frog','insect','spider'];

function visiblePaintedImage(){return [...(panel()?.querySelectorAll('img.v82-art')||[])].find(img=>img.offsetParent!==null)?.src||''}
function findCurrentEgg(s){
 const all=designs().eggs;
 const image=visiblePaintedImage();
 if(image){const matched=s.eggs.find(egg=>all[egg.id]?.image===image);if(matched)return matched}
 return s.eggs[0]||null;
}
function currentDesign(egg){return designs().eggs[egg.id]||{base:egg.shell||'#8fd875',accent:'#e94c79',brush:'#8d72e8',pattern:'none',strokes:[]}}
function isFinalQuestion(){const p=panel();if(!p)return false;return /Half of 18/i.test(p.textContent||'')&&/Hatch energy:\s*75%/i.test(p.textContent||'')}
function alreadySavedForEgg(s,egg){return s.collection.find(m=>m?.design?.eggId===egg.id)}

function showSuccess(creature,design){
 const p=panel();if(!p)return;
 const colour=design.base||'#8fd875',mark=design.accent||'#e94c79',head=design.brush||colour;
 p.innerHTML=`<h1>${creature.nickname||'Your monster'} hatched!</h1><div style="width:150px;height:130px;margin:8px auto;position:relative"><div style="position:absolute;left:24px;top:45px;width:102px;height:70px;border-radius:48% 52% 44% 48%;background:${colour};border:6px solid #fff"></div><div style="position:absolute;left:43px;top:13px;width:66px;height:58px;border-radius:48%;background:${head};border:6px solid #fff"></div><div style="position:absolute;left:50px;top:34px;width:9px;height:12px;border-radius:50%;background:#17324d"></div><div style="position:absolute;right:50px;top:34px;width:9px;height:12px;border-radius:50%;background:#17324d"></div><div style="position:absolute;left:61px;top:61px;width:34px;height:13px;border-radius:50%;background:${mark}"></div></div><p>Your painted colours and markings were saved to this creature.</p><p><b>${(creature.rarity||'common').toUpperCase()}</b> · ${(creature.shapeType||'creature').toUpperCase()}</p><button data-v813-return style="width:100%;min-height:58px">RETURN TO WORLD</button>`;
}

function completeHatch(){
 if(completing)return;
 completing=true;
 const s=state(),egg=findCurrentEgg(s);
 if(!egg){completing=false;return}
 let creature=alreadySavedForEgg(s,egg);
 const design=currentDesign(egg);
 if(!creature){
  creature=hatchCreature(egg.familyId||'bloom');
  const species=getSpecies(creature.speciesId);
  creature.nickname=species?.name||'Companion';
  creature.design={base:design.base,accent:design.accent,brush:design.brush,pattern:design.pattern,eggId:egg.id};
  creature.shapeType=TYPES[hash(creature.speciesId||creature.uid)%TYPES.length];
  creature.blueprintId=`beta-${creature.shapeType}-v1`;
  creature.blueprintVersion=1;
  s.collection.push(creature);
  s.eggs=s.eggs.filter(e=>e.id!==egg.id);
  s.xp=(s.xp||0)+25;
 }
 s.activeUid=creature.uid;
 if(!write(SAVE_KEY,s)){completing=false;return}
 showSuccess(creature,design);
 completing=false;
}

function rescueIfStuck(){
 if(!isFinalQuestion())return;
 const correct=[...(panel()?.querySelectorAll('[data-v87-answer]')||[])].find(b=>b.dataset.v87Answer==='9');
 if(correct?.disabled)setTimeout(()=>{if(isFinalQuestion())completeHatch()},220);
}

function handle(e){
 const b=e.target.closest?.('button');if(!b)return;
 if(b.dataset.v87Answer==='9'&&isFinalQuestion())setTimeout(()=>{if(isFinalQuestion())completeHatch()},260);
 if(b.hasAttribute('data-v813-return')){e.preventDefault();e.stopImmediatePropagation();location.reload()}
}

document.addEventListener('touchstart',handle,{capture:true,passive:false});
document.addEventListener('pointerup',handle,{capture:true,passive:false});
document.addEventListener('click',handle,true);
new MutationObserver(()=>queueMicrotask(rescueIfStuck)).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['disabled']});
setInterval(rescueIfStuck,500);
setTimeout(rescueIfStuck,400);
const badge=document.getElementById('build-badge');if(badge)badge.textContent='VERDARA V8.13 · ATOMIC HATCH FIX';
