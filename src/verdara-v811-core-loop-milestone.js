const app=document.getElementById('app');
const SAVE_KEY='ascend_verdara_chapter_v2';
const CARE_KEY='ascend_verdara_monster_care_v85';
const V6_KEY='ascend_verdara_v6_progress';

const SPECIES=[
 {id:'spriglet',name:'Spriglet',shape:'dog',family:'bloom',rarity:'common',personality:'Loyal and curious',power:'Root Rush',forms:['Springleaf Egg','Spriglet','Sprigrove','Verdantail']},
 {id:'mosskit',name:'Mosskit',shape:'cat',family:'bloom',rarity:'common',personality:'Quiet and clever',power:'Moss Pounce',forms:['Mossy Egg','Mosskit','Fernlynx','Canopyclaw']},
 {id:'flutterbud',name:'Flutterbud',shape:'bird',family:'starlight',rarity:'uncommon',personality:'Cheerful and brave',power:'Petal Gust',forms:['Breeze Egg','Flutterbud','Bloomwing','Skydancer']},
 {id:'puddlequack',name:'Puddlequack',shape:'duck',family:'tide',rarity:'common',personality:'Playful and friendly',power:'Splash Lesson',forms:['Ripple Egg','Puddlequack','Brookbill','Rivercrest']},
 {id:'rootscale',name:'Rootscale',shape:'lizard',family:'bloom',rarity:'uncommon',personality:'Patient and observant',power:'Vine Guard',forms:['Bark Egg','Rootscale','Thornskink','Grovewarden']},
 {id:'dewhop',name:'Dewhop',shape:'frog',family:'tide',rarity:'uncommon',personality:'Energetic and kind',power:'Dew Bounce',forms:['Dewdrop Egg','Dewhop','Rainleap','Stormspring']}
];

const style=document.createElement('style');
style.textContent=`
.v811-species{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.v811-card{padding:11px;border-radius:15px;background:#eef7ff}.v811-card b,.v811-card small{display:block}.v811-pill{display:inline-block;padding:3px 8px;border-radius:999px;background:#17324d;color:#fff;font-size:10px;font-weight:900;margin-top:5px}.v811-path{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:10px 0}.v811-stage{padding:8px 5px;border-radius:12px;background:#dce5ea;text-align:center;font-size:10px;font-weight:900}.v811-stage.done{background:#73d8bd}.v811-stage.current{background:#8d72e8;color:#fff;outline:3px solid #fff}.v811-check{display:grid;grid-template-columns:1fr auto;gap:8px;padding:9px;border-radius:12px;background:#eef7ff;margin:6px 0;align-items:center}.v811-check.ok{background:#dff7e7}.v811-action{width:100%;min-height:52px;border:4px solid #fff;border-radius:14px;background:#73d8bd;color:#17324d;font-weight:900;margin-top:8px}.v811-action:disabled{opacity:.45}.v811-journey{display:grid;gap:8px}.v811-step{padding:10px;border-radius:14px;background:#eef7ff;border-left:7px solid #9db1bd}.v811-step.done{border-left-color:#55bf69}.v811-step.current{border-left-color:#8d72e8;outline:3px solid #e8ddff}.v811-step b,.v811-step small{display:block}.v811-meter{height:14px;border-radius:999px;background:#dce5ea;overflow:hidden;margin-top:6px}.v811-meter span{display:block;height:100%;background:linear-gradient(90deg,#73d8bd,#8d72e8)}
@media(max-width:560px){.v811-species{grid-template-columns:1fr}.v811-path{grid-template-columns:repeat(2,1fr)}}
`;
document.head.appendChild(style);

function read(key){try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return{}}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}
function state(){const s=read(SAVE_KEY);s.collection=Array.isArray(s.collection)?s.collection:[];s.eggs=Array.isArray(s.eggs)?s.eggs:[];return s}
function hash(value=''){let h=0;for(let i=0;i<value.length;i++)h=(h*31+value.charCodeAt(i))>>>0;return h}
function care(monster){const c=read(CARE_KEY).monsters?.[monster?.uid];if(!c)return 0;return Math.round(((c.hunger||0)+(c.happiness||0)+(c.energy||0)+(c.cleanliness||0))/4)}
function battleWins(monster){return read(V6_KEY).monsters?.[monster?.uid]?.wins||0}
function visitedCount(s){const found=new Set([s.zone,...Object.keys(s.collected||{}).map(k=>k.split('-')[0]),...Object.keys(s.defeated||{}).map(k=>k.split('-')[0])].filter(Boolean));return Math.min(9,found.size)}
function speciesFor(monster){return SPECIES.find(x=>x.id===monster.betaSpeciesId)||SPECIES[hash(monster.speciesId||monster.uid||'')%SPECIES.length]}
function stage(monster){return Math.max(1,Math.min(3,Number(monster.lifecycleStage||1)))}

