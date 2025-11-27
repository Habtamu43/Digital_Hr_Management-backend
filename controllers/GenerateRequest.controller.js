

import db from '../models/index.js';

const { Department, Employee, GenerateRequest} = db


// ================== Create Generate Request ==================
export const HandleCreateGenerateRequest = async (req, res) => {
    try {
        const { requesttitle, requestconent, employeeID } = req.body;

        if (!requesttitle || !requestconent || !employeeID) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const employee = await Employee.findOne({
            where: { id: employeeID, organizationId: req.ORGID }
        });

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        const department = await Department.findOne({
            where: { id: employee.departmentId, organizationId: req.ORGID }
        });

        if (!department) {
            return res.status(404).json({ success: false, message: "Department not found" });
        }

        const existingRequest = await GenerateRequest.findOne({
            where: {
                requesttitle,
                requestconent,
                employeeId: employeeID,
                departmentId: employee.departmentId
            }
        });

        if (existingRequest) {
            return res.status(409).json({ success: false, message: "Request already exists" });
        }

        const newGenerateRequest = await GenerateRequest.create({
            requesttitle,
            requestconent,
            employeeId: employeeID,
            departmentId: employee.departmentId,
            organizationId: req.ORGID
        });

        await employee.addGenerateRequest(newGenerateRequest); // Sequelize association

        return res.status(200).json({ success: true, message: "Request Generated Successfully", data: newGenerateRequest });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};

// ================== Get All Generate Requests ==================
export const HandleAllGenerateRequest = async (req, res) => {
    try {
        const requests = await GenerateRequest.findAll({
            where: { organizationId: req.ORGID },
            include: [
                { model: Employee, attributes: ["firstname", "lastname"] },
                { model: Department, attributes: ["name"] }
            ]
        });

        return res.status(200).json({ success: true, message: "All requests retrieved successfully", data: requests });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};

// ================== Get Single Generate Request ==================
export const HandleGenerateRequest = async (req, res) => {
    try {
        const { requestID } = req.params;
        const request = await GenerateRequest.findOne({
            where: { id: requestID, organizationId: req.ORGID },
            include: [
                { model: Employee, attributes: ["firstname", "lastname"] },
                { model: Department, attributes: ["name"] }
            ]
        });

        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        return res.status(200).json({ success: true, message: "Request retrieved successfully", data: request });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};

// ================== Update Request by Employee ==================
export const HandleUpdateRequestByEmployee = async (req, res) => {
    try {
        const { requestID, requesttitle, requestconent } = req.body;
        const request = await GenerateRequest.findByPk(requestID);

        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        request.requesttitle = requesttitle || request.requesttitle;
        request.requestconent = requestconent || request.requestconent;
        await request.save();

        return res.status(200).json({ success: true, message: "Request updated successfully", data: request });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};

// ================== Update Request by HR ==================
export const HandleUpdateRequestByHR = async (req, res) => {
    try {
        const { requestID, approvedby, status } = req.body;
        const request = await GenerateRequest.findByPk(requestID);

        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        request.approvedby = approvedby || request.approvedby;
        request.status = status || request.status;
        await request.save();

        return res.status(200).json({ success: true, message: "Request updated successfully", data: request });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};

// ================== Delete Request ==================
export const HandleDeleteRequest = async (req, res) => {
    try {
        const { requestID } = req.params;
        const request = await GenerateRequest.findByPk(requestID);

        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        const employee = await Employee.findByPk(request.employeeId);
        if (employee) {
            await employee.removeGenerateRequest(request); // Sequelize association
        }

        await request.destroy();

        return res.status(200).json({ success: true, message: "Request deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};
