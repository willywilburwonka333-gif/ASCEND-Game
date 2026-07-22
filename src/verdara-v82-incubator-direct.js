import { hatchCreature, getSpecies } from './creature-system.js';

const app = document.getElementById('app');
const SAVE_KEY = 'ascend_verdara_chapter_v2';
const ART_KEY = 'ascend_verdara_egg_art_v4';

const style = document.createElement('style');
style.textContent = `
.v82-eggs{display:grid;gap:9px}.v82-egg{display:grid;grid-template-columns:58px 1fr auto;gap:10px;align-items:center;padding:10px;border-radius:14px;background:#eef7ff;text-align:left}.v82-eggIcon{width:52px;height:66px;border:5px solid #fff;border-radius:50% 50% 46% 46%/58% 58% 42% 42%;background:var(--shell,#f7f4e8)}
.v82-paint{display:grid;gap:10px}.v82-canvasWrap{width:220px;height:280px;margin:auto;background:#eef7ff;border-radius:22px;padding:8px}.v82-canvasWrap canvas{width:100%;height:100%;touch-action:none}.v82-palette{display:grid;grid-template-columns:repeat(6,1fr);gap:7px}.v82-colour{aspect-ratio:1;border-radius:50%!important;min-height:0!important;padding:0!important}.v82-colour.sel{outline:4px solid #6b4cc5}.v82-tools{display:flex;gap:7px;justify-content:center;flex-wrap:wrap}.v82-progress{height:20px;background:#dce5ea;border-radius:999px;overflow:hidden}.v82-progress span{display:block;height:100%;background:linear-gradient(90deg,#73d8bd,#ffca57,#8d72e8)}.v82-art{width:130px;height:165px;object-fit:contain;margin:8px auto;display:block}.v82-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}
[data-v82-open],[data-v82-egg],[data-v82-close],[data-save],[data-back],[data-small],[data-medium],[data-large],[data-eraser],[data-clear],[data-hint],[data-v82-answer]{touch-action:manipulation;pointer-events:auto!important;position:relative;z-index:2}
@media(max-width:600px){.v82-canvasWrap{width:190px;height:240px}.v82-actions{grid-template-columns:1fr}.v82-egg{grid-template-columns:50px 1fr}.v82-egg button{grid-column:1/-1}}
`;
document.head.appendChild(style);

function load(key){try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return{}}}
function save(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}
function modalParts(){return{modal:app?.querySelector('.modal'),panel:app?.querySelector('.panel')}}
function openOwn(html){const{modal,panel}=modalParts();if(!modal||!panel)return;panel.innerHTML=html;modal.classList.add('open')}
function closeOwn(){modalParts().modal?.classList.remove('open')}
function shellColour(egg){return egg.shell||({bloom:'#8fdc7a',starlight:'#9b6de3',tide:'#62b7df'}[egg.familyId]||'#f7f4e8')}
function eggPath(ctx,w,h){ctx.beginPath();ctx.moveTo(w*.5,h*.05);ctx.bezierCurveTo(w*.82,h*.08,w*.93,h*.48,w*.82,h*.78);ctx.bezierCurveTo(w*.72,h*.98,w*.28,h*.98,w*.18,h*.78);ctx.bezierCurveTo(w*.07,h*.48,w*.18,h*.08,w*.5,h*.05);ctx.closePath()}

const questions=[
 {q:'What is 8 + 7?',a:'15',o:['13','14','15','16'],h:'Count seven more from eight.'},
 {q:'Which word is an adjective?',a:'bright',o:['run','bright','quickly','under'],h:'It describes a noun.'},
 {q:'Which part of a plant absorbs water?',a:'roots',o:['petals','roots','fruit','pollen'],h:'It grows underground.'},
 {q:'Half of 20 is…',a:'10',o:['5','8','10','12'],h:'Split 20 into two equal groups.'}
];

function showIncubator(){
 const s=load(SAVE_KEY),eggs=s.eggs||[];
 openOwn(`<h2>Springleaf Incubator Centre</h2><p>Paint and hatch any waiting egg.</p><div class="v82-eggs">${eggs.map((egg,index)=>`<div class="v82-egg"><div class="v82-eggIcon" style="--shell:${shellColour(egg)}"></div><div><b>${egg.name||'Verdara Egg'}</b><br><small>${(egg.rarity||'common').toUpperCase()}</small></div><button data-v82-egg="${index}">CUSTOMISE & HATCH</button></div>`).join('')||'<p>No eggs are waiting. Search nests and complete missions to discover more.</p>'}</div><button data-v82-close>LEAVE</button>`);
}

