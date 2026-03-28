import db from "../config/db.js";
const {
  Employee,
  Department,
  Attendance,
  Notice,
  Salary,
  Leave,
  GenerateRequest,
} = db;

// ========================== Get all employees ==========================
export const HandleAllEmployees = async (req, res) => {
  try {
    // 1. Get Org ID safely from the HR token
    const orgId = req.hr?.organizationId || req.organizationId;

    if (!orgId) {
      return res
        .status(400)
        .json({ success: false, message: "Org ID missing" });
    }

    const employees = await Employee.findAll({
      where: { organizationId: orgId },
      attributes: [
        "id",
        "firstname",
        "lastname",
        "email",
        "contactnumber",
        "attendanceId",
        "departmentId",
        "organizationId",
        "isVerified",
      ],
      include: [
        { model: Department, as: "department", attributes: ["id", "name"] },
        { model: Attendance, as: "attendance", attributes: ["id", "status"] },
        { model: Notice, as: "notices", attributes: ["id", "title"] },
        {
          model: Salary,
          as: "salaries",
          attributes: ["id", "basicPay", "netPay", "status"],
        },
        {
          model: Leave,
          as: "leaveRequests",
          attributes: ["id", "status", "startDate"],
        },
        {
          model: GenerateRequest,
          as: "generateRequests",
          // FIX: Ensure these match your GenerateRequest Model exactly!
          // Try removing specific attributes if you aren't sure of the names
          attributes: ["id", "status"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    // This will print the EXACT column that is missing in your terminal
    console.error("DETAILED ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message, // Send the message so you can see it in frontend
    });
  }
};
// ========================== Get all employees (IDs only) ==========================
export const HandleAllEmployeesIDS = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      where: { organizationId: req.organizationId },
      attributes: ["id", "firstname", "lastname"],
      include: [{ model: Department, as: "department", attributes: ["name"] }],
    });

    return res.status(200).json({
      success: true,
      data: employees,
      type: "AllEmployeesIDS",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

// ========================== Get single employee by HR ==========================
export const HandleEmployeeByHR = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findOne({
      where: { id: employeeId, organizationId: req.organizationId },
      attributes: [
        "id",
        "firstname",
        "lastname",
        "email",
        "contactnumber",
        "attendanceId",
        "departmentId",
        "organizationId",
        "isVerified",
      ],
      include: [
        { model: Department, as: "department", attributes: ["id", "name"] },
        { model: Attendance, as: "attendance", attributes: ["id", "status"] },
      ],
    });

    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });

    return res
      .status(200)
      .json({ success: true, data: employee, type: "GetEmployee" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

// ========================== Get single employee by themselves ==========================
export const HandleEmployeeByEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      where: { id: req.EMid, organizationId: req.organizationId },
      attributes: [
        "id",
        "firstname",
        "lastname",
        "email",
        "contactnumber",
        "attendanceId",
        "departmentId",
        "organizationId",
        "isVerified",
      ],
      include: [
        { model: Department, as: "department", attributes: ["id", "name"] },
        { model: Attendance, as: "attendance", attributes: ["id", "status"] },
      ],
    });

    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });

    return res.status(200).json({
      success: true,
      message: "Employee Data Fetched Successfully",
      data: employee,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

// ========================== Update employee ==========================
export const HandleEmployeeUpdate = async (req, res) => {
  try {
    const { employeeId, updatedEmployee } = req.body;

    const employee = await Employee.findByPk(employeeId);
    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });

    const updated = await employee.update(updatedEmployee);
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

// ========================== Delete employee ==========================
export const HandleEmployeeDelete = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findByPk(employeeId);
    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });

    await employee.destroy();
    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
      type: "EmployeeDelete",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};
