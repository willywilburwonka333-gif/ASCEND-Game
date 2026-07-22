import { hatchCreature, getSpecies } from './creature-system.js';

const app=document.getElementById('app');
const SAVE_KEY='ascend_verdara_chapter_v2';
const ART_KEY='ascend_verdara_egg_art_v4';

const style=document.createElement('style');
style.textContent=`
.v82-eggs{display:grid;gap:9px}.v82-egg{display:grid;grid-template-columns:58px 1fr auto;gap:10px;align-items:center;padding:10px;border-radius:14px;background:#eef7ff;text-align:left}.v82-eggIcon{width:52px;height:66px;border:5px solid #fff;border-radius:50% 50% 46% 46%/58% 58% 42% 42%;background:var(--shell,#f7f4e8)}
.v82-paint{display:grid;gap:10px}.v82-canvasWrap{width:220px;height:280px;margin:auto;background:#eef7ff;border-radius:22px;padding:8px}.v82-canvasWrap canvas{width:100%;height:100%;touch-action:none}.v82-palette{display:grid;grid-template-columns:repeat(6,1fr);gap:7px}.v82-colour{aspect-ratio:1;border-radius:50%!important;min-height:0!important;padding:0!important}.v82-colour.sel{outline:4px solid #6b4cc5}.v82-tools{display:flex;gap:7px;justify-content:center;flex-wrap:wrap}.v82-progress{height:20px;background:#dce5ea;border-radius:999px;overflow:hidden}.v82-progress span{display:block;height:100%;background:linear-gradient(90deg,#73d8bd,#ffca57,#8d72e8)}.v82-art{width:130px;height:165px;object-fit:contain;margin:8px auto;display:block}.v82-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}
@media(max-width:600px){.v82-canvasWrap{width:190px;height:240px}.v82-actions{grid-template-columns:1fr}.v82-egg{grid-template-columns:50px 1fr}.v82-egg button{grid-column:1/-1}}
`;
document.head.appendChild(style);

function load(key){try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return{}}}
function save(key,v){localStorage.setItem(key,JSON.stringify(v))}
function modalParts(){return{modal:app?.querySelector('.modal'),panel:app?.querySelector('.panel')}}
function openOwn(html){const{modal,panel}=modalParts();if(!modal||!panel)return;panel.innerHTML=html;modal.classList.add('open')}
function closeOwn(){modalParts().modal?.classList.remove('open')}
function shellColour(egg){return egg.shell||({bloom:'#8fdc7a',starlight:'#9b6de3',tide:'#62b7df'}[egg.familyId]||'#f7f4e8')}
function eggPath(ctx,w,h){ctx.beginPath();ctx.moveTo(w*.5,h*.05);ctx.bezierCurveTo(w*.82,h*.08,w*.93,h*.48,w*.82,h*.78);ctx.bezierCurveTo(w*.72,h*.98,w*.28,h*.98,w*.18,h*.78);ctx.bezierCurveTo(w*.07,h*.48,w*.18,h*.08,w*.5,h*.05);ctx.closePath()}

const qs=[
 {q:'What is 8 + 7?',a:'15',o:['13','14','15','16'],h:'Count seven more from eight.'},
 {q:'Which word is an adjective?',a:'bright',o:['run','bright','quickly','under'],h:'It describes a noun.'},
 {q:'Which part of a plant absorbs water?',a:'roots',o:['petals','roots','fruit','pollen'],h:'It grows underground.'},
 {q:'Half of 20 is…',a:'10',o:['5','8','10','12'],h:'Split 20 into two equal groups.'}
];

