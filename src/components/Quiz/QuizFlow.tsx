import { useState } from "react";
import type { QuizResult, QuizMode } from "../../data/quiz/types.ts";
import type { EnabledSystems } from "../../types/builder.ts";
import { useQuiz } from "../../hooks/useQuiz.ts";
import {
  SECTION_TRANSITION_TEXT,
  QUICK_QUESTION_COUNT,
  QUICK_REALM_QUESTION_COUNT,
  isRealmQuestionId,
} from "../../data/quiz/questions/index.ts";
import {
  DEEP_QUESTION_COUNT,
  DEEP_REALM_QUESTION_COUNT,
} from "../../data/quiz/longQuestions/index.ts";
import { QuizQuestion } from "./QuizQuestion.tsx";
import { QuizProgress } from "./QuizProgress.tsx";
import { QuizResults } from "./QuizResults.tsx";
import { ModeCard } from "./ModeCard.tsx";

// ============================================================
// PROPS
// ============================================================

interface QuizFlowProps {
  enabledSystems: EnabledSystems;
  onComplete: (result: QuizResult) => void;
  onCancel: () => void;
}

// ============================================================
// COMPONENT
// ============================================================

export function QuizFlow({
  enabledSystems,
  onComplete,
  onCancel,
}: QuizFlowProps) {
  const [quizMode, setQuizMode] = useState<QuizMode | null>(null);
  const [started, setStarted] = useState(false);

  // Mode must be selected before initializing the quiz
  const activeMode = quizMode ?? "quick";
  const quiz = useQuiz(enabledSystems, activeMode);

  const enabledSystemCount =
    Object.values(enabledSystems).filter(Boolean).length;

  // --- Mode selection screen ---
  if (quizMode === null) {
    return (
      <div className="mx-auto max-w-lg animate-[fade-in-up_0.4s_ease-out]">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-100 sm:text-3xl">
            Choose Your Path
          </h2>
          <p className="text-base leading-relaxed text-gray-400">
            Two roads lie before you. One is swift. The other is thorough.
          </p>
        </div>

        <p className="mb-6 text-center text-xs text-gray-600">
          This isn't meant to be an accurate typing tool. It's for fun, a way
          to narrow down potential types, or great if you have a character idea
          and want to see what types they'd likely be.
        </p>

        <div className="mb-8 space-y-4">
          <ModeCard
            title="Quick"
            description="Covers all enabled systems. Faster but less granular, some systems are simplified or derived from others."
            questionCount={computeQuestionCount(enabledSystems, "quick")}
            selected={false}
            onClick={() => setQuizMode("quick")}
          />
          <ModeCard
            title="Extended"
            description="Each system is tested independently with more questions per system. More thorough, more nuanced."
            questionCount={computeQuestionCount(enabledSystems, "deep")}
            selected={false}
            onClick={() => setQuizMode("deep")}
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-700 bg-gray-800 px-6 py-3 font-medium text-gray-300 transition-colors hover:bg-gray-700"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // Total question count including realm questions that will be added dynamically
  const hasRealmQuestions = quiz.questionList.some((q) =>
    isRealmQuestionId(q.id),
  );
  const realmQuestionCount =
    quizMode === "deep"
      ? DEEP_REALM_QUESTION_COUNT
      : QUICK_REALM_QUESTION_COUNT;
  const totalQuestionCount = enabledSystems.instincts
    ? quiz.questionList.length + (hasRealmQuestions ? 0 : realmQuestionCount)
    : quiz.questionList.length;

  // --- Intro screen (before starting) ---
  if (!started) {
    const questionCountMap =
      quizMode === "deep" ? DEEP_QUESTION_COUNT : QUICK_QUESTION_COUNT;

    return (
      <div className="mx-auto max-w-lg animate-[fade-in-up_0.4s_ease-out]">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-100 sm:text-3xl">
            The Realms Demand to Know Who You Are
          </h2>
          <p className="text-base leading-relaxed text-gray-400">
            Answer {totalQuestionCount} questions across {enabledSystemCount}{" "}
            typology {enabledSystemCount === 1 ? "system" : "systems"} to reveal
            your character's inner nature. There are no wrong answers - only
            truths waiting to surface.
          </p>
        </div>

        {quizMode === "quick" && (
          <div className="mb-6 rounded-lg border border-amber-900/40 bg-amber-950/20 p-3 text-sm leading-relaxed text-amber-200/70">
            The Quick quiz tests Jungian type via letter dichotomies (E/I, S/N,
            T/F, J/P) and derives Socionics from the result. For
            cognitive-function-level accuracy, use the Extended quiz or pick
            types manually in the Builder.
          </div>
        )}

        {quizMode === "deep" && (
          <div className="mb-6 rounded-lg border border-indigo-900/40 bg-indigo-950/20 p-3 text-sm leading-relaxed text-indigo-200/70">
            The Extended quiz tests cognitive functions and information elements
            directly, making it more thorough than the Quick quiz - but no
            self-report quiz can replace professional assessment. For best
            results, answer honestly rather than aspirationally, or pick types
            manually in the Builder.
          </div>
        )}

        <div className="mb-8 space-y-2 rounded-lg border border-gray-800 bg-gray-900/50 p-4">
          {(
            [
              ["attitudinal", "Attitudinal Psyche"],
              ["enneagram", "Enneagram"],
              ["mbti", "Jungian Type"],
              ["socionics", "Socionics"],
              ["instincts", "Expanded Instincts"],
            ] as const
          )
            .filter(([id]) => enabledSystems[id])
            .map(([id, label]) => (
              <div
                key={id}
                className="flex items-center justify-between text-sm"
              >
                <span className="font-medium text-gray-300">{label}</span>
                <span className="text-gray-500">
                  {questionCountMap[id]} questions
                </span>
              </div>
            ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setStarted(true)}
            className="flex-1 rounded-lg bg-indigo-600 py-3 text-lg font-bold text-white transition-colors hover:bg-indigo-500"
          >
            Begin
          </button>
          <button
            onClick={() => {
              setQuizMode(null);
              quiz.reset();
            }}
            className="rounded-lg border border-gray-700 bg-gray-800 px-6 py-3 font-medium text-gray-300 transition-colors hover:bg-gray-700"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // --- Results screen ---
  if (quiz.isComplete && quiz.result) {
    return (
      <QuizResults
        result={quiz.result}
        enabledSystems={enabledSystems}
        quizMode={quizMode}
        onGenerateCharacter={() => onComplete(quiz.result!)}
        onRetake={() => {
          quiz.reset();
          setStarted(false);
          setQuizMode(null);
        }}
      />
    );
  }

  // --- Section transition ---
  if (quiz.showingTransition && quiz.transitionSystem) {
    const transition = SECTION_TRANSITION_TEXT[quiz.transitionSystem];
    return (
      <div className="mx-auto max-w-lg animate-[fade-in-up_0.4s_ease-out]">
        <div className="mb-8 text-center">
          <p className="text-lg italic text-gray-400">{transition.outro}</p>
          <p className="mt-3 text-sm text-gray-500">{transition.detail}</p>
        </div>
        <button
          onClick={quiz.dismissTransition}
          className="mx-auto block rounded-lg bg-gray-800 px-8 py-3 font-medium text-gray-300 transition-colors hover:bg-gray-700"
        >
          Continue
        </button>
      </div>
    );
  }

  // --- Question screen ---
  const currentQuestion = quiz.questionList[quiz.currentIndex];
  if (!currentQuestion) return null;

  return (
    <div className="animate-[fade-in-up_0.3s_ease-out]">
      <QuizProgress
        currentIndex={quiz.currentIndex}
        totalCount={totalQuestionCount}
        currentSystem={quiz.currentSystem}
      />

      <QuizQuestion
        key={currentQuestion.id}
        question={currentQuestion}
        selectedIndex={quiz.answerMap[currentQuestion.id]}
        onSelectOption={quiz.answerQuestion}
      />

      <div className="mt-8 flex justify-between">
        <button
          onClick={quiz.goBack}
          disabled={quiz.currentIndex === 0}
          className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Back
        </button>
      </div>
    </div>
  );
}

// ============================================================
// HELPERS
// ============================================================

function computeQuestionCount(
  enabledSystems: EnabledSystems,
  mode: QuizMode,
): number {
  const countMap: Record<string, number> =
    mode === "deep" ? DEEP_QUESTION_COUNT : QUICK_QUESTION_COUNT;
  let total = 0;
  for (const [system, enabled] of Object.entries(enabledSystems)) {
    if (enabled && countMap[system]) {
      total += countMap[system];
    }
  }
  return total;
}
