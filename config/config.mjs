// export default {
//development: {
// username: process.env.DB_USERNAME,
//password: process.env.DB_PASSWORD,
// database: process.env.DB_NAME,
// host: process.env.DB_HOST,
// dialect: process.env.DB_DIALECT || 'postgres',
// },
// test: {
// username: process.env.DB_USERNAME,
// password: process.env.DB_PASSWORD,
//database: process.env.DB_NAME_TEST,
// host: process.env.DB_HOST,
// dialect: process.env.DB_DIALECT || 'postgres',
// },
// production: {
// username: process.env.DB_USERNAME,
// password: process.env.DB_PASSWORD,
// database: process.env.DB_NAME,
// host: process.env.DB_HOST,
// dialect: process.env.DB_DIALECT || 'postgres',
//},
//};

// config/config.mjs
import dotenv from "dotenv"; // make sure this is NOT commented
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: path.join(__dirname, "../.env") });

export default {
  development: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // required for Supabase
      },
    },
  },
  test: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
  },
};
