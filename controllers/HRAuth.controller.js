// controllers/hrController.js
import db from "../config/db.js";
const { HumanResources, Organization } = db;

import bcrypt from "bcrypt";
import crypto from "crypto";
import { Op } from "sequelize";

import { GenerateJwtTokenAndSetCookiesHR } from "../utils/generatejwttokenandsetcookies.js"; // adjust path if needed
import {
  SendVerificationEmail,
  SendWelcomeEmail,
  SendForgotPasswordEmail,
  SendResetPasswordConfimation,
} from "../mailtrap/emails.js";
import { GenerateVerificationToken } from "../utils/generateverificationtoken.js";

// HR Signup
// HR Signup
export const HandleHRSignup = async (req, res) => {
  try {
    console.log("🔥 CONTROLLER HIT");
    console.log("REQ BODY:", typeof req.body);

    const {
      firstname,
      lastname,
      email,
      password,
      contactnumber,
      name,
      description,
      organizationURL,
      organizationMail,
    } = req.body;

    // validate required fields
    if (
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      !contactnumber ||
      !name ||
      !description ||
      !organizationURL ||
      !organizationMail
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        type: "signup",
      });
    }

    // check if HR already exists by email
    const existingHR = await HumanResources.findOne({ where: { email } });
    if (existingHR) {
      return res.status(400).json({
        success: false,
        message:
          "HR already exists, please go to the login page or create new HR",
        type: "signup",
      });
    }

    // check organization
    const organization = await Organization.findOne({
      where: {
        name,
        organizationURL,
        organizationMail,
      },
    });


  
    // Transaction
    const sequelize = db.sequelize;
    const transaction = await sequelize.transaction();

    try {
      // CASE 1: Create organization & HR
      if (!organization) {
        const newOrganization = await Organization.create(
          {
            name,
            description,
            organizationURL,
            organizationMail,
          },
          { transaction }
        );

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationcode = GenerateVerificationToken(6);

        const newHR = await HumanResources.create(
          {
            firstname,
            lastname,
            email,
            password: hashedPassword,
            contactnumber,
            role: "HR-Admin",
            organizationID: newOrganization.id,
            verificationtoken: verificationcode,
            verificationtokenexpires: Date.now() + 5 * 60 * 1000,
          },
          { transaction }
        );

        await transaction.commit();

        GenerateJwtTokenAndSetCookiesHR(
          res,
          newHR.id,
          newHR.role,
          newOrganization.id
        );

        const VerificationEmailStatus = await SendVerificationEmail(
          email,
          verificationcode
        );

        return res.status(201).json({
          success: true,
          message:
            "Organization Created Successfully & HR Registered Successfully",
          VerificationEmailStatus,
          type: "signup",
          HRid: newHR.id,
        });
      }

      // CASE 2: Register HR under existing organization
      if (organization) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationcode = GenerateVerificationToken(6);

        const newHR = await HumanResources.create(
          {
            firstname,
            lastname,
            email,
            password: hashedPassword,
            contactnumber,
            role: "HR-Admin",
            organizationID: organization.id,
            verificationtoken: verificationcode,
            verificationtokenexpires: Date.now() + 5 * 60 * 1000,
          },
          { transaction }
        );

        await transaction.commit();

        GenerateJwtTokenAndSetCookiesHR(
          res,
          newHR.id,
          newHR.role,
          organization.id
        );

        const VerificationEmailStatus = await SendVerificationEmail(
          email,
          verificationcode
        );

        return res.status(201).json({
          success: true,
          message: "HR Registered Successfully",
          VerificationEmailStatus,
          type: "signup",
          HRid: newHR.id,
        });
      }

    } catch (innerErr) {
      if (transaction && !transaction.finished)
        await transaction.rollback();

      console.error("Transaction error:", innerErr);
      return res.status(500).json({
        success: false,
        message: innerErr.message || "Error during signup",
        type: "signup",
      });
    }

  } catch (error) {
    console.error("HandleHRSignup error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
      type: "signup",
    });
  }
};

// HR Verify Email
export const HandleHRVerifyEmail = async (req, res) => {
  const { verificationcode } = req.body;
  try {
    const HR = await HumanResources.findOne({
      where: {
        verificationtoken: verificationcode,
        organizationID: req.ORGID,
        verificationtokenexpires: { [Op.gt]: Date.now() },
      },
    });

    if (!HR) {
      return res.status(401).json({
        success: false,
        message: "Invalid or Expired Verification Code",
        type: "HRverifyemail",
      });
    }

    HR.isverified = true;
    HR.verificationtoken = null;
    HR.verificationtokenexpires = null;
    await HR.save();

    const SendWelcomeEmailStatus = await SendWelcomeEmail(
      HR.email,
      HR.firstname,
      HR.lastname,
      HR.role
    );

    return res.status(200).json({
      success: true,
      message: "Email Verified successfully",
      SendWelcomeEmailStatus,
      type: "HRverifyemail",
    });
  } catch (error) {
    console.error("HandleHRVerifyEmail error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message, type: "HRverifyemail" });
  }
};

// HR Login
export const HandleHRLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const HR = await HumanResources.findOne({ where: { email } });

    if (!HR) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials, Please Add Correct One",
        type: "HRLogin",
      });
    }

    const isMatch = await bcrypt.compare(password, HR.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials, Please Add Correct One",
        type: "HRLogin",
      });
    }

    GenerateJwtTokenAndSetCookiesHR(res, HR.id, HR.role, HR.organizationID);
    HR.lastlogin = new Date();
    await HR.save();

    return res.status(200).json({ success: true, message: "HR Login Successful", type: "HRLogin" });
  } catch (error) {
    console.error("HandleHRLogin error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
      type: "HRLogin",
    });
  }
};

