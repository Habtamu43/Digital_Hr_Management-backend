import db from "../config/db.js";


const { Employee, Department , Leave ,Salary , Notice , GenerateRequest , Balance} = db

// ==================== HR Dashboard ====================
export const HandleHRDashboard = async (req, res) => {
  try {
    // Count employees, departments, leaves, requests
    const employees = await Employee.count({ where: { organizationId: req.ORGID } });
    const departments = await Department.count({ where: { organizationId: req.ORGID } });
    const leaves = await Leave.count({ where: { organizationId: req.ORGID } });
    const requests = await GenerateRequest.count({ where: { organizationId: req.ORGID } });

    // Get balance records
    const balance = await Balance.findAll({ where: { organizationId: req.ORGID } });

    // Get latest 10 notices with creator info
    const notices = await Notice.findAll({
      where: { organizationId: req.ORGID },
      include: [
        {
          model: Employee,
          as: "createdBy",
          attributes: ["firstname", "lastname"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    return res.status(200).json({
      success: true,
      data: {
        employees,
        departments,
        leaves,
        requests,
        balance,
        notices,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
