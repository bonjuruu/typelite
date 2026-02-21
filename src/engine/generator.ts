import type {
  GeneratorInput,
  Character,
  TypologySource,
  StatBlock,
  StatBreakdown,
  Archetype,
  Ability,
  Element,
  ElementAffinity,
  CombatBehavior,
  SystemId,
} from "./types/index.ts";
import {
  applyStatMultipliers,
  applyStatOverrides,
  DEFAULT_STATS,
} from "./modifiers.ts";
import { getBaseStats } from "../data/attitudinal.ts";
import { buildArchetype, buildTritypeArchetype } from "../data/enneagram/index.ts";
import { buildAbilityKit, buildAbility } from "../data/mbti/index.ts";
import { buildElementAffinity } from "../data/socionics.ts";
import {
  buildCombatBehavior,
  buildTritypeCombatBehavior,
} from "../data/instincts/index.ts";
import { generateName, generateTitle } from "./nameGenerator.ts";

// ============================================================
// CHARACTER GENERATION
// ============================================================

export function generateCharacter(input: GeneratorInput): Character {
  const activeSystems = getActiveSystems(input);

  // 1. AP → base stats (or defaults)
  const baseStats: StatBlock = input.attitudinal
    ? getBaseStats(input.attitudinal)
    : { ...DEFAULT_STATS };
  let stats: StatBlock = baseStats;

  // 2. Enneagram → archetype + stat multipliers
  const archetype: Archetype = input.enneagram
    ? input.enneagram.tritype
      ? buildTritypeArchetype(
          input.enneagram.type,
          input.enneagram.wing,
          input.enneagram.tritype,
          input.enneagram.tritypeWings,
          input.enneagram.instinct,
          input.enneagram.instinctStack,
        )
      : buildArchetype(
          input.enneagram.type,
          input.enneagram.wing,
          input.enneagram.instinct,
          input.enneagram.instinctStack,
        )
    : buildDefaultArchetype(input.overrides.archetype, activeSystems);

  const multipliers = input.enneagram ? archetype.statModifiers : {};
  if (input.enneagram) {
    stats = applyStatMultipliers(stats, multipliers);
  }

  // Apply manual stat overrides (for when AP is off)
  stats = applyStatOverrides(stats, input.overrides.stats);

  // Build stat breakdown for UI tooltip
  const statBreakdown: StatBreakdown = {
    base: baseStats,
    baseSource: input.attitudinal ?? "Default",
    multipliers,
    multiplierSource: input.enneagram ? archetype.className : "",
    overrides: input.overrides.stats,
  };

  // 3. MBTI → ability kit (or manual picks, or empty)
  const abilities: Ability[] = input.mbti
    ? buildAbilityKit(input.mbti)
    : input.overrides.abilities
      ? [
          buildAbility(input.overrides.abilities.hero, "hero"),
          buildAbility(input.overrides.abilities.parent, "parent"),
          buildAbility(input.overrides.abilities.child, "child"),
          buildAbility(input.overrides.abilities.inferior, "inferior"),
        ]
      : [];

  // 4. Socionics → element affinity
  const element: ElementAffinity = input.socionics
    ? buildElementAffinity(input.socionics)
    : buildDefaultElementAffinity(input.overrides.element);

  // 5. Instincts → combat behavior
  const combatBehavior: CombatBehavior = input.instincts
    ? input.instincts.tritype
      ? buildTritypeCombatBehavior(
          input.instincts.realm,
          input.instincts.tritype,
        )
      : buildCombatBehavior(input.instincts.realm)
    : buildDefaultCombatBehavior(input.overrides.combatOrientation);

  // Generate name and title
  const name = generateName(archetype.className, element.element);
  const title = generateTitle(archetype, element);

  // Preserve raw typology inputs for reports
  const typologySource: TypologySource = {
    attitudinal: input.attitudinal,
    mbti: input.mbti,
    socionics: input.socionics,
    enneagram: input.enneagram
      ? {
          type: input.enneagram.type,
          wing: input.enneagram.wing,
          instinct: input.enneagram.instinct,
          tritype: input.enneagram.tritype,
        }
      : null,
    instincts: input.instincts
      ? { realm: input.instincts.realm, tritype: input.instincts.tritype }
      : null,
  };

  return {
    name,
    title,
    stats,
    statBreakdown,
    archetype,
    abilities,
    element,
    combatBehavior,
    activeSystems,
    typologySource,
  };
}

// ============================================================
// ACTIVE SYSTEM TRACKING
// ============================================================

function getActiveSystems(input: GeneratorInput): SystemId[] {
  const systemList: SystemId[] = [];
  if (input.attitudinal) systemList.push("attitudinal");
  if (input.enneagram) systemList.push("enneagram");
  if (input.mbti) systemList.push("mbti");
  if (input.socionics) systemList.push("socionics");
  if (input.instincts) systemList.push("instincts");
  return systemList;
}

// ============================================================
// DEFAULTS (for inactive systems)
// ============================================================

const ARCHETYPE_FALLBACK_LIST: {
  system: SystemId;
  className: string;
  description: string;
}[] = [
  {
    system: "mbti",
    className: "Adventurer",
    description:
      "Defined by skill, not calling. Abilities speak louder than titles.",
  },
  {
    system: "socionics",
    className: "Elemental",
    description: "Aligned to a primal force, wandering without a sworn oath.",
  },
  {
    system: "instincts",
    className: "Survivalist",
    description: "Instinct guides where purpose has not yet spoken.",
  },
];

function buildDefaultArchetype(
  overrideName: string | null,
  activeSystems: SystemId[],
): Archetype {
  let className = "Wanderer";
  let description = "A traveler with no fixed calling.";

  if (!overrideName) {
    const match = ARCHETYPE_FALLBACK_LIST.find((fallback) =>
      activeSystems.includes(fallback.system),
    );
    if (match) {
      className = match.className;
      description = match.description;
    }
  }

  return {
    className: overrideName ?? className,
    description,
    enneagramType: 9,
    wing: 1,
    statModifiers: {},
    empoweredState: {
      name: "Resolved",
      description: "A moment of inner clarity.",
      statChanges: {},
    },
    stressedState: {
      name: "Lost",
      description: "Overcome by uncertainty.",
      statChanges: {},
    },
  };
}

function buildDefaultElementAffinity(
  overrideElement: Element | null,
): ElementAffinity {
  return {
    element: overrideElement ?? "Nature",
    quadra: "Alpha",
    club: "Humanitarian",
    passiveTrait: {
      name: "Unaligned",
      description: "No elemental school. Balanced but unspecialized.",
      source: "No socionics type selected",
    },
  };
}

function buildDefaultCombatBehavior(
  overrideOrientation: string | null,
): CombatBehavior {
  return {
    realm: "SM",
    center: "SUR",
    combatOrientation: overrideOrientation ?? "Balanced",
    activationStyle: "Memorializing",
    positioning: "Aligning",
    regenSource: "Exchanging",
    passives: [],
  };
}

