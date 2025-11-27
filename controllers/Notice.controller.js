
import db from '../models/index.js';

const {Department,Employee, HumanResources,Notice}= db


// Create a new notice
const HandleCreateNotice = async (req, res) => {
    try {
        const { title, content, audience, departmentID, employeeID, HRID } = req.body;

        if (!title || !content || !audience || !HRID || (audience === "Department-Specific" && !departmentID) || (audience === "Employee-Specific" && !employeeID)) {
            return res.status(400).json({ success: false, message: "All required fields must be provided" });
        }

        if (audience === "Department-Specific") {
            const department = await Department.findByPk(departmentID);
            if (!department) return res.status(404).json({ success: false, message: "Department not found" });

            const existingNotice = await Notice.findOne({ 
                where: { title, content, audience, departmentId: departmentID, createdById: HRID } 
            });

            if (existingNotice) return res.status(400).json({ success: false, message: "Specific Notice already exists" });

            const notice = await Notice.create({
                title,
                content,
                audience,
                departmentId: departmentID,
                createdById: HRID,
                organizationID: req.ORGID
            });

            return res.status(201).json({ success: true, message: "Department notice created successfully", data: notice });
        }

        if (audience === "Employee-Specific") {
            const employee = await Employee.findByPk(employeeID);
            if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });

            const existingNotice = await Notice.findOne({ 
                where: { title, content, audience, employeeId: employeeID, createdById: HRID } 
            });

            if (existingNotice) return res.status(400).json({ success: false, message: "Specific Notice already exists" });

            const notice = await Notice.create({
                title,
                content,
                audience,
                employeeId: employeeID,
                createdById: HRID,
                organizationID: req.ORGID
            });

            return res.status(201).json({ success: true, message: "Employee notice created successfully", data: notice });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};

// Get all notices
const HandleAllNotice = async (req, res) => {
    try {
        const notices = await Notice.findAll({
            where: { organizationID: req.ORGID },
            include: [
                { model: Employee, attributes: ["firstname", "lastname", "department"], required: false },
                { model: Department, attributes: ["name", "description"], required: false },
                { model: HumanResources, as: "createdBy", attributes: ["firstname", "lastname"], required: true }
            ]
        });

        const data = { department_notices: [], employee_notices: [] };
        notices.forEach(n => {
            if (n.departmentId) data.department_notices.push(n);
            else if (n.employeeId) data.employee_notices.push(n);
        });

        return res.status(200).json({ success: true, message: "All notice records retrieved successfully", data });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};

// Get a single notice
const HandleNotice = async (req, res) => {
    try {
        const { noticeID } = req.params;

        const notice = await Notice.findOne({
            where: { id: noticeID, organizationID: req.ORGID },
            include: [
                { model: Employee, attributes: ["firstname", "lastname", "department"], required: false },
                { model: Department, attributes: ["name", "description"], required: false },
                { model: HumanResources, as: "createdBy", attributes: ["firstname", "lastname"], required: true }
            ]
        });

        if (!notice) return res.status(404).json({ success: false, message: "Notice not found" });

        return res.status(200).json({ success: true, message: "Notice record retrieved successfully", data: notice });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};

// Update notice
const HandleUpdateNotice = async (req, res) => {
    try {
        const { noticeID, UpdatedData } = req.body;

        const notice = await Notice.findByPk(noticeID);
        if (!notice) return res.status(404).json({ success: false, message: "Notice not found" });

        await notice.update(UpdatedData);

        return res.status(200).json({ success: true, message: "Notice updated successfully", data: notice });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};

// Delete notice
const HandleDeleteNotice = async (req, res) => {
    try {
        const { noticeID } = req.params;

        const notice = await Notice.findByPk(noticeID);
        if (!notice) return res.status(404).json({ success: false, message: "Notice not found" });

        await notice.destroy();
        return res.status(200).json({ success: true, message: "Notice deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};

module.exports = {
    HandleCreateNotice,
    HandleAllNotice,
    HandleNotice,
    HandleUpdateNotice,
    HandleDeleteNotice
};