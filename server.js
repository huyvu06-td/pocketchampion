require('dotenv').config();

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const { User } = require('./src/models/User');
const { Beast } = require('./src/models/Beast');
const { Creature, creatureKey } = require('./src/models/Creature');
const { seedPokemonCatalog } = require('./src/utils/pokemonSeed');

const authRoutes = require('./src/routes/auth');
const beastRoutes = require('./src/routes/beasts');
const userRoutes = require('./src/routes/users');
const creatureRoutes = require('./src/routes/creatures');
const settingRoutes = require('./src/routes/settings');
const teamGuideRoutes = require('./src/routes/teamGuides');

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.MONGO_URI) {
  console.error('Missing MONGO_URI environment variable.');
  process.exit(1);
}
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 24) {
  console.error('Missing JWT_SECRET or JWT_SECRET is too short. Use at least 24 random characters.');
  process.exit(1);
}

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(express.json({ limit: '8mb' }));
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders(res, filePath) {
    if (/\.(html|js|css)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    }
  }
}));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, app: 'Pocket Champion Linh Thu Online' });
});

app.use('/api/settings', settingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/creatures', creatureRoutes);
app.use('/api/beasts', beastRoutes);
app.use('/api/users', userRoutes);
app.use('/api/team-guides', teamGuideRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Lỗi máy chủ.' });
});

async function seedAdmin() {
  const username = String(process.env.ADMIN_USERNAME || '').trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || '');
  const displayName = String(process.env.ADMIN_DISPLAY_NAME || 'Admin').trim();
  const gameName = String(process.env.ADMIN_GAME_NAME || '').trim();
  const resetPasswordOnStart = String(process.env.ADMIN_RESET_PASSWORD_ON_START || '').toLowerCase() === 'true';

  if (!username || !password) {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      console.warn('No ADMIN_USERNAME/ADMIN_PASSWORD configured and no admin account exists. Self-registered users will remain user only.');
    }
    return;
  }

  const existing = await User.findOne({ username });
  if (!existing) {
    const passwordHash = await User.hashPassword(password);
    await User.create({ username, displayName, gameName, passwordHash, role: 'admin', roleBase: 'admin' });
    console.log(`Seeded admin account: ${username}`);
    return;
  }

  let changed = false;

  if (existing.role !== 'admin') {
    existing.role = 'admin';
    existing.roleBase = 'admin';
    existing.passwordHash = await User.hashPassword(password);
    changed = true;
    console.log(`Promoted configured account to admin: ${username}`);
  } else if (existing.roleBase !== 'admin') {
    existing.roleBase = 'admin';
    changed = true;
  } else if (resetPasswordOnStart) {
    existing.passwordHash = await User.hashPassword(password);
    changed = true;
    console.log(`Reset configured admin password from environment: ${username}`);
  }

  if (displayName && !existing.displayName) {
    existing.displayName = displayName;
    changed = true;
  }
  if (gameName && !existing.gameName) {
    existing.gameName = gameName;
    changed = true;
  }

  if (changed) {
    await existing.save();
  }
}


async function migrateBeastIndexes() {
  try {
    let indexes = [];
    try {
      indexes = await Beast.collection.indexes();
    } catch (error) {
      if (error.codeName !== 'NamespaceNotFound') throw error;
    }

    const oldUniqueNameIndex = indexes.find(index => {
      const keys = Object.keys(index.key || {});
      return index.unique === true && keys.length === 1 && index.key.name === 1;
    });

    if (oldUniqueNameIndex) {
      await Beast.collection.dropIndex(oldUniqueNameIndex.name);
      console.log(`Dropped old unique beast name index: ${oldUniqueNameIndex.name}`);
    }

    await Beast.collection.createIndex(
      { name: 1, createdBy: 1 },
      {
        unique: true,
        name: 'unique_build_name_per_builder',
        partialFilterExpression: { createdBy: { $exists: true } }
      }
    );

    await Beast.collection.createIndex(
      { creature: 1, createdBy: 1 },
      {
        unique: true,
        name: 'unique_build_per_creature_builder',
        partialFilterExpression: { creature: { $exists: true }, createdBy: { $exists: true } }
      }
    );
  } catch (error) {
    console.warn('Could not migrate beast indexes:', error.message);
  }
}


async function syncCreatureCatalogFromBuilds() {
  try {
    const buildNames = await Beast.distinct('name');
    for (const rawName of buildNames) {
      const name = String(rawName || '').trim().replace(/\s+/g, ' ');
      if (!name) continue;
      const key = creatureKey(name);
      let creature = await Creature.findOne({ key });
      if (!creature) {
        creature = await Creature.create({ name, key });
      }
      await Beast.updateMany(
        { $or: [{ creature: { $exists: false } }, { creature: null }], name },
        { $set: { creature: creature._id } }
      );
    }
  } catch (error) {
    console.warn('Could not sync creature catalog from existing builds:', error.message);
  }
}

async function start() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  await seedAdmin();
  await migrateBeastIndexes();
  await syncCreatureCatalogFromBuilds();
  if (String(process.env.AUTO_SEED_POKEMON || 'true').toLowerCase() !== 'false') {
    const seedResult = await seedPokemonCatalog({ force: false });
    if (seedResult.skipped) {
      console.log(`Pokémon catalog already seeded: ${seedResult.existing}/${seedResult.total}`);
    } else {
      console.log(`Seeded Pokémon catalog: ${seedResult.inserted} inserted, ${seedResult.modified} updated, ${seedResult.total} total`);
    }
  }

  app.listen(PORT, () => {
    console.log(`Pocket Champion app is running on port ${PORT}`);
  });
}

start().catch(error => {
  console.error('Failed to start app:', error);
  process.exit(1);
});
