import express from "express";
import {
  HandleAllLeaves,
  HandleCreateLeave,
  HandleDeleteLeave,
  HandleLeave,
  HandleUpdateLeaveByEmployee,
  HandleUpdateLeavebyHR
} from "../controllers/Leave.controller.js";

import { VerifyEmployeeToken, VerifyhHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

// Employee creates a leave request
router.post("/create-leave", VerifyEmployeeToken, HandleCreateLeave);

// HR-Admin views all leave requests
router.get("/all", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleAllLeaves);

// HR-Admin views a specific leave request by ID
router.get("/:leaveID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleLeave);

// Employee updates their leave request
router.patch("/employee-update-leave", VerifyEmployeeToken, HandleUpdateLeaveByEmployee);

// HR-Admin updates leave status
router.patch("/HR-update-leave", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleUpdateLeavebyHR);

// Employee deletes their leave request
router.delete("/delete-leave/:leaveID", VerifyEmployeeToken, HandleDeleteLeave);

export default router;
