import db from '../models/index.js';

const { Balance } = db
// ==================== Create Balance ====================
export const HandleCreateBalance = async (req, res) => {
  try {
    const { title, description, availableamount, totalexpenses, expensemonth } = req.body;

    if (!title || !description || !availableamount || !totalexpenses || !expensemonth) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if balance record exists for the same month
    const existingBalance = await Balance.findOne({
      where: { expensemonth },
    });

    if (existingBalance) {
      return res.status(409).json({ success: false, message: "Specific Balance Record already exists" });
    }

    const newBalance = await Balance.create({
      title,
      description,
      availableamount,
      totalexpenses,
      expensemonth,
      submitdate: new Date(),
      organizationId: req.ORGID,
      createdBy: req.HRid,
    });

    return res.status(200).json({
      success: true,
      message: "Balance record created successfully",
      balance: newBalance,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// ==================== Get All Balances ====================
export const HandleAllBalances = async (req, res) => {
  try {
    const balances = await Balance.findAll({
      where: { organizationId: req.ORGID },
    });

    return res.status(200).json({
      success: true,
      message: "All balances retrieved successfully",
      balances,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// ==================== Get Single Balance ====================
export const HandleBalance = async (req, res) => {
  try {
    const { balanceID } = req.params;

    const balance = await Balance.findOne({
      where: { id: balanceID, organizationId: req.ORGID },
    });

    if (!balance) {
      return res.status(404).json({ success: false, message: "Balance Record Not Found" });
    }

    return res.status(200).json({
      success: true,
      message: "Balance Found Successfully",
      balance,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// ==================== Update Balance ====================
export const HandleUpdateBalance = async (req, res) => {
  try {
    const { balanceID, UpdatedData } = req.body;

    const [updatedRows, [updatedBalance]] = await Balance.update(UpdatedData, {
      where: { id: balanceID },
      returning: true,
    });

    if (updatedRows === 0) {
      return res.status(404).json({ success: false, message: "Balance Record not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Balance Record updated successfully",
      data: updatedBalance,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// ==================== Delete Balance ====================
export const HandleDeleteBalance = async (req, res) => {
  try {
    const { balanceID } = req.params;

    const balance = await Balance.findOne({ where: { id: balanceID } });

    if (!balance) {
      return res.status(404).json({ success: false, message: "Balance Record not found" });
    }

    await balance.destroy();

    return res.status(200).json({
      success: true,
      message: "Balance Record deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
