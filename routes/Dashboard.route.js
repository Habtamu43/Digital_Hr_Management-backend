import express from "express";
import { HandleHRDashboard } from "../controllers/Dashboard.controller.js";
import { VerifyhHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: HR Dashboard related endpoints
 */

/**
 * ===============================
 * HR Dashboard
 * ===============================
 */
/**
 * @swagger
 * /api/v1/dashboard/HR-dashboard:
 *   get:
 *     summary: Get HR dashboard data
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: HR dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: HR dashboard data fetched successfully
 *               data:
 *                 totalEmployees: 120
 *                 totalDepartments: 8
 *                 totalApplicants: 15
 *                 pendingAttendance: 5
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get(
  "/HR-dashboard",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleHRDashboard
);

export default router;
