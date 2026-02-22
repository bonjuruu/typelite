import { useState, useCallback } from "react";
import type { Character } from "../engine/types/index.ts";
import { EMPTY_CHARACTER_EDITS } from "../engine/types/index.ts";
import type { QuizResult } from "../data/quiz/types.ts";
import { generateCharacter } from "../engine/generator.ts";
import { generateName } from "../engine/nameGenerator.ts";
import { serializeToUrl, deserializeFromUrl } from "../utils/urlSerializer/index.ts";
import { AP_TYPE_LIST } from "../data/attitudinal.ts";
import { MBTI_TYPE_LIST } from "../data/mbti/index.ts";
import { SOCIONICS_TYPE_LIST } from "../data/socionics.ts";

export type { BuilderSelections, EnabledSystems } from "../types/builder.ts";

import type { BuilderSelections } from "../types/builder.ts";

import {
  useBuilderSelections,
  pickRandom,
  randomizeEnneagramSelections,
  randomizeInstinctsSelections,
  INITIAL_SELECTIONS,
} from "./useBuilderSelections.ts";
import { useCharacterEdits } from "./useCharacterEdits.ts";
import { useUrlSync } from "./useUrlSync.ts";
import {
  buildGeneratorInput,
  sanitizeEnabledSystems,
  checkSelections,
} from "./generatorHelpers.ts";

// ============================================================
// HOOK
// ============================================================

export function useCharacterGenerator() {
  const {
    enabledSystems,
    selections,
    overrides,
    setEnabledSystems,
    setSelections,
    setOverrides,
    toggleSystem,
    updateSelection,
    updateOverride,
    setEnneagramType,
    randomizeSystem,
  } = useBuilderSelections();

  const [rawCharacter, setRawCharacter] = useState<Character | null>(null);
  const [characterName, setCharacterName] = useState<string>("");
  const [generateCount, setGenerateCount] = useState(0);

  const {
    character,
    characterEdits,
    setCharacterEdits,
    updateCharacterEdit,
    resetCharacterEdits,
  } = useCharacterEdits(rawCharacter);

  const regenerateName = useCallback(() => {
    const newName = generateName(
      character?.archetype.className,
      character?.element.element,
    );
    setCharacterName(newName);
  }, [character]);

  const randomizeAll = useCallback(() => {
    let newSelections: BuilderSelections = { ...selections };

    if (enabledSystems.attitudinal) {
      newSelections.attitudinal = pickRandom(AP_TYPE_LIST);
    }
    if (enabledSystems.enneagram) {
      newSelections = {
        ...newSelections,
        ...randomizeEnneagramSelections(newSelections),
      };
    }
    if (enabledSystems.mbti) {
      newSelections.mbti = pickRandom(MBTI_TYPE_LIST);
    }
    if (enabledSystems.socionics) {
      newSelections.socionics = pickRandom(SOCIONICS_TYPE_LIST);
    }
    if (enabledSystems.instincts) {
      newSelections = {
        ...newSelections,
        ...randomizeInstinctsSelections(newSelections),
      };
    }

    setSelections(newSelections);

    const input = buildGeneratorInput(enabledSystems, newSelections, overrides);
    const generatedCharacter = generateCharacter(input);
    setRawCharacter(generatedCharacter);
    setCharacterEdits(EMPTY_CHARACTER_EDITS);
    setCharacterName(generatedCharacter.name);
    setGenerateCount((prev) => prev + 1);

    const params = serializeToUrl(
      enabledSystems,
      newSelections,
      overrides,
      generatedCharacter.name,
    );
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", url);
  }, [enabledSystems, selections, overrides, setSelections, setCharacterEdits]);

  const generate = useCallback(() => {
    const input = buildGeneratorInput(enabledSystems, selections, overrides);
    const generatedCharacter = generateCharacter(input);
    setRawCharacter(generatedCharacter);
    setCharacterEdits(EMPTY_CHARACTER_EDITS);
    setCharacterName(generatedCharacter.name);
    setGenerateCount((prev) => prev + 1);

    const params = serializeToUrl(
      enabledSystems,
      selections,
      overrides,
      generatedCharacter.name,
    );
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", url);
  }, [enabledSystems, selections, overrides, setCharacterEdits]);

  const loadFromUrl = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("s")) return false;

    const state = deserializeFromUrl(params);
    if (!state) {
      window.history.replaceState(null, "", window.location.pathname);
      return false;
    }

    const sanitizedSystems = sanitizeEnabledSystems(
      state.enabledSystems,
      state.selections,
    );

    setEnabledSystems(sanitizedSystems);
    setSelections(state.selections);
    setOverrides(state.overrides);

    const hasAnySelection = checkSelections(sanitizedSystems, state.selections);
    if (!hasAnySelection) {
      window.history.replaceState(null, "", window.location.pathname);
      return false;
    }

    try {
      const input = buildGeneratorInput(
        sanitizedSystems,
        state.selections,
        state.overrides,
      );
      const generatedCharacter = generateCharacter(input);
      setRawCharacter(generatedCharacter);
      setCharacterEdits(state.edits ?? EMPTY_CHARACTER_EDITS);
      setCharacterName(state.characterName ?? generatedCharacter.name);
      setGenerateCount((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to generate character from URL:", error);
      window.history.replaceState(null, "", window.location.pathname);
      return false;
    }

    return true;
  }, [setEnabledSystems, setSelections, setOverrides, setCharacterEdits]);

  const applyQuizResults = useCallback(
    (quizResult: QuizResult) => {
      const newSelections: BuilderSelections = { ...INITIAL_SELECTIONS };

      if (quizResult.attitudinal)
        newSelections.attitudinal = quizResult.attitudinal;
      if (quizResult.enneagramType) {
        newSelections.enneagramType = quizResult.enneagramType;
        newSelections.enneagramWing = quizResult.enneagramWing;
        newSelections.enneagramInstinct = quizResult.enneagramInstinct;
      }
      if (quizResult.mbti) newSelections.mbti = quizResult.mbti;
      if (quizResult.socionics) newSelections.socionics = quizResult.socionics;
      if (quizResult.instinctRealm)
        newSelections.instinctRealm = quizResult.instinctRealm;

      setSelections(newSelections);

      const input = buildGeneratorInput(
        enabledSystems,
        newSelections,
        overrides,
      );
      const generatedCharacter = generateCharacter(input);
      setRawCharacter(generatedCharacter);
      setCharacterEdits(EMPTY_CHARACTER_EDITS);
      setCharacterName(generatedCharacter.name);
      setGenerateCount((prev) => prev + 1);

      const params = serializeToUrl(
        enabledSystems,
        newSelections,
        overrides,
        generatedCharacter.name,
      );
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}?${params.toString()}`,
      );
    },
    [enabledSystems, overrides, setSelections, setCharacterEdits],
  );

  // Sync edits to URL after state commits
  useUrlSync({
    enabledSystems,
    selections,
    overrides,
    characterName,
    characterEdits,
    rawCharacter,
  });

  const hasAllSelections = checkSelections(enabledSystems, selections);

  return {
    enabledSystems,
    selections,
    overrides,
    character,
    rawCharacter,
    characterEdits,
    characterName,
    generateCount,
    hasAllSelections,
    toggleSystem,
    updateSelection,
    updateOverride,
    setEnneagramType,
    randomizeSystem,
    randomizeAll,
    generate,
    setCharacterName,
    regenerateName,
    loadFromUrl,
    applyQuizResults,
    updateCharacterEdit,
    resetCharacterEdits,
  };
}
