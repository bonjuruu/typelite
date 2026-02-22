import type { QuizResult } from "../../data/quiz/types.ts";
import {
  describeStack,
  getSocionicsType,
  getQuadraDescription,
  getClubDescription,
  CLUB_PASSIVES,
  getInstinctRealm,
  getTriadDescription,
  getTriadEPDescription,
  getFunctionStack,
  getCognitiveFunctionName,
  getCognitiveFunctionEssence,
  getAbilityName,
  getEnneagramType,
  getInstinctFullName,
  getInstinctLabel,
} from "../../data/index.ts";
import type {
  APType,
  MBTIType,
  SocionicsType,
  InstinctRealm,
} from "../../engine/types/index.ts";

// ============================================================
// ATTITUDINAL PSYCHE
// ============================================================

const AP_POSITION_STYLES = [
  {
    border: "border-amber-800/30",
    bg: "bg-amber-950/15",
    accent: "text-amber-400/80",
  },
  {
    border: "border-sky-800/30",
    bg: "bg-sky-950/15",
    accent: "text-sky-400/80",
  },
  {
    border: "border-purple-800/30",
    bg: "bg-purple-950/15",
    accent: "text-purple-400/70",
  },
  {
    border: "border-gray-700/30",
    bg: "bg-gray-900/30",
    accent: "text-gray-500",
  },
] as const;

