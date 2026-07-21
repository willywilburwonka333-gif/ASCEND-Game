export const SUBJECTS = [
  { id:'mathematics', name:'Mathematics', icon:'➗', colour:'#8d72e8', domains:['number','algebra','measurement','geometry','statistics','probability'] },
  { id:'english', name:'English', icon:'📚', colour:'#ff8fbd', domains:['reading','writing','spelling','grammar','speaking','literature'] },
  { id:'science', name:'Science', icon:'🔬', colour:'#55c8f2', domains:['biology','chemistry','physics','earth and space','inquiry'] },
  { id:'humanities', name:'Humanities', icon:'🌍', colour:'#f4a84f', domains:['history','geography','civics','economics','culture'] },
  { id:'technologies', name:'Technologies', icon:'💻', colour:'#65c9b8', domains:['digital systems','coding','design','engineering','data'] },
  { id:'health', name:'Health & PE', icon:'🏃', colour:'#73d8bd', domains:['health','movement','relationships','safety','wellbeing'] },
  { id:'arts', name:'The Arts', icon:'🎨', colour:'#b676d8', domains:['visual arts','music','drama','dance','media arts'] },
  { id:'languages', name:'Languages', icon:'🗣️', colour:'#ffca57', domains:['vocabulary','listening','speaking','reading','culture'] },
];

export const COUNTRY_GYMS = {
  verdara: [
    { subject:'science', name:'Canopy Science Conservatory', leader:'Keeper Oro', focus:'ecosystems and evidence' },
    { subject:'english', name:'Seedstory Hall', leader:'Archivist Tovin', focus:'reading, speaking and narrative' },
    { subject:'health', name:'Living Path Arena', leader:'Guide Mara', focus:'wellbeing, movement and community care' },
  ],
  solara: [
    { subject:'mathematics', name:'Sunstone Mathematics Forum', leader:'Steward Safi', focus:'percentages, geometry and trade' },
    { subject:'humanities', name:'Harbour Humanities Guild', leader:'Historian Amina', focus:'migration, exchange and place' },
    { subject:'arts', name:'Mosaic Arts Coliseum', leader:'Artist Leon', focus:'pattern, symmetry and visual design' },
  ],
  mizuno: [
    { subject:'technologies', name:'Paperwing Technology Lab', leader:'Engineer Ren', focus:'design, systems and spatial reasoning' },
    { subject:'english', name:'Season Poetry House', leader:'Poet Sora', focus:'imagery, language and concise writing' },
    { subject:'science', name:'Mirror Lake Science Temple', leader:'Planner Mei', focus:'water, seasons and inquiry' },
  ],
  amaru: [
    { subject:'mathematics', name:'Mountain Mathematics Citadel', leader:'Farmer Inti', focus:'area, scale, ratio and slope' },
    { subject:'humanities', name:'Thread of Time Hall', leader:'Master Luz', focus:'history, culture and symbolic systems' },
    { subject:'arts', name:'Echo Loom Arts Arena', leader:'Master Luz', focus:'music, pattern and performance' },
  ],
  aurora: [
    { subject:'science', name:'Skyfire Science Station', leader:'Weather Reader Elin', focus:'weather, heat and materials' },
    { subject:'technologies', name:'Aurora Navigation Lab', leader:'Navigator Niko', focus:'coordinates, data and systems' },
    { subject:'health', name:'Hearthguard Health Lodge', leader:'Builder Mika', focus:'safety, resilience and collective wellbeing' },
  ],
};

export const SUBJECT_TRAINER_TITLES = {
  mathematics:['Number Tamer','Pattern Scout','Geometry Keeper','Data Ranger'],
  english:['Word Weaver','Story Scout','Grammar Keeper','Reading Ranger'],
  science:['Field Researcher','Experiment Keeper','Sky Observer','Life Systems Ranger'],
  humanities:['Map Keeper','Time Traveller','Culture Guide','Civics Ranger'],
  technologies:['Code Tinkerer','Design Builder','Systems Scout','Data Engineer'],
  health:['Movement Coach','Wellbeing Guide','Safety Keeper','Teamwork Ranger'],
  arts:['Rhythm Keeper','Colour Weaver','Stage Guide','Media Maker'],
  languages:['Phrase Scout','Sound Keeper','Culture Guide','Conversation Ranger'],
};

export function createSubjectState(existing={}) {
  const mastery = Object.fromEntries(SUBJECTS.map(s=>[s.id, Number(existing.mastery?.[s.id] ?? .2)]));
  const badges = Object.fromEntries(SUBJECTS.map(s=>[s.id, Array.isArray(existing.badges?.[s.id]) ? existing.badges[s.id] : []]));
  return {
    mastery,
    badges,
    trainersDefeated: existing.trainersDefeated || 0,
    gymsCleared: existing.gymsCleared || 0,
    battleStreak: existing.battleStreak || 0,
    version:1,
  };
}

export function subjectById(id){ return SUBJECTS.find(s=>s.id===id) || SUBJECTS[0]; }