function paintEgg(index){
 const s=load(SAVE_KEY),egg=s.eggs?.[index];if(!egg){showIncubator();return}
 openOwn(`<h2>Paint ${egg.name||'Egg'}</h2><p>Draw directly on the shell with your finger or stylus.</p><div class="v82-paint"><div class="v82-canvasWrap"><canvas width="408" height="528"></canvas></div><div class="v82-palette"></div><div class="v82-tools"><button data-small>SMALL</button><button data-medium>MEDIUM</button><button data-large>LARGE</button><button data-eraser>ERASER</button><button data-clear>CLEAR</button></div><div class="v82-actions"><button data-save>CONTINUE TO HATCHING</button><button data-back>BACK</button></div></div>`);
 const panel=modalParts().panel,canvas=panel.querySelector('canvas'),ctx=canvas?.getContext('2d');
 if(!canvas||!ctx){showIncubator();return}
 let colour='#8d72e8',size=16,erasing=false,drawing=false,last=null;
 const colours=['#8d72e8','#73d8bd','#ffca57','#ff8fb3','#5bb8ff','#84d96b','#ff845b','#ffffff','#36516c','#ce60f2','#ff477e','#2ecbb9'];
 const palette=panel.querySelector('.v82-palette');
 palette.innerHTML=colours.map((c,i)=>`<button class="v82-colour ${i===0?'sel':''}" data-c="${c}" style="background:${c}"></button>`).join('');
 function shell(){ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();eggPath(ctx,canvas.width,canvas.height);ctx.clip();ctx.fillStyle=shellColour(egg);ctx.fillRect(0,0,canvas.width,canvas.height);ctx.restore();ctx.save();eggPath(ctx,canvas.width,canvas.height);ctx.lineWidth=18;ctx.strokeStyle='#fff';ctx.stroke();ctx.restore()}
 const saved=load(ART_KEY)[egg.id];
 if(saved?.image){const image=new Image();image.onload=()=>ctx.drawImage(image,0,0,canvas.width,canvas.height);image.onerror=shell;image.src=saved.image}else shell();
 function point(event){const rect=canvas.getBoundingClientRect();const source=event.touches?.[0]||event.changedTouches?.[0]||event;return{x:(source.clientX-rect.left)*canvas.width/rect.width,y:(source.clientY-rect.top)*canvas.height/rect.height}}
 function down(event){event.preventDefault();drawing=true;last=point(event);if(event.pointerId!=null)canvas.setPointerCapture?.(event.pointerId)}
 function move(event){if(!drawing||!last)return;event.preventDefault();const next=point(event);ctx.save();eggPath(ctx,canvas.width,canvas.height);ctx.clip();ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=size;ctx.strokeStyle=colour;ctx.globalCompositeOperation=erasing?'destination-out':'source-over';ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(next.x,next.y);ctx.stroke();ctx.restore();last=next}
 function up(){drawing=false;last=null}
 canvas.addEventListener('pointerdown',down,{passive:false});canvas.addEventListener('pointermove',move,{passive:false});canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
 canvas.addEventListener('touchstart',down,{passive:false});canvas.addEventListener('touchmove',move,{passive:false});canvas.addEventListener('touchend',up,{passive:false});canvas.addEventListener('touchcancel',up,{passive:false});
 palette.querySelectorAll('[data-c]').forEach(button=>button.onclick=()=>{colour=button.dataset.c;erasing=false;palette.querySelectorAll('button').forEach(item=>item.classList.remove('sel'));button.classList.add('sel')});
 panel.querySelector('[data-small]').onclick=()=>size=8;panel.querySelector('[data-medium]').onclick=()=>size=16;panel.querySelector('[data-large]').onclick=()=>size=28;panel.querySelector('[data-eraser]').onclick=()=>erasing=true;panel.querySelector('[data-clear]').onclick=shell;
}

function hatchQuestion(index,questionIndex,energy){
 const s=load(SAVE_KEY),egg=s.eggs?.[index];if(!egg){showIncubator();return}
 const question=questions[questionIndex%questions.length],art=load(ART_KEY)[egg.id];
 openOwn(`<h2>Hatching ${egg.name||'Egg'}</h2>${art?.image?`<img class="v82-art" src="${art.image}">`:''}<div class="v82-progress"><span style="width:${energy}%"></span></div><p>Hatch energy: ${energy}%</p><h3>${question.q}</h3><div class="answers">${question.o.map(option=>`<button data-v82-answer="${option}">${option}</button>`).join('')}</div><div class="support"><button data-hint>💡 Hint</button></div><p class="fb"></p>`);
}

