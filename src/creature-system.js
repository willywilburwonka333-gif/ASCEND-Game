const FAMILY_CONFIG = {
  bloom: {
    id: 'bloom', name: 'Bloom Egg', colour: 0xff8fbd,
    prefixes: ['Sprig','Moss','Petal','Bramble','Fern','Bloom','Thorn','Clover','Root','Willow','Amber'],
    suffixes: ['let','ling','paw','horn','wing','tail','cub','imp','kin','fox','ram'],
    elements: ['nature','earth'],
  },
  starlight: {
    id: 'starlight', name: 'Starlight Egg', colour: 0x9b83f4,
    prefixes: ['Lumi','Nova','Comet','Astral','Void','Orbit','Cosmo','Solar','Eclipse','Meteor','Nebula'],
    suffixes: ['kit','ling','fin','wing','pup','wyrm','spark','lynx','drake','moth','owl'],
    elements: ['light','cosmic'],
  },
  tide: {
    id: 'tide', name: 'Tide Egg', colour: 0x73d8bd,
    prefixes: ['Bubble','Coral','Mist','Reef','Tide','Wave','Pearl','Aqua','Storm','Lagoon','Kelp'],
    suffixes: ['lit','fin','ray','scale','pup','shell','wing','eel','otter','drake','whale'],
    elements: ['water','storm'],
  },
};

const RARITY_PLAN = [
  ...Array(45).fill('common'),
  ...Array(25).fill('uncommon'),
  ...Array(15).fill('rare'),
  ...Array(10).fill('epic'),
  ...Array(5).fill('legendary'),
];

const FAMILY_COUNTS = { bloom: 34, starlight: 33, tide: 33 };
const FAMILY_ORDER = ['bloom', 'starlight', 'tide'];
const GOLD_BASE_IDS = new Set(['bloom-06','bloom-17','bloom-29','starlight-05','starlight-16','starlight-28','tide-04','tide-15','tide-25','tide-32']);

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function makeEvolutionNames(baseName, familyId, index) {
  const familyTitles = {
    bloom: ['Bud','Grove','Ancient','Crown'],
    starlight: ['Spark','Astral','Celestial','Sovereign'],
    tide: ['Ripple','Torrent','Tempest','Leviathan'],
  };
  const stages = familyTitles[familyId];
  return [
    baseName,
    `${stages[1]} ${baseName}`,
    `${stages[2]} ${baseName}`,
    `${stages[3]} ${baseName}${index % 3 === 0 ? ' Prime' : ''}`,
  ];
}

function buildSpecies() {
  const all = [];
  let globalIndex = 0;
  for (const familyId of FAMILY_ORDER) {
    const config = FAMILY_CONFIG[familyId];
    const count = FAMILY_COUNTS[familyId];
    for (let i = 0; i < count; i += 1) {
      const prefix = config.prefixes[i % config.prefixes.length];
      const suffix = config.suffixes[(i * 3 + Math.floor(i / config.prefixes.length)) % config.suffixes.length];
      const name = titleCase(`${prefix}${suffix}`.replace(/([aeiou])\1+/gi, '$1'));
      const id = `${familyId}-${String(i + 1).padStart(2, '0')}`;
      all.push({
        id,
        number: globalIndex + 1,
        familyId,
        name,
        rarity: RARITY_PLAN[globalIndex],
        element: config.elements[i % config.elements.length],
        evolutions: makeEvolutionNames(name, familyId, i),
        hasGoldVariant: GOLD_BASE_IDS.has(id),
      });
      globalIndex += 1;
    }
  }
  return all;
}

export const STANDARD_SPECIES = buildSpecies();

export const GOLD_VARIANTS = STANDARD_SPECIES
  .filter((species) => species.hasGoldVariant)
  .map((species, index) => ({
    ...species,
    id: `gold-${species.id}`,
    number: 101 + index,
    baseSpeciesId: species.id,
    name: `Golden ${species.name}`,
    rarity: 'gold',
    isGold: true,
    evolutions: species.evolutions.map((name) => `Golden ${name}`),
  }));

export const MONSTER_CATALOG = [...STANDARD_SPECIES, ...GOLD_VARIANTS];

export const EGG_FAMILIES = Object.fromEntries(
  FAMILY_ORDER.map((familyId) => [familyId, {
    ...FAMILY_CONFIG[familyId],
    species: STANDARD_SPECIES.filter((species) => species.familyId === familyId),
  }]),
);

