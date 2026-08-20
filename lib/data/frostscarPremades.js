// Frostscar starting archetypes. Values as given: ability scores are
// already flat modifiers (not raw 3-18 scores like D&D), so they're used
// directly in rolls rather than run through a modifier formula.

export const FROSTSCAR_ARCHETYPES = {
  swordMan: {
    label: "Sword Man",
    hp: 24,
    stats: { str: 3, dex: 1, wis: 1, int: 0, cha: 1 },
    armor: 10,
    warmth: { current: 30, max: 50 },
    sanity: { current: 30, max: 50 },
    luck: { current: 0, max: 10 },
    gold: 20,
    rations: 2,
  },
  rogue: {
    label: "Rogue",
    hp: 18,
    stats: { str: 1, dex: 3, wis: 2, int: 1, cha: 1 },
    armor: 8,
    warmth: { current: 30, max: 50 },
    sanity: { current: 30, max: 50 },
    luck: { current: 0, max: 10 },
    gold: 20,
    rations: 2,
  },
  wretch: {
    label: "Wretch",
    hp: 20,
    stats: { str: 2, dex: 2, wis: 3, int: 0, cha: -1 },
    armor: 7,
    warmth: { current: 30, max: 50 },
    sanity: { current: 35, max: 50 },
    luck: { current: 1, max: 10 },
    gold: 5,
    rations: 3,
  },
  prisoner: {
    label: "Prisoner",
    hp: 22,
    stats: { str: 2, dex: 2, wis: 1, int: 2, cha: 0 },
    armor: 9,
    warmth: { current: 30, max: 50 },
    sanity: { current: 25, max: 50 },
    luck: { current: 0, max: 10 },
    gold: 10,
    rations: 2,
  },
};

export const FROSTSCAR_ARCHETYPE_ORDER = ["swordMan", "rogue", "wretch", "prisoner"];
