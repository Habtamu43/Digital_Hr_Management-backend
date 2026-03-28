import express from "express";
import {
  HandleCreateDepartment,
  HandleAllDepartments,
  HandleDepartment,
  HandleUpdateDepartment,
  HandleDeleteDepartment
} from "../controllers/Department.controller.js";

import { VerifyhHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Department
 *   description: Department management endpoints
 */

/**
 * ===============================
 * Create Department
 * ===============================
 */
/**
 * @swagger
 * /api/v1/department/create-department:
 *   post:
 *     summary: Create a new department
 *     tags: [Department]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Human Resources
 *     responses:
 *       201:
 *         description: Department created successfully
 */
router.post(
  "/create-department",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleCreateDepartment
);

/**
 * ===============================
 * Get All Departments
 * ===============================
 */
/**
 * @swagger
 * /api/v1/department/all:
 *   get:
 *     summary: Retrieve all departments
 *     tags: [Department]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all departments retrieved successfully
 */
router.get(
  "/all",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleAllDepartments
);

/**
 * ===============================
 * Get Department by ID
 * ===============================
 */
/**
 * @swagger
 * /api/v1/department/{departmentID}:
 *   get:
 *     summary: Retrieve a specific department by ID
 *     tags: [Department]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: departmentID
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Department retrieved successfully
 *       404:
 *         description: Department not found
 */
router.get(
  "/:departmentID",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleDepartment
);

/**
 * ===============================
 * Update Department
 * ===============================
 */
/**
 * @swagger
 * /api/v1/department/update-department:
 *   patch:
 *     summary: Update department details
 *     tags: [Department]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - departmentID
 *               - UpdatedData
 *             properties:
 *               departmentID:
 *                 type: integer
 *                 example: 1
 *               UpdatedData:
 *                 type: object
 *                 example:
 *                   name: Updated Human Resources
 *     responses:
 *       200:
 *         description: Department updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Department not found
 */
router.patch(
  "/update-department",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleUpdateDepartment
);

/**
 * ===============================
 * Delete Department
 * ===============================
 */
/**
 * @swagger
 * /api/v1/department/delete-department:
 *   delete:
 *     summary: Delete a department
 *     tags: [Department]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - departmentID
 *             properties:
 *               departmentID:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Department deleted successfully
 *       404:
 *         description: Department not found
 */
router.delete(
  "/delete-department",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleDeleteDepartment
);

export default router;
