import express from "express";
import {
  HandleAllGenerateRequest,
  HandleCreateGenerateRequest,
  HandleDeleteRequest,
  HandleGenerateRequest,
  HandleUpdateRequestByEmployee,
  HandleUpdateRequestByHR
} from "../controllers/GenerateRequest.controller.js";

import { VerifyEmployeeToken, VerifyHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: GenerateRequest
 *   description: Employee generate request endpoints
 */

/**
 * ===============================
 * Employee Create Request
 * ===============================
 */
/**
 * @swagger
 * /api/v1/generate-request/create-request:
 *   post:
 *     summary: Employee creates a new request
 *     tags: [GenerateRequest]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - employeeID
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Request for New Laptop"
 *               description:
 *                 type: string
 *                 example: "I need a new laptop for project work."
 *               employeeID:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Request created successfully
 */
router.post("/create-request", VerifyEmployeeToken, HandleCreateGenerateRequest);

/**
 * ===============================
 * Get All Requests (HR-Admin)
 * ===============================
 */
/**
 * @swagger
 * /api/v1/generate-request/all:
 *   get:
 *     summary: HR-Admin retrieves all generate requests
 *     tags: [GenerateRequest]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all generate requests
 */
router.get("/all", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleAllGenerateRequest);

/**
 * ===============================
 * Get Request by ID (HR-Admin)
 * ===============================
 */
/**
 * @swagger
 * /api/v1/generate-request/{requestID}:
 *   get:
 *     summary: HR-Admin retrieves a specific request by ID
 *     tags: [GenerateRequest]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestID
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Request retrieved successfully
 *       404:
 *         description: Request not found
 */
router.get("/:requestID", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleGenerateRequest);

/**
 * ===============================
 * Employee Update Request Content
 * ===============================
 */
/**
 * @swagger
 * /api/v1/generate-request/update-request-content:
 *   patch:
 *     summary: Employee updates the content of their request
 *     tags: [GenerateRequest]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - requestID
 *               - UpdatedData
 *             properties:
 *               requestID:
 *                 type: integer
 *                 example: 1
 *               UpdatedData:
 *                 type: object
 *                 example:
 *                   title: "Updated Laptop Request"
 *                   description: "Need an updated laptop for new project."
 *     responses:
 *       200:
 *         description: Request updated successfully
 *       404:
 *         description: Request not found
 */
router.patch("/update-request-content", VerifyEmployeeToken, HandleUpdateRequestByEmployee);

/**
 * ===============================
 * HR Admin Update Request Status
 * ===============================
 */
/**
 * @swagger
 * /api/v1/generate-request/update-request-status:
 *   patch:
 *     summary: HR-Admin updates the status of a request
 *     tags: [GenerateRequest]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - requestID
 *               - UpdatedData
 *             properties:
 *               requestID:
 *                 type: integer
 *                 example: 1
 *               UpdatedData:
 *                 type: object
 *                 example:
 *                   status: "approved"
 *     responses:
 *       200:
 *         description: Request status updated successfully
 *       404:
 *         description: Request not found
 */
router.patch("/update-request-status", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleUpdateRequestByHR);

/**
 * ===============================
 * Delete Request (HR-Admin)
 * ===============================
 */
/**
 * @swagger
 * /api/v1/generate-request/delete-request/{requestID}:
 *   delete:
 *     summary: HR-Admin deletes a generate request
 *     tags: [GenerateRequest]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestID
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Request deleted successfully
 *       404:
 *         description: Request not found
 */
router.delete("/delete-request/:requestID", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleDeleteRequest);

export default router;
