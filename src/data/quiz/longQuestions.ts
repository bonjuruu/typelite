import type { SystemId, InstinctCenter } from '../../engine/types.ts'
import type { QuizQuestion } from './types.ts'

// ============================================================
// ATTITUDINAL PSYCHE — 12 Questions (6 pairwise + 6 position-attitude)
// ============================================================
// Pairwise: same 6 pairs as quick, different scenarios.
// Position-attitude: each tests a specific position's orientation.

export const DEEP_AP_QUESTION_LIST: readonly QuizQuestion[] = [
  // --- Pairwise comparisons (6) ---
  {
    id: 'deep-ap-1',
    system: 'attitudinal',
    prompt: 'Two factions in the war-band argue about what the group needs most in a leader. One side says you need someone who decides and commits — someone whose certainty pulls everyone forward. The other says you need someone who sees clearly — someone who never gets fooled and always finds the truth. Which side do you agree with?',
    optionList: [
      { label: 'Certainty. A leader who hesitates while thinking loses the moment. Conviction moves people', weights: { V: 1 } },
      { label: 'Clarity. A leader who acts without understanding walks the group off a cliff. Truth comes first', weights: { L: 1 } },
    ],
  },
  {
    id: 'deep-ap-2',
    system: 'attitudinal',
    prompt: 'A shape-shifting curse will permanently take one thing from you. You must choose which you keep: your force of will — your ability to push through resistance, hold your ground, and impose your vision — or your emotional depth — your ability to feel intensely, connect with others, and be moved by beauty.',
    optionList: [
      { label: 'Keep my will. I can survive without feeling everything, but I cannot survive without being able to fight for what I want', weights: { V: 1 } },
      { label: 'Keep my depth. I can find other ways to push through, but a life without real feeling is hollow', weights: { E: 1 } },
    ],
  },
  {
    id: 'deep-ap-3',
    system: 'attitudinal',
    prompt: 'Two artifacts behind a gate you can only open once. The Crown of Dominion makes armies follow you. The Heartstone makes your body tireless and immune. Which do you claim?',
    optionList: [
      { label: 'The Crown. Let them follow', weights: { V: 1 } },
      { label: 'The Heartstone. My body never fails me again', weights: { F: 1 } },
    ],
  },
  {
    id: 'deep-ap-4',
    system: 'attitudinal',
    prompt: 'You are mediating a dispute between two companions. One insists the answer lies in careful reasoning — lay out the facts, follow the logic, and the right path reveals itself. The other insists the answer lies in listening to what people actually feel — the real problem is emotional, not intellectual. Who do you side with?',
    optionList: [
      { label: 'The reasoner. Feelings shift and mislead. Clear thinking cuts through confusion', weights: { L: 1 } },
      { label: 'The empath. Logic without heart misses what actually matters to people', weights: { E: 1 } },
    ],
  },
  {
    id: 'deep-ap-5',
    system: 'attitudinal',
    prompt: 'A healer offers you a permanent blessing but can only enchant one thing: your mind or your body. The mind blessing gives you perfect memory, flawless reasoning, and immunity to illusion. The body blessing gives you tireless endurance, rapid healing, and immunity to poison and disease.',
    optionList: [
      { label: 'The mind. A sharp mind protects me from threats no armor can stop', weights: { L: 1 } },
      { label: 'The body. All the knowledge in the world means nothing if my body fails me', weights: { F: 1 } },
    ],
  },
  {
    id: 'deep-ap-6',
    system: 'attitudinal',
    prompt: 'After a brutal campaign, the party has a week of rest. You notice you are drawn toward one of two things: long conversations with companions where you process everything you have been through — the grief, the bonds, the meaning of it all — or tending to your body — sleeping deeply, eating well, stretching sore muscles, letting your physical self fully recover.',
    optionList: [
      { label: 'The conversations. My heart needs tending more than my body. Processing what I have lived through is how I heal', weights: { E: 1 } },
      { label: 'The body. Physical recovery comes first. I cannot feel anything properly when I am exhausted and broken down', weights: { F: 1 } },
    ],
  },
  // --- Position-attitude questions (6) ---
  {
    id: 'deep-ap-7',
    system: 'attitudinal',
    prompt: 'A fork in the road with no map. One path looks safe but slow; the other is unmarked. Your party looks to you. What do you do?',
    optionList: [
      { label: 'Pick a path and go. Standing here is worse than a wrong turn', weights: { V: 2 } },
      { label: 'Talk it out with the group. Two minds are better than one', weights: { L: 1, E: 1 } },
      { label: 'Wait for someone else to decide. I would rather not be the one who gets it wrong', weights: { F: 1 } },
    ],
  },
  {
    id: 'deep-ap-8',
    system: 'attitudinal',
    prompt: 'A companion shares a new theory about how magic works. What is your first instinct?',
    optionList: [
      { label: 'Pull it apart together. I want to explore every angle and hear their reasoning', weights: { L: 2 } },
      { label: 'I already have my own theory. Theirs is interesting, but mine holds up better', weights: { V: 1 } },
      { label: 'Ask who came up with it. If a master mage says so, that carries weight', weights: { L: -1, F: 1 } },
    ],
  },
  {
    id: 'deep-ap-9',
    system: 'attitudinal',
    prompt: 'A companion betrays the party. In the aftermath, what do the others see on your face?',
    optionList: [
      { label: 'Everything. My face, my voice, the whole room knows what I am feeling', weights: { E: 2 } },
      { label: 'The real version. I share openly and want to hear how they feel too', weights: { E: 1, V: 1 } },
      { label: 'Very little. Most of it stays inside where it belongs', weights: { E: -1, L: 1 } },
    ],
  },
  {
    id: 'deep-ap-10',
    system: 'attitudinal',
    prompt: 'The party is offered two options: a warm inn with hot food and soft beds, or a shortcut through rough terrain that saves two days. What do you push for?',
    optionList: [
      { label: 'The inn. A rested body is worth more than saved time', weights: { F: 2 } },
      { label: 'Either works. I adapt easily and do not stress about comfort', weights: { F: 1, E: 1 } },
      { label: 'The shortcut. Comfort is the least interesting thing to optimize for', weights: { V: 1, L: 1 } },
    ],
  },
  {
    id: 'deep-ap-11',
    system: 'attitudinal',
    prompt: 'A new recruit questions your skill in front of the war-band. How do you respond?',
    optionList: [
      { label: 'Double down. I know what I know', weights: { V: 2 } },
      { label: 'Get curious. Pushback sharpens my thinking', weights: { L: 2 } },
      { label: 'Pull back. It stings more than it should', weights: { E: 1, F: 1 } },
    ],
  },
  {
    id: 'deep-ap-12',
    system: 'attitudinal',
    prompt: 'Your companions are describing each other around the campfire. When they get to you, what do they say?',
    optionList: [
      { label: 'They know what they want and nothing gets in their way', weights: { V: 1 } },
      { label: 'You can always count on them to think things through with you', weights: { L: 1 } },
      { label: 'They feel everything so deeply it is almost frightening', weights: { E: 1 } },
      { label: 'They take better care of themselves than anyone I have ever met', weights: { F: 1 } },
    ],
  },
] as const

// ============================================================
// ENNEAGRAM — 30 Questions (24 type + 6 instinct)
// ============================================================

