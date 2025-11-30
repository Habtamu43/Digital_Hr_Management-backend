import dotenv from "dotenv";

dotenv.config();
import app from "./app.js";
import db from "./config/db.js";



const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Database connected successfully!");

    // Sync all models - alter: true only for development
    await db.sequelize.sync({ alter: true }); 
    console.log("All models were synchronized successfully.");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Unable to connect to database:", err);
    process.exit(1);
  }
};

startServer();
