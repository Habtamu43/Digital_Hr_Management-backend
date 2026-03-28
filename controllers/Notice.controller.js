
import db from "../config/db.js";

const { Department, Employee, HumanResources, Notice } = db;

/**
 * ======================================================
 * Create Notice
 * ======================================================
 */
const HandleCreateNotice = async (req, res) => {
  try {
    const { title, content, audience, departmentID, employeeID, HRID } = req.body;

    if (!title || !content || !audience || !HRID) {
      return res.status(400).json({
        success: false,
        message: "Title, content, audience and HRID are required"
      });
    }

    if (audience === "Department-Specific" && !departmentID) {
      return res.status(400).json({
        success: false,
        message: "departmentID is required for Department-Specific notice"
      });
    }

    if (audience === "Employee-Specific" && !employeeID) {
      return res.status(400).json({
        success: false,
        message: "employeeID is required for Employee-Specific notice"
      });
    }

    const noticeData = {
      title,
      content,
      audience,
      departmentId: departmentID || null,
      employeeId: employeeID || null,
      createdByID: HRID,
      organizationId: req.organizationId
    };

    const existingNotice = await Notice.findOne({ where: noticeData });

    if (existingNotice) {
      return res.status(400).json({
        success: false,
        message: "Notice already exists"
      });
    }

    const notice = await Notice.create(noticeData);

    return res.status(201).json({
      success: true,
      message: "Notice created successfully",
      data: notice
    });
  } catch (error) {
    console.error("HandleCreateNotice Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

/**
 * ======================================================
 * Get All Notices
 * ======================================================
 */
const HandleAllNotice = async (req, res) => {
  try {
    const notices = await Notice.findAll({
      where: { organizationId: req.organizationId },
      include: [
        { model: Employee, as: "employee", attributes: ["firstname", "lastname"], required: false },
        { model: Department, as: "department", attributes: ["name", "description"], required: false },
        { model: HumanResources, as: "createdBy", attributes: ["firstname", "lastname"], required: true }
      ],
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).json({
      success: true,
      message: "All notice records retrieved successfully",
      data: notices
    });
  } catch (error) {
    console.error("HandleAllNotice Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};
/**
 * ======================================================
 * Get Single Notice
 * ======================================================
 */
const HandleNotice = async (req, res) => {
  try {
    const { noticeID } = req.params;

    const notice = await Notice.findOne({
      where: { id: noticeID, organizationId: req.organizationId },
      include: [
        { model: Employee, as: "employee", attributes: ["firstname", "lastname"], required: false },
        { model: Department, as: "department", attributes: ["name", "description"], required: false },
        { model: HumanResources, as: "createdBy", attributes: ["firstname", "lastname"], required: true }
      ]
    });

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notice record retrieved successfully",
      data: notice
    });
  } catch (error) {
    console.error("HandleNotice Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

/**
 * ======================================================
 * Update Notice
 * ======================================================
 */
const HandleUpdateNotice = async (req, res) => {
  try {
    const { noticeID, UpdatedData } = req.body;

    const notice = await Notice.findByPk(noticeID);
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found"
      });
    }

    await notice.update(UpdatedData);

    return res.status(200).json({
      success: true,
      message: "Notice updated successfully",
      data: notice
    });
  } catch (error) {
    console.error("HandleUpdateNotice Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

/**
 * ======================================================
 * Delete Notice
 * ======================================================
 */
const HandleDeleteNotice = async (req, res) => {
  try {
    const { noticeID } = req.params;

    const notice = await Notice.findByPk(noticeID);
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found"
      });
    }

    await notice.destroy();

    return res.status(200).json({
      success: true,
      message: "Notice deleted successfully"
    });
  } catch (error) {
    console.error("HandleDeleteNotice Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

export {
  HandleCreateNotice,
  HandleAllNotice,
  HandleNotice,
  HandleUpdateNotice,
  HandleDeleteNotice
};

