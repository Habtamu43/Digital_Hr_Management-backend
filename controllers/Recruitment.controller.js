import db from "../config/db.js";
export const { Recruitment, Applicant } = db;

// Create a new recruitment
export const HandleCreateRecruitment = async (req, res) => {
  try {
    const { jobtitle, description } = req.body;

    if (!jobtitle || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existingRecruitment = await Recruitment.findOne({
      where: {
        jobtitle,
        organizationID: req.ORGID
      }
    });

    if (existingRecruitment) {
      return res.status(409).json({
        success: false,
        message: "Recruitment already exists for this job title"
      });
    }

    const newRecruitment = await Recruitment.create({
      jobtitle,
      description,
      organizationID: req.ORGID
    });

    return res.status(201).json({
      success: true,
      message: "Recruitment created successfully",
      data: newRecruitment
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

// Get all recruitments
export const HandleAllRecruitments = async (req, res) => {
  try {
    const recruitments = await Recruitment.findAll({
      where: { organizationID: req.ORGID },
      include: [{ model: Applicant, as: "application" }]
    });

    return res.status(200).json({
      success: true,
      message: "All recruitments retrieved successfully",
      data: recruitments
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

// Get a single recruitment
export const HandleRecruitment = async (req, res) => {
  try {
    const { recruitmentID } = req.params;

    if (!recruitmentID) {
      return res.status(400).json({
        success: false,
        message: "Recruitment ID is required"
      });
    }

    const recruitment = await Recruitment.findOne({
      where: {
        id: recruitmentID,
        organizationID: req.ORGID
      },
      include: [{ model: Applicant, as: "application" }]
    });

    if (!recruitment) {
      return res.status(404).json({
        success: false,
        message: "Recruitment not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Recruitment retrieved successfully",
      data: recruitment
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

// Update recruitment
export const HandleUpdateRecruitment = async (req, res) => {
  try {
    const {
      recruitmentID,
      jobtitle,
      description,
      departmentID,
      applicationIDArray
    } = req.body;

    if (!recruitmentID || !jobtitle || !description || !departmentID) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const recruitment = await Recruitment.findByPk(recruitmentID, {
      include: [{ model: Applicant, as: "application" }]
    });

    if (!recruitment) {
      return res.status(404).json({
        success: false,
        message: "Recruitment not found"
      });
    }

    // Handle adding new applicants
    if (Array.isArray(applicationIDArray)) {
      const existingIDs = recruitment.application.map(app => app.id);

      const duplicates = applicationIDArray.filter(id => existingIDs.includes(id));
      const newIDs = applicationIDArray.filter(id => !existingIDs.includes(id));

      if (duplicates.length > 0) {
        return res.status(409).json({
          success: false,
          message: `Some applicants are already present under ${recruitment.jobtitle}`,
          rejectedApplications: duplicates
        });
      }

      if (newIDs.length > 0) {
        await recruitment.addApplication(newIDs);
      }
    }

    await recruitment.update({
      jobtitle,
      description,
      departmentId: departmentID
    });

    return res.status(200).json({
      success: true,
      message: "Recruitment updated successfully",
      data: recruitment
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

// Delete recruitment
export const HandleDeleteRecruitment = async (req, res) => {
  try {
    const { recruitmentID } = req.params;

    const recruitment = await Recruitment.findByPk(recruitmentID);
    if (!recruitment) {
      return res.status(404).json({
        success: false,
        message: "Recruitment not found"
      });
    }

    await recruitment.destroy();

    return res.status(200).json({
      success: true,
      message: "Recruitment deleted successfully"
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
