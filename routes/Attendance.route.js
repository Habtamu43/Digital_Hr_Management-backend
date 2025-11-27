import express from "express";
import {
  HandleInitializeAttendance,
  HandleAllAttendance,
  HandleAttendance,
  HandleUpdateAttendance,
  HandleDeleteAttendance
} from "../controllers/Attendance.controller.js";

import { VerifyEmployeeToken, VerifyhHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

// Employee initializes attendance
router.post("/initialize", VerifyEmployeeToken, HandleInitializeAttendance);

// HR admin views all attendance records
router.get("/all", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleAllAttendance);

// HR admin views specific attendance record
router.get("/:attendanceID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleAttendance);

// Employee updates own attendance (e.g., check-out)
router.patch("/update-attendance", VerifyEmployeeToken, HandleUpdateAttendance);

// HR admin deletes attendance record
router.delete("/delete-attendance/:attendanceID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleDeleteAttendance);

export default router;

