// Mirrors D&D Beyond's homebrew hub (dndbeyond.com/homebrew): Backgrounds,
// Feats, Magic Items, Monsters, Species, Spells, Subclasses. Each category
// gets its own tailored set of fields instead of one generic "details" box.

export const HOMEBREW_CATEGORIES = {
  background: {
    label: "Backgrounds",
    singular: "Background",
    description: "Skill proficiencies, equipment, and a defining feature.",
    fields: [
      { key: "skillProficiencies", label: "Skill Proficiencies", type: "text", placeholder: "e.g. Insight, Persuasion" },
      { key: "toolProficiencies", label: "Tool / Language Proficiencies", type: "text" },
      { key: "equipment", label: "Starting Equipment", type: "textarea" },
      { key: "feature", label: "Feature Name", type: "text", placeholder: "e.g. Rustic Hospitality" },
      { key: "featureText", label: "Feature Description", type: "textarea" },
      { key: "description", label: "Flavor / Description", type: "textarea" },
    ],
  },
  feat: {
    label: "Feats",
    singular: "Feat",
    description: "A prerequisite and the benefit it grants.",
    fields: [
      { key: "prerequisite", label: "Prerequisite", type: "text", placeholder: "e.g. Level 4+, Strength 13" },
      { key: "benefit", label: "Benefit", type: "textarea" },
      { key: "description", label: "Flavor / Description", type: "textarea" },
    ],
  },
  magicItem: {
    label: "Magic Items",
    singular: "Magic Item",
    description: "Rarity, attunement, and what it does.",
    fields: [
      {
        key: "rarity",
        label: "Rarity",
        type: "select",
        options: ["Common", "Uncommon", "Rare", "Very Rare", "Legendary", "Artifact"],
      },
      { key: "itemType", label: "Item Type", type: "text", placeholder: "e.g. Wondrous Item, Weapon (longsword)" },
      { key: "attunement", label: "Requires Attunement?", type: "select", options: ["No", "Yes"] },
      { key: "description", label: "Description / Effect", type: "textarea" },
    ],
  },
  monster: {
    label: "Monsters",
    singular: "Monster",
    description: "A full stat block: AC, HP, abilities, traits, and actions.",
    fields: [
      { key: "cr", label: "Challenge Rating", type: "text", placeholder: "e.g. 1/2, 3, 8" },
      { key: "type", label: "Type", type: "text", placeholder: "e.g. Humanoid, Beast, Fiend" },
      { key: "size", label: "Size", type: "select", options: ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"] },
      { key: "ac", label: "Armor Class", type: "number" },
      { key: "hp", label: "Hit Points", type: "number" },
      { key: "speed", label: "Speed", type: "text", placeholder: "e.g. 30 ft., fly 60 ft." },
      { key: "str", label: "STR", type: "number" },
      { key: "dex", label: "DEX", type: "number" },
      { key: "con", label: "CON", type: "number" },
      { key: "int", label: "INT", type: "number" },
      { key: "wis", label: "WIS", type: "number" },
      { key: "cha", label: "CHA", type: "number" },
      { key: "traits", label: "Traits", type: "textarea" },
      { key: "actions", label: "Actions", type: "textarea" },
    ],
  },
  species: {
    label: "Species",
    singular: "Species",
    description: "Size, speed, and racial traits.",
    fields: [
      { key: "size", label: "Size", type: "select", options: ["Small", "Medium", "Large"] },
      { key: "speed", label: "Speed", type: "text", placeholder: "e.g. 30 ft." },
      { key: "traits", label: "Racial Traits", type: "textarea" },
      { key: "description", label: "Flavor / Description", type: "textarea" },
    ],
  },
  spell: {
    label: "Spells",
    singular: "Spell",
    description: "Level, school, casting time, and effect.",
    fields: [
      { key: "level", label: "Level", type: "select", options: ["Cantrip", "1", "2", "3", "4", "5", "6", "7", "8", "9"] },
      {
        key: "school",
        label: "School",
        type: "select",
        options: ["Abjuration", "Conjuration", "Divination", "Enchantment", "Evocation", "Illusion", "Necromancy", "Transmutation"],
      },
      { key: "castingTime", label: "Casting Time", type: "text", placeholder: "e.g. 1 action" },
      { key: "range", label: "Range", type: "text", placeholder: "e.g. 60 feet" },
      { key: "components", label: "Components", type: "text", placeholder: "e.g. V, S, M (a pinch of salt)" },
      { key: "duration", label: "Duration", type: "text", placeholder: "e.g. Concentration, up to 1 minute" },
      { key: "description", label: "Effect", type: "textarea" },
    ],
  },
  subclass: {
    label: "Subclasses",
    singular: "Subclass",
    description: "A class specialization and the features it grants.",
    fields: [
      { key: "parentClass", label: "Parent Class", type: "text", placeholder: "e.g. Wizard, Fighter" },
      { key: "features", label: "Features (by level)", type: "textarea" },
      { key: "description", label: "Flavor / Description", type: "textarea" },
    ],
  },
};

export const HOMEBREW_CATEGORY_ORDER = [
  "background",
  "feat",
  "magicItem",
  "monster",
  "species",
  "spell",
  "subclass",
];