export const rarityWeights = {
  common: 58,
  uncommon: 25,
  rare: 11,
  epic: 5,
  legendary: 1,
};

export const GOLD_HATCH_CHANCE = 0.001;
export const GOLDEN_EGG_HATCH_CHANCE = 0.08;

export function familyFromEggName(name = '') {
  const lower = name.toLowerCase();
  if (lower.includes('bloom')) return EGG_FAMILIES.bloom;
  if (lower.includes('tide')) return EGG_FAMILIES.tide;
  return EGG_FAMILIES.starlight;
}

function rollRarity(random = Math.random) {
  const roll = random() * 100;
  let total = 0;
  for (const rarity of ['legendary','epic','rare','uncommon','common']) {
    total += rarityWeights[rarity];
    if (roll < total) return rarity;
  }
  return 'common';
}

export function hatchCreature(eggFamilyId, random = Math.random, options = {}) {
  const family = EGG_FAMILIES[eggFamilyId] || EGG_FAMILIES.starlight;
  const goldChance = options.goldenEgg ? GOLDEN_EGG_HATCH_CHANCE : GOLD_HATCH_CHANCE;

  let species;
  if (random() < goldChance) {
    const goldPool = GOLD_VARIANTS.filter((item) => item.familyId === family.id);
    species = goldPool[Math.floor(random() * goldPool.length)] || GOLD_VARIANTS[0];
  } else {
    const rarity = rollRarity(random);
    const pool = family.species.filter((item) => item.rarity === rarity);
    species = pool[Math.floor(random() * pool.length)] || family.species[0];
  }

  return {
    uid: `${species.id}-${Date.now()}-${Math.floor(random() * 100000)}`,
    catalogNumber: species.number,
    familyId: family.id,
    speciesId: species.id,
    baseSpeciesId: species.baseSpeciesId || species.id,
    nickname: species.name,
    rarity: species.rarity,
    isGold: Boolean(species.isGold),
    evolutionStage: 0,
    bondXp: 0,
    level: 1,
    discoveredAt: new Date().toISOString(),
  };
}

export function getSpecies(speciesId) {
  return MONSTER_CATALOG.find((species) => species.id === speciesId);
}

export function evolutionName(creature) {
  const species = getSpecies(creature.speciesId);
  return species?.evolutions[Math.min(creature.evolutionStage || 0, 3)] || creature.nickname || 'Companion';
}

export function requiredBondXp(stage) {
  return [80, 220, 500][stage] ?? Infinity;
}

export function addBondXp(creature, amount) {
  const updated = { ...creature, bondXp: (creature.bondXp || 0) + amount };
  while (updated.evolutionStage < 3 && updated.bondXp >= requiredBondXp(updated.evolutionStage)) {
    updated.bondXp -= requiredBondXp(updated.evolutionStage);
    updated.evolutionStage += 1;
  }
  return updated;
}

export function createCollectionState(existing = {}) {
  return {
    eggs: Array.isArray(existing.eggs) ? existing.eggs : [],
    creatures: Array.isArray(existing.creatures) ? existing.creatures : [],
    activeCreatureUid: existing.activeCreatureUid || '',
    discoveredSpecies: Array.isArray(existing.discoveredSpecies) ? existing.discoveredSpecies : [],
    catalogVersion: 2,
    catalogTotal: MONSTER_CATALOG.length,
  };
}

export function addCreatureToCollection(collection, creature) {
  const discovered = new Set(collection.discoveredSpecies || []);
  discovered.add(creature.speciesId);
  return {
    ...collection,
    creatures: [...(collection.creatures || []), creature],
    activeCreatureUid: collection.activeCreatureUid || creature.uid,
    discoveredSpecies: [...discovered],
    catalogVersion: 2,
    catalogTotal: MONSTER_CATALOG.length,
  };
}

export function collectionProgress(collection) {
  const discovered = new Set(collection?.discoveredSpecies || []);
  const standardFound = STANDARD_SPECIES.filter((s) => discovered.has(s.id)).length;
  const goldFound = GOLD_VARIANTS.filter((s) => discovered.has(s.id)).length;
  return {
    standardFound,
    standardTotal: STANDARD_SPECIES.length,
    goldFound,
    goldTotal: GOLD_VARIANTS.length,
    totalFound: standardFound + goldFound,
    total: MONSTER_CATALOG.length,
  };
}
