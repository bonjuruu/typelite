import type { SystemId, EnneagramNumber, ManualOverrides } from '../../engine/types.ts'
import type { BuilderSelections, EnabledSystems } from '../../hooks/useCharacterGenerator.ts'
import { SystemCard } from './SystemCard.tsx'
import { SYSTEM_META_LIST } from './systemMeta.ts'

// ============================================================
// PROPS
// ============================================================

interface BuilderPanelProps {
  enabledSystems: EnabledSystems
  selections: BuilderSelections
  overrides: ManualOverrides
  hasAllSelections: boolean
  onToggleSystem: (id: SystemId) => void
  onUpdateSelection: <K extends keyof BuilderSelections>(key: K, value: BuilderSelections[K]) => void
  onUpdateOverride: <K extends keyof ManualOverrides>(key: K, value: ManualOverrides[K]) => void
  onSetEnneagramType: (type: EnneagramNumber | null) => void
  onRandomizeSystem: (id: SystemId) => void
  onRandomizeAll: () => void
  onGenerate: () => void
}

// ============================================================
// COMPONENT
// ============================================================

export function BuilderPanel({
  enabledSystems,
  selections,
  overrides,
  hasAllSelections,
  onToggleSystem,
  onUpdateSelection,
  onUpdateOverride,
  onSetEnneagramType,
  onRandomizeSystem,
  onRandomizeAll,
  onGenerate,
}: BuilderPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl font-bold text-gray-100">Character Builder</h2>
        <button
          onClick={onRandomizeAll}
          aria-label="Randomize all systems"
          className="rounded bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
        >
          Randomize All
        </button>
      </div>

      {SYSTEM_META_LIST.map((meta) => (
        <SystemCard
          key={meta.id}
          meta={meta}
          enabled={enabledSystems[meta.id]}
          selections={selections}
          overrides={overrides}
          onToggle={() => onToggleSystem(meta.id)}
          onUpdateSelection={onUpdateSelection}
          onUpdateOverride={onUpdateOverride}
          onSetEnneagramType={onSetEnneagramType}
          onRandomize={() => onRandomizeSystem(meta.id)}
        />
      ))}

      <button
        onClick={onGenerate}
        disabled={!hasAllSelections}
        className="w-full rounded-lg bg-indigo-600 py-3 text-lg font-bold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Generate Character
      </button>
    </div>
  )
}
