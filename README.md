# Typelite

A roguelite-inspired character builder that generates game characters using real personality typology systems. Toggle any combination of 5 systems, select or randomize types, and generate a character sheet with stats, abilities, class, element, and combat behavior.

## Typology Systems

| System | Gameplay Domain | What it determines |
|---|---|---|
| **Attitudinal Psyche** | Base stats | V/L/E/F position → Willpower, Intelligence, Spirit, Vitality |
| **Enneagram** | Class & archetype | Type → class. Wings, instincts, tritype blend stat modifiers |
| **MBTI (Beebe model)** | Ability kit | 4-function stack → 4 abilities (Hero, Parent, Child, Inferior) |
| **Socionics** | Element & affinity | Quadra → elemental school. Club → passive trait |
| **Expanded Instincts** | Combat behavior | Center → orientation. Triads → activation, positioning, regen |

Systems can be toggled independently. When a system is off, its domain can be set manually via override controls.

## Architecture

```
src/
  data/         ← static typology data (pure TS, zero React imports)
  engine/       ← generation logic (pure TS, zero React imports)
  components/   ← React UI (Builder panel, Character sheet)
  hooks/        ← state management
  utils/        ← URL serialization, export, API client
```

`data/` and `engine/` are intentionally free of React dependencies — they're unit-testable and portable to a future backend.

**Modifier chain:** AP base stats → Enneagram class multipliers (wing/instinct/tritype blending) → MBTI abilities (scale off stats) → Socionics element → Instincts combat passives

## Tech Stack

- React 19 + TypeScript (strict mode)
- Tailwind CSS v4
- Vite 7
- Vitest for testing
- ESLint with type-aware rules (`recommendedTypeChecked`)

## Development

```bash
yarn install   # install dependencies
yarn dev       # start dev server
yarn build     # production build (includes tsc type checking)
yarn test      # run tests
yarn lint      # lint with type-aware rules
```

## Testing

210+ tests covering:
- Engine logic (generator, modifiers, insights, summarizer)
- Data integrity (all typology data validated for completeness and consistency)
- Quiz scoring (MBTI, Enneagram, Socionics, AP, Instincts — short and long forms)
- URL serialization round-trips
- Ability balance (power scaling across all slots and functions)
