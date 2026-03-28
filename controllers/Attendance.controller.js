import db from "../config/db.js";

const { Attendance, Employee } = db;

// ==================== Initialize Attendance ====================
export const HandleInitializeAttendance = async (req, res) => {
  try {
    const employeeID = req.EMid; // from JWT middleware
    const organizationId = req.organizationId;

    if (!employeeID || !organizationId) {
      return res.status(401).json({ success: false, message: "Unauthorized request" });
    }

    const employee = await Employee.findOne({
      where: { id: employeeID, organizationId },
    });

    if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });
    if (employee.attendanceId)
      return res.status(400).json({ success: false, message: "Attendance already initialized" });

    const currentDate = new Date().toISOString().split("T")[0];

    const newAttendance = await Attendance.create({
       employeeID: employeeID,  // make sure model maps this to DB column correctly
      status: "Not Specified",
      organizationId,
      attendancelog: [
        { logdate: currentDate, logstatus: "Not Specified" },
      ],
    });

    employee.attendanceId = newAttendance.id;
    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Attendance initialized successfully",
      data: newAttendance,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// ==================== Get All Attendance ====================
export const HandleAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findAll({
      where: { organizationId: req.organizationId },
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["firstname", "lastname", "departmentId"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "All attendance records retrieved successfully",
      data: attendance,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ==================== Get Single Attendance ====================
export const HandleAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;

    if (!attendanceId) {
      return res
        .status(400)
        .json({ success: false, message: "Attendance ID is required" });
    }

    const attendance = await Attendance.findOne({
      where: { id: attendanceId, organizationId: req.organizationId },
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["firstname", "lastname", "departmentId"],
        },
      ],
    });

    if (!attendance) {
      return res
        .status(404)
        .json({ success: false, message: "Attendance not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Attendance record retrieved successfully",
      data: attendance,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ==================== Update Attendance ====================
// ===================== Update Attendance =====================
export const HandleUpdateAttendance = async (req, res) => {
  try {
    const { attendanceId, ...updatedFields } = req.body;

    if (!attendanceId || Object.keys(updatedFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "attendanceId and at least one field to update are required",
      });
    }

    const attendance = await Attendance.findOne({
      where: { id: attendanceId, organizationId: req.organizationId },
    });

    if (!attendance) {
      return res.status(404).json({ success: false, message: "Attendance not found" });
    }

    // Update dynamic fields
    for (const key in updatedFields) {
      // For attendancelog updates, you can merge logs by date if needed
      if (key === "attendancelog" && Array.isArray(updatedFields[key])) {
        attendance.attendancelog = [...attendance.attendancelog, ...updatedFields[key]];
      } else {
        attendance[key] = updatedFields[key];
      }
    }

    await attendance.save();

    return res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: attendance,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ==================== Delete Attendance ====================
export const HandleDeleteAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;

    if (!attendanceId) {
      return res
        .status(400)
        .json({ success: false, message: "Attendance ID is required" });
    }

    const attendance = await Attendance.findOne({
      where: { id: attendanceId, organizationId: req.organizationId },
    });

    if (!attendance) {
      return res
        .status(404)
        .json({ success: false, message: "Attendance not found" });
    }

    // Remove attendance reference from employee
    const employee = await Employee.findByPk(attendance.employeeId);
    if (employee) {
      employee.attendanceId = null;
      await employee.save();
    }

    await attendance.destroy();

    return res.status(200).json({
      success: true,
      message: "Attendance record deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
