const PROFILE_KEY = 'ascend_project_kayla_v4';
const ADULT_KEY = 'ascend_adult_portal_v1';

const SUBJECTS = [
  ['mathematics','Mathematics','➗'],['english','English','📚'],['science','Science','🔬'],
  ['humanities','Humanities','🌍'],['technologies','Technologies','💻'],['health','Health & PE','🏃'],
  ['arts','The Arts','🎨'],['languages','Languages','🗣️'],
];

const loadProfile = () => { try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}'); } catch { return {}; } };
const saveProfile = (profile) => localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
const loadAdult = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(ADULT_KEY) || '{}');
    return {
      pin: saved.pin || '',
      assignments: Array.isArray(saved.assignments) ? saved.assignments : [],
      observations: Array.isArray(saved.observations) ? saved.observations : [],
      lastViewed: saved.lastViewed || null,
    };
  } catch { return { pin:'', assignments:[], observations:[], lastViewed:null }; }
};
const saveAdult = (state) => localStorage.setItem(ADULT_KEY, JSON.stringify(state));
let adult = loadAdult();
let activeTab = 'parent';
let unlocked = false;

const css = document.createElement('style');
css.textContent = `
#ascend-adult-launcher{position:fixed;left:max(12px,env(safe-area-inset-left));bottom:max(14px,env(safe-area-inset-bottom));z-index:248500;border:4px solid #fff;border-radius:18px;padding:10px 13px;background:#17324d;color:#fff;font:900 12px Nunito,sans-serif;box-shadow:0 8px 22px #17324d44;cursor:pointer;touch-action:manipulation}
body.ascend-onboarding-active #ascend-adult-launcher,body.ascend-overlay-open #ascend-adult-launcher{display:none!important}
#ascend-adult-overlay{position:fixed;inset:0;z-index:500000;display:none;overflow:auto;padding:calc(14px + env(safe-area-inset-top)) calc(12px + env(safe-area-inset-right)) calc(24px + env(safe-area-inset-bottom)) calc(12px + env(safe-area-inset-left));background:linear-gradient(180deg,#dff5ff,#edf9ef);font-family:Nunito,Arial;color:#17324d}
#ascend-adult-overlay.open{display:block}.ap-shell{width:min(1100px,100%);margin:auto}.ap-top{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}.ap-top h1{margin:0;font:800 clamp(28px,5vw,48px) 'Baloo 2',Nunito;color:#6b4cc5}.ap-close{border:0;border-radius:14px;padding:12px 16px;background:#17324d;color:#fff;font-weight:900;cursor:pointer}.ap-panel{background:#fff8df;border:6px solid #fff;border-radius:28px;padding:18px;box-shadow:0 18px 48px #17324d22}.ap-gate{max-width:520px;margin:10vh auto;text-align:center}.ap-gate input{width:100%;font:900 24px Nunito;text-align:center;letter-spacing:7px;padding:14px;border:4px solid #d8e4ec;border-radius:16px}.ap-btn{border:4px solid #fff;border-radius:15px;padding:12px 16px;background:#6b4cc5;color:#fff;font:900 15px Nunito;cursor:pointer;touch-action:manipulation}.ap-btn.alt{background:#73d8bd;color:#17324d}.ap-btn.warn{background:#e66f82}.ap-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}.ap-tab{flex:1;min-width:170px;border:4px solid #fff;border-radius:16px;padding:13px;background:#eaf1f6;font:900 17px Nunito;color:#17324d}.ap-tab.active{background:#ffca57}.ap-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.ap-card{background:#fff;border-radius:19px;padding:15px;box-shadow:0 6px 18px #17324d14}.ap-card h3{margin:0 0 9px;color:#6b4cc5}.ap-metric{font:900 32px 'Baloo 2',Nunito}.ap-subject{display:grid;grid-template-columns:145px 1fr 58px;align-items:center;gap:10px;margin:9px 0}.ap-bar{height:15px;background:#e1e8ed;border-radius:999px;overflow:hidden}.ap-bar span{display:block;height:100%;background:linear-gradient(90deg,#73d8bd,#6b4cc5)}.ap-status{font-size:13px;font-weight:900}.ap-list{display:grid;gap:9px}.ap-item{padding:12px;border-radius:15px;background:#eef7ff}.ap-form{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.ap-form label{font-weight:900}.ap-form input,.ap-form select,.ap-form textarea{width:100%;margin-top:5px;padding:11px;border:3px solid #d9e4eb;border-radius:12px;font:700 15px Nunito;background:#fff;color:#17324d}.ap-form textarea{min-height:95px;resize:vertical}.ap-wide{grid-column:1/-1}.ap-upload{border:4px dashed #8d72e8;border-radius:16px;padding:14px;background:#f3efff;text-align:center}.ap-preview{max-width:100%;max-height:230px;border-radius:13px;margin-top:9px}.ap-note{font-size:13px;color:#4d6b7c}.ap-chip{display:inline-block;margin:3px;padding:6px 9px;border-radius:999px;background:#eaf8ef;font-weight:900;font-size:13px}.ap-empty{padding:20px;text-align:center;color:#587184}
@media(max-width:760px){#ascend-adult-launcher{font-size:0;width:52px;height:52px;border-radius:50%;padding:0}#ascend-adult-launcher:after{content:'🔒';font-size:22px}.ap-grid,.ap-form{grid-template-columns:1fr}.ap-wide{grid-column:auto}.ap-panel{padding:12px;border-radius:22px}.ap-subject{grid-template-columns:115px 1fr 48px;font-size:13px}}
`;
document.head.appendChild(css);

