import db from "../config/db.js";

const { InterviewInsight, Applicant, HumanResources } = db;

/* ================== Create Interview ================== */
export const HandleCreateInterview = async (req, res) => {
  console.log("Request body:", req.body);
console.log("Organization ID:", req.organizationId);

  try {
    const { applicantID, interviewerID, interviewDate, feedback, status } = req.body;

    
    console.log("Received body:", req.body);
    console.log("Organization ID from token:", req.organizationId);

    if (!applicantID || !interviewerID || !status) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required",
      });
    }

    // Find Applicant
    const applicant = await Applicant.findOne({
      where: { id: applicantID, organizationId: req.organizationId },
    });

    if (!applicant)
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });

    // Find HR
    const interviewer = await HumanResources.findOne({
      where: { id: interviewerID, organizationId: req.organizationId },
    });

    if (!interviewer)
      return res.status(404).json({
        success: false,
        message: "Interviewer not found",
      });

    // Prevent duplicate interview
    const existingInterview = await InterviewInsight.findOne({
      where: {
        applicantID,
        interviewerID,
        organizationId: req.organizationId,
      },
    });

    if (existingInterview)
      return res.status(409).json({
        success: false,
        message: "Interview already exists",
      });

    // Create interview
    const newInterview = await InterviewInsight.create({
      applicantID,
      interviewerID,
      interviewDate,
      feedback,
      status,
      organizationId: req.organizationId,
    });

    return res.status(201).json({
      success: true,
      message: "Interview created successfully",
      data: newInterview,
    });
  } catch (error) {
    console.error("Create Interview Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

/* ================== Get All Interviews ================== */
export const HandleAllInterviews = async (req, res) => {
  try {
    const interviews = await InterviewInsight.findAll({
      where: { organizationId: req.organizationId },
      include: [
        {
          model: Applicant,
          as: "applicant",
          attributes: ["firstname", "lastname", "email"],
        },
        {
          model: HumanResources,
          as: "interviewer",
          attributes: ["firstname", "lastname", "email"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "All interviews retrieved successfully",
      data: interviews,
    });
  } catch (error) {
    console.error("Get All Interviews Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

/* ================== Get Single Interview ================== */
export const HandleInterview = async (req, res) => {
  try {
    const { interviewID } = req.params;

    const interview = await InterviewInsight.findOne({
      where: { id: interviewID, organizationId: req.organizationId },
      include: [
        {
          model: Applicant,
          as: "applicant",
          attributes: ["firstname", "lastname", "email"],
        },
        {
          model: HumanResources,
          as: "interviewer",
          attributes: ["firstname", "lastname", "email"],
        },
      ],
    });

    if (!interview)
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });

    return res.status(200).json({
      success: true,
      message: "Interview retrieved successfully",
      data: interview,
    });
  } catch (error) {
    console.error("Get Interview Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

/* ================== Update Interview ================== */
export const HandleUpdateInterview = async (req, res) => {
  try {
    const { interviewID, interviewerID, interviewDate, feedback, status } = req.body;

    const interview = await InterviewInsight.findOne({
      where: { id: interviewID, organizationId: req.organizationId },
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    interview.interviewerID = interviewerID || interview.interviewerID;
    interview.interviewDate = interviewDate || interview.interviewDate;
    interview.feedback = feedback || interview.feedback;
    interview.status = status || interview.status;

    await interview.save();

    return res.status(200).json({
      success: true,
      message: "Interview updated successfully",
      data: interview,
    });
  } catch (error) {
    console.error("Update Interview Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/* ================== Delete Interview ================== */
export const HandleDeleteInterview = async (req, res) => {
  try {
    const { interviewID } = req.params;

    const interview = await InterviewInsight.findOne({
      where: { id: interviewID, organizationId: req.organizationId },
    });

    if (!interview)
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });

    await interview.destroy();

    return res.status(200).json({
      success: true,
      message: "Interview deleted successfully",
    });
  } catch (error) {
    console.error("Delete Interview Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,       // <-- use error.message instead of the full object
      stack: error.stack   
    });
  }
};
