const AUDIT_KEY = 'ascend_runtime_audit_v1';
const report = { startedAt:new Date().toISOString(), errors:[], warnings:[], checks:{}, version:1 };
const store = () => { try { localStorage.setItem(AUDIT_KEY, JSON.stringify(report)); } catch {} };

const style = document.createElement('style');
style.textContent = `
button,[role="button"]{touch-action:manipulation;-webkit-tap-highlight-color:transparent}button:not(:disabled){pointer-events:auto}.ar-options button,.lw-options button,.ao-options button,.ov3-btn{min-height:48px}.ascend-hidden-overlay{pointer-events:none!important;visibility:hidden!important}.ascend-audit-toast{position:fixed;left:50%;bottom:calc(18px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:900000;max-width:min(620px,92vw);padding:13px 17px;border:4px solid #fff;border-radius:16px;background:#17324d;color:#fff;font:800 14px Nunito,Arial;box-shadow:0 12px 35px #0005;display:none}.ascend-audit-toast.show{display:block}
#ascend-nav-menu{position:fixed;right:calc(12px + env(safe-area-inset-right));bottom:calc(12px + env(safe-area-inset-bottom));z-index:245000;width:64px;height:64px;border:4px solid #fff;border-radius:50%;background:#6b4cc5;color:#fff;font:900 25px Nunito;box-shadow:0 9px 25px #17324d44;display:none}#ascend-nav-drawer{position:fixed;right:calc(10px + env(safe-area-inset-right));bottom:calc(84px + env(safe-area-inset-bottom));z-index:244999;width:min(290px,88vw);padding:11px;border:4px solid #fff;border-radius:22px;background:#fff8df;box-shadow:0 15px 40px #17324d44;display:none;gap:8px}#ascend-nav-drawer.open{display:grid}#ascend-nav-drawer button{min-height:52px;border:0;border-radius:14px;padding:11px 14px;text-align:left;color:#17324d;font:900 16px Nunito}#ascend-nav-drawer button:nth-child(1){background:#ffca57}#ascend-nav-drawer button:nth-child(2){background:#73d8bd}#ascend-nav-drawer button:nth-child(3){background:#8d72e8;color:#fff}body.ascend-onboarding-active #ascend-nav-menu,body.ascend-overlay-active #ascend-nav-menu,body.ascend-overlay-active #ascend-nav-drawer{display:none!important}@media(pointer:coarse),(max-width:900px){body.ascend-game-ready #ascend-nav-menu{display:block}}
`;
document.head.appendChild(style);

const toast = document.createElement('div'); toast.className='ascend-audit-toast'; document.body.appendChild(toast);
function notify(message, duration=3200){ toast.textContent=message;toast.classList.add('show');clearTimeout(notify.timer);notify.timer=setTimeout(()=>toast.classList.remove('show'),duration); }

window.addEventListener('error', event => { report.errors.push({message:event.message,source:event.filename,line:event.lineno,time:new Date().toISOString()});store();notify('ASCEND recovered from a screen error. Refresh if this control does not respond.'); });
window.addEventListener('unhandledrejection', event => { report.errors.push({message:String(event.reason?.message||event.reason),type:'promise',time:new Date().toISOString()});store();notify('A game action did not finish correctly. Please try it once more.'); });

function profileReady(){try{const p=JSON.parse(localStorage.getItem('ascend_project_kayla_v4')||'{}');return Boolean(p.onboardingComplete && p.openingAdventureComplete);}catch{return false}}
function originalButton(label){return [...document.querySelectorAll('button')].find(b=>!b.closest('#ascend-nav-drawer')&&b.id!=='ascend-nav-menu'&&b.textContent.trim().toUpperCase().includes(label));}

const menu=document.createElement('button');menu.id='ascend-nav-menu';menu.type='button';menu.textContent='☰';menu.setAttribute('aria-label','Open game menu');menu.setAttribute('aria-expanded','false');
const drawer=document.createElement('nav');drawer.id='ascend-nav-drawer';drawer.innerHTML='<button type="button" data-launch="EXPLORE">🧭 Explore current country</button><button type="button" data-launch="ADVENTURE">⚔️ Missions and battles</button><button type="button" data-launch="WORLD">🗺️ World map</button><button type="button" data-close>Close menu</button>';
document.body.append(menu,drawer);
menu.onclick=()=>{const open=drawer.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));};
drawer.onclick=event=>{const b=event.target.closest('button');if(!b)return;if(b.dataset.close!==undefined){drawer.classList.remove('open');return;}const target=originalButton(b.dataset.launch||'');drawer.classList.remove('open');if(target)target.click();else notify(`${b.dataset.launch} is still loading. Try again in a moment.`);};
document.addEventListener('pointerdown',event=>{if(drawer.classList.contains('open')&&!drawer.contains(event.target)&&!menu.contains(event.target))drawer.classList.remove('open');});

function tidyLaunchers(){
  const ready=profileReady();document.body.classList.toggle('ascend-game-ready',ready);
  if(matchMedia('(pointer:coarse)').matches||innerWidth<=900){for(const label of ['EXPLORE','ADVENTURE','WORLD']){const b=originalButton(label);if(b)b.style.setProperty('display','none','important');}}
}

function overlayState(){const open=Boolean(document.querySelector('#ascend-region.open,#ascend-world-overlay.open,#ascend-adventure-overlay.open,.ar-battle.open,.lw-overlay.open'));document.body.classList.toggle('ascend-overlay-active',open);}

let pendingTap=null;
document.addEventListener('click',event=>{if(pendingTap&&pendingTap.target===event.target.closest('button,[role="button"]')){clearTimeout(pendingTap.timer);pendingTap=null;}},true);
document.addEventListener('pointerup',event=>{if(event.pointerType==='mouse')return;const target=event.target.closest('button,[role="button"]');if(!target||target.disabled)return;if(pendingTap)clearTimeout(pendingTap.timer);const timer=setTimeout(()=>{if(target.isConnected&&!target.disabled){report.warnings.push({type:'tap-fallback',label:target.textContent.trim().slice(0,60),time:new Date().toISOString()});store();target.click();}pendingTap=null;},380);pendingTap={target,timer};},true);

function audit(){
  const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);const duplicateIds=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
  const visibleButtons=[...document.querySelectorAll('button')].filter(b=>{const r=b.getBoundingClientRect(),s=getComputedStyle(b);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden';});
  const small=visibleButtons.filter(b=>{const r=b.getBoundingClientRect();return r.width<40||r.height<40;});
  const expected=['ascend-region-button','ascend-adventure-button','ascend-world-button'];
  report.checks={
    duplicateIds,
    visibleButtonCount:visibleButtons.length,
    undersizedButtons:small.map(b=>b.textContent.trim().slice(0,40)),
    launchers:Object.fromEntries(expected.map(id=>[id,Boolean(document.getElementById(id))])),
    onboarding:Boolean(document.getElementById('ascend-onboarding-v3')),
    openingAdventureLoaded:Boolean(document.getElementById('ascend-opening-adventure'))||profileReady(),
    learningSupportLoaded:Boolean(window.ASCEND_LEARNING_SUPPORT),
    checkedAt:new Date().toISOString()
  };
  if(duplicateIds.length)report.warnings.push({type:'duplicate-ids',values:duplicateIds,time:new Date().toISOString()});
  store();
  window.ASCEND_AUDIT=report;
}

const observer=new MutationObserver(()=>{tidyLaunchers();overlayState();});observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});
setInterval(()=>{tidyLaunchers();overlayState();},1000);setTimeout(audit,1800);setTimeout(audit,5000);tidyLaunchers();overlayState();store();
