import express from "express";
import {
  HandleCreateApplicant,
  HandleAllApplicants,
  HandleApplicant,
  HandleUpdateApplicant,
  HandleDeleteApplicant,
} from "../controllers/Applicant.controller.js";

import { VerifyHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Applicants
 *   description: Applicant management APIs
 */

/**
 * ===============================
 * Create Applicant
 * ===============================
 */

/**
 * @swagger
 * /api/v1/applicant/create-applicant:
 *   post:
 *     summary: Create a new applicant
 *     tags: [Applicants]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - contactnumber
 *               - appliedrole
 *               - organizationId
 *               - recruitmentID
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               contactnumber:
 *                 type: string
 *               appliedrole:
 *                 type: string
 *               organizationId:
 *                 type: integer
 *               recruitmentID:
 *                 type: integer
 *             example:
 *               firstname: Habtamu
 *               lastname: Kassa
 *               email: habtaukassa@gmail.com
 *               contactnumber: "0943398424"
 *               appliedrole: Software developer
 *               organizationId: 1
 *               recruitmentID: 1
 *     responses:
 *       201:
 *         description: Applicant created successfully
 *       400:
 *         description: Bad request, missing or invalid fields
 *       401:
 *         description: Unauthorized, invalid or missing token
 */
router.post(
  "/create-applicant",
  VerifyHRToken,
  RoleAuthorization("HR-Admin"),
  HandleCreateApplicant
);

/**
 * ===============================
 * Get All Applicants
 * ===============================
 */
/**
 * @swagger
 * /api/v1/applicant/all:
 *   get:
 *     summary: Get all applicants
 *     tags: [Applicants]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: recruitmentID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the recruitment to filter applicants
 *         example: 1
 *     responses:
 *       200:
 *         description: Applicants retrieved successfully
 *       400:
 *         description: recruitmentID query parameter is required
 *       401:
 *         description: Unauthorized, invalid or missing token
 */

router.get(
  "/all",
  VerifyHRToken,
  RoleAuthorization("HR-Admin"),
  HandleAllApplicants
);

/**
 * ===============================
 * Get Single Applicant
 * ===============================
 */
/**
 * @swagger
 * /api/v1/applicant/{applicantID}:
 *   get:
 *     summary: Get a single applicant by ID
 *     tags: [Applicants]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicantID
 *         required: true
 *         schema:
 *           type: integer
 *         example: 6
 *     responses:
 *       200:
 *         description: Applicant found
 *       404:
 *         description: Applicant not found
 *       401:
 *         description: Unauthorized, invalid or missing token
 */
router.get(
  "/:applicantID",
  VerifyHRToken,
  RoleAuthorization("HR-Admin"),
  HandleApplicant
);

/**
 * ===============================
 * Update Applicant
 * ===============================
 */
/**
 * @swagger
 * /api/v1/applicant/update-applicant:
 *   patch:
 *     summary: Update an applicant
 *     tags: [Applicants]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - applicantID
 *               - UpdatedData
 *             properties:
 *               applicantID:
 *                 type: integer
 *               UpdatedData:
 *                 type: object
 *             example:
 *               applicantID: 6
 *               updatedData:
 *                 firstname: Abyot
 *                 contactnumber: "0911000000"
 *     responses:
 *       200:
 *         description: Applicant updated successfully
 *       400:
 *         description: Bad request, missing or invalid fields
 *       401:
 *         description: Unauthorized, invalid or missing token
 */
router.patch(
  "/update-applicant",
  VerifyHRToken,
  RoleAuthorization("HR-Admin"),
  HandleUpdateApplicant
);

/**
 * ===============================
 * Delete Applicant
 * ===============================
 */
/**
 * @swagger
 * /api/v1/applicant/delete-applicant/{applicantID}:
 *   delete:
 *     summary: Delete an applicant
 *     tags: [Applicants]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicantID
 *         required: true
 *         schema:
 *           type: integer
 *         example: 6
 *     responses:
 *       200:
 *         description: Applicant deleted successfully
 *       404:
 *         description: Applicant not found
 *       401:
 *         description: Unauthorized, invalid or missing token
 */
router.delete(
  "/delete-applicant/:applicantID",
  VerifyHRToken,
  RoleAuthorization("HR-Admin"),
  HandleDeleteApplicant
);

export default router;
