import express from "express";
import {
  HandleCreateBalance,
  HandleAllBalances,
  HandleBalance,
  HandleUpdateBalance,
  HandleDeleteBalance
} from "../controllers/Balance.controller.js";

import { VerifyHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

// Create a new balance record
router.post("/add-balance", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleCreateBalance);

// Get all balance records
router.get("/all", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleAllBalances);

// Get a specific balance record by ID
router.get("/:balanceID", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleBalance);

// Update a balance record
router.patch("/update-balance", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleUpdateBalance);

// Delete a balance record
router.delete("/delete-balance/:balanceID", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleDeleteBalance);

export default router;
