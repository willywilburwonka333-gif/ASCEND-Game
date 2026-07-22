const KEY='ascend_project_kayla_v4';
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};

function routeToNewRegion(){
  const p=load();
  const opening=document.getElementById('egg-opening');
  const onboardingOpen=document.querySelector('#ascend-onboarding-v3.open');
  const questionModal=[...document.querySelectorAll('canvas')].some(c=>c.offsetWidth>0&&c.offsetHeight>0)&&document.body.classList.contains('ao3-open');
  if(opening||onboardingOpen||questionModal||!p.eggOpeningComplete)return;
  const button=document.getElementById('ascend-region-button');
  const region=document.getElementById('ascend-region');
  if(!button||!region)return;
  document.getElementById('app')?.style.setProperty('visibility','hidden');
  button.style.setProperty('display','none','important');
  if(!region.classList.contains('open')) button.click();
}

window.addEventListener('load',()=>setTimeout(routeToNewRegion,500));
window.addEventListener('focus',()=>setTimeout(routeToNewRegion,150));
window.addEventListener('storage',routeToNewRegion);
new MutationObserver(()=>setTimeout(routeToNewRegion,50)).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
setTimeout(routeToNewRegion,1200);
