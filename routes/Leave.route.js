import express from "express";
import {
  HandleAllLeaves,
  HandleCreateLeave,
  HandleDeleteLeave,
  HandleLeave,
  HandleUpdateLeaveByEmployee,
  HandleUpdateLeaveByHR
} from "../controllers/Leave.controller.js";

import { VerifyEmployeeToken, VerifyHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Leave
 *   description: Employee leave management endpoints
 */

/**
 * ===============================
 * Employee creates a leave request
 * ===============================
 */
/**
 * @swagger
 * /api/v1/leave/create-leave:
 *   post:
 *     summary: Employee creates a new leave request
 *     tags: [Leave]
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
 *               - leaveType
 *               - startDate
 *               - endDate
 *               - reason
 *             properties:
 *               employeeID:
 *                 type: integer
 *                 example: 1
 *               leaveType:
 *                 type: string
 *                 example: "Sick Leave"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-20"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-22"
 *               reason:
 *                 type: string
 *                 example: "Medical checkup"
 *     responses:
 *       201:
 *         description: Leave request created successfully
 */
router.post("/create-leave", VerifyEmployeeToken, HandleCreateLeave);

/**
 * ===============================
 * HR-Admin views all leave requests
 * ===============================
 */
/**
 * @swagger
 * /api/v1/leave/all:
 *   get:
 *     summary: HR-Admin retrieves all leave requests
 *     tags: [Leave]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all leave requests
 */
router.get("/all", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleAllLeaves);

/**
 * ===============================
 * HR-Admin views a leave request by ID
 * ===============================
 */
/**
 * @swagger
 * /api/v1/leave/{leaveID}:
 *   get:
 *     summary: HR-Admin retrieves a specific leave request by ID
 *     tags: [Leave]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leaveID
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Leave request retrieved successfully
 *       404:
 *         description: Leave request not found
 */
router.get("/:leaveID", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleLeave);

/**
 * ===============================
 * Employee updates their leave request
 * ===============================
 */
/**
 * @swagger
 * /api/v1/leave/employee-update-leave:
 *   patch:
 *     summary: Employee updates their leave request
 *     tags: [Leave]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leaveID
 *               - UpdatedData
 *             properties:
 *               leaveID:
 *                 type: integer
 *                 example: 1
 *               UpdatedData:
 *                 type: object
 *                 example:
 *                   leaveType: "Casual Leave"
 *                   startDate: "2025-12-21"
 *                   endDate: "2025-12-23"
 *                   reason: "Personal work"
 *     responses:
 *       200:
 *         description: Leave request updated successfully
 *       404:
 *         description: Leave request not found
 */
router.patch("/employee-update-leave", VerifyEmployeeToken, HandleUpdateLeaveByEmployee);

/**
 * ===============================
 * HR-Admin updates leave status
 * ===============================
 */
/**
 * @swagger
 * /api/v1/leave/HR-update-leave:
 *   patch:
 *     summary: HR-Admin updates the status of a leave request
 *     tags: [Leave]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leaveID
 *               - UpdatedData
 *             properties:
 *               leaveID:
 *                 type: integer
 *                 example: 1
 *               UpdatedData:
 *                 type: object
 *                 example:
 *                   status: "approved"
 *     responses:
 *       200:
 *         description: Leave status updated successfully
 *       404:
 *         description: Leave request not found
 */
router.patch("/HR-update-leave", VerifyHRToken, RoleAuthorization("HR-Admin"),   HandleUpdateLeaveByHR);

/**
 * ===============================
 * Employee deletes their leave request
 * ===============================
 */
/**
 * @swagger
 * /api/v1/leave/delete-leave/{leaveID}:
 *   delete:
 *     summary: Employee deletes their leave request
 *     tags: [Leave]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leaveID
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Leave request deleted successfully
 *       404:
 *         description: Leave request not found
 */
router.delete("/delete-leave/:leaveID", VerifyEmployeeToken, HandleDeleteLeave);

export default router;
