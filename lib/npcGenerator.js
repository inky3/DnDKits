import {
  SPECIES,
  ROLES,
  PERSONALITY,
  ATTITUDE_LADDER,
} from "./data/npcData";

/* ---------------------------------------------------------
   Utility functions
--------------------------------------------------------- */

function randomItem(array) {
  if (!array || array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
}

function randomKey(object) {
  const keys = Object.keys(object);
  return keys[Math.floor(Math.random() * keys.length)];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/* ---------------------------------------------------------
   Ability modifiers
--------------------------------------------------------- */

function abilityModifier(score) {
  return Math.floor((score - 10) / 2);
}

function calculateModifiers(stats) {
  return Object.fromEntries(
    Object.entries(stats).map(([ability, score]) => [
      ability,
      abilityModifier(score),
    ])
  );
}

/* ---------------------------------------------------------
   Species
--------------------------------------------------------- */

function generateSpecies(preferredSpecies) {
  if (
    preferredSpecies &&
    SPECIES[preferredSpecies]
  ) {
    return preferredSpecies;
  }

  return randomKey(SPECIES);
}

/* ---------------------------------------------------------
   Role
--------------------------------------------------------- */

function generateRole(preferredRole) {
  if (
    preferredRole &&
    ROLES[preferredRole]
  ) {
    return preferredRole;
  }

  return randomKey(ROLES);
}

/* ---------------------------------------------------------
   Ability scores
--------------------------------------------------------- */

function generateStats(species, role) {
  const baseStats = { ...role.baseStats };

  const stats = {};

  for (const ability of Object.keys(baseStats)) {
    const speciesModifier =
      species.mods?.[ability] ?? 0;

    stats[ability] = clamp(
      baseStats[ability] + speciesModifier,
      1,
      20
    );
  }

  return stats;
}

/* ---------------------------------------------------------
   Attitude
--------------------------------------------------------- */

function generateAttitude(role, preferredAttitude) {
  if (
    preferredAttitude &&
    ATTITUDE_LADDER.includes(preferredAttitude)
  ) {
    return preferredAttitude;
  }

  return role.defaultAttitude || "Neutral";
}

/* ---------------------------------------------------------
   Personality
--------------------------------------------------------- */

function generatePersonality() {
  return {
    trait: randomItem(PERSONALITY.traits),
    ideal: randomItem(PERSONALITY.ideals),
    bond: randomItem(PERSONALITY.bonds),
    flaw: randomItem(PERSONALITY.flaws),
  };
}

/* ---------------------------------------------------------
   Name
--------------------------------------------------------- */

function generateName(species) {
  return randomItem(species.names) || "Unknown";
}

/* ---------------------------------------------------------
   Main NPC generator
--------------------------------------------------------- */

/**
 * Generate a complete NPC.
 *
 * Supported preferences:
 *
 * {
 *   species: "human",
 *   role: "merchant",
 *   attitude: "Friendly"
 * }
 *
 * Any preference can be omitted and will be randomized.
 */
export function generateNPC(prefs = {}) {
  const speciesKey = generateSpecies(
    prefs.species
  );

  const roleKey = generateRole(
    prefs.role
  );

  const species = SPECIES[speciesKey];
  const role = ROLES[roleKey];

  const stats = generateStats(
    species,
    role
  );

  const modifiers = calculateModifiers(
    stats
  );

  const attitude = generateAttitude(
    role,
    prefs.attitude
  );

  const personality = generatePersonality();

  const name = generateName(species);

  return {
    id:
      typeof crypto !== "undefined" &&
      crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`,

    name,

    species: speciesKey,
    speciesLabel: species.label,

    role: roleKey,
    roleLabel: role.label,

    speed: species.speed,

    stats,

    modifiers,

    ac: role.ac,

    hp: role.hp,

    skills: {
      ...role.skills,
    },

    actions: [
      ...role.actions,
    ],

    attitude,

    environment: [
      ...role.environment,
    ],

    personality,

    generatedAt: new Date().toISOString(),
  };
}

export default generateNPC;