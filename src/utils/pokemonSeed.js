const POKEMON_CATALOG = require('../data/pokemonGen1to9');
const { Creature, creatureKey } = require('../models/Creature');
const { Beast } = require('../models/Beast');

const POKEMON_SOURCE = 'pokemon-gen1-9';
const POKEMON_CATALOG_KEYS = POKEMON_CATALOG.map(item => creatureKey(item.name));

function pokemonCatalogStats() {
  return {
    totalPokemon: POKEMON_CATALOG.length,
    totalSkills: POKEMON_CATALOG.reduce((sum, item) => sum + (Array.isArray(item.skills) ? item.skills.length : 0), 0),
    catalogType: 'final-evolution-gen1-9'
  };
}

async function cleanupOldPokemonCatalog() {
  const extraCreatures = await Creature.find({
    source: POKEMON_SOURCE,
    key: { $nin: POKEMON_CATALOG_KEYS }
  }).select('_id name key');

  if (!extraCreatures.length) {
    return { removedOldPokemon: 0, keptOldPokemonWithBuilds: 0 };
  }

  const extraIds = extraCreatures.map(creature => creature._id);
  const buildRows = await Beast.aggregate([
    { $match: { creature: { $in: extraIds } } },
    { $group: { _id: '$creature', count: { $sum: 1 } } }
  ]);
  const builtIds = new Set(buildRows.map(row => row._id.toString()));
  const removableIds = extraCreatures
    .filter(creature => !builtIds.has(creature._id.toString()))
    .map(creature => creature._id);
  const keptIds = extraCreatures
    .filter(creature => builtIds.has(creature._id.toString()))
    .map(creature => creature._id);

  let removedOldPokemon = 0;
  if (removableIds.length) {
    const result = await Creature.deleteMany({ _id: { $in: removableIds } });
    removedOldPokemon = result.deletedCount || 0;
  }

  if (keptIds.length) {
    await Creature.updateMany(
      { _id: { $in: keptIds } },
      {
        $set: { source: 'custom-kept-with-build' },
        $unset: { generation: '', suggestedSkills: '' }
      }
    );
  }

  return {
    removedOldPokemon,
    keptOldPokemonWithBuilds: keptIds.length
  };
}

async function seedPokemonCatalog(options = {}) {
  const userId = options.userId || null;
  const force = Boolean(options.force);
  const existingFinalCount = await Creature.countDocuments({
    source: POKEMON_SOURCE,
    key: { $in: POKEMON_CATALOG_KEYS }
  });
  const extraPokemonCount = await Creature.countDocuments({
    source: POKEMON_SOURCE,
    key: { $nin: POKEMON_CATALOG_KEYS }
  });

  if (!force && existingFinalCount >= POKEMON_CATALOG.length && extraPokemonCount === 0) {
    return {
      skipped: true,
      reason: 'pokemon_final_catalog_already_seeded',
      total: POKEMON_CATALOG.length,
      existing: existingFinalCount,
      inserted: 0,
      matched: existingFinalCount,
      modified: 0,
      removedOldPokemon: 0,
      keptOldPokemonWithBuilds: 0,
      totalSkills: pokemonCatalogStats().totalSkills,
      catalogType: pokemonCatalogStats().catalogType
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
  const cleanup = await cleanupOldPokemonCatalog();

  return {
    skipped: false,
    total: POKEMON_CATALOG.length,
    inserted: result.upsertedCount || 0,
    matched: result.matchedCount || 0,
    modified: result.modifiedCount || 0,
    removedOldPokemon: cleanup.removedOldPokemon,
    keptOldPokemonWithBuilds: cleanup.keptOldPokemonWithBuilds,
    totalSkills: pokemonCatalogStats().totalSkills,
    catalogType: pokemonCatalogStats().catalogType
  };
}

module.exports = {
  POKEMON_SOURCE,
  POKEMON_CATALOG,
  pokemonCatalogStats,
  seedPokemonCatalog
};
