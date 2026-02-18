import type { SystemId, InstinctCenter } from '../../engine/types.ts'
import type { QuizQuestion } from './types.ts'

// ============================================================
// ATTITUDINAL PSYCHE — 6 Pairwise Comparison Questions
// ============================================================
// One question for each pair: V vs L, V vs E, V vs F, L vs E, L vs F, E vs F.
// Chosen option gives +1 win to that aspect.

export const AP_QUESTION_LIST: readonly QuizQuestion[] = [
  {
    id: 'ap-1',
    system: 'attitudinal',
    prompt: 'A cursed wood splits into two paths. One leads to a throne, the other to a library holding every secret in the world. Which do you take?',
    optionList: [
      { label: 'The throne. My will shapes the world', weights: { V: 1 } },
      { label: 'The library. Knowledge outlasts everything', weights: { L: 1 } },
    ],
  },
  {
    id: 'ap-2',
    system: 'attitudinal',
    prompt: 'A dying god offers one last gift. Which do you claim?',
    optionList: [
      { label: 'Unbreakable will. Fate bends to those who refuse to', weights: { V: 1 } },
      { label: 'Depth of feeling. It could move mountains', weights: { E: 1 } },
    ],
  },
  {
    id: 'ap-3',
    system: 'attitudinal',
    prompt: 'Deep in an underground forge, you can claim one of two things. Which do you take?',
    optionList: [
      { label: 'Command of a vast army. Power flows through people', weights: { V: 1 } },
      { label: 'A body that never breaks. I am my own fortress', weights: { F: 1 } },
    ],
  },
  {
    id: 'ap-4',
    system: 'attitudinal',
    prompt: 'A riddle-spirit offers you a gift. Which do you accept?',
    optionList: [
      { label: 'Perfect reasoning. Every puzzle yields to my mind', weights: { L: 1 } },
      { label: 'Perfect empathy. Every heart opens to me', weights: { E: 1 } },
    ],
  },
  {
    id: 'ap-5',
    system: 'attitudinal',
    prompt: 'A cursed mirror shows two futures. Which reflection do you step into?',
    optionList: [
      { label: 'The sharp mind. No enchantment could hold me', weights: { L: 1 } },
      { label: 'The tireless body. Pain and fatigue become memories', weights: { F: 1 } },
    ],
  },
  {
    id: 'ap-6',
    system: 'attitudinal',
    prompt: 'What sustains you through the darkest siege?',
    optionList: [
      { label: 'The fire in my heart. Feeling is what makes me alive', weights: { E: 1 } },
      { label: 'The resilience of my body. I can outlast anything', weights: { F: 1 } },
    ],
  },
] as const

// ============================================================
// ENNEAGRAM — 15 Weighted Accumulator Questions
// ============================================================
// 12 questions score across types (keys '1'-'9').
// 3 questions score instincts (keys 'sp', 'so', 'sx').
// Primary weight +3, secondary weight +1.

