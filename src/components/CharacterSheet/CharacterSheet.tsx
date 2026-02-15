import { useState } from 'react'
import type { Character, Ability, StatName, StatBreakdown, SystemId } from '../../engine/types.ts'
import { computeAbilityPower } from '../../engine/modifiers.ts'
import { SectionTitle } from '../common/SectionTitle.tsx'
import { SYSTEM_META_LIST } from '../Builder/systemMeta.ts'
import { exportCharacterToText } from '../../utils/characterExporter.ts'

const SYSTEM_DISPLAY_NAME: Record<SystemId, string> = Object.fromEntries(
  SYSTEM_META_LIST.map((meta) => [meta.id, meta.name]),
) as Record<SystemId, string>

// ============================================================
// PROPS
// ============================================================

interface CharacterSheetProps {
  character: Character
  characterName: string
  onSetCharacterName: (name: string) => void
  onRegenerateName: () => void
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function CharacterSheet({ character, characterName, onSetCharacterName, onRegenerateName }: CharacterSheetProps) {
  return (
    <div className="space-y-6">
      <Header character={character} characterName={characterName} onSetCharacterName={onSetCharacterName} onRegenerateName={onRegenerateName} />
      <StatsSection character={character} />
      <ArchetypeSection character={character} />
      {character.abilities.length > 0 && <AbilitiesSection character={character} />}
      <ElementSection character={character} />
      <CombatSection character={character} />
    </div>
  )
}

// ============================================================
// HEADER
// ============================================================

function Header({ character, characterName, onSetCharacterName, onRegenerateName }: {
  character: Character
  characterName: string
  onSetCharacterName: (name: string) => void
  onRegenerateName: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')

  const startEditing = () => {
    setEditValue(characterName)
    setIsEditing(true)
  }

  const saveEdit = () => {
    const trimmed = editValue.trim()
    if (trimmed) {
      onSetCharacterName(trimmed)
    }
    setIsEditing(false)
  }

  const cancelEdit = () => {
    setIsEditing(false)
  }

  return (
    <div className="border-b border-gray-700 pb-4">
      <div className="flex items-center gap-2">
        {isEditing ? (
          <input
            aria-label="Character name"
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit()
              if (e.key === 'Escape') cancelEdit()
            }}
            onBlur={saveEdit}
            className="rounded border border-indigo-500 bg-gray-800 px-2 py-1 text-3xl font-bold text-gray-100 focus:outline-none"
          />
        ) : (
          <h2
            onClick={startEditing}
            className="cursor-pointer text-3xl font-bold text-gray-100 hover:text-indigo-300"
            title="Click to edit name"
          >
            {characterName}
          </h2>
        )}
        <button
          onClick={onRegenerateName}
          className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-700 hover:text-gray-300"
          title="Reroll name"
          aria-label="Reroll name"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H4.28a.75.75 0 0 0-.75.75v3.955a.75.75 0 0 0 1.5 0v-2.134l.246.245A7 7 0 0 0 17 11.424a.75.75 0 0 0-1.688 0Zm-10.55-2.849a.75.75 0 0 0 1.688 0 5.5 5.5 0 0 1 9.201-2.466l.312.311H13.53a.75.75 0 0 0 0 1.5h3.952a.75.75 0 0 0 .75-.75V3.214a.75.75 0 0 0-1.5 0v2.134l-.246-.245A7 7 0 0 0 3 8.575Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <p className="text-lg text-indigo-400">{character.title}</p>
      <div className="mt-2 flex items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {character.activeSystems.map((systemId) => (
            <span
              key={systemId}
              className="rounded-full bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-300"
            >
              {SYSTEM_DISPLAY_NAME[systemId]}
            </span>
          ))}
        </div>
        <CopyLinkButton />
        <ExportButton character={character} characterName={characterName} />
      </div>
    </div>
  )
}

function ExportButton({ character, characterName }: { character: Character; characterName: string }) {
  const [copied, setCopied] = useState(false)

  const handleExport = async () => {
    const text = exportCharacterToText(character, characterName)
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleExport}
      aria-label="Export character to clipboard"
      className="inline-flex items-center gap-1.5 rounded bg-gray-700 px-2.5 py-1 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-600 hover:text-gray-200"
    >
      {copied ? 'Copied!' : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
            <path fillRule="evenodd" d="M10.986 3H12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1.014A2.25 2.25 0 0 1 7.25 1h1.5a2.25 2.25 0 0 1 2.236 2ZM9.5 4v-.75a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V4h3Z" clipRule="evenodd" />
          </svg>
          Export
        </>
      )}
    </button>
  )
}

function CopyLinkButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy character link to clipboard"
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded bg-gray-700 px-2.5 py-1 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-600 hover:text-gray-200"
    >
      {copied ? 'Copied!' : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
            <path fillRule="evenodd" d="M8.914 6.025a.75.75 0 0 1 1.06 0 3.5 3.5 0 0 1 0 4.95l-2 2a3.5 3.5 0 0 1-5.396-4.402.75.75 0 0 1 1.251.827 2 2 0 0 0 2.632 2.88l.069-.044.024-.018 2-2a2 2 0 0 0 0-2.83.75.75 0 0 1 0-1.06l.36-.003Zm-1.829 3.95a.75.75 0 0 1-1.06 0 3.5 3.5 0 0 1 0-4.95l2-2a3.5 3.5 0 0 1 5.396 4.402.75.75 0 0 1-1.251-.827 2 2 0 0 0-2.632-2.88l-.069.044-.024.018-2 2a2 2 0 0 0 0 2.83.75.75 0 0 1 0 1.06l-.36.003Z" clipRule="evenodd" />
          </svg>
          Copy Link
        </>
      )}
    </button>
  )
}

// ============================================================
// STATS
// ============================================================

const STAT_CONFIG: { key: StatName; label: string; color: string }[] = [
  { key: 'willpower', label: 'Willpower', color: 'bg-amber-500' },
  { key: 'intelligence', label: 'Intelligence', color: 'bg-blue-500' },
  { key: 'spirit', label: 'Spirit', color: 'bg-purple-500' },
  { key: 'vitality', label: 'Vitality', color: 'bg-green-500' },
]

const MAX_STAT_DISPLAY = 20

const STAT_TO_ASPECT: Record<StatName, string> = {
  willpower: 'V',
  intelligence: 'L',
  spirit: 'E',
  vitality: 'F',
}

