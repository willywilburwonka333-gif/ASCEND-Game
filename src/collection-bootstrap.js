import {
  addCreatureToCollection,
  createCollectionState,
  familyFromEggName,
  hatchCreature,
} from './creature-system.js';

const PROFILE_KEY = 'ascend_project_kayla_v4';

function activateCollectionProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return;

    const profile = JSON.parse(raw);
    profile.collection = createCollectionState(profile.collection);

    if (profile.companion && profile.egg && profile.collection.creatures.length === 0) {
      const family = familyFromEggName(profile.egg);
      const starter = hatchCreature(family.id);
      starter.nickname = profile.companion;
      starter.isStarter = true;
      profile.collection = addCreatureToCollection(profile.collection, starter);
    }

    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.warn('ASCEND collection profile could not be initialised.', error);
  }
}

activateCollectionProfile();
window.addEventListener('storage', activateCollectionProfile);
