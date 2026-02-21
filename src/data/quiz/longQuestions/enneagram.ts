import type { QuizQuestion } from "../types.ts";

// ============================================================
// ENNEAGRAM — 30 Questions (24 type + 6 instinct)
// ============================================================

export const DEEP_ENNEAGRAM_QUESTION_LIST: readonly QuizQuestion[] = [
  // --- Type questions (24) ---
  {
    id: "deep-enn-1",
    system: "enneagram",
    prompt:
      "Your party arrives at a village where a corrupt lord has been taxing peasants into starvation while feasting in his hall. What rises in you?",
    optionList: [
      {
        label:
          "Anger. This is wrong and someone needs to set it right, starting now",
        weights: { "1": 3, "8": 1 },
      },
      {
        label:
          "Compassion. I go straight to the hungry. They need help before they need justice",
        weights: { "2": 3, "9": 1 },
      },
      {
        label:
          "Opportunity. If I handle this well, these people will rally behind me",
        weights: { "3": 3, "8": 1 },
      },
      {
        label:
          "Sadness. The world keeps doing this and nobody seems to care enough to change it",
        weights: { "4": 3, "5": 1 },
      },
    ],
  },
  {
    id: "deep-enn-2",
    system: "enneagram",
    prompt:
      "Your party finds a hidden door behind a waterfall that leads deep underground. Strange light pulses from below. What do you do?",
    optionList: [
      {
        label:
          "Go alone. I want to understand what is down there before anyone else gets involved",
        weights: { "5": 3, "4": 1 },
      },
      {
        label:
          "Scout it carefully. Count exits, test the air, check for traps before anyone descends",
        weights: { "6": 3, "5": 1 },
      },
      {
        label:
          "This is exactly the kind of thing I live for. I am already climbing down",
        weights: { "7": 3, "3": 1 },
      },
      {
        label:
          "Secure the entrance. Whatever is down there, I want to control access to it",
        weights: { "8": 3, "1": 1 },
      },
    ],
  },
  {
    id: "deep-enn-3",
    system: "enneagram",
    prompt:
      "A massive storm forces the party to shelter in a cave for days. Supplies are low and morale is crumbling. What do you find yourself doing?",
    optionList: [
      {
        label:
          "Taking care of everyone. Making sure people eat, checking on the injured, keeping spirits up",
        weights: { "2": 3, "6": 1 },
      },
      {
        label:
          "Keeping the mood light. Telling stories, cracking jokes, finding small pleasures to pass the time",
        weights: { "7": 3, "9": 1 },
      },
      {
        label:
          "Rationing and planning. I calculate how long our supplies last and what we do when they run out",
        weights: { "5": 3, "9": 1 },
      },
      {
        label:
          "Taking charge. Someone needs to make decisions or this group falls apart",
        weights: { "8": 3, "3": 1 },
      },
    ],
  },
  {
    id: "deep-enn-4",
    system: "enneagram",
    prompt:
      "You have earned a reputation across the realm. What do people say about you when you are not in the room?",
    optionList: [
      {
        label:
          "That I hold myself and everyone else to a standard. People respect it even when they resent it",
        weights: { "1": 3, "6": 1 },
      },
      {
        label:
          "That I would give anything for the people I care about. They know I will always be there",
        weights: { "2": 3, "9": 1 },
      },
      {
        label:
          "That I get things done. Whatever the task, I find a way to come out on top",
        weights: { "3": 3, "7": 1 },
      },
      {
        label:
          "That there is something different about me. Something they cannot quite name but cannot ignore",
        weights: { "4": 3, "5": 1 },
      },
    ],
  },
  {
    id: "deep-enn-5",
    system: "enneagram",
    prompt:
      "The party is crossing a vast, unmapped wasteland. What keeps you going when everyone else wants to turn back?",
    optionList: [
      {
        label:
          "Vigilance. I am watching for threats every second. If something is coming, I will see it first",
        weights: { "6": 3, "1": 1 },
      },
      {
        label:
          "The finish line. I picture arriving, the recognition, proving I could do what others could not",
        weights: { "3": 3, "4": 1 },
      },
      {
        label:
          "Curiosity. No one has mapped this before. Every step is new information",
        weights: { "5": 3, "7": 1 },
      },
      {
        label:
          "The group. As long as we are together and moving, I am at peace with whatever happens",
        weights: { "9": 3, "2": 1 },
      },
    ],
  },
  {
    id: "deep-enn-6",
    system: "enneagram",
    prompt: "You lie awake in camp while the others sleep. What gnaws at you?",
    optionList: [
      {
        label: "That I have failed some standard I set for myself",
        weights: { "1": 3, "3": 1 },
      },
      { label: "That nobody truly sees who I am", weights: { "4": 3, "2": 1 } },
      {
        label: "That I will not be ready when disaster strikes",
        weights: { "6": 3, "5": 1 },
      },
      { label: "That life is passing me by", weights: { "7": 3, "3": 1 } },
    ],
  },
  {
    id: "deep-enn-7",
    system: "enneagram",
    prompt:
      "A companion has been secretly sending messages to the enemy. You discover the letters hidden in their pack. What happens next?",
    optionList: [
      {
        label:
          "I confront them in front of everyone. Betrayal gets answered publicly",
        weights: { "8": 3, "1": 1 },
      },
      {
        label:
          "I read every letter first. I need to understand the full scope before I act",
        weights: { "5": 3, "9": 1 },
      },
      {
        label:
          "I go to the rest of the group. We need to handle this together and keep the party intact",
        weights: { "2": 3, "6": 1 },
      },
      {
        label:
          "I focus on what we do now. The damage is done — brooding over it wastes time we do not have",
        weights: { "7": 3, "3": 1 },
      },
    ],
  },
  {
    id: "deep-enn-8",
    system: "enneagram",
    prompt:
      "Your party captures a scout who claims they were forced to serve the enemy. Some companions want to release them. Others say it is too risky. What do you argue?",
    optionList: [
      {
        label:
          "We cannot excuse what they did just because they were pressured. Actions have consequences",
        weights: { "1": 3, "5": 1 },
      },
      {
        label:
          "Release them. People do what they must to survive, and mercy costs us nothing here",
        weights: { "9": 3, "2": 1 },
      },
      {
        label:
          "Use them. A scout who knows the enemy layout is valuable — turn them to our side",
        weights: { "3": 3, "7": 1 },
      },
      {
        label:
          "I feel for them. Being trapped between two sides with no real choice is its own kind of suffering",
        weights: { "4": 3, "9": 1 },
      },
    ],
  },
  {
    id: "deep-enn-9",
    system: "enneagram",
    prompt: "The war is over. What does your life look like a year later?",
    optionList: [
      {
        label:
          "I am creating something — art, music, writing. The things I lived through demand expression",
        weights: { "4": 3, "7": 1 },
      },
      {
        label:
          "I have found a quiet place. Simple days, familiar routines, people I love nearby",
        weights: { "9": 3, "6": 1 },
      },
      {
        label:
          "I am helping rebuild. There are people who need someone, and I cannot sit still while they struggle",
        weights: { "2": 3, "1": 1 },
      },
      {
        label:
          "I am already on to the next thing. A new venture, a new challenge. I do not do idle well",
        weights: { "3": 3, "8": 1 },
      },
    ],
  },
  {
    id: "deep-enn-10",
    system: "enneagram",
    prompt:
      "You wake up one morning with a power you did not ask for — you can read the thoughts of anyone nearby. What is your first reaction?",
    optionList: [
      {
        label:
          "I need rules for this immediately. Using it carelessly would be a violation of everything I believe in",
        weights: { "1": 3, "6": 1 },
      },
      {
        label:
          "I think about the people closest to me. Will this change how they see me? Will it push them away?",
        weights: { "2": 3, "4": 1 },
      },
      {
        label:
          "I need to study this. How does it work? What are the limits? I will not use it until I understand it",
        weights: { "5": 3, "6": 1 },
      },
      {
        label:
          "I immediately worry about being trapped by it. What if I cannot turn it off?",
        weights: { "7": 3, "8": 1 },
      },
    ],
  },
  {
    id: "deep-enn-11",
    system: "enneagram",
    prompt:
      "You have been leading the party for months. A companion privately tells you that some members are unhappy with your leadership. How do you react?",
    optionList: [
      {
        label:
          "I examine my own conduct first. If I have been unfair or inconsistent, I need to correct it",
        weights: { "1": 3, "6": 1 },
      },
      {
        label:
          "It stings. I have given everything to this group. I want to know who is unhappy so I can make it right",
        weights: { "2": 3, "9": 1 },
      },
      {
        label:
          "I do not care about being liked. I care about keeping people alive. If that means being unpopular, fine",
        weights: { "8": 3, "3": 1 },
      },
      {
        label:
          "I step back and think. Maybe I have been too involved. Maybe the group needs a different structure entirely",
        weights: { "5": 3, "4": 1 },
      },
    ],
  },
  {
    id: "deep-enn-12",
    system: "enneagram",
    prompt:
      "Your party arrives at a fortified bridge held by a toll collector who demands an outrageous price. No one can afford it, and the river is too dangerous to cross any other way. What is your approach?",
    optionList: [
      {
        label:
          "Negotiate. I will find what they actually want and make a deal that works for both sides",
        weights: { "3": 3, "7": 1 },
      },
      {
        label:
          "Assess the situation first. Is the bridge even safe? Are there other crossings? I need information before I act",
        weights: { "6": 3, "5": 1 },
      },
      {
        label: "Push through. If they want to stop me, they can try",
        weights: { "8": 3, "7": 1 },
      },
      {
        label:
          "Talk to them like a person. Maybe they are scared or lonely out here. No need for a fight",
        weights: { "9": 3, "2": 1 },
      },
    ],
  },
  // --- Additional deep type questions (12) with disambiguators ---
  {
    id: "deep-enn-13",
    system: "enneagram",
    prompt:
      "The realm is fraying: crops fail, bandits roam freely, and the old laws are ignored. What is your gut response?",
    optionList: [
      {
        label: "Fix it. There is a right way things should be",
        weights: { "1": 3 },
      },
      {
        label: "Brace for impact. Disorder means threats are coming",
        weights: { "6": 3 },
      },
      {
        label: "Accept it. Forcing order causes more harm",
        weights: { "9": 3 },
      },
      {
        label: "Seize the moment. Chaos is where the bold thrive",
        weights: { "8": 3 },
      },
    ],
  },
  {
    id: "deep-enn-14",
    system: "enneagram",
    prompt:
      "You complete a legendary quest. A bard wants to write a song about you. What do you want them to capture?",
    optionList: [
      {
        label:
          "The victory itself. My name, my triumph, the moment I stood above the rest",
        weights: { "3": 3, "7": 1 },
      },
      {
        label:
          "The real me. Not the hero version, the true version, flaws and all",
        weights: { "4": 3 },
      },
      {
        label:
          "How I held power and used it. That people feared and respected what I built",
        weights: { "8": 3, "3": 1 },
      },
      {
        label:
          "The people I helped along the way. The song should be about them, not me",
        weights: { "2": 3, "1": 1 },
      },
    ],
  },
  {
    id: "deep-enn-15",
    system: "enneagram",
    prompt:
      "After a defeat, a companion sits apart from the group and says they have lost their sense of purpose. How do you respond?",
    optionList: [
      {
        label: "Take care of them. That is what I am here for",
        weights: { "2": 3 },
      },
      {
        label: "Share my own experience so they know they are not alone",
        weights: { "4": 3, "9": 1 },
      },
      {
        label: "Help them think through it clearly. Structure calms the chaos",
        weights: { "5": 3, "1": 1 },
      },
      {
        label: "Suggest an adventure. Action cures existential dread",
        weights: { "7": 3 },
      },
    ],
  },
  {
    id: "deep-enn-16",
    system: "enneagram",
    prompt:
      "A healer begs you to steal a rare herb from a merchant who is hoarding it while villagers die of plague. What do you do?",
    optionList: [
      {
        label:
          "Steal it. Some things are clearly right even when the rules say otherwise",
        weights: { "1": 3, "6": 1 },
      },
      {
        label:
          "Negotiate, bargain, or find another way to get the herb without making enemies",
        weights: { "3": 3, "8": 1 },
      },
      {
        label:
          "Talk to the merchant first. Maybe they are hoarding out of fear, not greed",
        weights: { "9": 3, "2": 1 },
      },
      {
        label:
          "I need the full picture before I act. What if the healer is wrong about the herb?",
        weights: { "5": 3 },
      },
    ],
  },
  // 1 vs 6 disambiguator
  {
    id: "deep-enn-17",
    system: "enneagram",
    prompt:
      "You discover a crack in the fortress wall that no one else has noticed. What is your reaction?",
    optionList: [
      {
        label: "It offends me. Things should work properly",
        weights: { "1": 3 },
      },
      {
        label: "It scares me. If the system fails, people get hurt",
        weights: { "6": 3 },
      },
      {
        label: "It is an opportunity to be the one who fixes it",
        weights: { "3": 3 },
      },
      {
        label: "Figures. Most things are held together by faith, not structure",
        weights: { "5": 3 },
      },
    ],
  },
  // 5 vs 9 disambiguator
  {
    id: "deep-enn-18",
    system: "enneagram",
    prompt:
      "You leave camp alone and walk into the wilderness. What are you looking for?",
    optionList: [
      {
        label: "Understanding. I need to figure things out before I re-engage",
        weights: { "5": 3 },
      },
      { label: "Quiet. I just need the noise to stop", weights: { "9": 3 } },
      {
        label: "Space to feel. I need solitude to process my emotions",
        weights: { "4": 3 },
      },
      { label: "Safety. I need to regroup", weights: { "6": 3 } },
    ],
  },
  // 3 vs 8 disambiguator
  {
    id: "deep-enn-19",
    system: "enneagram",
    prompt:
      "A party member challenges your call in front of the rest of the group during a tense march. What do you do?",
    optionList: [
      { label: "Prove them wrong. Results speak louder", weights: { "3": 3 } },
      {
        label: "Shut it down. Nobody undermines me without consequence",
        weights: { "8": 3 },
      },
      {
        label: "Correct them calmly. Truth is on my side",
        weights: { "1": 3 },
      },
      {
        label: "Deflect and redirect. Open conflict helps no one",
        weights: { "9": 3 },
      },
    ],
  },
  {
    id: "deep-enn-20",
    system: "enneagram",
    prompt:
      "A nightmare spirit traps you in a vision of your worst fear. What does it show you?",
    optionList: [
      {
        label:
          "A world where everyone moves on without me. I call out and no one turns around",
        weights: { "2": 3 },
      },
      {
        label: "A mirror that shows nothing. No face, no story, no self",
        weights: { "4": 3 },
      },
      {
        label:
          "A library where every book is blank. I reach for answers and find nothing",
        weights: { "5": 3 },
      },
      {
        label:
          "A room with no doors. Everything is fine, but I can never leave",
        weights: { "7": 3 },
      },
    ],
  },
  {
    id: "deep-enn-21",
    system: "enneagram",
    prompt:
      "A companion asks you to abandon your personal quest to help them with theirs. How do you feel?",
    optionList: [
      {
        label: "Happy to. Being needed is what I live for",
        weights: { "2": 3, "9": 1 },
      },
      {
        label: "Torn. I want to help, but my goals matter too",
        weights: { "3": 3, "6": 1 },
      },
      { label: "Resentful, but I do it anyway", weights: { "1": 3, "2": 1 } },
      {
        label: "No. My autonomy is not negotiable",
        weights: { "8": 3, "5": 1 },
      },
    ],
  },
  {
    id: "deep-enn-22",
    system: "enneagram",
    prompt:
      "The caravan is stuck in a sandstorm for three days. Everyone is sheltering in the wagons with nothing to do. How do you cope?",
    optionList: [
      {
        label:
          "I am going stir-crazy by hour two. I start inventing games, telling stories, anything to break the monotony",
        weights: { "7": 3, "3": 1 },
      },
      {
        label:
          "I welcome it. Stillness lets me sit with feelings I normally avoid",
        weights: { "4": 3, "5": 1 },
      },
      {
        label:
          "I find work. Mend gear, sharpen blades, organize supplies. There is always something to improve",
        weights: { "1": 3 },
      },
      {
        label: "I settle into the rhythm and drift. Three days will pass",
        weights: { "9": 3 },
      },
    ],
  },
  {
    id: "deep-enn-23",
    system: "enneagram",
    prompt:
      "The party makes camp in hostile territory. What lets you sleep at night?",
    optionList: [
      {
        label:
          "Knowing exactly who is on watch and that they will not let me down",
        weights: { "6": 3, "2": 1 },
      },
      {
        label:
          "My own preparation. I have studied the threats and I know what to expect",
        weights: { "5": 3, "1": 1 },
      },
      {
        label: "My own strength. If something comes, I can handle it myself",
        weights: { "8": 3, "6": 1 },
      },
      {
        label:
          "Knowing there is always a way out. I mapped three escape routes before sundown",
        weights: { "7": 3, "9": 1 },
      },
    ],
  },
  {
    id: "deep-enn-24",
    system: "enneagram",
    prompt:
      "An elder asks you to tell the story of your life so far. What thread runs through it?",
    optionList: [
      { label: "Constantly trying to do the right thing", weights: { "1": 3 } },
      {
        label: "The people I have helped, loved, or been shaped by",
        weights: { "2": 3, "9": 1 },
      },
      { label: "A search for who I really am", weights: { "4": 3, "5": 1 } },
      {
        label: "Always moving, always chasing the next thing",
        weights: { "7": 3, "3": 1 },
      },
    ],
  },
  // --- Instinct questions (6) ---
  {
    id: "deep-enn-25",
    system: "enneagram",
    prompt:
      "You survive a near-death experience. In the days that follow, what changes about how you live?",
    optionList: [
      {
        label:
          "I take better care of myself. I eat properly, rest when I need to, and stop ignoring what my body tells me",
        weights: { sp: 3 },
      },
      {
        label:
          "I reach out to people I have drifted from. Life is too short to let connections fade",
        weights: { so: 3 },
      },
      {
        label:
          "I hold the people I love closer. One bond, fully alive, matters more than anything else",
        weights: { sx: 3 },
      },
    ],
  },
  {
    id: "deep-enn-26",
    system: "enneagram",
    prompt:
      "Three companions each tell you why they keep fighting. Which reason resonates most with yours?",
    optionList: [
      {
        label:
          "I fight so I never have to go hungry, sleep in the cold, or wonder if I will survive another day",
        weights: { sp: 3 },
      },
      {
        label:
          "I fight so my people have a future. If the community falls, nothing I build alone matters",
        weights: { so: 3 },
      },
      {
        label:
          "I fight for the one person who made me feel like I belong in this world. Everything else is noise",
        weights: { sx: 3 },
      },
    ],
  },
  {
    id: "deep-enn-27",
    system: "enneagram",
    prompt:
      "An enchantress offers to amplify one part of your life beyond anything natural. What do you choose?",
    optionList: [
      {
        label:
          "My body. Perfect health, boundless stamina, complete physical security. I never worry about survival again",
        weights: { sp: 3 },
      },
      {
        label:
          "My influence. People listen when I speak, doors open, and I always have a place in any group",
        weights: { so: 3 },
      },
      {
        label:
          "My intensity. Every connection burns brighter, every bond cuts deeper. I feel fully alive",
        weights: { sx: 3 },
      },
    ],
  },
  {
    id: "deep-enn-28",
    system: "enneagram",
    prompt: "You walk into a new settlement. What do you notice first?",
    optionList: [
      {
        label:
          "Resources. Food, shelter, defensible positions. That is what keeps you alive",
        weights: { sp: 3 },
      },
      {
        label:
          "Social dynamics. Who runs this place, who are the outsiders. That tells you everything",
        weights: { so: 3 },
      },
      {
        label: "Whether anyone here sparks something in me",
        weights: { sx: 3 },
      },
    ],
  },
  {
    id: "deep-enn-29",
    system: "enneagram",
    prompt: "You meet three legendary warriors. Which one impresses you most?",
    optionList: [
      {
        label:
          "The one who survived alone in the wilds for a decade and came back unbroken",
        weights: { sp: 3 },
      },
      {
        label:
          "The one who walks into any hall and every sword rallies behind them",
        weights: { so: 3 },
      },
      {
        label:
          "The one who fights with such ferocity you cannot look away. Everything they do burns",
        weights: { sx: 3 },
      },
    ],
  },
  {
    id: "deep-enn-30",
    system: "enneagram",
    prompt:
      "The quest is over. Looking back, when did you feel most alive during the journey?",
    optionList: [
      {
        label:
          "The nights I had a warm fire, solid walls, and everything I needed within arm's reach",
        weights: { sp: 3 },
      },
      {
        label:
          "The moments the party moved as one. When we were part of something bigger than ourselves",
        weights: { so: 3 },
      },
      {
        label:
          "The moments of raw, unguarded connection with one person. Nothing else existed",
        weights: { sx: 3 },
      },
    ],
  },
] as const;
