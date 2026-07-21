export const EGG_FAMILIES = {
  bloom: {
    id: 'bloom',
    name: 'Bloom Egg',
    colour: 0xff8fbd,
    species: [
      { id: 'spriglet', name: 'Spriglet', rarity: 'common', evolutions: ['Spriglet', 'Bramblehop', 'Verdantusk', 'Crownwood'] },
      { id: 'petalynx', name: 'Petalynx', rarity: 'uncommon', evolutions: ['Petalynx', 'Floraprowl', 'Roselume', 'Empress Bloom'] },
      { id: 'mossimp', name: 'Mossimp', rarity: 'rare', evolutions: ['Mossimp', 'Mossguard', 'Ancient Grove', 'Worldroot'] },
    ],
  },
  starlight: {
    id: 'starlight',
    name: 'Starlight Egg',
    colour: 0x9b83f4,
    species: [
      { id: 'lumin', name: 'Lumin', rarity: 'common', evolutions: ['Lumin', 'Astralyn', 'Nebulion', 'Star Sovereign'] },
      { id: 'voidkit', name: 'Voidkit', rarity: 'uncommon', evolutions: ['Voidkit', 'Riftcat', 'Cosmara', 'Eclipse Monarch'] },
      { id: 'cometling', name: 'Cometling', rarity: 'rare', evolutions: ['Cometling', 'Meteorix', 'Solarion', 'Celestial Titan'] },
    ],
  },
  tide: {
    id: 'tide',
    name: 'Tide Egg',
    colour: 0x73d8bd,
    species: [
      { id: 'bubblit', name: 'Bubblit', rarity: 'common', evolutions: ['Bubblit', 'Reefin', 'Tideram', 'Ocean Warden'] },
      { id: 'coralisk', name: 'Coralisk', rarity: 'uncommon', evolutions: ['Coralisk', 'Reefscale', 'Abyssalisk', 'Leviathan Crown'] },
      { id: 'mistfin', name: 'Mistfin', rarity: 'rare', evolutions: ['Mistfin', 'Cloudray', 'Stormfin', 'Tempest Seraph'] },
    ],
  },
};

export const rarityWeights = { common: 70, uncommon: 25, rare: 5 };

export function familyFromEggName(name = '') {
  const lower = name.toLowerCase();
  if (lower.includes('bloom')) return EGG_FAMILIES.bloom;
  if (lower.includes('tide')) return EGG_FAMILIES.tide;
  return EGG_FAMILIES.starlight;
}

export function hatchCreature(eggFamilyId, random = Math.random) {
  const family = EGG_FAMILIES[eggFamilyId] || EGG_FAMILIES.starlight;
  const roll = random() * 100;
  const rarity = roll < rarityWeights.rare ? 'rare' : roll < rarityWeights.rare + rarityWeights.uncommon ? 'uncommon' : 'common';
  const pool = family.species.filter((species) => species.rarity === rarity);
  const species = pool[Math.floor(random() * pool.length)] || family.species[0];
  return {
    uid: `${species.id}-${Date.now()}-${Math.floor(random() * 100000)}`,
    familyId: family.id,
    speciesId: species.id,
    nickname: species.name,
    rarity: species.rarity,
    evolutionStage: 0,
    bondXp: 0,
    level: 1,
    discoveredAt: new Date().toISOString(),
  };
}

export function evolutionName(creature) {
  const family = EGG_FAMILIES[creature.familyId];
  const species = family?.species.find((item) => item.id === creature.speciesId);
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
  };
}
