
import db from "../config/db.js";

const { Department , HumanResources,  Organization } =db


// ================== Get All HR ==================
export const HandleAllHR = async (req, res) => {
    try {
        const HR = await HumanResources.findAll({
            where: { organizationId: req.organizationId },
            include: [
                { model: Department, attributes: ["name"] }
            ]
        });

        return res.status(200).json({ success: true, message: "All Human Resources Found Successfully", data: HR });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};

// ================== Get Single HR ==================
export const HandleHR = async (req, res) => {
    try {
        const { HRID } = req.params;
        const HR = await HumanResources.findOne({
            where: { id: HRID, organizationId: req.organizationId },
            include: [{ model: Department, attributes: ["name"] }]
        });

        if (!HR) {
            return res.status(404).json({ success: false, message: "HR Record Not Found" });
        }

        return res.status(200).json({ success: true, message: "Human Resources Found Successfully", data: HR });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};

// ================== Update HR ==================
export const HandleUpdateHR = async (req, res) => {
    try {
        const { HRID, Updatedata } = req.body;

        if (!HRID || !Updatedata) {
            return res.status(400).json({ success: false, message: "Missing HRID or Updatedata" });
        }

        const updatedHR = await HumanResources.findByPk(HRID);

        if (!updatedHR || updatedHR.organizationId !== req.organizationId) {
            return res.status(404).json({ success: false, message: "HR Record Not Found" });
        }

        await updatedHR.update(Updatedata);

        return res.status(200).json({ success: true, message: "Human Resources Updated Successfully", data: updatedHR });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};

// ================== Delete HR ==================
export const HandleDeleteHR = async (req, res) => {
    try {
        const { HRID } = req.params;

        const HR = await HumanResources.findOne({ where: { id: HRID, organizationId: req.organizationId } });

        if (!HR) {
            return res.status(404).json({ success: false, message: "HR Record Not Found" });
        }

        // Remove HR from Department if assigned
        if (HR.departmentId) {
            const department = await Department.findByPk(HR.departmentId);
            if (department) {
                await department.removeHumanResource(HR); // Sequelize association
            }
        }

        // Remove HR from Organization
        const organization = await Organization.findByPk(req.organizationId);
        if (organization) {
            await organization.removeHR(HR); // Sequelize association
        }

        await HR.destroy();

        return res.status(200).json({ success: true, message: "Human Resources Deleted Successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};