function showIncubator(){
 const s=load(SAVE_KEY),eggs=s.eggs||[];
 openOwn(`<h2>Springleaf Incubator Centre</h2><p>Paint and hatch any waiting egg.</p><div class="v82-eggs">${eggs.map((e,i)=>`<div class="v82-egg"><div class="v82-eggIcon" style="--shell:${shellColour(e)}"></div><div><b>${e.name||'Verdara Egg'}</b><br><small>${(e.rarity||'common').toUpperCase()}</small></div><button data-egg="${i}">CUSTOMISE & HATCH</button></div>`).join('')||'<p>No eggs are waiting. Search nests and complete missions to discover more.</p>'}</div><button data-close>LEAVE</button>`);
 const p=modalParts().panel;p.querySelectorAll('[data-egg]').forEach(b=>b.onclick=()=>paintEgg(Number(b.dataset.egg)));p.querySelector('[data-close]').onclick=closeOwn;
}

function paintEgg(index){
 const s=load(SAVE_KEY),egg=s.eggs?.[index];if(!egg)return showIncubator();
 openOwn(`<h2>Paint ${egg.name||'Egg'}</h2><p>Draw directly on the shell with your finger or stylus.</p><div class="v82-paint"><div class="v82-canvasWrap"><canvas width="408" height="528"></canvas></div><div class="v82-palette"></div><div class="v82-tools"><button data-small>SMALL</button><button data-medium>MEDIUM</button><button data-large>LARGE</button><button data-eraser>ERASER</button><button data-clear>CLEAR</button></div><div class="v82-actions"><button data-save>CONTINUE TO HATCHING</button><button data-back>BACK</button></div></div>`);
 const p=modalParts().panel,canvas=p.querySelector('canvas'),ctx=canvas.getContext('2d');
 let colour='#8d72e8',size=16,erasing=false,drawing=false,last=null;
 const colours=['#8d72e8','#73d8bd','#ffca57','#ff8fb3','#5bb8ff','#84d96b','#ff845b','#ffffff','#36516c','#ce60f2','#ff477e','#2ecbb9'];
 const pal=p.querySelector('.v82-palette');pal.innerHTML=colours.map((c,i)=>`<button class="v82-colour ${i===0?'sel':''}" data-c="${c}" style="background:${c}"></button>`).join('');
 function shell(){ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();eggPath(ctx,canvas.width,canvas.height);ctx.clip();ctx.fillStyle=shellColour(egg);ctx.fillRect(0,0,canvas.width,canvas.height);ctx.restore();ctx.save();eggPath(ctx,canvas.width,canvas.height);ctx.lineWidth=18;ctx.strokeStyle='#fff';ctx.stroke();ctx.restore()}
 const art=load(ART_KEY),saved=art[egg.id];if(saved?.image){const img=new Image();img.onload=()=>ctx.drawImage(img,0,0,canvas.width,canvas.height);img.src=saved.image}else shell();
 function point(e){const r=canvas.getBoundingClientRect(),t=e.touches?.[0]||e;return{x:(t.clientX-r.left)*canvas.width/r.width,y:(t.clientY-r.top)*canvas.height/r.height}}
 function down(e){e.preventDefault();drawing=true;last=point(e);canvas.setPointerCapture?.(e.pointerId)}
 function move(e){if(!drawing)return;e.preventDefault();const q=point(e);ctx.save();eggPath(ctx,canvas.width,canvas.height);ctx.clip();ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=size;ctx.strokeStyle=colour;ctx.globalCompositeOperation=erasing?'destination-out':'source-over';ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(q.x,q.y);ctx.stroke();ctx.restore();last=q}
 function up(){drawing=false;last=null}
 canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
 pal.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{colour=b.dataset.c;erasing=false;pal.querySelectorAll('button').forEach(x=>x.classList.remove('sel'));b.classList.add('sel')});
 p.querySelector('[data-small]').onclick=()=>size=8;p.querySelector('[data-medium]').onclick=()=>size=16;p.querySelector('[data-large]').onclick=()=>size=28;p.querySelector('[data-eraser]').onclick=()=>erasing=true;p.querySelector('[data-clear]').onclick=shell;
 p.querySelector('[data-back]').onclick=showIncubator;
 p.querySelector('[data-save]').onclick=()=>{const a=load(ART_KEY);a[egg.id]={name:egg.name,image:canvas.toDataURL('image/png'),updatedAt:Date.now()};save(ART_KEY,a);hatchQuestion(index,0,0)};
}

