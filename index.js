import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import db from "./config/db.js";

const PORT = process.env.PORT || 1000;

const startServer = async () => {
  try {
    // 1. Verify Connection
    await db.sequelize.authenticate();
    console.log("✅ Database authenticated successfully!");

    // 2. CREATE / UPDATE THE TABLES
    console.log("⏳ Starting table synchronization...");
    
    // ⚠️ CHANGED TO { alter: true }. 
    // This creates missing tables safely WITHOUT deleting your existing data!
    await db.sequelize.sync({ alter: true }); 
    
    console.log("🚀 All tables have been synced safely!");

    // 3. Start Server
    app.listen(PORT, () => {
      console.log(`🌍 Server running on port ${PORT}`);
    });
    
  } catch (err) {
    // 🚨 BETTER ERROR LOGGING: This tells us EXACTLY why sync is failing
    console.error("❌ CRITICAL ERROR STARTING SERVER:", err.message);
    console.error(err); // Prints the full details to Render logs
    process.exit(1);
  }
};

startServer();