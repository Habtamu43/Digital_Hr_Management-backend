// Employee.controller.js (top of the file)
import db from '../models/index.js';
const { Employee, Department, Organization } = db;

// Get all employees
export const HandleAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll({
            where: { organizationID: req.ORGID },
            include: [
                { model: Department, as: "department", attributes: ["name"] }
            ],
            attributes: ["id", "firstname", "lastname", "email", "contactnumber", "attendance", "notice", "salary", "leaverequest", "generaterequest", "isverified"]
        });

        return res.status(200).json({ success: true, data: employees, type: "AllEmployees" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error, message: "Internal server error" });
    }
};

// Get all employees with limited fields (IDs)
export const HandleAllEmployeesIDS = async (req, res) => {
    try {
        const employees = await Employee.findAll({
            where: { organizationID: req.ORGID },
            include: [{ model: Department, as: "department", attributes: ["name"] }],
            attributes: ["id", "firstname", "lastname"]
        });

        return res.status(200).json({ success: true, data: employees, type: "AllEmployeesIDS" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error, message: "Internal server error" });
    }
};

// Get single employee by HR
export const HandleEmployeeByHR = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const employee = await Employee.findOne({
            where: { id: employeeId, organizationID: req.ORGID },
            include: [{ model: Department, as: "department", attributes: ["name"] }],
            attributes: ["id", "firstname", "lastname", "email", "contactnumber", "attendance", "notice", "salary", "leaverequest", "generaterequest"]
        });

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        return res.status(200).json({ success: true, data: employee, type: "GetEmployee" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error, message: "Internal server error" });
    }
};

// Get single employee by themselves
export const HandleEmployeeByEmployee = async (req, res) => {
    try {
        const employee = await Employee.findOne({
            where: { id: req.EMid, organizationID: req.ORGID },
            include: [{ model: Department, as: "department", attributes: ["name"] }],
            attributes: ["id", "firstname", "lastname", "email", "contactnumber", "attendance", "notice", "salary", "leaverequest", "generaterequest"]
        });

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        return res.status(200).json({ success: true, message: "Employee Data Fetched Successfully", data: employee });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error });
    }
};

// Update employee
export const HandleEmployeeUpdate = async (req, res) => {
    try {
        const { employeeId, updatedEmployee } = req.body;

        const employee = await Employee.findByPk(employeeId);

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        const updated = await employee.update(updatedEmployee);

        return res.status(200).json({ success: true, data: updated });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error, message: "Internal server error" });
    }
};

// Delete employee
export const HandleEmployeeDelete = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const employee = await Employee.findByPk(employeeId);

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        // Remove employee from department
        if (employee.departmentID) {
            const department = await Department.findByPk(employee.departmentID);
            if (department) {
                await department.removeEmployee(employee);
            }
        }

        // Remove employee from organization
        if (employee.organizationID) {
            const organization = await Organization.findByPk(employee.organizationID);
            if (organization) {
                await organization.removeEmployee(employee);
            }
        }

        await employee.destroy();

        return res.status(200).json({ success: true, message: "Employee deleted successfully", type: "EmployeeDelete" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error, message: "Internal server error" });
    }
};
