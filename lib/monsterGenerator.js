import { CR_TIERS, MONSTER_TYPES, ENVIRONMENTS } from "./data/monsterGenTables";

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rollStat(base, bias) {
  // 3d6-ish spread (8-18) nudged by the type's stat bias
  const raw = randInt(3, 18) + bias * 2;
  return Math.max(3, Math.min(24, raw));
}

export function generateRandomMonster(tierKey = "trivial") {
  const tier = CR_TIERS[tierKey];
  const typeDef = pick(MONSTER_TYPES);

  const stats = {
    str: rollStat(10, typeDef.statBias.str),
    dex: rollStat(10, typeDef.statBias.dex),
    con: rollStat(10, typeDef.statBias.con),
    int: rollStat(10, typeDef.statBias.int),
    wis: rollStat(10, typeDef.statBias.wis),
    cha: rollStat(10, typeDef.statBias.cha),
  };

  const name = `${pick(typeDef.namePrefixes)} ${pick(typeDef.nameNouns)}`;
  const cr = pick(tier.crValues);
  const hp = randInt(...tier.hpRange);
  const ac = randInt(...tier.acRange);
  const atkBonus = randInt(...tier.atkBonus);
  const size = pick(typeDef.sizes);
  const environment = [pick(ENVIRONMENTS), pick(ENVIRONMENTS)].filter(
    (v, i, arr) => arr.indexOf(v) === i
  );

  const traitCount = randInt(1, 2);
  const traits = shuffled(typeDef.traits).slice(0, traitCount);

  const actionCount = randInt(1, 2);
  const actions = shuffled(typeDef.actionVerbs)
    .slice(0, actionCount)
    .map((verb) => `${verb}: +${atkBonus} to hit, ${tier.dmgDice}+${Math.floor(atkBonus / 2)} damage`);

  return {
    id: `gen-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    cr,
    type: typeDef.type,
    size,
    environment,
    ac,
    hp,
    speed: "30 ft.",
    stats,
    traits,
    actions,
    generated: true,
  };
}

function shuffled(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
