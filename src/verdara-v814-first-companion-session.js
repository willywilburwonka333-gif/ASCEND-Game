const app=document.getElementById('app');
const SAVE_KEY='ascend_verdara_chapter_v2';
const CARE_KEY='ascend_verdara_monster_care_v85';
const V6_KEY='ascend_verdara_v6_progress';
const SESSION_KEY='ascend_verdara_first_companion_v814';

const QUESTIONS=[
 {q:'What is 4 + 5?',a:'9',o:['7','8','9','10'],subject:'Mathematics',hint:'Start at four and count five more.'},
 {q:'Which word is a describing word?',a:'gentle',o:['jump','gentle','quickly','under'],subject:'English',hint:'A describing word tells us what something is like.'},
 {q:'Which part of a plant takes in water?',a:'roots',o:['petals','roots','fruit','pollen'],subject:'Science',hint:'It grows below the ground.'}
];

const style=document.createElement('style');
style.textContent=`
.v814-launch{position:absolute;z-index:72;right:10px;top:166px;max-width:150px;border:4px solid #fff;border-radius:14px;background:#8d72e8;color:#fff;padding:8px 10px;font:900 11px system-ui;box-shadow:0 7px 16px #17324d35}
.v814-overlay{position:fixed;z-index:1000002;inset:0;display:none;place-items:center;background:#17324de8;padding:12px}.v814-overlay.open{display:grid}
.v814-panel{width:min(690px,95vw);max-height:91dvh;overflow:auto;background:#fff8df;border:7px solid #fff;border-radius:24px;padding:15px;color:#17324d}
.v814-panel h2{margin:0 0 8px;text-align:center}.v814-card{padding:11px;border-radius:15px;background:#eef7ff;margin:8px 0}.v814-card b,.v814-card small{display:block}
.v814-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.v814-btn{min-height:54px;border:4px solid #fff;border-radius:14px;background:#73d8bd;color:#17324d;font-weight:900;padding:9px}.v814-btn.primary{background:#8d72e8;color:#fff}.v814-btn.full{width:100%;margin-top:8px}.v814-answer{width:100%;min-height:52px;margin:5px 0;border:4px solid #fff;border-radius:13px;background:#73d8bd;color:#17324d;font-weight:900}.v814-meter{height:16px;background:#dce5ea;border-radius:999px;overflow:hidden;margin:8px 0}.v814-meter span{display:block;height:100%;background:linear-gradient(90deg,#73d8bd,#ffca57,#8d72e8)}
.v814-steps{display:grid;gap:7px}.v814-step{padding:9px;border-radius:12px;background:#eef7ff;border-left:6px solid #9db1bd}.v814-step.done{border-left-color:#55bf69}.v814-step.current{border-left-color:#8d72e8;outline:3px solid #e9ddff}.v814-close{width:100%;min-height:50px;margin-top:10px;border:4px solid #fff;border-radius:13px;background:#17324d;color:#fff;font-weight:900}
@media(max-width:550px){.v814-grid{grid-template-columns:1fr}.v814-launch{top:160px;right:7px;font-size:10px;max-width:126px}}
`;
document.head.appendChild(style);

function read(key){try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return{}}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}
function state(){const s=read(SAVE_KEY);s.collection=Array.isArray(s.collection)?s.collection:[];s.eggs=Array.isArray(s.eggs)?s.eggs:[];return s}
function session(){return{step:0,question:0,correct:0,completed:false,...read(SESSION_KEY)}}
function saveSession(v){write(SESSION_KEY,v)}
function active(){const s=state();if(!s.collection.length)return null;let m=s.collection.find(x=>x.uid===s.activeUid);if(!m){m=s.collection[0];s.activeUid=m.uid;write(SAVE_KEY,s)}return m}
function creatureName(){const m=active();return m?.nickname||m?.betaSpeciesId||m?.shapeType||'Companion'}

