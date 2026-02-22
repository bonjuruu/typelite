import { useEffect, useRef } from "react";
import type { Character, ManualOverrides, CharacterEdits } from "../engine/types/index.ts";
import { serializeToUrl } from "../utils/urlSerializer/index.ts";
import type { BuilderSelections, EnabledSystems } from "../types/builder.ts";

// ============================================================
// URL SYNC HOOK
// ============================================================

interface UseUrlSyncDeps {
  enabledSystems: EnabledSystems;
  selections: BuilderSelections;
  overrides: ManualOverrides;
  characterName: string;
  characterEdits: CharacterEdits;
  rawCharacter: Character | null;
}

export function useUrlSync(deps: UseUrlSyncDeps): void {
  const {
    enabledSystems,
    selections,
    overrides,
    characterName,
    characterEdits,
    rawCharacter,
  } = deps;

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!rawCharacter) return;
    const params = serializeToUrl(
      enabledSystems,
      selections,
      overrides,
      characterName || undefined,
      characterEdits,
    );
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString()}`,
    );
  }, [
    characterEdits,
    enabledSystems,
    selections,
    overrides,
    characterName,
    rawCharacter,
  ]);
}
