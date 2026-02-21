import type { QuizQuestion } from "../types.ts";

// ============================================================
// ATTITUDINAL PSYCHE — 6 Pairwise Comparison Questions
// ============================================================
// One question for each pair: V vs L, V vs E, V vs F, L vs E, L vs F, E vs F.
// Chosen option gives +1 win to that aspect.

export const AP_QUESTION_LIST: readonly QuizQuestion[] = [
  {
    id: "ap-1",
    system: "attitudinal",
    prompt:
      "A cursed wood splits into two paths. One leads to a throne, the other to a library holding every secret in the world. Which do you take?",
    optionList: [
      { label: "The throne. My will shapes the world", weights: { V: 1 } },
      {
        label: "The library. Knowledge outlasts everything",
        weights: { L: 1 },
      },
    ],
  },
  {
    id: "ap-2",
    system: "attitudinal",
    prompt: "A dying god offers one last gift. Which do you claim?",
    optionList: [
      {
        label: "Unbreakable will. Fate bends to those who refuse to",
        weights: { V: 1 },
      },
      { label: "Depth of feeling. It could move mountains", weights: { E: 1 } },
    ],
  },
  {
    id: "ap-3",
    system: "attitudinal",
    prompt:
      "Deep in an underground forge, you can claim one of two things. Which do you take?",
    optionList: [
      {
        label: "Command of a vast army. Power flows through people",
        weights: { V: 1 },
      },
      {
        label: "A body that never breaks. I am my own fortress",
        weights: { F: 1 },
      },
    ],
  },
  {
    id: "ap-4",
    system: "attitudinal",
    prompt: "A riddle-spirit offers you a gift. Which do you accept?",
    optionList: [
      {
        label: "Perfect reasoning. Every puzzle yields to my mind",
        weights: { L: 1 },
      },
      { label: "Perfect empathy. Every heart opens to me", weights: { E: 1 } },
    ],
  },
  {
    id: "ap-5",
    system: "attitudinal",
    prompt:
      "A cursed mirror shows two futures. Which reflection do you step into?",
    optionList: [
      {
        label: "The sharp mind. No enchantment could hold me",
        weights: { L: 1 },
      },
      {
        label: "The tireless body. Pain and fatigue become memories",
        weights: { F: 1 },
      },
    ],
  },
  {
    id: "ap-6",
    system: "attitudinal",
    prompt: "What sustains you through the darkest siege?",
    optionList: [
      {
        label: "The fire in my heart. Feeling is what makes me alive",
        weights: { E: 1 },
      },
      {
        label: "The resilience of my body. I can outlast anything",
        weights: { F: 1 },
      },
    ],
  },
] as const;
