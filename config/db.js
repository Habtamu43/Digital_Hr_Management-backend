// backend/config/db.js
import { Sequelize, DataTypes } from "sequelize";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "postgres",
    logging: false,
  }
);

const db = {};
const modelsPath = path.join(process.cwd(), "models");

// Dynamically load models
const modelFiles = fs
  .readdirSync(modelsPath)
  .filter((file) => file.endsWith(".js") && file !== "index.js");

for (const file of modelFiles) {
  const { default: modelFunc } = await import(`file://${path.join(modelsPath, file)}`);
  const model = modelFunc(sequelize, DataTypes);
  db[model.name] = model;
}

// Setup associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) db[modelName].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