function migrate(){const s=state();let changed=false;for(const m of s.collection){const sp=speciesFor(m);if(!m.betaSpeciesId){m.betaSpeciesId=sp.id;changed=true}if(m.shapeType!==sp.shape){m.shapeType=sp.shape;changed=true}if(!m.lifecycleStage){m.lifecycleStage=1;changed=true}const form=sp.forms[stage(m)];if(m.nickname!==form){m.nickname=form;changed=true}m.familyId=m.familyId||sp.family;m.rarity=m.rarity||sp.rarity}if(s.collection.length&&!s.collection.some(m=>m.uid===s.activeUid)){s.activeUid=s.collection[0].uid;changed=true}if(changed)write(SAVE_KEY,s);return s}
function active(s=migrate()){return s.collection.find(m=>m.uid===s.activeUid)||s.collection[0]||null}
function requirements(monster,next){const s=state(),wins=battleWins(monster),score=care(monster),areas=visitedCount(s);if(next===2)return[{label:'Learning battles',value:wins,target:3},{label:'Care',value:score,target:65},{label:'Areas explored',value:areas,target:2}];return[{label:'Learning battles',value:wins,target:8},{label:'Care',value:score,target:75},{label:'Areas explored',value:areas,target:4},{label:'Trainers defeated',value:s.trainers||0,target:2}]}
function ready(monster){const st=stage(monster);if(st>=3)return false;return requirements(monster,st+1).every(r=>r.value>=r.target)}
function panel(){return document.querySelector('.v89-panel')}
function back(){return'<button class="v89-close" data-v811-back>BACK TO PLAYER HUB</button>'}

function evolutionScreen(){const s=migrate(),m=active(s);if(!m){panel().innerHTML=`<h2>Evolution Path</h2><p>Hatch a creature first.</p>${back()}`;return}const sp=speciesFor(m),st=stage(m),req=st<3?requirements(m,st+1):[];panel().innerHTML=`<h2>${m.nickname}</h2><div class="v811-card"><b>${sp.personality}</b><small>Signature power: ${sp.power}</small><span class="v811-pill">${sp.rarity.toUpperCase()} · ${sp.shape.toUpperCase()}</span></div><div class="v811-path">${sp.forms.map((name,i)=>`<div class="v811-stage ${i<st?'done':i===st?'current':''}">${i===0?'EGG':i===1?'HATCHLING':i===2?'YOUNG':'FINAL'}<br>${name}</div>`).join('')}</div>${st>=3?'<div class="v811-card"><b>Final evolution reached</b><small>This companion has completed its Verdara lifecycle.</small></div>':`<h3>Requirements for ${sp.forms[st+1]}</h3>${req.map(r=>`<div class="v811-check ${r.value>=r.target?'ok':''}"><span>${r.label}</span><b>${r.value}/${r.target}</b></div>`).join('')}<button class="v811-action" data-v811-evolve ${ready(m)?'':'disabled'}>${ready(m)?'EVOLVE NOW':'KEEP LEARNING AND CARING'}</button>`}${back()}`}

function speciesScreen(){const s=migrate();panel().innerHTML=`<h2>Six Beta Species</h2><p>These are the first complete Verdara creature families. Insects and spiders remain available as temporary wild shapes while their named species are designed.</p><div class="v811-species">${SPECIES.map(sp=>{const owned=s.collection.filter(m=>m.betaSpeciesId===sp.id).length;return`<div class="v811-card"><b>${sp.name}</b><small>${sp.shape.toUpperCase()} · ${sp.personality}</small><small>${sp.forms.join(' → ')}</small><span class="v811-pill">OWNED ${owned}</span></div>`}).join('')}</div>${back()}`}

