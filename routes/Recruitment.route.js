import express from "express";
import {
  HandleCreateRecruitment,
  HandleAllRecruitments,
  HandleRecruitment,
  HandleUpdateRecruitment,
  HandleDeleteRecruitment
} from "../controllers/Recruitment.controller.js";

import { VerifyhHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Recruitment
 *   description: HR-Admin Recruitment management endpoints
 */

/**
 * @swagger
 * /api/v1/recruitment/create-recruitment:
 *   post:
 *     summary: HR-Admin creates a new recruitment record
 *     tags: [Recruitment]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - position
 *               - department
 *               - numberOfVacancies
 *               - recruitmentStatus
 *             properties:
 *               position:
 *                 type: string
 *                 example: "Software Engineer"
 *               department:
 *                 type: string
 *                 example: "IT"
 *               numberOfVacancies:
 *                 type: integer
 *                 example: 3
 *               recruitmentStatus:
 *                 type: string
 *                 example: "open"
 *     responses:
 *       201:
 *         description: Recruitment record created successfully
 */
router.post("/create-recruitment", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleCreateRecruitment);

/**
 * @swagger
 * /api/v1/recruitment/all:
 *   get:
 *     summary: HR-Admin retrieves all recruitment records
 *     tags: [Recruitment]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all recruitment records
 */
router.get("/all", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleAllRecruitments);

/**
 * @swagger
 * /api/v1/recruitment/{recruitmentID}:
 *   get:
 *     summary: HR-Admin retrieves a specific recruitment record by ID
 *     tags: [Recruitment]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recruitmentID
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Recruitment record retrieved successfully
 *       404:
 *         description: Recruitment record not found
 */
router.get("/:recruitmentID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleRecruitment);

/**
 * @swagger
 * /api/v1/recruitment/update-recruitment:
 *   patch:
 *     summary: HR-Admin updates an existing recruitment record
 *     tags: [Recruitment]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recruitmentID
 *               - UpdatedData
 *             properties:
 *               recruitmentID:
 *                 type: integer
 *                 example: 1
 *               UpdatedData:
 *                 type: object
 *                 example:
 *                   position: "Senior Software Engineer"
 *                   department: "IT"
 *                   numberOfVacancies: 2
 *                   recruitmentStatus: "closed"
 *     responses:
 *       200:
 *         description: Recruitment record updated successfully
 *       404:
 *         description: Recruitment record not found
 */
router.patch("/update-recruitment", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleUpdateRecruitment);

/**
 * @swagger
 * /api/v1/recruitment/delete-recruitment/{recruitmentID}:
 *   delete:
 *     summary: HR-Admin deletes a recruitment record
 *     tags: [Recruitment]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recruitmentID
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Recruitment record deleted successfully
 *       404:
 *         description: Recruitment record not found
 */
router.delete("/delete-recruitment/:recruitmentID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleDeleteRecruitment);

export default router;
