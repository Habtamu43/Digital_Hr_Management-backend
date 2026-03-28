import express from "express";
import {
  HandleAllEvents,
  HandleCreateEvent,
  HandleDeleteEvent,
  HandleEvent,
  HandleUpdateEvent
} from "../controllers/CorporateCalendar.controller.js";

import { VerifyhHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CorporateCalendar
 *   description: Corporate calendar events management
 */

/**
 * ===============================
 * Create Event
 * ===============================
 */
/**
 * @swagger
 * /api/v1/corporate-calendar/create-event:
 *   post:
 *     summary: Create a new corporate event
 *     tags: [CorporateCalendar]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - date
 *             properties:
 *               title:
 *                 type: string
 *                 example: Team Meeting
 *               description:
 *                 type: string
 *                 example: Monthly team alignment meeting
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-20T10:00:00Z"
 *     responses:
 *       201:
 *         description: Event created successfully
 */
router.post(
  "/create-event",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleCreateEvent
);

/**
 * ===============================
 * Get All Events
 * ===============================
 */
/**
 * @swagger
 * /api/v1/corporate-calendar/all:
 *   get:
 *     summary: Retrieve all corporate events
 *     tags: [CorporateCalendar]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all events retrieved successfully
 */
router.get(
  "/all",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleAllEvents
);

/**
 * ===============================
 * Get Event by ID
 * ===============================
 */
/**
 * @swagger
 * /api/v1/corporate-calendar/{eventID}:
 *   get:
 *     summary: Retrieve a specific corporate event by ID
 *     tags: [CorporateCalendar]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventID
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *       404:
 *         description: Event not found
 */
router.get(
  "/:eventID",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleEvent
);

/**
 * ===============================
 * Update Event
 * ===============================
 */
/**
 * @swagger
 * /api/v1/corporate-calendar/update-event:
 *   patch:
 *     summary: Update an existing corporate event
 *     tags: [CorporateCalendar]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventID
 *               - UpdatedData
 *             properties:
 *               eventID:
 *                 type: integer
 *                 example: 1
 *               UpdatedData:
 *                 type: object
 *                 example:
 *                   title: Updated Team Meeting
 *                   description: Updated description for the meeting
 *                   date: "2025-12-21T11:00:00Z"
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Event not found
 */
router.patch(
  "/update-event",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleUpdateEvent
);

/**
 * ===============================
 * Delete Event
 * ===============================
 */
/**
 * @swagger
 * /api/v1/corporate-calendar/delete-event/{eventID}:
 *   delete:
 *     summary: Delete a corporate event by ID
 *     tags: [CorporateCalendar]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventID
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 */
router.delete(
  "/delete-event/:eventID",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleDeleteEvent
);

export default router;
