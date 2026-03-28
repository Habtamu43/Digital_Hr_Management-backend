import db from "../config/db.js";

const {
  Employee,
  Department,
  Leave,
  Salary,
  Notice,
  GenerateRequest,
  Balance,
  HumanResources,
} = db;

// ==================== HR Dashboard ====================
export const HandleHRDashboard = async (req, res) => {
  try {
    // 1. Safely extract organizationId from the HR token (middleware)
    const orgId = req.hr?.organizationId || req.organizationId;

    if (!orgId) {
      console.error(
        "Dashboard Error: Organization ID is missing from request/token",
      );
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Organization context not found.",
      });
    }

    // 2. Run counts.
    // If these crash with a 500, it means the Model definition for these tables
    // likely contains a column name (like 'department') that doesn't exist in the DB.
    const [employees, departments, leaves, requests] = await Promise.all([
      Employee.count({ where: { organizationId: orgId } }),
      Department.count({ where: { organizationId: orgId } }),
      Leave.count({ where: { organizationId: orgId } }),
      GenerateRequest.count({ where: { organizationId: orgId } }),
    ]);

    // 3. Fetch Balance data
    const balance = await Balance.findAll({ where: { organizationId: orgId } });

    // 4. Fetch Notices
    // NOTE: If this part crashes, the "as: 'createdBy'" alias might not be defined
    // correctly in your db.js/associations file.
    let notices = [];
    try {
      notices = await Notice.findAll({
        where: { organizationId: orgId },
        include: [
          {
            model: HumanResources,
            as: "createdBy",
            attributes: ["firstname", "lastname"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: 10,
      });
    } catch (noticeError) {
      console.error(
        "Notice Fetch Error (Dashboard continues):",
        noticeError.message,
      );
      // We set notices to empty so the whole dashboard doesn't crash if only notices fail
      notices = [];
    }

    // 5. Success Response
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
    // THIS LOG IS CRUCIAL: Check your backend terminal for this output!
    console.error("CRITICAL DASHBOARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
