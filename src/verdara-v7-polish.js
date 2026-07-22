const app=document.getElementById('app');
const SAVE_KEY='ascend_verdara_chapter_v2';
const V6_KEY='ascend_verdara_v6_progress';

const style=document.createElement('style');
style.textContent=`
:root{--ink:#17324d;--cream:#fff8df;--mint:#73d8bd;--gold:#ffca57;--purple:#7658a8}
body{background:#75c96f!important}.v4-tag,.v5-tag,.v6-tag{display:none!important}#build-badge{left:auto!important;right:8px!important;bottom:8px!important;font-size:9px!important;padding:4px 8px!important;opacity:.82}
#game .top{top:max(7px,env(safe-area-inset-top))!important;left:7px!important;right:7px!important;gap:5px!important;align-items:stretch}.top .card{border-width:3px!important;border-radius:13px!important;padding:7px 9px!important;box-shadow:0 5px 13px #17324d24}.top .stats{font-size:12px!important;line-height:1.25!important;min-width:0!important}.top .mapBtn,.top .teamBtn,.top .reset{display:none!important}
.zone{top:70px!important;max-width:72vw!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;border-width:3px!important;padding:6px 11px!important;font-size:16px!important}.objective{top:108px!important;left:8%!important;width:84%!important;max-height:54px!important;overflow:hidden!important;border-width:3px!important;padding:7px 10px!important;font-size:12px!important;line-height:1.2!important;transition:.2s}.objective.expanded{max-height:150px!important}
.v4-tools,.v5-tools,.v6-tools{display:none!important}.v4-area{left:8px!important;bottom:148px!important;max-width:48%!important;font-size:10px!important;padding:6px 8px!important;opacity:.94}.prompt{bottom:145px!important;font-size:12px!important;padding:6px 9px!important;max-width:58vw!important;text-align:center!important}.controls{bottom:max(12px,env(safe-area-inset-bottom))!important}.dpad{width:122px!important;height:122px!important}.dpad button{border-width:4px!important;font-size:18px!important}.act{width:80px!important;height:80px!important;border-width:5px!important;font-size:17px!important}
.obj{font-size:12px!important;max-width:92px!important;text-shadow:0 2px 0 #fff8}.obj .icon{font-size:31px!important}.link{font-size:11px!important;padding:6px 7px!important;border-width:3px!important;max-width:116px!important}.egg{font-size:29px!important}.player{filter:drop-shadow(0 5px 4px #17324d35)}
.v7-menu-btn{position:absolute;z-index:45;right:8px;top:max(64px,calc(env(safe-area-inset-top) + 54px));width:46px;height:46px;border:4px solid #fff;border-radius:14px;background:var(--ink);color:#fff;font:900 21px system-ui;box-shadow:0 6px 14px #17324d45}.v7-progress-btn{position:absolute;z-index:44;left:8px;top:max(64px,calc(env(safe-area-inset-top) + 54px));height:42px;border:4px solid #fff;border-radius:14px;background:#315d75;color:#fff;padding:0 10px;font:900 11px system-ui;box-shadow:0 6px 14px #17324d35}
.v7-sheet{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.v7-sheet button{min-height:54px!important;background:#eef7ff!important;color:var(--ink)!important;text-align:left!important;padding:9px!important}.v7-sheet button strong{display:block;font-size:14px}.v7-sheet button small{font-weight:700;opacity:.75}.v7-section{margin:12px 0 7px;text-align:left;color:#6b4cc5}.v7-progress{display:grid;gap:8px;text-align:left}.v7-progress-row{background:#eef7ff;border-radius:13px;padding:9px}.v7-bar{height:13px;background:#dce5ea;border-radius:99px;overflow:hidden;margin-top:5px}.v7-bar span{display:block;height:100%;background:linear-gradient(90deg,var(--mint),var(--gold),#8d72e8)}.v7-mini-map{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.v7-zone-chip{padding:7px 5px;border-radius:10px;background:#eef7ff;font-size:11px;font-weight:900}.v7-zone-chip.current{background:var(--gold)}.v7-zone-chip.locked{opacity:.45}
.modal{backdrop-filter:blur(5px)}.panel{border-width:5px!important;border-radius:20px!important;box-shadow:0 20px 60px #0006}.panel h1,.panel h2{margin-top:2px}.answers button,.grid button,.list button{font-size:14px}
@media(max-width:600px){#game .top{right:61px!important}.top .stats{font-size:11px!important}.zone{top:67px!important;font-size:15px!important}.objective{top:103px!important}.v7-menu-btn{top:max(7px,env(safe-area-inset-top));right:7px}.v7-progress-btn{top:151px;left:8px;height:36px;font-size:10px}.v4-area{bottom:140px!important;max-width:46%!important}.v7-sheet{grid-template-columns:1fr 1fr}.v7-sheet button{min-height:50px!important}.panel{max-height:88dvh!important}}
`;
document.head.appendChild(style);

function read(key){try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return{}}}
function modalParts(){return{modal:app?.querySelector('.modal'),panel:app?.querySelector('.panel')}}
function open(html){const{modal,panel}=modalParts();if(!modal||!panel)return;panel.innerHTML=html;modal.classList.add('open')}
function close(){modalParts().modal?.classList.remove('open')}
function findButton(text){return [...app.querySelectorAll('button')].find(b=>b.textContent.trim().toUpperCase()===text.toUpperCase())}
function trigger(text){const b=findButton(text);if(b){close();setTimeout(()=>b.click(),40);return true}return false}
function zoneName(){return app.querySelector('.zone')?.textContent?.trim()||'Verdara'}

