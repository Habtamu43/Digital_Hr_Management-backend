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

import { VerifyHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

// HR signup
router.post("/signup", HandleHRSignup);

// HR verifies email (HR-Admin only)
router.post("/verify-email", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleHRVerifyEmail);

// Resend HR verification email (HR-Admin only)
router.post("/resend-verify-email", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleHRResendVerificationEmail);

// HR login
router.post("/login", HandleHRLogin);

// Check HR login status (HR-Admin only)
router.get("/check-login", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleHRCheck);

// Check HR email verification status (HR-Admin only)
router.get("/check-verify-email", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleHRCheckVerifyEmail);

// HR logout
router.post("/logout", HandleHRLogout);

// HR forgot password (HR-Admin only)
router.post("/forgot-password", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleHRForgotPassword);

// Reset HR password
router.post("/reset-password/:token", HandleHRResetPassword);

export default router;
