export const COUNTRIES = [
  {
    id: 'verdara',
    name: 'Verdara',
    subtitle: 'The Living Canopy',
    colour: '#58b96a',
    icon: '🌿',
    eggFamilies: ['bloom'],
    culture: {
      greeting: 'May your path grow strong.',
      values: ['care for living systems', 'shared responsibility', 'patient craftsmanship'],
      arts: 'woven leaf patterns, carved seed stories and layered drum rhythms',
      food: 'orchard fruit, root vegetables, grains and herb broths',
      learning: 'ecosystems, sustainable choices, oral storytelling and community roles',
    },
    locations: ['Canopy Gate', 'Rootbridge Village', 'Moonseed Orchard', 'Old-Growth Shrine', 'Crownwood Basin'],
    npcs: [
      { id: 'mara', name: 'Mara', role: 'Canopy Guide', teaches: 'ecosystems and respectful observation' },
      { id: 'tovin', name: 'Tovin', role: 'Seed Archivist', teaches: 'oral history and patterns' },
      { id: 'nali', name: 'Nali', role: 'Bridge Maker', teaches: 'measurement and design' },
      { id: 'oro', name: 'Oro', role: 'Habitat Keeper', teaches: 'animal needs and conservation' },
    ],
  },
  {
    id: 'solara',
    name: 'Solara',
    subtitle: 'The Sunstone Coast',
    colour: '#f4a84f',
    icon: '☀️',
    eggFamilies: ['bloom', 'starlight'],
    culture: {
      greeting: 'Share the light you carry.',
      values: ['hospitality', 'craft mastery', 'fair exchange'],
      arts: 'mosaic courtyards, geometric textiles and call-and-response music',
      food: 'flatbreads, citrus, legumes, roasted vegetables and spice blends',
      learning: 'trade routes, geometry, architecture, climate and shared meals',
    },
    locations: ['Sunharbour', 'Mosaic Market', 'Citrus Terraces', 'Glasswind Road', 'Helio Observatory'],
    npcs: [
      { id: 'safi', name: 'Safi', role: 'Market Steward', teaches: 'fair trade and percentages' },
      { id: 'leon', name: 'Leon', role: 'Mosaic Artist', teaches: 'symmetry and geometric patterns' },
      { id: 'amina', name: 'Amina', role: 'Harbour Historian', teaches: 'migration and exchange' },
      { id: 'kairos', name: 'Kairos', role: 'Sky Reader', teaches: 'seasons and astronomy' },
    ],
  },
  {
    id: 'mizuno',
    name: 'Mizuno',
    subtitle: 'The River of Seasons',
    colour: '#5aa9e6',
    icon: '🌊',
    eggFamilies: ['tide', 'starlight'],
    culture: {
      greeting: 'Travel gently with the season.',
      values: ['careful practice', 'respect for place', 'balance between old and new'],
      arts: 'ink landscapes, folded paper engineering and festival lanterns',
      food: 'rice, noodles, vegetables, fish and seasonal sweets',
      learning: 'seasonal cycles, precision, engineering, poetry and water management',
    },
    locations: ['Lantern Quay', 'Terraced Springs', 'Paperwing Workshop', 'Rainbell Forest', 'Mirror Lake'],
    npcs: [
      { id: 'hana', name: 'Hana', role: 'Lantern Keeper', teaches: 'light, colour and festivals' },
      { id: 'ren', name: 'Ren', role: 'Paper Engineer', teaches: 'fractions and spatial reasoning' },
      { id: 'mei', name: 'Mei', role: 'River Planner', teaches: 'water systems and mapping' },
      { id: 'sora', name: 'Sora', role: 'Season Poet', teaches: 'imagery and concise writing' },
    ],
  },
  {
    id: 'amaru',
    name: 'Amaru',
    subtitle: 'The Mountain Thread',
    colour: '#b676d8',
    icon: '⛰️',
    eggFamilies: ['bloom', 'tide'],
    culture: {
      greeting: 'May every thread hold the whole.',
      values: ['reciprocity', 'family knowledge', 'strength through cooperation'],
      arts: 'bright woven symbols, clay instruments and mountain dance stories',
      food: 'corn, potatoes, beans, fruit and slow-cooked stews',
      learning: 'altitude, farming terraces, pattern language, cooperation and astronomy',
    },
    locations: ['Threadgate', 'Cloudstep Farms', 'Condor Pass', 'Echo Loom Hall', 'Starpeak Sanctuary'],
    npcs: [
      { id: 'inti', name: 'Inti', role: 'Terrace Farmer', teaches: 'area, slope and food systems' },
      { id: 'luz', name: 'Luz', role: 'Master Weaver', teaches: 'sequences and symbolic patterns' },
      { id: 'pacha', name: 'Pacha', role: 'Trail Keeper', teaches: 'maps, scale and altitude' },
      { id: 'yara', name: 'Yara', role: 'Night Observer', teaches: 'constellations and calendars' },
    ],
  },
  {
    id: 'aurora',
    name: 'Aurora Reach',
    subtitle: 'The Northern Lights',
    colour: '#65c9b8',
    icon: '❄️',
    eggFamilies: ['starlight', 'tide'],
    culture: {
      greeting: 'Keep warmth for the next traveller.',
      values: ['preparedness', 'collective safety', 'resourcefulness'],
      arts: 'carved light panels, wool patterns and story songs for long nights',
      food: 'berries, grains, fish, root vegetables and warming soups',
      learning: 'weather, navigation, insulation, seasonal daylight and community safety',
    },
    locations: ['Hearthport', 'Frostpine Trail', 'Aurora Library', 'Whalelight Bay', 'Skyfire Citadel'],
    npcs: [
      { id: 'elin', name: 'Elin', role: 'Weather Reader', teaches: 'forecasting and data charts' },
      { id: 'mika', name: 'Mika', role: 'Hearth Builder', teaches: 'heat, materials and insulation' },
      { id: 'niko', name: 'Niko', role: 'Sea Navigator', teaches: 'direction, coordinates and scale' },
      { id: 'freya', name: 'Freya', role: 'Story Curator', teaches: 'sources, memory and perspective' },
    ],
  },
];

