
import db from '../models/index.js';

const {Employee,Salary} = db

// Create a new salary record
export const HandleCreateSalary = async (req, res) => {
    try {
        const { employeeID, basicpay, bonusePT, deductionPT, duedate, currency } = req.body;

        if (!employeeID || !basicpay || !bonusePT || !deductionPT || !duedate || !currency) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const employee = await Employee.findByPk(employeeID);
        if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });

        const bonuses = (basicpay * bonusePT) / 100;
        const deductions = (basicpay * deductionPT) / 100;
        const netpay = (basicpay + bonuses) - deductions;

        const existingSalary = await Salary.findOne({
            where: {
                employeeId: employeeID,
                basicpay,
                bonuses,
                deductions,
                netpay,
                currency,
                duedate: new Date(duedate),
            },
        });

        if (existingSalary) {
            return res.status(400).json({ success: false, message: "Salary record already exists for this employee" });
        }

        const salary = await Salary.create({
            employeeId: employeeID,
            basicpay,
            bonuses,
            deductions,
            netpay,
            currency,
            duedate: new Date(duedate),
            organizationID: req.ORGID,
        });

        await employee.addSalary(salary); // assuming Employee hasMany Salary

        return res.status(201).json({ success: true, message: "Salary created successfully", data: salary });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// Get all salary records
export const HandleAllSalary = async (req, res) => {
    try {
        const salaries = await Salary.findAll({
            where: { organizationID: req.ORGID },
            include: [{ model: Employee, attributes: ["firstname", "lastname", "department"] }],
        });

        return res.status(200).json({ success: true, message: "All salary records retrieved successfully", data: salaries });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// Get a single salary record
export const HandleSalary = async (req, res) => {
    try {
        const { salaryID } = req.params;

        const salary = await Salary.findOne({
            where: { id: salaryID, organizationID: req.ORGID },
            include: [{ model: Employee, attributes: ["firstname", "lastname", "department"] }],
        });

        if (!salary) return res.status(404).json({ success: false, message: "Salary record not found" });

        return res.status(200).json({ success: true, message: "Salary record found", data: salary });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// Update a salary record
export const HandleUpdateSalary = async (req, res) => {
    try {
        const { salaryID, basicpay, bonusePT, deductionPT, duedate, currency, status } = req.body;

        const bonuses = (basicpay * bonusePT) / 100;
        const deductions = (basicpay * deductionPT) / 100;
        const netpay = (basicpay + bonuses) - deductions;

        const salary = await Salary.findByPk(salaryID);

        if (!salary) return res.status(404).json({ success: false, message: "Salary record not found" });

        await salary.update({
            basicpay,
            bonuses,
            deductions,
            netpay,
            currency,
            duedate: new Date(duedate),
            status,
        });

        return res.status(200).json({ success: true, message: "Salary updated successfully", data: salary });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// Delete a salary record
export const HandleDeleteSalary = async (req, res) => {
    try {
        const { salaryID } = req.params;

        const salary = await Salary.findOne({ where: { id: salaryID, organizationID: req.ORGID } });
        if (!salary) return res.status(404).json({ success: false, message: "Salary record not found" });

        const employee = await Employee.findByPk(salary.employeeId);
        if (employee) await employee.removeSalary(salary); // assuming Employee hasMany Salary

        await salary.destroy();

        return res.status(200).json({ success: true, message: "Salary deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};
