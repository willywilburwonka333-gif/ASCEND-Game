const V1_KEY='ascend_verdara_chapter_v1';
const V2_KEY='ascend_verdara_chapter_v2';

function migrateLegacySave(){
  let existing=null;
  try{existing=JSON.parse(localStorage.getItem(V2_KEY)||'null')}catch{}
  if(existing)return;

  let old=null;
  try{old=JSON.parse(localStorage.getItem(V1_KEY)||'null')}catch{}
  if(!old)return;

  const waitingCount=Math.max(0,Number(old.eggs)||0);
  const migratedEggs=Array.from({length:waitingCount},(_,i)=>({
    id:`legacy-${Date.now()}-${i}`,
    name:i===0?'Springleaf Egg':`Verdara Egg ${i+1}`,
    rarity:i===0?'uncommon':'common',
    familyId:'bloom'
  }));

  const migrated={
    level:Math.max(1,Number(old.level)||1),
    xp:Math.max(0,Number(old.xp)||0),
    coins:Math.max(0,Number(old.coins)||0),
    zone:old.zone||'springleaf',
    x:Number.isFinite(Number(old.x))?Number(old.x):48,
    y:Number.isFinite(Number(old.y))?Number(old.y):72,
    badges:Array.isArray(old.badges)?old.badges:[],
    solara:Boolean(old.solara),
    eggs:migratedEggs,
    collection:[],
    activeUid:'',
    trainers:Math.max(0,Number(old.trainers)||0),
    bridgeParts:Math.max(0,Number(old.bridgeParts)||0),
    bridgeStage:old.missions?.bridge?4:0,
    missions:{
      welcome:old.missions?.mira?'complete':'active',
      meadow:old.missions?.meadow?'complete':'locked',
      forest:old.missions?.forest?'complete':'locked',
      cave:old.missions?.cave?'complete':'locked',
      bridge:old.missions?.bridge?'complete':'locked',
      reserve:'locked',
      gym:old.missions?.gym?'complete':'locked'
    },
    flags:{
      miraMet:Boolean(old.missions?.mira),
      meadowTrainer:Boolean(old.missions?.meadow),
      forestPuzzle:Boolean(old.missions?.forest),
      engineerMet:Boolean(old.missions?.cave||old.missions?.bridge),
      gymGuide:false,
      legacyMigrated:true
    },
    collected:{},
    defeated:{},
    evidence:[]
  };

  try{localStorage.setItem(V2_KEY,JSON.stringify(migrated))}catch{}
}

migrateLegacySave();
import('./verdara-chapter-v2.js?v=verdara-v3-core-20260723-2');
