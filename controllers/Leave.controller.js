import db from "../config/db.js";

export const { Employee, HumanResources, Leave, Department } = db;

// ✅ Create a new leave request
export const HandleCreateLeave = async (req, res) => {
  try {
    const { employeeId, startDate, endDate, title, reason, approvedById } = req.body;

    if (!employeeId || !startDate || !endDate || !title || !reason) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const employee = await Employee.findOne({
      where: { id: employeeId, organizationId: req.organizationId },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const existingLeave = await Leave.findOne({
      where: {
        employeeId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    if (existingLeave) {
      return res.status(400).json({
        success: false,
        message: "Leave record already exists for this employee",
      });
    }

    const leave = await Leave.create({
      employeeId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      title,
      reason,
      approvedById: approvedById || null,
      organizationId: req.organizationId,
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Leave request created successfully",
      data: leave,
    });
  } catch (error) {
    console.error("Error creating leave:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ✅ Get all leave records
export const HandleAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.findAll({
      where: { organizationId: req.organizationId },
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["id", "firstname", "lastname", "departmentId"],
          include: [
            {
              model: Department,
              as: "department",
              attributes: ["id", "name"], // make sure "name" exists in Department model
            },
          ],
        },
        {
          model: HumanResources,
          as: "approvedBy",
          attributes: ["id", "firstname", "lastname"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "All leave records retrieved successfully",
      data: leaves,
    });
  } catch (error) {
    console.error("Error fetching leaves:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ✅ Get a single leave record
export const HandleLeave = async (req, res) => {
  try {
    const { leaveID } = req.params;

    const leave = await Leave.findOne({
      where: { id: leaveID, organizationId: req.organizationId },
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["id", "firstname", "lastname", "departmentId"],
          include: [
            {
              model: Department,
              as: "department",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: HumanResources,
          as: "approvedBy",
          attributes: ["id", "firstname", "lastname"],
        },
      ],
    });

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Leave record retrieved successfully",
      data: leave,
    });
  } catch (error) {
    console.error("Error fetching leave:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ✅ Update leave by employee
export const HandleUpdateLeaveByEmployee = async (req, res) => {
  try {
    const { leaveID, startDate, endDate, title, reason } = req.body;

    if (!leaveID || !startDate || !endDate || !title || !reason) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const leave = await Leave.findOne({
      where: { id: leaveID, organizationId: req.organizationId },
    });

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave record not found",
      });
    }

    await leave.update({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      title,
      reason,
    });

    return res.status(200).json({
      success: true,
      message: "Leave record updated successfully",
      data: leave,
    });
  } catch (error) {
    console.error("Error updating leave:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ✅ Update leave status by HR
export const HandleUpdateLeaveByHR = async (req, res) => {
  try {
    const { leaveID, status, HRID } = req.body;

    if (!leaveID || !status || !HRID) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const leave = await Leave.findOne({
      where: { id: leaveID, organizationId: req.organizationId },
    });

    const hr = await HumanResources.findByPk(HRID);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave record not found",
      });
    }

    if (!hr) {
      return res.status(404).json({
        success: false,
        message: "HR not found",
      });
    }

    await leave.update({
      status,
      approvedById: HRID,
    });

    return res.status(200).json({
      success: true,
      message: "Leave status updated successfully",
      data: leave,
    });
  } catch (error) {
    console.error("Error updating leave by HR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ✅ Delete a leave record
export const HandleDeleteLeave = async (req, res) => {
  try {
    const { leaveID } = req.params;

    const leave = await Leave.findOne({
      where: { id: leaveID, organizationId: req.organizationId },
    });

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave record not found",
      });
    }

    await leave.destroy();

    return res.status(200).json({
      success: true,
      message: "Leave record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting leave:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};