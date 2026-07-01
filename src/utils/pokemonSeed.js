const POKEMON_CATALOG = require('../data/pokemonGen1to9');
const { Creature, creatureKey } = require('../models/Creature');

const POKEMON_SOURCE = 'pokemon-gen1-9';

function pokemonCatalogStats() {
  return {
    totalPokemon: POKEMON_CATALOG.length,
    totalSkills: POKEMON_CATALOG.reduce((sum, item) => sum + (Array.isArray(item.skills) ? item.skills.length : 0), 0)
  };
}

async function seedPokemonCatalog(options = {}) {
  const userId = options.userId || null;
  const force = Boolean(options.force);
  const existingPokemonCount = await Creature.countDocuments({ source: POKEMON_SOURCE });

  if (!force && existingPokemonCount >= POKEMON_CATALOG.length) {
    return {
      skipped: true,
      reason: 'pokemon_catalog_already_seeded',
      total: POKEMON_CATALOG.length,
      existing: existingPokemonCount,
      inserted: 0,
      matched: existingPokemonCount,
      modified: 0,
      totalSkills: pokemonCatalogStats().totalSkills
    };
  }

  const operations = POKEMON_CATALOG.map(item => {
    const key = creatureKey(item.name);
    const set = {
      generation: item.generation,
      source: POKEMON_SOURCE,
      suggestedSkills: Array.isArray(item.skills) ? item.skills : []
    };
    if (userId) set.updatedBy = userId;

    const setOnInsert = {
      name: item.name,
      key
    };
    if (userId) setOnInsert.createdBy = userId;

    return {
      updateOne: {
        filter: { key },
        update: {
          $setOnInsert: setOnInsert,
          $set: set
        },
        upsert: true
      }
    };
  });

  const result = await Creature.bulkWrite(operations, { ordered: false });
  return {
    skipped: false,
    total: POKEMON_CATALOG.length,
    inserted: result.upsertedCount || 0,
    matched: result.matchedCount || 0,
    modified: result.modifiedCount || 0,
    totalSkills: pokemonCatalogStats().totalSkills
  };
}

module.exports = {
  POKEMON_SOURCE,
  POKEMON_CATALOG,
  pokemonCatalogStats,
  seedPokemonCatalog
};
