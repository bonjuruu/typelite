import type { InstinctCenter } from "../../../engine/types/index.ts";
import type { QuizQuestion } from "../types.ts";

// ============================================================
// EXPANDED INSTINCTS - 8 Questions (3 center + 5 realm)
// ============================================================

// Stage 1: 3 center-determination questions.
// Weight keys: 'SUR', 'INT', 'PUR'.

export const INSTINCT_CENTER_QUESTION_LIST: readonly QuizQuestion[] = [
  {
    id: "inst-1",
    system: "instincts",
    prompt:
      "You have lost your companions, your supplies, and your way. What keeps you moving?",
    optionList: [
      {
        label: "The need to survive and protect what is mine",
        weights: { SUR: 3 },
      },
      {
        label: "The need to connect. To be seen and to see others",
        weights: { INT: 3 },
      },
      {
        label: "The need for meaning. To understand why I exist",
        weights: { PUR: 3 },
      },
    ],
  },
  {
    id: "inst-2",
    system: "instincts",
    prompt:
      "You are shown a vision of your greatest life. What does it look like?",
    optionList: [
      { label: "Strong, secure, and self-sufficient", weights: { SUR: 3 } },
      {
        label: "Deeply woven into others. Trusted, needed, belonging",
        weights: { INT: 3 },
      },
      {
        label: "On purpose. My existence has weight and direction",
        weights: { PUR: 3 },
      },
    ],
  },
  {
    id: "inst-3",
    system: "instincts",
    prompt:
      "A curse forces you to endure one wound for the rest of your journey. Which do you dread most?",
    optionList: [
      {
        label: "Being exposed, depleted, unable to sustain myself",
        weights: { SUR: 3 },
      },
      {
        label: "Being abandoned or misunderstood. Alone in a crowd",
        weights: { INT: 3 },
      },
      { label: "Feeling like nothing I do matters", weights: { PUR: 3 } },
    ],
  },
] as const;

// Stage 2: 5 realm-specific questions per center (15 total, only 5 shown).
// Weight keys are realm codes within that center.

const SUR_REALM_QUESTION_LIST: readonly QuizQuestion[] = [
  {
    id: "inst-sur-1",
    system: "instincts",
    prompt: "A harsh winter is coming. What is your first priority?",
    optionList: [
      {
        label: "Toughen up and push through the cold. I can take it",
        weights: { FD: 3 },
      },
      { label: "Fortify the shelter. Nothing gets in", weights: { SY: 3 } },
      {
        label: "Organize rations and routines. Discipline keeps us alive",
        weights: { SM: 3 },
      },
    ],
  },
  {
    id: "inst-sur-2",
    system: "instincts",
    prompt:
      "You are wounded in battle but the fight is not over. What keeps you going?",
    optionList: [
      {
        label: "Sheer grit. My body has been through worse",
        weights: { FD: 3, SM: 1 },
      },
      { label: "Fear of what happens if I stop", weights: { SY: 3, FD: 1 } },
      {
        label: "Trained composure. Manage the pain, stay effective",
        weights: { SM: 3, SY: 1 },
      },
    ],
  },
  {
    id: "inst-sur-3",
    system: "instincts",
    prompt: "No supplies, no trail, storm closing in. What do you do first?",
    optionList: [
      {
        label: "Push forward. I can take more than the storm can give",
        weights: { FD: 3 },
      },
      { label: "Find shelter. Exposure kills fastest", weights: { SY: 3 } },
      {
        label:
          "Take stock of what we have and ration it. Discipline keeps you alive",
        weights: { SM: 3 },
      },
    ],
  },
  {
    id: "inst-sur-4",
    system: "instincts",
    prompt:
      "A younger party member asks you to teach them survival. What do you focus on?",
    optionList: [
      {
        label: "Endurance. Push past what the body thinks it can take",
        weights: { FD: 3, SY: 1 },
      },
      {
        label: "Reading danger. Know when to run before the threat arrives",
        weights: { SY: 3, SM: 1 },
      },
      {
        label: "Self-management. Sleep, rations, keeping yourself sharp",
        weights: { SM: 3, FD: 1 },
      },
    ],
  },
  {
    id: "inst-sur-5",
    system: "instincts",
    prompt:
      "You can permanently enchant one thing about yourself. What do you pick?",
    optionList: [
      {
        label: "Unbreakable constitution. No poison, disease, or fatigue",
        weights: { FD: 3 },
      },
      {
        label: "Perfect danger sense. I always know when something is wrong",
        weights: { SY: 3 },
      },
      {
        label: "Total self-regulation. Perfect sleep, perfect recovery",
        weights: { SM: 3 },
      },
    ],
  },
];

