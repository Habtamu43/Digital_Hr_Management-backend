import db from '../models/index.js';

const {InterviewInsight,Applicant,Employee} = db;

// Create a new interview record
export const HandleCreateInterview = async (req, res) => {
    try {
        const { applicantID, interviewerID } = req.body;

        if (!applicantID || !interviewerID) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingInterview = await InterviewInsight.findOne({
            where: { applicant: applicantID, organizationID: req.ORGID }
        });

        if (existingInterview) {
            return res.status(409).json({ success: false, message: "Interview Record already exists for this applicant" });
        }

        const newInterview = await InterviewInsight.create({
            applicant: applicantID,
            interviewer: interviewerID,
            organizationID: req.ORGID
        });

        return res.status(201).json({ success: true, message: "Interview Record created successfully", data: newInterview });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};

// Get all interviews
export const HandleAllInterviews = async (req, res) => {
    try {
        const interviews = await InterviewInsight.findAll({
            where: { organizationID: req.ORGID },
            include: [
                { model: Applicant, attributes: ["firstname", "lastname", "email"] },
                { model: Employee, as: "interviewer", attributes: ["firstname", "lastname", "email"] }
            ]
        });

        return res.status(200).json({ success: true, message: "All interview records found successfully", data: interviews });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};

// Get single interview by ID
export const HandleInterview = async (req, res) => {
    try {
        const { interviewID } = req.params;

        const interview = await InterviewInsight.findOne({
            where: { id: interviewID, organizationID: req.ORGID },
            include: [
                { model: Applicant, attributes: ["firstname", "lastname", "email"] },
                { model: Employee, as: "interviewer", attributes: ["firstname", "lastname", "email"] }
            ]
        });

        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview Record not found" });
        }

        return res.status(200).json({ success: true, message: "Interview Record retrieved successfully", data: interview });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};

// Update interview
export const HandleUpdateInterview = async (req, res) => {
    try {
        const { interviewID, UpdatedData } = req.body;

        const interview = await InterviewInsight.findByPk(interviewID);

        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview Record not found" });
        }

        const updatedInterview = await interview.update(UpdatedData);

        return res.status(200).json({ success: true, message: "Interview Record updated successfully", data: updatedInterview });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};

// Delete interview
export const HandleDeleteInterview = async (req, res) => {
    try {
        const { interviewID } = req.params;

        const interview = await InterviewInsight.findByPk(interviewID);

        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview Record not found" });
        }

        await interview.destroy();

        return res.status(200).json({ success: true, message: "Interview Record deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};
