import type { Character, StatName } from "./types/index.ts";
import { STAT_LABELS } from "../data/stats.ts";

// ============================================================
// CHARACTER SUMMARY GENERATOR
// ============================================================

/**
 * Generate a 2-5 sentence prose summary of what the character's active systems mean together.
 * Pure function — no React imports.
 */
export function generateCharacterSummary(character: Character): string {
  const { activeSystems } = character;
  const sentenceList: string[] = [];

  const hasAP = activeSystems.includes("attitudinal");
  const hasEnneagram = activeSystems.includes("enneagram");
  const hasMBTI = activeSystems.includes("mbti");
  const hasSocionics = activeSystems.includes("socionics");
  const hasInstincts = activeSystems.includes("instincts");

  if (hasAP) {
    const statEntryList = Object.entries(character.statBreakdown.base) as [
      StatName,
      number,
    ][];
    const highestStat = statEntryList.reduce((a, b) => (b[1] > a[1] ? b : a));
    sentenceList.push(
      `Your ${character.statBreakdown.baseSource} stack puts ${STAT_LABELS[highestStat[0]]} at ${highestStat[1]}, making it your primary resource.`,
    );
  }

  if (hasEnneagram) {
    const firstSentence = character.archetype.description.split(/[.!]/)[0];
    sentenceList.push(
      `As a ${character.archetype.className}, you ${firstSentence[0].toLowerCase()}${firstSentence.slice(1)}.`,
    );
  }

  if (hasMBTI) {
    const heroAbility = character.abilities.find((a) => a.slot === "hero");
    if (heroAbility) {
      sentenceList.push(
        `Your ${heroAbility.cognitiveFunction}-dominant kit means you lead with ${heroAbility.name}.`,
      );
    }
  }

  if (hasSocionics) {
    sentenceList.push(
      `${character.element.element} from the ${character.element.quadra} quadra shapes your abilities elementally.`,
    );
  }

  if (hasInstincts) {
    sentenceList.push(
      `In combat, you're a ${character.combatBehavior.combatOrientation} fighter with ${character.combatBehavior.activationStyle} activation and ${character.combatBehavior.positioning} positioning.`,
    );
  }

  return sentenceList.join(" ");
}
