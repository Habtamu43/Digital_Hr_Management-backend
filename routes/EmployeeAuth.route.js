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
import {RoleAuthorization}  from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

// Employee signup (HR-Admin only)
router.post("/signup", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleEmployeeSignup);

// Employee verifies email
router.post("/verify-email", VerifyEmployeeToken, HandleEmployeeVerifyEmail);

// Resend verification email
router.post("/resend-verify-email", VerifyEmployeeToken, HandleResetEmployeeVerifyEmail);

// Employee login
router.post("/login", HandleEmployeeLogin);

// Check employee login status
router.get("/check-login", VerifyEmployeeToken, HandleEmployeeCheck);

// Employee logout
router.post("/logout", HandleEmployeeLogout);

// Employee forgot password
router.post("/forgot-password", VerifyEmployeeToken, HandleEmployeeForgotPassword);

// Reset employee password
router.post("/reset-password/:token", HandleEmployeeSetPassword);

// Check employee email verification status
router.get("/check-verify-email", VerifyEmployeeToken, HandleEmployeeCheckVerifyEmail);

export default router;
