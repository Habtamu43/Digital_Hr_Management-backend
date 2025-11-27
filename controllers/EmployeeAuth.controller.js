import bcrypt from "bcrypt";
import  crypto from "crypto";
import db from '../models/index.js';
const { Employee , Organization } =db


console.log('Found!');
import  { GenerateVerificationToken } from "../utils/generateverificationtoken.js";
import { 
    SendVerificationEmail, 
    SendWelcomeEmail, 
    SendForgotPasswordEmail, 
    SendResetPasswordConfimation 
} from "../mailtrap/emails.js";
import { GenerateJwtTokenAndSetCookiesEmployee } from "../utils/generatejwttokenandsetcookies.js";
import { Op } from "sequelize";

// ================== Employee Signup ==================
export const HandleEmployeeSignup = async (req, res) => {
    const { firstname, lastname, email, password, contactnumber } = req.body;

    try {
        if (!firstname || !lastname || !email || !password || !contactnumber) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const organization = await Organization.findByPk(req.ORGID);
        if (!organization) {
            return res.status(404).json({ success: false, message: "Organization not found" });
        }

        const existingEmployee = await Employee.findOne({ where: { email } });
        if (existingEmployee) {
            return res.status(400).json({ success: false, message: "Employee already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationcode = GenerateVerificationToken(6);

        const newEmployee = await Employee.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            contactnumber,
            role: "Employee",
            verificationtoken: verificationcode,
            verificationtokenexpires: new Date(Date.now() + 5 * 60 * 1000),
            organizationId: organization.id
        });

        // Optional: associate employee with organization (if association exists in Sequelize)
        if (organization.addEmployee) {
            await organization.addEmployee(newEmployee);
        }

        await SendVerificationEmail(email, verificationcode);

        return res.status(201).json({
            success: true,
            message: "Employee registered successfully. Verification email sent.",
            email: newEmployee.email
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};

// ================== Employee Verify Email ==================
export const HandleEmployeeVerifyEmail = async (req, res) => {
    const { verificationcode } = req.body;

    try {
        const employee = await Employee.findOne({
            where: {
                verificationtoken: verificationcode,
                verificationtokenexpires: { [Op.gt]: new Date() },
                organizationId: req.ORGID
            }
        });

        if (!employee) {
            return res.status(404).json({ success: false, message: "Invalid or expired verification code" });
        }

        employee.isverified = true;
        employee.verificationtoken = null;
        employee.verificationtokenexpires = null;
        await employee.save();

        await SendWelcomeEmail(employee.email, employee.firstname, employee.lastname);

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
            email: employee.email
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};

// ================== Resend Verification Email ==================
export const HandleResetEmployeeVerifyEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const employee = await Employee.findOne({ where: { email } });
        if (!employee) return res.status(404).json({ success: false, message: "Employee email does not exist" });
        if (employee.isverified) return res.status(400).json({ success: false, message: "Email already verified" });

        const verificationcode = GenerateVerificationToken(6);
        employee.verificationtoken = verificationcode;
        employee.verificationtokenexpires = new Date(Date.now() + 5 * 60 * 1000);
        await employee.save();

        await SendVerificationEmail(email, verificationcode);

        return res.status(200).json({ success: true, message: "Verification email sent" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};

// ================== Employee Login ==================
export const HandleEmployeeLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const employee = await Employee.findOne({ where: { email } });
        if (!employee) return res.status(401).json({ success: false, message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

        GenerateJwtTokenAndSetCookiesEmployee(res, employee.id, employee.role, employee.organizationId);
        employee.lastlogin = new Date();
        await employee.save();

        return res.status(200).json({ success: true, message: "Login successful" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};

// ================== Check Employee Login ==================
export const HandleEmployeeCheck = async (req, res) => {
    try {
        const employee = await Employee.findOne({ where: { id: req.EMid, organizationId: req.ORGID } });
        if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });

        return res.status(200).json({ success: true, message: "Employee is logged in" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};

// ================== Employee Logout ==================
export const HandleEmployeeLogout = async (req, res) => {
    try {
        res.clearCookie("EMtoken");
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};

// ================== Forgot Password ==================
export const HandleEmployeeForgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const employee = await Employee.findOne({ where: { email, organizationId: req.ORGID } });
        if (!employee) return res.status(404).json({ success: false, message: "Email not found" });

        const resetToken = crypto.randomBytes(25).toString("hex");
        employee.resetpasswordtoken = resetToken;
        employee.resetpasswordexpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
        await employee.save();

        const URL = `${process.env.CLIENT_URL}/auth/employee/resetpassword/${resetToken}`;
        await SendForgotPasswordEmail(email, URL);

        return res.status(200).json({ success: true, message: "Reset password email sent" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};

// ================== Reset Password ==================
export const HandleEmployeeSetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        if (req.cookies.EMtoken) res.clearCookie("EMtoken");

        const employee = await Employee.findOne({
            where: {
                resetpasswordtoken: token,
                resetpasswordexpires: { [Op.gt]: new Date() }
            }
        });

        if (!employee) return res.status(404).json({ success: false, message: "Invalid or expired token" });

        employee.password = await bcrypt.hash(password, 10);
        employee.resetpasswordtoken = null;
        employee.resetpasswordexpires = null;
        await employee.save();

        await SendResetPasswordConfimation(employee.email);

        return res.status(200).json({ success: true, message: "Password reset successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};

// ================== Check Email Verification ==================
export const HandleEmployeeCheckVerifyEmail = async (req, res) => {
    try {
        const employee = await Employee.findOne({ where: { id: req.EMid, organizationId: req.ORGID } });
        if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });

        if (employee.isverified) return res.status(200).json({ success: true, message: "Employee already verified" });
        if (employee.verificationtoken && employee.verificationtokenexpires > new Date())
            return res.status(200).json({ success: true, message: "Verification code is still valid" });

        return res.status(400).json({ success: false, message: "Invalid or expired verification code" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};
