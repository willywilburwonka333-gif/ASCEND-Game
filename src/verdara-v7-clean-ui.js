const SAVE_KEY='ascend_verdara_chapter_v2';
const V5_KEY='ascend_verdara_v5_progress';
const V6_KEY='ascend_verdara_v6_progress';
const app=document.getElementById('app');

const style=document.createElement('style');
style.textContent=`
/* V7 clean mobile shell */
#build-badge,.v4-tag,.v5-tag,.v6-tag{display:none!important}
.v4-tools,.v5-tools,.v6-tools{display:none!important}
#game .top{top:max(8px,env(safe-area-inset-top));left:10px;right:10px;gap:7px;align-items:center}
#game .top .mapBtn,#game .top .teamBtn,#game .top .reset{display:none!important}
#game .stats{max-width:calc(100% - 68px);min-height:54px;padding:8px 12px!important;border-width:4px!important;border-radius:16px!important;font-size:14px!important;line-height:1.25;white-space:normal}
.v7-menu-button{width:54px;height:54px;border:4px solid #fff;border-radius:16px;background:#17324de8;color:#fff;font-size:25px;font-weight:900;display:grid;place-items:center;box-shadow:0 8px 18px #17324d25}
#game .zone{top:76px!important;max-width:78%;font-size:17px!important;padding:7px 12px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#game .objective{top:119px!important;left:8%!important;width:84%!important;max-height:58px;overflow:hidden;font-size:13px!important;line-height:1.25;padding:8px 11px!important;transition:max-height .2s ease}
#game .objective.expanded{max-height:150px}
.v7-objective-toggle{position:absolute;z-index:24;top:121px;right:3%;width:34px;height:34px;border:3px solid #fff;border-radius:50%;background:#17324de8;color:#fff;font-weight:900}
.v4-area{left:10px!important;bottom:154px!important;max-width:44%!important;font-size:11px!important;line-height:1.2;padding:7px 9px!important;opacity:.92}
#game .prompt{bottom:151px!important;max-width:62%;text-align:center;font-size:13px!important;white-space:normal}
#game .controls{left:10px!important;right:10px!important;bottom:max(12px,env(safe-area-inset-bottom))!important}
#game .dpad{width:128px!important;height:128px!important}
#game .dpad button{border-width:4px!important;border-radius:16px!important;background:#ffffffeb!important}
#game .act{width:82px!important;height:82px!important;border-width:6px!important;font-size:18px!important;box-shadow:0 8px 18px #17324d25}
.v7-drawer{position:absolute;z-index:80;inset:0;display:none;background:#17324de8;padding:12px;place-items:center}
.v7-drawer.open{display:grid}
.v7-panel{width:min(720px,95vw);max-height:90dvh;overflow:auto;background:#fff8df;border:7px solid #fff;border-radius:24px;padding:15px}
.v7-panel h2{margin:0 0 8px;text-align:center;color:#17324d}
.v7-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}
.v7-action{min-height:58px;border:4px solid #fff;border-radius:15px;background:#eef7ff;padding:10px;font-weight:900;color:#17324d;text-align:left}
.v7-action strong{display:block;font-size:15px}.v7-action small{display:block;margin-top:3px;font-size:11px;opacity:.8}
.v7-progress{margin-top:12px;padding:12px;border-radius:16px;background:#eef7ff}
.v7-bar{height:15px;border-radius:999px;background:#dce5ea;overflow:hidden}.v7-bar span{display:block;height:100%;background:linear-gradient(90deg,#73d8bd,#8d72e8)}
.v7-close{width:100%;margin-top:12px;min-height:52px;border:4px solid #fff;border-radius:14px;background:#17324d;color:#fff;font-weight:900}
.v7-mini{display:grid;grid-template-columns:repeat(2,1fr);gap:7px;margin-top:8px}.v7-mini div{background:#fff8df;border-radius:11px;padding:7px;font-size:12px;font-weight:800}
@media(max-width:600px){
 #game .stats{font-size:12px!important;max-width:calc(100% - 61px)}
 .v7-menu-button{width:49px;height:49px;font-size:22px}
 #game .zone{top:70px!important;font-size:16px!important}
 #game .objective{top:112px!important;width:86%!important;left:7%!important}
 .v7-objective-toggle{top:114px}
 .v7-grid{grid-template-columns:1fr 1fr}.v7-action{min-height:54px;padding:8px}.v7-action strong{font-size:13px}
 .v4-area{max-width:46%!important;bottom:150px!important}
}
`;
document.head.appendChild(style);

