import express from "express";
import {
  HandleAllEmployees,
  HandleEmployeeUpdate,
  HandleEmployeeDelete,
  HandleEmployeeByHR,
  HandleEmployeeByEmployee,
  HandleAllEmployeesIDS
} from "../controllers/Employee.controller.js";

import { VerifyhHRToken, VerifyEmployeeToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Employee
 *   description: Employee management endpoints
 */

/**
 * ===============================
 * Get All Employees (HR-Admin)
 * ===============================
 */
/**
 * @swagger
 * /api/v1/employee/all:
 *   get:
 *     summary: Retrieve all employees (HR-Admin only)
 *     tags: [Employee]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all employees retrieved successfully
 */
router.get(
  "/all",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleAllEmployees
);

/**
 * ===============================
 * Get All Employee IDs (HR-Admin)
 * ===============================
 */
/**
 * @swagger
 * /api/v1/employee/all-employees-ids:
 *   get:
 *     summary: Retrieve all employee IDs (HR-Admin only)
 *     tags: [Employee]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of employee IDs retrieved successfully
 */
router.get(
  "/all-employees-ids",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleAllEmployeesIDS
);

/**
 * ===============================
 * Get Employee Details by HR (HR-Admin)
 * ===============================
 */
/**
 * @swagger
 * /api/v1/employee/by-HR/{employeeId}:
 *   get:
 *     summary: Retrieve details of a specific employee (HR-Admin only)
 *     tags: [Employee]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Employee details retrieved successfully
 *       404:
 *         description: Employee not found
 */
router.get(
  "/by-HR/:employeeId",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleEmployeeByHR
);

/**
 * ===============================
 * Get Own Employee Details
 * ===============================
 */
/**
 * @swagger
 * /api/v1/employee/by-employee:
 *   get:
 *     summary: Retrieve own employee details
 *     tags: [Employee]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Employee details retrieved successfully
 */
router.get(
  "/by-employee",
  VerifyEmployeeToken,
  HandleEmployeeByEmployee
);

/**
 * ===============================
 * Update Employee
 * ===============================
 */
/**
 * @swagger
 * /api/v1/employee/update-employee:
 *   patch:
 *     summary: Employee updates own information
 *     tags: [Employee]
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
 *               - UpdatedData
 *             properties:
 *               employeeID:
 *                 type: integer
 *                 example: 1
 *               UpdatedData:
 *                 type: object
 *                 example:
 *                   firstname: John
 *                   lastname: Doe
 *                   contactnumber: "0912345678"
 *                   email: john.doe@example.com
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Employee not found
 */
router.patch(
  "/update-employee",
  VerifyEmployeeToken,
  HandleEmployeeUpdate
);

/**
 * ===============================
 * Delete Employee
 * ===============================
 */
/**
 * @swagger
 * /api/v1/employee/delete-employee/{employeeId}:
 *   delete:
 *     summary: Delete an employee (HR-Admin only)
 *     tags: [Employee]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee not found
 */
router.delete(
  "/delete-employee/:employeeId",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleEmployeeDelete
);

export default router;
