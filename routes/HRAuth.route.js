import express from "express";
import {
  HandleHRSignup,
  HandleHRVerifyEmail,
  HandleHRResendVerificationEmail,
  HandleHRLogin,
  HandleHRCheck,
  HandleHRLogout,
  HandleHRForgotPassword,
  HandleHRResetPassword,
  HandleHRCheckVerifyEmail,
} from "../controllers/HRAuth.controller.js";

import { VerifyhHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: HR Authentication
 *   description: HR authentication and authorization APIs
 */

/* =========================
   PUBLIC ROUTES (NO LOGIN)
========================= */

/**
 * @swagger
 * /api/auth/hr/signup:
 *   post:
 *     summary: Register a new HR Admin
 *     tags: [HR Authentication]
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
 *               - password
 *               - role
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: Habtamu
 *               lastname:
 *                 type: string
 *                 example: Kassa
 *               fullname:
 *                 type: string
 *                 example: Habtamu Kassa
 *               email:
 *                 type: string
 *                 example: habtamukassa4339@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               contactnumber:
 *                 type: string
 *                 example: 0943398424
 *               role:
 *                 type: string
 *                 example: HR-Admin
 *               name:
 *                 type: string
 *                 example: Vision Tech PLC
 *               description:
 *                 type: string
 *                 example: Human Resource and employee management system
 *               organizationURL:
 *                 type: string
 *                 example: https://vision.com
 *               organizationMail:
 *                 type: string
 *                 example: info@vision.com
 *     responses:
 *       201:
 *         description: HR registered successfully
 *       400:
 *         description: Bad request
 */
router.post("/signup", HandleHRSignup);

/**
 * @swagger
 * /api/auth/hr/login:
 *   post:
 *     summary: HR login
 *     tags: [HR Authentication]
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
 *                 example: habtamukassa4339@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", HandleHRLogin);

/**
 * @swagger
 * /api/auth/hr/forgot-password:
 *   post:
 *     summary: HR forgot password
 *     tags: [HR Authentication]
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
 *                 example: habtamukassa4339@gmail.com
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       400:
 *         description: Email is required
 */
router.post("/forgot-password", HandleHRForgotPassword);

/**
 * @swagger
 * /api/auth/hr/reset-password/{token}:
 *   post:
 *     summary: Reset HR password
 *     tags: [HR Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
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
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
router.post("/reset-password/:token", HandleHRResetPassword);

/**
 * =========================
 * PUBLIC RESEND VERIFICATION EMAIL (NO LOGIN REQUIRED)
 * =========================
 */

/**
 * @swagger
 * /api/auth/hr/resend-verification-public:
 *   post:
 *     summary: Resend HR verification email (public, no login required)
 *     tags: [HR Authentication]
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
 *                 example: habtamukassa4339@gmail.com
 *     responses:
 *       200:
 *         description: Verification email resent successfully
 *       400:
 *         description: Email is required or already verified
 */
router.post("/resend-verification-public", HandleHRResendVerificationEmail);

/* =========================
   PROTECTED ROUTES (LOGIN REQUIRED)
========================= */

router.post(
  "/verify-email",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleHRVerifyEmail,
);

router.post(
  "/resend-verify-email",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleHRResendVerificationEmail,
);

router.get(
  "/check-login",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleHRCheck,
);

router.get(
  "/check-verify-email",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleHRCheckVerifyEmail,
);

router.post(
  "/logout",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleHRLogout,
);

export default router;
