const app=document.getElementById('app');
const SAVE_KEY='ascend_verdara_chapter_v2';

function getParts(){return{modal:app?.querySelector('.modal'),panel:app?.querySelector('.panel')}}
function closeModal(){const {modal}=getParts();if(modal)modal.classList.remove('open')}
function persistMiraStart(){
  try{
    const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');
    s.flags={...(s.flags||{}),miraMet:true};
    s.missions={...(s.missions||{}),welcome:'complete',meadow:s.missions?.meadow==='complete'?'complete':'active'};
    localStorage.setItem(SAVE_KEY,JSON.stringify(s));
  }catch{}
}
function isDismissButton(el){
  return Boolean(el?.closest?.('[data-x],[data-close],[data-cancel]'));
}
function isBeginJourney(el){
  const b=el?.closest?.('button');
  return Boolean(b&&/BEGIN\s+JOURNEY/i.test(b.textContent||''));
}
let lastHandled=0;
function rescue(e){
  const now=Date.now();
  if(now-lastHandled<250)return;
  const target=e.target;
  if(!isDismissButton(target)&&!isBeginJourney(target))return;
  lastHandled=now;
  if(isBeginJourney(target))persistMiraStart();
  e.preventDefault();
  e.stopPropagation();
  closeModal();
  setTimeout(()=>{
    const modal=getParts().modal;
    if(modal)modal.classList.remove('open');
  },50);
}
function install(){
  const {modal}=getParts();
  if(!modal||modal.dataset.mobileRescue==='1')return false;
  modal.dataset.mobileRescue='1';
  modal.addEventListener('touchend',rescue,{capture:true,passive:false});
  modal.addEventListener('pointerup',rescue,{capture:true,passive:false});
  modal.addEventListener('click',rescue,true);
  return true;
}
let tries=0;const timer=setInterval(()=>{tries++;if(install()||tries>160)clearInterval(timer)},75);
