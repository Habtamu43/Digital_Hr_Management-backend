import express from "express";
import {
  HandleCreateNotice,
  HandleAllNotice,
  HandleNotice,
  HandleUpdateNotice,
  HandleDeleteNotice
} from "../controllers/Notice.controller.js";

import { VerifyhHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

/**
 * ===============================
 * Create Notice
 * ===============================
 */
router.post(
  "/create-notice",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleCreateNotice
);

/**
 * ===============================
 * Get All Notices
 * ===============================
 */
router.get(
  "/all",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleAllNotice
);

/**
 * ===============================
 * Get Single Notice
 * ===============================
 */
router.get(
  "/:noticeID",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleNotice
);

/**
 * ===============================
 * Update Notice
 * ===============================
 */
router.patch(
  "/update-notice",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleUpdateNotice
);

/**
 * ===============================
 * Delete Notice
 * ===============================
 */
router.delete(
  "/delete-notice/:noticeID",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleDeleteNotice
);

export default router;
