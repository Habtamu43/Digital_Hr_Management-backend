import db from '../models/index.js';

const { Employee ,Department  } = db

// Create Department
export const HandleCreateDepartment = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const department = await Department.findOne({ where: { name, organizationID: req.ORGID } });

        if (department) {
            return res.status(400).json({ success: false, message: "Department already exists" });
        }

        const newDepartment = await Department.create({
            name,
            description,
            organizationID: req.ORGID
        });

        return res.status(200).json({
            success: true,
            message: "Department created successfully",
            data: newDepartment,
            type: "CreateDepartment"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get All Departments
export const HandleAllDepartments = async (req, res) => {
    try {
        const departments = await Department.findAll({
            where: { organizationID: req.ORGID },
            include: [
                { model: Employee, as: "employees", attributes: ["id", "firstname", "lastname", "email", "contactnumber", "title"] },
                // Add other associations like notice, HumanResources if defined
            ]
        });

        return res.status(200).json({
            success: true,
            message: "All departments retrieved successfully",
            data: departments,
            type: "AllDepartments"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get Single Department
export const HandleDepartment = async (req, res) => {
    try {
        const { departmentID } = req.params;

        const department = await Department.findOne({
            where: { id: departmentID, organizationID: req.ORGID },
            include: [{ model: Employee, as: "employees" }]
        });

        if (!department) {
            return res.status(404).json({ success: false, message: "Department not found" });
        }

        return res.status(200).json({
            success: true,
            message: department.name,
            data: department,
            type: "GetDepartment"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Update Department
export const HandleUpdateDepartment = async (req, res) => {
    try {
        const { departmentID, UpdatedDepartment, employeeIDArray } = req.body;

        const department = await Department.findOne({ where: { id: departmentID, organizationID: req.ORGID } });

        if (!department) {
            return res.status(404).json({ success: false, message: "Department not found" });
        }

        // Add employees to department
        if (employeeIDArray && employeeIDArray.length > 0) {
            const existingEmployeeIds = (await department.getEmployees()).map(emp => emp.id);

            const selectedEmployees = employeeIDArray.filter(id => !existingEmployeeIds.includes(id));
            const rejectedEmployees = employeeIDArray.filter(id => existingEmployeeIds.includes(id));

            if (rejectedEmployees.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Some Employees Already Belong To ${department.name} Department`,
                    EmployeeList: rejectedEmployees
                });
            }

            // Add selected employees
            await department.addEmployees(selectedEmployees);

            // Update Employee records
            await Employee.update(
                { departmentID: departmentID },
                { where: { id: selectedEmployees } }
            );

            return res.status(200).json({
                success: true,
                message: `Employees added successfully to ${department.name} Department`,
                data: department,
                type: "DepartmentEMUpdate"
            });
        }

        // Update department fields
        const updatedDept = await department.update(UpdatedDepartment);

        return res.status(200).json({
            success: true,
            message: "Department updated successfully",
            data: updatedDept,
            type: "DepartmentDEUpdate"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Delete Department / Remove Employees
export const HandleDeleteDepartment = async (req, res) => {
    try {
        const { departmentID, employeeIDArray, action } = req.body;

        const department = await Department.findOne({ where: { id: departmentID } });

        if (!department) {
            return res.status(404).json({ success: false, message: "Department not found" });
        }

        if (action === "delete-department") {
            // Remove department from employees
            await Employee.update(
                { departmentID: null },
                { where: { departmentID: departmentID } }
            );

            await department.destroy();

            return res.status(200).json({ success: true, message: "Department deleted successfully" });
        }

        if (action === "delete-employee") {
            // Remove specific employees from department
            await department.removeEmployees(employeeIDArray);

            await Employee.update(
                { departmentID: null },
                { where: { id: employeeIDArray } }
            );

            return res.status(200).json({ success: true, message: "Employees removed successfully", type: "RemoveEmployeeDE" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
