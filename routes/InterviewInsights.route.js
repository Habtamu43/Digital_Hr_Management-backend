import express from "express";
import {
  HandleAllInterviews,
  HandleCreateInterview,
  HandleInterview,
  HandleUpdateInterview,
  HandleDeleteInterview
} from "../controllers/InterviewInsights.controller.js";

import { VerifyhHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

// Create a new interview (HR-Admin only)
router.post("/create-interview", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleCreateInterview);

// Get all interviews (HR-Admin only)
router.get("/all", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleAllInterviews);

// Get a specific interview by ID (HR-Admin only)
router.get("/:interviewID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleInterview);

// Update interview details (HR-Admin only)
router.patch("/update-interview", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleUpdateInterview);

// Delete an interview by ID (HR-Admin only)
router.delete("/delete-interview/:interviewID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleDeleteInterview);

export default router;