export const ENNEAGRAM_QUESTION_LIST: readonly QuizQuestion[] = [
  // --- Type questions (12) ---
  {
    id: 'enn-1',
    system: 'enneagram',
    prompt: 'A warlord has slaughtered innocents and sits untouched on a gilded seat. What stirs in you first?',
    optionList: [
      { label: 'Cold fury. Someone needs to answer for this', weights: { '1': 3, '8': 1 } },
      { label: 'Grief. Someone needs to tend to the wounded', weights: { '2': 3, '9': 1 } },
      { label: 'Calculation. How can I use this moment?', weights: { '3': 3, '8': 1 } },
      { label: 'A hollow ache. This world is broken', weights: { '4': 3, '5': 1 } },
    ],
  },
  {
    id: 'enn-2',
    system: 'enneagram',
    prompt: 'You discover a sealed chamber no one else knows about. What do you do?',
    optionList: [
      { label: 'Study it alone. No need to share this yet', weights: { '5': 3, '4': 1 } },
      { label: 'Map the exits and check for traps. I need to know what we are walking into', weights: { '6': 3, '5': 1 } },
      { label: 'Explore. Forbidden places have the best stories', weights: { '7': 3, '3': 1 } },
      { label: 'Claim it. This is mine now', weights: { '8': 3, '1': 1 } },
    ],
  },
  {
    id: 'enn-3',
    system: 'enneagram',
    prompt: 'Your party faces certain doom. What role do you fall into?',
    optionList: [
      { label: 'Holding the line. Nobody falls on my watch', weights: { '2': 3, '6': 1 } },
      { label: 'Finding the way out. There is always another option', weights: { '7': 3, '9': 1 } },
      { label: 'Staying calm and observing. Panic helps no one', weights: { '5': 3, '9': 1 } },
      { label: 'Charging forward. Hesitation kills', weights: { '8': 3, '3': 1 } },
    ],
  },
  {
    id: 'enn-4',
    system: 'enneagram',
    prompt: 'A mentor offers you their legacy. What form does it take?',
    optionList: [
      { label: 'A code of honor that outlasts any sword', weights: { '1': 3, '6': 1 } },
      { label: 'A network of allies who trust each other. That is worth more than gold', weights: { '2': 3, '9': 1 } },
      { label: 'A title and reputation the world remembers', weights: { '3': 3, '7': 1 } },
      { label: 'A unique art only I could continue', weights: { '4': 3, '5': 1 } },
    ],
  },
  {
    id: 'enn-5',
    system: 'enneagram',
    prompt: 'You are granted one enchantment that lasts a lifetime. Which do you choose?',
    optionList: [
      { label: 'Always knowing when someone is lying', weights: { '6': 3, '1': 1 } },
      { label: 'Never being forgotten by anyone I meet', weights: { '3': 3, '4': 1 } },
      { label: 'Absorbing any text or skill instantly. I want to know everything', weights: { '5': 3, '7': 1 } },
      { label: 'Calming any conflict just by being there', weights: { '9': 3, '2': 1 } },
    ],
  },
  {
    id: 'enn-6',
    system: 'enneagram',
    prompt: 'What haunts you most in the small hours?',
    optionList: [
      { label: 'That I have failed some standard I set for myself', weights: { '1': 3, '3': 1 } },
      { label: 'That no one truly sees who I am', weights: { '4': 3, '2': 1 } },
      { label: 'That I will be unprepared when it matters', weights: { '6': 3, '5': 1 } },
      { label: 'That life is passing me by', weights: { '7': 3, '3': 1 } },
    ],
  },
  {
    id: 'enn-7',
    system: 'enneagram',
    prompt: 'An ally betrays the party. What is your first impulse?',
    optionList: [
      { label: 'Confront them. Now', weights: { '8': 3, '1': 1 } },
      { label: 'Understand why. There has to be a reason', weights: { '5': 3, '9': 1 } },
      { label: 'Rally the others. The group has to stay together', weights: { '2': 3, '6': 1 } },
      { label: 'Move on. Dwelling on it only slows us down', weights: { '7': 3, '3': 1 } },
    ],
  },
  {
    id: 'enn-8',
    system: 'enneagram',
    prompt: 'You find a village worshipping a false idol that promises salvation. What do you do?',
    optionList: [
      { label: 'Expose the lie. Truth over comfort', weights: { '1': 3, '5': 1 } },
      { label: 'Guide them gently without shattering their hope', weights: { '9': 3, '2': 1 } },
      { label: 'Offer them something better to believe in', weights: { '3': 3, '7': 1 } },
      { label: 'Let them be. Everyone copes differently', weights: { '4': 3, '9': 1 } },
    ],
  },
  {
    id: 'enn-9',
    system: 'enneagram',
    prompt: 'In a rare moment of peace, what draws you?',
    optionList: [
      { label: 'Making something beautiful. That is when I feel real', weights: { '4': 3, '7': 1 } },
      { label: 'Sitting with someone I trust, saying nothing', weights: { '9': 3, '6': 1 } },
      { label: 'Helping someone nearby. That is where my hands belong', weights: { '2': 3, '1': 1 } },
      { label: 'Planning the next move. Stillness makes me restless', weights: { '3': 3, '8': 1 } },
    ],
  },
  {
    id: 'enn-10',
    system: 'enneagram',
    prompt: 'You find a weapon of terrible power. What concerns you most?',
    optionList: [
      { label: 'That it might corrupt my principles', weights: { '1': 3, '6': 1 } },
      { label: 'That it might push people away from me', weights: { '2': 3, '4': 1 } },
      { label: 'That I might not understand it before I need it', weights: { '5': 3, '6': 1 } },
      { label: 'That it might bind me. Power has a cost', weights: { '7': 3, '8': 1 } },
    ],
  },
  {
    id: 'enn-11',
    system: 'enneagram',
    prompt: 'You are offered a seat of power. What kind of ruler would you be?',
    optionList: [
      { label: 'Fair and principled. The law is the law', weights: { '1': 3, '6': 1 } },
      { label: 'Beloved. My people would never want for anything', weights: { '2': 3, '9': 1 } },
      { label: 'Feared and respected. Strength keeps the peace', weights: { '8': 3, '3': 1 } },
      { label: 'Absent. I would rather advise from the shadows', weights: { '5': 3, '4': 1 } },
    ],
  },
  {
    id: 'enn-12',
    system: 'enneagram',
    prompt: 'A dragon blocks the only path forward. How do you handle it?',
    optionList: [
      { label: 'Negotiate. Every creature has a price', weights: { '3': 3, '7': 1 } },
      { label: 'Study its patterns, then strike the weakness', weights: { '6': 3, '5': 1 } },
      { label: 'Charge in. Overthinking gets people killed', weights: { '8': 3, '7': 1 } },
      { label: 'Find common ground. Even a dragon has a story', weights: { '9': 3, '2': 1 } },
    ],
  },
  // --- Instinct questions (3) ---
  {
    id: 'enn-13',
    system: 'enneagram',
    prompt: 'One night before the final battle. How do you spend it?',
    optionList: [
      { label: 'Checking supplies, sharpening blades, reinforcing armor', weights: { 'sp': 3 } },
      { label: 'With the group. Sharing stories, strengthening bonds', weights: { 'so': 3 } },
      { label: 'With the one person who matters most. Nothing else comes close', weights: { 'sx': 3 } },
    ],
  },
  {
    id: 'enn-14',
    system: 'enneagram',
    prompt: 'What would make you abandon a quest?',
    optionList: [
      { label: 'Certain death with no chance of survival', weights: { 'sp': 3 } },
      { label: 'Innocents paying the price for my choices', weights: { 'so': 3 } },
      { label: 'The one person I care about asking me to stop', weights: { 'sx': 3 } },
    ],
  },
  {
    id: 'enn-15',
    system: 'enneagram',
    prompt: 'A curse strips away one thing. Which loss hits you hardest?',
    optionList: [
      { label: 'My health and physical safety. Without that I have nothing', weights: { 'sp': 3 } },
      { label: 'My standing among allies. Forgotten, cast out, erased', weights: { 'so': 3 } },
      { label: 'My deepest bond. The connection that makes me feel alive', weights: { 'sx': 3 } },
    ],
  },
] as const