export const MISSION_TEMPLATES = [
  { type: 'meet', title: 'Meet the Guides', goal: 1, description: 'Speak with a local guide and learn how people care for their home.' },
  { type: 'culture', title: 'Living Culture', goal: 2, description: 'Complete two culture-learning encounters about language, art, food, values or place.' },
  { type: 'track', title: 'Read the Signs', goal: 3, description: 'Find three tracks, sounds or habitat clues left by a regional monster.' },
  { type: 'bond', title: 'Earn Its Trust', goal: 3, description: 'Complete three adaptive learning challenges to calm and understand the creature.' },
  { type: 'guardian', title: 'Country Guardian', goal: 1, description: 'Restore the country shrine and earn a regional egg.' },
];

export function createWorldState(existing = {}) {
  const progress = Object.fromEntries(COUNTRIES.map((country, index) => [country.id, {
    unlocked: existing.progress?.[country.id]?.unlocked ?? index === 0,
    missionIndex: existing.progress?.[country.id]?.missionIndex || 0,
    missionProgress: existing.progress?.[country.id]?.missionProgress || 0,
    cultureLessons: existing.progress?.[country.id]?.cultureLessons || 0,
    monstersCaught: existing.progress?.[country.id]?.monstersCaught || 0,
    guardianCleared: Boolean(existing.progress?.[country.id]?.guardianCleared),
  }]));
  return {
    currentCountry: existing.currentCountry || COUNTRIES[0].id,
    visitedCountries: Array.isArray(existing.visitedCountries) ? existing.visitedCountries : [COUNTRIES[0].id],
    progress,
    fieldNotes: Array.isArray(existing.fieldNotes) ? existing.fieldNotes : [],
    version: 1,
  };
}

export function countryById(id) {
  return COUNTRIES.find((country) => country.id === id) || COUNTRIES[0];
}
