import type { QuizResult, QuizMode } from "../../data/quiz/types.ts";
import type { EnabledSystems } from "../../types/builder.ts";
import {
  getEnneagramType,
  getInstinctLabel,
  getInstinctFullName,
  describeStack,
  getSocionicsType,
  getRealmName,
  getInstinctRealm,
  getFunctionStack,
  getCognitiveFunctionName,
} from "../../data/index.ts";
import { ResultCard } from "./ResultCard.tsx";
import { CognitiveFunctionRanking } from "./CognitiveFunctionRanking.tsx";

// ============================================================
// PROPS
// ============================================================

interface QuizResultsProps {
  result: QuizResult;
  enabledSystems: EnabledSystems;
  quizMode: QuizMode;
  onGenerateCharacter: () => void;
  onRetake: () => void;
}

// ============================================================
// COMPONENT
// ============================================================

export function QuizResults({
  result,
  enabledSystems,
  quizMode,
  onGenerateCharacter,
  onRetake,
}: QuizResultsProps) {
  return (
    <div className="mx-auto max-w-lg animate-[fade-in-up_0.4s_ease-out]">
      <h2 className="mb-8 text-center text-2xl font-bold text-gray-100">
        Your Types Have Been Revealed
      </h2>

      <div className="mb-8 space-y-3">
        {enabledSystems.attitudinal && result.attitudinal && (
          <ResultCard
            label="Attitudinal Psyche"
            domain="Base Stats"
            value={result.attitudinal}
            description={describeAP(result.attitudinal)}
            explanation={result.explanationMap?.attitudinal}
          />
        )}

        {enabledSystems.enneagram && result.enneagramType && (
          <ResultCard
            label="Enneagram"
            domain="Class"
            value={formatEnneagram(result)}
            description={describeEnneagram(result)}
            explanation={result.explanationMap?.enneagram}
          />
        )}

        {enabledSystems.mbti && result.mbti && (
          <ResultCard
            label="MBTI"
            domain="Abilities"
            value={result.mbti}
            description={describeMBTI(result.mbti)}
            explanation={result.explanationMap?.mbti}
            methodNote={
              quizMode === "deep" ? "Function-based" : "Dichotomy-based"
            }
          >
            {quizMode === "deep" &&
              result.deepDetail?.cognitiveFunctionScoreMap && (
                <CognitiveFunctionRanking
                  scoreMap={result.deepDetail.cognitiveFunctionScoreMap}
                />
              )}
          </ResultCard>
        )}

        {enabledSystems.socionics && result.socionics && (
          <ResultCard
            label="Socionics"
            domain="Element"
            value={result.socionics}
            description={describeSocionics(result.socionics)}
            explanation={result.explanationMap?.socionics}
            methodNote={
              quizMode === "deep" ? "Independent" : "Derived from MBTI"
            }
          />
        )}

        {enabledSystems.instincts && result.instinctRealm && (
          <ResultCard
            label="Expanded Instincts"
            domain="Combat"
            value={`${result.instinctRealm} - ${getRealmName(result.instinctRealm)}`}
            description={describeInstincts(result.instinctRealm)}
            explanation={result.explanationMap?.instincts}
          />
        )}
      </div>

      <p className="mb-6 text-center text-sm text-gray-500">
        These results will populate the builder where you can adjust before
        generating.
      </p>

      <div className="flex gap-4">
        <button
          onClick={onGenerateCharacter}
          className="flex-1 rounded-lg bg-indigo-600 py-3 text-lg font-bold text-white transition-colors hover:bg-indigo-500"
        >
          Generate Character
        </button>
        <button
          onClick={onRetake}
          className="rounded-lg border border-gray-700 bg-gray-800 px-6 py-3 font-medium text-gray-300 transition-colors hover:bg-gray-700"
        >
          Retake
        </button>
      </div>
    </div>
  );
}

// ============================================================
// HELPERS
// ============================================================

function formatEnneagram(result: QuizResult): string {
  if (!result.enneagramType) return "";

  const typeData = getEnneagramType(result.enneagramType);
  const wingStr = result.enneagramWing ? `w${result.enneagramWing}` : "";
  const instinctStr = result.enneagramInstinct
    ? ` (${result.enneagramInstinct})`
    : "";

  return `${result.enneagramType}${wingStr}${instinctStr} - ${typeData.className}`;
}

// ============================================================
// DESCRIPTION GENERATORS
// ============================================================

function describeAP(apType: string): string {
  const stack = describeStack(
    apType as import("../../engine/types/index.ts").APType,
  );
  const first = stack[0];
  const fourth = stack[3];
  return `Your ${first.aspect} leads - ${first.flavor.summary} Your weakest aspect is ${fourth.aspect}, sitting in 4th where you defer to others. This sets your base stats: ${first.stat} highest (${first.statValue}), ${fourth.stat} lowest (${fourth.statValue}).`;
}

function describeEnneagram(result: QuizResult): string {
  if (!result.enneagramType) return "";
  const typeData = getEnneagramType(result.enneagramType);
  const wingPart = result.enneagramWing
    ? ` The w${result.enneagramWing} wing shades you toward Type ${result.enneagramWing}'s qualities, blending 30% of its stat modifiers into your archetype.`
    : "";
  const instinctPart = result.enneagramInstinct
    ? ` As ${getInstinctFullName(result.enneagramInstinct)} (${result.enneagramInstinct}), you gain the "${getInstinctLabel(result.enneagramInstinct)}" passive.`
    : "";
  return `${typeData.name} becomes your ${typeData.className} class. ${typeData.description}${wingPart}${instinctPart}`;
}

function describeMBTI(
  mbtiType: import("../../engine/types/index.ts").MBTIType,
): string {
  const stack = getFunctionStack(mbtiType);
  const heroName = getCognitiveFunctionName(stack[0]);
  const inferiorName = getCognitiveFunctionName(stack[3]);
  return `Your Hero function is ${heroName} (${stack[0]}) - your primary ability and strongest expression in combat. Your Inferior, ${inferiorName} (${stack[3]}), is normally weak but has a clutch comeback mechanic when you're under pressure. The full stack ${stack.join("-")} gives you four distinct abilities.`;
}

function describeSocionics(
  socionicsType: import("../../engine/types/index.ts").SocionicsType,
): string {
  const typeData = getSocionicsType(socionicsType);
  return `${typeData.name} places you in the ${typeData.quadra} quadra, granting the ${typeData.element} element. Your ${typeData.club} club gives a passive trait that reflects your cognitive style. Note: Socionics types don't map 1-to-1 with MBTI - they're a separate system with different notation.`;
}

function describeInstincts(
  realm: import("../../engine/types/index.ts").InstinctRealm,
): string {
  const realmData = getInstinctRealm(realm);
  const centerLabel =
    realmData.center === "SUR"
      ? "Self-Survival (Frontline)"
      : realmData.center === "INT"
        ? "Interpersonal (Support)"
        : "Purpose (Strategist)";
  return `${realmData.name} sits in the ${centerLabel} center, setting your combat orientation. Your triads - ${realmData.experiential} activation, ${realmData.movement} positioning, ${realmData.source} regen - shape how you fight moment to moment. This is separate from classic enneagram sp/so/sx instincts.`;
}
