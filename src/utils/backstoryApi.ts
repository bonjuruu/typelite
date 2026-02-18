import type { Character } from '../engine/types.ts'
import { computeAbilityPower } from '../engine/modifiers.ts'

// ============================================================
// CONFIGURATION
// ============================================================

/**
 * Proxy endpoint.
 * - Dev: Vite proxies /api/backstory → local wrangler dev server
 * - Prod: set VITE_BACKSTORY_PROXY_URL to deployed worker URL
 */
const PROXY_URL: string = (import.meta.env.VITE_BACKSTORY_PROXY_URL as string | undefined) ?? '/api/backstory'

// ============================================================
// PROMPT BUILDING
// ============================================================

function buildCharacterSummary(character: Character, characterName: string): string {
  const abilityList = character.abilities.map((ability) => {
    const power = computeAbilityPower(ability, character.stats)
    return `${ability.name} (${ability.slot}, ${ability.cognitiveFunction}, power ${power}): ${ability.description}`
  })

  const passiveList = character.combatBehavior.passives.map(
    (p) => `${p.name}: ${p.description}`,
  )

  const archetypePassiveList = (
    character.archetype.instinctPassiveList
    ?? (character.archetype.instinctPassive ? [character.archetype.instinctPassive] : [])
  ).map((p) => `${p.name}: ${p.description}`)

  return [
    `Name: ${characterName}`,
    `Title: ${character.title}`,
    `Class: ${character.archetype.className}`,
    `Class Description: ${character.archetype.description}`,
    `Stats: Willpower ${character.stats.willpower}, Intelligence ${character.stats.intelligence}, Spirit ${character.stats.spirit}, Vitality ${character.stats.vitality}`,
    `Element: ${character.element.element} (${character.element.quadra} quadra)`,
    `Combat: ${character.combatBehavior.combatOrientation} — ${character.combatBehavior.activationStyle} activation, ${character.combatBehavior.positioning} positioning, ${character.combatBehavior.regenSource} regen`,
    `Empowered State: ${character.archetype.empoweredState.name} — ${character.archetype.empoweredState.description}`,
    `Stressed State: ${character.archetype.stressedState.name} — ${character.archetype.stressedState.description}`,
    archetypePassiveList.length > 0 ? `Archetype Passives: ${archetypePassiveList.join('; ')}` : '',
    abilityList.length > 0 ? `Abilities:\n${abilityList.join('\n')}` : '',
    passiveList.length > 0 ? `Combat Passives: ${passiveList.join('; ')}` : '',
  ].filter(Boolean).join('\n')
}

// ============================================================
// API CLIENT
// ============================================================

interface ApiError {
  error: string
}

async function callWorker(body: Record<string, string>): Promise<string> {
  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const text = await response.text()
    console.error('Worker API error:', response.status, text)
    let message = `Request failed (${response.status})`
    try {
      const parsed = JSON.parse(text) as ApiError
      if (parsed.error) message = parsed.error
    } catch { /* use default */ }
    throw new Error(message)
  }

  return response.text()
}

/**
 * Generate a dark fantasy backstory for a character.
 */
export async function generateBackstory(
  character: Character,
  characterName: string,
): Promise<string> {
  const characterSummary = buildCharacterSummary(character, characterName)
  const raw = await callWorker({ characterSummary, mode: 'backstory' })
  const data = JSON.parse(raw) as { backstory: string }
  return data.backstory
}

/**
 * Generate a typology analysis report for a character.
 */
export async function generateReport(
  character: Character,
  characterName: string,
): Promise<string> {
  const characterSummary = buildCharacterSummary(character, characterName)
  const raw = await callWorker({ characterSummary, mode: 'report' })
  const data = JSON.parse(raw) as { report: string }
  return data.report
}