let overlay=null;
function ensureOverlay(){if(overlay?.isConnected)return overlay;overlay=document.createElement('div');overlay.className='v814-overlay';overlay.innerHTML='<div class="v814-panel"></div>';document.body.appendChild(overlay);return overlay}
function panel(){return ensureOverlay().querySelector('.v814-panel')}
function open(){ensureOverlay().classList.add('open');render()}
function close(){overlay?.classList.remove('open')}

function steps(){const p=session();return[
 {name:'Meet your companion',done:p.step>=1},
 {name:'Complete one care action',done:p.step>=2},
 {name:'Finish the first learning challenge',done:p.step>=3},
 {name:'Prepare for Sunpetal Meadow',done:p.step>=4}
]}
function stepList(){const p=session(),list=steps(),current=list.findIndex(x=>!x.done);return`<div class="v814-steps">${list.map((x,i)=>`<div class="v814-step ${x.done?'done':i===current?'current':''}"><b>${x.done?'✓ ':i===current?'▶ ':''}${x.name}</b></div>`).join('')}</div><div class="v814-meter"><span style="width:${Math.min(100,p.step*25)}%"></span></div>`}

function render(){const p=session(),m=active();if(!m){panel().innerHTML='<h2>First Companion Quest</h2><div class="v814-card"><b>No companion yet</b><small>Design and hatch an egg at the Springleaf Incubator.</small></div><button class="v814-close" data-v814-close>RETURN TO GAME</button>';return}
 if(p.completed||p.step>=4){panel().innerHTML=`<h2>Ready for Sunpetal</h2>${stepList()}<div class="v814-card"><b>${creatureName()} is ready.</b><small>Walk to the Sunpetal Meadow route and use ACT. Learning battles, wild creatures and Trainer Pip wait there.</small></div><button class="v814-btn primary full" data-v814-objective>SET SUNPETAL OBJECTIVE</button><button class="v814-close" data-v814-close>RETURN TO WORLD</button>`;return}
 if(p.step===0){panel().innerHTML=`<h2>Your first companion!</h2>${stepList()}<div class="v814-card"><b>${creatureName()}</b><small>Your painted egg created this companion's colours and markings. It will follow you, learn with you and evolve through care, exploration and mastered lessons.</small></div><button class="v814-btn primary full" data-v814-meet>MEET ${creatureName().toUpperCase()}</button><button class="v814-close" data-v814-close>NOT NOW</button>`;return}
 if(p.step===1){panel().innerHTML=`<h2>Care creates friendship</h2>${stepList()}<p>Choose one activity. This records your first bond action and starts the Tamagotchi-style care loop.</p><div class="v814-grid"><button class="v814-btn" data-v814-care="hunger">🍎 FEED</button><button class="v814-btn" data-v814-care="happiness">🎾 PLAY</button><button class="v814-btn" data-v814-care="energy">💤 REST</button><button class="v814-btn" data-v814-care="cleanliness">🫧 CLEAN</button></div><button class="v814-close" data-v814-close>RETURN TO WORLD</button>`;return}
 if(p.step===2){const q=QUESTIONS[p.question%QUESTIONS.length];panel().innerHTML=`<h2>First learning challenge</h2>${stepList()}<div class="v814-card"><b>${q.subject}</b><small>Correct answers strengthen your companion.</small></div><h3>${q.q}</h3>${q.o.map(o=>`<button class="v814-answer" data-v814-answer="${o}">${o}</button>`).join('')}<button class="v814-btn full" data-v814-hint>💡 HINT</button><p class="v814-feedback"></p><button class="v814-close" data-v814-close>RETURN TO WORLD</button>`;return}
 panel().innerHTML=`<h2>Journey begins</h2>${stepList()}<div class="v814-card"><b>First lesson complete</b><small>${creatureName()} earned companion experience, bond and one learning-battle win.</small></div><button class="v814-btn primary full" data-v814-ready>PREPARE FOR SUNPETAL</button><button class="v814-close" data-v814-close>RETURN TO WORLD</button>`
}

