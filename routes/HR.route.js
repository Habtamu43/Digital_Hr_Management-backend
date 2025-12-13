import express from "express";
import {
  HandleAllHR,
  HandleDeleteHR,
  HandleHR,
  HandleUpdateHR
} from "../controllers/HR.controller.js";

import { VerifyHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

// Get all HR records (HR-Admin only)
router.get("/all", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleAllHR);

// Get a specific HR record by ID (HR-Admin only)
router.get("/:HRID", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleHR);

// Update HR record (HR-Admin only)
router.patch("/update-HR", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleUpdateHR);

// Delete HR record by ID (HR-Admin only)
router.delete("/delete-HR/:HRID", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleDeleteHR);

export default router;

