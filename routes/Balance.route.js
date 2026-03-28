import express from "express";
import {
  HandleCreateBalance,
  HandleAllBalances,
  HandleBalance,
  HandleUpdateBalance,
  HandleDeleteBalance
} from "../controllers/Balance.controller.js";

import { VerifyhHRToken } from "../middleware/Auth.middleware.js";
import { RoleAuthorization } from "../middleware/RoleAuth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Balance
 *   description: Balance management endpoints
 */

/**
 * ===============================
 * Add Balance
 * ===============================
 */
/**
 * @swagger
 * /api/v1/balance/add-balance:
 *   post:
 *     summary: Create a new balance record
 *     tags: [Balance]
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
 *               - availableamount
 *               - totalexpenses
 *               - expensemonth
 *             properties:
 *               title:
 *                 type: string
 *                 example: Office Supplies
 *               description:
 *                 type: string
 *                 example: Monthly office supplies expenses
 *               availableamount:
 *                 type: number
 *                 example: 5000
 *               totalexpenses:
 *                 type: number
 *                 example: 1200
 *               expensemonth:
 *                 type: string
 *                 example: "2025-12"
 *     responses:
 *       201:
 *         description: Balance created successfully
 */
router.post(
  "/add-balance",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleCreateBalance
);

/**
 * ===============================
 * Get All Balances
 * ===============================
 */
/**
 * @swagger
 * /api/v1/balance/all:
 *   get:
 *     summary: Retrieve all balance records
 *     tags: [Balance]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All balance records retrieved successfully
 */
router.get(
  "/all",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleAllBalances
);

/**
 * ===============================
 * Get Balance by ID
 * ===============================
 */
/**
 * @swagger
 * /api/v1/balance/{balanceID}:
 *   get:
 *     summary: Retrieve a specific balance record by ID
 *     tags: [Balance]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: balanceID
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Balance record retrieved successfully
 *       404:
 *         description: Balance record not found
 */
router.get(
  "/:balanceID",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleBalance
);

/**
 * ===============================
 * Update Balance
 * ===============================
 */
/**
 * @swagger
 * /api/v1/balance/update-balance:
 *   patch:
 *     summary: Update a balance record
 *     tags: [Balance]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - balanceID
 *               - UpdatedData
 *             properties:
 *               balanceID:
 *                 type: integer
 *                 example: 1
 *               UpdatedData:
 *                 type: object
 *                 example:
 *                   title: Updated Office Supplies
 *                   description: Updated description for office expenses
 *                   availableamount: 6000
 *                   totalexpenses: 1500
 *     responses:
 *       200:
 *         description: Balance record updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Balance record not found
 */
router.patch(
  "/update-balance",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleUpdateBalance
);

/**
 * ===============================
 * Delete Balance
 * ===============================
 */
/**
 * @swagger
 * /api/v1/balance/delete-balance/{balanceID}:
 *   delete:
 *     summary: Delete a balance record
 *     tags: [Balance]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: balanceID
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Balance record deleted successfully
 *       404:
 *         description: Balance record not found
 */
router.delete(
  "/delete-balance/:balanceID",
  VerifyhHRToken,
  RoleAuthorization("HR-Admin"),
  HandleDeleteBalance
);

export default router;
