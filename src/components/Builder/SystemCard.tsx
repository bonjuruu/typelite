import type { SystemId, EnneagramNumber, ManualOverrides } from '../../engine/types.ts'
import type { BuilderSelections } from '../../hooks/useCharacterGenerator.ts'
import { Toggle } from '../common/Toggle.tsx'
import { AttitudinalSelector } from './selectors/AttitudinalSelector.tsx'
import { EnneagramSelector } from './selectors/EnneagramSelector.tsx'
import { MBTISelector } from './selectors/MBTISelector.tsx'
import { SocionicsSelector } from './selectors/SocionicsSelector.tsx'
import { InstinctsSelector } from './selectors/InstinctsSelector.tsx'
import { OverrideSelector } from './overrides/OverrideSelector.tsx'
import type { SystemMeta } from './systemMeta.ts'

// ============================================================
// SYSTEM CARD
// ============================================================

interface SystemCardProps {
  meta: SystemMeta
  enabled: boolean
  selections: BuilderSelections
  overrides: ManualOverrides
  onToggle: () => void
  onUpdateSelection: <K extends keyof BuilderSelections>(key: K, value: BuilderSelections[K]) => void
  onUpdateOverride: <K extends keyof ManualOverrides>(key: K, value: ManualOverrides[K]) => void
  onSetEnneagramType: (type: EnneagramNumber | null) => void
  onRandomize: () => void
}

export function SystemCard({
  meta,
  enabled,
  selections,
  overrides,
  onToggle,
  onUpdateSelection,
  onUpdateOverride,
  onSetEnneagramType,
  onRandomize,
}: SystemCardProps) {
  return (
    <div className={`rounded-lg border p-4 transition-colors ${
      enabled
        ? 'border-gray-600 bg-gray-800'
        : 'border-gray-700 bg-gray-900'
    }`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Toggle checked={enabled} onChange={onToggle} aria-label={`Toggle ${meta.name}`} />
          <div>
            <span className="font-semibold text-gray-100">{meta.name}</span>
            <span className="ml-2 text-xs text-gray-500">&rarr; {meta.domain}</span>
          </div>
        </div>
        {enabled && (
          <button
            onClick={onRandomize}
            aria-label={`Randomize ${meta.name}`}
            className="rounded bg-gray-700 px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-gray-600 hover:text-gray-200"
          >
            Randomize
          </button>
        )}
      </div>

      <p className="mb-3 text-sm text-gray-400">{meta.description}</p>

      {enabled ? (
        <SystemSelector
          systemId={meta.id}
          selections={selections}
          onUpdateSelection={onUpdateSelection}
          onSetEnneagramType={onSetEnneagramType}
        />
      ) : (
        <OverrideSelector
          systemId={meta.id}
          overrides={overrides}
          onUpdateOverride={onUpdateOverride}
        />
      )}
    </div>
  )
}

// ============================================================
// SYSTEM SELECTOR (dispatches to per-system selector)
// ============================================================

interface SystemSelectorProps {
  systemId: SystemId
  selections: BuilderSelections
  onUpdateSelection: <K extends keyof BuilderSelections>(key: K, value: BuilderSelections[K]) => void
  onSetEnneagramType: (type: EnneagramNumber | null) => void
}

function SystemSelector({ systemId, selections, onUpdateSelection, onSetEnneagramType }: SystemSelectorProps) {
  switch (systemId) {
    case 'attitudinal':
      return <AttitudinalSelector selections={selections} onUpdateSelection={onUpdateSelection} />
    case 'enneagram':
      return <EnneagramSelector selections={selections} onUpdateSelection={onUpdateSelection} onSetEnneagramType={onSetEnneagramType} />
    case 'mbti':
      return <MBTISelector selections={selections} onUpdateSelection={onUpdateSelection} />
    case 'socionics':
      return <SocionicsSelector selections={selections} onUpdateSelection={onUpdateSelection} />
    case 'instincts':
      return <InstinctsSelector selections={selections} onUpdateSelection={onUpdateSelection} />
  }
}
