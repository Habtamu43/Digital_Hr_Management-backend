import db from "../config/db.js";

const { Balance } = db
// ==================== Create Balance ====================
export const HandleCreateBalance = async (req, res) => {
  try {
    const { title, description, availableAmount, totalExpenses, expenseMonth } = req.body;

    if (!title || !description || !availableAmount || !totalExpenses || !expenseMonth) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if balance record exists for the same month
    const existingBalance = await Balance.findOne({
      where: { expenseMonth },
    });

    if (existingBalance) {
      return res.status(409).json({ success: false, message: "Specific Balance Record already exists" });
    }

    const newBalance = await Balance.create({
      title,
      description,
      availableAmount,
      totalExpenses,
      expenseMonth,
      submitDate: new Date(),
      organizationId: req.organizationId,
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
      where: { organizationId: req.organizationId },
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
      where: { id: balanceID, organizationId: req.organizationId },
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
    const { balanceID, UpdatedData } = req.body || {};

    if (!balanceID || !UpdatedData || Object.keys(UpdatedData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "balanceID and UpdatedData are required"
      });
    }

    const [updatedRows, updatedBalances] = await Balance.update(UpdatedData, {
      where: { id: balanceID },
      returning: true
    });

    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Balance Record not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Balance Record updated successfully",
      data: updatedBalances[0]
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
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
