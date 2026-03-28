import db from "../config/db.js";

const { Applicant } = db;

// ==================== Create Applicant ====================
export const HandleCreateApplicant = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      contactnumber,
      appliedrole,
      recruitmentID,
    } = req.body;

    // Validate input
    if (
      !firstname ||
      !lastname ||
      !email ||
      !contactnumber ||
      !appliedrole ||
      !recruitmentID
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields including recruitmentID are required",
      });
    }

    // Check if applicant already exists for the same recruitment
    const existingApplicant = await Applicant.findOne({
      where: { email, recruitmentID },
    });

    if (existingApplicant) {
      return res.status(409).json({
        success: false,
        message: "Applicant already exists for this recruitment",
      });
    }

    // Create applicant
    const newApplicant = await Applicant.create({
      firstname,
      lastname,
      email,
      contactnumber,
      appliedrole,
      recruitmentID,
    });

    return res.status(201).json({
      success: true,
      message: "Applicant created successfully",
      data: newApplicant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ==================== Get All Applicants (by Recruitment) ====================
export const HandleAllApplicants = async (req, res) => {
  try {
    const { recruitmentID } = req.query;

    if (!recruitmentID) {
      return res.status(400).json({
        success: false,
        message: "recruitmentID query parameter is required",
      });
    }

    const applicants = await Applicant.findAll({
      where: { recruitmentID },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Applicants fetched successfully",
      data: applicants,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ==================== Get Single Applicant ====================
export const HandleApplicant = async (req, res) => {
  try {
    const { applicantID } = req.params;

    const applicant = await Applicant.findOne({
      where: { id: applicantID },
    });

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Applicant fetched successfully",
      data: applicant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ==================== Update Applicant ====================
export const HandleUpdateApplicant = async (req, res) => {
  try {
    const { applicantID, UpdatedData } = req.body;

    // Validate
    if (!applicantID || !UpdatedData || Object.keys(UpdatedData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "applicantID and at least one field to update are required",
      });
    }
    // Perform update
    const [updatedRows, [updatedApplicant]] = await Applicant.update(UpdatedData, {
      where: { id: applicantID },
      returning: true,
    });

    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Applicant updated successfully",
      data: updatedApplicant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
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
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Applicant deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
