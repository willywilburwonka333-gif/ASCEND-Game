# ASCEND — Egg-to-Creature Blueprint Beta

Status: Approved product direction
Scope: Six-blueprint beta engine

## Core product principle

The egg-design system is the creature-customisation engine.

> The species is a surprise. The colours and markings are yours.

The child supplies the visual identity. The blueprint supplies the silhouette, species traits and animation hooks.

## Why this solves the solo-development problem

| Problem | ASCEND solution |
|---|---|
| 100 fully unique hand-painted sprites are unrealistic for a solo developer | 100 reusable blueprints with dynamic colouring are feasible |
| Every child wants a unique creature | Their egg design becomes the creature's unique identity |
| Initial art budget is limited | The player supplies much of the creative variation |
| Players want to compare creatures socially | Paint skill, rarity and blueprint combinations become status |
| New creature releases are expensive | Add one blueprint and zone map, then reuse the same engine |

## Long-term creature distribution

| Tier | Approximate count | Design character |
|---|---:|---|
| Common | 40 | Easy to find, simple readable silhouettes, ideal for learning the paint system |
| Uncommon | 30 | Slightly more complex silhouettes and additional colour-zone variation |
| Rare | 20 | Strongly distinct silhouettes with multiple visible paintable areas |
| Epic | 8 | Dramatic shapes, glowing accent zones and optional palette hints |
| Legendary | 2 | Large, complex blueprints with premium animation hooks |

Total standard blueprints: **100**.

Gold is a variant flag and rendering treatment applied to eligible creatures. It is not a separate blueprint requirement.

## Beta requirement

| Beta component | Count |
|---|---:|
| Creature blueprints | 6 |
| Paint zones per blueprint | 2–3 |
| Shared colour-extraction functions | 1 pipeline |
| Gold creatures required | 0 |
| Gold system required | Variant flag and renderer hooks only |

The beta proves the complete illusion with six blueprints. A child paints an egg purple and green, completes the learning hatch, and receives a visibly purple-and-green creature with a distinct silhouette.

## Proposed six beta blueprints

1. **Spriglet** — compact plant quadruped
2. **Petalhop** — flower-eared hopping creature
3. **Thornback** — small sturdy drake/reptile
4. **Flutterbud** — winged insect/fairy creature
5. **Lumipup** — starlight mammal
6. **Ripplet** — tide/water creature

Names are working names and may change.

Each blueprint must work in:

- world follower view
- care and play view
- monster swap menu
- collection entry
- battle view
- hatch reveal

## Blueprint definition format

Each creature is content data rather than bespoke game code.

```js
{
  id: 'spriglet',
  family: 'bloom',
  rarity: 'common',
  silhouette: 'quadruped-small',
  zones: {
    primary: ['body', 'head'],
    secondary: ['belly', 'legs'],
    accent: ['ears', 'tail', 'markings']
  },
  patternMask: ['body', 'head'],
  goldEligible: true,
  evolutionHooks: ['buds', 'leaf-tail', 'crown-growth']
}
```

The final renderer may use SVG paths or carefully structured HTML/CSS shapes during beta. SVG is preferable for long-term maintainability and sprite-quality scaling.

## Egg design data

The studio stores structured design choices rather than only a screenshot.

```js
{
  eggId: 'egg-123',
  shellColour: '#7f5de8',
  markingColour: '#65cf7d',
  paintColour: '#e84f85',
  pattern: 'stars',
  strokes: [],
  extracted: {
    primary: '#7f5de8',
    secondary: '#65cf7d',
    accent: '#e84f85'
  }
}
```

## Two-to-three zone mapping

Beta blueprints should remain deliberately simple.

### Two-zone blueprint

- Primary: head and body
- Accent: ears, tail, markings

### Three-zone blueprint

- Primary: torso/body
- Secondary: head, belly or limbs
- Accent: markings, spikes, fins, wings or tail

The exact mapping differs by blueprint, but all blueprints consume the same extracted palette object.

## Colour extraction pipeline

One shared function handles every blueprint.

1. Render the completed egg to an offscreen canvas.
2. Ignore transparent pixels, white outline pixels and near-background pixels.
3. Sample meaningful pixels from the egg's upper, middle and lower regions.
4. Quantise similar colours into stable buckets.
5. Select dominant meaningful colours rather than averaging them into muddy colours.
6. Fall back to the selected shell, marking and paint colours where a region has insufficient paint.
7. Save the final three-colour palette permanently on the creature.
8. Pass that palette into whichever blueprint was hatched.

Suggested function contract:

```js
extractCreaturePalette({ canvas, design })
// => { primary, secondary, accent, pattern, confidence }
```

## Egg-region interpretation

The egg canvas can influence creature zones without promising exact pixel transfer.

- Upper egg region influences head, ears, horns or crest.
- Middle egg region influences the main torso/body.
- Lower egg region influences belly, legs, tail or fins.
- Preset patterns and free-paint strokes influence the blueprint's marking mask.

This keeps the result recognisably connected to the egg while allowing every species silhouette to remain readable.

## Gold variant system

Beta only needs the architecture:

```js
{
  isGold: true,
  goldEligible: true
}
```

When activated later, gold treatment can add:

- gold edge accents
- subtle particles
- special hatch effects
- collection badge
- rare audio cue

Gold must not erase the child's chosen palette. It should accent the design, not replace it.

## Retention loop

The system creates several overlapping collection goals:

- discover a desired blueprint
- find rarer egg types
- improve painting skill
- create better colour combinations
- hatch alternate versions of the same species
- pursue rare and eventual gold variants
- compare creature designs with friends

This turns repeated hatching into meaningful creative experimentation rather than duplicate disposal.

## Build order

1. Consolidate the current egg studio into one stable mobile input engine.
2. Implement `extractCreaturePalette`.
3. Define the shared blueprint schema.
4. Build Spriglet end-to-end.
5. Verify egg colours appear in hatch, follower, care, swap and battle views.
6. Add the remaining five beta blueprints using the same renderer contract.
7. Add pattern inheritance.
8. Add the inactive gold flag and renderer hooks.
9. Test the complete loop repeatedly on iPhone.

## Beta success test

The engine is proven when a child can:

1. find an egg
2. choose several colours and markings
3. paint it freely
4. complete learning questions
5. hatch one of six distinct silhouettes
6. immediately recognise their egg colours on the creature
7. see the same customised creature follow them
8. feed, play with and swap that exact creature
9. hatch another egg and receive a visibly different individual

The six-creature beta should prioritise this end-to-end consistency over expanding the world or adding more nominal species.