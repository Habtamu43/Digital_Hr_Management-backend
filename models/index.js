import { sequelize, Sequelize } from "../config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const models = {};

// Only load JS model files once
const files = fs.readdirSync(__dirname).filter(f => f.endsWith(".js") && f !== "index.js");

for (const file of files) {
  const filePath = path.join(__dirname, file);
  const moduleURL = `file://${filePath.replace(/\\/g, '/')}`; // Windows-safe URL
  const imported = await import(moduleURL);

  if (!imported.default || typeof imported.default !== "function") continue;

  const model = imported.default(sequelize, Sequelize.DataTypes);

  if (!models[model.name]) {
    models[model.name] = model;
    model._associated = false; // flag to avoid multiple associations
  }
}

// Setup associations exactly once
for (const model of Object.values(models)) {
  if (model.associate && !model._associated) {
    console.log(`Associating ${model.name}`);
    model.associate(models);
    model._associated = true;
  }
}

// Export all models + sequelize
export const modelsExport = { ...models };

export const {
  Applicant,
  Attendance,
  Balance,
  CorporateCalendar,
  Department,
  Employee,
  GenerateRequest,
  HR,
  HumanResources,
  InterviewInsights,
  Leave,
  Notice,
  Organization,
  Recruitment,
  Salary,
} = models;

export { sequelize, Sequelize, models };
