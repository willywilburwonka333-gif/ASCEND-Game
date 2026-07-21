const screen=document.getElementById('ascend-emergency');
const message=screen?.querySelector('.ae-message');
const actions=screen?.querySelector('.ae-actions');
const failures=[];
const modules=[
['Stable home','./stable-shell.js',true],
['Collection','./collection-bootstrap.js'],
['Core game','./v4.js'],
['Input fixes','./input-hotfix.js'],
['Mobile UX','./mobile-ux.js'],
['World map','./world-expansion.js'],
['Living world','./living-world.js'],
['Regional adventure','./region-adventure-v3.js'],
['Onboarding','./onboarding-v3.js'],
['Onboarding visibility','./onboarding-visibility.js'],
['Opening adventure','./opening-adventure.js'],
['Learning support','./learning-support.js'],
['Adult portals','./adult-portals.js'],
['Runtime audit','./runtime-audit.js']
];
function setStatus(text){if(message)message.textContent=text}
async function boot(){
 setStatus('Loading the safe game home…');
 for(const [name,path,required] of modules){
  try{await import(path);}
  catch(error){failures.push({name,path,error:String(error?.message||error)});console.error(`ASCEND module failed: ${name}`,error);if(required)break;}
 }
 const home=document.getElementById('ascend-stable-home');
 if(home){screen.hidden=true;window.ASCEND_BOOT={ok:true,failures};return}
 setStatus('ASCEND could not load its safe home. Try again after deployment finishes.');
 if(actions)actions.hidden=false;
 window.ASCEND_BOOT={ok:false,failures};
}
window.addEventListener('error',e=>console.error('ASCEND uncaught error',e.error||e.message));
window.addEventListener('unhandledrejection',e=>console.error('ASCEND rejected action',e.reason));
boot();