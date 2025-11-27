import db from '../models/index.js';

const { Attendance, Employee } = db

// ==================== Initialize Attendance ====================
export const HandleInitializeAttendance = async (req, res) => {
  try {
    const { employeeID } = req.body;

    if (!employeeID) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const employee = await Employee.findOne({
      where: { id: employeeID, organizationId: req.ORGID },
    });

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    if (employee.attendanceId) {
      return res.status(400).json({
        success: false,
        message: "Attendance Log already initialized for this employee",
      });
    }

    const currentdate = new Date().toISOString().split("T")[0];

    // Create attendance record
    const newAttendance = await Attendance.create({
      employeeId: employeeID,
      status: "Not Specified",
      organizationId: req.ORGID,
      attendancelog: [
        {
          logdate: currentdate,
          logstatus: "Not Specified",
        },
      ],
    });

    // Associate attendance with employee
    employee.attendanceId = newAttendance.id;
    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Attendance Log Initialized Successfully",
      data: newAttendance,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// ==================== Get All Attendance ====================
export const HandleAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findAll({
      where: { organizationId: req.ORGID },
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
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// ==================== Get Single Attendance ====================
export const HandleAttendance = async (req, res) => {
  try {
    const { attendanceID } = req.params;

    if (!attendanceID) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const attendance = await Attendance.findOne({
      where: { id: attendanceID, organizationId: req.ORGID },
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["firstname", "lastname", "departmentId"],
        },
      ],
    });

    if (!attendance) {
      return res.status(404).json({ success: false, message: "Attendance not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Attendance record retrieved successfully",
      data: attendance,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// ==================== Update Attendance ====================
export const HandleUpdateAttendance = async (req, res) => {
  try {
    const { attendanceID, status, currentdate } = req.body;

    const attendance = await Attendance.findOne({
      where: { id: attendanceID, organizationId: req.ORGID },
    });

    if (!attendance) {
      return res.status(404).json({ success: false, message: "Attendance not found" });
    }

    // Find existing log for the date
    let log = attendance.attendancelog.find(
      (item) => item.logdate.toISOString().split("T")[0] === currentdate
    );

    if (log) {
      log.logstatus = status;
    } else {
      attendance.attendancelog.push({ logdate: currentdate, logstatus: status });
    }

    await attendance.save();

    return res.status(200).json({
      success: true,
      message: "Attendance status updated successfully",
      data: attendance,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// ==================== Delete Attendance ====================
export const HandleDeleteAttendance = async (req, res) => {
  try {
    const { attendanceID } = req.params;

    const attendance = await Attendance.findOne({
      where: { id: attendanceID, organizationId: req.ORGID },
    });

    if (!attendance) {
      return res.status(404).json({ success: false, message: "Attendance not found" });
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
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
