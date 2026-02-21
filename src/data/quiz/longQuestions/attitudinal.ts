import type { QuizQuestion } from "../types.ts";

// ============================================================
// ATTITUDINAL PSYCHE — 12 Questions (6 pairwise + 6 position-attitude)
// ============================================================
// Pairwise: same 6 pairs as quick, different scenarios.
// Position-attitude: each tests a specific position's orientation.

export const DEEP_AP_QUESTION_LIST: readonly QuizQuestion[] = [
  // --- Pairwise comparisons (6) ---
  {
    id: "deep-ap-1",
    system: "attitudinal",
    prompt:
      "Two factions in the war-band argue about what the group needs most in a leader. One side says you need someone who decides and commits — someone whose certainty pulls everyone forward. The other says you need someone who sees clearly — someone who never gets fooled and always finds the truth. Which side do you agree with?",
    optionList: [
      {
        label:
          "Certainty. A leader who hesitates while thinking loses the moment. Conviction moves people",
        weights: { V: 1 },
      },
      {
        label:
          "Clarity. A leader who acts without understanding walks the group off a cliff. Truth comes first",
        weights: { L: 1 },
      },
    ],
  },
  {
    id: "deep-ap-2",
    system: "attitudinal",
    prompt:
      "A shape-shifting curse will permanently take one thing from you. You must choose which you keep: your force of will — your ability to push through resistance, hold your ground, and impose your vision — or your emotional depth — your ability to feel intensely, connect with others, and be moved by beauty.",
    optionList: [
      {
        label:
          "Keep my will. I can survive without feeling everything, but I cannot survive without being able to fight for what I want",
        weights: { V: 1 },
      },
      {
        label:
          "Keep my depth. I can find other ways to push through, but a life without real feeling is hollow",
        weights: { E: 1 },
      },
    ],
  },
  {
    id: "deep-ap-3",
    system: "attitudinal",
    prompt:
      "Two artifacts behind a gate you can only open once. The Crown of Dominion makes armies follow you. The Heartstone makes your body tireless and immune. Which do you claim?",
    optionList: [
      { label: "The Crown. Let them follow", weights: { V: 1 } },
      {
        label: "The Heartstone. My body never fails me again",
        weights: { F: 1 },
      },
    ],
  },
  {
    id: "deep-ap-4",
    system: "attitudinal",
    prompt:
      "You are mediating a dispute between two companions. One insists the answer lies in careful reasoning — lay out the facts, follow the logic, and the right path reveals itself. The other insists the answer lies in listening to what people actually feel — the real problem is emotional, not intellectual. Who do you side with?",
    optionList: [
      {
        label:
          "The reasoner. Feelings shift and mislead. Clear thinking cuts through confusion",
        weights: { L: 1 },
      },
      {
        label:
          "The empath. Logic without heart misses what actually matters to people",
        weights: { E: 1 },
      },
    ],
  },
  {
    id: "deep-ap-5",
    system: "attitudinal",
    prompt:
      "A healer offers you a permanent blessing but can only enchant one thing: your mind or your body. The mind blessing gives you perfect memory, flawless reasoning, and immunity to illusion. The body blessing gives you tireless endurance, rapid healing, and immunity to poison and disease.",
    optionList: [
      {
        label:
          "The mind. A sharp mind protects me from threats no armor can stop",
        weights: { L: 1 },
      },
      {
        label:
          "The body. All the knowledge in the world means nothing if my body fails me",
        weights: { F: 1 },
      },
    ],
  },
  {
    id: "deep-ap-6",
    system: "attitudinal",
    prompt:
      "After a brutal campaign, the party has a week of rest. You notice you are drawn toward one of two things: long conversations with companions where you process everything you have been through — the grief, the bonds, the meaning of it all — or tending to your body — sleeping deeply, eating well, stretching sore muscles, letting your physical self fully recover.",
    optionList: [
      {
        label:
          "The conversations. My heart needs tending more than my body. Processing what I have lived through is how I heal",
        weights: { E: 1 },
      },
      {
        label:
          "The body. Physical recovery comes first. I cannot feel anything properly when I am exhausted and broken down",
        weights: { F: 1 },
      },
    ],
  },
  // --- Position-attitude questions (6) ---
  {
    id: "deep-ap-7",
    system: "attitudinal",
    prompt:
      "A fork in the road with no map. One path looks safe but slow; the other is unmarked. Your party looks to you. What do you do?",
    optionList: [
      {
        label: "Pick a path and go. Standing here is worse than a wrong turn",
        weights: { V: 2 },
      },
      {
        label: "Talk it out with the group. Two minds are better than one",
        weights: { L: 1, E: 1 },
      },
      {
        label:
          "Wait for someone else to decide. I would rather not be the one who gets it wrong",
        weights: { F: 1 },
      },
    ],
  },
  {
    id: "deep-ap-8",
    system: "attitudinal",
    prompt:
      "A companion shares a new theory about how magic works. What is your first instinct?",
    optionList: [
      {
        label:
          "Pull it apart together. I want to explore every angle and hear their reasoning",
        weights: { L: 2 },
      },
      {
        label:
          "I already have my own theory. Theirs is interesting, but mine holds up better",
        weights: { V: 1 },
      },
      {
        label:
          "Ask who came up with it. If a master mage says so, that carries weight",
        weights: { L: -1, F: 1 },
      },
    ],
  },
  {
    id: "deep-ap-9",
    system: "attitudinal",
    prompt:
      "A companion betrays the party. In the aftermath, what do the others see on your face?",
    optionList: [
      {
        label:
          "Everything. My face, my voice, the whole room knows what I am feeling",
        weights: { E: 2 },
      },
      {
        label:
          "The real version. I share openly and want to hear how they feel too",
        weights: { E: 1, V: 1 },
      },
      {
        label: "Very little. Most of it stays inside where it belongs",
        weights: { E: -1, L: 1 },
      },
    ],
  },
  {
    id: "deep-ap-10",
    system: "attitudinal",
    prompt:
      "The party is offered two options: a warm inn with hot food and soft beds, or a shortcut through rough terrain that saves two days. What do you push for?",
    optionList: [
      {
        label: "The inn. A rested body is worth more than saved time",
        weights: { F: 2 },
      },
      {
        label: "Either works. I adapt easily and do not stress about comfort",
        weights: { F: 1, E: 1 },
      },
      {
        label:
          "The shortcut. Comfort is the least interesting thing to optimize for",
        weights: { V: 1, L: 1 },
      },
    ],
  },
  {
    id: "deep-ap-11",
    system: "attitudinal",
    prompt:
      "A new recruit questions your skill in front of the war-band. How do you respond?",
    optionList: [
      { label: "Double down. I know what I know", weights: { V: 2 } },
      {
        label: "Get curious. Pushback sharpens my thinking",
        weights: { L: 2 },
      },
      {
        label: "Pull back. It stings more than it should",
        weights: { E: 1, F: 1 },
      },
    ],
  },
  {
    id: "deep-ap-12",
    system: "attitudinal",
    prompt:
      "Your companions are describing each other around the campfire. When they get to you, what do they say?",
    optionList: [
      {
        label: "They know what they want and nothing gets in their way",
        weights: { V: 1 },
      },
      {
        label: "You can always count on them to think things through with you",
        weights: { L: 1 },
      },
      {
        label: "They feel everything so deeply it is almost frightening",
        weights: { E: 1 },
      },
      {
        label:
          "They take better care of themselves than anyone I have ever met",
        weights: { F: 1 },
      },
    ],
  },
] as const;