export const DEEP_ENNEAGRAM_QUESTION_LIST: readonly QuizQuestion[] = [
  // --- Type questions (24) ---
  {
    id: 'deep-enn-1',
    system: 'enneagram',
    prompt: 'Your party arrives at a village where a corrupt lord has been taxing peasants into starvation while feasting in his hall. What rises in you?',
    optionList: [
      { label: 'Anger. This is wrong and someone needs to set it right, starting now', weights: { '1': 3, '8': 1 } },
      { label: 'Compassion. I go straight to the hungry. They need help before they need justice', weights: { '2': 3, '9': 1 } },
      { label: 'Opportunity. If I handle this well, these people will rally behind me', weights: { '3': 3, '8': 1 } },
      { label: 'Sadness. The world keeps doing this and nobody seems to care enough to change it', weights: { '4': 3, '5': 1 } },
    ],
  },
  {
    id: 'deep-enn-2',
    system: 'enneagram',
    prompt: 'Your party finds a hidden door behind a waterfall that leads deep underground. Strange light pulses from below. What do you do?',
    optionList: [
      { label: 'Go alone. I want to understand what is down there before anyone else gets involved', weights: { '5': 3, '4': 1 } },
      { label: 'Scout it carefully. Count exits, test the air, check for traps before anyone descends', weights: { '6': 3, '5': 1 } },
      { label: 'This is exactly the kind of thing I live for. I am already climbing down', weights: { '7': 3, '3': 1 } },
      { label: 'Secure the entrance. Whatever is down there, I want to control access to it', weights: { '8': 3, '1': 1 } },
    ],
  },
  {
    id: 'deep-enn-3',
    system: 'enneagram',
    prompt: 'A massive storm forces the party to shelter in a cave for days. Supplies are low and morale is crumbling. What do you find yourself doing?',
    optionList: [
      { label: 'Taking care of everyone. Making sure people eat, checking on the injured, keeping spirits up', weights: { '2': 3, '6': 1 } },
      { label: 'Keeping the mood light. Telling stories, cracking jokes, finding small pleasures to pass the time', weights: { '7': 3, '9': 1 } },
      { label: 'Rationing and planning. I calculate how long our supplies last and what we do when they run out', weights: { '5': 3, '9': 1 } },
      { label: 'Taking charge. Someone needs to make decisions or this group falls apart', weights: { '8': 3, '3': 1 } },
    ],
  },
  {
    id: 'deep-enn-4',
    system: 'enneagram',
    prompt: 'You have earned a reputation across the realm. What do people say about you when you are not in the room?',
    optionList: [
      { label: 'That I hold myself and everyone else to a standard. People respect it even when they resent it', weights: { '1': 3, '6': 1 } },
      { label: 'That I would give anything for the people I care about. They know I will always be there', weights: { '2': 3, '9': 1 } },
      { label: 'That I get things done. Whatever the task, I find a way to come out on top', weights: { '3': 3, '7': 1 } },
      { label: 'That there is something different about me. Something they cannot quite name but cannot ignore', weights: { '4': 3, '5': 1 } },
    ],
  },
  {
    id: 'deep-enn-5',
    system: 'enneagram',
    prompt: 'The party is crossing a vast, unmapped wasteland. What keeps you going when everyone else wants to turn back?',
    optionList: [
      { label: 'Vigilance. I am watching for threats every second. If something is coming, I will see it first', weights: { '6': 3, '1': 1 } },
      { label: 'The finish line. I picture arriving, the recognition, proving I could do what others could not', weights: { '3': 3, '4': 1 } },
      { label: 'Curiosity. No one has mapped this before. Every step is new information', weights: { '5': 3, '7': 1 } },
      { label: 'The group. As long as we are together and moving, I am at peace with whatever happens', weights: { '9': 3, '2': 1 } },
    ],
  },
  {
    id: 'deep-enn-6',
    system: 'enneagram',
    prompt: 'You lie awake in camp while the others sleep. What gnaws at you?',
    optionList: [
      { label: 'That I have failed some standard I set for myself', weights: { '1': 3, '3': 1 } },
      { label: 'That nobody truly sees who I am', weights: { '4': 3, '2': 1 } },
      { label: 'That I will not be ready when disaster strikes', weights: { '6': 3, '5': 1 } },
      { label: 'That life is passing me by', weights: { '7': 3, '3': 1 } },
    ],
  },
  {
    id: 'deep-enn-7',
    system: 'enneagram',
    prompt: 'A companion has been secretly sending messages to the enemy. You discover the letters hidden in their pack. What happens next?',
    optionList: [
      { label: 'I confront them in front of everyone. Betrayal gets answered publicly', weights: { '8': 3, '1': 1 } },
      { label: 'I read every letter first. I need to understand the full scope before I act', weights: { '5': 3, '9': 1 } },
      { label: 'I go to the rest of the group. We need to handle this together and keep the party intact', weights: { '2': 3, '6': 1 } },
      { label: 'I focus on what we do now. The damage is done — brooding over it wastes time we do not have', weights: { '7': 3, '3': 1 } },
    ],
  },
  {
    id: 'deep-enn-8',
    system: 'enneagram',
    prompt: 'Your party captures a scout who claims they were forced to serve the enemy. Some companions want to release them. Others say it is too risky. What do you argue?',
    optionList: [
      { label: 'We cannot excuse what they did just because they were pressured. Actions have consequences', weights: { '1': 3, '5': 1 } },
      { label: 'Release them. People do what they must to survive, and mercy costs us nothing here', weights: { '9': 3, '2': 1 } },
      { label: 'Use them. A scout who knows the enemy layout is valuable — turn them to our side', weights: { '3': 3, '7': 1 } },
      { label: 'I feel for them. Being trapped between two sides with no real choice is its own kind of suffering', weights: { '4': 3, '9': 1 } },
    ],
  },
  {
    id: 'deep-enn-9',
    system: 'enneagram',
    prompt: 'The war is over. What does your life look like a year later?',
    optionList: [
      { label: 'I am creating something — art, music, writing. The things I lived through demand expression', weights: { '4': 3, '7': 1 } },
      { label: 'I have found a quiet place. Simple days, familiar routines, people I love nearby', weights: { '9': 3, '6': 1 } },
      { label: 'I am helping rebuild. There are people who need someone, and I cannot sit still while they struggle', weights: { '2': 3, '1': 1 } },
      { label: 'I am already on to the next thing. A new venture, a new challenge. I do not do idle well', weights: { '3': 3, '8': 1 } },
    ],
  },
  {
    id: 'deep-enn-10',
    system: 'enneagram',
    prompt: 'You wake up one morning with a power you did not ask for — you can read the thoughts of anyone nearby. What is your first reaction?',
    optionList: [
      { label: 'I need rules for this immediately. Using it carelessly would be a violation of everything I believe in', weights: { '1': 3, '6': 1 } },
      { label: 'I think about the people closest to me. Will this change how they see me? Will it push them away?', weights: { '2': 3, '4': 1 } },
      { label: 'I need to study this. How does it work? What are the limits? I will not use it until I understand it', weights: { '5': 3, '6': 1 } },
      { label: 'I immediately worry about being trapped by it. What if I cannot turn it off?', weights: { '7': 3, '8': 1 } },
    ],
  },
  {
    id: 'deep-enn-11',
    system: 'enneagram',
    prompt: 'You have been leading the party for months. A companion privately tells you that some members are unhappy with your leadership. How do you react?',
    optionList: [
      { label: 'I examine my own conduct first. If I have been unfair or inconsistent, I need to correct it', weights: { '1': 3, '6': 1 } },
      { label: 'It stings. I have given everything to this group. I want to know who is unhappy so I can make it right', weights: { '2': 3, '9': 1 } },
      { label: 'I do not care about being liked. I care about keeping people alive. If that means being unpopular, fine', weights: { '8': 3, '3': 1 } },
      { label: 'I step back and think. Maybe I have been too involved. Maybe the group needs a different structure entirely', weights: { '5': 3, '4': 1 } },
    ],
  },
  {
    id: 'deep-enn-12',
    system: 'enneagram',
    prompt: 'Your party arrives at a fortified bridge held by a toll collector who demands an outrageous price. No one can afford it, and the river is too dangerous to cross any other way. What is your approach?',
    optionList: [
      { label: 'Negotiate. I will find what they actually want and make a deal that works for both sides', weights: { '3': 3, '7': 1 } },
      { label: 'Assess the situation first. Is the bridge even safe? Are there other crossings? I need information before I act', weights: { '6': 3, '5': 1 } },
      { label: 'Push through. If they want to stop me, they can try', weights: { '8': 3, '7': 1 } },
      { label: 'Talk to them like a person. Maybe they are scared or lonely out here. No need for a fight', weights: { '9': 3, '2': 1 } },
    ],
  },
  // --- Additional deep type questions (12) with disambiguators ---
  {
    id: 'deep-enn-13',
    system: 'enneagram',
    prompt: 'The realm is fraying: crops fail, bandits roam freely, and the old laws are ignored. What is your gut response?',
    optionList: [
      { label: 'Fix it. There is a right way things should be', weights: { '1': 3 } },
      { label: 'Brace for impact. Disorder means threats are coming', weights: { '6': 3 } },
      { label: 'Accept it. Forcing order causes more harm', weights: { '9': 3 } },
      { label: 'Seize the moment. Chaos is where the bold thrive', weights: { '8': 3 } },
    ],
  },
  {
    id: 'deep-enn-14',
    system: 'enneagram',
    prompt: 'You complete a legendary quest. A bard wants to write a song about you. What do you want them to capture?',
    optionList: [
      { label: 'The victory itself. My name, my triumph, the moment I stood above the rest', weights: { '3': 3, '7': 1 } },
      { label: 'The real me. Not the hero version, the true version, flaws and all', weights: { '4': 3 } },
      { label: 'How I held power and used it. That people feared and respected what I built', weights: { '8': 3, '3': 1 } },
      { label: 'The people I helped along the way. The song should be about them, not me', weights: { '2': 3, '1': 1 } },
    ],
  },
  {
    id: 'deep-enn-15',
    system: 'enneagram',
    prompt: 'After a defeat, a companion sits apart from the group and says they have lost their sense of purpose. How do you respond?',
    optionList: [
      { label: 'Take care of them. That is what I am here for', weights: { '2': 3 } },
      { label: 'Share my own experience so they know they are not alone', weights: { '4': 3, '9': 1 } },
      { label: 'Help them think through it clearly. Structure calms the chaos', weights: { '5': 3, '1': 1 } },
      { label: 'Suggest an adventure. Action cures existential dread', weights: { '7': 3 } },
    ],
  },
  {
    id: 'deep-enn-16',
    system: 'enneagram',
    prompt: 'A healer begs you to steal a rare herb from a merchant who is hoarding it while villagers die of plague. What do you do?',
    optionList: [
      { label: 'Steal it. Some things are clearly right even when the rules say otherwise', weights: { '1': 3, '6': 1 } },
      { label: 'Negotiate, bargain, or find another way to get the herb without making enemies', weights: { '3': 3, '8': 1 } },
      { label: 'Talk to the merchant first. Maybe they are hoarding out of fear, not greed', weights: { '9': 3, '2': 1 } },
      { label: 'I need the full picture before I act. What if the healer is wrong about the herb?', weights: { '5': 3 } },
    ],
  },
  // 1 vs 6 disambiguator
  {
    id: 'deep-enn-17',
    system: 'enneagram',
    prompt: 'You discover a crack in the fortress wall that no one else has noticed. What is your reaction?',
    optionList: [
      { label: 'It offends me. Things should work properly', weights: { '1': 3 } },
      { label: 'It scares me. If the system fails, people get hurt', weights: { '6': 3 } },
      { label: 'It is an opportunity to be the one who fixes it', weights: { '3': 3 } },
      { label: 'Figures. Most things are held together by faith, not structure', weights: { '5': 3 } },
    ],
  },
  // 5 vs 9 disambiguator
  {
    id: 'deep-enn-18',
    system: 'enneagram',
    prompt: 'You leave camp alone and walk into the wilderness. What are you looking for?',
    optionList: [
      { label: 'Understanding. I need to figure things out before I re-engage', weights: { '5': 3 } },
      { label: 'Quiet. I just need the noise to stop', weights: { '9': 3 } },
      { label: 'Space to feel. I need solitude to process my emotions', weights: { '4': 3 } },
      { label: 'Safety. I need to regroup', weights: { '6': 3 } },
    ],
  },
  // 3 vs 8 disambiguator
  {
    id: 'deep-enn-19',
    system: 'enneagram',
    prompt: 'A party member challenges your call in front of the rest of the group during a tense march. What do you do?',
    optionList: [
      { label: 'Prove them wrong. Results speak louder', weights: { '3': 3 } },
      { label: 'Shut it down. Nobody undermines me without consequence', weights: { '8': 3 } },
      { label: 'Correct them calmly. Truth is on my side', weights: { '1': 3 } },
      { label: 'Deflect and redirect. Open conflict helps no one', weights: { '9': 3 } },
    ],
  },
  {
    id: 'deep-enn-20',
    system: 'enneagram',
    prompt: 'A nightmare spirit traps you in a vision of your worst fear. What does it show you?',
    optionList: [
      { label: 'A world where everyone moves on without me. I call out and no one turns around', weights: { '2': 3 } },
      { label: 'A mirror that shows nothing. No face, no story, no self', weights: { '4': 3 } },
      { label: 'A library where every book is blank. I reach for answers and find nothing', weights: { '5': 3 } },
      { label: 'A room with no doors. Everything is fine, but I can never leave', weights: { '7': 3 } },
    ],
  },
  {
    id: 'deep-enn-21',
    system: 'enneagram',
    prompt: 'A companion asks you to abandon your personal quest to help them with theirs. How do you feel?',
    optionList: [
      { label: 'Happy to. Being needed is what I live for', weights: { '2': 3, '9': 1 } },
      { label: 'Torn. I want to help, but my goals matter too', weights: { '3': 3, '6': 1 } },
      { label: 'Resentful, but I do it anyway', weights: { '1': 3, '2': 1 } },
      { label: 'No. My autonomy is not negotiable', weights: { '8': 3, '5': 1 } },
    ],
  },
  {
    id: 'deep-enn-22',
    system: 'enneagram',
    prompt: 'The caravan is stuck in a sandstorm for three days. Everyone is sheltering in the wagons with nothing to do. How do you cope?',
    optionList: [
      { label: 'I am going stir-crazy by hour two. I start inventing games, telling stories, anything to break the monotony', weights: { '7': 3, '3': 1 } },
      { label: 'I welcome it. Stillness lets me sit with feelings I normally avoid', weights: { '4': 3, '5': 1 } },
      { label: 'I find work. Mend gear, sharpen blades, organize supplies. There is always something to improve', weights: { '1': 3 } },
      { label: 'I settle into the rhythm and drift. Three days will pass', weights: { '9': 3 } },
    ],
  },
  {
    id: 'deep-enn-23',
    system: 'enneagram',
    prompt: 'The party makes camp in hostile territory. What lets you sleep at night?',
    optionList: [
      { label: 'Knowing exactly who is on watch and that they will not let me down', weights: { '6': 3, '2': 1 } },
      { label: 'My own preparation. I have studied the threats and I know what to expect', weights: { '5': 3, '1': 1 } },
      { label: 'My own strength. If something comes, I can handle it myself', weights: { '8': 3, '6': 1 } },
      { label: 'Knowing there is always a way out. I mapped three escape routes before sundown', weights: { '7': 3, '9': 1 } },
    ],
  },
  {
    id: 'deep-enn-24',
    system: 'enneagram',
    prompt: 'An elder asks you to tell the story of your life so far. What thread runs through it?',
    optionList: [
      { label: 'Constantly trying to do the right thing', weights: { '1': 3 } },
      { label: 'The people I have helped, loved, or been shaped by', weights: { '2': 3, '9': 1 } },
      { label: 'A search for who I really am', weights: { '4': 3, '5': 1 } },
      { label: 'Always moving, always chasing the next thing', weights: { '7': 3, '3': 1 } },
    ],
  },
  // --- Instinct questions (6) ---
  {
    id: 'deep-enn-25',
    system: 'enneagram',
    prompt: 'You survive a near-death experience. In the days that follow, what changes about how you live?',
    optionList: [
      { label: 'I take better care of myself. I eat properly, rest when I need to, and stop ignoring what my body tells me', weights: { 'sp': 3 } },
      { label: 'I reach out to people I have drifted from. Life is too short to let connections fade', weights: { 'so': 3 } },
      { label: 'I hold the people I love closer. One bond, fully alive, matters more than anything else', weights: { 'sx': 3 } },
    ],
  },
  {
    id: 'deep-enn-26',
    system: 'enneagram',
    prompt: 'Three companions each tell you why they keep fighting. Which reason resonates most with yours?',
    optionList: [
      { label: 'I fight so I never have to go hungry, sleep in the cold, or wonder if I will survive another day', weights: { 'sp': 3 } },
      { label: 'I fight so my people have a future. If the community falls, nothing I build alone matters', weights: { 'so': 3 } },
      { label: 'I fight for the one person who made me feel like I belong in this world. Everything else is noise', weights: { 'sx': 3 } },
    ],
  },
  {
    id: 'deep-enn-27',
    system: 'enneagram',
    prompt: 'An enchantress offers to amplify one part of your life beyond anything natural. What do you choose?',
    optionList: [
      { label: 'My body. Perfect health, boundless stamina, complete physical security. I never worry about survival again', weights: { 'sp': 3 } },
      { label: 'My influence. People listen when I speak, doors open, and I always have a place in any group', weights: { 'so': 3 } },
      { label: 'My intensity. Every connection burns brighter, every bond cuts deeper. I feel fully alive', weights: { 'sx': 3 } },
    ],
  },
  {
    id: 'deep-enn-28',
    system: 'enneagram',
    prompt: 'You walk into a new settlement. What do you notice first?',
    optionList: [
      { label: 'Resources. Food, shelter, defensible positions. That is what keeps you alive', weights: { 'sp': 3 } },
      { label: 'Social dynamics. Who runs this place, who are the outsiders. That tells you everything', weights: { 'so': 3 } },
      { label: 'Whether anyone here sparks something in me', weights: { 'sx': 3 } },
    ],
  },
  {
    id: 'deep-enn-29',
    system: 'enneagram',
    prompt: 'You meet three legendary warriors. Which one impresses you most?',
    optionList: [
      { label: 'The one who survived alone in the wilds for a decade and came back unbroken', weights: { 'sp': 3 } },
      { label: 'The one who walks into any hall and every sword rallies behind them', weights: { 'so': 3 } },
      { label: 'The one who fights with such ferocity you cannot look away. Everything they do burns', weights: { 'sx': 3 } },
    ],
  },
  {
    id: 'deep-enn-30',
    system: 'enneagram',
    prompt: 'The quest is over. Looking back, when did you feel most alive during the journey?',
    optionList: [
      { label: 'The nights I had a warm fire, solid walls, and everything I needed within arm\'s reach', weights: { 'sp': 3 } },
      { label: 'The moments the party moved as one. When we were part of something bigger than ourselves', weights: { 'so': 3 } },
      { label: 'The moments of raw, unguarded connection with one person. Nothing else existed', weights: { 'sx': 3 } },
    ],
  },
] as const

