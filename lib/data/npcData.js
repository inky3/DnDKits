// Building blocks for the NPC generator. Species contribute stat modifiers
// and a name pool; roles contribute a base stat array, AC/HP, skills, and
// flavor actions. The generator (lib/npcGenerator.js) combines one of each
// with a personality package to produce a full NPC.

export const SPECIES = {
  human: {
    label: "Human",
    speed: "30 ft.",
    mods: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 1 },
    names: ["Alaric", "Brynn", "Corwin", "Della", "Edrin", "Fira", "Garrick", "Hesper"],
  },
  elf: {
    label: "Elf",
    speed: "30 ft.",
    mods: { str: -1, dex: 2, con: -1, int: 1, wis: 0, cha: 0 },
    names: ["Aelar", "Silvenna", "Thalorin", "Ilyra", "Nymrion", "Faelynn"],
  },
  dwarf: {
    label: "Dwarf",
    speed: "25 ft.",
    mods: { str: 1, dex: -1, con: 2, int: 0, wis: 0, cha: -1 },
    names: ["Borin", "Dagna", "Ulfric", "Thrina", "Kordak", "Vessa"],
  },
  halfling: {
    label: "Halfling",
    speed: "25 ft.",
    mods: { str: -2, dex: 2, con: 0, int: 0, wis: 0, cha: 1 },
    names: ["Rosco", "Mirabelle", "Cade", "Pippa", "Tobin", "Nella"],
  },
  halfOrc: {
    label: "Half-Orc",
    speed: "30 ft.",
    mods: { str: 2, dex: 0, con: 1, int: -1, wis: 0, cha: -1 },
    names: ["Grosh", "Karza", "Modug", "Vrenna", "Thokk", "Ushara"],
  },
  tiefling: {
    label: "Tiefling",
    speed: "30 ft.",
    mods: { str: 0, dex: 0, con: 0, int: 1, wis: 0, cha: 1 },
    names: ["Zariel", "Morthos", "Lilith", "Kaelis", "Nyx", "Ravaska"],
  },
};

export const SPECIES_ORDER = ["human", "elf", "dwarf", "halfling", "halfOrc", "tiefling"];