// HR Logout
export const HandleHRLogout = async (req, res) => {
  try {
    res.clearCookie("HRtoken");
    return res.status(200).json({ success: true, message: "HR Logged Out Successfully" });
  } catch (error) {
    console.error("HandleHRLogout error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error });
  }
};

// HR Check
export const HandleHRCheck = async (req, res) => {
  try {
    const HR = await HumanResources.findOne({
      where: { id: req.HRid, organizationID: req.ORGID },
    });
    if (!HR) {
      return res.status(404).json({ success: false, message: "HR not found", type: "checkHR" });
    }
    return res.status(200).json({ success: true, message: "HR Already Logged In", type: "checkHR" });
  } catch (error) {
    console.error("HandleHRCheck error:", error);
    return res.status(500).json({ success: false, error, message: "Internal error", type: "checkHR" });
  }
};

// HR Forgot Password
export const HandleHRForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const HR = await HumanResources.findOne({
      where: { email, organizationID: req.ORGID, id: req.HRid },
    });

    if (!HR) {
      return res.status(404).json({
        success: false,
        message: "HR Email Does Not Exist Please Enter Correct One",
        type: "HRforgotpassword",
      });
    }

    const resetToken = crypto.randomBytes(25).toString("hex");
    const resetTokenExpires = Date.now() + 1000 * 60 * 60; // 1 hour

    HR.resetpasswordtoken = resetToken;
    HR.resetpasswordexpires = resetTokenExpires;
    await HR.save();

    const URL = `${process.env.CLIENT_URL}/auth/HR/resetpassword/${resetToken}`;
    const SendResetPasswordEmailStatus = await SendForgotPasswordEmail(email, URL);

    return res.status(200).json({
      success: true,
      message: "Reset Password Email Sent Successfully",
      SendResetPasswordEmailStatus,
      type: "HRforgotpassword",
    });
  } catch (error) {
    console.error("HandleHRForgotPassword error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
      type: "HRforgotpassword",
    });
  }
};

// HR Reset Password
export const HandleHRResetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    if (req.cookies?.HRtoken) res.clearCookie("HRtoken");

    const HR = await HumanResources.findOne({
      where: { resetpasswordtoken: token, resetpasswordexpires: { [Op.gt]: Date.now() } },
    });
    if (!HR) {
      return res.status(401).json({
        success: false,
        message: "Invalid or Expired Reset Password Token",
        resetpassword: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    HR.password = hashedPassword;
    HR.resetpasswordtoken = null;
    HR.resetpasswordexpires = null;
    await HR.save();

    const SendPasswordResetEmailStatus = await SendResetPasswordConfimation(HR.email);
    return res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
      SendPasswordResetEmailStatus,
      resetpassword: true,
    });
  } catch (error) {
    console.error("HandleHRResetPassword error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
      resetpassword: false,
    });
  }
};

// HR Resend Verification Email
export const HandleHRResetverifyEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const HR = await HumanResources.findOne({
      where: { email, id: req.HRid, organizationID: req.ORGID },
    });

    if (!HR)
      return res.status(404).json({
        success: false,
        message: "HR Email Does Not Exist, Please Enter Correct Email",
        type: "HRResendVerifyEmail",
      });
    if (HR.isverified)
      return res.status(400).json({
        success: false,
        message: "HR Email is already Verified",
        type: "HRResendVerifyEmail",
      });

    const verificationcode = GenerateVerificationToken(6);
    HR.verificationtoken = verificationcode;
    HR.verificationtokenexpires = Date.now() + 5 * 60 * 1000;
    await HR.save();

    const SendVerificationEmailStatus = await SendVerificationEmail(email, verificationcode);
    return res.status(200).json({
      success: true,
      message: "Verification Email Sent Successfully",
      SendVerificationEmailStatus,
      type: "HRResendVerifyEmail",
    });
  } catch (error) {
    console.error("HandleHRResetverifyEmail error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error });
  }
};

// HR Check Verification Status
export const HandleHRcheckVerifyEmail = async (req, res) => {
  try {
    const HR = await HumanResources.findOne({
      where: { id: req.HRid, organizationID: req.ORGID },
    });

    if (!HR) {
      return res.status(404).json({
        success: false,
        message: "HR not found",
        type: "HRcodeavailable",
      });
    }

    if (HR.isverified)
      return res.status(200).json({
        success: true,
        message: "HR Already Verified",
        type: "HRcodeavailable",
        alreadyverified: true,
      });

    if (HR.verificationtoken && HR.verificationtokenexpires > Date.now())
      return res.status(200).json({
        success: true,
        message: "Verification Code is Still Valid",
        type: "HRcodeavailable",
      });

    return res.status(404).json({
      success: false,
      message: "Invalid or Expired Verification Code",
      type: "HRcodeavailable",
    });
  } catch (error) {
    console.error("HandleHRcheckVerifyEmail error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
      type: "HRcodeavailable",
    });
  }
};