// ============================================================
// MBTI — 32 Cognitive Function Questions (4 per function)
// ============================================================
// Weight keys: Ti, Te, Fi, Fe, Si, Se, Ni, Ne.
// Each question targets one function with primary weight, plus secondary cross-weights.

export const DEEP_MBTI_QUESTION_LIST: readonly QuizQuestion[] = [
  // --- Ti (4): Subjective logical criterion, internal consistency, ideas over facts ---
  {
    id: 'deep-mbti-1',
    system: 'mbti',
    prompt: 'Your party has been using a battle strategy that everyone agrees works. You notice a flaw in the underlying reasoning that nobody else sees. What do you do?',
    optionList: [
      { label: 'I cannot move forward until I have resolved the flaw in my own mind. The reasoning has to hold up, regardless of results', weights: { Ti: 3 } },
      { label: 'Check the numbers. If it is still producing results, the flaw might not matter in practice', weights: { Te: 3, Si: 1 } },
      { label: 'Bring it up with the team. If it affects people down the line, they deserve to know', weights: { Fe: 3, Ni: 1 } },
      { label: 'The flaw is interesting. It might open up an approach nobody has considered yet', weights: { Ne: 3, Ti: 1 } },
    ],
  },
  {
    id: 'deep-mbti-2',
    system: 'mbti',
    prompt: 'You have been studying an ancient text in the guild library for weeks. A companion asks when you will be done. What determines that for you?',
    optionList: [
      { label: 'When the whole thing holds together on its own terms. Every piece needs to fit with every other piece', weights: { Ti: 3, Ni: 1 } },
      { label: 'When I can actually do something useful with it. Understanding without application is just a hobby', weights: { Te: 3, Se: 1 } },
      { label: 'Done? Every answer I find raises three more questions. I am not sure it ends', weights: { Ne: 3 } },
      { label: 'When it clicks with what I have lived through myself. It has to match my own experience', weights: { Si: 3, Fi: 1 } },
    ],
  },
  {
    id: 'deep-mbti-3',
    system: 'mbti',
    prompt: 'A trusted companion makes a choice you think is deeply irrational. How do you handle it?',
    optionList: [
      { label: 'Walk them through where their reasoning breaks down. I cannot just let it go', weights: { Ti: 3, Fe: 1 } },
      { label: 'Point out the likely consequences. The outcomes speak for themselves', weights: { Te: 3, Si: 1 } },
      { label: 'Say my piece but step back. It is their life to live', weights: { Fi: 3 } },
      { label: 'Suggest alternatives they might not have seen', weights: { Ne: 3, Ti: 1 } },
    ],
  },
  {
    id: 'deep-mbti-4',
    system: 'mbti',
    prompt: 'A stranger at a tavern describes a theory about how the world works. What makes you lean in?',
    optionList: [
      { label: 'The way the pieces lock together. A clean structure draws me in even if I disagree with the conclusion', weights: { Ti: 3 } },
      { label: 'Whether it actually explains something I can go out and verify. Theory without results is just talk', weights: { Te: 3, Se: 1 } },
      { label: 'What it would mean for the people around me if it turned out to be true', weights: { Fe: 3, Fi: 1 } },
      { label: 'The loose ends. I am already wondering what else it could connect to', weights: { Ne: 3, Ni: 1 } },
    ],
  },
  // --- Te (4): Objective logical criterion, external data, proven results ---
  {
    id: 'deep-mbti-5',
    system: 'mbti',
    prompt: 'Two scouts return with conflicting reports about the safest route through enemy territory. How do you decide which to trust?',
    optionList: [
      { label: 'Whoever brought back specifics: distances, landmarks, patrol schedules. Hard details settle it', weights: { Te: 3, Si: 1 } },
      { label: 'I mentally map both routes and trust whichever account holds together better when I walk through it in my head', weights: { Ti: 3, Ni: 1 } },
      { label: 'I talk to both of them face to face. Whoever I trust more as a person, I follow', weights: { Fe: 3 } },
      { label: 'Neither, fully. I want to find a third route that accounts for what both of them might be missing', weights: { Ne: 3, Ti: 1 } },
    ],
  },
  {
    id: 'deep-mbti-6',
    system: 'mbti',
    prompt: 'You have been recommending an herb to fellow travelers for months. A healer you respect tells you it is actually harmful in certain doses. What do you do?',
    optionList: [
      { label: 'Stop recommending it immediately. If someone credible says it is harmful, I am not going to risk it', weights: { Te: 3 } },
      { label: 'I need to understand the mechanism first. I cannot just reverse course without knowing why', weights: { Ti: 3, Ni: 1 } },
      { label: 'I sit with it. Something I trusted turned out to be wrong, and I need to process that before I act', weights: { Fi: 3, Si: 1 } },
      { label: 'I ask other healers too. One person\'s warning is not enough. I want the full picture from people I trust', weights: { Fe: 3, Ne: 1 } },
    ],
  },
  {
    id: 'deep-mbti-7',
    system: 'mbti',
    prompt: 'You are recovering from a battle wound at a healer\'s lodge with nothing urgent to do. How do you spend the time?',
    optionList: [
      { label: 'Organize everything. Sort my gear, plan next month, get my affairs in order', weights: { Te: 3, Si: 1 } },
      { label: 'Finally go deep on something I have been meaning to understand properly', weights: { Ti: 3, Ni: 1 } },
      { label: 'Reach out to people. I check on friends and reconnect', weights: { Fe: 3 } },
      { label: 'Start three new hobbies and finish none of them', weights: { Ne: 3, Fi: 1 } },
    ],
  },
  {
    id: 'deep-mbti-8',
    system: 'mbti',
    prompt: 'A council is debating how to handle a failing crop system. The meeting has gone on for hours with no resolution. What frustrates you most?',
    optionList: [
      { label: 'People keep debating philosophy while the crops are dying. Someone needs to just try something and see if it works', weights: { Te: 3, Se: 1 } },
      { label: 'Nobody is questioning the assumptions. They are arguing over solutions to a problem they have not properly defined', weights: { Ti: 3 } },
      { label: 'The farmers who actually work the land have not been asked. This whole debate ignores the people it affects', weights: { Fe: 3, Fi: 1 } },
      { label: 'Everyone is stuck on two options when there are at least five approaches nobody has even mentioned', weights: { Ne: 3, Ni: 1 } },
    ],
  },
  // --- Fi (4): Subjective valuation, depth beneath stillness, inner images ---
  {
    id: 'deep-mbti-9',
    system: 'mbti',
    prompt: 'Your party has traveled together for months. How would they describe your emotional side compared to what you actually feel?',
    optionList: [
      { label: 'They think I am calmer than I am. I feel things intensely, but most of it stays inside', weights: { Fi: 3, Ni: 1 } },
      { label: 'They mostly see what I feel. I express it outward and the camp usually knows', weights: { Fe: 3, Se: 1 } },
      { label: 'They think I am less emotional than I am, which is fine. Emotions are not the point', weights: { Te: 3 } },
      { label: 'It depends on the day. I am not consistent enough for anyone to generalize', weights: { Ne: 3, Se: 1 } },
    ],
  },
  {
    id: 'deep-mbti-10',
    system: 'mbti',
    prompt: 'Something moves you deeply: a bard\'s song at dusk, a mountain vista, a quiet moment between two strangers at a fire. What happens next?',
    optionList: [
      { label: 'I hold it privately. The feeling is mine and putting it into words would diminish it', weights: { Fi: 3, Si: 1 } },
      { label: 'I want to share it. Beautiful things should be felt together', weights: { Fe: 3, Ne: 1 } },
      { label: 'I notice it, appreciate it, and move on. Lingering does not come naturally', weights: { Se: 3, Te: 1 } },
      { label: 'I try to understand why it moved me. What is the underlying pattern?', weights: { Ti: 3, Ni: 1 } },
    ],
  },
  {
    id: 'deep-mbti-11',
    system: 'mbti',
    prompt: 'Your war-band is rallying behind a cause you do not believe in. Everyone expects you to march. What do you do?',
    optionList: [
      { label: 'Quietly decline. I do not need to explain myself, but I will not pretend', weights: { Fi: 3, Ni: 1 } },
      { label: 'Go along for the group. Unity matters more than my private reservations', weights: { Fe: 3, Si: 1 } },
      { label: 'Challenge it openly. If the reasoning is bad, someone should say so', weights: { Te: 3, Ti: 1 } },
      { label: 'Propose an alternative cause. Maybe there is a better direction nobody has seen', weights: { Ne: 3, Fe: 1 } },
    ],
  },
  {
    id: 'deep-mbti-12',
    system: 'mbti',
    prompt: 'You have fought beside many companions, but only a few became true allies. What made those bonds different?',
    optionList: [
      { label: 'Something unspoken. I sensed whether they were genuine at a level I cannot fully articulate', weights: { Fi: 3 } },
      { label: 'Shared warmth. We just felt right together, like the camp was warmer with them in it', weights: { Fe: 3, Si: 1 } },
      { label: 'Mutual respect and shared goals. We fought well together and that was enough', weights: { Te: 3, Se: 1 } },
      { label: 'They made me think in new ways. Our conversations changed how I see the world', weights: { Ne: 3, Ti: 1 } },
    ],
  },
  // --- Fe (4): Objective feeling criterion, relational adjustment, social attunement ---
  {
    id: 'deep-mbti-13',
    system: 'mbti',
    prompt: 'You walk into the war council tent and immediately sense tension between two commanders. What do you do?',
    optionList: [
      { label: 'Adjust my own energy to ease the room. I naturally try to shift the emotional climate', weights: { Fe: 3 } },
      { label: 'Observe quietly. I want to understand the dynamics before getting involved', weights: { Ti: 3, Ni: 1 } },
      { label: 'Ignore it unless it affects what we need to get done', weights: { Te: 3, Se: 1 } },
      { label: 'It settles into me whether I want it to or not. Other people\'s tension becomes mine', weights: { Fi: 3, Si: 1 } },
    ],
  },
  {
    id: 'deep-mbti-14',
    system: 'mbti',
    prompt: 'You must deliver bad news to the party: a plan has failed and someone is to blame. How do you handle it?',
    optionList: [
      { label: 'I read the group and frame it carefully. How I say it matters as much as what I say', weights: { Fe: 3, Ni: 1 } },
      { label: 'I say it directly. Softening the blow usually just muddles the message', weights: { Te: 3, Se: 1 } },
      { label: 'I think carefully about whether it even needs to be said at all', weights: { Fi: 3, Ni: 1 } },
      { label: 'I lay out the facts and let everyone reach the conclusion themselves', weights: { Ti: 3, Te: 1 } },
    ],
  },
  {
    id: 'deep-mbti-15',
    system: 'mbti',
    prompt: 'Two companions you care about are in a bitter argument and both want you on their side. What do you do?',
    optionList: [
      { label: 'Mediate. I try to help both sides feel heard so the relationship can survive this', weights: { Fe: 3, Ni: 1 } },
      { label: 'Side with whoever is right. Loyalty does not override honesty', weights: { Te: 3 } },
      { label: 'Stay out of it. I refuse to be drawn into someone else\'s conflict', weights: { Fi: 3, Ti: 1 } },
      { label: 'Reframe it. Maybe they are both missing something that could bring them closer', weights: { Ne: 3, Fe: 1 } },
    ],
  },
  {
    id: 'deep-mbti-16',
    system: 'mbti',
    prompt: 'After a long day on the road with the party, you realize your mood has been shaped entirely by the group\'s spirits. How do you feel about that?',
    optionList: [
      { label: 'Normal. I have always absorbed the moods around me. It is how I stay attuned to the group', weights: { Fe: 3, Si: 1 } },
      { label: 'Annoyed. I should not be so permeable to other people\'s states', weights: { Ti: 3, Te: 1 } },
      { label: 'I barely notice. My emotional state comes from inside, not outside', weights: { Fi: 3 } },
      { label: 'I would rather channel that energy into doing something about whatever is dragging everyone down', weights: { Se: 3, Te: 1 } },
    ],
  },
  // --- Si (4): Subjective sensation, inner psychic impression, transformation of the sensory ---
  {
    id: 'deep-mbti-17',
    system: 'mbti',
    prompt: 'You return to a village you passed through years ago on an earlier quest. What stands out most?',
    optionList: [
      { label: 'The gap between what I remember and what is here now. My inner impression was its own thing', weights: { Si: 3, Fi: 1 } },
      { label: 'What is physically different. I scan for what has changed in the real environment', weights: { Se: 3, Te: 1 } },
      { label: 'A sense of what this place is becoming. I am already projecting forward', weights: { Ni: 3 } },
      { label: 'Curiosity. What new possibilities does this place hold now?', weights: { Ne: 3 } },
    ],
  },
  {
    id: 'deep-mbti-18',
    system: 'mbti',
    prompt: 'You taste a stew at a roadside inn that is identical to one you ate as a child in your home village. What happens?',
    optionList: [
      { label: 'A whole world floods back. Not just the taste, but the hearth, the light, the feeling of being small. The memory becomes more vivid than the food in front of me', weights: { Si: 3 } },
      { label: 'I focus on this version. How does the seasoning compare? Is it better, worse? I want to be fully here with what I am eating', weights: { Se: 3 } },
      { label: 'I want to tell my companions about it. The story behind the taste matters as much as the dish itself', weights: { Fe: 3, Si: 1 } },
      { label: 'It makes me think of all the versions this stew could be. What if you swapped this ingredient? What if you paired it with something unexpected?', weights: { Ne: 3, Ti: 1 } },
    ],
  },
  {
    id: 'deep-mbti-19',
    system: 'mbti',
    prompt: 'You are walking through a forest you have never visited, but something about it feels deeply familiar. What is happening?',
    optionList: [
      { label: 'The light, the smell, the crunch underfoot. It is all blending with places I have been before. The new place is layered with the old ones', weights: { Si: 3, Ni: 1 } },
      { label: 'I snap out of it and focus on what is actually here. This forest, these trees, this moment', weights: { Se: 3, Te: 1 } },
      { label: 'I am pattern-matching. My mind is filing it against categories and frameworks, not sensory memories', weights: { Ti: 3, Ni: 1 } },
      { label: 'The familiarity sparks something. I am suddenly imagining what could be around the next bend, what stories this place could hold', weights: { Ne: 3, Fi: 1 } },
    ],
  },
  {
    id: 'deep-mbti-20',
    system: 'mbti',
    prompt: 'A companion is going through a rough time after a loss and asks you to just be there for them. What comes naturally?',
    optionList: [
      { label: 'Create a sense of shelter. Warm tea, quiet presence, familiar comforts that steady them', weights: { Si: 3, Fe: 1 } },
      { label: 'Get them out. Change of scenery, fresh air, something to break the spiral', weights: { Se: 3, Ne: 1 } },
      { label: 'Problem-solve. I start looking for practical ways to address what is causing their pain', weights: { Te: 3, Si: 1 } },
      { label: 'Listen without fixing. I try to understand what they are really going through underneath', weights: { Ni: 3, Fi: 1 } },
    ],
  },
  // --- Se (4): Objective sensation, concrete present reality, intensity of the object ---
  {
    id: 'deep-mbti-21',
    system: 'mbti',
    prompt: 'You step out of the tent at dawn. The camp is quiet, mist on the ground, birds just starting. What is your experience of this moment?',
    optionList: [
      { label: 'Immediate. The cold air, the wet grass, the smoke from a dying fire. The world presses in on me and I take it all in', weights: { Se: 3 } },
      { label: 'Filtered. I notice it, but through the lens of other mornings, other camps. The mist becomes my own impression of mist', weights: { Si: 3, Fi: 1 } },
      { label: 'Background. I am already thinking about the day ahead. The camp is just scenery', weights: { Ni: 3, Ti: 1 } },
      { label: 'Scattered. I notice the bird, then the smoke, then a sound in the trees. My attention jumps between them', weights: { Ne: 3, Se: 1 } },
    ],
  },
  {
    id: 'deep-mbti-22',
    system: 'mbti',
    prompt: 'An ambush hits the camp. No time to plan, no time to think. How do you respond?',
    optionList: [
      { label: 'My body is already moving. I deal with what is right in front of me, now', weights: { Se: 3, Ti: 1 } },
      { label: 'I pause to sense the shape of the whole situation, then commit to one path', weights: { Ni: 3, Te: 1 } },
      { label: 'I draw on what has worked before. Familiar patterns guide my hands', weights: { Si: 3 } },
      { label: 'My mind races through options while my body hesitates', weights: { Ne: 3, Ti: 1 } },
    ],
  },
  {
    id: 'deep-mbti-23',
    system: 'mbti',
    prompt: 'You are at a feast after a long campaign. How do you enjoy yourself?',
    optionList: [
      { label: 'All in. The food, the noise, the bodies, the heat. I want more of everything', weights: { Se: 3, Fe: 1 } },
      { label: 'Savoring it gently. The warmth, the taste, the gratitude. I hold it close', weights: { Si: 3, Fi: 1 } },
      { label: 'Talking. I want to process what we just went through with someone', weights: { Fe: 3, Ti: 1 } },
      { label: 'Already thinking about what comes next. The feast is a pause, not a destination', weights: { Ni: 3, Te: 1 } },
    ],
  },
  {
    id: 'deep-mbti-24',
    system: 'mbti',
    prompt: 'The quest has taken you through battles, revelations, quiet nights, and wild discoveries. When did you feel most alive?',
    optionList: [
      { label: 'In the thick of it. Impact, speed, intensity. My body fully engaged with the world', weights: { Se: 3 } },
      { label: 'When something I experienced resonated so deeply it became part of me forever', weights: { Si: 3, Fi: 1 } },
      { label: 'When I finally grasped something that had been eluding me. The click of understanding', weights: { Ni: 3, Ti: 1 } },
      { label: 'When possibility exploded open and I saw paths no one else had noticed', weights: { Ne: 3 } },
    ],
  },
  // --- Ni (4): Subjective intuition, archetypal perception, the meaning behind events ---
  {
    id: 'deep-mbti-25',
    system: 'mbti',
    prompt: 'Your party is debating three possible paths forward. Everyone is weighing pros and cons, but you already have a strong pull toward one. What is driving that?',
    optionList: [
      { label: 'Something underneath the details is pointing me there. I cannot fully explain it, but I can feel how this is going to play out', weights: { Ni: 3 } },
      { label: 'I keep seeing how each path branches into more paths. I am drawn to whichever keeps the most doors open', weights: { Ne: 3, Ti: 1 } },
      { label: 'I have seen situations like this before. Past experience is telling me which one works', weights: { Si: 3, Te: 1 } },
      { label: 'I do not get pulled. I pick based on what is right in front of us: terrain, resources, threat level', weights: { Se: 3 } },
    ],
  },
  {
    id: 'deep-mbti-26',
    system: 'mbti',
    prompt: 'A raven lands on your tent pole the morning before the final battle. A companion laughs it off. You do not. Why?',
    optionList: [
      { label: 'It is not superstition. Things like this carry a weight I cannot ignore, like the world is showing me something I am supposed to notice', weights: { Ni: 3, Fi: 1 } },
      { label: 'It sets my mind racing. Not because it means something specific, but because it connects to ten other things I have been thinking about', weights: { Ne: 3, Ti: 1 } },
      { label: 'Honestly? I would laugh it off too. A raven is a raven', weights: { Se: 3, Te: 1 } },
      { label: 'It reminds me of another time something like this happened. The association is what makes it feel meaningful', weights: { Si: 3, Fi: 1 } },
    ],
  },
  {
    id: 'deep-mbti-27',
    system: 'mbti',
    prompt: 'The party is camped for the night. Something feels wrong but you have no evidence. What do you do?',
    optionList: [
      { label: 'Trust it. This kind of knowing has been right before, even when I could not explain why', weights: { Ni: 3, Fi: 1 } },
      { label: 'Brainstorm what could go wrong and prepare for multiple scenarios', weights: { Ne: 3 } },
      { label: 'Think back. Has something like this happened before?', weights: { Si: 3, Fe: 1 } },
      { label: 'Wait for actual evidence. I do not act on feelings alone', weights: { Se: 3, Te: 1 } },
    ],
  },
  {
    id: 'deep-mbti-28',
    system: 'mbti',
    prompt: 'You have realized something important about the quest that the others need to understand. How do you try to explain it?',
    optionList: [
      { label: 'I struggle. What I perceive feels too layered to put into straightforward words', weights: { Ni: 3 } },
      { label: 'I riff. One idea leads to another and I build the picture through association until they see it', weights: { Ne: 3, Fe: 1 } },
      { label: 'I ground it in specifics: what we saw, what happened, what the pattern is. I make it concrete', weights: { Te: 3, Si: 1 } },
      { label: 'I tell a story. I use our shared experience to make them feel what I mean', weights: { Fe: 3, Si: 1 } },
    ],
  },
  // --- Ne (4): Objective intuition, external possibilities, what the object could become ---
  {
    id: 'deep-mbti-29',
    system: 'mbti',
    prompt: 'A companion shares an idea around the campfire. What is your natural response?',
    optionList: [
      { label: '"Yes, and..." I immediately see five things it could become', weights: { Ne: 3 } },
      { label: '"Where does this ultimately lead?" I trace it to its deepest implication', weights: { Ni: 3, Ti: 1 } },
      { label: '"Show me it working." I want proof, not potential', weights: { Te: 3, Si: 1 } },
      { label: '"How does this sit with me?" I check whether it feels right', weights: { Fi: 3, Si: 1 } },
    ],
  },
  {
    id: 'deep-mbti-30',
    system: 'mbti',
    prompt: 'After a devastating defeat, what helps you recover?',
    optionList: [
      { label: 'Seeing what else this could lead to. Every dead end reveals new directions', weights: { Ne: 3, Fi: 1 } },
      { label: 'Reconnecting with the bigger picture. One failure does not change where I am headed', weights: { Ni: 3, Te: 1 } },
      { label: 'Returning to solid ground. Familiar routines and proven methods steady me', weights: { Si: 3, Te: 1 } },
      { label: 'Doing something physical. I need to move and burn it off', weights: { Se: 3, Ti: 1 } },
    ],
  },
  {
    id: 'deep-mbti-31',
    system: 'mbti',
    prompt: 'You arrive in a new city with no plans and an open day. How do you spend it?',
    optionList: [
      { label: 'I wander. Every alley could lead somewhere unexpected, every stranger could have a story. I let the city pull me wherever it wants', weights: { Ne: 3 } },
      { label: 'I find one place that draws me and go deep. I would rather know one neighborhood intimately than skim ten', weights: { Ni: 3, Si: 1 } },
      { label: 'I check what is actually worth seeing. I am not going to waste time wandering when I could be strategic about it', weights: { Te: 3, Se: 1 } },
      { label: 'I follow what resonates. If a bookshop or garden speaks to me, I stop. If nothing does, I keep moving', weights: { Fi: 3, Si: 1 } },
    ],
  },
  {
    id: 'deep-mbti-32',
    system: 'mbti',
    prompt: 'You are locked in a dungeon cell waiting for your companions to find you. Nothing to do but sit. What happens in your head?',
    optionList: [
      { label: 'I start inventing. What built this place? What if that crack in the wall leads somewhere? My mind fills the emptiness with possibilities', weights: { Ne: 3 } },
      { label: 'I follow one thought deeper and deeper, like pulling a thread. Hours disappear into a single idea', weights: { Ni: 3, Ti: 1 } },
      { label: 'Vivid memories surface. Places I have been, textures I remember, sounds from years ago play like a private film', weights: { Si: 3, Fi: 1 } },
      { label: 'I get restless. I am pacing, testing the bars, examining every stone. I need something physical to engage with', weights: { Se: 3 } },
    ],
  },
] as const

