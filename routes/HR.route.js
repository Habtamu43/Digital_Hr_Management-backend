import express from "express";
import {
  HandleAllHR,
  HandleDeleteHR,
  HandleHR,
  HandleUpdateHR
} from "../controllers/HR.controller.js";

import { VerifyhHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: HumanResources
 *   description: Human Resources management endpoints
 */

/**
 * @swagger
 * /api/hr/all:
 *   get:
 *     summary: Get all HR records
 *     tags: [HumanResources]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All HR records retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (HR-Admin only)
 */
router.get(
  "/all",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleAllHR
);

/**
 * @swagger
 * /api/hr/{HRID}:
 *   get:
 *     summary: Get a single HR record by ID
 *     tags: [HumanResources]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: HRID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: HR record found
 *       404:
 *         description: HR record not found
 */
router.get(
  "/:HRID",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleHR
);

/**
 * @swagger
 * /api/hr/update-HR:
 *   patch:
 *     summary: Update an HR record
 *     tags: [HumanResources]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - HRID
 *               - Updatedata
 *             properties:
 *               HRID:
 *                 type: string
 *               Updatedata:
 *                 type: object
 *     responses:
 *       200:
 *         description: HR record updated successfully
 *       400:
 *         description: Missing data
 *       404:
 *         description: HR record not found
 */
router.patch(
  "/update-HR",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleUpdateHR
);

/**
 * @swagger
 * /api/hr/delete-HR/{HRID}:
 *   delete:
 *     summary: Delete an HR record
 *     tags: [HumanResources]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: HRID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: HR record deleted successfully
 *       404:
 *         description: HR record not found
 */
router.delete(
  "/delete-HR/:HRID",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleDeleteHR
);

export default router;