function load(key){try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return{}}}
function save(key,value){localStorage.setItem(key,JSON.stringify(value))}
function waitForGame(){return new Promise(resolve=>{let n=0;const t=setInterval(()=>{const game=app?.querySelector('#game');if(game){clearInterval(t);resolve(game)}else if(++n>160){clearInterval(t);resolve(null)}},80)})}
function click(selector){const el=app?.querySelector(selector);if(el){el.click();return true}return false}
function closeDrawer(){app.querySelector('.v7-drawer')?.classList.remove('open')}
function currentZone(){return app.querySelector('.zone')?.textContent?.trim()||'Verdara'}
function exploration(){
 const s=load(SAVE_KEY),v5=load(V5_KEY),v6=load(V6_KEY);
 const zones=['springleaf','meadow','forest','cave','mossmere','bridge','canopy','city','gym'];
 const visited=new Set([s.zone,...Object.keys(s.collected||{}).map(k=>k.split('-')[0]),...Object.keys(s.defeated||{}).map(k=>k.split('-')[0])]);
 const visitedCount=Math.min(zones.length,visited.size);
 const eggs=(s.eggs?.length||0)+(s.collection?.length||0);
 const quests=Object.values(s.missions||{}).filter(x=>x==='complete').length;
 const sideClaims=Object.keys(v5.claimed||{}).length;
 const habitats=Object.keys(v6.habitats||{}).length;
 const score=Math.min(100,Math.round((visitedCount/zones.length)*35+Math.min(1,eggs/8)*20+Math.min(1,(s.trainers||0)/4)*15+Math.min(1,(s.bridgeStage||0)/4)*15+Math.min(1,habitats/5)*10+((s.badges||[]).includes('Canopy Badge')?5:0)));
 return {s,v5,v6,visitedCount,eggs,quests,sideClaims,habitats,score};
}
function openMenu(){
 const d=app.querySelector('.v7-drawer'),p=exploration();
 d.innerHTML=`<div class="v7-panel"><h2>ASCEND Menu</h2><div class="v7-grid">
 <button class="v7-action" data-a="map"><strong>🗺️ World Map</strong><small>Routes, gates and country progress</small></button>
 <button class="v7-action" data-a="team"><strong>🐾 Team</strong><small>Companions and active leader</small></button>
 <button class="v7-action" data-a="quests"><strong>📜 Main Quests</strong><small>Current country story</small></button>
 <button class="v7-action" data-a="sides"><strong>⭐ Side Quests</strong><small>Optional rewards and exploration</small></button>
 <button class="v7-action" data-a="eggart"><strong>🎨 Egg Art</strong><small>Saved shell paintings</small></button>
 <button class="v7-action" data-a="interior"><strong>🏠 Enter Building</strong><small>Use the current town interior</small></button>
 <button class="v7-action" data-a="field"><strong>📚 Field Guide</strong><small>Collection and species records</small></button>
 <button class="v7-action" data-a="wild"><strong>⚔️ Wild Encounter</strong><small>Battle in this habitat</small></button>
 <button class="v7-action" data-a="teamplus"><strong>💪 Training</strong><small>HP, XP, bond and evolution</small></button>
 <button class="v7-action" data-a="habitats"><strong>🌿 Habitats</strong><small>Wild encounter records</small></button>
 <button class="v7-action" data-a="reset"><strong>↺ Reset Save</strong><small>Start Verdara again</small></button>
 </div><div class="v7-progress"><b>Verdara exploration · ${p.score}%</b><div class="v7-bar"><span style="width:${p.score}%"></span></div><div class="v7-mini"><div>Areas ${p.visitedCount}/9</div><div>Eggs found ${p.eggs}</div><div>Trainers ${p.s.trainers||0}/4</div><div>Bridge ${p.s.bridgeStage||0}/4</div><div>Habitats ${p.habitats}/5</div><div>Badge ${(p.s.badges||[]).includes('Canopy Badge')?'earned':'not yet'}</div></div></div><button class="v7-close">RETURN TO ${currentZone().toUpperCase()}</button></div>`;
 d.classList.add('open');
 const map={map:'.mapBtn',team:'.teamBtn',quests:'.v4-tools [data-journal]',sides:'.v5-tools [data-side]',eggart:'.v4-tools [data-eggs]',interior:'.v5-tools [data-inside]',field:'.v5-tools [data-dex]',wild:'.v6-tools [data-wild]',teamplus:'.v6-tools [data-teamplus]',habitats:'.v6-tools [data-habitats]',reset:'.reset'};
 d.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const a=b.dataset.a;if(a==='reset'&&!confirm('Reset all Verdara progress?'))return;closeDrawer();setTimeout(()=>click(map[a]),40)});
 d.querySelector('.v7-close').onclick=closeDrawer;
}

waitForGame().then(game=>{
 if(!game)return;
 document.querySelectorAll('#build-badge,.v4-tag,.v5-tag,.v6-tag').forEach(e=>e.remove());
 const top=game.querySelector('.top');
 const menu=document.createElement('button');menu.className='v7-menu-button';menu.setAttribute('aria-label','Open game menu');menu.textContent='☰';top?.appendChild(menu);menu.onclick=openMenu;
 const toggle=document.createElement('button');toggle.className='v7-objective-toggle';toggle.textContent='⌄';game.appendChild(toggle);toggle.onclick=()=>{const o=game.querySelector('.objective');o?.classList.toggle('expanded');toggle.textContent=o?.classList.contains('expanded')?'⌃':'⌄'};
 const drawer=document.createElement('div');drawer.className='v7-drawer';game.appendChild(drawer);drawer.addEventListener('click',e=>{if(e.target===drawer)closeDrawer()});
 const badge=document.createElement('div');badge.id='build-badge';badge.textContent='VERDARA V7 · CLEAN UI';document.body.appendChild(badge);
 const stats=game.querySelector('.stats');
 if(stats){new MutationObserver(()=>{stats.textContent=stats.textContent.replace(/ · /g,'  •  ')}).observe(stats,{childList:true,characterData:true,subtree:true})}
});
