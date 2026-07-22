export const CAMPAIGN_VERSION = 1;

export const COUNTRIES = [
  {
    id:'verdara', order:1, name:'Verdara', subtitle:'The Living Canopy', colour:'#67bf68', accent:'#dff7bf', icon:'🌿',
    levelRange:[1,18], badge:'Canopy Badge', next:'solara',
    towns:[
      {id:'springleaf',name:'Springleaf Village',type:'village',role:'Starting town, Mira, first incubator, basic shops and first missions'},
      {id:'mossmere',name:'Mossmere Town',type:'town',role:'Forest research, reading quests, healing centre and market'},
      {id:'canopy-city',name:'Canopy City',type:'city',role:'Verdara capital, advanced missions, regional incubator and gym district'}
    ],
    environments:[
      {id:'sunpetal-meadow',name:'Sunpetal Meadow',kind:'meadow',eggs:['common','uncommon'],puzzles:['patterns','measurement']},
      {id:'whisperwood',name:'Whisperwood Forest',kind:'forest',eggs:['common','uncommon','rare'],puzzles:['reading clues','ecosystems']},
      {id:'rootway-caves',name:'Rootway Caves',kind:'cave',eggs:['uncommon','rare'],puzzles:['place value','maps']},
      {id:'broken-span',name:'The Broken Span',kind:'bridge',eggs:['rare'],puzzles:['fractions','materials','instructions']},
      {id:'high-canopy',name:'High Canopy Reserve',kind:'reserve',eggs:['rare','epic'],puzzles:['science inquiry','navigation']}
    ],
    gate:{id:'verdara-bridge',name:'Fractured Canopy Bridge',requires:['repair quest','Canopy Badge'],unlocks:'solara'},
    gym:{id:'canopy-gym',name:'The Canopy Trial',location:'Canopy City',leader:'Keeper Oro',subjects:['science','english','health'],recommendedLevel:16,rooms:6},
    storyGoal:'Restore the Canopy Bridge and prove that the forest settlements can work together.'
  },
  {
    id:'solara', order:2, name:'Solara', subtitle:'The Sunstone Coast', colour:'#efb34d', accent:'#fff1ad', icon:'☀️',
    levelRange:[18,34], badge:'Sunstone Badge', next:'mizuno',
    towns:[
      {id:'copperbay',name:'Copperbay Port',type:'port',role:'Arrival harbour, trading missions and coastal incubator'},
      {id:'mirage-market',name:'Mirage Market Town',type:'town',role:'Trade, percentages, languages, art and culture quests'},
      {id:'sunstone-city',name:'Sunstone City',type:'city',role:'Solara capital, museum quarter, grand arena and gym district'}
    ],
    environments:[
      {id:'golden-dunes',name:'Golden Dunes',kind:'desert',eggs:['common','uncommon'],puzzles:['coordinates','temperature']},
      {id:'coral-coast',name:'Coral Coast',kind:'coast',eggs:['common','rare'],puzzles:['tides','measurement']},
      {id:'glass-ruins',name:'Glass Ruins',kind:'ruins',eggs:['rare','epic'],puzzles:['geometry','history clues']},
      {id:'sunvine-canyon',name:'Sunvine Canyon',kind:'canyon',eggs:['uncommon','rare'],puzzles:['ratio','erosion']},
      {id:'harbour-isles',name:'Harbour Isles',kind:'islands',eggs:['rare','epic'],puzzles:['maps','trade routes']}
    ],
    gate:{id:'solara-harbour',name:'Storm-Damaged Harbour',requires:['harbour restoration','Sunstone Badge'],unlocks:'mizuno'},
    gym:{id:'sunstone-gym',name:'The Sunstone Trial',location:'Sunstone City',leader:'Steward Safi',subjects:['mathematics','humanities','arts'],recommendedLevel:32,rooms:7},
    storyGoal:'Repair the harbour network and reconnect Solara’s isolated communities.'
  },
  {
    id:'mizuno', order:3, name:'Mizuno', subtitle:'The River of Seasons', colour:'#4aaed8', accent:'#c9f2ff', icon:'🌊',
    levelRange:[34,52], badge:'Riverflow Badge', next:'amaru',
    towns:[
      {id:'reedbank',name:'Reedbank Village',type:'village',role:'Wetlands arrival, river ecology and first Mizuno incubator'},
      {id:'paperwing',name:'Paperwing Town',type:'town',role:'Technology workshops, poetry houses and boat building'},
      {id:'season-city',name:'Season City',type:'city',role:'Mizuno capital, waterworks, academy and gym district'}
    ],
    environments:[
      {id:'mirror-marsh',name:'Mirror Marsh',kind:'wetland',eggs:['common','uncommon'],puzzles:['food webs','data']},
      {id:'lantern-river',name:'Lantern River',kind:'river',eggs:['uncommon','rare'],puzzles:['flow rates','poetry clues']},
      {id:'paperwing-islands',name:'Paperwing Islands',kind:'islands',eggs:['rare','epic'],puzzles:['design','spatial reasoning']},
      {id:'seasonal-falls',name:'Seasonal Falls',kind:'waterfall',eggs:['rare'],puzzles:['cycles','fractions']},
      {id:'floodgate-depths',name:'Floodgate Depths',kind:'facility',eggs:['epic'],puzzles:['systems','coding logic']}
    ],
    gate:{id:'mizuno-floodgates',name:'The Silent Floodgates',requires:['waterworks restoration','Riverflow Badge'],unlocks:'amaru'},
    gym:{id:'riverflow-gym',name:'The Riverflow Trial',location:'Season City',leader:'Engineer Ren',subjects:['technologies','english','science'],recommendedLevel:50,rooms:7},
    storyGoal:'Restart the seasonal water system before the river towns flood or dry out.'
  },
  {
    id:'amaru', order:4, name:'Amaru', subtitle:'The Mountain Thread', colour:'#b18453', accent:'#f2d9ae', icon:'🏔️',
    levelRange:[52,72], badge:'Mountain Thread Badge', next:'aurora',
    towns:[
      {id:'terrace-village',name:'Terrace Village',type:'village',role:'Mountain arrival, farming, local stories and incubator'},
      {id:'echo-loom',name:'Echo Loom Town',type:'town',role:'Music, textiles, engineering and cultural missions'},
      {id:'summit-city',name:'Summit City',type:'city',role:'Amaru capital, archives, mountain lifts and gym district'}
    ],
    environments:[
      {id:'terraced-fields',name:'Terraced Fields',kind:'farmland',eggs:['common','uncommon'],puzzles:['area','sustainability']},
      {id:'echo-caverns',name:'Echo Caverns',kind:'cave',eggs:['uncommon','rare'],puzzles:['sound','patterns']},
      {id:'cloudstep-pass',name:'Cloudstep Pass',kind:'mountain',eggs:['rare'],puzzles:['scale','weather']},
      {id:'threadkeeper-ruins',name:'Threadkeeper Ruins',kind:'ruins',eggs:['rare','epic'],puzzles:['history','symbols']},
      {id:'condor-heights',name:'Condor Heights',kind:'highlands',eggs:['epic','legendary'],puzzles:['navigation','forces']}
    ],
    gate:{id:'amaru-high-pass',name:'The Frozen High Pass',requires:['lift restoration','Mountain Thread Badge'],unlocks:'aurora'},
    gym:{id:'mountain-gym',name:'The Mountain Thread Trial',location:'Summit City',leader:'Master Luz',subjects:['mathematics','humanities','arts'],recommendedLevel:70,rooms:8},
    storyGoal:'Restore the mountain lift and reopen the ancient route to Aurora Reach.'
  },
  {
    id:'aurora', order:5, name:'Aurora Reach', subtitle:'The Northern Lights', colour:'#7c83d9', accent:'#e3e8ff', icon:'❄️',
    levelRange:[72,100], badge:null, next:null,
    towns:[
      {id:'hearthlight',name:'Hearthlight Village',type:'village',role:'Northern arrival, survival preparation and incubator'},
      {id:'skywatch',name:'Skywatch Town',type:'town',role:'Weather research, navigation and technology missions'},
      {id:'aurora-capital',name:'Aurora Capital',type:'city',role:'Final city, championship village and world research council'},
      {id:'champions-citadel',name:'Champions’ Citadel',type:'championship',role:'World Championship tournament and final story'}
    ],
    environments:[
      {id:'snowglass-plains',name:'Snowglass Plains',kind:'tundra',eggs:['common','uncommon'],puzzles:['temperature','safety']},
      {id:'icebound-caves',name:'Icebound Caves',kind:'ice cave',eggs:['rare','epic'],puzzles:['states of matter','light']},
      {id:'aurora-labs',name:'Aurora Research Labs',kind:'laboratory',eggs:['rare'],puzzles:['data','systems']},
      {id:'northstar-range',name:'Northstar Range',kind:'mountain',eggs:['epic'],puzzles:['coordinates','forces']},
      {id:'legendary-sanctum',name:'Legendary Sanctum',kind:'sanctum',eggs:['legendary','gold'],puzzles:['multi-subject mastery','world lore']}
    ],
    gate:null,
    gym:null,
    championship:{id:'world-championship',name:'ASCEND World Championship',location:'Champions’ Citadel',requires:['four country badges','championship qualification','minimum team readiness'],rounds:5,subjects:['all'],recommendedLevel:92},
    storyGoal:'Qualify for and win the World Championship while restoring the final world system.'
  }
];