const INT_REALM_QUESTION_LIST: readonly QuizQuestion[] = [
  {
    id: "inst-int-1",
    system: "instincts",
    prompt: "You join a new war-band. What do you hope to find among them?",
    optionList: [
      {
        label: "Transformation. Relationships that change us both",
        weights: { AY: 3 },
      },
      {
        label: "Belonging. Being part of something bigger than myself",
        weights: { CY: 3 },
      },
      {
        label: "Intimacy. One bond so deep it feels like home",
        weights: { BG: 3 },
      },
    ],
  },
  {
    id: "inst-int-2",
    system: "instincts",
    prompt: "A new settlement welcomes you. What draws you in?",
    optionList: [
      {
        label: "The spark of new connections. Every stranger is a door",
        weights: { AY: 3, CY: 1 },
      },
      {
        label: "The community itself. Shared rituals, roles, belonging",
        weights: { CY: 3, BG: 1 },
      },
      {
        label: "Finding the one person I resonate with. Depth over breadth",
        weights: { BG: 3, AY: 1 },
      },
    ],
  },
  {
    id: "inst-int-3",
    system: "instincts",
    prompt: "The party is fracturing. Old grudges, thin trust. What do you do?",
    optionList: [
      {
        label:
          "Force honest confrontation. We transform through it or we break",
        weights: { AY: 3 },
      },
      {
        label: "Rebuild the rituals. Shared meals, shared duties",
        weights: { CY: 3 },
      },
      {
        label: "Find the person I am closest to and tend that bond first",
        weights: { BG: 3 },
      },
    ],
  },
  {
    id: "inst-int-4",
    system: "instincts",
    prompt:
      "A companion says they feel invisible in the group. How do you respond?",
    optionList: [
      {
        label: "Pair them with someone who will spark something in them",
        weights: { AY: 3, BG: 1 },
      },
      {
        label: "Give them a role. People feel seen when they are needed",
        weights: { CY: 3, AY: 1 },
      },
      {
        label: "Give them my full attention. Sometimes that is enough",
        weights: { BG: 3, CY: 1 },
      },
    ],
  },
  {
    id: "inst-int-5",
    system: "instincts",
    prompt:
      "If you could enchant one thing about your relationships, what would it be?",
    optionList: [
      {
        label:
          "Every interaction sparks growth. That is what connection is for",
        weights: { AY: 3 },
      },
      {
        label: "My community is unbreakable. We always have each other",
        weights: { CY: 3 },
      },
      {
        label: "My closest bond can never be severed. That is all I need",
        weights: { BG: 3 },
      },
    ],
  },
];

const PUR_REALM_QUESTION_LIST: readonly QuizQuestion[] = [
  {
    id: "inst-pur-1",
    system: "instincts",
    prompt:
      "An ancient monument asks you to carve one line that captures the point of your life. What do you write?",
    optionList: [
      {
        label: "Leaving a mark. My name should echo after I am gone",
        weights: { SS: 3 },
      },
      {
        label:
          "Seeing the truth as clearly as possible. Nothing matters more than clarity",
        weights: { EX: 3 },
      },
      {
        label: "Venturing where no map exists. That is where life begins",
        weights: { UN: 3 },
      },
    ],
  },
  {
    id: "inst-pur-2",
    system: "instincts",
    prompt: "A sage will answer one question. What do you ask?",
    optionList: [
      { label: "What am I meant to become?", weights: { SS: 3, EX: 1 } },
      { label: "What is the nature of existence?", weights: { EX: 3, UN: 1 } },
      {
        label: "What lies beyond the edge of everything known?",
        weights: { UN: 3, SS: 1 },
      },
    ],
  },
  {
    id: "inst-pur-3",
    system: "instincts",
    prompt:
      "Everything you believed in has been shattered. Your cause failed, your mentor lied. What do you reach for?",
    optionList: [
      {
        label: "A new identity. If who I was is gone, I forge who I become",
        weights: { SS: 3 },
      },
      {
        label: "The lesson. Even destruction holds a truth",
        weights: { EX: 3 },
      },
      {
        label: "The unknown. Whatever is beyond the wreckage",
        weights: { UN: 3 },
      },
    ],
  },
  {
    id: "inst-pur-4",
    system: "instincts",
    prompt:
      "A younger companion asks what makes a life worth living. What do you tell them?",
    optionList: [
      {
        label: "Become someone who cannot be replaced",
        weights: { SS: 3, EX: 1 },
      },
      {
        label: "Seek understanding. An examined life is never wasted",
        weights: { EX: 3, SS: 1 },
      },
      {
        label: "Stay open to mystery. Certainty is where aliveness stops",
        weights: { UN: 3, EX: 1 },
      },
    ],
  },
  {
    id: "inst-pur-5",
    system: "instincts",
    prompt:
      "You can permanently enchant one aspect of your purpose. What do you choose?",
    optionList: [
      {
        label: "I become exactly what I was born to be. No compromises",
        weights: { SS: 3 },
      },
      {
        label: "I see the truth behind every illusion. Clarity above all",
        weights: { EX: 3 },
      },
      {
        label: "Every mystery opens into a deeper one. That is the point",
        weights: { UN: 3 },
      },
    ],
  },
];

const REALM_QUESTION_MAP: Record<InstinctCenter, readonly QuizQuestion[]> = {
  SUR: SUR_REALM_QUESTION_LIST,
  INT: INT_REALM_QUESTION_LIST,
  PUR: PUR_REALM_QUESTION_LIST,
};

/** Get the 5 realm-specific questions for a determined instinct center. */
export function getInstinctRealmQuestionList(
  center: InstinctCenter,
): readonly QuizQuestion[] {
  return REALM_QUESTION_MAP[center];
}

/** Returns true if the question ID belongs to a dynamically resolved realm question. */
export function isRealmQuestionId(id: string): boolean {
  return /^(deep-)?inst-(sur|int|pur)-/.test(id);
}
