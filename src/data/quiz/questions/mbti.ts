import type { QuizQuestion } from "../types.ts";

// ============================================================
// MBTI — 12 Binary Axis Questions (3 per axis)
// ============================================================
// Weight keys: 'EI', 'SN', 'TF', 'JP'.
// Positive = first letter (E, S, T, J), negative = second letter (I, N, F, P).

export const MBTI_QUESTION_LIST: readonly QuizQuestion[] = [
  // --- E/I axis (3) ---
  {
    id: "mbti-1",
    system: "mbti",
    prompt:
      "Your party makes camp in a vast underground ruin. How do you recharge?",
    optionList: [
      {
        label:
          "By the fire with the others. Talking and laughing fills me back up",
        weights: { EI: 2 },
      },
      {
        label: "Alone at the edge of camp. I need the quiet",
        weights: { EI: -2 },
      },
    ],
  },
  {
    id: "mbti-2",
    system: "mbti",
    prompt: "A new ally joins the party. How do you size them up?",
    optionList: [
      { label: "Talk to them. I learn by engaging", weights: { EI: 1 } },
      {
        label: "Watch them. Actions tell me more than words",
        weights: { EI: -1 },
      },
    ],
  },
  {
    id: "mbti-3",
    system: "mbti",
    prompt: "A grand war council of a hundred voices. What is your role?",
    optionList: [
      {
        label: "In the thick of debate. My voice carries in a crowd",
        weights: { EI: 2 },
      },
      { label: "Listening. I will speak when it counts", weights: { EI: -2 } },
    ],
  },
  // --- S/N axis (3) ---
  {
    id: "mbti-4",
    system: "mbti",
    prompt:
      "You enter a ruined cathedral covered in strange symbols. What catches your eye?",
    optionList: [
      {
        label:
          "The cracks in the stone, the smell. Is this ceiling about to collapse?",
        weights: { SN: 2 },
      },
      {
        label: "The patterns. What story are these symbols telling?",
        weights: { SN: -2 },
      },
    ],
  },
  {
    id: "mbti-5",
    system: "mbti",
    prompt:
      "You have one night to scout an enemy stronghold before the assault. How do you spend it?",
    optionList: [
      {
        label: "Count guards, map rotations, measure walls. Details win sieges",
        weights: { SN: 2 },
      },
      {
        label:
          "Study the whole picture. Supply lines, morale, gaps in the design",
        weights: { SN: -1 },
      },
    ],
  },
  {
    id: "mbti-6",
    system: "mbti",
    prompt:
      "Two engineers argue over breaching a fortress. One wants a battering ram, proven in a hundred sieges. The other has an untested catapult that could clear the wall entirely. Who do you back?",
    optionList: [
      {
        label: "The ram. A hundred wins speaks for itself",
        weights: { SN: 1 },
      },
      {
        label: "The catapult. If it works, we skip the wall entirely",
        weights: { SN: -2 },
      },
    ],
  },
  // --- T/F axis (3) ---
  {
    id: "mbti-7",
    system: "mbti",
    prompt:
      "A comrade made a tactical error that cost the squad dearly. How do you respond?",
    optionList: [
      {
        label:
          "Walk through what went wrong. We learn from failure, not comfort",
        weights: { TF: 2 },
      },
      {
        label: "Check on them first. Guilt can eat someone alive",
        weights: { TF: -2 },
      },
    ],
  },
  {
    id: "mbti-8",
    system: "mbti",
    prompt:
      "Two allies disagree on the route through hostile territory. You have to pick. What guides you?",
    optionList: [
      {
        label: "Whichever route is objectively safer and faster",
        weights: { TF: 1 },
      },
      { label: "Whichever ally has more at stake", weights: { TF: -1 } },
    ],
  },
  {
    id: "mbti-9",
    system: "mbti",
    prompt:
      "A captured enemy offers information in exchange for mercy. What weighs more?",
    optionList: [
      {
        label: "The calculus. Is the intel worth the risk of deception?",
        weights: { TF: 2 },
      },
      {
        label: "The principle. Mercy is right or it is not, intel aside",
        weights: { TF: -2 },
      },
    ],
  },
  // --- J/P axis (3) ---
  {
    id: "mbti-10",
    system: "mbti",
    prompt:
      "Ten branching corridors. You have a partial map. How do you proceed?",
    optionList: [
      {
        label: "One corridor at a time. Mark what we find, stick to the map",
        weights: { JP: 2 },
      },
      {
        label:
          "Follow sounds and instincts. The dungeon will teach us its shape",
        weights: { JP: -2 },
      },
    ],
  },
  {
    id: "mbti-11",
    system: "mbti",
    prompt:
      "An unexpected detour reveals a hidden shrine with strange artifacts. The main quest awaits. What do you do?",
    optionList: [
      {
        label: "Note it, move on. The mission comes first",
        weights: { JP: 1 },
      },
      {
        label: "Explore it now. This might not be here later",
        weights: { JP: -2 },
      },
    ],
  },
  {
    id: "mbti-12",
    system: "mbti",
    prompt: "How do you prefer to approach a long dungeon crawl?",
    optionList: [
      { label: "Room by room, marking the map as I go", weights: { JP: 2 } },
      { label: "Follow my gut and react to what comes", weights: { JP: -1 } },
    ],
  },
] as const;
