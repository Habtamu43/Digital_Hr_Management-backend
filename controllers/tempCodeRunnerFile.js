import db from "../config/db.js";

// ==================== Get All Employees ====================
export const HandleAllEmployees = async (req, res) => {
  try {
    if (!db.Employee || !db.Department) {
      return res.status(500).json({
        success: false,
        message: "Employee or Department model not initialized",
      });
    }

    const employees = await db.Employee.findAll({
      where: { organizationID: req.ORGID },
      include: [{ model: db.Department, as: "department", attributes: ["name"] }],
      attributes: [
        "id",
        "firstname",
        "lastname",
        "email",
        "contactnumber",
        "attendance",
        "notice",
        "salary",
        "leaverequest",
        "generaterequest",
        "isverified",
      ],
    });

    return res.status(200).json({
      success: true,
      data: employees,
      type: "AllEmployees",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ==================== Get All Employees (IDs only) ====================
export const HandleAllEmployeesIDS = async (req, res) => {
  try {
    const employees = await db.Employee.findAll({
      where: { organizationID: req.ORGID },
      include: [{ model: db.Department, as: "department", attributes: ["name"] }],
      attributes: ["id", "firstname", "lastname"],
    });

    return res.status(200).json({
      success: true,
      data: employees,
      type: "AllEmployeesIDS",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ==================== Get Single Employee (by HR) ====================
export const HandleEmployeeByHR = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await db.Employee.findOne({
      where: { id: employeeId, organizationID: req.ORGID },
      include: [{ model: db.Department, as: "department", attributes: ["name"] }],
      attributes: [
        "id",
        "firstname",
        "lastname",
        "email",
        "contactnumber",
        "attendance",
        "notice",
        "salary",
        "leaverequest",
        "generaterequest",
      ],
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: employee,
      type: "GetEmployee",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ==================== Get Single Employee (by themselves) ====================
export const HandleEmployeeByEmployee = async (req, res) => {
  try {
    const employee = await db.Employee.findOne({
      where: { id: req.EMid, organizationID: req.ORGID },
      include: [{ model: db.Department, as: "department", attributes: ["name"] }],
      attributes: [
        "id",
        "firstname",
        "lastname",
        "email",
        "contactnumber",
        "attendance",
        "notice",
        "salary",
        "leaverequest",
        "generaterequest",
      ],
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee Data Fetched Successfully",
      data: employee,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ==================== Update Employee ====================
export const HandleEmployeeUpdate = async (req, res) => {
  try {
    const { employeeId, updatedEmployee } = req.body;

    const employee = await db.Employee.findByPk(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const updated = await employee.update(updatedEmployee);

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ==================== Delete Employee ====================
export const HandleEmployeeDelete = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await db.Employee.findByPk(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Remove from department
    if (employee.departmentID) {
      const department = await db.Department.findByPk(employee.departmentID);
      if (department) await department.removeEmployee(employee);
    }

    // Remove from organization
    if (employee.organizationID) {
      const organization = await db.Organization.findByPk(employee.organizationID);
      if (organization) await organization.removeEmployee(employee);
    }

    await employee.destroy();

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
      type: "EmployeeDelete",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
