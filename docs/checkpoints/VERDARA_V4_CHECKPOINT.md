# ASCEND Verdara V4 Production Checkpoint

Checkpoint date: 23 July 2026
Checkpoint commit before further development: `5449881e61f3515c0256194f1c3a81175599e406`

## Production entry

- `index.html`
- `src/verdara-production-v3.js`
- `src/verdara-chapter-v2.js`
- `src/verdara-v4-enhancements.js`

## Working systems preserved

- Direct four-button mobile movement and ACT interaction.
- Persistent local save migration from Verdara V1 into the current V2 save model.
- Connected Verdara zones from Springleaf Village through the Canopy Trial.
- Route locks based on story, trainer, level, bridge and gym requirements.
- Discoverable named eggs with rarity and habitat family.
- Incubator egg selection and four-question hatching energy sequence.
- Random creature hatching from the 100-monster catalogue.
- Persistent collection and active companion selection.
- Adaptive learning questions with hints and explanations.
- Trainer encounters, rewards, XP, levels and coins.
- Three Rootway crystals and four Broken Span repair stages.
- Three Canopy Trial learning rooms and Gym Leader Aster.
- Canopy Badge and Solara unlock state.
- Egg free-paint studio using touch, stylus or mouse.
- Paint colours, brush sizes, eraser, clear and saved egg artwork.
- Egg-art gallery and quest journal.
- Zone-specific scenery and visible bridge repair state.

## Known limitations at checkpoint

- Maps are still compact activity zones rather than full-scale country maps.
- Buildings are visual scenery rather than complete walk-in interiors.
- Collision geometry is minimal.
- Characters and monsters remain placeholder representations.
- Side quests, town services and collection research are shallow.
- Battle presentation is question-driven rather than a complete tactical battle system.

## Recovery rule

If a later build breaks production, restore `index.html` to load:

```html
<script type="module" src="/src/verdara-production-v3.js?v=production-v4-core-20260723-1"></script>
<script type="module" src="/src/verdara-v4-enhancements.js?v=production-v4-enhancements-20260723-1"></script>
```

Do not delete the V4 files when building later versions.