import express from "express";
import {
  HandleCreateRecruitment,
  HandleAllRecruitments,
  HandleRecruitment,
  HandleUpdateRecruitment,
  HandleDeleteRecruitment
} from "../controllers/Recruitment.controller.js";

import { VerifyhHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

// Create a recruitment record (HR-Admin only)
router.post("/create-recruitment", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleCreateRecruitment);

// Get all recruitment records (HR-Admin only)
router.get("/all", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleAllRecruitments);

// Get a specific recruitment record by ID (HR-Admin only)
router.get("/:recruitmentID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleRecruitment);

// Update a recruitment record (HR-Admin only)
router.patch("/update-recruitment", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleUpdateRecruitment);

// Delete a recruitment record by ID (HR-Admin only)
router.delete("/delete-recruitment/:recruitmentID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleDeleteRecruitment);

export default router;
