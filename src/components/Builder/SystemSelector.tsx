import type { SystemId, EnneagramNumber } from "../../engine/types/index.ts";
import type { BuilderSelections } from "../../types/builder.ts";
import { AttitudinalSelector } from "./selectors/AttitudinalSelector.tsx";
import { EnneagramSelector } from "./selectors/EnneagramSelector.tsx";
import { MBTISelector } from "./selectors/MBTISelector.tsx";
import { SocionicsSelector } from "./selectors/SocionicsSelector.tsx";
import { InstinctsSelector } from "./selectors/InstinctsSelector.tsx";

// ============================================================
// SYSTEM SELECTOR (dispatches to per-system selector)
// ============================================================

interface SystemSelectorProps {
  systemId: SystemId;
  selections: BuilderSelections;
  onUpdateSelection: <K extends keyof BuilderSelections>(
    key: K,
    value: BuilderSelections[K],
  ) => void;
  onSetEnneagramType: (type: EnneagramNumber | null) => void;
}

export function SystemSelector({
  systemId,
  selections,
  onUpdateSelection,
  onSetEnneagramType,
}: SystemSelectorProps) {
  switch (systemId) {
    case "attitudinal":
      return (
        <AttitudinalSelector
          selections={selections}
          onUpdateSelection={onUpdateSelection}
        />
      );
    case "enneagram":
      return (
        <EnneagramSelector
          selections={selections}
          onUpdateSelection={onUpdateSelection}
          onSetEnneagramType={onSetEnneagramType}
        />
      );
    case "mbti":
      return (
        <MBTISelector
          selections={selections}
          onUpdateSelection={onUpdateSelection}
        />
      );
    case "socionics":
      return (
        <SocionicsSelector
          selections={selections}
          onUpdateSelection={onUpdateSelection}
        />
      );
    case "instincts":
      return (
        <InstinctsSelector
          selections={selections}
          onUpdateSelection={onUpdateSelection}
        />
      );
  }
}
