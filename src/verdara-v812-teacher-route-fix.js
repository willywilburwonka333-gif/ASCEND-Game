const PUBLIC_TEACHER_URL='https://ascend-game-sage.vercel.app/teacher';

const style=document.createElement('style');
style.textContent=`
.v812-teacher-link{display:flex;align-items:center;justify-content:center;box-sizing:border-box;min-height:58px;border:4px solid #fff;border-radius:14px;background:#73d8bd;color:#17324d;font-weight:900;padding:9px;text-align:center;text-decoration:none}
`;
document.head.appendChild(style);

function repairTeacherLink(){
  document.querySelectorAll('[data-v89-demo]').forEach(button=>{
    if(button.dataset.v812Fixed==='1')return;
    const link=document.createElement('a');
    link.className='v89-action v812-teacher-link';
    link.href=PUBLIC_TEACHER_URL;
    link.target='_self';
    link.rel='noopener';
    link.textContent='🧑‍🏫 OPEN TEACHER WORKSPACE';
    link.dataset.v812Fixed='1';
    button.replaceWith(link);
  });
}

const observer=new MutationObserver(()=>queueMicrotask(repairTeacherLink));
observer.observe(document.body,{subtree:true,childList:true});
window.addEventListener('pageshow',repairTeacherLink);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)repairTeacherLink()});
setInterval(repairTeacherLink,1000);
setTimeout(repairTeacherLink,250);

const badge=document.getElementById('build-badge');
if(badge)badge.textContent='VERDARA V8.12 · TEACHER ROUTE FIX';