// ============================================================
// SOCIONICS — 22 Questions (8 quadra + 4 club + 10 Augusta ie)
// ============================================================
// Quadra values (8), Club (4), Socionics-specific information elements (10).
// ie_Ti, ie_Te, ie_Ne are cross-scored from MBTI cognitive function answers
// (these overlap strongly between Jung/Beebe and Augusta).
// ie_Se, ie_Si, ie_Ni, ie_Fe, ie_Fi use Socionics-specific questions
// that test Augusta's divergent definitions.

export const DEEP_SOCIONICS_QUESTION_LIST: readonly QuizQuestion[] = [
  // --- Quadra values (8) ---
  {
    id: 'deep-soc-1',
    system: 'socionics',
    prompt: 'Your party has been traveling together for weeks. One evening, the group falls into its natural rhythm around the fire. What does that rhythm look like?',
    optionList: [
      { label: 'Swapping theories and riddles, debating ideas just for the joy of it. Someone keeps making everyone laugh', weights: { Alpha: 3 } },
      { label: 'Recounting battles and rallying around the next mission. There is fire in every voice', weights: { Beta: 3 } },
      { label: 'Everyone working on their own thing, occasionally comparing progress. Respect, not neediness', weights: { Gamma: 3 } },
      { label: 'Quiet conversations in pairs. Someone is mending gear while someone else hums a tune. It is gentle', weights: { Delta: 3 } },
    ],
  },
  {
    id: 'deep-soc-2',
    system: 'socionics',
    prompt: 'A new territory has been claimed and the party must decide how to govern the settlers who follow. What structure do you push for?',
    optionList: [
      { label: 'Open councils where anyone can speak and ideas are tested freely before decisions are made', weights: { Alpha: 3 } },
      { label: 'A strong central leader with a clear chain of command. Order requires authority', weights: { Beta: 3 } },
      { label: 'Let the market decide. People who produce results rise naturally', weights: { Gamma: 3 } },
      { label: 'Small, self-governing communities where people know and take care of each other', weights: { Delta: 3 } },
    ],
  },
  {
    id: 'deep-soc-3',
    system: 'socionics',
    prompt: 'You visit four legendary guilds, each with a different culture. Which one feels like home?',
    optionList: [
      { label: 'The Explorers\' Lodge — walls covered in maps and curiosities, members debating wild theories over wine', weights: { Alpha: 3 } },
      { label: 'The Iron Order — a disciplined brotherhood bound by oaths, purpose, and shared sacrifice', weights: { Beta: 3 } },
      { label: 'The Merchant Princes — independent operators who respect skill, reward ambition, and waste no time on sentiment', weights: { Gamma: 3 } },
      { label: 'The Hearthkeepers — craftspeople and healers who build things that last and take care of their own', weights: { Delta: 3 } },
    ],
  },
  {
    id: 'deep-soc-4',
    system: 'socionics',
    prompt: 'The party must cross a cursed forest. Rumors say it drives groups apart with paranoia and mistrust. What do you suggest to hold the group together?',
    optionList: [
      { label: 'Stay talking. Keep the conversation going, keep ideas flowing. Silence is where the curse creeps in', weights: { Alpha: 3 } },
      { label: 'Strengthen the hierarchy. Everyone knows their role, follows the leader, no hesitation', weights: { Beta: 3 } },
      { label: 'Trust each person to handle themselves. Micromanaging will make the paranoia worse', weights: { Gamma: 3 } },
      { label: 'Check in on each other quietly. Small gestures of care keep people grounded', weights: { Delta: 3 } },
    ],
  },
  {
    id: 'deep-soc-5',
    system: 'socionics',
    prompt: 'You are building a new settlement from scratch. What do you prioritize in the first month?',
    optionList: [
      { label: 'A gathering hall. Somewhere people can share ideas, debate, and enjoy each other\'s company', weights: { Alpha: 3 } },
      { label: 'Walls and a watchtower. Security first, and a place to rally when threats come', weights: { Beta: 3 } },
      { label: 'A marketplace. Let people trade, compete, and build wealth. Prosperity draws more settlers', weights: { Gamma: 3 } },
      { label: 'Homes and gardens. People need comfort and roots before they can do anything else', weights: { Delta: 3 } },
    ],
  },
  {
    id: 'deep-soc-6',
    system: 'socionics',
    prompt: 'A neighboring kingdom sends an envoy offering an alliance. What concerns you most about the terms?',
    optionList: [
      { label: 'Whether we keep intellectual freedom. I will not sign away our right to question and innovate', weights: { Alpha: 3 } },
      { label: 'Whether we maintain our sovereignty. An alliance that weakens our authority is a trap', weights: { Beta: 3 } },
      { label: 'Whether the deal is profitable. Alliances should make both sides stronger, not create dependence', weights: { Gamma: 3 } },
      { label: 'Whether it respects our people. A treaty that disrupts ordinary lives is not worth the parchment', weights: { Delta: 3 } },
    ],
  },
  {
    id: 'deep-soc-7',
    system: 'socionics',
    prompt: 'The party wins a great victory. How does the celebration unfold?',
    optionList: [
      { label: 'A feast of ideas and laughter. People toast, tell stories, and argue philosophy until dawn', weights: { Alpha: 3 } },
      { label: 'A passionate rally. Speeches, songs of glory, and oaths sworn for the battles ahead', weights: { Beta: 3 } },
      { label: 'Individual recognition. Each person\'s contribution is acknowledged and rewarded on merit', weights: { Gamma: 3 } },
      { label: 'A quiet gathering. Close friends share a meal, grateful to be alive and together', weights: { Delta: 3 } },
    ],
  },
  {
    id: 'deep-soc-8',
    system: 'socionics',
    prompt: 'You have the chance to apprentice under one of four legendary figures. Who do you choose?',
    optionList: [
      { label: 'The Philosopher-Mage — brilliant and playful, always asking "what if?" and delighting in the impossible', weights: { Alpha: 3 } },
      { label: 'The War-Marshal — commanding and visionary, who turned a ragged rebellion into an empire through sheer force of will', weights: { Beta: 3 } },
      { label: 'The Self-Made King — who started with nothing, built a fortune through cunning and skill, and answers to no one', weights: { Gamma: 3 } },
      { label: 'The Village Elder — gentle and wise, who healed a broken community and taught people to sustain themselves', weights: { Delta: 3 } },
    ],
  },
  // --- Club (4) ---
  {
    id: 'deep-soc-9',
    system: 'socionics',
    prompt: 'In a new settlement, what role would you most naturally fill?',
    optionList: [
      { label: 'Scholar or strategist, analyzing problems and finding solutions', weights: { Researcher: 3 } },
      { label: 'Counselor or diplomat, managing relationships and social harmony', weights: { Social: 3 } },
      { label: 'Builder or craftsman, making things work and solving practical problems', weights: { Practical: 3 } },
      { label: 'Healer or teacher, nurturing others and helping them grow', weights: { Humanitarian: 3 } },
    ],
  },
  {
    id: 'deep-soc-10',
    system: 'socionics',
    prompt: 'When the party needs to solve a complex problem, what is your contribution?',
    optionList: [
      { label: 'Theoretical insight. I see the underlying structure others miss', weights: { Researcher: 3 } },
      { label: 'Social intelligence. I know who to talk to and how to navigate people', weights: { Social: 3 } },
      { label: 'Hands-on execution. I build the thing, fix the thing, make it real', weights: { Practical: 3 } },
      { label: 'Emotional support. I keep morale up and make sure no one is forgotten', weights: { Humanitarian: 3 } },
    ],
  },
  {
    id: 'deep-soc-11',
    system: 'socionics',
    prompt: 'After a long campaign, what kind of contribution made you feel most fulfilled?',
    optionList: [
      { label: 'The discoveries. Deciphering the map, cracking the riddle, understanding the enemy', weights: { Researcher: 3 } },
      { label: 'Holding the group together. Organizing, rallying, keeping everyone connected', weights: { Social: 3 } },
      { label: 'Building and fixing things. The bridge I repaired, the trap I built, the blade I forged', weights: { Practical: 3 } },
      { label: 'Helping individuals. The wounds I tended, the lessons I taught, the people I guided', weights: { Humanitarian: 3 } },
    ],
  },
  {
    id: 'deep-soc-12',
    system: 'socionics',
    prompt: 'If your companions had to describe what you bring to the party in one phrase, what would they say?',
    optionList: [
      { label: 'They see the patterns no one else does', weights: { Researcher: 3 } },
      { label: 'They know how to read a room and move people', weights: { Social: 3 } },
      { label: 'They get things done. No fuss, no wasted effort', weights: { Practical: 3 } },
      { label: 'They take care of everyone. No one gets left behind', weights: { Humanitarian: 3 } },
    ],
  },
  // --- Information Elements: Se (2) — Augusta's VOLITIONAL sensing ---
  // Power dynamics, force, "who will overcome whom", claiming/defending territory.
  // Diverges from MBTI Se (concrete sensory immersion).
  {
    id: 'deep-soc-13',
    system: 'socionics',
    prompt: 'Two merchants are arguing over a stall in the market. One is bigger and louder; the other is calmer but has more allies watching from nearby. You are passing by. What catches your attention?',
    optionList: [
      { label: 'Who would win if this escalated. The bigger one has presence, but the calm one has backup. I am reading the balance of force', weights: { ie_Se: 3 } },
      { label: 'The crowd\'s reaction. Some people are tense, others entertained. The emotional temperature of the whole scene pulls me in', weights: { ie_Fe: 3, ie_Ni: 1 } },
      { label: 'Where this is heading. I can already see how this ends. One of them is about to overplay their hand', weights: { ie_Ni: 3, ie_Ti: 1 } },
      { label: 'Who I would side with. One of them feels right to me and the other feels off. I know immediately, even without all the facts', weights: { ie_Fi: 3, ie_Si: 1 } },
    ],
  },
  {
    id: 'deep-soc-14',
    system: 'socionics',
    prompt: 'A newcomer to your group starts quietly taking on leadership tasks nobody assigned them: organizing supplies, giving orders, rearranging the watch schedule. What do you do?',
    optionList: [
      { label: 'Push back directly. If they want authority, they need to earn it from me, not just take it', weights: { ie_Se: 3 } },
      { label: 'Watch and wait. If they are competent, this might work out. I will step in only when the moment is right', weights: { ie_Ni: 3, ie_Te: 1 } },
      { label: 'Bring it up with the group. This affects everyone, and people should voice how they feel about it', weights: { ie_Fe: 3, ie_Se: 1 } },
      { label: 'Let it go unless it disrupts what is already working. Stability matters more than who is in charge', weights: { ie_Si: 3, ie_Ne: 1 } },
    ],
  },
  // --- Information Elements: Si (2) — Augusta's EXPERIENTIAL sensing ---
  // Comfort, bodily wellbeing, aesthetic harmony, quality of physical exchange with environment.
  // Diverges from MBTI Si (subjective psychic impression of sensation).
  {
    id: 'deep-soc-15',
    system: 'socionics',
    prompt: 'After a grueling week of travel, your group finds an inn. Everyone rushes to the tavern to celebrate. What do you do first?',
    optionList: [
      { label: 'Find my room and get settled. Wash up, lay out clean clothes, sort the bed. I need my body comfortable before I can enjoy anything else', weights: { ie_Si: 3 } },
      { label: 'Join the celebration. The noise, the drink, the crowd. After a week like that, I want to feel the intensity of being alive', weights: { ie_Se: 3 } },
      { label: 'Head to the tavern for the people, not the drinks. Being around friends who are happy fills me back up', weights: { ie_Fe: 3, ie_Si: 1 } },
      { label: 'Find a quiet corner. I need to sit with my thoughts and decompress before I do anything social', weights: { ie_Ni: 2, ie_Ne: 1 } },
    ],
  },
  {
    id: 'deep-soc-16',
    system: 'socionics',
    prompt: 'You are setting up a war table for a long campaign. What do you focus on?',
    optionList: [
      { label: 'Getting the feel right. The chair, the lighting, the temperature. If my body is not at ease, my mind will not work either', weights: { ie_Si: 3 } },
      { label: 'I do not fuss with the space. I clear my head and start. The work itself pulls me in regardless of surroundings', weights: { ie_Ni: 3, ie_Ti: 1 } },
      { label: 'Making it functional. Everything I need within arm\'s reach, nothing extra in the way', weights: { ie_Se: 2, ie_Te: 1 } },
      { label: 'I want something stimulating around me. Art on the walls, music playing, a window with a view. The space should have energy', weights: { ie_Se: 3, ie_Ne: 1 } },
    ],
  },
  // --- Information Elements: Ni (2) — Augusta's TEMPORAL intuition ---
  // Causal sequencing, timing, felt sense of whether the moment is right.
  // Diverges from MBTI Ni (archetypal vision, perceiving the unconscious).
  {
    id: 'deep-soc-17',
    system: 'socionics',
    prompt: 'Your group has been planning a raid for weeks. The morning of, your gut tells you today is not the day, even though nothing has visibly changed. What do you do?',
    optionList: [
      { label: 'Call it off, or at least delay. I have learned the hard way that when something feels mistimed, forcing it makes everything worse', weights: { ie_Ni: 3 } },
      { label: 'Go anyway. Hesitation kills momentum, and we have prepared for this. You cannot wait for a feeling to pass', weights: { ie_Se: 3 } },
      { label: 'Check the plan one more time. If the variables still add up, we go. A feeling does not override preparation', weights: { ie_Se: 2, ie_Te: 1 } },
      { label: 'Talk to the others. Maybe someone else senses it too, or maybe they will help me see what I am picking up on', weights: { ie_Fe: 3, ie_Ne: 1 } },
    ],
  },
  {
    id: 'deep-soc-18',
    system: 'socionics',
    prompt: 'A companion is about to leave the party to pursue a dangerous quest alone. How do you think about what to tell them?',
    optionList: [
      { label: 'I walk the chain forward in my mind. If they do this, then that follows, and that leads to... I can see where this road ends before they take the first step', weights: { ie_Ni: 3 } },
      { label: 'I think about all the different ways it could unfold. There is no single outcome, so I help them see the range of what is possible', weights: { ie_Fe: 2, ie_Ne: 1 } },
      { label: 'I think about people I know who made similar choices. Real examples are worth more than speculation', weights: { ie_Si: 3, ie_Te: 1 } },
      { label: 'I tell them to trust what feels right and commit fully. Overthinking the future just leads to paralysis', weights: { ie_Se: 3, ie_Fi: 1 } },
    ],
  },
  // --- Information Elements: Fe (2) — Augusta's ETHICS OF EMOTIONS ---
  // Emotional energy dynamics, actively inducing moods, changing emotional temperature.
  // Diverges from MBTI Fe (adjusting feeling-judgment to social values).
  {
    id: 'deep-soc-19',
    system: 'socionics',
    prompt: 'Your travel party is exhausted and morale is collapsing. Nobody is fighting, but nobody is talking either. The silence feels heavy. What do you do?',
    optionList: [
      { label: 'Break the silence. I start singing, tell a ridiculous story, or pick a mock argument with someone. The mood needs to move, and I can make that happen', weights: { ie_Fe: 3 } },
      { label: 'Sit next to the person who looks worst and just be with them. I cannot change the whole group, but I can be real with one person', weights: { ie_Fi: 3, ie_Si: 1 } },
      { label: 'Call a halt and address the practical cause. Are we lost? Hungry? Low on water? Fix the problem and the mood fixes itself', weights: { ie_Se: 2, ie_Te: 1 } },
      { label: 'Leave it alone. People process at their own speed. Performing cheer right now would feel hollow and make it worse', weights: { ie_Ni: 3, ie_Ti: 1 } },
    ],
  },
  {
    id: 'deep-soc-20',
    system: 'socionics',
    prompt: 'The feast after a victory started lively but has gone flat. People are drifting off to their tents. How do you respond?',
    optionList: [
      { label: 'I turn it around. I shift the conversation, raise the energy, pull people into something new. I can feel what the room needs and I give it', weights: { ie_Fe: 3 } },
      { label: 'The flat mood settles into me and I cannot shake it. Even if I try to stay upbeat, their energy drags me down', weights: { ie_Fi: 3, ie_Ni: 1 } },
      { label: 'I notice the shift but stay in my own headspace. I am not going to chase a mood I did not create', weights: { ie_Ni: 2, ie_Ti: 1 } },
      { label: 'If nothing interesting is happening, I suggest we do something instead of just standing around. Activity beats atmosphere', weights: { ie_Se: 2, ie_Te: 1 } },
    ],
  },
  // --- Information Elements: Fi (2) — Augusta's ETHICS OF RELATIONS ---
  // Relational distances, attraction/repulsion, discrete categories of connection (friend/enemy/ally).
  // Diverges from MBTI Fi (deep invisible inner valuation, archetypal depth).
  {
    id: 'deep-soc-21',
    system: 'socionics',
    prompt: 'Three new recruits join your war-band. After ten minutes around the fire, you already feel differently about each of them. What is going on?',
    optionList: [
      { label: 'I have already sorted them. One feels like a potential ally, one is neutral, one I want distance from. I do not choose this. It just happens, like a compass settling', weights: { ie_Fi: 3 } },
      { label: 'I have been watching how they interact with the room. The way someone treats a stranger tells me everything about what to expect', weights: { ie_Fe: 3, ie_Se: 1 } },
      { label: 'I am sizing them up by what they have actually said and done. Talk is cheap. I am watching for competence and follow-through', weights: { ie_Se: 2, ie_Te: 1 } },
      { label: 'I am keeping all doors open. Ten minutes is not enough to pin someone down. People reveal themselves over time', weights: { ie_Fe: 2, ie_Ne: 1 } },
    ],
  },
  {
    id: 'deep-soc-22',
    system: 'socionics',
    prompt: 'If you drew a map of every companion and ally you have known, what would it look like?',
    optionList: [
      { label: 'Concentric circles. Inner ring, outer ring, and people I keep outside the walls entirely. Everyone has a place and I know exactly where they stand', weights: { ie_Fi: 3 } },
      { label: 'A web. Everyone connects to everyone else, and I think about how the whole network functions: who brings energy, who creates tension', weights: { ie_Fe: 3, ie_Ne: 1 } },
      { label: 'A timeline. The people who matter most are the ones I have been through things with. Shared history is what makes a bond real', weights: { ie_Si: 3, ie_Fi: 1 } },
      { label: 'A trajectory. I care most about where we are going together, not where we have been', weights: { ie_Ni: 3, ie_Te: 1 } },
    ],
  },
] as const

