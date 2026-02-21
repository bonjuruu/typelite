import { useState } from "react";
import type { EnneagramNumber, ManualOverrides } from "../../engine/types/index.ts";
import type { BuilderSelections } from "../../types/builder.ts";
import { Toggle } from "../common/Toggle.tsx";
import { SystemSelector } from "./SystemSelector.tsx";
import { CardBody } from "./CardBody.tsx";
import { OverrideSelector } from "./overrides/OverrideSelector.tsx";
import type { SystemMeta } from "./systemMeta.ts";
import { getSelectionSummary } from "./selectionSummary.ts";

// ============================================================
// SYSTEM CARD
// ============================================================

interface SystemCardProps {
  meta: SystemMeta;
  enabled: boolean;
  selections: BuilderSelections;
  overrides: ManualOverrides;
  isExpanded: boolean;
  /** When true, header is clickable and shows chevron/summary chips */
  collapsible: boolean;
  onToggleExpand: () => void;
  onToggle: () => void;
  onUpdateSelection: <K extends keyof BuilderSelections>(
    key: K,
    value: BuilderSelections[K],
  ) => void;
  onUpdateOverride: <K extends keyof ManualOverrides>(
    key: K,
    value: ManualOverrides[K],
  ) => void;
  onSetEnneagramType: (type: EnneagramNumber | null) => void;
  onRandomize: () => void;
}

export function SystemCard({
  meta,
  enabled,
  selections,
  overrides,
  isExpanded,
  collapsible,
  onToggleExpand,
  onToggle,
  onUpdateSelection,
  onUpdateOverride,
  onSetEnneagramType,
  onRandomize,
}: SystemCardProps) {
  const [showInfo, setShowInfo] = useState(false);
  const summary = getSelectionSummary(meta.id, selections);

  const headerContent = (
    <div className="flex items-center gap-3 min-w-0">
      <div
        role="button"
        tabIndex={-1}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
            onToggle();
          }
        }}
      >
        <Toggle checked={enabled} aria-label={`Toggle ${meta.name}`} />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="font-semibold text-gray-100">{meta.name}</span>
        {!collapsible && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowInfo((prev) => !prev);
            }}
            aria-label={`Info about ${meta.name}`}
            aria-expanded={showInfo}
            className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
              showInfo
                ? "bg-indigo-600 text-white"
                : "bg-gray-600 text-gray-400 hover:bg-gray-500 hover:text-gray-200"
            }`}
          >
            ?
          </button>
        )}
        <span className="text-xs text-gray-500">&rarr; {meta.domain}</span>
      </div>
      {collapsible && !isExpanded && summary && (
        <span className="truncate rounded bg-gray-700/60 px-2 py-0.5 text-xs font-medium text-indigo-300">
          {summary}
        </span>
      )}
      {collapsible && !isExpanded && !summary && (
        <span className="text-xs text-gray-600">&mdash;</span>
      )}
    </div>
  );

  return (
    <div
      className={`rounded-lg border transition-colors ${
        enabled ? "border-gray-600 bg-gray-800" : "border-gray-700 bg-gray-900"
      }`}
    >
      {/* Header */}
      {collapsible ? (
        <button
          type="button"
          onClick={onToggleExpand}
          className="flex w-full items-center justify-between gap-2 p-4"
        >
          {headerContent}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      ) : (
        <div className="flex items-center justify-between gap-2 p-4 pb-0">
          {headerContent}
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
      )}

      {/* Content */}
      {collapsible ? (
        <div
          className={`grid transition-[grid-template-rows] duration-200 ease-out ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        >
          <div className="overflow-hidden">
            <div className="px-4 pb-4">
              <CardBody
                meta={meta}
                enabled={enabled}
                selections={selections}
                overrides={overrides}
                showInfo={showInfo}
                onToggleInfo={() => setShowInfo((prev) => !prev)}
                onUpdateSelection={onUpdateSelection}
                onUpdateOverride={onUpdateOverride}
                onSetEnneagramType={onSetEnneagramType}
                onRandomize={onRandomize}
                showRandomize
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 pb-4 pt-2">
          {showInfo && (
            <div className="mb-3 space-y-2 rounded border border-indigo-800/30 bg-indigo-950/10 p-3 text-xs leading-relaxed text-gray-400">
              <p>{meta.info.what}</p>
              <p>
                <span className="font-semibold text-indigo-400">
                  Game mapping:
                </span>{" "}
                {meta.info.mapping}
              </p>
              <p>{meta.info.detail}</p>
            </div>
          )}
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
      )}
    </div>
  );
}