export const COUNTRY_BY_ID = Object.fromEntries(COUNTRIES.map(c=>[c.id,c]));

export function createCampaignProgress(existing={}){
  return {
    currentCountry:existing.currentCountry||'verdara',
    unlockedCountries:Array.isArray(existing.unlockedCountries)?existing.unlockedCountries:['verdara'],
    badges:Array.isArray(existing.badges)?existing.badges:[],
    discoveredLocations:Array.isArray(existing.discoveredLocations)?existing.discoveredLocations:['springleaf'],
    repairedGates:Array.isArray(existing.repairedGates)?existing.repairedGates:[],
    completedGyms:Array.isArray(existing.completedGyms)?existing.completedGyms:[],
    championshipQualified:Boolean(existing.championshipQualified),
    worldChampion:Boolean(existing.worldChampion),
    version:CAMPAIGN_VERSION
  };
}

export function canEnterCountry(progress,countryId){return progress.unlockedCountries.includes(countryId)}
export function canChallengeGym(progress,countryId){const c=COUNTRY_BY_ID[countryId];return Boolean(c?.gym&&c.towns.every(t=>progress.discoveredLocations.includes(t.id))&&c.environments.filter(e=>e.id!==c.gate?.id).length>=3)}
export function unlockNextCountry(progress,countryId){const c=COUNTRY_BY_ID[countryId];if(!c?.next)return progress;const unlocked=new Set(progress.unlockedCountries);unlocked.add(c.next);return {...progress,unlockedCountries:[...unlocked],currentCountry:c.next};}
