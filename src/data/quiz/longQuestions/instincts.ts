import type { InstinctCenter } from "../../../engine/types/index.ts";
import type { QuizQuestion } from "../types.ts";

// ============================================================
// EXPANDED INSTINCTS - 18 Questions (6 center + 12 realm)
// ============================================================

export const DEEP_INSTINCT_CENTER_QUESTION_LIST: readonly QuizQuestion[] = [
  {
    id: "deep-inst-1",
    system: "instincts",
    prompt:
      "You have lost everything: your home, your allies, your name. You stand at a crossroads with nothing. What pulls you forward?",
    optionList: [
      {
        label:
          "The need to survive. I will rebuild from the ground up because my body refuses to stop",
        weights: { SUR: 3 },
      },
      {
        label:
          "The need to find someone. I cannot do this alone, and there must be someone out there",
        weights: { INT: 3 },
      },
      {
        label:
          "The need to understand why. If I can find meaning in this, I can endure anything",
        weights: { PUR: 3 },
      },
    ],
  },
  {
    id: "deep-inst-2",
    system: "instincts",
    prompt:
      "You wander into a forgotten temple. Three shrines stand before you, each radiating a different power. Which draws you?",
    optionList: [
      {
        label:
          "The shrine of iron and stone. You feel your body strengthen, your senses sharpen. Nothing could break you here",
        weights: { SUR: 3 },
      },
      {
        label:
          "The shrine of woven threads. Every bond you have ever formed pulses with warmth, as if every person who ever mattered is standing behind you",
        weights: { INT: 3 },
      },
      {
        label:
          "The shrine of a single burning star. A vision of your true path unfolds, clear and undeniable. You know exactly why you exist",
        weights: { PUR: 3 },
      },
    ],
  },
  {
    id: "deep-inst-3",
    system: "instincts",
    prompt:
      "A dark mage offers you a bargain: they will spare your companions, but you must endure one curse for a year. Which do you dread most?",
    optionList: [
      {
        label:
          "A body that weakens daily. Unable to run, fight, or sustain myself",
        weights: { SUR: 3 },
      },
      {
        label: "Total isolation. No one can see or hear me for an entire year",
        weights: { INT: 3 },
      },
      {
        label:
          "A fog that erases all sense of purpose. I go through the motions but nothing matters",
        weights: { PUR: 3 },
      },
    ],
  },
  {
    id: "deep-inst-4",
    system: "instincts",
    prompt:
      "You have felt truly alive only a handful of times on your journey. What was happening?",
    optionList: [
      {
        label:
          "My body was strong, my camp was secure, and I had everything I needed within arm's reach. The world could not touch me",
        weights: { SUR: 3 },
      },
      {
        label:
          "I was in deep connection with someone. Walls down, nothing between us. The rest of the world fell away and I was fully seen",
        weights: { INT: 3 },
      },
      {
        label:
          "I was on the edge of something meaningful. A discovery, a realization, a moment where my existence felt like it had direction and weight",
        weights: { PUR: 3 },
      },
    ],
  },
  {
    id: "deep-inst-5",
    system: "instincts",
    prompt:
      "A siege destroys everything: your home, your bonds, your sense of direction. What do you rebuild first?",
    optionList: [
      {
        label:
          "My material foundation. Shelter, food, defenses. Without a body that is safe and fed, nothing else can follow",
        weights: { SUR: 3 },
      },
      {
        label:
          "My relationships. I seek out whoever survived, or I find new people to trust. I cannot rebuild alone",
        weights: { INT: 3 },
      },
      {
        label:
          "My sense of purpose. I need to know why I am rebuilding before I lay the first stone",
        weights: { PUR: 3 },
      },
    ],
  },
  {
    id: "deep-inst-6",
    system: "instincts",
    prompt:
      "A spirit reads your soul and names the thing you have spent your whole life trying to fill. What does it say?",
    optionList: [
      {
        label:
          "You have never felt truly safe. You are always bracing for what comes next",
        weights: { SUR: 3 },
      },
      {
        label:
          "You have never felt truly held. You move through the world without real roots in anyone",
        weights: { INT: 3 },
      },
      {
        label:
          "You have never felt truly significant. You fear your life will pass without weight or direction",
        weights: { PUR: 3 },
      },
    ],
  },
] as const;

// Realm questions: 4 per center (12 total, dynamically loaded after center determined)

