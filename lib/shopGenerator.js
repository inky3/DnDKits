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

function makeShopName(typeDef) {
  if (!typeDef.nameParts) return typeDef.label;
  return `${pick(typeDef.nameParts.prefix)} ${pick(typeDef.nameParts.suffix)}`;
}

function priceWithModifier(price, unit, multiplier) {
  if (unit === "cp" || price === 0) return { price, unit }; // keep coppers/free simple
  const adjusted = Math.max(1, Math.round(price * multiplier));
  return { price: adjusted, unit };
}

function buildStandardShop(typeKey, sizeDef) {
  const typeDef = SHOP_TYPES[typeKey];
  const stockCount = Math.max(
    3,
    Math.round(typeDef.goods.length * sizeDef.stockMultiplier)
  );
  const stock = shuffled(typeDef.goods)
    .slice(0, stockCount)
    .map((g) => ({
      ...g,
      ...priceWithModifier(g.price, g.unit, sizeDef.priceMultiplier),
      quantity: randInt(1, 6),
    }));

  return {
    id: `${typeKey}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: typeKey,
    typeLabel: typeDef.label,
    name: makeShopName(typeDef),
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

// Generates a full settlement: an array of shop objects.
export function generateTown(sizeKey) {
  const sizeDef = TOWN_SIZES[sizeKey];
  if (!sizeDef) throw new Error(`Unknown town size: ${sizeKey}`);

  const shops = [];
  sizeDef.shopTypes.forEach((typeKey) => {
    if (typeKey === "random") {
      const count = randInt(...sizeDef.randomLocationCount);
      for (let i = 0; i < count; i++) shops.push(buildRandomLocation());
    } else {
      shops.push(buildStandardShop(typeKey, sizeDef));
    }
  });

  return { size: sizeKey, sizeLabel: sizeDef.label, shops };
}

export function rerollShop(typeKey, sizeKey) {
  const sizeDef = TOWN_SIZES[sizeKey];
  if (typeKey === "random") return buildRandomLocation();
  return buildStandardShop(typeKey, sizeDef);
}