// ============================================================
// MBTI — 12 Binary Axis Questions (3 per axis)
// ============================================================
// Weight keys: 'EI', 'SN', 'TF', 'JP'.
// Positive = first letter (E, S, T, J), negative = second letter (I, N, F, P).

export const MBTI_QUESTION_LIST: readonly QuizQuestion[] = [
  // --- E/I axis (3) ---
  {
    id: 'mbti-1',
    system: 'mbti',
    prompt: 'Your party makes camp in a vast underground ruin. How do you recharge?',
    optionList: [
      { label: 'By the fire with the others. Talking and laughing fills me back up', weights: { EI: 2 } },
      { label: 'Alone at the edge of camp. I need the quiet', weights: { EI: -2 } },
    ],
  },
  {
    id: 'mbti-2',
    system: 'mbti',
    prompt: 'A new ally joins the party. How do you size them up?',
    optionList: [
      { label: 'Talk to them. I learn by engaging', weights: { EI: 1 } },
      { label: 'Watch them. Actions tell me more than words', weights: { EI: -1 } },
    ],
  },
  {
    id: 'mbti-3',
    system: 'mbti',
    prompt: 'A grand war council of a hundred voices. What is your role?',
    optionList: [
      { label: 'In the thick of debate. My voice carries in a crowd', weights: { EI: 2 } },
      { label: 'Listening. I will speak when it counts', weights: { EI: -2 } },
    ],
  },
  // --- S/N axis (3) ---
  {
    id: 'mbti-4',
    system: 'mbti',
    prompt: 'You enter a ruined cathedral covered in strange symbols. What catches your eye?',
    optionList: [
      { label: 'The cracks in the stone, the smell. Is this ceiling about to collapse?', weights: { SN: 2 } },
      { label: 'The patterns. What story are these symbols telling?', weights: { SN: -2 } },
    ],
  },
  {
    id: 'mbti-5',
    system: 'mbti',
    prompt: 'You have one night to scout an enemy stronghold before the assault. How do you spend it?',
    optionList: [
      { label: 'Count guards, map rotations, measure walls. Details win sieges', weights: { SN: 2 } },
      { label: 'Study the whole picture. Supply lines, morale, gaps in the design', weights: { SN: -1 } },
    ],
  },
  {
    id: 'mbti-6',
    system: 'mbti',
    prompt: 'Two engineers argue over breaching a fortress. One wants a battering ram, proven in a hundred sieges. The other has an untested catapult that could clear the wall entirely. Who do you back?',
    optionList: [
      { label: 'The ram. A hundred wins speaks for itself', weights: { SN: 1 } },
      { label: 'The catapult. If it works, we skip the wall entirely', weights: { SN: -2 } },
    ],
  },
  // --- T/F axis (3) ---
  {
    id: 'mbti-7',
    system: 'mbti',
    prompt: 'A comrade made a tactical error that cost the squad dearly. How do you respond?',
    optionList: [
      { label: 'Walk through what went wrong. We learn from failure, not comfort', weights: { TF: 2 } },
      { label: 'Check on them first. Guilt can eat someone alive', weights: { TF: -2 } },
    ],
  },
  {
    id: 'mbti-8',
    system: 'mbti',
    prompt: 'Two allies disagree on the route through hostile territory. You have to pick. What guides you?',
    optionList: [
      { label: 'Whichever route is objectively safer and faster', weights: { TF: 1 } },
      { label: 'Whichever ally has more at stake', weights: { TF: -1 } },
    ],
  },
  {
    id: 'mbti-9',
    system: 'mbti',
    prompt: 'A captured enemy offers information in exchange for mercy. What weighs more?',
    optionList: [
      { label: 'The calculus. Is the intel worth the risk of deception?', weights: { TF: 2 } },
      { label: 'The principle. Mercy is right or it is not, intel aside', weights: { TF: -2 } },
    ],
  },
  // --- J/P axis (3) ---
  {
    id: 'mbti-10',
    system: 'mbti',
    prompt: 'Ten branching corridors. You have a partial map. How do you proceed?',
    optionList: [
      { label: 'One corridor at a time. Mark what we find, stick to the map', weights: { JP: 2 } },
      { label: 'Follow sounds and instincts. The dungeon will teach us its shape', weights: { JP: -2 } },
    ],
  },
  {
    id: 'mbti-11',
    system: 'mbti',
    prompt: 'An unexpected detour reveals a hidden shrine with strange artifacts. The main quest awaits. What do you do?',
    optionList: [
      { label: 'Note it, move on. The mission comes first', weights: { JP: 1 } },
      { label: 'Explore it now. This might not be here later', weights: { JP: -2 } },
    ],
  },
  {
    id: 'mbti-12',
    system: 'mbti',
    prompt: 'How do you prefer to approach a long dungeon crawl?',
    optionList: [
      { label: 'Room by room, marking the map as I go', weights: { JP: 2 } },
      { label: 'Follow my gut and react to what comes', weights: { JP: -1 } },
    ],
  },
] as const

