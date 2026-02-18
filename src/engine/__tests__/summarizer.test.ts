import { describe, it, expect } from 'vitest'
import { generateCharacterSummary } from '../summarizer.ts'
import { generateCharacter } from '../generator.ts'
import type { GeneratorInput } from '../types.ts'

// ============================================================
// HELPERS
// ============================================================

function makeNullInput(): GeneratorInput {
  return {
    attitudinal: null,
    enneagram: null,
    mbti: null,
    socionics: null,
    instincts: null,
    overrides: { stats: null, archetype: null, abilities: null, element: null, combatOrientation: null },
  }
}

function buildCharacter(overrides: Partial<GeneratorInput>): ReturnType<typeof generateCharacter> {
  return generateCharacter({ ...makeNullInput(), ...overrides })
}

// ============================================================
// generateCharacterSummary
// ============================================================

describe('generateCharacterSummary', () => {
  it('returns empty string when no systems are active', () => {
    const character = buildCharacter({})

    expect(generateCharacterSummary(character)).toBe('')
  })

  it('includes AP stat sentence when attitudinal is active', () => {
    const character = buildCharacter({ attitudinal: 'VELF' })

    const summary = generateCharacterSummary(character)

    expect(summary).toContain('VELF')
    expect(summary).toContain('Willpower')
    expect(summary).toContain('14')
  })

  it('includes class description when enneagram is active', () => {
    const character = buildCharacter({
      enneagram: { type: 5, wing: 4, instinct: 'sp' },
    })

    const summary = generateCharacterSummary(character)

    // Should reference the archetype className and start of its description (lowercased first letter)
    expect(summary).toContain('Sage')
  })

  it('includes Hero ability when MBTI is active', () => {
    const character = buildCharacter({ mbti: 'INTJ' })

    const summary = generateCharacterSummary(character)

    expect(summary).toContain('Ni-dominant')
  })

  it('includes element and quadra when Socionics is active', () => {
    const character = buildCharacter({ socionics: 'ILI' })

    const summary = generateCharacterSummary(character)

    expect(summary).toContain('Metal')
    expect(summary).toContain('Gamma')
  })

  it('includes combat orientation when instincts are active', () => {
    const character = buildCharacter({ instincts: { realm: 'FD' } })

    const summary = generateCharacterSummary(character)

    expect(summary).toContain('Frontline')
    expect(summary).toContain('Immersing')
    expect(summary).toContain('Directing')
  })

  it('combines all system sentences when all 5 systems are active', () => {
    const character = buildCharacter({
      attitudinal: 'VELF',
      enneagram: { type: 5, wing: 4, instinct: 'sp' },
      mbti: 'INTJ',
      socionics: 'ILI',
      instincts: { realm: 'FD' },
    })

    const summary = generateCharacterSummary(character)

    // Should contain fragments from all 5 systems
    expect(summary).toContain('VELF')
    expect(summary).toContain('Sage')
    expect(summary).toContain('Ni-dominant')
    expect(summary).toContain('Metal')
    expect(summary).toContain('Frontline')
  })

  it('only includes sentences for active systems', () => {
    const character = buildCharacter({
      attitudinal: 'ELFV',
      socionics: 'ESE',
    })

    const summary = generateCharacterSummary(character)

    // Should have AP and Socionics content
    expect(summary).toContain('ELFV')
    expect(summary).toContain('Alpha')
    // Should NOT have MBTI/enneagram/instincts content
    expect(summary).not.toContain('dominant kit')
    expect(summary).not.toContain('Frontline')
    expect(summary).not.toContain('Support')
    expect(summary).not.toContain('Strategist')
  })
})