// ============================================================
// EXPANDED INSTINCTS — 18 Questions (6 center + 12 realm)
// ============================================================

export const DEEP_INSTINCT_CENTER_QUESTION_LIST: readonly QuizQuestion[] = [
  {
    id: 'deep-inst-1',
    system: 'instincts',
    prompt: 'You have lost everything: your home, your allies, your name. You stand at a crossroads with nothing. What pulls you forward?',
    optionList: [
      { label: 'The need to survive. I will rebuild from the ground up because my body refuses to stop', weights: { SUR: 3 } },
      { label: 'The need to find someone. I cannot do this alone, and there must be someone out there', weights: { INT: 3 } },
      { label: 'The need to understand why. If I can find meaning in this, I can endure anything', weights: { PUR: 3 } },
    ],
  },
  {
    id: 'deep-inst-2',
    system: 'instincts',
    prompt: 'You wander into a forgotten temple. Three shrines stand before you, each radiating a different power. Which draws you?',
    optionList: [
      { label: 'The shrine of iron and stone. You feel your body strengthen, your senses sharpen. Nothing could break you here', weights: { SUR: 3 } },
      { label: 'The shrine of woven threads. Every bond you have ever formed pulses with warmth, as if every person who ever mattered is standing behind you', weights: { INT: 3 } },
      { label: 'The shrine of a single burning star. A vision of your true path unfolds, clear and undeniable. You know exactly why you exist', weights: { PUR: 3 } },
    ],
  },
  {
    id: 'deep-inst-3',
    system: 'instincts',
    prompt: 'A dark mage offers you a bargain: they will spare your companions, but you must endure one curse for a year. Which do you dread most?',
    optionList: [
      { label: 'A body that weakens daily. Unable to run, fight, or sustain myself', weights: { SUR: 3 } },
      { label: 'Total isolation. No one can see or hear me for an entire year', weights: { INT: 3 } },
      { label: 'A fog that erases all sense of purpose. I go through the motions but nothing matters', weights: { PUR: 3 } },
    ],
  },
  {
    id: 'deep-inst-4',
    system: 'instincts',
    prompt: 'You have felt truly alive only a handful of times on your journey. What was happening?',
    optionList: [
      { label: 'My body was strong, my camp was secure, and I had everything I needed within arm\'s reach. The world could not touch me', weights: { SUR: 3 } },
      { label: 'I was in deep connection with someone. Walls down, nothing between us. The rest of the world fell away and I was fully seen', weights: { INT: 3 } },
      { label: 'I was on the edge of something meaningful. A discovery, a realization, a moment where my existence felt like it had direction and weight', weights: { PUR: 3 } },
    ],
  },
  {
    id: 'deep-inst-5',
    system: 'instincts',
    prompt: 'A siege destroys everything: your home, your bonds, your sense of direction. What do you rebuild first?',
    optionList: [
      { label: 'My material foundation. Shelter, food, defenses. Without a body that is safe and fed, nothing else can follow', weights: { SUR: 3 } },
      { label: 'My relationships. I seek out whoever survived, or I find new people to trust. I cannot rebuild alone', weights: { INT: 3 } },
      { label: 'My sense of purpose. I need to know why I am rebuilding before I lay the first stone', weights: { PUR: 3 } },
    ],
  },
  {
    id: 'deep-inst-6',
    system: 'instincts',
    prompt: 'A spirit reads your soul and names the thing you have spent your whole life trying to fill. What does it say?',
    optionList: [
      { label: 'You have never felt truly safe. You are always bracing for what comes next', weights: { SUR: 3 } },
      { label: 'You have never felt truly held. You move through the world without real roots in anyone', weights: { INT: 3 } },
      { label: 'You have never felt truly significant. You fear your life will pass without weight or direction', weights: { PUR: 3 } },
    ],
  },
] as const