export function describeAP(apType: string): React.ReactNode {
  const stack = describeStack(apType as APType);
  return (
    <div className="space-y-1.5">
      {stack.map((pos, i) => {
        const style = AP_POSITION_STYLES[i];
        return (
          <div
            key={pos.aspectCode}
            className={`rounded border ${style.border} ${style.bg} px-3 py-2`}
          >
            <div className="flex items-baseline gap-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${style.accent}`}
              >
                {pos.label} {pos.aspect}
              </span>
              <span className="text-[10px] text-gray-600">
                {pos.stat} ({pos.statValue})
              </span>
            </div>
            <p className="mt-0.5 text-xs leading-relaxed text-gray-400">
              {pos.flavor.summary}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// ENNEAGRAM
// ============================================================

export function describeEnneagram(result: QuizResult): React.ReactNode {
  if (!result.enneagramType) return "";
  const typeData = getEnneagramType(result.enneagramType);
  return (
    <div className="space-y-3">
      <p>
        Your class is {typeData.className}.{" "}
        {typeData.motivation}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded border border-red-900/30 bg-red-950/20 px-3 py-2">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-red-400/70">
            Core Fear
          </span>
          <span className="text-xs text-gray-300">{typeData.coreFear}</span>
        </div>
        <div className="rounded border border-emerald-900/30 bg-emerald-950/20 px-3 py-2">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-emerald-400/70">
            Core Desire
          </span>
          <span className="text-xs text-gray-300">{typeData.coreDesire}</span>
        </div>
      </div>
      {result.enneagramWing && (
        <p>
          The w{result.enneagramWing} wing shades you toward Type{" "}
          {result.enneagramWing}'s qualities, blending 30% of its stat modifiers
          into your archetype.
        </p>
      )}
      {result.enneagramInstinct && (
        <p>
          As {getInstinctFullName(result.enneagramInstinct)} (
          {result.enneagramInstinct}), you gain the "
          {getInstinctLabel(result.enneagramInstinct)}" passive.
        </p>
      )}
    </div>
  );
}

// ============================================================
// MBTI
// ============================================================

const MBTI_SLOT_KEYS = ["hero", "parent", "child", "inferior"] as const;
const MBTI_SLOT_LABELS = ["Hero", "Parent", "Child", "Inferior"] as const;
const MBTI_SLOT_DESCRIPTIONS = [
  "Your dominant function. This is your strongest, most natural process.",
  "Your auxiliary function. Balances your hero with a complementary perspective.",
  "Your tertiary function. Less mature, sometimes playful or inconsistent.",
  "Largely unconscious. Primitive when it surfaces, but breaks through under pressure.",
] as const;
const MBTI_SLOT_STYLES = [
  {
    accent: "text-amber-400/80",
    border: "border-amber-800/30",
    bg: "bg-amber-950/15",
  },
  {
    accent: "text-sky-400/80",
    border: "border-sky-800/30",
    bg: "bg-sky-950/15",
  },
  {
    accent: "text-purple-400/70",
    border: "border-purple-800/30",
    bg: "bg-purple-950/15",
  },
  {
    accent: "text-gray-500",
    border: "border-gray-700/30",
    bg: "bg-gray-900/30",
  },
] as const;

export function describeMBTI(mbtiType: MBTIType): React.ReactNode {
  const stack = getFunctionStack(mbtiType);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-1.5">
        {stack.map((fn, i) => (
          <div
            key={fn}
            className={`group relative cursor-default rounded border ${MBTI_SLOT_STYLES[i].border} ${MBTI_SLOT_STYLES[i].bg} px-3 py-2`}
          >
            <span
              className={`block text-[10px] font-bold uppercase tracking-wider ${MBTI_SLOT_STYLES[i].accent}`}
            >
              {MBTI_SLOT_LABELS[i]}
            </span>
            <span className="text-xs font-medium text-gray-300">
              {getCognitiveFunctionName(fn)}
            </span>
            <span className="ml-1 text-[10px] text-gray-600">{fn}</span>
            <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-lg border border-gray-700 bg-gray-900 p-3 opacity-0 shadow-xl transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
              <p
                className={`mb-1 text-[10px] font-semibold uppercase tracking-wider ${MBTI_SLOT_STYLES[i].accent}`}
              >
                {MBTI_SLOT_LABELS[i]} Position
              </p>
              <p className="mb-2 text-[11px] leading-relaxed text-gray-500">
                {MBTI_SLOT_DESCRIPTIONS[i]}
              </p>
              <div className="border-t border-gray-800 pt-2">
                <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  {getCognitiveFunctionName(fn)}
                </p>
                <p className="text-[11px] leading-relaxed text-gray-300">
                  {getCognitiveFunctionEssence(fn)}
                </p>
              </div>
              <div className="mt-2 border-t border-gray-800 pt-2">
                <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Ability
                </p>
                <p className="text-[11px] font-medium text-gray-300">
                  {getAbilityName(fn, MBTI_SLOT_KEYS[i])}
                </p>
              </div>
              <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-700" />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs leading-relaxed text-gray-500">
        Hover each slot for details. Four slots, four abilities.
      </p>
    </div>
  );
}

// ============================================================
// SOCIONICS
// ============================================================

export function describeSocionics(
  socionicsType: SocionicsType,
): React.ReactNode {
  const typeData = getSocionicsType(socionicsType);
  const clubPassive = CLUB_PASSIVES[typeData.club];
  return (
    <div className="space-y-2">
      <p className="text-xs leading-relaxed text-gray-400">
        {typeData.name} assigns your quadra, element, and club. These don't map
        1-to-1 with Jungian type.
      </p>
      <div className="grid grid-cols-3 gap-1.5">
        <div className="group relative cursor-default rounded border border-teal-800/30 bg-teal-950/15 px-3 py-2">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-teal-400/70">
            Quadra
          </span>
          <span className="text-xs font-medium text-gray-300">
            {typeData.quadra}
          </span>
          <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded-lg border border-gray-700 bg-gray-900 p-3 opacity-0 shadow-xl transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-teal-400/70">
              {typeData.quadra} Quadra
            </p>
            <p className="text-[11px] leading-relaxed text-gray-300">
              {getQuadraDescription(typeData.quadra)}
            </p>
            <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-700" />
          </div>
        </div>
        <div className="group relative cursor-default rounded border border-indigo-800/30 bg-indigo-950/15 px-3 py-2">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-400/70">
            Club
          </span>
          <span className="text-xs font-medium text-gray-300">
            {typeData.club}
          </span>
          <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded-lg border border-gray-700 bg-gray-900 p-3 opacity-0 shadow-xl transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-400/70">
              {typeData.club} Club
            </p>
            <p className="mb-2 text-[11px] leading-relaxed text-gray-300">
              {getClubDescription(typeData.club)}
            </p>
            <div className="border-t border-gray-800 pt-2">
              <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                Passive
              </p>
              <p className="text-[11px] font-medium text-gray-300">
                {clubPassive.name}
              </p>
            </div>
            <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-700" />
          </div>
        </div>
        <div className="rounded border border-orange-800/30 bg-orange-950/15 px-3 py-2">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-orange-400/70">
            Element
          </span>
          <span className="text-xs font-medium text-gray-300">
            {typeData.element}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// INSTINCTS
// ============================================================

export function describeInstincts(realm: InstinctRealm): React.ReactNode {
  const realmData = getInstinctRealm(realm);
  const centerLabel =
    realmData.center === "SUR"
      ? "Self-Survival (Frontline)"
      : realmData.center === "INT"
        ? "Interpersonal (Support)"
        : "Purpose (Strategist)";
  return (
    <div className="space-y-2">
      <p className="text-xs leading-relaxed text-gray-400">
        {realmData.description}
      </p>
      <p className="text-[10px] leading-relaxed text-gray-500">
        {centerLabel} center. Separate from classic enneagram sp/so/sx
        instincts.
      </p>
      <div className="grid grid-cols-3 gap-1.5">
        <div className="group relative cursor-default rounded border border-rose-800/30 bg-rose-950/15 px-3 py-2">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-rose-400/70">
            Experiential
          </span>
          <span className="text-xs font-medium text-gray-300">
            {realmData.experiential}
          </span>
          <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-2 w-60 rounded-lg border border-gray-700 bg-gray-900 p-3 opacity-0 shadow-xl transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-rose-400/70">
              {realmData.experiential}
            </p>
            <p className="mb-2 text-[11px] leading-relaxed text-gray-300">
              {getTriadEPDescription("experiential", realmData.experiential)}
            </p>
            <div className="border-t border-gray-800 pt-2">
              <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                Ability
              </p>
              <p className="text-[11px] leading-relaxed text-gray-400">
                {getTriadDescription("experiential", realmData.experiential)}
              </p>
            </div>
            <div className="absolute left-8 top-full border-4 border-transparent border-t-gray-700" />
          </div>
        </div>
        <div className="group relative cursor-default rounded border border-cyan-800/30 bg-cyan-950/15 px-3 py-2">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-cyan-400/70">
            Movement
          </span>
          <span className="text-xs font-medium text-gray-300">
            {realmData.movement}
          </span>
          <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-60 -translate-x-1/2 rounded-lg border border-gray-700 bg-gray-900 p-3 opacity-0 shadow-xl transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-400/70">
              {realmData.movement}
            </p>
            <p className="mb-2 text-[11px] leading-relaxed text-gray-300">
              {getTriadEPDescription("movement", realmData.movement)}
            </p>
            <div className="border-t border-gray-800 pt-2">
              <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                Ability
              </p>
              <p className="text-[11px] leading-relaxed text-gray-400">
                {getTriadDescription("movement", realmData.movement)}
              </p>
            </div>
            <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-700" />
          </div>
        </div>
        <div className="group relative cursor-default rounded border border-lime-800/30 bg-lime-950/15 px-3 py-2">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-lime-400/70">
            Source
          </span>
          <span className="text-xs font-medium text-gray-300">
            {realmData.source}
          </span>
          <div className="pointer-events-none absolute bottom-full right-0 z-50 mb-2 w-60 rounded-lg border border-gray-700 bg-gray-900 p-3 opacity-0 shadow-xl transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-lime-400/70">
              {realmData.source}
            </p>
            <p className="mb-2 text-[11px] leading-relaxed text-gray-300">
              {getTriadEPDescription("source", realmData.source)}
            </p>
            <div className="border-t border-gray-800 pt-2">
              <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                Ability
              </p>
              <p className="text-[11px] leading-relaxed text-gray-400">
                {getTriadDescription("source", realmData.source)}
              </p>
            </div>
            <div className="absolute right-8 top-full border-4 border-transparent border-t-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