// ============================================================
// SOCIONICS — 4 Quadra Preference Questions
// ============================================================
// Weight keys: 'Alpha', 'Beta', 'Gamma', 'Delta'.

export const SOCIONICS_QUESTION_LIST: readonly QuizQuestion[] = [
  {
    id: 'soc-1',
    system: 'socionics',
    prompt: 'What kind of fellowship do you want in a war-band?',
    optionList: [
      { label: 'Warmth and shared curiosity. We learn and laugh together', weights: { Alpha: 3 } },
      { label: 'Intensity and clear command. We fight with passion', weights: { Beta: 3 } },
      { label: 'Competence and ambition. Results over sentiment', weights: { Gamma: 3 } },
      { label: 'Quiet reliability. We support each other without drama', weights: { Delta: 3 } },
    ],
  },
  {
    id: 'soc-2',
    system: 'socionics',
    prompt: 'A dispute divides the camp. Which approach fits you?',
    optionList: [
      { label: 'Explore every angle openly. Truth comes from free debate', weights: { Alpha: 3 } },
      { label: 'Pick a vision and lead. Unity comes from conviction', weights: { Beta: 3 } },
      { label: 'Judge by outcomes. Results will prove who was right', weights: { Gamma: 3 } },
      { label: 'Find common ground. No idea is worth destroying the group', weights: { Delta: 3 } },
    ],
  },
  {
    id: 'soc-3',
    system: 'socionics',
    prompt: 'The realm rewards you with one boon. Which do you claim?',
    optionList: [
      { label: 'A salon of endless ideas and wonder', weights: { Alpha: 3 } },
      { label: 'A cause worth fighting for. Something that demands everything', weights: { Beta: 3 } },
      { label: 'A venture of my own. Freedom, profit, mastery', weights: { Gamma: 3 } },
      { label: 'A peaceful homestead. A life of meaning and craft', weights: { Delta: 3 } },
    ],
  },
  {
    id: 'soc-4',
    system: 'socionics',
    prompt: 'Conflict breaks out in the party. What is your instinct?',
    optionList: [
      { label: 'Talk it through with everyone. Transparency clears the air', weights: { Alpha: 3 } },
      { label: 'Someone needs to decide. The rest follow', weights: { Beta: 3 } },
      { label: 'Let each person handle it. Autonomy breeds strength', weights: { Gamma: 3 } },
      { label: 'Mediate quietly. Find the middle ground', weights: { Delta: 3 } },
    ],
  },
] as const