const DEEP_SUR_REALM_QUESTION_LIST: readonly QuizQuestion[] = [
  {
    id: "deep-inst-sur-1",
    system: "instincts",
    prompt:
      "Your party is crossing a mountain pass when an avalanche buries the trail behind you. Supplies are low, the cold is brutal, and the way forward is uncertain. How do you lead?",
    optionList: [
      {
        label:
          "I take point, break trail through the snow, and set the pace. My body can handle more than the others think. We stop when I stop",
        weights: { FD: 3 },
      },
      {
        label:
          "We find shelter immediately. A cave, an overhang, anything. We do not move again until I have scouted the route ahead and confirmed it is passable",
        weights: { SY: 3 },
      },
      {
        label:
          "I inventory everything we have: food, fuel, clothing. I calculate how many days we can last and ration accordingly. Panic is the enemy, not the mountain",
        weights: { SM: 3 },
      },
    ],
  },
  {
    id: "deep-inst-sur-2",
    system: "instincts",
    prompt:
      "You wake in the middle of the night to find your camp surrounded by wolves. The fire is dying and your companions are asleep. What do you do?",
    optionList: [
      {
        label:
          "Stand up, grab a torch, and face them down. Wolves respect something that does not flinch. I make myself large and loud",
        weights: { FD: 3, SM: 1 },
      },
      {
        label:
          "Wake the others silently. Alone I am prey; together we are a wall. I position everyone with their backs to the fire",
        weights: { SY: 3, FD: 1 },
      },
      {
        label:
          "Feed the fire first. A strong blaze keeps them at distance while I calmly rouse the camp and organize a watch rotation",
        weights: { SM: 3, SY: 1 },
      },
    ],
  },
  {
    id: "deep-inst-sur-3",
    system: "instincts",
    prompt:
      "A plague sweeps through the settlement where your party is resting. People are falling ill, supplies are being hoarded, and fear is spreading faster than the sickness. What do you focus on?",
    optionList: [
      {
        label:
          "I make sure my own body stays strong. I train, eat well, and keep my constitution up. I cannot help anyone if I go down first",
        weights: { FD: 3 },
      },
      {
        label:
          "I secure what we need before it is gone. Clean water, medicine, a defensible space. Survival is about being prepared before the worst arrives",
        weights: { SY: 3 },
      },
      {
        label:
          "I set up systems. Quarantine protocols, supply distribution, rest schedules. Chaos kills more people than the plague will",
        weights: { SM: 3 },
      },
    ],
  },
  {
    id: "deep-inst-sur-4",
    system: "instincts",
    prompt:
      "You have been traveling alone for weeks through hostile territory. You finally reach a safe haven. What is the first thing you notice about yourself?",
    optionList: [
      {
        label:
          "How much my body endured. The scars, the calluses, the muscles that hardened on the road. I am tougher than when I left",
        weights: { FD: 3, SY: 1 },
      },
      {
        label:
          "How hyper-aware I became. I was reading every shadow, every sound, every shift in the wind. That vigilance kept me alive and it has not turned off yet",
        weights: { SY: 3, SM: 1 },
      },
      {
        label:
          "How disciplined I became. Every meal was measured, every rest was timed, every movement was efficient. I turned myself into a machine to survive",
        weights: { SM: 3, FD: 1 },
      },
    ],
  },
];

const DEEP_INT_REALM_QUESTION_LIST: readonly QuizQuestion[] = [
  {
    id: "deep-inst-int-1",
    system: "instincts",
    prompt:
      "A powerful enchantress offers to permanently strengthen one aspect of how you connect with others. What do you choose?",
    optionList: [
      {
        label:
          "Every meeting with another person becomes a catalyst. Something shifts, something grows. No encounter is ever wasted",
        weights: { AY: 3 },
      },
      {
        label:
          "My people can never be scattered. Wherever I go, community forms around me. I am never without a circle",
        weights: { CY: 3 },
      },
      {
        label:
          "The one bond that matters most becomes unbreakable. Distance, time, conflict, nothing can sever it",
        weights: { BG: 3 },
      },
    ],
  },
  {
    id: "deep-inst-int-2",
    system: "instincts",
    prompt:
      "Your party has been on the road for months with no contact with the outside world. You finally arrive at a thriving city. What do you crave most?",
    optionList: [
      {
        label:
          "New faces. I want to meet people who think differently, who challenge me, who make me see myself in a new way",
        weights: { AY: 3, CY: 1 },
      },
      {
        label:
          "A gathering. A tavern full of people, a festival, a place where I can be part of something. I have been isolated too long",
        weights: { CY: 3, BG: 1 },
      },
      {
        label:
          "One real conversation. Not small talk. I want to find someone and go deep. One genuine connection is worth more than a hundred introductions",
        weights: { BG: 3, AY: 1 },
      },
    ],
  },
  {
    id: "deep-inst-int-3",
    system: "instincts",
    prompt:
      "Two factions in your war-band are threatening to split. Both sides want you to choose. How do you handle it?",
    optionList: [
      {
        label:
          "I bring the leaders together and force the real conversation. Conflict is where growth happens, and this band needs to transform or it was never real",
        weights: { AY: 3 },
      },
      {
        label:
          "I remind everyone what we share. Our story, our mission, our rituals. I organize a feast, a ceremony, something that makes us feel like one again",
        weights: { CY: 3 },
      },
      {
        label:
          "I go to the person I am closest to and make sure that bond is solid first. If my anchor holds, I can weather whatever the group decides",
        weights: { BG: 3 },
      },
    ],
  },
  {
    id: "deep-inst-int-4",
    system: "instincts",
    prompt:
      "You are dying. You have enough strength for one last act. What do you do?",
    optionList: [
      {
        label:
          "I speak the truth I have been holding back. The words that could change someone. If my last act can transform even one person, it was worth it",
        weights: { AY: 3 },
      },
      {
        label:
          "I gather my people. I want to see every face one more time and know that what we built together will outlast me",
        weights: { CY: 3 },
      },
      {
        label:
          "I find the one person. I hold their hand and say everything I never said. Nothing else matters in this moment",
        weights: { BG: 3 },
      },
    ],
  },
];

