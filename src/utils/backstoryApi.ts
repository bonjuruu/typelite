import type { Character, TypologySource } from "../engine/types/index.ts";
import { getArchetypePassiveList } from "../engine/types/index.ts";
import { computeAbilityPower } from "../engine/modifiers.ts";
import { describeStack } from "../data/index.ts";

// ============================================================
// CONFIGURATION
// ============================================================

/**
 * Proxy endpoint.
 * - Dev: Vite proxies /api/backstory → local wrangler dev server
 * - Prod: set VITE_BACKSTORY_PROXY_URL to deployed worker URL
 */
const PROXY_URL: string =
  (import.meta.env.VITE_BACKSTORY_PROXY_URL as string | undefined) ??
  "/api/backstory";

// ============================================================
// PROMPT BUILDING
// ============================================================

/** @internal Exported for testing only. */
export function buildTypologySection(source: TypologySource): string {
  const lineList: string[] = [];

  if (source.attitudinal) {
    const stack = describeStack(source.attitudinal);
    const positions = stack
      .map(
        (s) =>
          `${s.label}: ${s.aspect} (${s.aspectCode}) → ${s.stat} = ${s.statValue}`,
      )
      .join(", ");
    lineList.push(`AP Type: ${source.attitudinal} - ${positions}`);
  }

  if (source.enneagram) {
    const { type, wing, instinct, tritype } = source.enneagram;
    let enneagramLine = `Enneagram: Type ${type}w${wing} ${instinct}`;
    if (tritype) enneagramLine += ` (tritype ${tritype.join("-")})`;
    lineList.push(enneagramLine);
  }

  if (source.mbti) {
    lineList.push(`MBTI: ${source.mbti}`);
  }

  if (source.socionics) {
    lineList.push(`Socionics: ${source.socionics}`);
  }

  if (source.instincts) {
    let instinctLine = `Expanded Instincts: ${source.instincts.realm}`;
    if (source.instincts.tritype)
      instinctLine += ` (tritype ${source.instincts.tritype.join("/")})`;
    lineList.push(instinctLine);
  }

  return lineList.join("\n");
}

/** @internal Exported for testing only. */
export function buildCharacterSummary(
  character: Character,
  characterName: string,
): string {
  const abilityList = character.abilities.map((ability) => {
    const power = computeAbilityPower(ability, character.stats);
    return `${ability.name} (${ability.slot}, ${ability.cognitiveFunction}, power ${power}): ${ability.description}`;
  });

  const passiveList = character.combatBehavior.passives.map(
    (p) => `${p.name}: ${p.description}`,
  );

  const archetypePassiveList = getArchetypePassiveList(
    character.archetype,
  ).map((p) => `${p.name}: ${p.description}`);

  return [
    `Name: ${characterName}`,
    `Title: ${character.title}`,
    "",
    "--- TYPOLOGY INPUTS ---",
    buildTypologySection(character.typologySource),
    "",
    "--- GAME CHARACTER ---",
    `Class: ${character.archetype.className}`,
    `Class Description: ${character.archetype.description}`,
    `Stats: Willpower ${character.stats.willpower}, Intelligence ${character.stats.intelligence}, Spirit ${character.stats.spirit}, Vitality ${character.stats.vitality}`,
    `Element: ${character.element.element} (${character.element.quadra} quadra)`,
    `Combat: ${character.combatBehavior.combatOrientation} - ${character.combatBehavior.activationStyle} activation, ${character.combatBehavior.positioning} positioning, ${character.combatBehavior.regenSource} regen`,
    `Empowered State: ${character.archetype.empoweredState.name} - ${character.archetype.empoweredState.description}`,
    `Stressed State: ${character.archetype.stressedState.name} - ${character.archetype.stressedState.description}`,
    archetypePassiveList.length > 0
      ? `Archetype Passives: ${archetypePassiveList.join("; ")}`
      : "",
    abilityList.length > 0 ? `Abilities:\n${abilityList.join("\n")}` : "",
    passiveList.length > 0 ? `Combat Passives: ${passiveList.join("; ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

// ============================================================
// API CLIENT
// ============================================================

interface ApiError {
  error: string;
}

async function callWorker(body: Record<string, string>): Promise<string> {
  const response = await fetch(PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Worker API error:", response.status, text);
    let message = `Request failed (${response.status})`;
    try {
      const parsed = JSON.parse(text) as ApiError;
      if (parsed.error) message = parsed.error;
    } catch {
      /* use default */
    }
    throw new Error(message);
  }

  return response.text();
}

/**
 * Generate a dark fantasy backstory for a character.
 */
export async function generateBackstory(
  character: Character,
  characterName: string,
): Promise<string> {
  const characterSummary = buildCharacterSummary(character, characterName);
  const raw = await callWorker({ characterSummary, mode: "backstory" });
  const data: { backstory?: string } = JSON.parse(raw) as {
    backstory?: string;
  };
  if (typeof data.backstory !== "string") {
    throw new Error("Invalid API response: missing backstory field");
  }
  return data.backstory;
}

/**
 * Generate a typology analysis report for a character.
 */
export async function generateReport(
  character: Character,
  characterName: string,
): Promise<string> {
  const characterSummary = buildCharacterSummary(character, characterName);
  const raw = await callWorker({ characterSummary, mode: "report" });
  const data: { report?: string } = JSON.parse(raw) as { report?: string };
  if (typeof data.report !== "string") {
    throw new Error("Invalid API response: missing report field");
  }
  return stripMarkdown(data.report);
}

/** Strip markdown formatting that the model sometimes adds despite instructions. */
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1") // **bold** → bold
    .replace(/\*([^*]+)\*/g, "$1") // *italic* → italic
    .replace(/^#{1,6}\s+/gm, "") // ## headers → plain text
    .replace(/^[-*]\s+/gm, "") // - bullets → plain text
    .replace(/^\d+\.\s+/gm, ""); // 1. numbered → plain text
}
