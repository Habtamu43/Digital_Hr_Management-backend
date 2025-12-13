import express from "express";
import {
  HandleCreateApplicant,
  HandleAllApplicants,
  HandleApplicant,
  HandleUpdateApplicant,
  HandleDeleteApplicant
} from "../controllers/Applicant.controller.js";

import { VerifyHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

// Create applicant
router.post(
  "/create-applicant",
  VerifyHRToken,
  RoleAuthorization("HR-Admin"),
  HandleCreateApplicant
);

// Get all applicants
router.get(
  "/all",
  VerifyHRToken,
  RoleAuthorization("HR-Admin"),
  HandleAllApplicants
);

// Get single applicant
router.get(
  "/:applicantID",
  VerifyHRToken,
  RoleAuthorization("HR-Admin"),
  HandleApplicant
);

// Update applicant
router.patch(
  "/update-applicant",
  VerifyHRToken,
  RoleAuthorization("HR-Admin"),
  HandleUpdateApplicant
);

// Delete applicant
router.delete(
  "/delete-applicant/:applicantID",
  VerifyHRToken,
  RoleAuthorization("HR-Admin"),
  HandleDeleteApplicant
);

export default router;