function hatchQuestion(index,qIndex,energy){
 const s=load(SAVE_KEY),egg=s.eggs?.[index];if(!egg)return showIncubator();const q=qs[qIndex%qs.length],art=load(ART_KEY)[egg.id];
 openOwn(`<h2>Hatching ${egg.name||'Egg'}</h2>${art?.image?`<img class="v82-art" src="${art.image}">`:''}<div class="v82-progress"><span style="width:${energy}%"></span></div><p>Hatch energy: ${energy}%</p><h3>${q.q}</h3><div class="answers">${q.o.map(o=>`<button data-a="${o}">${o}</button>`).join('')}</div><div class="support"><button data-h>💡 Hint</button></div><p class="fb"></p>`);
 const p=modalParts().panel;p.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{if(b.dataset.a!==q.a){p.querySelector('.fb').textContent='Not yet. Use the hint and try again.';return}const next=Math.min(100,energy+25);if(next>=100)setTimeout(()=>finishHatch(index),250);else setTimeout(()=>hatchQuestion(index,qIndex+1,next),250)});p.querySelector('[data-h]').onclick=()=>p.querySelector('.fb').textContent=q.h;
}

function finishHatch(index){
 const s=load(SAVE_KEY),egg=s.eggs?.[index];if(!egg)return showIncubator();
 const creature=hatchCreature(egg.familyId||'bloom'),species=getSpecies(creature.speciesId);creature.nickname=species?.name||egg.name?.replace(/ Egg$/,'')||'Companion';creature.eggName=egg.name;creature.uid=creature.uid||`monster-${Date.now()}`;
 s.collection=s.collection||[];s.collection.push(creature);s.activeUid=creature.uid;s.eggs.splice(index,1);s.xp=(s.xp||0)+25;save(SAVE_KEY,s);
 const art=load(ART_KEY)[egg.id];openOwn(`<h1>${creature.nickname} hatched!</h1>${art?.image?`<img class="v82-art" src="${art.image}">`:''}<p><b>${species?.name||'Verdara creature'}</b></p><p>${(creature.rarity||'common').toUpperCase()}${creature.isGold?' · GOLD':''}</p><p>It has joined your collection and is now your active companion.</p><div class="v82-actions"><button data-another>${s.eggs.length?'HATCH ANOTHER':'RETURN TO VILLAGE'}</button><button data-close>CLOSE</button></div>`);
 const p=modalParts().panel;p.querySelector('[data-another]').onclick=s.eggs.length?showIncubator:closeOwn;p.querySelector('[data-close]').onclick=closeOwn;
}

function intercept(e){
 const btn=e.target.closest?.('[data-v4paint]');if(!btn)return;e.preventDefault();e.stopImmediatePropagation();showIncubator();
}
document.addEventListener('touchend',intercept,{capture:true,passive:false});document.addEventListener('click',intercept,true);

const observer=new MutationObserver(()=>{const{modal,panel}=modalParts();if(!modal?.classList.contains('open')||!panel)return;const h=panel.querySelector('h1,h2')?.textContent?.trim()||'';if(h==='Incubator Centre'&&panel.textContent.includes('physical entrance')){const old=panel.querySelector('[data-v4paint]');if(old){old.textContent='🎨 PAINT & HATCH EGGS';old.onclick=showIncubator}if(!panel.querySelector('[data-v82direct]')){const b=document.createElement('button');b.dataset.v82direct='1';b.textContent='🥚 OPEN INCUBATOR';b.style.margin='8px 0';b.onclick=showIncubator;panel.querySelector('.v81-card')?.after(b)}}});
observer.observe(app,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class']});

const badge=document.getElementById('build-badge');if(badge)badge.textContent='VERDARA V8.2 · DIRECT INCUBATOR';
