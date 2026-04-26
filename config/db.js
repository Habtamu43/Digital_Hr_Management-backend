import { Sequelize, DataTypes } from "sequelize";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- Initialize Sequelize --------------------
console.log("Connecting to:", process.env.DATABASE_URL ? "URL found" : "URL MISSING");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: console.log, // 👈 CHANGE THIS TO console.log to see the CREATE TABLE commands
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const db = {};
const modelsPath = path.join(__dirname, "../models");

// -------------------- Dynamically import all models --------------------
const modelFiles = fs
  .readdirSync(modelsPath)
  .filter((file) => file.endsWith(".js") && file !== "index.js");

console.log(`🔍 Found ${modelFiles.length} model files in: ${modelsPath}`);

for (const file of modelFiles) {
  try {
    const filePath = path.join(modelsPath, file);
    
    // 💡 FIX: Ensure the file URL is correct for Linux/Render
    const fileUrl = `file://${filePath.startsWith('/') ? '' : '/'}${filePath}`;
    
    const { default: modelFunc } = await import(fileUrl);
    
    if (typeof modelFunc === 'function') {
      const model = modelFunc(sequelize, DataTypes);
      db[model.name] = model;
      console.log(`✅ Loaded Model: ${model.name}`); // This will tell us if HumanResources is found
    }
  } catch (err) {
    console.error(`❌ Failed to load model file ${file}:`, err.message);
  }
}

// -------------------- Setup associations --------------------
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    try {
      console.log(`🔗 Associating model: ${modelName}`);
      db[modelName].associate(db);
    } catch (assocError) {
      console.error(`❌ Association failed for ${modelName}:`, assocError.message);
    }
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// -------------------- Test Connection --------------------
try {
  await sequelize.authenticate();
  console.log("🚀 Database connected successfully!");
} catch (err) {
  console.error("❌ Database connection error:", err);
}

export default db;