function StatsSection({ character }: { character: Character }) {
  return (
    <div>
      <SectionTitle>Stats</SectionTitle>
      <div className="space-y-2">
        {STAT_CONFIG.map(({ key, label, color }) => {
          const value = character.stats[key]
          const percentage = Math.min((value / MAX_STAT_DISPLAY) * 100, 100)
          return (
            <div key={key} className="flex items-center gap-3">
              <span className="w-24 text-sm font-medium text-gray-300">{label}</span>
              <div className="h-4 flex-1 overflow-hidden rounded-full bg-gray-700">
                <div
                  className={`h-full rounded-full ${color} transition-[width] duration-600 ease-out`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <StatValueWithBreakdown statName={key} value={value} breakdown={character.statBreakdown} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatValueWithBreakdown({ statName, value, breakdown }: { statName: StatName; value: number; breakdown: StatBreakdown }) {
  const baseValue = breakdown.base[statName]
  const multiplier = breakdown.multipliers[statName]
  // != null distinguishes undefined (key absent) from 0 (explicitly set to zero)
  const hasOverride = breakdown.overrides?.[statName] != null
  const overrideValue = hasOverride ? breakdown.overrides![statName] : undefined
  const isAP = breakdown.baseSource !== 'Default'

  // Derive aspect letter and position for AP types
  const aspectLetter = STAT_TO_ASPECT[statName]
  const position = isAP ? breakdown.baseSource.indexOf(aspectLetter) + 1 : null

  const positionLabel = position ? `${aspectLetter} in ${position}${ordinalSuffix(position)}` : null

  return (
    <span className="group relative cursor-help">
      <span className="w-8 text-right text-sm font-bold text-gray-100 inline-block">{value}</span>
      <span className="pointer-events-none absolute right-0 top-full z-10 mt-1.5 w-56 rounded bg-gray-950 px-2.5 py-2 text-[11px] leading-relaxed text-gray-400 opacity-0 shadow-lg ring-1 ring-gray-700 transition-opacity group-hover:opacity-100">
        <span className="block text-gray-300">
          Base: {baseValue}
          {isAP && positionLabel ? (
            <span className="text-gray-500"> ({positionLabel} — {breakdown.baseSource})</span>
          ) : (
            <span className="text-gray-500"> (default)</span>
          )}
        </span>
        {multiplier != null && !hasOverride && (
          <span className="block text-gray-300">
            Scaling: &times;{multiplier} <span className="text-gray-500">({breakdown.multiplierSource})</span>
          </span>
        )}
        {hasOverride && (
          <span className="block text-gray-300">
            Override &rarr; {overrideValue}
          </span>
        )}
        <span className="mt-1 block border-t border-gray-800 pt-1 font-bold text-gray-200">= {value}</span>
      </span>
    </span>
  )
}

function ordinalSuffix(n: number): string {
  if (n === 1) return 'st'
  if (n === 2) return 'nd'
  if (n === 3) return 'rd'
  return 'th'
}

// ============================================================
// ARCHETYPE
// ============================================================

function ArchetypeSection({ character }: { character: Character }) {
  const { archetype } = character
  return (
    <div>
      <SectionTitle>Archetype</SectionTitle>
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h4 className="text-lg font-bold text-gray-100">{archetype.className}</h4>
        <p className="mt-1 text-sm text-gray-400">{archetype.description}</p>
        {(archetype.instinctPassiveList ?? (archetype.instinctPassive ? [archetype.instinctPassive] : [])).length > 0 && (
          <div className="mt-2 space-y-1">
            {(archetype.instinctPassiveList ?? [archetype.instinctPassive!]).map((passive) => {
              const isSecondary = passive.source.startsWith('2nd instinct')
              const isTertiary = passive.source.startsWith('3rd instinct')
              const isStackedPassive = isSecondary || isTertiary
              return (
                <div key={passive.name + passive.source} className={`rounded border p-2 ${isStackedPassive ? 'border-indigo-800/30 bg-indigo-950/10' : 'border-indigo-800/50 bg-indigo-950/20'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${isStackedPassive ? 'text-indigo-500' : 'text-indigo-400'}`}>{passive.name}</span>
                    {isStackedPassive && (
                      <span className="text-[10px] text-gray-600">{isSecondary ? '2nd' : 'blind spot'}</span>
                    )}
                  </div>
                  <p className={`text-xs ${isStackedPassive ? 'text-gray-600' : 'text-gray-500'}`}>{passive.description}</p>
                </div>
              )
            })}
          </div>
        )}
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <StatusEffectCard
            label="Empowered"
            name={archetype.empoweredState.name}
            description={archetype.empoweredState.description}
            variant="positive"
          />
          <StatusEffectCard
            label="Stressed"
            name={archetype.stressedState.name}
            description={archetype.stressedState.description}
            variant="negative"
          />
        </div>
      </div>
    </div>
  )
}

function StatusEffectCard({
  label,
  name,
  description,
  variant,
}: {
  label: string
  name: string
  description: string
  variant: 'positive' | 'negative'
}) {
  const borderColor = variant === 'positive' ? 'border-green-800' : 'border-red-800'
  const labelColor = variant === 'positive' ? 'text-green-400' : 'text-red-400'

  return (
    <div className={`rounded border ${borderColor} bg-gray-900 p-3`}>
      <span className={`text-xs font-semibold uppercase ${labelColor}`}>{label}</span>
      <p className="mt-1 text-sm font-medium text-gray-200">{name}</p>
      <p className="mt-0.5 text-xs text-gray-500">{description}</p>
    </div>
  )
}

// ============================================================
// ABILITIES
// ============================================================

const SLOT_COLORS: Record<string, string> = {
  hero: 'border-amber-600 bg-amber-950/30',
  parent: 'border-blue-600 bg-blue-950/30',
  child: 'border-purple-600 bg-purple-950/30',
  inferior: 'border-gray-600 bg-gray-900',
}

const SLOT_LABELS: Record<string, string> = {
  hero: 'Hero',
  parent: 'Parent',
  child: 'Child',
  inferior: 'Inferior',
}

function AbilitiesSection({ character }: { character: Character }) {
  return (
    <div>
      <SectionTitle>Abilities</SectionTitle>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {character.abilities.map((ability) => (
          <AbilityCard key={ability.slot} ability={ability} stats={character.stats} />
        ))}
      </div>
    </div>
  )
}

function AbilityCard({ ability, stats }: { ability: Ability; stats: Character['stats'] }) {
  const power = computeAbilityPower(ability, stats)
  const statValue = stats[ability.scalingStat]
  const scalingFactor = (1 + statValue / 20).toFixed(2)
  const statLabel = ability.scalingStat.charAt(0).toUpperCase() + ability.scalingStat.slice(1)
  const cardStyle = SLOT_COLORS[ability.slot] ?? 'border-gray-600 bg-gray-900'

  return (
    <div className={`rounded-lg border p-3 ${cardStyle}`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase text-gray-400">
            {SLOT_LABELS[ability.slot]} &mdash; {ability.cognitiveFunction}
          </span>
          <h5 className="text-sm font-bold text-gray-100">{ability.name}</h5>
        </div>
        <span className="group relative cursor-help">
          <span className="rounded bg-gray-700 px-2 py-0.5 text-xs font-bold text-gray-200">
            {power}
          </span>
          <span className="pointer-events-none absolute right-0 top-full z-10 mt-1.5 w-52 rounded bg-gray-950 px-2.5 py-2 text-[11px] leading-relaxed text-gray-400 opacity-0 shadow-lg ring-1 ring-gray-700 transition-opacity group-hover:opacity-100">
            <span className="block text-gray-300">Base: {ability.basePower} <span className="text-gray-500">(innate to {ability.cognitiveFunction} {SLOT_LABELS[ability.slot]})</span></span>
            <span className="block text-gray-300">Scaling: 1 + {statValue}/20 = {scalingFactor} <span className="text-gray-500">(from {statLabel})</span></span>
            <span className="mt-1 block border-t border-gray-800 pt-1 text-gray-500">{ability.basePower} &times; {scalingFactor} = <span className="font-bold text-gray-200">{power}</span></span>
          </span>
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-400">{ability.description}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {ability.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-gray-700/60 px-2 py-0.5 text-[10px] text-gray-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// ELEMENT
// ============================================================

function ElementSection({ character }: { character: Character }) {
  const { element } = character
  return (
    <div>
      <SectionTitle>Element</SectionTitle>
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{ELEMENT_EMOJI[element.element]}</span>
          <div>
            <h4 className="font-bold text-gray-100">{element.element}</h4>
            <p className="text-sm text-gray-400">{element.quadra} quadra</p>
          </div>
        </div>
        <div className="mt-3 rounded border border-gray-700 bg-gray-900 p-3">
          <span className="text-xs font-semibold uppercase text-gray-500">Passive &mdash; {element.passiveTrait.name}</span>
          <p className="mt-1 text-sm text-gray-300">{element.passiveTrait.description}</p>
        </div>
      </div>
    </div>
  )
}

const ELEMENT_EMOJI: Record<string, string> = {
  Light: '\u2728',
  Nature: '\ud83c\udf3f',
  Fire: '\ud83d\udd25',
  Shadow: '\ud83c\udf11',
  Earth: '\u26f0\ufe0f',
  Metal: '\u2694\ufe0f',
  Wind: '\ud83c\udf2c\ufe0f',
  Water: '\ud83c\udf0a',
}

// ============================================================
// COMBAT BEHAVIOR
// ============================================================

function CombatSection({ character }: { character: Character }) {
  const { combatBehavior } = character
  return (
    <div>
      <SectionTitle>Combat Behavior</SectionTitle>
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <CombatField label="Orientation" value={combatBehavior.combatOrientation} />
          <CombatField label="Activation" value={combatBehavior.activationStyle} />
          <CombatField label="Positioning" value={combatBehavior.positioning} />
          <CombatField label="Regen Source" value={combatBehavior.regenSource} />
        </div>
        {combatBehavior.passives.length > 0 && (
          <div className="mt-3 space-y-2">
            <span className="text-xs font-semibold uppercase text-gray-500">Passives</span>
            {combatBehavior.passives.map((passive) => {
              const isSecondary = passive.source.startsWith('2nd fix')
              const isTertiary = passive.source.startsWith('3rd fix')
              const isFixPassive = isSecondary || isTertiary
              return (
                <div key={passive.name + passive.source} className={`rounded border p-2 ${isFixPassive ? 'border-gray-700/50 bg-gray-900/50' : 'border-gray-700 bg-gray-900'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${isFixPassive ? 'text-gray-400' : 'text-gray-200'}`}>{passive.name}</span>
                    {isFixPassive && (
                      <span className="text-[10px] text-gray-600">{isSecondary ? '2nd fix' : '3rd fix'}</span>
                    )}
                  </div>
                  <p className={`text-xs ${isFixPassive ? 'text-gray-600' : 'text-gray-500'}`}>{passive.description}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function CombatField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-gray-500">{label}</span>
      <p className="font-medium text-gray-200">{value}</p>
    </div>
  )
}
