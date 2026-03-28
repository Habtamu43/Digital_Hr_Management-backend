import express from "express";
import {
  HandleEmployeeSignup,
  HandleEmployeeVerifyEmail,
  HandleEmployeeLogout,
  HandleEmployeeLogin,
  HandleEmployeeForgotPassword,
  HandleEmployeeSetPassword,
  HandleResetEmployeeVerifyEmail,
  HandleEmployeeCheck,
  HandleEmployeeCheckVerifyEmail
} from "../controllers/EmployeeAuth.controller.js";

import { VerifyEmployeeToken, VerifyhHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: EmployeeAuth
 *   description: Employee authentication and account management
 */

/**
 * ===============================
 * Employee Signup (HR-Admin only)
 * ===============================
 */
/**
 * @swagger
 * /api/v1/employee-auth/signup:
 *   post:
 *     summary: HR-Admin creates a new employee account
 *     tags: [EmployeeAuth]
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
 *               - role
 *               - organizationId
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: John
 *               lastname:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               contactnumber:
 *                 type: string
 *                 example: "0912345678"
 *               role:
 *                 type: string
 *                 example: Software Engineer
 *               organizationId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Employee account created successfully
 */
router.post(
  "/signup",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleEmployeeSignup
);

/**
 * ===============================
 * Employee Verify Email
 * ===============================
 */
/**
 * @swagger
 * /api/v1/employee-auth/verify-email:
 *   post:
 *     summary: Employee verifies their email address
 *     tags: [EmployeeAuth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: "verification-token-123"
 *     responses:
 *       200:
 *         description: Email verified successfully
 */
router.post("/verify-email", VerifyEmployeeToken, HandleEmployeeVerifyEmail);

/**
 * ===============================
 * Resend Verification Email
 * ===============================
 */
/**
 * @swagger
 * /api/v1/employee-auth/resend-verify-email:
 *   post:
 *     summary: Resend verification email
 *     tags: [EmployeeAuth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Verification email sent successfully
 */
router.post("/resend-verify-email", VerifyEmployeeToken, HandleResetEmployeeVerifyEmail);

/**
 * ===============================
 * Employee Login
 * ===============================
 */
/**
 * @swagger
 * /api/v1/employee-auth/login:
 *   post:
 *     summary: Employee login
 *     tags: [EmployeeAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", HandleEmployeeLogin);

/**
 * ===============================
 * Check Employee Login Status
 * ===============================
 */
/**
 * @swagger
 * /api/v1/employee-auth/check-login:
 *   get:
 *     summary: Check employee login status
 *     tags: [EmployeeAuth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Employee is logged in
 */
router.get("/check-login", VerifyEmployeeToken, HandleEmployeeCheck);

/**
 * ===============================
 * Employee Logout
 * ===============================
 */
/**
 * @swagger
 * /api/v1/employee-auth/logout:
 *   post:
 *     summary: Employee logout
 *     tags: [EmployeeAuth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post("/logout", HandleEmployeeLogout);

/**
 * ===============================
 * Employee Forgot Password
 * ===============================
 */
/**
 * @swagger
 * /api/v1/employee-auth/forgot-password:
 *   post:
 *     summary: Employee forgot password
 *     tags: [EmployeeAuth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent
 */
router.post("/forgot-password", VerifyEmployeeToken, HandleEmployeeForgotPassword);

/**
 * ===============================
 * Reset Employee Password
 * ===============================
 */
/**
 * @swagger
 * /api/v1/employee-auth/reset-password/{token}:
 *   post:
 *     summary: Reset employee password using token
 *     tags: [EmployeeAuth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         example: "reset-token-123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.post("/reset-password/:token", HandleEmployeeSetPassword);

/**
 * ===============================
 * Check Employee Email Verification Status
 * ===============================
 */
/**
 * @swagger
 * /api/v1/employee-auth/check-verify-email:
 *   get:
 *     summary: Check if employee email is verified
 *     tags: [EmployeeAuth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Employee email verification status
 */
router.get("/check-verify-email", VerifyEmployeeToken, HandleEmployeeCheckVerifyEmail);

export default router;
