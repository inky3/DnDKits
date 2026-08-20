// Pools used by the random monster generator. Kept separate from the
// static bestiary (monsters.js) since these are building blocks, not
// finished entries.

export const CR_TIERS = {
  trivial: { label: "Trivial (CR 0–1)", crValues: ["0", "1/8", "1/4", "1/2", "1"], hpRange: [4, 22], acRange: [10, 14], atkBonus: [2, 4], dmgDice: "1d6" },
  low: { label: "Low (CR 2–4)", crValues: ["2", "3", "4"], hpRange: [30, 60], acRange: [13, 15], atkBonus: [4, 6], dmgDice: "2d6" },
  mid: { label: "Mid (CR 5–8)", crValues: ["5", "6", "7", "8"], hpRange: [65, 130], acRange: [14, 17], atkBonus: [6, 8], dmgDice: "2d8" },
  high: { label: "High (CR 9+)", crValues: ["9", "10", "12", "14", "17"], hpRange: [140, 250], acRange: [16, 19], atkBonus: [8, 11], dmgDice: "3d8" },
};

export const MONSTER_TYPES = [
  {
    type: "Beast",
    sizes: ["Small", "Medium", "Large"],
    statBias: { str: 1, dex: 1, con: 1, int: -2, wis: 0, cha: -2 },
    namePrefixes: ["Dire", "Feral", "Marsh", "Ridgeback", "Ashen"],
    nameNouns: ["Wolf", "Boar", "Lynx", "Serpent", "Stag", "Bat"],
    traits: ["Keen Senses", "Pack Tactics", "Pounce", "Camouflage"],
    actionVerbs: ["Bite", "Claw", "Gore", "Sting"],
  },
  {
    type: "Humanoid",
    sizes: ["Small", "Medium"],
    statBias: { str: 0, dex: 1, con: 0, int: 0, wis: 0, cha: 1 },
    namePrefixes: ["Rogue", "Exiled", "Masked", "Hollow", "Silent"],
    nameNouns: ["Raider", "Cultist", "Mercenary", "Warden", "Scout"],
    traits: ["Sneak Attack", "Cunning Action", "Ambusher"],
    actionVerbs: ["Shortsword", "Dagger", "Hand Crossbow", "Spear"],
  },
  {
    type: "Undead",
    sizes: ["Medium", "Large"],
    statBias: { str: 1, dex: -1, con: 1, int: -1, wis: 0, cha: -1 },
    namePrefixes: ["Rotting", "Bound", "Grave", "Withered", "Pale"],
    nameNouns: ["Wight", "Husk", "Revenant", "Shambler", "Wraith"],
    traits: ["Undead Fortitude", "Life Drain", "Turn Resistance"],
    actionVerbs: ["Slam", "Claw", "Withering Touch"],
  },
  {
    type: "Fiend",
    sizes: ["Small", "Medium", "Large"],
    statBias: { str: 1, dex: 0, con: 1, int: 0, wis: 0, cha: 2 },
    namePrefixes: ["Lesser", "Bound", "Cinder", "Thorned", "Wailing"],
    nameNouns: ["Imp", "Fiendling", "Hound", "Tormentor", "Stalker"],
    traits: ["Fire Resistance", "Magic Resistance", "Innate Spellcasting"],
    actionVerbs: ["Claw", "Bite", "Hellfire Bolt"],
  },
  {
    type: "Monstrosity",
    sizes: ["Medium", "Large", "Huge"],
    statBias: { str: 2, dex: 0, con: 1, int: -1, wis: 0, cha: -1 },
    namePrefixes: ["Chitinous", "Twisted", "Horned", "Bramble", "Fen"],
    nameNouns: ["Stalker", "Broodling", "Devourer", "Lurker", "Warden"],
    traits: ["Keen Sight and Smell", "Multiattack", "Frightful Presence"],
    actionVerbs: ["Bite", "Claw", "Tail Slap", "Gore"],
  },
];

export const ENVIRONMENTS = ["Forest", "Hills", "Dungeon", "Tundra", "Town", "Road", "City", "Sewer", "Dock", "Coast", "Ocean", "Mountains", "Lair"];