function journeyState(){const s=state(),m=active(s),wins=m?battleWins(m):0,areas=visitedCount(s);return[
 {title:'Meet Mira',detail:'Begin the Verdara journey in Springleaf.',done:Boolean(s.introDone||s.miraDone||s.started)},
 {title:'Design and hatch an egg',detail:'Create a unique shell and meet your first companion.',done:s.collection.length>0},
 {title:'Care for your companion',detail:'Feed, play, rest or clean until care reaches 65%.',done:m?care(m)>=65:false},
 {title:'Explore Sunpetal Meadow',detail:'Travel beyond Springleaf and discover the first habitat.',done:areas>=2||String(s.zone||'').includes('meadow')},
 {title:'Win three learning battles',detail:'Answer questions to strengthen your companion.',done:wins>=3},
 {title:'Earn the first evolution',detail:'Combine learning, care and exploration.',done:m?stage(m)>=2:false},
 {title:'Reach Whisperwood',detail:'Open the next chapter of Verdara.',done:areas>=3||String(s.zone||'').includes('forest')}
]}
function journeyScreen(){const steps=journeyState(),done=steps.filter(x=>x.done).length,current=steps.findIndex(x=>!x.done);panel().innerHTML=`<h2>Verdara Journey</h2><div class="v811-card"><b>Core-loop progress · ${done}/${steps.length}</b><div class="v811-meter"><span style="width:${Math.round(done/steps.length*100)}%"></span></div><small>Designed to unfold across several play sessions.</small></div><div class="v811-journey">${steps.map((x,i)=>`<div class="v811-step ${x.done?'done':i===current?'current':''}"><b>${x.done?'✓ ':i===current?'▶ ':''}${x.title}</b><small>${x.detail}</small></div>`).join('')}</div>${back()}`}

function systemScreen(){const s=migrate(),m=active(s);const checks=[['Save loaded',true],['Waiting eggs readable',Array.isArray(s.eggs)],['Collection readable',Array.isArray(s.collection)],['Active companion',!s.collection.length||Boolean(m)],['Companion body type',!m||Boolean(m.shapeType)],['Lifecycle assigned',!m||Boolean(m.lifecycleStage)],['World controls',Boolean(app.querySelector('.player'))],['Three-line hub',Boolean(document.querySelector('.v89-overlay'))]];panel().innerHTML=`<h2>System Check</h2>${checks.map(([name,ok])=>`<div class="v811-check ${ok?'ok':''}"><span>${name}</span><b>${ok?'READY':'NEEDS REPAIR'}</b></div>`).join('')}<button class="v811-action" data-v811-repair>REPAIR COMPANION STATE</button>${back()}`}

function addHubButtons(){const p=panel();if(!p||!p.querySelector('h2')?.textContent.includes('Player Hub')||p.querySelector('[data-v811-journey]'))return;const grid=p.querySelector('.v89-grid');if(!grid)return;grid.insertAdjacentHTML('beforeend','<button class="v89-action" data-v811-journey>🧭 VERDARA JOURNEY</button><button class="v89-action" data-v811-evolution>✨ EVOLUTION PATH</button><button class="v89-action" data-v811-species>🌱 BETA SPECIES</button>');const old=p.querySelector('[data-v89-system]');if(old){old.removeAttribute('data-v89-system');old.setAttribute('data-v811-system','')}}
function refreshNames(){migrate();document.querySelectorAll('.v810-row').forEach(row=>{const uid=row.querySelector('[data-v810-choose]')?.dataset.v810Choose,m=state().collection.find(x=>x.uid===uid);if(!m)return;const b=row.querySelector('b');if(b)b.textContent=m.nickname})}

let last=0;function handle(e){const b=e.target.closest?.('button');if(!b)return;const now=Date.now();if(now-last<220)return;let used=true;if(b.hasAttribute('data-v811-journey'))journeyScreen();else if(b.hasAttribute('data-v811-evolution'))evolutionScreen();else if(b.hasAttribute('data-v811-species'))speciesScreen();else if(b.hasAttribute('data-v811-system'))systemScreen();else if(b.hasAttribute('data-v811-back'))document.querySelector('[data-v89-tab="player"]')?.click();else if(b.hasAttribute('data-v811-repair')){migrate();systemScreen()}else if(b.hasAttribute('data-v811-evolve')){const s=migrate(),m=active(s);if(m&&ready(m)){m.lifecycleStage=stage(m)+1;m.nickname=speciesFor(m).forms[m.lifecycleStage];write(SAVE_KEY,s);evolutionScreen()}}else used=false;if(!used)return;last=now;e.preventDefault();e.stopImmediatePropagation()}
document.addEventListener('touchstart',handle,{capture:true,passive:false});document.addEventListener('pointerup',handle,{capture:true,passive:false});document.addEventListener('click',handle,true);

const observer=new MutationObserver(()=>queueMicrotask(()=>{addHubButtons();refreshNames()}));observer.observe(document.body,{subtree:true,childList:true});setInterval(()=>{addHubButtons();refreshNames()},900);setTimeout(()=>{migrate();addHubButtons();refreshNames()},350);
const badge=document.getElementById('build-badge');if(badge)badge.textContent='VERDARA V8.11 · CORE LOOP MILESTONE';