// ============================================================
// EXPANDED INSTINCTS — 8 Questions (3 center + 5 realm)
// ============================================================

// Stage 1: 3 center-determination questions.
// Weight keys: 'SUR', 'INT', 'PUR'.

export const INSTINCT_CENTER_QUESTION_LIST: readonly QuizQuestion[] = [
  {
    id: 'inst-1',
    system: 'instincts',
    prompt: 'You have lost your companions, your supplies, and your way. What keeps you moving?',
    optionList: [
      { label: 'The need to survive and protect what is mine', weights: { SUR: 3 } },
      { label: 'The need to connect. To be seen and to see others', weights: { INT: 3 } },
      { label: 'The need for meaning. To understand why I exist', weights: { PUR: 3 } },
    ],
  },
  {
    id: 'inst-2',
    system: 'instincts',
    prompt: 'You are shown a vision of your greatest life. What does it look like?',
    optionList: [
      { label: 'Strong, secure, and self-sufficient', weights: { SUR: 3 } },
      { label: 'Deeply woven into others. Trusted, needed, belonging', weights: { INT: 3 } },
      { label: 'On purpose. My existence has weight and direction', weights: { PUR: 3 } },
    ],
  },
  {
    id: 'inst-3',
    system: 'instincts',
    prompt: 'A curse forces you to endure one wound for the rest of your journey. Which do you dread most?',
    optionList: [
      { label: 'Being exposed, depleted, unable to sustain myself', weights: { SUR: 3 } },
      { label: 'Being abandoned or misunderstood. Alone in a crowd', weights: { INT: 3 } },
      { label: 'Feeling like nothing I do matters', weights: { PUR: 3 } },
    ],
  },
] as const

// Stage 2: 5 realm-specific questions per center (15 total, only 5 shown).
// Weight keys are realm codes within that center.

const SUR_REALM_QUESTION_LIST: readonly QuizQuestion[] = [
  {
    id: 'inst-sur-1',
    system: 'instincts',
    prompt: 'A harsh winter is coming. What is your first priority?',
    optionList: [
      { label: 'Toughen up and push through the cold. I can take it', weights: { FD: 3 } },
      { label: 'Fortify the shelter. Nothing gets in', weights: { SY: 3 } },
      { label: 'Organize rations and routines. Discipline keeps us alive', weights: { SM: 3 } },
    ],
  },
  {
    id: 'inst-sur-2',
    system: 'instincts',
    prompt: 'You are wounded in battle but the fight is not over. What keeps you going?',
    optionList: [
      { label: 'Sheer grit. My body has been through worse', weights: { FD: 3, SM: 1 } },
      { label: 'Fear of what happens if I stop', weights: { SY: 3, FD: 1 } },
      { label: 'Trained composure. Manage the pain, stay effective', weights: { SM: 3, SY: 1 } },
    ],
  },
  {
    id: 'inst-sur-3',
    system: 'instincts',
    prompt: 'No supplies, no trail, storm closing in. What do you do first?',
    optionList: [
      { label: 'Push forward. I can take more than the storm can give', weights: { FD: 3 } },
      { label: 'Find shelter. Exposure kills fastest', weights: { SY: 3 } },
      { label: 'Take stock of what we have and ration it. Discipline keeps you alive', weights: { SM: 3 } },
    ],
  },
  {
    id: 'inst-sur-4',
    system: 'instincts',
    prompt: 'A younger party member asks you to teach them survival. What do you focus on?',
    optionList: [
      { label: 'Endurance. Push past what the body thinks it can take', weights: { FD: 3, SY: 1 } },
      { label: 'Reading danger. Know when to run before the threat arrives', weights: { SY: 3, SM: 1 } },
      { label: 'Self-management. Sleep, rations, keeping yourself sharp', weights: { SM: 3, FD: 1 } },
    ],
  },
  {
    id: 'inst-sur-5',
    system: 'instincts',
    prompt: 'You can permanently enchant one thing about yourself. What do you pick?',
    optionList: [
      { label: 'Unbreakable constitution. No poison, disease, or fatigue', weights: { FD: 3 } },
      { label: 'Perfect danger sense. I always know when something is wrong', weights: { SY: 3 } },
      { label: 'Total self-regulation. Perfect sleep, perfect recovery', weights: { SM: 3 } },
    ],
  },
]