// Realm questions: 4 per center (12 total, dynamically loaded after center determined)

const DEEP_SUR_REALM_QUESTION_LIST: readonly QuizQuestion[] = [
  {
    id: 'deep-inst-sur-1',
    system: 'instincts',
    prompt: 'Your party is crossing a mountain pass when an avalanche buries the trail behind you. Supplies are low, the cold is brutal, and the way forward is uncertain. How do you lead?',
    optionList: [
      { label: 'I take point, break trail through the snow, and set the pace. My body can handle more than the others think. We stop when I stop', weights: { FD: 3 } },
      { label: 'We find shelter immediately. A cave, an overhang, anything. We do not move again until I have scouted the route ahead and confirmed it is passable', weights: { SY: 3 } },
      { label: 'I inventory everything we have: food, fuel, clothing. I calculate how many days we can last and ration accordingly. Panic is the enemy, not the mountain', weights: { SM: 3 } },
    ],
  },
  {
    id: 'deep-inst-sur-2',
    system: 'instincts',
    prompt: 'You wake in the middle of the night to find your camp surrounded by wolves. The fire is dying and your companions are asleep. What do you do?',
    optionList: [
      { label: 'Stand up, grab a torch, and face them down. Wolves respect something that does not flinch. I make myself large and loud', weights: { FD: 3, SM: 1 } },
      { label: 'Wake the others silently. Alone I am prey; together we are a wall. I position everyone with their backs to the fire', weights: { SY: 3, FD: 1 } },
      { label: 'Feed the fire first. A strong blaze keeps them at distance while I calmly rouse the camp and organize a watch rotation', weights: { SM: 3, SY: 1 } },
    ],
  },
  {
    id: 'deep-inst-sur-3',
    system: 'instincts',
    prompt: 'A plague sweeps through the settlement where your party is resting. People are falling ill, supplies are being hoarded, and fear is spreading faster than the sickness. What do you focus on?',
    optionList: [
      { label: 'I make sure my own body stays strong. I train, eat well, and keep my constitution up. I cannot help anyone if I go down first', weights: { FD: 3 } },
      { label: 'I secure what we need before it is gone. Clean water, medicine, a defensible space. Survival is about being prepared before the worst arrives', weights: { SY: 3 } },
      { label: 'I set up systems. Quarantine protocols, supply distribution, rest schedules. Chaos kills more people than the plague will', weights: { SM: 3 } },
    ],
  },
  {
    id: 'deep-inst-sur-4',
    system: 'instincts',
    prompt: 'You have been traveling alone for weeks through hostile territory. You finally reach a safe haven. What is the first thing you notice about yourself?',
    optionList: [
      { label: 'How much my body endured. The scars, the calluses, the muscles that hardened on the road. I am tougher than when I left', weights: { FD: 3, SY: 1 } },
      { label: 'How hyper-aware I became. I was reading every shadow, every sound, every shift in the wind. That vigilance kept me alive and it has not turned off yet', weights: { SY: 3, SM: 1 } },
      { label: 'How disciplined I became. Every meal was measured, every rest was timed, every movement was efficient. I turned myself into a machine to survive', weights: { SM: 3, FD: 1 } },
    ],
  },
]