function finishHatch(index){
 const s=load(SAVE_KEY),egg=s.eggs?.[index];if(!egg){showIncubator();return}
 const creature=hatchCreature(egg.familyId||'bloom'),species=getSpecies(creature.speciesId);
 creature.nickname=species?.name||egg.name?.replace(/ Egg$/,'')||'Companion';creature.eggName=egg.name;creature.uid=creature.uid||`monster-${Date.now()}`;
 s.collection=s.collection||[];s.collection.push(creature);s.activeUid=creature.uid;s.eggs.splice(index,1);s.xp=(s.xp||0)+25;save(SAVE_KEY,s);
 const art=load(ART_KEY)[egg.id];
 openOwn(`<h1>${creature.nickname} hatched!</h1>${art?.image?`<img class="v82-art" src="${art.image}">`:''}<p><b>${species?.name||'Verdara creature'}</b></p><p>${(creature.rarity||'common').toUpperCase()}${creature.isGold?' · GOLD':''}</p><p>It joined your collection and is now your active companion.</p><div class="v82-actions"><button data-another>${s.eggs.length?'HATCH ANOTHER':'RETURN TO VILLAGE'}</button><button data-v82-close>CLOSE</button></div>`);
}

let lastAction=0;
function runAction(event){
 const target=event.target.closest?.('[data-v82-open],[data-v82-egg],[data-v82-close],[data-save],[data-back],[data-hint],[data-v82-answer],[data-another]');
 if(!target)return;
 const now=Date.now();if(now-lastAction<220)return;lastAction=now;
 event.preventDefault();event.stopImmediatePropagation();
 if(target.matches('[data-v82-open]')){showIncubator();return}
 if(target.matches('[data-v82-egg]')){paintEgg(Number(target.dataset.v82Egg));return}
 if(target.matches('[data-v82-close]')){closeOwn();return}
 if(target.matches('[data-back]')){showIncubator();return}
 if(target.matches('[data-save]')){const panel=modalParts().panel,canvas=panel?.querySelector('canvas'),heading=panel?.querySelector('h2')?.textContent||'';const s=load(SAVE_KEY);const index=(s.eggs||[]).findIndex(egg=>heading.includes(egg.name||'Egg'));if(index<0||!canvas)return;const egg=s.eggs[index],art=load(ART_KEY);art[egg.id]={name:egg.name,image:canvas.toDataURL('image/png'),updatedAt:Date.now()};save(ART_KEY,art);hatchQuestion(index,0,0);return}
 if(target.matches('[data-hint]')){const panel=modalParts().panel,heading=panel?.querySelector('h2')?.textContent||'',questionText=panel?.querySelector('h3')?.textContent||'';const question=questions.find(q=>q.q===questionText);const fb=panel?.querySelector('.fb');if(fb&&question)fb.textContent=question.h;return}
 if(target.matches('[data-v82-answer]')){const panel=modalParts().panel,questionText=panel?.querySelector('h3')?.textContent||'',question=questions.find(q=>q.q===questionText),energy=Number((panel?.querySelector('.v82-progress span')?.style.width||'0').replace('%',''))||0,heading=panel?.querySelector('h2')?.textContent||'',s=load(SAVE_KEY),index=(s.eggs||[]).findIndex(egg=>heading.includes(egg.name||'Egg'));if(!question||index<0)return;if(target.dataset.v82Answer!==question.a){panel.querySelector('.fb').textContent='Not yet. Use the hint and try again.';return}const next=Math.min(100,energy+25);target.disabled=true;setTimeout(()=>next>=100?finishHatch(index):hatchQuestion(index,questions.indexOf(question)+1,next),180);return}
 if(target.matches('[data-another]')){const s=load(SAVE_KEY);s.eggs?.length?showIncubator():closeOwn()}
}
document.addEventListener('touchstart',runAction,{capture:true,passive:false});
document.addEventListener('pointerup',runAction,{capture:true,passive:false});
document.addEventListener('click',runAction,true);

let enhancing=false;
function enhancePhysicalEntrance(){
 if(enhancing)return;
 const{modal,panel}=modalParts();
 if(!modal?.classList.contains('open')||!panel||panel.dataset.v82Enhanced==='1')return;
 const heading=panel.querySelector('h1,h2')?.textContent?.trim()||'';
 if(heading!=='Incubator Centre'||!panel.textContent.includes('physical entrance'))return;
 enhancing=true;
 panel.dataset.v82Enhanced='1';
 panel.querySelectorAll('[data-v4paint],[data-v82-open]').forEach(button=>button.remove());
 [...panel.querySelectorAll('p')].forEach(p=>{if(/original incubator station|walkable interior/i.test(p.textContent||''))p.remove()});
 const button=document.createElement('button');button.dataset.v82Open='1';button.textContent='🎨 OPEN INCUBATOR — PAINT & HATCH';button.style.margin='12px 0';button.style.background='#ffca57';button.style.width='100%';
 panel.querySelector('.v81-card')?.before(button);
 enhancing=false;
}

const observer=new MutationObserver(()=>queueMicrotask(enhancePhysicalEntrance));
observer.observe(app,{subtree:true,childList:true});
setTimeout(enhancePhysicalEntrance,300);

const badge=document.getElementById('build-badge');if(badge)badge.textContent='VERDARA V8.4 · INCUBATOR INPUT FIX';