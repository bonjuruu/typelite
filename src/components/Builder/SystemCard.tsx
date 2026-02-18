import { useState } from 'react'
import type { SystemId, EnneagramNumber, ManualOverrides } from '../../engine/types.ts'
import type { BuilderSelections } from '../../hooks/useCharacterGenerator.ts'
import { Toggle } from '../common/Toggle.tsx'
import { AttitudinalSelector } from './selectors/AttitudinalSelector.tsx'
import { EnneagramSelector } from './selectors/EnneagramSelector.tsx'
import { MBTISelector } from './selectors/MBTISelector.tsx'
import { SocionicsSelector } from './selectors/SocionicsSelector.tsx'
import { InstinctsSelector } from './selectors/InstinctsSelector.tsx'
import { OverrideSelector } from './overrides/OverrideSelector.tsx'
import type { SystemMeta, SystemInfo } from './systemMeta.ts'

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
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className={`rounded-lg border p-4 transition-colors ${
      enabled
        ? 'border-gray-600 bg-gray-800'
        : 'border-gray-700 bg-gray-900'
    }`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Toggle checked={enabled} onChange={onToggle} aria-label={`Toggle ${meta.name}`} />
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-gray-100">{meta.name}</span>
            <button
              onClick={() => setShowInfo((prev) => !prev)}
              aria-label={`Info about ${meta.name}`}
              aria-expanded={showInfo}
              className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                showInfo
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-600 text-gray-400 hover:bg-gray-500 hover:text-gray-200'
              }`}
            >
              ?
            </button>
            <span className="text-xs text-gray-500">&rarr; {meta.domain}</span>
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

      {showInfo && <SystemInfoPanel info={meta.info} />}

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
// INFO PANEL
// ============================================================

function SystemInfoPanel({ info }: { info: SystemInfo }) {
  return (
    <div className="mb-3 space-y-2 rounded border border-indigo-800/30 bg-indigo-950/10 p-3 text-xs leading-relaxed text-gray-400">
      <p>{info.what}</p>
      <p><span className="font-semibold text-indigo-400">Game mapping:</span> {info.mapping}</p>
      <p>{info.detail}</p>
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