const DEEP_INT_REALM_QUESTION_LIST: readonly QuizQuestion[] = [
  {
    id: 'deep-inst-int-1',
    system: 'instincts',
    prompt: 'A powerful enchantress offers to permanently strengthen one aspect of how you connect with others. What do you choose?',
    optionList: [
      { label: 'Every meeting with another person becomes a catalyst. Something shifts, something grows. No encounter is ever wasted', weights: { AY: 3 } },
      { label: 'My people can never be scattered. Wherever I go, community forms around me. I am never without a circle', weights: { CY: 3 } },
      { label: 'The one bond that matters most becomes unbreakable. Distance, time, conflict, nothing can sever it', weights: { BG: 3 } },
    ],
  },
  {
    id: 'deep-inst-int-2',
    system: 'instincts',
    prompt: 'Your party has been on the road for months with no contact with the outside world. You finally arrive at a thriving city. What do you crave most?',
    optionList: [
      { label: 'New faces. I want to meet people who think differently, who challenge me, who make me see myself in a new way', weights: { AY: 3, CY: 1 } },
      { label: 'A gathering. A tavern full of people, a festival, a place where I can be part of something. I have been isolated too long', weights: { CY: 3, BG: 1 } },
      { label: 'One real conversation. Not small talk. I want to find someone and go deep. One genuine connection is worth more than a hundred introductions', weights: { BG: 3, AY: 1 } },
    ],
  },
  {
    id: 'deep-inst-int-3',
    system: 'instincts',
    prompt: 'Two factions in your war-band are threatening to split. Both sides want you to choose. How do you handle it?',
    optionList: [
      { label: 'I bring the leaders together and force the real conversation. Conflict is where growth happens, and this band needs to transform or it was never real', weights: { AY: 3 } },
      { label: 'I remind everyone what we share. Our story, our mission, our rituals. I organize a feast, a ceremony, something that makes us feel like one again', weights: { CY: 3 } },
      { label: 'I go to the person I am closest to and make sure that bond is solid first. If my anchor holds, I can weather whatever the group decides', weights: { BG: 3 } },
    ],
  },
  {
    id: 'deep-inst-int-4',
    system: 'instincts',
    prompt: 'You are dying. You have enough strength for one last act. What do you do?',
    optionList: [
      { label: 'I speak the truth I have been holding back. The words that could change someone. If my last act can transform even one person, it was worth it', weights: { AY: 3 } },
      { label: 'I gather my people. I want to see every face one more time and know that what we built together will outlast me', weights: { CY: 3 } },
      { label: 'I find the one person. I hold their hand and say everything I never said. Nothing else matters in this moment', weights: { BG: 3 } },
    ],
  },
]

