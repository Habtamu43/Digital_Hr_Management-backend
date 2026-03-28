import db from "../config/db.js";

const { Employee, Department } = db;

/* ===================== CREATE DEPARTMENT ===================== */
export const HandleCreateDepartment = async (req, res) => {
  try {
    const { departmentName, description } = req.body;

    if (!departmentName || !description) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existing = await Department.findOne({
      where: { name: departmentName, organizationId: req.organizationId },
    });

    if (existing) {
      return res.status(400).json({ success: false, message: "Department already exists" });
    }

    const newDepartment = await Department.create({
      name: departmentName,
      description,
      organizationId: req.organizationId,
    });

    return res.status(201).json({ success: true, message: "Department created successfully", data: newDepartment });
  } catch (error) {
    console.error("CREATE DEPARTMENT ERROR:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

/* ===================== GET ALL DEPARTMENTS ===================== */
export const HandleAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      where: { organizationId: req.organizationId },
      include: [
        {
          model: Employee,
          as: "employees", // ✅ must match Department model alias exactly
          attributes: ["id", "firstname", "lastname", "email", "contactnumber"],
        },
      ],
    });

    return res.status(200).json({ success: true, message: "All departments retrieved successfully", data: departments });
  } catch (error) {
    console.error("GET ALL DEPARTMENTS ERROR:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

/* ===================== GET SINGLE DEPARTMENT ===================== */
export const HandleDepartment = async (req, res) => {
  try {
    const { departmentID } = req.params;

    const department = await Department.findOne({
      where: { id: departmentID, organizationId: req.organizationId },
      include: [{ model: Employee, as: "employees" }],
    });

    if (!department) return res.status(404).json({ success: false, message: "Department not found" });

    return res.status(200).json({ success: true, message: "Department retrieved successfully", data: department });
  } catch (error) {
    console.error("GET DEPARTMENT ERROR:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

/* ===================== UPDATE DEPARTMENT ===================== */
export const HandleUpdateDepartment = async (req, res) => {
  try {
    const { departmentID, UpdatedDepartment, employeeIDArray } = req.body;

    const department = await Department.findOne({
      where: { id: departmentID, organizationId: req.organizationId },
      include: [{ model: Employee, as: "employees" }],
    });

    if (!department) return res.status(404).json({ success: false, message: "Department not found" });

    // Add employees
    if (Array.isArray(employeeIDArray) && employeeIDArray.length > 0) {
      const existingIds = department.employees.map(emp => emp.id);

      const newEmployees = employeeIDArray.filter(id => !existingIds.includes(id));
      const rejectedEmployees = employeeIDArray.filter(id => existingIds.includes(id));

      if (rejectedEmployees.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Some employees already belong to ${department.name}`,
          EmployeeList: rejectedEmployees,
        });
      }

      if (newEmployees.length > 0) {
        await department.addEmployees(newEmployees);
        await Employee.update({ departmentID }, { where: { id: newEmployees } });
      }
    }

    // Update department info
    const updatedDept = await department.update(UpdatedDepartment);

    return res.status(200).json({ success: true, message: "Department updated successfully", data: updatedDept });
  } catch (error) {
    console.error("UPDATE DEPARTMENT ERROR:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

/* ===================== DELETE DEPARTMENT ===================== */
export const HandleDeleteDepartment = async (req, res) => {
  try {
    const { departmentID, employeeIDArray, action } = req.body;

    const department = await Department.findOne({ where: { id: departmentID } });
    if (!department) return res.status(404).json({ success: false, message: "Department not found" });

    if (action === "delete-department") {
      await Employee.update({ departmentID: null }, { where: { departmentID } });
      await department.destroy();
      return res.status(200).json({ success: true, message: "Department deleted successfully" });
    }

    if (action === "delete-employee" && Array.isArray(employeeIDArray)) {
      await department.removeEmployees(employeeIDArray);
      await Employee.update({ departmentID: null }, { where: { id: employeeIDArray } });
      return res.status(200).json({ success: true, message: "Employees removed successfully" });
    }

    return res.status(400).json({ success: false, message: "Invalid action" });
  } catch (error) {
    console.error("DELETE DEPARTMENT ERROR:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};
