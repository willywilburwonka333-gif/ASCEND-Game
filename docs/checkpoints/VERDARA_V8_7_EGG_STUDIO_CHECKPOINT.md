# ASCEND — Verdara V8.7 Egg Studio Checkpoint

Checkpoint date: 23 July 2026
Production label: `VERDARA V8.7 · EGG STUDIO`
Production entry: `index.html`
Production commit at checkpoint: `aa7a64cf19d6ddaa788cab40f779426c8c1efff5`

## Current production stack

The root production page currently loads:

1. `src/verdara-production-v3.js`
2. `src/verdara-v4-enhancements.js`
3. `src/verdara-v5-interiors-quests.js`
4. `src/verdara-v6-wild-battles.js`
5. `src/verdara-v7-clean-ui.js`
6. `src/verdara-v7-modal-hotfix.js`
7. `src/verdara-v72-travel-fix.js`
8. `src/verdara-v73-stability-audit.js`
9. `src/verdara-v8-large-world.js`
10. `src/verdara-v81-exploration-life.js`
11. `src/verdara-v85-monster-care.js`
12. `src/verdara-v87-egg-studio.js`

The older direct incubator engine is intentionally not loaded in production because it conflicted with the newer studio input system.

## Current implemented systems

- Mobile movement and ACT interaction
- Multi-zone Verdara prototype
- Travel and state recovery
- Egg discovery and waiting egg inventory
- Mobile egg design studio
- Shell colour, marking colour and free-paint colour
- Preset patterns clipped inside the egg
- Freehand drawing, eraser, undo and clear
- Structured egg-design data saved locally
- Learning questions during hatching
- Creature collection and active companion state
- Temporary creature renderer
- Monster care meters
- Feed, play, rest and clean actions
- Monster swapping
- Wild encounters and trainer battles
- Quest, bridge and gym prototype systems

## Known limitations

- Production still uses stacked historical feature layers and needs consolidation.
- The temporary creature renderer does not yet use six distinct creature blueprints.
- Egg paint currently stores explicit selected colours and vector strokes, but the final dominant-colour extraction and egg-zone sampling system is not yet implemented.
- Creature body zones are not yet mapped from egg zones.
- Purchased/final sprites are not included.
- Mobile interactions must continue to be tested on the user’s iPhone before any feature is treated as fully verified.
- Verdara remains an early prototype rather than a finished country.

## Preservation rule

Do not roll production back to an earlier version. Future fixes must preserve current progress and correct faults in place. Before replacing the temporary creature system, keep this checkpoint available as the exact V8.7 reference state.

## Next approved milestone

Build a six-creature beta blueprint engine with:

- six visually distinct original SVG/CSS blueprints
- three or more colour zones per blueprint
- egg-region colour extraction
- pattern/marking inheritance
- gold variants and particles
- egg design visible in follower, care, swap and battle views
- a reusable blueprint definition format so future creatures are content additions rather than engine rewrites
