# Typelite

A roguelite-inspired character generator that turns real personality typology into playable game characters. Toggle any combination of 5 systems, take a quiz or manually select types, and generate a full character sheet with stats, abilities, class, element, and combat behavior.

## Features

- **Quiz or manual entry** — Quick mode uses dichotomies; Deep mode scores cognitive functions directly. Or skip the quiz and pick types in the Builder.
- **Modular systems** — Toggle each of the 5 typology systems on/off independently. Disabled domains can be set manually via overrides.
- **Character sheet** — Stats, class with empowered/stressed states, 4 abilities with power values, element + passive, combat orientation and passives.
- **Cross-system insights** — The engine detects notable interactions between systems (stat-ability alignment, class-element thematic convergence, etc.) and surfaces up to 4 ranked observations.
- **AI report & backstory** — Optional AI-generated typology analysis and character backstory.
- **Export** — PDF and share-image export of the full character sheet.
- **Character comparison** — Side-by-side stat and ability comparison between two characters.
- **URL sharing** — Full builder state serialized into the URL for sharing and bookmarking.
- **Procedural names** — Phonetically generated names influenced by class harshness and element.

## Typology Systems

| System | Gameplay Domain | What it determines |
|---|---|---|
| **Attitudinal Psyche** | Base stats | V/L/E/F position -> Willpower, Intelligence, Spirit, Vitality |
| **Enneagram** | Class & archetype | Type -> class. Wings, instincts, tritype blend stat modifiers |
| **Jungian Type (Beebe model)** | Ability kit | 4-function stack -> 4 abilities (Hero, Parent, Child, Inferior) |
| **Socionics** | Element & affinity | Quadra -> elemental school. Club -> passive trait |
| **Expanded Instincts** | Combat behavior | Center -> orientation. Triads -> activation, positioning, regen |

**Modifier chain:** AP base stats -> Enneagram class multipliers (wing/instinct/tritype blending) -> Jungian abilities (scale off stats) -> Socionics element -> Instincts combat passives

## Architecture

```
src/
  data/         <- static typology data (pure TS, zero React imports)
  engine/       <- generation logic (pure TS, zero React imports)
  components/   <- React UI (Builder, Quiz, Character sheet, Comparison)
  hooks/        <- state management (builder selections, URL sync, character edits)
  utils/        <- URL serialization, export, API client
```

`data/` and `engine/` are intentionally free of React dependencies — they're unit-testable and portable to a future backend.

## Tech Stack

- React 19 + TypeScript (strict mode)
- Tailwind CSS v4
- Vite 7
- Vitest for testing
- ESLint with type-aware rules (`recommendedTypeChecked`)
- Deployed via Cloudflare Workers (`wrangler deploy`)

## Development

```bash
yarn install   # install dependencies
yarn dev       # start dev server
yarn build     # production build (includes tsc type checking)
yarn test      # run tests
yarn lint      # lint with type-aware rules
```

## Testing

370+ tests covering:
- Engine logic (generator, modifiers, insights, summarizer, comparison)
- Data integrity (all typology data validated for completeness and consistency)
- Quiz scoring (Jungian type, Enneagram, Socionics, AP, Instincts — short and long forms)
- URL serialization round-trips
- Ability balance (power scaling across all slots and functions)
- Hook behavior (builder selections, character edits, character generator)
