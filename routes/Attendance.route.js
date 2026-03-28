import express from "express";
import {
  HandleInitializeAttendance,
  HandleAllAttendance,
  HandleAttendance,
  HandleUpdateAttendance,
  HandleDeleteAttendance,
} from "../controllers/Attendance.controller.js";

import {
  VerifyEmployeeToken,
  VerifyhHRToken,
} from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Attendance management endpoints
 */

/**
 * ===============================
 * Initialize Attendance (Employee Check-In)
 * ===============================
 */
/**
 * @swagger
 * /api/v1/attendance/initialize:
 *   post:
 *     summary: Employee checks in
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeID
 *             properties:
 *               employeeID:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Attendance initialized (check-in)
 */
router.post("/initialize", VerifyEmployeeToken, HandleInitializeAttendance);

/**
 * ===============================
 * Get All Attendance (HR-Admin)
 * ===============================
 */
/**
 * @swagger
 * /api/v1/attendance/all:
 *   get:
 *     summary: HR admin retrieves all attendance records
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully
 */
router.get(
  "/all",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleAllAttendance
);

/**
 * ===============================
 * Get Single Attendance (HR-Admin)
 * ===============================
 */
/**
 * @swagger
 * /api/v1/attendance/{attendanceID}:
 *   get:
 *     summary: HR admin retrieves a specific attendance record
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attendanceID
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Attendance record found
 *       404:
 *         description: Attendance record not found
 */
router.get(
  "/:attendanceId",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleAttendance
);

/**
 * ===============================
 * Update Attendance (Employee Checkout)
 * ===============================
 */
/**
 * @swagger
 * /api/v1/attendance/update-attendance:
 *   patch:
 *     summary: Employee updates own attendance (check-out)
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attendanceID
 *               - checkoutTime
 *             properties:
 *               attendanceID:
 *                 type: integer
 *                 example: 1
 *               checkoutTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-03T17:40:00Z"
 *     responses:
 *       200:
 *         description: Attendance updated successfully
 *       400:
 *         description: Invalid data
 */
router.patch("/update-attendance", VerifyEmployeeToken, HandleUpdateAttendance);

/**
 * ===============================
 * Delete Attendance (HR-Admin)
 * ===============================
 */
/**
 * @swagger
 * /api/v1/attendance/delete-attendance/{attendanceID}:
 *   delete:
 *     summary: HR admin deletes an attendance record
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attendanceID
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Attendance deleted successfully
 *       404:
 *         description: Attendance record not found
 */
router.delete(
  "/delete-attendance/:attendanceId",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleDeleteAttendance
);

export default router;
