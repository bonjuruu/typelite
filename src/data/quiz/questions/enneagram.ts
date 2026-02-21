import type { QuizQuestion } from "../types.ts";

// ============================================================
// ENNEAGRAM - 15 Weighted Accumulator Questions
// ============================================================
// 12 questions score across types (keys '1'-'9').
// 3 questions score instincts (keys 'sp', 'so', 'sx').
// Primary weight +3, secondary weight +1.

export const ENNEAGRAM_QUESTION_LIST: readonly QuizQuestion[] = [
  // --- Type questions (12) ---
  {
    id: "enn-1",
    system: "enneagram",
    prompt:
      "A warlord has slaughtered innocents and sits untouched on a gilded seat. What stirs in you first?",
    optionList: [
      {
        label: "Cold fury. Someone needs to answer for this",
        weights: { "1": 3, "8": 1 },
      },
      {
        label: "Grief. Someone needs to tend to the wounded",
        weights: { "2": 3, "9": 1 },
      },
      {
        label: "Calculation. How can I use this moment?",
        weights: { "3": 3, "8": 1 },
      },
      {
        label: "A hollow ache. This world is broken",
        weights: { "4": 3, "5": 1 },
      },
    ],
  },
  {
    id: "enn-2",
    system: "enneagram",
    prompt:
      "You discover a sealed chamber no one else knows about. What do you do?",
    optionList: [
      {
        label: "Study it alone. No need to share this yet",
        weights: { "5": 3, "4": 1 },
      },
      {
        label:
          "Map the exits and check for traps. I need to know what we are walking into",
        weights: { "6": 3, "5": 1 },
      },
      {
        label: "Explore. Forbidden places have the best stories",
        weights: { "7": 3, "3": 1 },
      },
      { label: "Claim it. This is mine now", weights: { "8": 3, "1": 1 } },
    ],
  },
  {
    id: "enn-3",
    system: "enneagram",
    prompt: "Your party faces certain doom. What role do you fall into?",
    optionList: [
      {
        label: "Holding the line. Nobody falls on my watch",
        weights: { "2": 3, "6": 1 },
      },
      {
        label: "Finding the way out. There is always another option",
        weights: { "7": 3, "9": 1 },
      },
      {
        label: "Staying calm and observing. Panic helps no one",
        weights: { "5": 3, "9": 1 },
      },
      {
        label: "Charging forward. Hesitation kills",
        weights: { "8": 3, "3": 1 },
      },
    ],
  },
  {
    id: "enn-4",
    system: "enneagram",
    prompt: "A mentor offers you their legacy. What form does it take?",
    optionList: [
      {
        label: "A code of honor that outlasts any sword",
        weights: { "1": 3, "6": 1 },
      },
      {
        label:
          "A network of allies who trust each other. That is worth more than gold",
        weights: { "2": 3, "9": 1 },
      },
      {
        label: "A title and reputation the world remembers",
        weights: { "3": 3, "7": 1 },
      },
      {
        label: "A unique art only I could continue",
        weights: { "4": 3, "5": 1 },
      },
    ],
  },
  {
    id: "enn-5",
    system: "enneagram",
    prompt:
      "You are granted one enchantment that lasts a lifetime. Which do you choose?",
    optionList: [
      {
        label: "Always knowing when someone is lying",
        weights: { "6": 3, "1": 1 },
      },
      {
        label: "Never being forgotten by anyone I meet",
        weights: { "3": 3, "4": 1 },
      },
      {
        label:
          "Absorbing any text or skill instantly. I want to know everything",
        weights: { "5": 3, "7": 1 },
      },
      {
        label: "Calming any conflict just by being there",
        weights: { "9": 3, "2": 1 },
      },
    ],
  },
  {
    id: "enn-6",
    system: "enneagram",
    prompt: "What haunts you most in the small hours?",
    optionList: [
      {
        label: "That I have failed some standard I set for myself",
        weights: { "1": 3, "3": 1 },
      },
      { label: "That no one truly sees who I am", weights: { "4": 3, "2": 1 } },
      {
        label: "That I will be unprepared when it matters",
        weights: { "6": 3, "5": 1 },
      },
      { label: "That life is passing me by", weights: { "7": 3, "3": 1 } },
    ],
  },
  {
    id: "enn-7",
    system: "enneagram",
    prompt: "An ally betrays the party. What is your first impulse?",
    optionList: [
      { label: "Confront them. Now", weights: { "8": 3, "1": 1 } },
      {
        label: "Understand why. There has to be a reason",
        weights: { "5": 3, "9": 1 },
      },
      {
        label: "Rally the others. The group has to stay together",
        weights: { "2": 3, "6": 1 },
      },
      {
        label: "Move on. Dwelling on it only slows us down",
        weights: { "7": 3, "3": 1 },
      },
    ],
  },
  {
    id: "enn-8",
    system: "enneagram",
    prompt:
      "You find a village worshipping a false idol that promises salvation. What do you do?",
    optionList: [
      {
        label: "Expose the lie. Truth over comfort",
        weights: { "1": 3, "5": 1 },
      },
      {
        label: "Guide them gently without shattering their hope",
        weights: { "9": 3, "2": 1 },
      },
      {
        label: "Offer them something better to believe in",
        weights: { "3": 3, "7": 1 },
      },
      {
        label: "Let them be. Everyone copes differently",
        weights: { "4": 3, "9": 1 },
      },
    ],
  },
  {
    id: "enn-9",
    system: "enneagram",
    prompt: "In a rare moment of peace, what draws you?",
    optionList: [
      {
        label: "Making something beautiful. That is when I feel real",
        weights: { "4": 3, "7": 1 },
      },
      {
        label: "Sitting with someone I trust, saying nothing",
        weights: { "9": 3, "6": 1 },
      },
      {
        label: "Helping someone nearby. That is where my hands belong",
        weights: { "2": 3, "1": 1 },
      },
      {
        label: "Planning the next move. Stillness makes me restless",
        weights: { "3": 3, "8": 1 },
      },
    ],
  },
  {
    id: "enn-10",
    system: "enneagram",
    prompt: "You find a weapon of terrible power. What concerns you most?",
    optionList: [
      {
        label: "That it might corrupt my principles",
        weights: { "1": 3, "6": 1 },
      },
      {
        label: "That it might push people away from me",
        weights: { "2": 3, "4": 1 },
      },
      {
        label: "That I might not understand it before I need it",
        weights: { "5": 3, "6": 1 },
      },
      {
        label: "That it might bind me. Power has a cost",
        weights: { "7": 3, "8": 1 },
      },
    ],
  },
  {
    id: "enn-11",
    system: "enneagram",
    prompt: "You are offered a seat of power. What kind of ruler would you be?",
    optionList: [
      {
        label: "Fair and principled. The law is the law",
        weights: { "1": 3, "6": 1 },
      },
      {
        label: "Beloved. My people would never want for anything",
        weights: { "2": 3, "9": 1 },
      },
      {
        label: "Feared and respected. Strength keeps the peace",
        weights: { "8": 3, "3": 1 },
      },
      {
        label: "Absent. I would rather advise from the shadows",
        weights: { "5": 3, "4": 1 },
      },
    ],
  },
  {
    id: "enn-12",
    system: "enneagram",
    prompt: "A dragon blocks the only path forward. How do you handle it?",
    optionList: [
      {
        label: "Negotiate. Every creature has a price",
        weights: { "3": 3, "7": 1 },
      },
      {
        label: "Study its patterns, then strike the weakness",
        weights: { "6": 3, "5": 1 },
      },
      {
        label: "Charge in. Overthinking gets people killed",
        weights: { "8": 3, "7": 1 },
      },
      {
        label: "Find common ground. Even a dragon has a story",
        weights: { "9": 3, "2": 1 },
      },
    ],
  },
  // --- Instinct questions (3) ---
  {
    id: "enn-13",
    system: "enneagram",
    prompt: "One night before the final battle. How do you spend it?",
    optionList: [
      {
        label: "Checking supplies, sharpening blades, reinforcing armor",
        weights: { sp: 3 },
      },
      {
        label: "With the group. Sharing stories, strengthening bonds",
        weights: { so: 3 },
      },
      {
        label: "With the one person who matters most. Nothing else comes close",
        weights: { sx: 3 },
      },
    ],
  },
  {
    id: "enn-14",
    system: "enneagram",
    prompt: "What would make you abandon a quest?",
    optionList: [
      { label: "Certain death with no chance of survival", weights: { sp: 3 } },
      {
        label: "Innocents paying the price for my choices",
        weights: { so: 3 },
      },
      {
        label: "The one person I care about asking me to stop",
        weights: { sx: 3 },
      },
    ],
  },
  {
    id: "enn-15",
    system: "enneagram",
    prompt: "A curse strips away one thing. Which loss hits you hardest?",
    optionList: [
      {
        label: "My health and physical safety. Without that I have nothing",
        weights: { sp: 3 },
      },
      {
        label: "My standing among allies. Forgotten, cast out, erased",
        weights: { so: 3 },
      },
      {
        label: "My deepest bond. The connection that makes me feel alive",
        weights: { sx: 3 },
      },
    ],
  },
] as const;
