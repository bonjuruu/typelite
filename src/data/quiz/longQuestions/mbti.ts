import type { QuizQuestion } from "../types.ts";

// ============================================================
// MBTI — 32 Cognitive Function Questions (4 per function)
// ============================================================
// Weight keys: Ti, Te, Fi, Fe, Si, Se, Ni, Ne.
// Each question targets one function with primary weight, plus secondary cross-weights.

export const DEEP_MBTI_QUESTION_LIST: readonly QuizQuestion[] = [
  // --- Ti (4): Subjective logical criterion, internal consistency, ideas over facts ---
  {
    id: "deep-mbti-1",
    system: "mbti",
    prompt:
      "Your party has been using a battle strategy that everyone agrees works. You notice a flaw in the underlying reasoning that nobody else sees. What do you do?",
    optionList: [
      {
        label:
          "I cannot move forward until I have resolved the flaw in my own mind. The reasoning has to hold up, regardless of results",
        weights: { Ti: 3 },
      },
      {
        label:
          "Check the numbers. If it is still producing results, the flaw might not matter in practice",
        weights: { Te: 3, Si: 1 },
      },
      {
        label:
          "Bring it up with the team. If it affects people down the line, they deserve to know",
        weights: { Fe: 3, Ni: 1 },
      },
      {
        label:
          "The flaw is interesting. It might open up an approach nobody has considered yet",
        weights: { Ne: 3, Ti: 1 },
      },
    ],
  },
  {
    id: "deep-mbti-2",
    system: "mbti",
    prompt:
      "You have been studying an ancient text in the guild library for weeks. A companion asks when you will be done. What determines that for you?",
    optionList: [
      {
        label:
          "When the whole thing holds together on its own terms. Every piece needs to fit with every other piece",
        weights: { Ti: 3, Ni: 1 },
      },
      {
        label:
          "When I can actually do something useful with it. Understanding without application is just a hobby",
        weights: { Te: 3, Se: 1 },
      },
      {
        label:
          "Done? Every answer I find raises three more questions. I am not sure it ends",
        weights: { Ne: 3 },
      },
      {
        label:
          "When it clicks with what I have lived through myself. It has to match my own experience",
        weights: { Si: 3, Fi: 1 },
      },
    ],
  },
  {
    id: "deep-mbti-3",
    system: "mbti",
    prompt:
      "A trusted companion makes a choice you think is deeply irrational. How do you handle it?",
    optionList: [
      {
        label:
          "Walk them through where their reasoning breaks down. I cannot just let it go",
        weights: { Ti: 3, Fe: 1 },
      },
      {
        label:
          "Point out the likely consequences. The outcomes speak for themselves",
        weights: { Te: 3, Si: 1 },
      },
      {
        label: "Say my piece but step back. It is their life to live",
        weights: { Fi: 3 },
      },
      {
        label: "Suggest alternatives they might not have seen",
        weights: { Ne: 3, Ti: 1 },
      },
    ],
  },
  {
    id: "deep-mbti-4",
    system: "mbti",
    prompt:
      "A stranger at a tavern describes a theory about how the world works. What makes you lean in?",
    optionList: [
      {
        label:
          "The way the pieces lock together. A clean structure draws me in even if I disagree with the conclusion",
        weights: { Ti: 3 },
      },
      {
        label:
          "Whether it actually explains something I can go out and verify. Theory without results is just talk",
        weights: { Te: 3, Se: 1 },
      },
      {
        label:
          "What it would mean for the people around me if it turned out to be true",
        weights: { Fe: 3, Fi: 1 },
      },
      {
        label:
          "The loose ends. I am already wondering what else it could connect to",
        weights: { Ne: 3, Ni: 1 },
      },
    ],
  },
  // --- Te (4): Objective logical criterion, external data, proven results ---
  {
    id: "deep-mbti-5",
    system: "mbti",
    prompt:
      "Two scouts return with conflicting reports about the safest route through enemy territory. How do you decide which to trust?",
    optionList: [
      {
        label:
          "Whoever brought back specifics: distances, landmarks, patrol schedules. Hard details settle it",
        weights: { Te: 3, Si: 1 },
      },
      {
        label:
          "I mentally map both routes and trust whichever account holds together better when I walk through it in my head",
        weights: { Ti: 3, Ni: 1 },
      },
      {
        label:
          "I talk to both of them face to face. Whoever I trust more as a person, I follow",
        weights: { Fe: 3 },
      },
      {
        label:
          "Neither, fully. I want to find a third route that accounts for what both of them might be missing",
        weights: { Ne: 3, Ti: 1 },
      },
    ],
  },
  {
    id: "deep-mbti-6",
    system: "mbti",
    prompt:
      "You have been recommending an herb to fellow travelers for months. A healer you respect tells you it is actually harmful in certain doses. What do you do?",
    optionList: [
      {
        label:
          "Stop recommending it immediately. If someone credible says it is harmful, I am not going to risk it",
        weights: { Te: 3 },
      },
      {
        label:
          "I need to understand the mechanism first. I cannot just reverse course without knowing why",
        weights: { Ti: 3, Ni: 1 },
      },
      {
        label:
          "I sit with it. Something I trusted turned out to be wrong, and I need to process that before I act",
        weights: { Fi: 3, Si: 1 },
      },
      {
        label:
          "I ask other healers too. One person's warning is not enough. I want the full picture from people I trust",
        weights: { Fe: 3, Ne: 1 },
      },
    ],
  },
  {
    id: "deep-mbti-7",
    system: "mbti",
    prompt:
      "You are recovering from a battle wound at a healer's lodge with nothing urgent to do. How do you spend the time?",
    optionList: [
      {
        label:
          "Organize everything. Sort my gear, plan next month, get my affairs in order",
        weights: { Te: 3, Si: 1 },
      },
      {
        label:
          "Finally go deep on something I have been meaning to understand properly",
        weights: { Ti: 3, Ni: 1 },
      },
      {
        label: "Reach out to people. I check on friends and reconnect",
        weights: { Fe: 3 },
      },
      {
        label: "Start three new hobbies and finish none of them",
        weights: { Ne: 3, Fi: 1 },
      },
    ],
  },
  {
    id: "deep-mbti-8",
    system: "mbti",
    prompt:
      "A council is debating how to handle a failing crop system. The meeting has gone on for hours with no resolution. What frustrates you most?",
    optionList: [
      {
        label:
          "People keep debating philosophy while the crops are dying. Someone needs to just try something and see if it works",
        weights: { Te: 3, Se: 1 },
      },
      {
        label:
          "Nobody is questioning the assumptions. They are arguing over solutions to a problem they have not properly defined",
        weights: { Ti: 3 },
      },
      {
        label:
          "The farmers who actually work the land have not been asked. This whole debate ignores the people it affects",
        weights: { Fe: 3, Fi: 1 },
      },
      {
        label:
          "Everyone is stuck on two options when there are at least five approaches nobody has even mentioned",
        weights: { Ne: 3, Ni: 1 },
      },
    ],
  },
  // --- Fi (4): Subjective valuation, depth beneath stillness, inner images ---
  {
    id: "deep-mbti-9",
    system: "mbti",
    prompt:
      "Your party has traveled together for months. How would they describe your emotional side compared to what you actually feel?",
    optionList: [
      {
        label:
          "They think I am calmer than I am. I feel things intensely, but most of it stays inside",
        weights: { Fi: 3, Ni: 1 },
      },
      {
        label:
          "They mostly see what I feel. I express it outward and the camp usually knows",
        weights: { Fe: 3, Se: 1 },
      },
      {
        label:
          "They think I am less emotional than I am, which is fine. Emotions are not the point",
        weights: { Te: 3 },
      },
      {
        label:
          "It depends on the day. I am not consistent enough for anyone to generalize",
        weights: { Ne: 3, Se: 1 },
      },
    ],
  },
  {
    id: "deep-mbti-10",
    system: "mbti",
    prompt:
      "Something moves you deeply: a bard's song at dusk, a mountain vista, a quiet moment between two strangers at a fire. What happens next?",
    optionList: [
      {
        label:
          "I hold it privately. The feeling is mine and putting it into words would diminish it",
        weights: { Fi: 3, Si: 1 },
      },
      {
        label: "I want to share it. Beautiful things should be felt together",
        weights: { Fe: 3, Ne: 1 },
      },
      {
        label:
          "I notice it, appreciate it, and move on. Lingering does not come naturally",
        weights: { Se: 3, Te: 1 },
      },
      {
        label:
          "I try to understand why it moved me. What is the underlying pattern?",
        weights: { Ti: 3, Ni: 1 },
      },
    ],
  },
  {
    id: "deep-mbti-11",
    system: "mbti",
    prompt:
      "Your war-band is rallying behind a cause you do not believe in. Everyone expects you to march. What do you do?",
    optionList: [
      {
        label:
          "Quietly decline. I do not need to explain myself, but I will not pretend",
        weights: { Fi: 3, Ni: 1 },
      },
      {
        label:
          "Go along for the group. Unity matters more than my private reservations",
        weights: { Fe: 3, Si: 1 },
      },
      {
        label:
          "Challenge it openly. If the reasoning is bad, someone should say so",
        weights: { Te: 3, Ti: 1 },
      },
      {
        label:
          "Propose an alternative cause. Maybe there is a better direction nobody has seen",
        weights: { Ne: 3, Fe: 1 },
      },
    ],
  },
  {
    id: "deep-mbti-12",
    system: "mbti",
    prompt:
      "You have fought beside many companions, but only a few became true allies. What made those bonds different?",
    optionList: [
      {
        label:
          "Something unspoken. I sensed whether they were genuine at a level I cannot fully articulate",
        weights: { Fi: 3 },
      },
      {
        label:
          "Shared warmth. We just felt right together, like the camp was warmer with them in it",
        weights: { Fe: 3, Si: 1 },
      },
      {
        label:
          "Mutual respect and shared goals. We fought well together and that was enough",
        weights: { Te: 3, Se: 1 },
      },
      {
        label:
          "They made me think in new ways. Our conversations changed how I see the world",
        weights: { Ne: 3, Ti: 1 },
      },
    ],
  },
  // --- Fe (4): Objective feeling criterion, relational adjustment, social attunement ---
  {
    id: "deep-mbti-13",
    system: "mbti",
    prompt:
      "You walk into the war council tent and immediately sense tension between two commanders. What do you do?",
    optionList: [
      {
        label:
          "Adjust my own energy to ease the room. I naturally try to shift the emotional climate",
        weights: { Fe: 3 },
      },
      {
        label:
          "Observe quietly. I want to understand the dynamics before getting involved",
        weights: { Ti: 3, Ni: 1 },
      },
      {
        label: "Ignore it unless it affects what we need to get done",
        weights: { Te: 3, Se: 1 },
      },
      {
        label:
          "It settles into me whether I want it to or not. Other people's tension becomes mine",
        weights: { Fi: 3, Si: 1 },
      },
    ],
  },
  {
    id: "deep-mbti-14",
    system: "mbti",
    prompt:
      "You must deliver bad news to the party: a plan has failed and someone is to blame. How do you handle it?",
    optionList: [
      {
        label:
          "I read the group and frame it carefully. How I say it matters as much as what I say",
        weights: { Fe: 3, Ni: 1 },
      },
      {
        label:
          "I say it directly. Softening the blow usually just muddles the message",
        weights: { Te: 3, Se: 1 },
      },
      {
        label:
          "I think carefully about whether it even needs to be said at all",
        weights: { Fi: 3, Ni: 1 },
      },
      {
        label:
          "I lay out the facts and let everyone reach the conclusion themselves",
        weights: { Ti: 3, Te: 1 },
      },
    ],
  },
  {
    id: "deep-mbti-15",
    system: "mbti",
    prompt:
      "Two companions you care about are in a bitter argument and both want you on their side. What do you do?",
    optionList: [
      {
        label:
          "Mediate. I try to help both sides feel heard so the relationship can survive this",
        weights: { Fe: 3, Ni: 1 },
      },
      {
        label: "Side with whoever is right. Loyalty does not override honesty",
        weights: { Te: 3 },
      },
      {
        label:
          "Stay out of it. I refuse to be drawn into someone else's conflict",
        weights: { Fi: 3, Ti: 1 },
      },
      {
        label:
          "Reframe it. Maybe they are both missing something that could bring them closer",
        weights: { Ne: 3, Fe: 1 },
      },
    ],
  },
  {
    id: "deep-mbti-16",
    system: "mbti",
    prompt:
      "After a long day on the road with the party, you realize your mood has been shaped entirely by the group's spirits. How do you feel about that?",
    optionList: [
      {
        label:
          "Normal. I have always absorbed the moods around me. It is how I stay attuned to the group",
        weights: { Fe: 3, Si: 1 },
      },
      {
        label: "Annoyed. I should not be so permeable to other people's states",
        weights: { Ti: 3, Te: 1 },
      },
      {
        label:
          "I barely notice. My emotional state comes from inside, not outside",
        weights: { Fi: 3 },
      },
      {
        label:
          "I would rather channel that energy into doing something about whatever is dragging everyone down",
        weights: { Se: 3, Te: 1 },
      },
    ],
  },
  // --- Si (4): Subjective sensation, inner psychic impression, transformation of the sensory ---
  {
    id: "deep-mbti-17",
    system: "mbti",
    prompt:
      "You return to a village you passed through years ago on an earlier quest. What stands out most?",
    optionList: [
      {
        label:
          "The gap between what I remember and what is here now. My inner impression was its own thing",
        weights: { Si: 3, Fi: 1 },
      },
      {
        label:
          "What is physically different. I scan for what has changed in the real environment",
        weights: { Se: 3, Te: 1 },
      },
      {
        label:
          "A sense of what this place is becoming. I am already projecting forward",
        weights: { Ni: 3 },
      },
      {
        label: "Curiosity. What new possibilities does this place hold now?",
        weights: { Ne: 3 },
      },
    ],
  },
  {
    id: "deep-mbti-18",
    system: "mbti",
    prompt:
      "You taste a stew at a roadside inn that is identical to one you ate as a child in your home village. What happens?",
    optionList: [
      {
        label:
          "A whole world floods back. Not just the taste, but the hearth, the light, the feeling of being small. The memory becomes more vivid than the food in front of me",
        weights: { Si: 3 },
      },
      {
        label:
          "I focus on this version. How does the seasoning compare? Is it better, worse? I want to be fully here with what I am eating",
        weights: { Se: 3 },
      },
      {
        label:
          "I want to tell my companions about it. The story behind the taste matters as much as the dish itself",
        weights: { Fe: 3, Si: 1 },
      },
      {
        label:
          "It makes me think of all the versions this stew could be. What if you swapped this ingredient? What if you paired it with something unexpected?",
        weights: { Ne: 3, Ti: 1 },
      },
    ],
  },
  {
    id: "deep-mbti-19",
    system: "mbti",
    prompt:
      "You are walking through a forest you have never visited, but something about it feels deeply familiar. What is happening?",
    optionList: [
      {
        label:
          "The light, the smell, the crunch underfoot. It is all blending with places I have been before. The new place is layered with the old ones",
        weights: { Si: 3, Ni: 1 },
      },
      {
        label:
          "I snap out of it and focus on what is actually here. This forest, these trees, this moment",
        weights: { Se: 3, Te: 1 },
      },
      {
        label:
          "I am pattern-matching. My mind is filing it against categories and frameworks, not sensory memories",
        weights: { Ti: 3, Ni: 1 },
      },
      {
        label:
          "The familiarity sparks something. I am suddenly imagining what could be around the next bend, what stories this place could hold",
        weights: { Ne: 3, Fi: 1 },
      },
    ],
  },
  {
    id: "deep-mbti-20",
    system: "mbti",
    prompt:
      "A companion is going through a rough time after a loss and asks you to just be there for them. What comes naturally?",
    optionList: [
      {
        label:
          "Create a sense of shelter. Warm tea, quiet presence, familiar comforts that steady them",
        weights: { Si: 3, Fe: 1 },
      },
      {
        label:
          "Get them out. Change of scenery, fresh air, something to break the spiral",
        weights: { Se: 3, Ne: 1 },
      },
      {
        label:
          "Problem-solve. I start looking for practical ways to address what is causing their pain",
        weights: { Te: 3, Si: 1 },
      },
      {
        label:
          "Listen without fixing. I try to understand what they are really going through underneath",
        weights: { Ni: 3, Fi: 1 },
      },
    ],
  },
  // --- Se (4): Objective sensation, concrete present reality, intensity of the object ---
  {
    id: "deep-mbti-21",
    system: "mbti",
    prompt:
      "You step out of the tent at dawn. The camp is quiet, mist on the ground, birds just starting. What is your experience of this moment?",
    optionList: [
      {
        label:
          "Immediate. The cold air, the wet grass, the smoke from a dying fire. The world presses in on me and I take it all in",
        weights: { Se: 3 },
      },
      {
        label:
          "Filtered. I notice it, but through the lens of other mornings, other camps. The mist becomes my own impression of mist",
        weights: { Si: 3, Fi: 1 },
      },
      {
        label:
          "Background. I am already thinking about the day ahead. The camp is just scenery",
        weights: { Ni: 3, Ti: 1 },
      },
      {
        label:
          "Scattered. I notice the bird, then the smoke, then a sound in the trees. My attention jumps between them",
        weights: { Ne: 3, Se: 1 },
      },
    ],
  },
  {
    id: "deep-mbti-22",
    system: "mbti",
    prompt:
      "An ambush hits the camp. No time to plan, no time to think. How do you respond?",
    optionList: [
      {
        label:
          "My body is already moving. I deal with what is right in front of me, now",
        weights: { Se: 3, Ti: 1 },
      },
      {
        label:
          "I pause to sense the shape of the whole situation, then commit to one path",
        weights: { Ni: 3, Te: 1 },
      },
      {
        label:
          "I draw on what has worked before. Familiar patterns guide my hands",
        weights: { Si: 3 },
      },
      {
        label: "My mind races through options while my body hesitates",
        weights: { Ne: 3, Ti: 1 },
      },
    ],
  },
  {
    id: "deep-mbti-23",
    system: "mbti",
    prompt:
      "You are at a feast after a long campaign. How do you enjoy yourself?",
    optionList: [
      {
        label:
          "All in. The food, the noise, the bodies, the heat. I want more of everything",
        weights: { Se: 3, Fe: 1 },
      },
      {
        label:
          "Savoring it gently. The warmth, the taste, the gratitude. I hold it close",
        weights: { Si: 3, Fi: 1 },
      },
      {
        label:
          "Talking. I want to process what we just went through with someone",
        weights: { Fe: 3, Ti: 1 },
      },
      {
        label:
          "Already thinking about what comes next. The feast is a pause, not a destination",
        weights: { Ni: 3, Te: 1 },
      },
    ],
  },
  {
    id: "deep-mbti-24",
    system: "mbti",
    prompt:
      "The quest has taken you through battles, revelations, quiet nights, and wild discoveries. When did you feel most alive?",
    optionList: [
      {
        label:
          "In the thick of it. Impact, speed, intensity. My body fully engaged with the world",
        weights: { Se: 3 },
      },
      {
        label:
          "When something I experienced resonated so deeply it became part of me forever",
        weights: { Si: 3, Fi: 1 },
      },
      {
        label:
          "When I finally grasped something that had been eluding me. The click of understanding",
        weights: { Ni: 3, Ti: 1 },
      },
      {
        label:
          "When possibility exploded open and I saw paths no one else had noticed",
        weights: { Ne: 3 },
      },
    ],
  },
  // --- Ni (4): Subjective intuition, archetypal perception, the meaning behind events ---
  {
    id: "deep-mbti-25",
    system: "mbti",
    prompt:
      "Your party is debating three possible paths forward. Everyone is weighing pros and cons, but you already have a strong pull toward one. What is driving that?",
    optionList: [
      {
        label:
          "Something underneath the details is pointing me there. I cannot fully explain it, but I can feel how this is going to play out",
        weights: { Ni: 3 },
      },
      {
        label:
          "I keep seeing how each path branches into more paths. I am drawn to whichever keeps the most doors open",
        weights: { Ne: 3, Ti: 1 },
      },
      {
        label:
          "I have seen situations like this before. Past experience is telling me which one works",
        weights: { Si: 3, Te: 1 },
      },
      {
        label:
          "I do not get pulled. I pick based on what is right in front of us: terrain, resources, threat level",
        weights: { Se: 3 },
      },
    ],
  },
  {
    id: "deep-mbti-26",
    system: "mbti",
    prompt:
      "A raven lands on your tent pole the morning before the final battle. A companion laughs it off. You do not. Why?",
    optionList: [
      {
        label:
          "It is not superstition. Things like this carry a weight I cannot ignore, like the world is showing me something I am supposed to notice",
        weights: { Ni: 3, Fi: 1 },
      },
      {
        label:
          "It sets my mind racing. Not because it means something specific, but because it connects to ten other things I have been thinking about",
        weights: { Ne: 3, Ti: 1 },
      },
      {
        label: "Honestly? I would laugh it off too. A raven is a raven",
        weights: { Se: 3, Te: 1 },
      },
      {
        label:
          "It reminds me of another time something like this happened. The association is what makes it feel meaningful",
        weights: { Si: 3, Fi: 1 },
      },
    ],
  },
  {
    id: "deep-mbti-27",
    system: "mbti",
    prompt:
      "The party is camped for the night. Something feels wrong but you have no evidence. What do you do?",
    optionList: [
      {
        label:
          "Trust it. This kind of knowing has been right before, even when I could not explain why",
        weights: { Ni: 3, Fi: 1 },
      },
      {
        label:
          "Brainstorm what could go wrong and prepare for multiple scenarios",
        weights: { Ne: 3 },
      },
      {
        label: "Think back. Has something like this happened before?",
        weights: { Si: 3, Fe: 1 },
      },
      {
        label: "Wait for actual evidence. I do not act on feelings alone",
        weights: { Se: 3, Te: 1 },
      },
    ],
  },
  {
    id: "deep-mbti-28",
    system: "mbti",
    prompt:
      "You have realized something important about the quest that the others need to understand. How do you try to explain it?",
    optionList: [
      {
        label:
          "I struggle. What I perceive feels too layered to put into straightforward words",
        weights: { Ni: 3 },
      },
      {
        label:
          "I riff. One idea leads to another and I build the picture through association until they see it",
        weights: { Ne: 3, Fe: 1 },
      },
      {
        label:
          "I ground it in specifics: what we saw, what happened, what the pattern is. I make it concrete",
        weights: { Te: 3, Si: 1 },
      },
      {
        label:
          "I tell a story. I use our shared experience to make them feel what I mean",
        weights: { Fe: 3, Si: 1 },
      },
    ],
  },
  // --- Ne (4): Objective intuition, external possibilities, what the object could become ---
  {
    id: "deep-mbti-29",
    system: "mbti",
    prompt:
      "A companion shares an idea around the campfire. What is your natural response?",
    optionList: [
      {
        label: '"Yes, and..." I immediately see five things it could become',
        weights: { Ne: 3 },
      },
      {
        label:
          '"Where does this ultimately lead?" I trace it to its deepest implication',
        weights: { Ni: 3, Ti: 1 },
      },
      {
        label: '"Show me it working." I want proof, not potential',
        weights: { Te: 3, Si: 1 },
      },
      {
        label: '"How does this sit with me?" I check whether it feels right',
        weights: { Fi: 3, Si: 1 },
      },
    ],
  },
  {
    id: "deep-mbti-30",
    system: "mbti",
    prompt: "After a devastating defeat, what helps you recover?",
    optionList: [
      {
        label:
          "Seeing what else this could lead to. Every dead end reveals new directions",
        weights: { Ne: 3, Fi: 1 },
      },
      {
        label:
          "Reconnecting with the bigger picture. One failure does not change where I am headed",
        weights: { Ni: 3, Te: 1 },
      },
      {
        label:
          "Returning to solid ground. Familiar routines and proven methods steady me",
        weights: { Si: 3, Te: 1 },
      },
      {
        label: "Doing something physical. I need to move and burn it off",
        weights: { Se: 3, Ti: 1 },
      },
    ],
  },
  {
    id: "deep-mbti-31",
    system: "mbti",
    prompt:
      "You arrive in a new city with no plans and an open day. How do you spend it?",
    optionList: [
      {
        label:
          "I wander. Every alley could lead somewhere unexpected, every stranger could have a story. I let the city pull me wherever it wants",
        weights: { Ne: 3 },
      },
      {
        label:
          "I find one place that draws me and go deep. I would rather know one neighborhood intimately than skim ten",
        weights: { Ni: 3, Si: 1 },
      },
      {
        label:
          "I check what is actually worth seeing. I am not going to waste time wandering when I could be strategic about it",
        weights: { Te: 3, Se: 1 },
      },
      {
        label:
          "I follow what resonates. If a bookshop or garden speaks to me, I stop. If nothing does, I keep moving",
        weights: { Fi: 3, Si: 1 },
      },
    ],
  },
  {
    id: "deep-mbti-32",
    system: "mbti",
    prompt:
      "You are locked in a dungeon cell waiting for your companions to find you. Nothing to do but sit. What happens in your head?",
    optionList: [
      {
        label:
          "I start inventing. What built this place? What if that crack in the wall leads somewhere? My mind fills the emptiness with possibilities",
        weights: { Ne: 3 },
      },
      {
        label:
          "I follow one thought deeper and deeper, like pulling a thread. Hours disappear into a single idea",
        weights: { Ni: 3, Ti: 1 },
      },
      {
        label:
          "Vivid memories surface. Places I have been, textures I remember, sounds from years ago play like a private film",
        weights: { Si: 3, Fi: 1 },
      },
      {
        label:
          "I get restless. I am pacing, testing the bars, examining every stone. I need something physical to engage with",
        weights: { Se: 3 },
      },
    ],
  },
] as const;
