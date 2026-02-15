import type { SystemId, ManualOverrides, AbilityOverrides, Element, StatName, CognitiveFunction, AbilitySlot } from '../../../engine/types.ts'
import { ELEMENT_LIST, getAbilityName } from '../../../hooks/useCharacterGenerator.ts'
import { Select, type SelectOption } from '../../common/Select.tsx'

// ============================================================
// CONSTANTS
// ============================================================

const COGNITIVE_FUNCTION_LIST: CognitiveFunction[] = ['Ti', 'Te', 'Fi', 'Fe', 'Si', 'Se', 'Ni', 'Ne']

const ABILITY_SLOT_LIST: { slot: AbilitySlot; label: string }[] = [
  { slot: 'hero', label: 'Hero' },
  { slot: 'parent', label: 'Parent' },
  { slot: 'child', label: 'Child' },
  { slot: 'inferior', label: 'Inferior' },
]

const CLASS_OVERRIDE_LIST: SelectOption[] = [
  { value: 'Justicar', label: 'Justicar' },
  { value: 'Cleric', label: 'Cleric' },
  { value: 'Warlord', label: 'Warlord' },
  { value: 'Bard', label: 'Bard' },
  { value: 'Sage', label: 'Sage' },
  { value: 'Sentinel', label: 'Sentinel' },
  { value: 'Trickster', label: 'Trickster' },
  { value: 'Berserker', label: 'Berserker' },
  { value: 'Druid', label: 'Druid' },
  { value: 'Wanderer', label: 'Wanderer' },
]

const ORIENTATION_OVERRIDE_LIST: SelectOption[] = [
  { value: 'Frontline', label: 'Frontline — physical, self-sustain' },
  { value: 'Support', label: 'Support — party synergy, relational' },
  { value: 'Strategist', label: 'Strategist — abstract, meta' },
  { value: 'Balanced', label: 'Balanced — no specialization' },
]

const STAT_FIELD_LIST: { key: StatName; label: string }[] = [
  { key: 'willpower', label: 'WIL' },
  { key: 'intelligence', label: 'INT' },
  { key: 'spirit', label: 'SPI' },
  { key: 'vitality', label: 'VIT' },
]

// ============================================================
// COMPONENT
// ============================================================

interface OverrideSelectorProps {
  systemId: SystemId
  overrides: ManualOverrides
  onUpdateOverride: <K extends keyof ManualOverrides>(key: K, value: ManualOverrides[K]) => void
}

export function OverrideSelector({ systemId, overrides, onUpdateOverride }: OverrideSelectorProps) {
  switch (systemId) {
    case 'attitudinal':
      return (
        <div>
          <span className="mb-2 block text-xs font-medium text-gray-500">Set base stats manually</span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {STAT_FIELD_LIST.map(({ key, label }) => (
              <div key={key}>
                <label className="mb-1 block text-center text-[10px] font-semibold uppercase text-gray-500">
                  {label}
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  aria-label={`${label} stat value`}
                  value={overrides.stats?.[key] ?? 8}
                  onChange={(e) => {
                    const value = Math.max(1, Math.min(20, Number(e.target.value) || 1))
                    const currentStats = overrides.stats ?? {}
                    onUpdateOverride('stats', { ...currentStats, [key]: value })
                  }}
                  className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1.5 text-center text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-gray-900"
                />
              </div>
            ))}
          </div>
        </div>
      )

    case 'enneagram':
      return (
        <div>
          <span className="mb-2 block text-xs font-medium text-gray-500">Choose a class</span>
          <Select
            value={overrides.archetype ?? ''}
            onChange={(value) => onUpdateOverride('archetype', value || null)}
            placeholder="Select class..."
            optionList={CLASS_OVERRIDE_LIST}
          />
        </div>
      )

    case 'mbti':
      return (
        <div>
          <span className="mb-2 block text-xs font-medium text-gray-500">Pick a cognitive function for each ability slot</span>
          <div className="space-y-2">
            {ABILITY_SLOT_LIST.map(({ slot, label }) => (
              <div key={slot} className="flex items-center gap-2">
                <span className="w-16 text-xs font-semibold text-gray-400">{label}</span>
                <div className="flex-1">
                  <Select
                    value={overrides.abilities?.[slot] ?? ''}
                    onChange={(value) => {
                      const currentAbilities: AbilityOverrides = overrides.abilities ?? { hero: 'Ti', parent: 'Ti', child: 'Ti', inferior: 'Ti' }
                      onUpdateOverride('abilities', { ...currentAbilities, [slot]: value as CognitiveFunction })
                    }}
                    placeholder="Select function..."
                    optionList={COGNITIVE_FUNCTION_LIST.map((fn) => ({
                      value: fn,
                      label: `${fn} — ${getAbilityName(fn, slot)}`,
                    }))}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    case 'socionics':
      return (
        <div>
          <span className="mb-2 block text-xs font-medium text-gray-500">Choose an element</span>
          <Select
            value={overrides.element ?? ''}
            onChange={(value) => onUpdateOverride('element', (value as Element) || null)}
            placeholder="Select element..."
            optionList={ELEMENT_LIST.map((el) => ({ value: el, label: el }))}
          />
        </div>
      )

    case 'instincts':
      return (
        <div>
          <span className="mb-2 block text-xs font-medium text-gray-500">Choose combat orientation</span>
          <Select
            value={overrides.combatOrientation ?? ''}
            onChange={(value) => onUpdateOverride('combatOrientation', value || null)}
            placeholder="Select orientation..."
            optionList={ORIENTATION_OVERRIDE_LIST}
          />
        </div>
      )
  }
}