const DEEP_PUR_REALM_QUESTION_LIST: readonly QuizQuestion[] = [
  {
    id: "deep-inst-pur-1",
    system: "instincts",
    prompt:
      "You stand before the gates of the afterlife. A guardian asks: what made your life worth the living? What do you answer?",
    optionList: [
      {
        label:
          "I became someone. Not just anyone who passed through. I carved my name into the world and it will not fade",
        weights: { SS: 3 },
      },
      {
        label:
          "I saw clearly. While others stumbled through illusions, I stripped away the lies and found what was real",
        weights: { EX: 3 },
      },
      {
        label:
          "I walked into the dark. I went where no map led and found things no one else has seen",
        weights: { UN: 3 },
      },
    ],
  },
  {
    id: "deep-inst-pur-2",
    system: "instincts",
    prompt:
      "You discover an ancient library that will burn at dawn. You can save one book. How do you choose?",
    optionList: [
      {
        label:
          "The one that tells me who I was meant to be. A prophecy, a lineage, a destiny. I need to know my place in the story",
        weights: { SS: 3, EX: 1 },
      },
      {
        label:
          "The one that explains the deepest truth about the world. The nature of the gods, the structure of reality. I want understanding above all",
        weights: { EX: 3, UN: 1 },
      },
      {
        label:
          "The one written in a language no one has ever seen. Even if I cannot read it now, it points somewhere no one has gone. That is worth more than any answer",
        weights: { UN: 3, SS: 1 },
      },
    ],
  },
  {
    id: "deep-inst-pur-3",
    system: "instincts",
    prompt:
      "You complete the quest you have spent your entire life pursuing, and it turns out to mean nothing. The artifact is a fake. The prophecy was a lie. What happens to you?",
    optionList: [
      {
        label:
          "I grieve, then I begin again. If this purpose was false, I will forge a real one. I refuse to be no one",
        weights: { SS: 3 },
      },
      {
        label:
          "I examine the wreckage for what is actually true. Even a lie can teach you something about reality, and that lesson is never wasted",
        weights: { EX: 3 },
      },
      {
        label:
          "I feel a strange relief. The map was wrong, which means the territory is still uncharted. I set out again with no destination and it feels like freedom",
        weights: { UN: 3 },
      },
    ],
  },
  {
    id: "deep-inst-pur-4",
    system: "instincts",
    prompt:
      "On your deathbed, a spirit offers you one final vision. What do you ask to see?",
    optionList: [
      {
        label:
          "Show me how I will be remembered. Show me the mark I left on the world and tell me it mattered",
        weights: { SS: 3 },
      },
      {
        label:
          "Show me the truth I was closest to grasping. The one that was always just out of reach",
        weights: { EX: 3 },
      },
      {
        label:
          "Show me what lies beyond. Not the afterlife I expect, but what I could never have imagined",
        weights: { UN: 3 },
      },
    ],
  },
];

const DEEP_REALM_QUESTION_MAP: Record<InstinctCenter, readonly QuizQuestion[]> =
  {
    SUR: DEEP_SUR_REALM_QUESTION_LIST,
    INT: DEEP_INT_REALM_QUESTION_LIST,
    PUR: DEEP_PUR_REALM_QUESTION_LIST,
  };

/** Get the 4 realm-specific deep questions for a determined instinct center. */
export function getLongInstinctRealmQuestionList(
  center: InstinctCenter,
): readonly QuizQuestion[] {
  return DEEP_REALM_QUESTION_MAP[center];
}
