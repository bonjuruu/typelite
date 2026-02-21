import type { QuizQuestion } from "../types.ts";

// ============================================================
// SOCIONICS - 22 Questions (8 quadra + 4 club + 10 Augusta ie)
// ============================================================
// Quadra values (8), Club (4), Socionics-specific information elements (10).
// ie_Ti, ie_Te, ie_Ne are cross-scored from MBTI cognitive function answers
// (these overlap strongly between Jung/Beebe and Augusta).
// ie_Se, ie_Si, ie_Ni, ie_Fe, ie_Fi use Socionics-specific questions
// that test Augusta's divergent definitions.

export const DEEP_SOCIONICS_QUESTION_LIST: readonly QuizQuestion[] = [
  // --- Quadra values (8) ---
  {
    id: "deep-soc-1",
    system: "socionics",
    prompt:
      "Your party has been traveling together for weeks. One evening, the group falls into its natural rhythm around the fire. What does that rhythm look like?",
    optionList: [
      {
        label:
          "Swapping theories and riddles, debating ideas just for the joy of it. Someone keeps making everyone laugh",
        weights: { Alpha: 3 },
      },
      {
        label:
          "Recounting battles and rallying around the next mission. There is fire in every voice",
        weights: { Beta: 3 },
      },
      {
        label:
          "Everyone working on their own thing, occasionally comparing progress. Respect, not neediness",
        weights: { Gamma: 3 },
      },
      {
        label:
          "Quiet conversations in pairs. Someone is mending gear while someone else hums a tune. It is gentle",
        weights: { Delta: 3 },
      },
    ],
  },
  {
    id: "deep-soc-2",
    system: "socionics",
    prompt:
      "A new territory has been claimed and the party must decide how to govern the settlers who follow. What structure do you push for?",
    optionList: [
      {
        label:
          "Open councils where anyone can speak and ideas are tested freely before decisions are made",
        weights: { Alpha: 3 },
      },
      {
        label:
          "A strong central leader with a clear chain of command. Order requires authority",
        weights: { Beta: 3 },
      },
      {
        label:
          "Let the market decide. People who produce results rise naturally",
        weights: { Gamma: 3 },
      },
      {
        label:
          "Small, self-governing communities where people know and take care of each other",
        weights: { Delta: 3 },
      },
    ],
  },
  {
    id: "deep-soc-3",
    system: "socionics",
    prompt:
      "You visit four legendary guilds, each with a different culture. Which one feels like home?",
    optionList: [
      {
        label:
          "The Explorers' Lodge - walls covered in maps and curiosities, members debating wild theories over wine",
        weights: { Alpha: 3 },
      },
      {
        label:
          "The Iron Order - a disciplined brotherhood bound by oaths, purpose, and shared sacrifice",
        weights: { Beta: 3 },
      },
      {
        label:
          "The Merchant Princes - independent operators who respect skill, reward ambition, and waste no time on sentiment",
        weights: { Gamma: 3 },
      },
      {
        label:
          "The Hearthkeepers - craftspeople and healers who build things that last and take care of their own",
        weights: { Delta: 3 },
      },
    ],
  },
  {
    id: "deep-soc-4",
    system: "socionics",
    prompt:
      "The party must cross a cursed forest. Rumors say it drives groups apart with paranoia and mistrust. What do you suggest to hold the group together?",
    optionList: [
      {
        label:
          "Stay talking. Keep the conversation going, keep ideas flowing. Silence is where the curse creeps in",
        weights: { Alpha: 3 },
      },
      {
        label:
          "Strengthen the hierarchy. Everyone knows their role, follows the leader, no hesitation",
        weights: { Beta: 3 },
      },
      {
        label:
          "Trust each person to handle themselves. Micromanaging will make the paranoia worse",
        weights: { Gamma: 3 },
      },
      {
        label:
          "Check in on each other quietly. Small gestures of care keep people grounded",
        weights: { Delta: 3 },
      },
    ],
  },
  {
    id: "deep-soc-5",
    system: "socionics",
    prompt:
      "You are building a new settlement from scratch. What do you prioritize in the first month?",
    optionList: [
      {
        label:
          "A gathering hall. Somewhere people can share ideas, debate, and enjoy each other's company",
        weights: { Alpha: 3 },
      },
      {
        label:
          "Walls and a watchtower. Security first, and a place to rally when threats come",
        weights: { Beta: 3 },
      },
      {
        label:
          "A marketplace. Let people trade, compete, and build wealth. Prosperity draws more settlers",
        weights: { Gamma: 3 },
      },
      {
        label:
          "Homes and gardens. People need comfort and roots before they can do anything else",
        weights: { Delta: 3 },
      },
    ],
  },
  {
    id: "deep-soc-6",
    system: "socionics",
    prompt:
      "A neighboring kingdom sends an envoy offering an alliance. What concerns you most about the terms?",
    optionList: [
      {
        label:
          "Whether we keep intellectual freedom. I will not sign away our right to question and innovate",
        weights: { Alpha: 3 },
      },
      {
        label:
          "Whether we maintain our sovereignty. An alliance that weakens our authority is a trap",
        weights: { Beta: 3 },
      },
      {
        label:
          "Whether the deal is profitable. Alliances should make both sides stronger, not create dependence",
        weights: { Gamma: 3 },
      },
      {
        label:
          "Whether it respects our people. A treaty that disrupts ordinary lives is not worth the parchment",
        weights: { Delta: 3 },
      },
    ],
  },
  {
    id: "deep-soc-7",
    system: "socionics",
    prompt: "The party wins a great victory. How does the celebration unfold?",
    optionList: [
      {
        label:
          "A feast of ideas and laughter. People toast, tell stories, and argue philosophy until dawn",
        weights: { Alpha: 3 },
      },
      {
        label:
          "A passionate rally. Speeches, songs of glory, and oaths sworn for the battles ahead",
        weights: { Beta: 3 },
      },
      {
        label:
          "Individual recognition. Each person's contribution is acknowledged and rewarded on merit",
        weights: { Gamma: 3 },
      },
      {
        label:
          "A quiet gathering. Close friends share a meal, grateful to be alive and together",
        weights: { Delta: 3 },
      },
    ],
  },
  {
    id: "deep-soc-8",
    system: "socionics",
    prompt:
      "You have the chance to apprentice under one of four legendary figures. Who do you choose?",
    optionList: [
      {
        label:
          'The Philosopher-Mage - brilliant and playful, always asking "what if?" and delighting in the impossible',
        weights: { Alpha: 3 },
      },
      {
        label:
          "The War-Marshal - commanding and visionary, who turned a ragged rebellion into an empire through sheer force of will",
        weights: { Beta: 3 },
      },
      {
        label:
          "The Self-Made King - who started with nothing, built a fortune through cunning and skill, and answers to no one",
        weights: { Gamma: 3 },
      },
      {
        label:
          "The Village Elder - gentle and wise, who healed a broken community and taught people to sustain themselves",
        weights: { Delta: 3 },
      },
    ],
  },
  // --- Club (4) ---
  {
    id: "deep-soc-9",
    system: "socionics",
    prompt: "In a new settlement, what role would you most naturally fill?",
    optionList: [
      {
        label:
          "Scholar or strategist, analyzing problems and finding solutions",
        weights: { Researcher: 3 },
      },
      {
        label:
          "Counselor or diplomat, managing relationships and social harmony",
        weights: { Social: 3 },
      },
      {
        label:
          "Builder or craftsman, making things work and solving practical problems",
        weights: { Practical: 3 },
      },
      {
        label: "Healer or teacher, nurturing others and helping them grow",
        weights: { Humanitarian: 3 },
      },
    ],
  },
  {
    id: "deep-soc-10",
    system: "socionics",
    prompt:
      "When the party needs to solve a complex problem, what is your contribution?",
    optionList: [
      {
        label:
          "Theoretical insight. I see the underlying structure others miss",
        weights: { Researcher: 3 },
      },
      {
        label:
          "Social intelligence. I know who to talk to and how to navigate people",
        weights: { Social: 3 },
      },
      {
        label:
          "Hands-on execution. I build the thing, fix the thing, make it real",
        weights: { Practical: 3 },
      },
      {
        label:
          "Emotional support. I keep morale up and make sure no one is forgotten",
        weights: { Humanitarian: 3 },
      },
    ],
  },
  {
    id: "deep-soc-11",
    system: "socionics",
    prompt:
      "After a long campaign, what kind of contribution made you feel most fulfilled?",
    optionList: [
      {
        label:
          "The discoveries. Deciphering the map, cracking the riddle, understanding the enemy",
        weights: { Researcher: 3 },
      },
      {
        label:
          "Holding the group together. Organizing, rallying, keeping everyone connected",
        weights: { Social: 3 },
      },
      {
        label:
          "Building and fixing things. The bridge I repaired, the trap I built, the blade I forged",
        weights: { Practical: 3 },
      },
      {
        label:
          "Helping individuals. The wounds I tended, the lessons I taught, the people I guided",
        weights: { Humanitarian: 3 },
      },
    ],
  },
  {
    id: "deep-soc-12",
    system: "socionics",
    prompt:
      "If your companions had to describe what you bring to the party in one phrase, what would they say?",
    optionList: [
      {
        label: "They see the patterns no one else does",
        weights: { Researcher: 3 },
      },
      {
        label: "They know how to read a room and move people",
        weights: { Social: 3 },
      },
      {
        label: "They get things done. No fuss, no wasted effort",
        weights: { Practical: 3 },
      },
      {
        label: "They take care of everyone. No one gets left behind",
        weights: { Humanitarian: 3 },
      },
    ],
  },
  // --- Information Elements: Se (2) - Augusta's VOLITIONAL sensing ---
  // Power dynamics, force, "who will overcome whom", claiming/defending territory.
  // Diverges from MBTI Se (concrete sensory immersion).
  {
    id: "deep-soc-13",
    system: "socionics",
    prompt:
      "Two merchants are arguing over a stall in the market. One is bigger and louder; the other is calmer but has more allies watching from nearby. You are passing by. What catches your attention?",
    optionList: [
      {
        label:
          "Who would win if this escalated. The bigger one has presence, but the calm one has backup. I am reading the balance of force",
        weights: { ie_Se: 3 },
      },
      {
        label:
          "The crowd's reaction. Some people are tense, others entertained. The emotional temperature of the whole scene pulls me in",
        weights: { ie_Fe: 3, ie_Ni: 1 },
      },
      {
        label:
          "Where this is heading. I can already see how this ends. One of them is about to overplay their hand",
        weights: { ie_Ni: 3, ie_Ti: 1 },
      },
      {
        label:
          "Who I would side with. One of them feels right to me and the other feels off. I know immediately, even without all the facts",
        weights: { ie_Fi: 3, ie_Si: 1 },
      },
    ],
  },
  {
    id: "deep-soc-14",
    system: "socionics",
    prompt:
      "A newcomer to your group starts quietly taking on leadership tasks nobody assigned them: organizing supplies, giving orders, rearranging the watch schedule. What do you do?",
    optionList: [
      {
        label:
          "Push back directly. If they want authority, they need to earn it from me, not just take it",
        weights: { ie_Se: 3 },
      },
      {
        label:
          "Watch and wait. If they are competent, this might work out. I will step in only when the moment is right",
        weights: { ie_Ni: 3, ie_Te: 1 },
      },
      {
        label:
          "Bring it up with the group. This affects everyone, and people should voice how they feel about it",
        weights: { ie_Fe: 3, ie_Se: 1 },
      },
      {
        label:
          "Let it go unless it disrupts what is already working. Stability matters more than who is in charge",
        weights: { ie_Si: 3, ie_Ne: 1 },
      },
    ],
  },
  // --- Information Elements: Si (2) - Augusta's EXPERIENTIAL sensing ---
  // Comfort, bodily wellbeing, aesthetic harmony, quality of physical exchange with environment.
  // Diverges from MBTI Si (subjective psychic impression of sensation).
  {
    id: "deep-soc-15",
    system: "socionics",
    prompt:
      "After a grueling week of travel, your group finds an inn. Everyone rushes to the tavern to celebrate. What do you do first?",
    optionList: [
      {
        label:
          "Find my room and get settled. Wash up, lay out clean clothes, sort the bed. I need my body comfortable before I can enjoy anything else",
        weights: { ie_Si: 3 },
      },
      {
        label:
          "Join the celebration. The noise, the drink, the crowd. After a week like that, I want to feel the intensity of being alive",
        weights: { ie_Se: 3 },
      },
      {
        label:
          "Head to the tavern for the people, not the drinks. Being around friends who are happy fills me back up",
        weights: { ie_Fe: 3, ie_Si: 1 },
      },
      {
        label:
          "Find a quiet corner. I need to sit with my thoughts and decompress before I do anything social",
        weights: { ie_Ni: 2, ie_Ne: 1 },
      },
    ],
  },
  {
    id: "deep-soc-16",
    system: "socionics",
    prompt:
      "You are setting up a war table for a long campaign. What do you focus on?",
    optionList: [
      {
        label:
          "Getting the feel right. The chair, the lighting, the temperature. If my body is not at ease, my mind will not work either",
        weights: { ie_Si: 3 },
      },
      {
        label:
          "I do not fuss with the space. I clear my head and start. The work itself pulls me in regardless of surroundings",
        weights: { ie_Ni: 3, ie_Ti: 1 },
      },
      {
        label:
          "Making it functional. Everything I need within arm's reach, nothing extra in the way",
        weights: { ie_Se: 2, ie_Te: 1 },
      },
      {
        label:
          "I want something stimulating around me. Art on the walls, music playing, a window with a view. The space should have energy",
        weights: { ie_Se: 3, ie_Ne: 1 },
      },
    ],
  },
  // --- Information Elements: Ni (2) - Augusta's TEMPORAL intuition ---
  // Causal sequencing, timing, felt sense of whether the moment is right.
  // Diverges from MBTI Ni (archetypal vision, perceiving the unconscious).
  {
    id: "deep-soc-17",
    system: "socionics",
    prompt:
      "Your group has been planning a raid for weeks. The morning of, your gut tells you today is not the day, even though nothing has visibly changed. What do you do?",
    optionList: [
      {
        label:
          "Call it off, or at least delay. I have learned the hard way that when something feels mistimed, forcing it makes everything worse",
        weights: { ie_Ni: 3 },
      },
      {
        label:
          "Go anyway. Hesitation kills momentum, and we have prepared for this. You cannot wait for a feeling to pass",
        weights: { ie_Se: 3 },
      },
      {
        label:
          "Check the plan one more time. If the variables still add up, we go. A feeling does not override preparation",
        weights: { ie_Se: 2, ie_Te: 1 },
      },
      {
        label:
          "Talk to the others. Maybe someone else senses it too, or maybe they will help me see what I am picking up on",
        weights: { ie_Fe: 3, ie_Ne: 1 },
      },
    ],
  },
  {
    id: "deep-soc-18",
    system: "socionics",
    prompt:
      "A companion is about to leave the party to pursue a dangerous quest alone. How do you think about what to tell them?",
    optionList: [
      {
        label:
          "I walk the chain forward in my mind. If they do this, then that follows, and that leads to... I can see where this road ends before they take the first step",
        weights: { ie_Ni: 3 },
      },
      {
        label:
          "I think about all the different ways it could unfold. There is no single outcome, so I help them see the range of what is possible",
        weights: { ie_Fe: 2, ie_Ne: 1 },
      },
      {
        label:
          "I think about people I know who made similar choices. Real examples are worth more than speculation",
        weights: { ie_Si: 3, ie_Te: 1 },
      },
      {
        label:
          "I tell them to trust what feels right and commit fully. Overthinking the future just leads to paralysis",
        weights: { ie_Se: 3, ie_Fi: 1 },
      },
    ],
  },
  // --- Information Elements: Fe (2) - Augusta's ETHICS OF EMOTIONS ---
  // Emotional energy dynamics, actively inducing moods, changing emotional temperature.
  // Diverges from MBTI Fe (adjusting feeling-judgment to social values).
  {
    id: "deep-soc-19",
    system: "socionics",
    prompt:
      "Your travel party is exhausted and morale is collapsing. Nobody is fighting, but nobody is talking either. The silence feels heavy. What do you do?",
    optionList: [
      {
        label:
          "Break the silence. I start singing, tell a ridiculous story, or pick a mock argument with someone. The mood needs to move, and I can make that happen",
        weights: { ie_Fe: 3 },
      },
      {
        label:
          "Sit next to the person who looks worst and just be with them. I cannot change the whole group, but I can be real with one person",
        weights: { ie_Fi: 3, ie_Si: 1 },
      },
      {
        label:
          "Call a halt and address the practical cause. Are we lost? Hungry? Low on water? Fix the problem and the mood fixes itself",
        weights: { ie_Se: 2, ie_Te: 1 },
      },
      {
        label:
          "Leave it alone. People process at their own speed. Performing cheer right now would feel hollow and make it worse",
        weights: { ie_Ni: 3, ie_Ti: 1 },
      },
    ],
  },
  {
    id: "deep-soc-20",
    system: "socionics",
    prompt:
      "The feast after a victory started lively but has gone flat. People are drifting off to their tents. How do you respond?",
    optionList: [
      {
        label:
          "I turn it around. I shift the conversation, raise the energy, pull people into something new. I can feel what the room needs and I give it",
        weights: { ie_Fe: 3 },
      },
      {
        label:
          "The flat mood settles into me and I cannot shake it. Even if I try to stay upbeat, their energy drags me down",
        weights: { ie_Fi: 3, ie_Ni: 1 },
      },
      {
        label:
          "I notice the shift but stay in my own headspace. I am not going to chase a mood I did not create",
        weights: { ie_Ni: 2, ie_Ti: 1 },
      },
      {
        label:
          "If nothing interesting is happening, I suggest we do something instead of just standing around. Activity beats atmosphere",
        weights: { ie_Se: 2, ie_Te: 1 },
      },
    ],
  },
  // --- Information Elements: Fi (2) - Augusta's ETHICS OF RELATIONS ---
  // Relational distances, attraction/repulsion, discrete categories of connection (friend/enemy/ally).
  // Diverges from MBTI Fi (deep invisible inner valuation, archetypal depth).
  {
    id: "deep-soc-21",
    system: "socionics",
    prompt:
      "Three new recruits join your war-band. After ten minutes around the fire, you already feel differently about each of them. What is going on?",
    optionList: [
      {
        label:
          "I have already sorted them. One feels like a potential ally, one is neutral, one I want distance from. I do not choose this. It just happens, like a compass settling",
        weights: { ie_Fi: 3 },
      },
      {
        label:
          "I have been watching how they interact with the room. The way someone treats a stranger tells me everything about what to expect",
        weights: { ie_Fe: 3, ie_Se: 1 },
      },
      {
        label:
          "I am sizing them up by what they have actually said and done. Talk is cheap. I am watching for competence and follow-through",
        weights: { ie_Se: 2, ie_Te: 1 },
      },
      {
        label:
          "I am keeping all doors open. Ten minutes is not enough to pin someone down. People reveal themselves over time",
        weights: { ie_Fe: 2, ie_Ne: 1 },
      },
    ],
  },
  {
    id: "deep-soc-22",
    system: "socionics",
    prompt:
      "If you drew a map of every companion and ally you have known, what would it look like?",
    optionList: [
      {
        label:
          "Concentric circles. Inner ring, outer ring, and people I keep outside the walls entirely. Everyone has a place and I know exactly where they stand",
        weights: { ie_Fi: 3 },
      },
      {
        label:
          "A web. Everyone connects to everyone else, and I think about how the whole network functions: who brings energy, who creates tension",
        weights: { ie_Fe: 3, ie_Ne: 1 },
      },
      {
        label:
          "A timeline. The people who matter most are the ones I have been through things with. Shared history is what makes a bond real",
        weights: { ie_Si: 3, ie_Fi: 1 },
      },
      {
        label:
          "A trajectory. I care most about where we are going together, not where we have been",
        weights: { ie_Ni: 3, ie_Te: 1 },
      },
    ],
  },
] as const;
