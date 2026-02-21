import { describe, it, expect } from "vitest";
import {
  accumulateScoreMap,
  topKey,
  buildQuestionInfluenceList,
} from "../shared.ts";
import type { QuizQuestion, QuizAnswerMap } from "../../../data/quiz/types.ts";

// ============================================================
// INLINE FIXTURES
// ============================================================

function makeQuestion(
  id: string,
  optionList: { label: string; weights: Record<string, number> }[],
): QuizQuestion {
  return {
    id,
    system: "attitudinal",
    prompt: `Question ${id}`,
    optionList,
  };
}

const Q1 = makeQuestion("q1", [
  { label: "A wins", weights: { A: 3, B: 1 } },
  { label: "B wins", weights: { B: 3, A: 1 } },
]);

const Q2 = makeQuestion("q2", [
  { label: "B wins", weights: { B: 2, C: 1 } },
  { label: "C wins", weights: { C: 2, B: 1 } },
]);

const Q3 = makeQuestion("q3", [
  { label: "A wins", weights: { A: 2 } },
  { label: "C wins", weights: { C: 2 } },
]);

// ============================================================
// accumulateScoreMap
// ============================================================

describe("accumulateScoreMap", () => {
  it("accumulates scores correctly across multiple questions", () => {
    const answerMap: QuizAnswerMap = { q1: 0, q2: 0 };
    const result = accumulateScoreMap(
      answerMap,
      [Q1, Q2],
      new Set(["A", "B", "C"]),
    );
    // Q1 option 0: A:3, B:1 - Q2 option 0: B:2, C:1
    expect(result).toEqual({ A: 3, B: 3, C: 1 });
  });

  it("ignores unanswered questions", () => {
    const answerMap: QuizAnswerMap = { q1: 0 };
    const result = accumulateScoreMap(
      answerMap,
      [Q1, Q2],
      new Set(["A", "B", "C"]),
    );
    // Only Q1 option 0 counted
    expect(result).toEqual({ A: 3, B: 1, C: 0 });
  });

  it("ignores weight keys not in validKeySet", () => {
    const answerMap: QuizAnswerMap = { q1: 0 };
    const result = accumulateScoreMap(
      answerMap,
      [Q1],
      new Set(["A"]),
    );
    // B is not in validKeySet, so only A counted
    expect(result).toEqual({ A: 3 });
  });

  it("returns zero-initialized map when no questions answered", () => {
    const result = accumulateScoreMap(
      {},
      [Q1, Q2],
      new Set(["A", "B", "C"]),
    );
    expect(result).toEqual({ A: 0, B: 0, C: 0 });
  });
});

// ============================================================
// topKey
// ============================================================

describe("topKey", () => {
  it("returns the key with the highest score", () => {
    const scoreMap = { A: 5, B: 10, C: 3 };
    expect(topKey(scoreMap, ["A", "B", "C"])).toBe("B");
  });

  it("returns first key in list on tie", () => {
    const scoreMap = { A: 5, B: 5, C: 5 };
    // reduce starts with "A" and only replaces on strictly greater, so "A" wins
    expect(topKey(scoreMap, ["A", "B", "C"])).toBe("A");
  });
});

// ============================================================
// buildQuestionInfluenceList
// ============================================================

describe("buildQuestionInfluenceList", () => {
  it("builds correct question/option/contribution structure", () => {
    const answerMap: QuizAnswerMap = { q1: 0, q2: 1 };
    const result = buildQuestionInfluenceList(
      answerMap,
      [Q1, Q2],
      new Set(["A", "B", "C"]),
    );
    expect(result).toHaveLength(2);

    expect(result[0].questionId).toBe("q1");
    expect(result[0].selectedOptionLabel).toBe("A wins");
    expect(result[0].contributionList).toEqual([
      { target: "A", points: 3 },
      { target: "B", points: 1 },
    ]);

    expect(result[1].questionId).toBe("q2");
    expect(result[1].selectedOptionLabel).toBe("C wins");
    expect(result[1].contributionList).toEqual([
      { target: "C", points: 2 },
      { target: "B", points: 1 },
    ]);
  });

  it("skips unanswered questions", () => {
    const answerMap: QuizAnswerMap = { q1: 0 };
    const result = buildQuestionInfluenceList(
      answerMap,
      [Q1, Q2],
      new Set(["A", "B", "C"]),
    );
    expect(result).toHaveLength(1);
    expect(result[0].questionId).toBe("q1");
  });

  it("filters weights by validKeySet", () => {
    const answerMap: QuizAnswerMap = { q1: 0 };
    const result = buildQuestionInfluenceList(
      answerMap,
      [Q1],
      new Set(["A"]),
    );
    // B is excluded from validKeySet
    expect(result).toHaveLength(1);
    expect(result[0].contributionList).toEqual([
      { target: "A", points: 3 },
    ]);
  });

  it("returns empty list when no questions answered", () => {
    const result = buildQuestionInfluenceList(
      {},
      [Q1, Q2, Q3],
      new Set(["A", "B", "C"]),
    );
    expect(result).toEqual([]);
  });
});
