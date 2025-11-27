import express from "express";
import {
  HandleCreateSalary,
  HandleAllSalary,
  HandleSalary,
  HandleUpdateSalary,
  HandleDeleteSalary
} from "../controllers/Salary.controller.js";

import { VerifyhHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

// Create a salary record (HR-Admin only)
router.post("/create-salary", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleCreateSalary);

// Get all salary records (HR-Admin only)
router.get("/all", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleAllSalary);

// Get a specific salary record by ID (HR-Admin only)
router.get("/:salaryID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleSalary);

// Update a salary record (HR-Admin only)
router.patch("/update-salary", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleUpdateSalary);

// Delete a salary record by ID (HR-Admin only)
router.delete("/delete-salary/:salaryID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleDeleteSalary);

export default router;
