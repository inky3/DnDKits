// Starter data for the shop generator. This is intentionally small —
// swap/extend it later (or move it into Firestore) once you're ready to
// build out the full item system.

export const TOWN_SIZES = {
  village: {
    label: "Village",
    description: "A handful of houses, a well, maybe a shrine.",
    shopTypes: ["tavern", "food", "blacksmith", "random"],
    randomLocationCount: [1, 2],
    stockMultiplier: 0.6,
    priceMultiplier: 1.1,
  },
  town: {
    label: "Town",
    description: "A proper settlement with a market square.",
    shopTypes: ["tavern", "food", "blacksmith", "potion", "random"],
    randomLocationCount: [2, 3],
    stockMultiplier: 1,
    priceMultiplier: 1,
  },
  dock: {
    label: "Dock / Port",
    description: "Salt air, warehouses, and sailors who talk too much.",
    shopTypes: ["tavern", "food", "blacksmith", "potion", "random"],
    randomLocationCount: [2, 4],
    stockMultiplier: 1,
    priceMultiplier: 1.05,
  },
  city: {
    label: "City",
    description: "Districts, guilds, and more shops than you can visit in a day.",
    shopTypes: ["tavern", "food", "blacksmith", "potion", "random"],
    randomLocationCount: [3, 5],
    stockMultiplier: 1.6,
    priceMultiplier: 0.95,
  },
};

export const SHOP_TYPES = {
  blacksmith: {
    label: "Blacksmith",
    nameParts: {
      prefix: ["Ironhold", "Cinderforge", "Grimwright", "Anvilborn", "Coalhart"],
      suffix: ["Forge", "Smithy", "Ironworks", "Anvil"],
    },
    goods: [
      { name: "Dagger", price: 2, unit: "gp" },
      { name: "Shortsword", price: 10, unit: "gp" },
      { name: "Longsword", price: 15, unit: "gp" },
      { name: "Battleaxe", price: 10, unit: "gp" },
      { name: "Warhammer", price: 15, unit: "gp" },
      { name: "Handaxe", price: 5, unit: "gp" },
      { name: "Studded Leather Armor", price: 45, unit: "gp" },
      { name: "Chain Shirt", price: 50, unit: "gp" },
      { name: "Chain Mail", price: 75, unit: "gp" },
      { name: "Shield", price: 10, unit: "gp" },
      { name: "Horseshoes (set)", price: 2, unit: "gp" },
      { name: "Iron Pot", price: 2, unit: "gp" },
      { name: "Weapon Repair & Sharpening", price: 1, unit: "gp" },
    ],
  },
  potion: {
    label: "Potion Shop",
    nameParts: {
      prefix: ["Bubbling", "Wychwood", "Moonvial", "Emberflask", "Silverdrop"],
      suffix: ["Apothecary", "Vials", "Alchemy", "Tonics"],
    },
    goods: [
      { name: "Potion of Healing", price: 50, unit: "gp" },
      { name: "Antitoxin (vial)", price: 50, unit: "gp" },
      { name: "Potion of Climbing", price: 30, unit: "gp" },
      { name: "Alchemist's Fire (flask)", price: 50, unit: "gp" },
      { name: "Acid (vial)", price: 25, unit: "gp" },
      { name: "Oil of Slipperiness", price: 90, unit: "gp" },
      { name: "Herbalism Kit", price: 5, unit: "gp" },
      { name: "Basic Poison (vial)", price: 100, unit: "gp" },
      { name: "Perfume", price: 5, unit: "gp" },
      { name: "Ink (1 oz vial)", price: 10, unit: "gp" },
    ],
  },
  tavern: {
    label: "Tavern",
    nameParts: {
      prefix: ["The Prancing", "The Rusty", "The Gilded", "The Weary", "The Salty"],
      suffix: ["Griffon", "Tankard", "Boar", "Wanderer", "Anchor"],
    },
    goods: [
      { name: "Mug of Ale", price: 4, unit: "cp" },
      { name: "Mug of Cider", price: 2, unit: "cp" },
      { name: "Bottle of Wine (common)", price: 2, unit: "sp" },
      { name: "Bottle of Wine (fine)", price: 10, unit: "gp" },
      { name: "Room, Poor (per night)", price: 7, unit: "sp" },
      { name: "Room, Modest (per night)", price: 1, unit: "gp" },
      { name: "Room, Comfortable (per night)", price: 2, unit: "gp" },
      { name: "Hot Meal", price: 3, unit: "sp" },
      { name: "Bard's Corner (rumor for a drink)", price: 0, unit: "gp" },
    ],
  },
  food: {
    label: "Food Stall / Market",
    nameParts: {
      prefix: ["Harvest", "Golden Grain", "Riverside", "Copper Kettle", "Millstone"],
      suffix: ["Market", "Stall", "Larder", "Bakery"],
    },
    goods: [
      { name: "Bread, loaf", price: 2, unit: "cp" },
      { name: "Cheese, wedge", price: 1, unit: "sp" },
      { name: "Meat pie", price: 4, unit: "sp" },
      { name: "Apple", price: 1, unit: "cp" },
      { name: "Rations (1 day)", price: 5, unit: "sp" },
      { name: "Salted fish", price: 2, unit: "sp" },
      { name: "Honeycomb", price: 3, unit: "sp" },
      { name: "Waterskin (full)", price: 2, unit: "sp" },
    ],
  },
  random: {
    label: "Random Location",
    // A grab-bag of small points of interest a DM can drop in without prep.
    presets: [
      {
        name: "The Sleeping Cat Curiosity Shop",
        type: "Oddities Shop",
        hook: "Sells trinkets of dubious magical origin. One item on the shelf is actually cursed and the owner doesn't know it.",
      },
      {
        name: "Guildhall of the Wheelwrights",
        type: "Craft Guild",
        hook: "Will pay well for rare hardwoods or an escort to a dangerous quarry.",
      },
      {
        name: "The Hanged Man's Notice Board",
        type: "Public Board",
        hook: "Covered in bounties, missing-person notices, and one very suspicious job offer.",
      },
      {
        name: "Sister Maren's Almshouse",
        type: "Temple / Shelter",
        hook: "Offers free healing to the poor; always short on funds and short on hands.",
      },
      {
        name: "The Undercroft Fighting Pits",
        type: "Gambling Den",
        hook: "Illegal betting ring beneath a respectable-looking cellar.",
      },
      {
        name: "Old Rowan's Ferry",
        type: "Transport",
        hook: "The ferryman knows every rumor on the river, for a price.",
      },
      {
        name: "Whisperwind Aviary",
        type: "Messenger Service",
        hook: "Trained birds carry messages for a fee; one bird has gone missing with a client's letter.",
      },
      {
        name: "The Cracked Bell Pawnshop",
        type: "Pawnshop",
        hook: "Buys anything, asks few questions, and the back room is worth investigating.",
      },
    ],
  },
};