const INT_REALM_QUESTION_LIST: readonly QuizQuestion[] = [
  {
    id: 'inst-int-1',
    system: 'instincts',
    prompt: 'You join a new war-band. What do you hope to find among them?',
    optionList: [
      { label: 'Transformation. Relationships that change us both', weights: { AY: 3 } },
      { label: 'Belonging. Being part of something bigger than myself', weights: { CY: 3 } },
      { label: 'Intimacy. One bond so deep it feels like home', weights: { BG: 3 } },
    ],
  },
  {
    id: 'inst-int-2',
    system: 'instincts',
    prompt: 'A new settlement welcomes you. What draws you in?',
    optionList: [
      { label: 'The spark of new connections. Every stranger is a door', weights: { AY: 3, CY: 1 } },
      { label: 'The community itself. Shared rituals, roles, belonging', weights: { CY: 3, BG: 1 } },
      { label: 'Finding the one person I resonate with. Depth over breadth', weights: { BG: 3, AY: 1 } },
    ],
  },
  {
    id: 'inst-int-3',
    system: 'instincts',
    prompt: 'The party is fracturing. Old grudges, thin trust. What do you do?',
    optionList: [
      { label: 'Force honest confrontation. We transform through it or we break', weights: { AY: 3 } },
      { label: 'Rebuild the rituals. Shared meals, shared duties', weights: { CY: 3 } },
      { label: 'Find the person I am closest to and tend that bond first', weights: { BG: 3 } },
    ],
  },
  {
    id: 'inst-int-4',
    system: 'instincts',
    prompt: 'A companion says they feel invisible in the group. How do you respond?',
    optionList: [
      { label: 'Pair them with someone who will spark something in them', weights: { AY: 3, BG: 1 } },
      { label: 'Give them a role. People feel seen when they are needed', weights: { CY: 3, AY: 1 } },
      { label: 'Give them my full attention. Sometimes that is enough', weights: { BG: 3, CY: 1 } },
    ],
  },
  {
    id: 'inst-int-5',
    system: 'instincts',
    prompt: 'If you could enchant one thing about your relationships, what would it be?',
    optionList: [
      { label: 'Every interaction sparks growth. That is what connection is for', weights: { AY: 3 } },
      { label: 'My community is unbreakable. We always have each other', weights: { CY: 3 } },
      { label: 'My closest bond can never be severed. That is all I need', weights: { BG: 3 } },
    ],
  },
]