const menuItems=[
 ['MAP','Country map','MAP'],['TEAM','Choose companion','TEAM'],['QUESTS','Main quest journal','QUESTS'],['SIDES','Optional missions','SIDES'],
 ['EGG ART','Painted egg gallery','EGG ART'],['INTERIOR','Enter local building','INTERIOR'],['FIELD GUIDE','Collection records','FIELD GUIDE'],['TEAM+','Training and evolution','TEAM+'],
 ['WILD','Start habitat battle','WILD BATTLE'],['HABITATS','Encounter records','HABITATS']
];
function showMenu(){
 const s=read(SAVE_KEY),v=read(V6_KEY),active=(s.collection||[]).find(m=>m.uid===s.activeUid)||(s.collection||[])[0],profile=active&&v.monsters?.[active.uid];
 open(`<h2>ASCEND Menu</h2><p><b>${zoneName()}</b>${active?` · ${active.nickname||'Companion'} Lv ${profile?.level||1}`:''}</p><div class="v7-sheet">${menuItems.map(([title,desc,target])=>`<button data-target="${target}"><strong>${title}</strong><small>${desc}</small></button>`).join('')}</div><h3 class="v7-section">SYSTEM</h3><div class="v7-sheet"><button data-progress><strong>PROGRESS</strong><small>Verdara completion</small></button><button data-reset><strong>RESET</strong><small>Erase local chapter save</small></button></div><button data-close>CLOSE</button>`);
 modalParts().panel.querySelectorAll('[data-target]').forEach(b=>b.onclick=()=>{if(!trigger(b.dataset.target))open(`<h2>${b.dataset.target}</h2><p>This system is not available in the current location or has not loaded yet.</p><button data-back>BACK</button>`),modalParts().panel.querySelector('[data-back]').onclick=showMenu});
 modalParts().panel.querySelector('[data-progress]').onclick=showProgress;
 modalParts().panel.querySelector('[data-reset]').onclick=()=>{const reset=findButton('RESET');if(reset){close();reset.click()}};
 modalParts().panel.querySelector('[data-close]').onclick=close;
}

const countryZones=['Springleaf Village','Sunpetal Meadow','Whisperwood Forest','Rootway Caves','Mossmere Town','The Broken Span','High Canopy Reserve','Canopy City','The Canopy Trial'];
function showProgress(){
 const s=read(SAVE_KEY),v=read(V6_KEY);const missionValues=Object.values(s.missions||{});const completed=missionValues.filter(x=>x==='complete').length;const total=Math.max(7,missionValues.length);const storyPct=Math.round(completed/total*100);const eggTotal=(s.eggs?.length||0)+(s.collection?.length||0);const collectionPct=Math.min(100,Math.round((s.collection?.length||0)/20*100));const bridgePct=Math.min(100,Math.round((s.bridgeStage||0)/4*100));const current=zoneName();
 open(`<h2>Verdara Progress</h2><div class="v7-progress"><div class="v7-progress-row"><b>Country story · ${storyPct}%</b><div class="v7-bar"><span style="width:${storyPct}%"></span></div></div><div class="v7-progress-row"><b>Bridge restoration · ${bridgePct}%</b><div class="v7-bar"><span style="width:${bridgePct}%"></span></div></div><div class="v7-progress-row"><b>Verdara collection · ${s.collection?.length||0}/20 discovered</b><div class="v7-bar"><span style="width:${collectionPct}%"></span></div></div><div class="v7-progress-row"><b>Adventure record</b><br>Level ${s.level||1} · Trainers ${s.trainers||0}/4 · Eggs found ${eggTotal}<br>Canopy Badge: ${(s.badges||[]).includes('Canopy Badge')?'earned':'not yet'} · Wild wins ${Object.values(v.habitats||{}).reduce((a,b)=>a+Number(b||0),0)}</div></div><h3>Country route</h3><div class="v7-mini-map">${countryZones.map(z=>`<div class="v7-zone-chip ${z===current?'current':''}">${z}</div>`).join('')}</div><button data-menu>BACK TO MENU</button><button data-close>CLOSE</button>`);
 modalParts().panel.querySelector('[data-menu]').onclick=showMenu;modalParts().panel.querySelector('[data-close]').onclick=close;
}

function boot(){const game=app.querySelector('#game');if(!game)return false;
 document.querySelectorAll('.v4-tag,.v5-tag,.v6-tag').forEach(e=>e.remove());
 let menu=game.querySelector('.v7-menu-btn');if(!menu){menu=document.createElement('button');menu.className='v7-menu-btn';menu.setAttribute('aria-label','Open game menu');menu.textContent='☰';menu.onclick=showMenu;game.appendChild(menu)}
 let progress=game.querySelector('.v7-progress-btn');if(!progress){progress=document.createElement('button');progress.className='v7-progress-btn';progress.textContent='VERDARA PROGRESS';progress.onclick=showProgress;game.appendChild(progress)}
 const objective=game.querySelector('.objective');if(objective&&!objective.dataset.v7){objective.dataset.v7='1';objective.title='Tap to expand';objective.addEventListener('click',()=>objective.classList.toggle('expanded'))}
 return true;
}
let tries=0;const timer=setInterval(()=>{tries++;if(boot()){clearInterval(timer);new MutationObserver(()=>boot()).observe(app,{childList:true,subtree:true})}else if(tries>150)clearInterval(timer)},100);
