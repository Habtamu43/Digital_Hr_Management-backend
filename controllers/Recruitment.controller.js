import db from "../config/db.js";

export const { Recruitment, Applicant } = db;

/* ======================================================
   CREATE RECRUITMENT
====================================================== */
export const HandleCreateRecruitment = async (req, res) => {
  try {
    const { jobtitle, description } = req.body;

    if (!jobtitle || !description) {
      return res.status(400).json({
        success: false,
        message: "jobtitle and description are required",
      });
    }

    const existingRecruitment = await Recruitment.findOne({
      where: {
        jobTitle: jobtitle, // match model column
        organizationId: req.organizationId,
      },
    });

    if (existingRecruitment) {
      return res.status(409).json({
        success: false,
        message: "Recruitment already exists for this job title",
      });
    }

    const newRecruitment = await Recruitment.create({
      jobTitle: jobtitle,
      description,
      organizationId: req.organizationId,
    });

    return res.status(201).json({
      success: true,
      message: "Recruitment created successfully",
      data: newRecruitment,
    });
  } catch (error) {
    console.error("CREATE RECRUITMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/* ======================================================
   GET ALL RECRUITMENTS
====================================================== */
export const HandleAllRecruitments = async (req, res) => {
  try {
    const recruitments = await Recruitment.findAll({
      where: { organizationId: req.organizationId },
      include: [
        {
          model: Applicant,
          as: "applications",
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "All recruitments retrieved successfully",
      data: recruitments,
    });
  } catch (error) {
    console.error("GET ALL RECRUITMENTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/* ======================================================
   GET SINGLE RECRUITMENT
====================================================== */
export const HandleRecruitment = async (req, res) => {
  try {
    const { recruitmentID } = req.params;

    if (!recruitmentID) {
      return res.status(400).json({
        success: false,
        message: "recruitmentID is required",
      });
    }

    const recruitment = await Recruitment.findOne({
      where: {
        id: recruitmentID,
        organizationId: req.organizationId,
      },
      include: [
        {
          model: Applicant,
          as: "applications",
        },
      ],
    });

    if (!recruitment) {
      return res.status(404).json({
        success: false,
        message: "Recruitment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Recruitment retrieved successfully",
      data: recruitment,
    });
  } catch (error) {
    console.error("GET SINGLE RECRUITMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/* ======================================================
   UPDATE RECRUITMENT
====================================================== */
export const HandleUpdateRecruitment = async (req, res) => {
  try {
    const {
      recruitmentID,
      jobtitle,
      description,
      departmentId,
      applicationIDArray,
    } = req.body;

    if (!recruitmentID) {
      return res.status(400).json({
        success: false,
        message: "recruitmentID is required",
      });
    }

    const recruitment = await Recruitment.findByPk(recruitmentID, {
      include: [
        {
          model: Applicant,
          as: "applications",
        },
      ],
    });

    if (!recruitment) {
      return res.status(404).json({
        success: false,
        message: "Recruitment not found",
      });
    }

    /* ===== Add Applicants ===== */
    if (Array.isArray(applicationIDArray)) {
      const existingIDs = recruitment.applications.map((app) => app.id);

      const duplicates = applicationIDArray.filter((id) =>
        existingIDs.includes(id),
      );

      const newIDs = applicationIDArray.filter(
        (id) => !existingIDs.includes(id),
      );

      if (duplicates.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Some applicants already exist in this recruitment",
          rejectedApplications: duplicates,
        });
      }

      if (newIDs.length > 0) {
        await recruitment.addApplications(newIDs); // ✅ correct
      }
    }

    /* ===== Update Fields ===== */
    await recruitment.update({
      jobTitle: jobtitle ?? recruitment.jobTitle,
      description: description ?? recruitment.description,
      departmentId: departmentId ?? recruitment.departmentId,
    });

    return res.status(200).json({
      success: true,
      message: "Recruitment updated successfully",
      data: recruitment,
    });
  } catch (error) {
    console.error("UPDATE RECRUITMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/* ======================================================
   DELETE RECRUITMENT
====================================================== */
export const HandleDeleteRecruitment = async (req, res) => {
  try {
    const { recruitmentID } = req.params;

    if (!recruitmentID) {
      return res.status(400).json({
        success: false,
        message: "recruitmentID is required",
      });
    }

    const recruitment = await Recruitment.findByPk(recruitmentID);

    if (!recruitment) {
      return res.status(404).json({
        success: false,
        message: "Recruitment not found",
      });
    }

    await recruitment.destroy();

    return res.status(200).json({
      success: true,
      message: "Recruitment deleted successfully",
    });
  } catch (error) {
    console.error("DELETE RECRUITMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
