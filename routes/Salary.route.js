import express from "express";
import {
  HandleCreateSalary,
  HandleAllSalary,
  HandleSalary,
  HandleUpdateSalary,
  HandleDeleteSalary
} from "../controllers/Salary.controller.js";

import { VerifyhHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Salary
 *   description: HR-Admin Salary management endpoints
 */

/**
 * @swagger
 * /api/v1/salary/create-salary:
 *   post:
 *     summary: HR-Admin creates a new salary record
 *     tags: [Salary]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - basicSalary
 *               - allowances
 *               - deductions
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 example: 1
 *               basicSalary:
 *                 type: number
 *                 example: 5000
 *               allowances:
 *                 type: number
 *                 example: 1000
 *               deductions:
 *                 type: number
 *                 example: 500
 *     responses:
 *       201:
 *         description: Salary record created successfully
 */
router.post("/create-salary", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleCreateSalary);

/**
 * @swagger
 * /api/v1/salary/all:
 *   get:
 *     summary: HR-Admin retrieves all salary records
 *     tags: [Salary]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all salary records
 */
router.get("/all", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleAllSalary);

/**
 * @swagger
 * /api/v1/salary/{salaryID}:
 *   get:
 *     summary: HR-Admin retrieves a specific salary record by ID
 *     tags: [Salary]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salaryID
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Salary record retrieved successfully
 *       404:
 *         description: Salary record not found
 */
router.get("/:salaryID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleSalary);

/**
 * @swagger
 * /api/v1/salary/update-salary:
 *   patch:
 *     summary: HR-Admin updates an existing salary record
 *     tags: [Salary]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - salaryID
 *               - UpdatedData
 *             properties:
 *               salaryID:
 *                 type: integer
 *                 example: 1
 *               UpdatedData:
 *                 type: object
 *                 example:
 *                   basicSalary: 5500
 *                   allowances: 1200
 *                   deductions: 600
 *     responses:
 *       200:
 *         description: Salary record updated successfully
 *       404:
 *         description: Salary record not found
 */
router.patch("/update-salary", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleUpdateSalary);

/**
 * @swagger
 * /api/v1/salary/delete-salary/{salaryID}:
 *   delete:
 *     summary: HR-Admin deletes a salary record
 *     tags: [Salary]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salaryID
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Salary record deleted successfully
 *       404:
 *         description: Salary record not found
 */
router.delete("/delete-salary/:salaryID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleDeleteSalary);

export default router;
