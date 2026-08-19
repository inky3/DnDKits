import { TOWN_SIZES, SHOP_TYPES } from "./data/shopData";

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffled(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function priceWithModifier(price, unit, multiplier) {
  if (unit === "cp" || price === 0) return { price, unit };
  const adjusted = Math.max(1, Math.round(price * multiplier));
  return { price: adjusted, unit };
}

function stockPreset(preset, typeKey, sizeDef) {
  const typeDef = SHOP_TYPES[typeKey];
  const stockCount = Math.max(
    2,
    Math.round(preset.goods.length * sizeDef.stockMultiplier)
  );
  const stock = shuffled(preset.goods)
    .slice(0, Math.min(stockCount, preset.goods.length))
    .map((g) => ({
      ...g,
      ...priceWithModifier(g.price, g.unit, sizeDef.priceMultiplier),
      quantity: randInt(1, 6),
    }));

  return {
    id: `${typeKey}-${preset.name.replace(/\s+/g, "-").toLowerCase()}`,
    type: typeKey,
    typeLabel: typeDef.label,
    name: preset.name,
    tagline: preset.tagline,
    goods: stock,
  };
}

function buildRandomLocation() {
  const preset = pick(SHOP_TYPES.random.presets);
  return {
    id: `random-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: "random",
    typeLabel: preset.type,
    name: preset.name,
    hook: preset.hook,
  };
}

// Generates a full settlement: an array of shop objects, drawing from the
// fixed named presets (1 per category for a village, both for anything
// bigger) plus a handful of unnamed random locations.
export function generateTown(sizeKey) {
  const sizeDef = TOWN_SIZES[sizeKey];
  if (!sizeDef) throw new Error(`Unknown town size: ${sizeKey}`);

  const shops = [];
  sizeDef.shopTypes.forEach((typeKey) => {
    if (typeKey === "random") {
      const count = randInt(...sizeDef.randomLocationCount);
      for (let i = 0; i < count; i++) shops.push(buildRandomLocation());
      return;
    }
    const typeDef = SHOP_TYPES[typeKey];
    const presetsToUse =
      sizeDef.presetsPerCategory >= typeDef.presets.length
        ? typeDef.presets
        : shuffled(typeDef.presets).slice(0, sizeDef.presetsPerCategory);
    presetsToUse.forEach((preset) => {
      shops.push(stockPreset(preset, typeKey, sizeDef));
    });
  });

  return { size: sizeKey, sizeLabel: sizeDef.label, shops };
}

// Reroll = restock. Named shops keep their identity; only inventory
// quantities/prices shuffle. Random locations swap to a different preset.
export function rerollShop(shop, sizeKey) {
  const sizeDef = TOWN_SIZES[sizeKey];
  if (shop.type === "random") return buildRandomLocation();
  const typeDef = SHOP_TYPES[shop.type];
  const preset =
    typeDef.presets.find((p) => p.name === shop.name) || typeDef.presets[0];
  return stockPreset(preset, shop.type, sizeDef);
}

// Adds one more shop to an existing town. For a named category, returns the
// preset that isn't already present (there are only 2 per category, so once
// both are shown this returns null — nothing left to add for that type).
// For "random", always returns a new unnamed location (the pool of 8
// presets can repeat once exhausted, since they're just flavor).
export function addShop(town, typeKey) {
  const sizeDef = TOWN_SIZES[town.size];
  if (typeKey === "random") {
    return buildRandomLocation();
  }
  const typeDef = SHOP_TYPES[typeKey];
  const shownNames = town.shops
    .filter((s) => s.type === typeKey)
    .map((s) => s.name);
  const remaining = typeDef.presets.filter((p) => !shownNames.includes(p.name));
  if (remaining.length === 0) return null; // both presets already shown
  return stockPreset(remaining[0], typeKey, sizeDef);
}

// Which categories still have an unshown preset left to add via "+".
export function availableToAdd(town) {
  const options = ["random"]; // always available
  Object.keys(SHOP_TYPES)
    .filter((k) => k !== "random")
    .forEach((typeKey) => {
      const typeDef = SHOP_TYPES[typeKey];
      const shownNames = town.shops.filter((s) => s.type === typeKey).map((s) => s.name);
      if (shownNames.length < typeDef.presets.length) options.push(typeKey);
    });
  return options;
}