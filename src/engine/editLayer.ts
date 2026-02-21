import type {
  Character,
  CharacterEdits,
  StatBlock,
  StatName,
  Element,
  ElementAffinity,
  Quadra,
  Club,
} from "./types/index.ts";
import { MAX_STAT } from "./modifiers.ts";
import { CLUB_PASSIVES } from "../data/socionics.ts";

// ============================================================
// ELEMENT → AFFINITY LOOKUP
// ============================================================

const ELEMENT_QUADRA: Record<Element, Quadra> = {
  Light: "Alpha",
  Nature: "Alpha",
  Fire: "Beta",
  Shadow: "Beta",
  Earth: "Gamma",
  Metal: "Gamma",
  Wind: "Delta",
  Water: "Delta",
};

const QUADRA_CLUB: Record<Quadra, Club> = {
  Alpha: "Humanitarian",
  Beta: "Practical",
  Gamma: "Researcher",
  Delta: "Social",
};

function buildElementAffinity(element: Element): ElementAffinity {
  const quadra = ELEMENT_QUADRA[element];
  const club = QUADRA_CLUB[quadra];
  return {
    element,
    quadra,
    club,
    passiveTrait: CLUB_PASSIVES[club],
  };
}

// ============================================================
// STAT BUDGET VALIDATION
// ============================================================

const STAT_KEY_LIST: StatName[] = [
  "willpower",
  "intelligence",
  "spirit",
  "vitality",
];
const STAT_BUDGET_TOLERANCE = 4;

function sumStats(stats: StatBlock): number {
  return STAT_KEY_LIST.reduce((sum, key) => sum + stats[key], 0);
}

function clampStat(value: number): number {
  return Math.max(1, Math.min(MAX_STAT, Math.round(value)));
}

export function isStatBudgetValid(
  originalStats: StatBlock,
  editedStats: StatBlock,
  tolerance = STAT_BUDGET_TOLERANCE,
): boolean {
  const originalTotal = sumStats(originalStats);
  const editedTotal = sumStats(editedStats);
  return Math.abs(editedTotal - originalTotal) <= tolerance;
}

// ============================================================
// APPLY EDITS
// ============================================================

export function applyEdits(
  character: Character,
  edits: CharacterEdits,
): Character {
  let result = character;

  // Stats
  if (edits.stats) {
    const mergedStats = { ...character.stats };
    for (const key of STAT_KEY_LIST) {
      const editValue = edits.stats[key];
      if (editValue !== undefined) {
        mergedStats[key] = clampStat(editValue);
      }
    }
    // Enforce budget: if over budget, don't apply stat edits
    if (isStatBudgetValid(character.stats, mergedStats)) {
      result = { ...result, stats: mergedStats };
    }
  }

  // Class name
  if (edits.className !== null) {
    result = {
      ...result,
      archetype: { ...result.archetype, className: edits.className },
    };
  }

  // Ability names
  if (edits.abilityNameList) {
    const nameMap = edits.abilityNameList;
    const editedAbilityList = result.abilities.map((ability) => {
      const editedName = nameMap[ability.slot];
      if (editedName !== undefined) {
        return { ...ability, name: editedName };
      }
      return ability;
    });
    result = { ...result, abilities: editedAbilityList };
  }

  // Element (cascades to quadra/club/passive)
  if (edits.element !== null) {
    result = { ...result, element: buildElementAffinity(edits.element) };
  }

  // Combat orientation
  if (edits.combatOrientation !== null) {
    result = {
      ...result,
      combatBehavior: {
        ...result.combatBehavior,
        combatOrientation: edits.combatOrientation,
      },
    };
  }

  return result;
}