const launcher = document.createElement('button');
launcher.id = 'ascend-adult-launcher';
launcher.textContent = '🔒 PARENTS / TEACHERS';
launcher.setAttribute('aria-label','Open parent and teacher area');
document.body.appendChild(launcher);

const overlay = document.createElement('section');
overlay.id = 'ascend-adult-overlay';
overlay.innerHTML = '<div class="ap-shell"><div class="ap-top"><h1>ASCEND Adult Hub</h1><button class="ap-close">BACK TO GAME</button></div><div class="ap-panel"></div></div>';
document.body.appendChild(overlay);
const panel = overlay.querySelector('.ap-panel');
overlay.querySelector('.ap-close').onclick = () => { overlay.classList.remove('open'); document.body.classList.remove('ascend-overlay-open'); unlocked = false; };
launcher.onclick = () => { overlay.classList.add('open'); document.body.classList.add('ascend-overlay-open'); renderGate(); };

function esc(value=''){ return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
function gradeFrom(value){ if(value >= .85) return ['A','Excellent']; if(value >= .7) return ['B','Strong']; if(value >= .55) return ['C','Developing']; if(value >= .4) return ['D','Needs support']; return ['E','Foundation building']; }
function percentage(value){ const n = Number(value); return Math.max(0,Math.min(100,Math.round((Number.isFinite(n) ? n : .2) * 100))); }

function renderGate(){
  const setup = !adult.pin;
  panel.innerHTML = `<div class="ap-gate"><h2>${setup?'Create an adult PIN':'Adult access'}</h2><p>${setup?'Set a four-digit PIN so children cannot change assignments or adult reports.':'Enter the four-digit parent/teacher PIN.'}</p><input class="ap-pin" inputmode="numeric" maxlength="4" type="password" aria-label="Adult PIN"><div style="margin-top:14px"><button class="ap-btn ap-unlock">${setup?'SAVE PIN':'UNLOCK'}</button></div><div class="ap-note" style="margin-top:12px">This prototype stores the PIN and schoolwork locally on this device. Production accounts require secure authentication and cloud permissions.</div><div class="ap-error" style="color:#b44d66;font-weight:900;margin-top:9px"></div></div>`;
  const input = panel.querySelector('.ap-pin');
  const submit = () => {
    const value = input.value.replace(/\D/g,'').slice(0,4);
    if(value.length !== 4){ panel.querySelector('.ap-error').textContent = 'Enter exactly four numbers.'; return; }
    if(setup){ adult.pin = value; saveAdult(adult); }
    else if(value !== adult.pin){ panel.querySelector('.ap-error').textContent = 'That PIN is not correct.'; return; }
    unlocked = true; adult.lastViewed = new Date().toISOString(); saveAdult(adult); renderHub();
  };
  panel.querySelector('.ap-unlock').onclick = submit;
  input.addEventListener('keydown', e => { if(e.key === 'Enter') submit(); });
  setTimeout(()=>input.focus(),80);
}

function reportData(){
  const p = loadProfile();
  const subjectMastery = p.subjects?.mastery || p.subjectMastery || {};
  const skillMastery = p.mastery || {};
  const attempts = Number(p.totalAttempts || p.questionsAnswered || p.totalCorrect || 0);
  const correct = Number(p.totalCorrect || Math.round(attempts * .65));
  const accuracy = attempts ? correct / attempts : 0;
  const subjectRows = SUBJECTS.map(([id,name,icon]) => {
    let value = subjectMastery[id];
    if(value == null){
      const aliases = {mathematics:['placeValue','multiplication','division','fractions','decimals','percentages','algebra','ratio'],english:['reading','writing','spelling','grammar'],science:['science'],humanities:['humanities'],technologies:['technologies'],health:['health'],arts:['arts'],languages:['languages']};
      const values = (aliases[id]||[]).map(k=>Number(skillMastery[k])).filter(Number.isFinite);
      value = values.length ? values.reduce((a,b)=>a+b,0)/values.length : .2;
    }
    return {id,name,icon,value:Number(value)||.2,grade:gradeFrom(Number(value)||.2)};
  });
  const strengths = [...subjectRows].sort((a,b)=>b.value-a.value).slice(0,3);
  const priorities = [...subjectRows].sort((a,b)=>a.value-b.value).slice(0,3);
  return {p,attempts,correct,accuracy,subjectRows,strengths,priorities};
}

function renderHub(){
  if(!unlocked) return renderGate();
  panel.innerHTML = `<div class="ap-tabs"><button class="ap-tab ${activeTab==='parent'?'active':''}" data-tab="parent">👪 LIVE PARENT REPORT</button><button class="ap-tab ${activeTab==='teacher'?'active':''}" data-tab="teacher">🏫 TEACHER WORKSPACE</button></div><div class="ap-content"></div>`;
  panel.querySelectorAll('[data-tab]').forEach(btn => btn.onclick = () => { activeTab = btn.dataset.tab; renderHub(); });
  if(activeTab === 'parent') renderParent(panel.querySelector('.ap-content')); else renderTeacher(panel.querySelector('.ap-content'));
}

function renderParent(host){
  const r = reportData();
  const p = r.p;
  const updated = new Date().toLocaleString();
  host.innerHTML = `<div class="ap-grid">
    <div class="ap-card"><h3>Current learning snapshot</h3><div class="ap-metric">${esc(p.companion || 'Learner')}</div><div>Year ${p.schoolYear || '—'} · Level ${p.level || 1}</div><p class="ap-note">Updated live from game activity: ${updated}</p></div>
    <div class="ap-card"><h3>Engagement</h3><div class="ap-metric">${r.attempts}</div><div>learning encounters attempted</div><p>Accuracy: <b>${Math.round(r.accuracy*100)}%</b> · Current streak: <b>${p.streak || p.subjects?.battleStreak || 0}</b></p></div>
    <div class="ap-card ap-wide"><h3>Live school report</h3>${r.subjectRows.map(s=>`<div class="ap-subject"><div>${s.icon} <b>${s.name}</b></div><div class="ap-bar"><span style="width:${percentage(s.value)}%"></span></div><div class="ap-status">${s.grade[0]} · ${percentage(s.value)}%</div></div>`).join('')}<p class="ap-note">These ratings reflect demonstrated game evidence, not an official school grade. Confidence improves as more independent and retention questions are completed.</p></div>
    <div class="ap-card"><h3>Current strengths</h3>${r.strengths.map(s=>`<div class="ap-item">${s.icon} <b>${s.name}</b><br><small>${s.grade[1]} · ${percentage(s.value)}%</small></div>`).join('')}</div>
    <div class="ap-card"><h3>Next priorities</h3>${r.priorities.map(s=>`<div class="ap-item">${s.icon} <b>${s.name}</b><br><small>ASCEND will increase support and prerequisite checks here.</small></div>`).join('')}</div>
    <div class="ap-card ap-wide"><h3>Teacher-assigned work</h3>${adult.assignments.length ? `<div class="ap-list">${adult.assignments.slice().reverse().map(a=>`<div class="ap-item"><b>${esc(a.title)}</b> · ${esc(a.subjectName)} · Year ${a.year}<br><small>${esc(a.status)} · ${new Date(a.createdAt).toLocaleDateString()}</small></div>`).join('')}</div>` : '<div class="ap-empty">No teacher work has been added yet.</div>'}</div>
  </div>`;
}

function renderTeacher(host){
  host.innerHTML = `<div class="ap-grid">
    <div class="ap-card ap-wide"><h3>Add work or homework</h3><form class="ap-form ap-assignment-form">
      <label>Title<input name="title" maxlength="60" required placeholder="Fractions worksheet"></label>
      <label>Subject<select name="subject">${SUBJECTS.map(([id,name])=>`<option value="${id}">${name}</option>`).join('')}</select></label>
      <label>School year<select name="year">${Array.from({length:12},(_,i)=>`<option value="${i+1}">Year ${i+1}</option>`).join('')}</select></label>
      <label>Skill or topic<input name="skill" maxlength="60" placeholder="Equivalent fractions"></label>
      <label class="ap-wide">Instructions<textarea name="instructions" placeholder="What should the learner practise or complete?"></textarea></label>
      <label class="ap-wide">Teacher notes / text from worksheet<textarea name="sourceText" placeholder="Type or paste important questions, vocabulary or instructions from the schoolwork."></textarea></label>
      <div class="ap-upload ap-wide"><b>Upload or scan schoolwork</b><p class="ap-note">Choose a photo/PDF image or use the device camera. Images are resized before being stored locally.</p><input class="ap-file" type="file" accept="image/*" capture="environment"><div class="ap-image-holder"></div></div>
      <label>Priority<select name="priority"><option>Normal</option><option>High</option><option>Revision</option><option>Assessment preparation</option></select></label>
      <label>Due date<input name="dueDate" type="date"></label>
      <div class="ap-wide"><button class="ap-btn" type="submit">SAVE AND ADD TO ADAPTIVE PLAN</button></div>
      <div class="ap-wide ap-form-message" style="font-weight:900"></div>
    </form></div>
    <div class="ap-card ap-wide"><h3>Assignment queue</h3><div class="ap-list ap-assignment-list"></div></div>
    <div class="ap-card"><h3>How adaptation works</h3><p>Teacher work adds a weighted learning target. ASCEND raises the chance of related missions, trainer questions, hints and review encounters without removing the learner’s prerequisite support.</p></div>
    <div class="ap-card"><h3>Privacy status</h3><p>This prototype stores work on this browser only. It does not upload images to a server. A school release needs accounts, encryption, retention controls, consent and role-based access.</p></div>
  </div>`;
  const form = host.querySelector('.ap-assignment-form');
  let imageData = '';
  const file = host.querySelector('.ap-file');
  file.onchange = async () => {
    const selected = file.files?.[0];
    if(!selected) return;
    if(selected.size > 12 * 1024 * 1024){ form.querySelector('.ap-form-message').textContent = 'That image is too large. Choose one under 12 MB.'; return; }
    try {
      imageData = await resizeImage(selected, 1100, .72);
      host.querySelector('.ap-image-holder').innerHTML = `<img class="ap-preview" src="${imageData}" alt="Uploaded schoolwork preview">`;
      form.querySelector('.ap-form-message').textContent = 'Schoolwork image ready.';
    } catch { form.querySelector('.ap-form-message').textContent = 'The image could not be prepared.'; }
  };
  form.onsubmit = e => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = SUBJECTS.find(s=>s[0]===data.get('subject')) || SUBJECTS[0];
    const assignment = {
      id:`work-${Date.now()}-${Math.floor(Math.random()*10000)}`,
      title:String(data.get('title')||'').trim(), subjectId:subject[0], subjectName:subject[1], year:Number(data.get('year')),
      skill:String(data.get('skill')||'').trim(), instructions:String(data.get('instructions')||'').trim(), sourceText:String(data.get('sourceText')||'').trim(),
      priority:String(data.get('priority')||'Normal'), dueDate:String(data.get('dueDate')||''), imageData, status:'Assigned', createdAt:new Date().toISOString(),
    };
    if(!assignment.title){ form.querySelector('.ap-form-message').textContent = 'Add a title first.'; return; }
    try {
      adult.assignments.push(assignment); saveAdult(adult);
      const profile = loadProfile();
      profile.teacherPlan = profile.teacherPlan || {targets:[],version:1};
      profile.teacherPlan.targets = profile.teacherPlan.targets || [];
      profile.teacherPlan.targets.push({assignmentId:assignment.id,subjectId:assignment.subjectId,skill:assignment.skill,year:assignment.year,priority:assignment.priority,dueDate:assignment.dueDate,active:true,createdAt:assignment.createdAt});
      saveProfile(profile);
      form.reset(); imageData=''; host.querySelector('.ap-image-holder').innerHTML=''; form.querySelector('.ap-form-message').textContent = 'Saved. ASCEND will now weight future encounters toward this work.';
      renderAssignmentList(host.querySelector('.ap-assignment-list'));
    } catch(err){
      form.querySelector('.ap-form-message').textContent = 'This device could not save the image. Try a smaller photo or save without the image.';
    }
  };
  renderAssignmentList(host.querySelector('.ap-assignment-list'));
}