const DEEP_PUR_REALM_QUESTION_LIST: readonly QuizQuestion[] = [
  {
    id: 'deep-inst-pur-1',
    system: 'instincts',
    prompt: 'You stand before the gates of the afterlife. A guardian asks: what made your life worth the living? What do you answer?',
    optionList: [
      { label: 'I became someone. Not just anyone who passed through. I carved my name into the world and it will not fade', weights: { SS: 3 } },
      { label: 'I saw clearly. While others stumbled through illusions, I stripped away the lies and found what was real', weights: { EX: 3 } },
      { label: 'I walked into the dark. I went where no map led and found things no one else has seen', weights: { UN: 3 } },
    ],
  },
  {
    id: 'deep-inst-pur-2',
    system: 'instincts',
    prompt: 'You discover an ancient library that will burn at dawn. You can save one book. How do you choose?',
    optionList: [
      { label: 'The one that tells me who I was meant to be. A prophecy, a lineage, a destiny. I need to know my place in the story', weights: { SS: 3, EX: 1 } },
      { label: 'The one that explains the deepest truth about the world. The nature of the gods, the structure of reality. I want understanding above all', weights: { EX: 3, UN: 1 } },
      { label: 'The one written in a language no one has ever seen. Even if I cannot read it now, it points somewhere no one has gone. That is worth more than any answer', weights: { UN: 3, SS: 1 } },
    ],
  },
  {
    id: 'deep-inst-pur-3',
    system: 'instincts',
    prompt: 'You complete the quest you have spent your entire life pursuing, and it turns out to mean nothing. The artifact is a fake. The prophecy was a lie. What happens to you?',
    optionList: [
      { label: 'I grieve, then I begin again. If this purpose was false, I will forge a real one. I refuse to be no one', weights: { SS: 3 } },
      { label: 'I examine the wreckage for what is actually true. Even a lie can teach you something about reality, and that lesson is never wasted', weights: { EX: 3 } },
      { label: 'I feel a strange relief. The map was wrong, which means the territory is still uncharted. I set out again with no destination and it feels like freedom', weights: { UN: 3 } },
    ],
  },
  {
    id: 'deep-inst-pur-4',
    system: 'instincts',
    prompt: 'On your deathbed, a spirit offers you one final vision. What do you ask to see?',
    optionList: [
      { label: 'Show me how I will be remembered. Show me the mark I left on the world and tell me it mattered', weights: { SS: 3 } },
      { label: 'Show me the truth I was closest to grasping. The one that was always just out of reach', weights: { EX: 3 } },
      { label: 'Show me what lies beyond. Not the afterlife I expect, but what I could never have imagined', weights: { UN: 3 } },
    ],
  },
]

const DEEP_REALM_QUESTION_MAP: Record<InstinctCenter, readonly QuizQuestion[]> = {
  SUR: DEEP_SUR_REALM_QUESTION_LIST,
  INT: DEEP_INT_REALM_QUESTION_LIST,
  PUR: DEEP_PUR_REALM_QUESTION_LIST,
}

/** Get the 4 realm-specific deep questions for a determined instinct center. */
export function getLongInstinctRealmQuestionList(center: InstinctCenter): readonly QuizQuestion[] {
  return DEEP_REALM_QUESTION_MAP[center]
}

// ============================================================
// QUESTION LIST BUILDER
// ============================================================

/** Get the full ordered deep question list for a set of enabled systems. */
export function getLongQuestionList(enabledSystems: Record<SystemId, boolean>): QuizQuestion[] {
  const questionList: QuizQuestion[] = []

  if (enabledSystems.attitudinal) {
    questionList.push(...DEEP_AP_QUESTION_LIST)
  }
  if (enabledSystems.enneagram) {
    questionList.push(...DEEP_ENNEAGRAM_QUESTION_LIST)
  }
  if (enabledSystems.mbti) {
    questionList.push(...DEEP_MBTI_QUESTION_LIST)
  }
  if (enabledSystems.socionics) {
    questionList.push(...DEEP_SOCIONICS_QUESTION_LIST)
  }
  if (enabledSystems.instincts) {
    questionList.push(...DEEP_INSTINCT_CENTER_QUESTION_LIST)
    // Realm questions are added dynamically after center is determined
  }

  return questionList
}

// ============================================================
// DEEP QUESTION COUNTS (for UI display)
// ============================================================

export const DEEP_QUESTION_COUNT: Record<SystemId, number> = {
  attitudinal: 12,
  enneagram: 30,
  mbti: 32,
  socionics: 22,
  instincts: 18, // 6 center + 4 realm (12 total exist, 4 shown dynamically)
}
