// backend/config/db.js
import { Sequelize, DataTypes } from "sequelize";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Load .env explicitly from backend folder
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// DEBUG: check if env is loaded
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- Initialize Sequelize --------------------
// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USERNAME,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: process.env.DB_DIALECT || "postgres",
//     logging: false, // set true if you want to debug SQL queries
//   },
// );

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// -------------------- Setup db object --------------------
const db = {};

// Correct path to models folder relative to db.js
const modelsPath = path.join(__dirname, "../models");

// Dynamically import all models
const modelFiles = fs
  .readdirSync(modelsPath)
  .filter((file) => file.endsWith(".js") && file !== "index.js");

for (const file of modelFiles) {
  const { default: modelFunc } = await import(
    `file://${path.join(modelsPath, file)}`
  );
  const model = modelFunc(sequelize, DataTypes);
  db[model.name] = model;
}

// -------------------- Setup associations --------------------
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

// -------------------- Add Sequelize instances --------------------
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// -------------------- Optional: Test the connection --------------------
try {
  await sequelize.authenticate();
  console.log("✅ Database connected successfully!");
} catch (err) {
  console.error("❌ Unable to connect to the database:", err);
}

export default db;