export const ROLES = {
  merchant: {
    label: "Merchant",
    baseStats: { str: 10, dex: 11, con: 11, int: 12, wis: 11, cha: 14 },
    ac: 10,
    hp: 9,
    skills: { persuasion: 4, insight: 2, deception: 2 },
    actions: ["Dagger: +2 to hit, 1d4 piercing"],
    defaultAttitude: "Neutral",
    environment: ["Town", "City", "Road"],
  },
  guard: {
    label: "Guard",
    baseStats: { str: 13, dex: 12, con: 12, int: 10, wis: 11, cha: 10 },
    ac: 16,
    hp: 18,
    skills: { athletics: 3, perception: 2, intimidation: 1 },
    actions: ["Spear: +3 to hit, 1d6+1 piercing", "Shield Bash: +3 to hit, 1d4+1 bludgeoning, target pushed 5 ft."],
    defaultAttitude: "Neutral",
    environment: ["Town", "City", "Dungeon"],
  },
  noble: {
    label: "Noble",
    baseStats: { str: 9, dex: 11, con: 10, int: 12, wis: 12, cha: 16 },
    ac: 11,
    hp: 11,
    skills: { persuasion: 5, deception: 3, history: 2 },
    actions: ["Rapier: +2 to hit, 1d8-1 piercing"],
    defaultAttitude: "Unfriendly",
    environment: ["City", "Town"],
  },
  innkeeper: {
    label: "Innkeeper",
    baseStats: { str: 11, dex: 10, con: 13, int: 10, wis: 13, cha: 13 },
    ac: 10,
    hp: 14,
    skills: { persuasion: 3, insight: 3 },
    actions: ["Rolling Pin: +2 to hit, 1d4 bludgeoning"],
    defaultAttitude: "Friendly",
    environment: ["Town", "City", "Road"],
  },
  banditLeader: {
    label: "Bandit Leader",
    baseStats: { str: 14, dex: 15, con: 13, int: 11, wis: 10, cha: 13 },
    ac: 15,
    hp: 27,
    skills: { deception: 3, intimidation: 3, athletics: 3 },
    actions: [
      "Multiattack: two scimitar attacks",
      "Scimitar: +4 to hit, 1d6+2 slashing",
      "Dagger (thrown): +4 to hit, 1d4+2 piercing",
    ],
    defaultAttitude: "Hostile",
    environment: ["Road", "Hills", "Forest", "Dungeon"],
  },
  priest: {
    label: "Priest",
    baseStats: { str: 9, dex: 10, con: 11, int: 12, wis: 15, cha: 13 },
    ac: 10,
    hp: 16,
    skills: { insight: 4, religion: 3, medicine: 3 },
    actions: ["Mace: +2 to hit, 1d6 bludgeoning", "Guiding Bolt (1/day): +4 to hit, 4d6 radiant"],
    defaultAttitude: "Friendly",
    environment: ["Town", "City"],
  },
  scholar: {
    label: "Scholar",
    baseStats: { str: 8, dex: 10, con: 10, int: 16, wis: 12, cha: 10 },
    ac: 10,
    hp: 8,
    skills: { arcana: 5, history: 4, investigation: 4 },
    actions: ["Quarterstaff: +1 to hit, 1d6-1 bludgeoning"],
    defaultAttitude: "Neutral",
    environment: ["City", "Dungeon"],
  },
  blacksmith: {
    label: "Blacksmith",
    baseStats: { str: 15, dex: 10, con: 14, int: 10, wis: 11, cha: 9 },
    ac: 12,
    hp: 16,
    skills: { athletics: 4, intimidation: 1 },
    actions: ["Warhammer: +4 to hit, 1d8+2 bludgeoning"],
    defaultAttitude: "Neutral",
    environment: ["Town", "City"],
  },
  beggar: {
    label: "Beggar",
    baseStats: { str: 8, dex: 11, con: 9, int: 9, wis: 12, cha: 8 },
    ac: 9,
    hp: 6,
    skills: { insight: 2, stealth: 2 },
    actions: ["Improvised Club: +0 to hit, 1d4-1 bludgeoning"],
    defaultAttitude: "Neutral",
    environment: ["Town", "City", "Sewer"],
  },
  spy: {
    label: "Spy",
    baseStats: { str: 10, dex: 15, con: 10, int: 13, wis: 12, cha: 14 },
    ac: 13,
    hp: 12,
    skills: { deception: 5, stealth: 4, insight: 3 },
    actions: ["Shortsword (sneak attack): +4 to hit, 1d6+2 piercing +2d6 if unseen"],
    defaultAttitude: "Unfriendly",
    environment: ["City", "Town", "Dock"],
  },
};

export const ROLE_ORDER = [
  "merchant",
  "guard",
  "noble",
  "innkeeper",
  "banditLeader",
  "priest",
  "scholar",
  "blacksmith",
  "beggar",
  "spy",
];

export const PERSONALITY = {
  traits: [
    "Speaks in a low, careful voice and rarely finishes a sentence.",
    "Laughs nervously after almost everything they say.",
    "Constantly fidgets with a small trinket.",
    "Never makes eye contact, but misses nothing.",
    "Has a booming laugh that draws attention across a room.",
    "Overly formal, even with old friends.",
    "Punctuates statements with a proverb, usually the wrong one.",
    "Chews on a pipe stem whether or not it's lit.",
  ],
  ideals: [
    "Coin. Everything has a price, including loyalty.",
    "Family. Blood matters more than any oath.",
    "Order. Rules exist to keep people safe.",
    "Freedom. No one tells them what to do.",
    "Faith. The gods are watching, and they intend to be seen doing right.",
    "Knowledge. Understanding is worth any risk.",
  ],
  bonds: [
    "Owes a debt to someone dangerous.",
    "Would do anything to protect their family.",
    "Is searching for a person who vanished years ago.",
    "Serves a local guild or authority with quiet loyalty.",
    "Carries a memento from someone they lost.",
  ],
  flaws: [
    "Can't resist a good bribe.",
    "Trusts strangers far too quickly.",
    "Holds a grudge long after everyone else has forgotten it.",
    "Talks their way into trouble they can't talk their way out of.",
    "Underestimates anyone who looks unimportant.",
  ],
};

export const ATTITUDE_LADDER = ["Hostile", "Unfriendly", "Neutral", "Friendly", "Helpful"];