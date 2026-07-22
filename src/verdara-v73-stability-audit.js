const app=document.getElementById('app');
const SAVE_KEY='ascend_verdara_chapter_v2';
const VALID_ZONES=['springleaf','meadow','forest','cave','mossmere','bridge','canopy','city','gym'];
const load=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'{}')}catch{return{}}};
const write=s=>localStorage.setItem(SAVE_KEY,JSON.stringify(s));

function normaliseSave(){
 const s=load(); let changed=false;
 if(!VALID_ZONES.includes(s.zone)){s.zone='springleaf';changed=true}
 for(const k of ['x','y']){const n=Number(s[k]);if(!Number.isFinite(n)){s[k]=k==='x'?48:72;changed=true}}
 s.x=Math.max(4,Math.min(96,Number(s.x)));s.y=Math.max(16,Math.min(88,Number(s.y)));
 s.flags={miraMet:false,meadowTrainer:false,forestPuzzle:false,engineerMet:false,gymGuide:false,...(s.flags||{})};
 s.missions={welcome:'active',meadow:'locked',forest:'locked',cave:'locked',bridge:'locked',reserve:'locked',gym:'locked',...(s.missions||{})};
 s.eggs=Array.isArray(s.eggs)?s.eggs:[];s.collection=Array.isArray(s.collection)?s.collection:[];s.badges=Array.isArray(s.badges)?s.badges:[];
 s.collected=s.collected&&typeof s.collected==='object'?s.collected:{};s.defeated=s.defeated&&typeof s.defeated==='object'?s.defeated:{};
 if(s.flags.miraMet&&s.missions.welcome!=='complete'){s.missions.welcome='complete';changed=true}
 if(s.flags.meadowTrainer){s.missions.meadow='complete';if(s.missions.forest==='locked')s.missions.forest='active';changed=true}
 if(s.flags.forestPuzzle){s.missions.forest='complete';if(s.missions.cave==='locked')s.missions.cave='active';changed=true}
 if(Number(s.bridgeStage)>=4){s.bridgeStage=4;s.missions.bridge='complete';if(s.missions.reserve==='locked')s.missions.reserve='active';changed=true}
 if(s.badges.includes('Canopy Badge')){s.solara=true;s.missions.gym='complete';changed=true}
 if(changed)write(s);return s;
}
normaliseSave();

const style=document.createElement('style');style.textContent=`
.v73-health{padding:11px;border-radius:14px;background:#eef7ff;margin:8px 0;text-align:left}.v73-row{display:flex;justify-content:space-between;gap:8px;padding:8px 0;border-bottom:1px solid #cfdde5}.v73-row:last-child{border-bottom:0}.v73-ok{color:#23834b;font-weight:900}.v73-wait{color:#8a6514;font-weight:900}.v73-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.v73-actions button{min-height:48px;border:4px solid #fff;border-radius:13px;background:#73d8bd;font-weight:900}.v73-toast{position:absolute;z-index:120;left:50%;top:175px;transform:translateX(-50%);background:#17324dee;color:#fff;border:4px solid #fff;border-radius:13px;padding:9px 13px;font-weight:900;display:none}.v73-toast.show{display:block}@media(max-width:600px){.v73-actions{grid-template-columns:1fr}}
`;document.head.appendChild(style);
function toast(t){let e=app.querySelector('.v73-toast');if(!e){e=document.createElement('div');e.className='v73-toast';app.querySelector('#game')?.appendChild(e)}e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1400)}
function closeAll(){app.querySelectorAll('.modal.open,.v7-drawer.open').forEach(e=>e.classList.remove('open'));document.body.style.pointerEvents='';document.documentElement.style.pointerEvents=''}
function reloadAt(zone,x=50,y=72){const s=normaliseSave();s.zone=zone;s.x=x;s.y=y;write(s);closeAll();location.reload()}
function checks(){const s=normaliseSave();return[
 ['Mira introduction',Boolean(s.flags.miraMet)],['Sunpetal Meadow unlocked',Boolean(s.flags.miraMet)],['Trainer Pip defeated',Boolean(s.flags.meadowTrainer)],['Whisperwood route solved',Boolean(s.flags.forestPuzzle)],['Three bridge crystals',Number(s.bridgeParts||0)>=3],['Broken Span restored',Number(s.bridgeStage||0)>=4],['Four trainers defeated',Number(s.trainers||0)>=4],['Canopy Trial rooms',Boolean(s.flags.gymRooms)],['Canopy Badge',s.badges.includes('Canopy Badge')],['Solara route unlocked',Boolean(s.solara)]]}
function openAudit(){const modal=app.querySelector('.modal'),panel=app.querySelector('.panel');if(!modal||!panel)return;const s=normaliseSave();panel.innerHTML=`<h2>Verdara System Check</h2><p>This checks progression and provides recovery without deleting collection progress.</p><div class="v73-health">${checks().map(([n,ok])=>`<div class="v73-row"><span>${n}</span><span class="${ok?'v73-ok':'v73-wait'}">${ok?'READY':'NOT YET'}</span></div>`).join('')}</div><p><b>Current area:</b> ${s.zone}<br><b>Position:</b> ${Math.round(s.x)}, ${Math.round(s.y)}<br><b>Eggs:</b> ${s.eggs.length} · <b>Monsters:</b> ${s.collection.length}</p><div class="v73-actions"><button data-recover>RECOVER CONTROLS</button><button data-safe>RETURN TO SPRINGLEAF</button><button data-current>RELOAD CURRENT AREA</button><button data-close>CLOSE</button></div>`;modal.classList.add('open');panel.querySelector('[data-recover]').onclick=()=>{closeAll();toast('Controls recovered')};panel.querySelector('[data-safe]').onclick=()=>reloadAt('springleaf',48,72);panel.querySelector('[data-current]').onclick=()=>reloadAt(s.zone,s.x,s.y);panel.querySelector('[data-close]').onclick=()=>modal.classList.remove('open')}

let busy=false,lastAction=0;
function guard(e){const now=Date.now();const b=e.target?.closest?.('button');if(!b)return;if(now-lastAction<220){e.preventDefault();e.stopImmediatePropagation();return}lastAction=now;if(b.classList.contains('act')||b.matches('[data-d]')){if(busy){e.preventDefault();e.stopImmediatePropagation();return}busy=true;setTimeout(()=>busy=false,180)}}
document.addEventListener('touchstart',guard,{capture:true,passive:false});document.addEventListener('click',guard,true);
window.addEventListener('pageshow',()=>{busy=false;closeAll();normaliseSave()});
window.addEventListener('focus',()=>{busy=false;normaliseSave()});

function addAuditToMenu(){const drawer=app.querySelector('.v7-drawer');if(!drawer)return;new MutationObserver(()=>{const grid=drawer.querySelector('.v7-grid');if(!grid||grid.querySelector('[data-v73-audit]'))return;const b=document.createElement('button');b.className='v7-action';b.dataset.v73Audit='1';b.innerHTML='<strong>🛡️ System Check</strong><small>Progress audit and safe recovery</small>';b.onclick=()=>{drawer.classList.remove('open');setTimeout(openAudit,30)};grid.appendChild(b)}).observe(drawer,{childList:true,subtree:true})}
let tries=0;const boot=setInterval(()=>{tries++;if(app.querySelector('#game')){clearInterval(boot);addAuditToMenu();const badge=document.getElementById('build-badge');if(badge)badge.textContent='VERDARA V7.3 · STABILITY AUDIT'}else if(tries>160)clearInterval(boot)},75);
