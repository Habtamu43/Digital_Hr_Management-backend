import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import db from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  
  try {

    // ✅ Only authenticate (connect)
    await db.sequelize.authenticate();

    console.log("Database connected successfully!");

    // ❌ NEVER sync here
    // await db.sequelize.sync({ alter: true }); 

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("Unable to connect to database:", err);
    process.exit(1);
  }
};

startServer();