const PUR_REALM_QUESTION_LIST: readonly QuizQuestion[] = [
  {
    id: 'inst-pur-1',
    system: 'instincts',
    prompt: 'An ancient monument asks you to carve one line that captures the point of your life. What do you write?',
    optionList: [
      { label: 'Leaving a mark. My name should echo after I am gone', weights: { SS: 3 } },
      { label: 'Seeing the truth as clearly as possible. Nothing matters more than clarity', weights: { EX: 3 } },
      { label: 'Venturing where no map exists. That is where life begins', weights: { UN: 3 } },
    ],
  },
  {
    id: 'inst-pur-2',
    system: 'instincts',
    prompt: 'A sage will answer one question. What do you ask?',
    optionList: [
      { label: 'What am I meant to become?', weights: { SS: 3, EX: 1 } },
      { label: 'What is the nature of existence?', weights: { EX: 3, UN: 1 } },
      { label: 'What lies beyond the edge of everything known?', weights: { UN: 3, SS: 1 } },
    ],
  },
  {
    id: 'inst-pur-3',
    system: 'instincts',
    prompt: 'Everything you believed in has been shattered. Your cause failed, your mentor lied. What do you reach for?',
    optionList: [
      { label: 'A new identity. If who I was is gone, I forge who I become', weights: { SS: 3 } },
      { label: 'The lesson. Even destruction holds a truth', weights: { EX: 3 } },
      { label: 'The unknown. Whatever is beyond the wreckage', weights: { UN: 3 } },
    ],
  },
  {
    id: 'inst-pur-4',
    system: 'instincts',
    prompt: 'A younger companion asks what makes a life worth living. What do you tell them?',
    optionList: [
      { label: 'Become someone who cannot be replaced', weights: { SS: 3, EX: 1 } },
      { label: 'Seek understanding. An examined life is never wasted', weights: { EX: 3, SS: 1 } },
      { label: 'Stay open to mystery. Certainty is where aliveness stops', weights: { UN: 3, EX: 1 } },
    ],
  },
  {
    id: 'inst-pur-5',
    system: 'instincts',
    prompt: 'You can permanently enchant one aspect of your purpose. What do you choose?',
    optionList: [
      { label: 'I become exactly what I was born to be. No compromises', weights: { SS: 3 } },
      { label: 'I see the truth behind every illusion. Clarity above all', weights: { EX: 3 } },
      { label: 'Every mystery opens into a deeper one. That is the point', weights: { UN: 3 } },
    ],
  },
]

const REALM_QUESTION_MAP: Record<InstinctCenter, readonly QuizQuestion[]> = {
  SUR: SUR_REALM_QUESTION_LIST,
  INT: INT_REALM_QUESTION_LIST,
  PUR: PUR_REALM_QUESTION_LIST,
}

/** Get the 5 realm-specific questions for a determined instinct center. */
export function getInstinctRealmQuestionList(center: InstinctCenter): readonly QuizQuestion[] {
  return REALM_QUESTION_MAP[center]
}

// ============================================================
// QUESTION LIST BUILDER
// ============================================================

/** Get the full ordered question list for a set of enabled systems. */
export function getQuestionList(enabledSystems: Record<SystemId, boolean>): QuizQuestion[] {
  const questionList: QuizQuestion[] = []

  if (enabledSystems.attitudinal) {
    questionList.push(...AP_QUESTION_LIST)
  }
  if (enabledSystems.enneagram) {
    questionList.push(...ENNEAGRAM_QUESTION_LIST)
  }
  if (enabledSystems.mbti) {
    questionList.push(...MBTI_QUESTION_LIST)
  }
  if (enabledSystems.socionics) {
    questionList.push(...SOCIONICS_QUESTION_LIST)
  }
  if (enabledSystems.instincts) {
    questionList.push(...INSTINCT_CENTER_QUESTION_LIST)
    // Realm questions are added dynamically after center is determined
  }

  return questionList
}

// ============================================================
// SECTION TRANSITIONS
// ============================================================

/** Flavor text shown between quiz sections when switching systems. */
export const SECTION_TRANSITION_TEXT: Record<SystemId, { intro: string; outro: string; detail: string }> = {
  attitudinal: {
    intro: 'The spirits weigh your inner compass... Which forces shape your will?',
    outro: 'Your cardinal aspects are set. The wheel turns.',
    detail: 'Determines your base stats. First aspect scores highest, fourth scores lowest.',
  },
  enneagram: {
    intro: 'The ancient wheel of nine turns before you... What archetype do you embody?',
    outro: 'Your archetype is taking shape. Now for the mind.',
    detail: 'Nine core motivations, nine class archetypes. Wings and instincts refine the build.',
  },
  mbti: {
    intro: 'The cognitive forge ignites... How does your mind shape the world?',
    outro: 'Mental wiring locked in. Allegiance next.',
    detail: 'Four cognitive functions, four ability slots. Each function plays differently depending on position.',
  },
  socionics: {
    intro: 'The four quadras call from the void... Where does your soul find kinship?',
    outro: 'Elemental allegiance sealed. One section remains.',
    detail: 'Quadras set your elemental school. Separate system from MBTI.',
  },
  instincts: {
    intro: 'The primal currents surge... What drives you at your core?',
    outro: 'Instinctual foundation set. The reading is complete.',
    detail: 'Nine realms across three centers shape your combat behavior. Not the classic enneagram instincts.',
  },
}
