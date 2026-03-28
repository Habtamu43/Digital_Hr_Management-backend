import db from "../config/db.js";

const { Employee, Salary, Department } = db;

// Create a new salary record
export const HandleCreateSalary = async (req, res) => {
  try {
    const { employeeId, basicPay, bonusePT, deductionPT, dueDate, currency } = req.body;

    if (!employeeId || !basicPay || !bonusePT || !deductionPT || !dueDate || !currency) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const employee = await Employee.findByPk(employeeId);
    if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });

    const bonuses = (basicPay * bonusePT) / 100;
    const deductions = (basicPay * deductionPT) / 100;
    const netPay = basicPay + bonuses - deductions;

    const existingSalary = await Salary.findOne({
      where: {
        employeeId,
        basicPay,
        bonuses,
        deductions,
        netPay,
        currency,
        dueDate: new Date(dueDate),
      },
    });

    if (existingSalary) {
      return res.status(400).json({ success: false, message: "Salary record already exists for this employee" });
    }

    const salary = await Salary.create({
      employeeId,
      basicPay,
      bonuses,
      deductions,
      netPay,
      currency,
      dueDate: new Date(dueDate),
      organizationId: req.organizationId,
    });

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
      where: { organizationId: req.organizationId },
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["firstname", "lastname"],
          include: [
            {
              model: Department,
              as: "department",
              attributes: ["name"],
            },
          ],
        },
      ],
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
      where: { id: salaryID, organizationId: req.organizationId },
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["firstname", "lastname"],
          include: [
            {
              model: Department,
              as: "department",
              attributes: ["name"],
            },
          ],
        },
      ],
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
    const { salaryID, basicPay, bonusePT, deductionPT, dueDate, currency, status } = req.body;

    const bonuses = (basicPay * bonusePT) / 100;
    const deductions = (basicPay * deductionPT) / 100;
    const netPay = basicPay + bonuses - deductions;

    const salary = await Salary.findByPk(salaryID);
    if (!salary) return res.status(404).json({ success: false, message: "Salary record not found" });

    await salary.update({
      basicPay,
      bonuses,
      deductions,
      netPay,
      currency,
      dueDate: new Date(dueDate),
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

    const salary = await Salary.findOne({ where: { id: salaryID, organizationId: req.organizationId } });
    if (!salary) return res.status(404).json({ success: false, message: "Salary record not found" });

    await salary.destroy();

    return res.status(200).json({ success: true, message: "Salary deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
