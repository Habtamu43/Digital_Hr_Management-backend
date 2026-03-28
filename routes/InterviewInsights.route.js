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

/**
 * @swagger
 * tags:
 *   name: InterviewInsights
 *   description: HR-Admin Interview management endpoints
 */

/**
 * ===============================
 * Create a new Interview
 * ===============================
 */
/**
 * @swagger
 * /api/v1/interview/create-interview:
 *   post:
 *     summary: HR-Admin creates a new interview record
 *     tags: [InterviewInsights]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - candidateName
 *               - role
 *               - interviewDate
 *               - interviewer
 *               - status
 *             properties:
 *               candidateName:
 *                 type: string
 *                 example: "Anna Smith"
 *               role:
 *                 type: string
 *                 example: "Software Engineer"
 *               interviewDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-10T10:00:00Z"
 *               interviewer:
 *                 type: string
 *                 example: "John Doe"
 *               status:
 *                 type: string
 *                 example: "scheduled"
 *     responses:
 *       201:
 *         description: Interview created successfully
 */
router.post("/create-interview", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleCreateInterview);

/**
 * ===============================
 * Get all Interviews
 * ===============================
 */
/**
 * @swagger
 * /api/v1/interview/all:
 *   get:
 *     summary: HR-Admin retrieves all interview records
 *     tags: [InterviewInsights]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all interviews
 */
router.get("/all", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleAllInterviews);

/**
 * ===============================
 * Get Interview by ID
 * ===============================
 */
/**
 * @swagger
 * /api/v1/interview/{interviewID}:
 *   get:
 *     summary: HR-Admin retrieves a specific interview by ID
 *     tags: [InterviewInsights]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: interviewID
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Interview retrieved successfully
 *       404:
 *         description: Interview not found
 */
router.get("/:interviewID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleInterview);

/**
 * ===============================
 * Update Interview
 * ===============================
 */
/**
 * @swagger
 * /api/v1/interview/update-interview:
 *   patch:
 *     summary: HR-Admin updates an existing interview record
 *     tags: [InterviewInsights]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - interviewID
 *               - UpdatedData
 *             properties:
 *               interviewID:
 *                 type: integer
 *                 example: 1
 *               UpdatedData:
 *                 type: object
 *                 example:
 *                   candidateName: "Anna Smith"
 *                   role: "Backend Engineer"
 *                   interviewDate: "2025-12-12T11:00:00Z"
 *                   interviewer: "John Doe"
 *                   status: "rescheduled"
 *     responses:
 *       200:
 *         description: Interview updated successfully
 *       404:
 *         description: Interview not found
 */
router.patch("/update-interview", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleUpdateInterview);

/**
 * ===============================
 * Delete Interview
 * ===============================
 */
/**
 * @swagger
 * /api/v1/interview/delete-interview/{interviewID}:
 *   delete:
 *     summary: HR-Admin deletes an interview record
 *     tags: [InterviewInsights]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: interviewID
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Interview deleted successfully
 *       404:
 *         description: Interview not found
 */
router.delete("/delete-interview/:interviewID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleDeleteInterview);

export default router;
