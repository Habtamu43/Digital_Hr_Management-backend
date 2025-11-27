import express from "express";
import {
  HandleCreateDepartment,
  HandleAllDepartments,
  HandleDepartment,
  HandleUpdateDepartment,
  HandleDeleteDepartment
} from "../controllers/Department.controller.js";

import { VerifyhHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

// Create a new department
router.post("/create-department", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleCreateDepartment);

// Get all departments
router.get("/all", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleAllDepartments);

// Get a specific department by ID
router.get("/:departmentID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleDepartment);

// Update department details
router.patch("/update-department", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleUpdateDepartment);

// Delete a department
router.delete("/delete-department", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleDeleteDepartment);

export default router;
