import express from "express";
import {
  HandleAllEmployees,
  HandleEmployeeUpdate,
  HandleEmployeeDelete,
  HandleEmployeeByHR,
  HandleEmployeeByEmployee,
  HandleAllEmployeesIDS
} from "../controllers/Employee.controller.js";

import { VerifyHRToken, VerifyEmployeeToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

// Get all employees (HR-Admin only)
router.get("/all", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleAllEmployees);

// Get all employee IDs (HR-Admin only)
router.get("/all-employees-ids", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleAllEmployeesIDS);

// Employee updates own info
router.patch("/update-employee", VerifyEmployeeToken, HandleEmployeeUpdate);

// Delete an employee (HR-Admin only)
router.delete("/delete-employee/:employeeId", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleEmployeeDelete);

// Get employee details by HR (HR-Admin only)
router.get("/by-HR/:employeeId", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleEmployeeByHR);

// Get own employee details
router.get("/by-employee", VerifyEmployeeToken, HandleEmployeeByEmployee);

export default router;
