import type { QuizResult, QuizMode } from "../../data/quiz/types.ts";
import type { EnabledSystems } from "../../types/builder.ts";
import { getEnneagramType, getRealmName } from "../../data/index.ts";
import { ResultCard } from "./ResultCard.tsx";
import { CognitiveFunctionRanking } from "./CognitiveFunctionRanking.tsx";
import {
  describeAP,
  describeEnneagram,
  describeMBTI,
  describeSocionics,
  describeInstincts,
} from "./resultDescriptions.tsx";

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
            label="Jungian Type"
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
              quizMode === "deep" ? "Independent" : "Derived from Jungian type"
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
