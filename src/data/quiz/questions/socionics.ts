import type { QuizQuestion } from "../types.ts";

// ============================================================
// SOCIONICS - 4 Quadra Preference Questions
// ============================================================
// Weight keys: 'Alpha', 'Beta', 'Gamma', 'Delta'.

export const SOCIONICS_QUESTION_LIST: readonly QuizQuestion[] = [
  {
    id: "soc-1",
    system: "socionics",
    prompt: "What kind of fellowship do you want in a war-band?",
    optionList: [
      {
        label: "Warmth and shared curiosity. We learn and laugh together",
        weights: { Alpha: 3 },
      },
      {
        label: "Intensity and clear command. We fight with passion",
        weights: { Beta: 3 },
      },
      {
        label: "Competence and ambition. Results over sentiment",
        weights: { Gamma: 3 },
      },
      {
        label: "Quiet reliability. We support each other without drama",
        weights: { Delta: 3 },
      },
    ],
  },
  {
    id: "soc-2",
    system: "socionics",
    prompt: "A dispute divides the camp. Which approach fits you?",
    optionList: [
      {
        label: "Explore every angle openly. Truth comes from free debate",
        weights: { Alpha: 3 },
      },
      {
        label: "Pick a vision and lead. Unity comes from conviction",
        weights: { Beta: 3 },
      },
      {
        label: "Judge by outcomes. Results will prove who was right",
        weights: { Gamma: 3 },
      },
      {
        label: "Find common ground. No idea is worth destroying the group",
        weights: { Delta: 3 },
      },
    ],
  },
  {
    id: "soc-3",
    system: "socionics",
    prompt: "The realm rewards you with one boon. Which do you claim?",
    optionList: [
      { label: "A salon of endless ideas and wonder", weights: { Alpha: 3 } },
      {
        label: "A cause worth fighting for. Something that demands everything",
        weights: { Beta: 3 },
      },
      {
        label: "A venture of my own. Freedom, profit, mastery",
        weights: { Gamma: 3 },
      },
      {
        label: "A peaceful homestead. A life of meaning and craft",
        weights: { Delta: 3 },
      },
    ],
  },
  {
    id: "soc-4",
    system: "socionics",
    prompt: "Conflict breaks out in the party. What is your instinct?",
    optionList: [
      {
        label: "Talk it through with everyone. Transparency clears the air",
        weights: { Alpha: 3 },
      },
      {
        label: "Someone needs to decide. The rest follow",
        weights: { Beta: 3 },
      },
      {
        label: "Let each person handle it. Autonomy breeds strength",
        weights: { Gamma: 3 },
      },
      {
        label: "Mediate quietly. Find the middle ground",
        weights: { Delta: 3 },
      },
    ],
  },
] as const;
