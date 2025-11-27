import db from '../models/index.js';

export const {Employee,HumanResources,Leave} = db

// ✅ Create a new leave request
export const HandleCreateLeave = async (req, res) => {
    try {
        const { employeeID, startdate, enddate, title, reason } = req.body;

        if (!employeeID || !startdate || !enddate || !title || !reason) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check if employee exists
        const employee = await Employee.findOne({
            where: { id: employeeID, organizationID: req.ORGID },
        });

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        // Check if a similar leave already exists
        const existingLeave = await Leave.findOne({
            where: {
                employeeID,
                startdate,
                enddate,
            },
        });

        if (existingLeave) {
            return res.status(400).json({ success: false, message: "Leave record already exists for this employee" });
        }

        // Create the leave record
        const leave = await Leave.create({
            employeeID,
            startdate,
            enddate,
            title,
            reason,
            organizationID: req.ORGID,
            status: "Pending",
        });

        return res.status(201).json({
            success: true,
            message: "Leave request created successfully",
            data: leave,
        });
    } catch (error) {
        console.error("Error creating leave:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};

// ✅ Get all leave records
export const HandleAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.findAll({
            where: { organizationID: req.ORGID },
            include: [
                {
                    model: Employee,
                    as: "employee",
                    attributes: ["firstname", "lastname", "department"],
                },
                {
                    model: HumanResources,
                    as: "approvedby",
                    attributes: ["firstname", "lastname"],
                },
            ],
        });

        return res.status(200).json({
            success: true,
            message: "All leave records retrieved successfully",
            data: leaves,
        });
    } catch (error) {
        console.error("Error fetching leaves:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};

// ✅ Get a single leave record
export const HandleLeave = async (req, res) => {
    try {
        const { leaveID } = req.params;

        const leave = await Leave.findOne({
            where: { id: leaveID, organizationID: req.ORGID },
            include: [
                {
                    model: Employee,
                    as: "employee",
                    attributes: ["firstname", "lastname", "department"],
                },
                {
                    model: HumanResources,
                    as: "approvedby",
                    attributes: ["firstname", "lastname"],
                },
            ],
        });

        if (!leave) {
            return res.status(404).json({ success: false, message: "Leave record not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Leave record retrieved successfully",
            data: leave,
        });
    } catch (error) {
        console.error("Error fetching leave:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};

// ✅ Update leave by employee
export const HandleUpdateLeaveByEmployee = async (req, res) => {
    try {
        const { leaveID, startdate, enddate, title, reason } = req.body;

        if (!leaveID || !startdate || !enddate || !title || !reason) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const leave = await Leave.findOne({
            where: { id: leaveID, organizationID: req.ORGID },
        });

        if (!leave) {
            return res.status(404).json({ success: false, message: "Leave record not found" });
        }

        await leave.update({ startdate, enddate, title, reason });

        return res.status(200).json({
            success: true,
            message: "Leave record updated successfully",
            data: leave,
        });
    } catch (error) {
        console.error("Error updating leave:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};

// ✅ Update leave status by HR
export const HandleUpdateLeavebyHR = async (req, res) => {
    try {
        const { leaveID, status, HRID } = req.body;

        if (!leaveID || !status || !HRID) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const leave = await Leave.findOne({
            where: { id: leaveID, organizationID: req.ORGID },
        });

        const hr = await HumanResources.findByPk(HRID);

        if (!leave) return res.status(404).json({ success: false, message: "Leave record not found" });
        if (!hr) return res.status(404).json({ success: false, message: "HR not found" });

        await leave.update({ status, approvedbyID: HRID });

        return res.status(200).json({
            success: true,
            message: "Leave status updated successfully",
            data: leave,
        });
    } catch (error) {
        console.error("Error updating leave by HR:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};

// ✅ Delete a leave record
export const HandleDeleteLeave = async (req, res) => {
    try {
        const { leaveID } = req.params;

        const leave = await Leave.findOne({
            where: { id: leaveID, organizationID: req.ORGID },
        });

        if (!leave) return res.status(404).json({ success: false, message: "Leave record not found" });

        await leave.destroy();

        return res.status(200).json({ success: true, message: "Leave record deleted successfully" });
    } catch (error) {
        console.error("Error deleting leave:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};

