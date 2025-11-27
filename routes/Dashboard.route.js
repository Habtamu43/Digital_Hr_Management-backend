import express from "express";
import { HandleHRDashboard } from "../controllers/Dashboard.controller.js";
import { VerifyhHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

// HR Dashboard route
router.get("/HR-dashboard", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleHRDashboard);

export default router;
