import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get database config from environment variables
const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  DB_HOST,
  DB_DIALECT
} = process.env;

const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT || 'postgres',
  logging: false,
});

const db = {};

// Dynamically import all model files
const files = fs
  .readdirSync(__dirname)
  .filter(file => file !== path.basename(__filename) && file.endsWith('.js'));

for (const file of files) {
  const modulePath = path.join(__dirname, file);
  const { default: modelFunc } = await import(`file://${modulePath}`);
  const model = modelFunc(sequelize, DataTypes);
  db[model.name] = model;
}

// Setup associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
