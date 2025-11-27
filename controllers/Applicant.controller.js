import db from '../models/index.js';

const { Applicant } = db

// ==================== Create Applicant ====================
export const HandleCreateApplicant = async (req, res) => {
  try {
    const { firstname, lastname, email, contactnumber, appliedrole } = req.body;

    if (!firstname || !lastname || !email || !contactnumber || !appliedrole) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if applicant already exists
    const applicant = await Applicant.findOne({
      where: { email, organizationId: req.ORGID },
    });

    if (applicant) {
      return res.status(409).json({ success: false, message: "Applicant already exists" });
    }

    const newApplicant = await Applicant.create({
      firstname,
      lastname,
      email,
      contactnumber,
      appliedrole,
      organizationId: req.ORGID,
    });

    return res.status(201).json({
      success: true,
      message: "Applicant created successfully",
      data: newApplicant,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== Get All Applicants ====================
export const HandleAllApplicants = async (req, res) => {
  try {
    const applicants = await Applicant.findAll({
      where: { organizationId: req.ORGID },
    });

    return res.status(200).json({
      success: true,
      message: "All Applicants Found Successfully",
      data: applicants,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// ==================== Get Single Applicant ====================
export const HandleApplicant = async (req, res) => {
  try {
    const { applicantID } = req.params;

    const applicant = await Applicant.findOne({
      where: { id: applicantID, organizationId: req.ORGID },
    });

    if (!applicant) {
      return res.status(404).json({ success: false, message: "Applicant not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Applicant Found Successfully",
      data: applicant,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// ==================== Update Applicant ====================
export const HandleUpdateApplicant = async (req, res) => {
  try {
    const { applicantID, UpdatedData } = req.body;

    const [updatedRows, [updatedApplicant]] = await Applicant.update(UpdatedData, {
      where: { id: applicantID },
      returning: true,
    });

    if (updatedRows === 0) {
      return res.status(404).json({ success: false, message: "Applicant not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Applicant updated successfully",
      data: updatedApplicant,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// ==================== Delete Applicant ====================
export const HandleDeleteApplicant = async (req, res) => {
  try {
    const { applicantID } = req.params;

    const deletedApplicant = await Applicant.destroy({
      where: { id: applicantID },
    });

    if (!deletedApplicant) {
      return res.status(404).json({ success: false, message: "Applicant not found" });
    }

    return res.status(200).json({ success: true, message: "Applicant deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
