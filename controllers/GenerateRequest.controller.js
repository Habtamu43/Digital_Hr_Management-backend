import db from "../config/db.js";

const { Department, Employee, GenerateRequest } = db;

// ================== Create Generate Request ==================
export const HandleCreateGenerateRequest = async (req, res) => {
  try {
    const { requestTitle, requestContent, employeeId, departmentId } = req.body;
    const organizationId = req.organizationId; // from HR token

    // Validate required fields
    if (!requestTitle || !requestContent || !employeeId || !departmentId) {
      return res.status(400).json({ success: false, message: "All required fields are required" });
    }

    // Check if employee exists
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    // Check if department exists
    const department = await Department.findByPk(departmentId);
    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    const newRequest = await GenerateRequest.create({
      requestTitle,
      requestContent,
      employeeId,       // ✅ matches your model
      departmentId,     // ✅ matches your model
      organizationId: organizationId || employee.organizationId || null,
      status: "Pending" // default
    });

    return res.status(201).json({
      success: true,
      message: "Request created successfully",
      data: newRequest,
    });
  } catch (error) {
    console.error("Create Request Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ================== Get All Generate Requests ==================
export const HandleAllGenerateRequest = async (req, res) => {
  try {
    const requests = await GenerateRequest.findAll({
      where: { organizationId: req.organizationId },
      include: [
        { model: Employee, as: 'employee', attributes: ['firstname', 'lastname'] },
        { model: Department, as: 'department', attributes: ['name'] },
      ],
    });

    return res.status(200).json({ success: true, message: "All requests retrieved successfully", data: requests });
  } catch (error) {
    console.error("Error fetching all requests:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error });
  }
};

// ================== Get Single Generate Request ==================
export const HandleGenerateRequest = async (req, res) => {
  try {
    const { requestID } = req.params;
    const request = await GenerateRequest.findOne({
      where: { id: requestID, organizationId: req.organizationId },
      include: [
        { model: Employee, as: 'employee', attributes: ['firstname', 'lastname'] },
        { model: Department, as: 'department', attributes: ['name'] },
      ],
    });

    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    return res.status(200).json({ success: true, message: "Request retrieved successfully", data: request });
  } catch (error) {
    console.error("Error fetching single request:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error });
  }
};

// ================== Update Request by Employee ==================
export const HandleUpdateRequestByEmployee = async (req, res) => {
  try {
    const { requestID, requestTitle, requestContent } = req.body;

    const request = await GenerateRequest.findByPk(requestID);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    request.requestTitle = requestTitle || request.requestTitle;
    request.requestContent = requestContent || request.requestContent;
    await request.save();

    return res.status(200).json({ success: true, message: "Request updated successfully", data: request });
  } catch (error) {
    console.error("Error updating request by employee:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error });
  }
};

// ================== Update Request by HR ==================
export const HandleUpdateRequestByHR = async (req, res) => {
  try {
    const { requestID, approvedBy, status } = req.body;

    const request = await GenerateRequest.findByPk(requestID);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    request.approvedBy = approvedBy || request.approvedBy;
    request.status = status || request.status;
    await request.save();

    return res.status(200).json({ success: true, message: "Request updated successfully", data: request });
  } catch (error) {
    console.error("Error updating request by HR:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error });
  }
};

// ================== Delete Request ==================
export const HandleDeleteRequest = async (req, res) => {
  try {
    const { requestID } = req.params;

    const request = await GenerateRequest.findByPk(requestID);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    await request.destroy();

    return res.status(200).json({ success: true, message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error });
  }
};