function renderAssignmentList(host){
  if(!adult.assignments.length){ host.innerHTML='<div class="ap-empty">No assignments yet.</div>'; return; }
  host.innerHTML = adult.assignments.slice().reverse().map(a=>`<div class="ap-item" data-id="${a.id}"><b>${esc(a.title)}</b> <span class="ap-chip">${esc(a.subjectName)}</span> <span class="ap-chip">Year ${a.year}</span><br>${a.skill?`<small>Focus: ${esc(a.skill)}</small><br>`:''}<small>${esc(a.status)}${a.dueDate?` · Due ${esc(a.dueDate)}`:''}</small><div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:8px"><button class="ap-btn alt" data-action="complete">MARK COMPLETE</button><button class="ap-btn warn" data-action="remove">REMOVE</button></div></div>`).join('');
  host.querySelectorAll('[data-action]').forEach(btn => btn.onclick = () => {
    const id = btn.closest('[data-id]').dataset.id;
    const item = adult.assignments.find(a=>a.id===id);
    if(btn.dataset.action==='complete' && item) item.status = item.status==='Completed'?'Assigned':'Completed';
    if(btn.dataset.action==='remove') adult.assignments = adult.assignments.filter(a=>a.id!==id);
    saveAdult(adult);
    const profile = loadProfile();
    if(profile.teacherPlan?.targets){
      if(btn.dataset.action==='remove') profile.teacherPlan.targets = profile.teacherPlan.targets.filter(t=>t.assignmentId!==id);
      else profile.teacherPlan.targets.forEach(t=>{ if(t.assignmentId===id) t.active = item?.status !== 'Completed'; });
      saveProfile(profile);
    }
    renderAssignmentList(host);
  });
}

function resizeImage(file,maxSize,quality){
  return new Promise((resolve,reject)=>{
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image(); img.onerror = reject;
      img.onload = () => {
        const ratio = Math.min(1,maxSize/Math.max(img.width,img.height));
        const canvas = document.createElement('canvas'); canvas.width=Math.max(1,Math.round(img.width*ratio)); canvas.height=Math.max(1,Math.round(img.height*ratio));
        canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
        resolve(canvas.toDataURL('image/jpeg',quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

window.addEventListener('storage',()=>{ adult=loadAdult(); if(overlay.classList.contains('open')&&unlocked) renderHub(); });
window.ASCEND_ADULT_HUB = { open:()=>launcher.click(), report:reportData, assignments:()=>loadAdult().assignments };
