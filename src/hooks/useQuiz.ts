import { useState, useCallback, useMemo } from "react";
import type {
  QuizQuestion,
  QuizAnswerMap,
  QuizResult,
  QuizMode,
} from "../data/quiz/types.ts";
import type { QuizSystemId } from "../data/quiz/types.ts";
import {
  getQuestionList,
  getInstinctRealmQuestionList,
  QUICK_REALM_QUESTION_COUNT,
} from "../data/quiz/questions/index.ts";
import {
  getLongQuestionList,
  getLongInstinctRealmQuestionList,
  DEEP_REALM_QUESTION_COUNT,
} from "../data/quiz/longQuestions/index.ts";
import {
  scoreInstinctCenter,
  scoreInstinctCenterDeep,
  computeQuizResults,
  quickScorerKit,
  deepScorerKit,
} from "../engine/quiz/index.ts";
import type { EnabledSystems } from "../types/builder.ts";

// ============================================================
// TYPES
// ============================================================

export interface UseQuizReturn {
  /** Full ordered question list for enabled systems (including dynamically resolved realm questions). */
  questionList: QuizQuestion[];
  /** Current question index. */
  currentIndex: number;
  /** All answers so far. */
  answerMap: QuizAnswerMap;
  /** Which system section we're currently in. */
  currentSystem: QuizSystemId | null;
  /** 0–1 fraction of progress. */
  progress: number;
  /** Whether all questions have been answered. */
  isComplete: boolean;
  /** Computed quiz result (populated after completion). */
  result: QuizResult | null;
  /** Whether we're on a section transition screen. */
  showingTransition: boolean;
  /** The system that just completed (for transition text). */
  transitionSystem: QuizSystemId | null;

  /** Record an answer and advance. */
  answerQuestion: (optionIndex: number) => void;
  /** Navigate to the previous question. */
  goBack: () => void;
  /** Reset the quiz to start over. */
  reset: () => void;
  /** Dismiss the section transition. */
  dismissTransition: () => void;
}

// ============================================================
// HOOK
// ============================================================

export function useQuiz(
  enabledSystems: EnabledSystems,
  quizMode: QuizMode = "quick",
): UseQuizReturn {
  const [answerMap, setAnswerMap] = useState<QuizAnswerMap>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [showingTransition, setShowingTransition] = useState(false);
  const [transitionSystem, setTransitionSystem] = useState<QuizSystemId | null>(
    null,
  );

  // Dynamically resolved instinct realm questions
  const [resolvedRealmQuestionList, setResolvedRealmQuestionList] = useState<
    QuizQuestion[] | null
  >(null);

  const realmQuestionCount =
    quizMode === "deep"
      ? DEEP_REALM_QUESTION_COUNT
      : QUICK_REALM_QUESTION_COUNT;

  // Build the base question list from enabled systems
  const baseQuestionList = useMemo(() => {
    return quizMode === "deep"
      ? getLongQuestionList(enabledSystems)
      : getQuestionList(enabledSystems);
  }, [enabledSystems, quizMode]);

  // Full question list: base + dynamically resolved realm questions
  const questionList = useMemo(() => {
    if (resolvedRealmQuestionList) {
      return [...baseQuestionList, ...resolvedRealmQuestionList];
    }
    return baseQuestionList;
  }, [baseQuestionList, resolvedRealmQuestionList]);

  const currentQuestion = questionList[currentIndex] ?? null;
  const currentSystem = currentQuestion?.system ?? null;

  const totalQuestionCount = enabledSystems.instincts
    ? baseQuestionList.length + realmQuestionCount
    : baseQuestionList.length;

  const progress =
    totalQuestionCount > 0 ? currentIndex / totalQuestionCount : 0;
  const isComplete = result !== null;

  const answerQuestion = useCallback(
    (optionIndex: number) => {
      if (!currentQuestion) return;

      const newAnswerMap = { ...answerMap, [currentQuestion.id]: optionIndex };
      setAnswerMap(newAnswerMap);

      const nextIndex = currentIndex + 1;

      // Check if we just finished the instinct center questions and need to resolve realm questions
      if (
        enabledSystems.instincts &&
        !resolvedRealmQuestionList &&
        currentQuestion.system === "instincts" &&
        nextIndex === baseQuestionList.length
      ) {
        // All base questions answered, including the center questions.
        // Determine center and load realm questions.
        const centerQuestionList = baseQuestionList.filter(
          (q) => q.system === "instincts",
        );
        const center =
          quizMode === "deep"
            ? scoreInstinctCenterDeep(newAnswerMap, centerQuestionList)
            : scoreInstinctCenter(newAnswerMap, centerQuestionList);
        const realmQuestionList =
          quizMode === "deep"
            ? [...getLongInstinctRealmQuestionList(center)]
            : [...getInstinctRealmQuestionList(center)];
        setResolvedRealmQuestionList(realmQuestionList);
        setCurrentIndex(nextIndex);
        return;
      }

      // Check if we've reached the end of all questions
      const fullQuestionCount = resolvedRealmQuestionList
        ? baseQuestionList.length + resolvedRealmQuestionList.length
        : enabledSystems.instincts
          ? baseQuestionList.length + realmQuestionCount
          : baseQuestionList.length;

      if (nextIndex >= fullQuestionCount && resolvedRealmQuestionList) {
        // Compute results
        try {
          const kit = quizMode === "deep" ? deepScorerKit : quickScorerKit;
          const computedResult = computeQuizResults(
            newAnswerMap,
            enabledSystems,
            baseQuestionList,
            resolvedRealmQuestionList,
            kit,
          );
          setResult(computedResult);
        } catch (error) {
          console.error("Failed to compute quiz results:", error);
        }
        setCurrentIndex(nextIndex);
        return;
      }

      // Check for section transition
      const nextQuestion = (
        resolvedRealmQuestionList
          ? [...baseQuestionList, ...resolvedRealmQuestionList]
          : baseQuestionList
      )[nextIndex];

      if (nextQuestion && currentQuestion.system !== nextQuestion.system) {
        setTransitionSystem(currentQuestion.system);
        setShowingTransition(true);
      }

      setCurrentIndex(nextIndex);
    },
    [
      answerMap,
      currentIndex,
      currentQuestion,
      enabledSystems,
      baseQuestionList,
      resolvedRealmQuestionList,
      quizMode,
      realmQuestionCount,
    ],
  );

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const prevQuestion = questionList[prevIndex];
      const currentQ = questionList[currentIndex];

      // Show transition if crossing system boundary
      if (currentQ && prevQuestion && currentQ.system !== prevQuestion.system) {
        setTransitionSystem(prevQuestion.system);
        setShowingTransition(true);
      } else {
        setShowingTransition(false);
        setTransitionSystem(null);
      }

      // If we're going back from results, clear the result
      if (result) {
        setResult(null);
      }
      setCurrentIndex(prevIndex);
    }
  }, [currentIndex, result, questionList]);

  const reset = useCallback(() => {
    setAnswerMap({});
    setCurrentIndex(0);
    setResult(null);
    setResolvedRealmQuestionList(null);
    setShowingTransition(false);
    setTransitionSystem(null);
  }, []);

  const dismissTransition = useCallback(() => {
    setShowingTransition(false);
    setTransitionSystem(null);
  }, []);

  return {
    questionList,
    currentIndex,
    answerMap,
    currentSystem,
    progress,
    isComplete,
    result,
    showingTransition,
    transitionSystem,
    answerQuestion,
    goBack,
    reset,
    dismissTransition,
  };
}