function recordCare(key){const s=state(),m=active();if(!m)return;const store=read(CARE_KEY);store.monsters=store.monsters||{};const c=store.monsters[m.uid]||{hunger:76,happiness:76,energy:76,cleanliness:76,lastUpdated:Date.now()};c[key]=Math.min(100,(c[key]||76)+20);c.lastUpdated=Date.now();store.monsters[m.uid]=c;write(CARE_KEY,store);const p=session();p.step=2;p.careAction=key;saveSession(p);render()}
function awardLesson(){const s=state(),m=active();if(!m)return;const v=read(V6_KEY);v.monsters=v.monsters||{};const profile=v.monsters[m.uid]||{level:1,xp:0,hp:100,maxHp:100,bond:0,wins:0,stage:1};profile.wins=(profile.wins||0)+1;profile.xp=(profile.xp||0)+35;profile.bond=Math.min(100,(profile.bond||0)+12);v.monsters[m.uid]=profile;write(V6_KEY,v);s.xp=(s.xp||0)+20;s.coins=(s.coins||0)+10;write(SAVE_KEY,s)}
function setSunpetalObjective(){const s=state();s.firstCompanionSessionComplete=true;s.nextObjective='Travel to Sunpetal Meadow with your companion.';write(SAVE_KEY,s);const objective=app.querySelector('.objective');if(objective)objective.textContent='Travel to Sunpetal Meadow with your companion.';const p=session();p.step=4;p.completed=true;saveSession(p);close();refreshLaunch()}

let launch=null;
function refreshLaunch(){const game=app.querySelector('#game'),m=active(),p=session();if(!game||!m){launch?.remove();launch=null;return}if(!launch?.isConnected){launch=document.createElement('button');launch.className='v814-launch';launch.setAttribute('data-v814-open','');game.appendChild(launch)}launch.textContent=p.completed?'🐾 COMPANION QUEST ✓':`🐾 COMPANION QUEST ${Math.min(4,p.step)}/4`;launch.style.display=p.completed?'none':'block'}
function addHubButton(){const p=document.querySelector('.v89-panel');if(!p||!p.querySelector('h2')?.textContent.includes('Player Hub')||p.querySelector('[data-v814-open]'))return;const grid=p.querySelector('.v89-grid');grid?.insertAdjacentHTML('beforeend','<button class="v89-action" data-v814-open>🐾 FIRST COMPANION QUEST</button>')}

let last=0;
function handle(e){const b=e.target.closest?.('button');if(!b)return;const now=Date.now();if(now-last<220)return;let used=true;if(b.hasAttribute('data-v814-open'))open();else if(b.hasAttribute('data-v814-close'))close();else if(b.hasAttribute('data-v814-meet')){const p=session();p.step=1;saveSession(p);render()}else if(b.dataset.v814Care)recordCare(b.dataset.v814Care);else if(b.dataset.v814Answer!=null){const p=session(),q=QUESTIONS[p.question%QUESTIONS.length],fb=panel().querySelector('.v814-feedback');if(b.dataset.v814Answer!==q.a){if(fb)fb.textContent='Not yet. Use the hint and try again.'}else{awardLesson();p.correct=(p.correct||0)+1;p.step=3;saveSession(p);render()}}else if(b.hasAttribute('data-v814-hint')){const p=session(),q=QUESTIONS[p.question%QUESTIONS.length],fb=panel().querySelector('.v814-feedback');if(fb)fb.textContent=q.hint}else if(b.hasAttribute('data-v814-ready')||b.hasAttribute('data-v814-objective'))setSunpetalObjective();else used=false;if(!used)return;last=now;e.preventDefault();e.stopImmediatePropagation()}
document.addEventListener('touchstart',handle,{capture:true,passive:false});document.addEventListener('pointerup',handle,{capture:true,passive:false});document.addEventListener('click',handle,true);

const observer=new MutationObserver(()=>queueMicrotask(()=>{refreshLaunch();addHubButton()}));observer.observe(document.body,{subtree:true,childList:true});setInterval(()=>{refreshLaunch();addHubButton()},900);setTimeout(()=>{refreshLaunch();addHubButton()},400);
const badge=document.getElementById('build-badge');if(badge)badge.textContent='VERDARA V8.14 · FIRST COMPANION SESSION';
