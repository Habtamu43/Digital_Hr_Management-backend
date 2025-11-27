import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

// Get environment, default to 'development'
const env = process.env.NODE_ENV || 'development';

// Map the environment variables
const DB_NAME = process.env.DB_NAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_DIALECT = process.env.DB_DIALECT || 'postgres';

// Initialize Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: false,
});

// Optional: separate connect function
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully!');
  } catch (err) {
    console.error('Unable to connect to database:', err);
    process.exit(1); // exit if DB connection fails
  }
};

export default sequelize;
