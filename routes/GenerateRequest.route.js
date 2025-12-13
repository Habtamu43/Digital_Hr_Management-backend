import express from "express";
import {
  HandleAllGenerateRequest,
  HandleCreateGenerateRequest,
  HandleDeleteRequest,
  HandleGenerateRequest,
  HandleUpdateRequestByEmployee,
  HandleUpdateRequestByHR
} from "../controllers/GenerateRequest.controller.js";

import { VerifyEmployeeToken, VerifyHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

// Employee creates a request
router.post("/create-request", VerifyEmployeeToken, HandleCreateGenerateRequest);

// HR admin views all requests
router.get("/all", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleAllGenerateRequest);

// HR admin views a specific request by ID
router.get("/:requestID", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleGenerateRequest);

// Employee updates the request content
router.patch("/update-request-content", VerifyEmployeeToken, HandleUpdateRequestByEmployee);

// HR admin updates the request status
router.patch("/update-request-status", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleUpdateRequestByHR);

// HR admin deletes a request
router.delete("/delete-request/:requestID", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleDeleteRequest);

export default router;
