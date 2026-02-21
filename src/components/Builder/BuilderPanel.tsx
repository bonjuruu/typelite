import { useState } from "react";
import type {
  SystemId,
  EnneagramNumber,
  ManualOverrides,
} from "../../engine/types/index.ts";
import type { BuilderSelections, EnabledSystems } from "../../types/builder.ts";
import { SystemCard } from "./SystemCard.tsx";
import { getSelectionSummary } from "./selectionSummary.ts";
import { SYSTEM_META_LIST } from "./systemMeta.ts";

// ============================================================
// PROPS
// ============================================================

interface BuilderPanelProps {
  enabledSystems: EnabledSystems;
  selections: BuilderSelections;
  overrides: ManualOverrides;
  hasAllSelections: boolean;
  isExpanded: boolean;
  /** Use accordion mode (true after first generate, false on initial load) */
  compact: boolean;
  onSetExpanded: (expanded: boolean) => void;
  onToggleSystem: (id: SystemId) => void;
  onUpdateSelection: <K extends keyof BuilderSelections>(
    key: K,
    value: BuilderSelections[K],
  ) => void;
  onUpdateOverride: <K extends keyof ManualOverrides>(
    key: K,
    value: ManualOverrides[K],
  ) => void;
  onSetEnneagramType: (type: EnneagramNumber | null) => void;
  onRandomizeSystem: (id: SystemId) => void;
  onRandomizeAll: () => void;
  onGenerate: () => void;
}

// ============================================================
// HELPERS
// ============================================================

function getMissingSystemList(
  enabled: EnabledSystems,
  selections: BuilderSelections,
): string[] {
  const missingList: string[] = [];
  const nameMap: Record<SystemId, string> = {
    attitudinal: "Attitudinal Psyche",
    enneagram: "Enneagram",
    mbti: "MBTI",
    socionics: "Socionics",
    instincts: "Instincts",
  };
  if (enabled.attitudinal && !selections.attitudinal)
    missingList.push(nameMap.attitudinal);
  if (
    enabled.enneagram &&
    (!selections.enneagramType ||
      !selections.enneagramWing ||
      !selections.enneagramInstinct)
  )
    missingList.push(nameMap.enneagram);
  if (enabled.mbti && !selections.mbti) missingList.push(nameMap.mbti);
  if (enabled.socionics && !selections.socionics)
    missingList.push(nameMap.socionics);
  if (enabled.instincts && !selections.instinctRealm)
    missingList.push(nameMap.instincts);
  return missingList;
}

// ============================================================
// COMPONENT
// ============================================================

export function BuilderPanel({
  enabledSystems,
  selections,
  overrides,
  hasAllSelections,
  isExpanded,
  compact,
  onSetExpanded,
  onToggleSystem,
  onUpdateSelection,
  onUpdateOverride,
  onSetEnneagramType,
  onRandomizeSystem,
  onRandomizeAll,
  onGenerate,
}: BuilderPanelProps) {
  const [expandedSystem, setExpandedSystem] = useState<SystemId | null>(null);

  const toggleExpandSystem = (id: SystemId) => {
    setExpandedSystem((prev) => (prev === id ? null : id));
  };

  // Collapsed toolbar
  if (!isExpanded) {
    return (
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-3">
        <div className="flex items-center gap-3">
          {/* Selection summary chips */}
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
            {SYSTEM_META_LIST.map((meta) => {
              const summary = getSelectionSummary(meta.id, selections);
              return (
                <span
                  key={meta.id}
                  className={`inline-flex shrink-0 items-center rounded px-2 py-0.5 text-xs font-medium ${
                    summary
                      ? "bg-gray-700 text-indigo-300"
                      : "bg-gray-700/40 text-gray-600"
                  }`}
                >
                  {summary ?? meta.domain}
                </span>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex shrink-0 items-center gap-2">
            {!hasAllSelections && (
              <span className="hidden text-[10px] text-amber-400/70 sm:inline">
                Missing:{" "}
                {getMissingSystemList(enabledSystems, selections).join(", ")}
              </span>
            )}
            <button
              onClick={onGenerate}
              disabled={!hasAllSelections}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-bold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Generate
            </button>
            <button
              onClick={onRandomizeAll}
              className="rounded-md bg-gray-700 px-2.5 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-600 hover:text-gray-200"
            >
              Randomize
            </button>
            <button
              onClick={() => onSetExpanded(true)}
              aria-label="Expand builder"
              className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-700 hover:text-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Expanded view — full layout (all open) on first load, accordion after first generate
  return (
    <div className={compact ? "space-y-2" : "space-y-4"}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl font-bold text-gray-100">Character Builder</h2>
        {compact && (
          <button
            onClick={() => onSetExpanded(false)}
            aria-label="Collapse builder"
            className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-700 hover:text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M14.78 11.78a.75.75 0 0 1-1.06 0L10 8.06l-3.72 3.72a.75.75 0 1 1-1.06-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {SYSTEM_META_LIST.map((meta) => (
        <SystemCard
          key={meta.id}
          meta={meta}
          enabled={enabledSystems[meta.id]}
          selections={selections}
          overrides={overrides}
          isExpanded={compact ? expandedSystem === meta.id : true}
          collapsible={compact}
          onToggleExpand={() => toggleExpandSystem(meta.id)}
          onToggle={() => onToggleSystem(meta.id)}
          onUpdateSelection={onUpdateSelection}
          onUpdateOverride={onUpdateOverride}
          onSetEnneagramType={onSetEnneagramType}
          onRandomize={() => onRandomizeSystem(meta.id)}
        />
      ))}

      <div className="space-y-1.5 pt-2">
        <div className="flex gap-3">
          <button
            onClick={onGenerate}
            disabled={!hasAllSelections}
            className="flex-1 rounded-lg bg-indigo-600 py-3 text-lg font-bold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Generate Character
          </button>
          <button
            onClick={onRandomizeAll}
            aria-label="Randomize all systems"
            className="rounded-lg bg-gray-700 px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
          >
            Randomize All
          </button>
        </div>
        {!hasAllSelections &&
          (() => {
            const missingList = getMissingSystemList(
              enabledSystems,
              selections,
            );
            return missingList.length > 0 ? (
              <p className="text-center text-xs text-amber-400/70">
                Missing: {missingList.join(", ")}
              </p>
            ) : null;
          })()}
      </div>
    </div>
  );
}
