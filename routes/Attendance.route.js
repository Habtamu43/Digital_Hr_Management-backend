import express from "express";
import {
  HandleInitializeAttendance,
  HandleAllAttendance,
  HandleAttendance,
  HandleUpdateAttendance,
  HandleDeleteAttendance
} from "../controllers/Attendance.controller.js";

import { VerifyEmployeeToken, VerifyHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

// Employee initializes attendance
router.post("/initialize", VerifyEmployeeToken, HandleInitializeAttendance);

// HR admin views all attendance records
router.get("/all", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleAllAttendance);

// HR admin views specific attendance record
router.get("/:attendanceID", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleAttendance);

// Employee updates own attendance (e.g., check-out)
router.patch("/update-attendance", VerifyEmployeeToken, HandleUpdateAttendance);

// HR admin deletes attendance record
router.delete("/delete-attendance/:attendanceID", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleDeleteAttendance);

export default router;

