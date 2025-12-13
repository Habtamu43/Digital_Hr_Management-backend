import express from "express";
import {
  HandleAllEvents,
  HandleCreateEvent,
  HandleDeleteEvent,
  HandleEvent,
  HandleUpdateEvent
} from "../controllers/CorporateCalendar.controller.js";

import { VerifyHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

// Create a new corporate event
router.post("/create-event", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleCreateEvent);

// Get all corporate events
router.get("/all", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleAllEvents);

// Get a specific corporate event by ID
router.get("/:eventID", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleEvent);

// Update an existing corporate event
router.patch("/update-event", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleUpdateEvent);

// Delete a corporate event by ID
router.delete("/delete-event/:eventID", VerifyHRToken, RoleAuthorization("HR-Admin"), HandleDeleteEvent);

export default router;
