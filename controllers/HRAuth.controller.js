import db from "../config/db.js";
const { HumanResources, Organization } = db;

import bcrypt from "bcrypt";
import crypto from "crypto";
import { Op } from "sequelize";

import { GenerateJwtTokenAndSetCookiesHR } from "../utils/generatejwttokenandsetcookies.js";
import {
  SendVerificationEmail,
  SendWelcomeEmail,
  SendForgotPasswordEmail,
  SendResetPasswordConfirmation,
} from "../mailtrap/emails.js";
import { GenerateVerificationToken } from "../utils/generateverificationtoken.js";

// ===============================
// HR SIGNUP
// ===============================
export const HandleHRSignup = async (req, res) => {
  try {
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

    let existingHR = await HumanResources.findOne({ where: { email } });

    if (existingHR) {
      if (!existingHR.isverified) {
        // Account exists but not verified → resend verification
        existingHR.verificationotp = GenerateVerificationToken(6);
        existingHR.verificationotpexpires = new Date(Date.now() + 5 * 60 * 1000);
        await existingHR.save();

        const status = await SendVerificationEmail(email, existingHR.verificationotp);

        return res.status(200).json({
          success: true,
          message:
            "Account exists but not verified. New verification code sent.",
          VerificationEmailStatus: status,
          type: "signup-resend",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Email already registered. Please login.",
        type: "signup",
      });
    }

    let organization = await Organization.findOne({
      where: { name, organizationURL, organizationMail },
    });
    const transaction = await db.sequelize.transaction();

    try {
      let organizationId = organization ? organization.id : null;

      if (!organization) {
        const newOrg = await Organization.create(
          { name, description, organizationURL, organizationMail },
          { transaction }
        );
        organizationId = newOrg.id;
      }

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
          organizationID: organizationId,
          verificationotp: verificationcode,
          verificationotpexpires: new Date(Date.now() + 5 * 60 * 1000),
          isverified: false,
        },
        { transaction }
      );

      await transaction.commit();

      // Send JWT cookie (optional before verification)
      GenerateJwtTokenAndSetCookiesHR(res, newHR.id, newHR.role, organizationId);

      const VerificationEmailStatus = await SendVerificationEmail(
        email,
        verificationcode
      );

      return res.status(201).json({
        success: true,
        message: organization
          ? "HR Registered Successfully"
          : "Organization & HR Created Successfully",
        VerificationEmailStatus,
        type: "signup",
        HRid: newHR.id,
      });
    } catch (innerErr) {
      if (transaction && !transaction.finished) await transaction.rollback();
      console.error("Transaction error:", innerErr);
      return res.status(500).json({
        success: false,
        message: innerErr.message || "Error during signup",
        type: "signup",
      });
    }
  } catch (error) {
    console.error("HandleHRSignup error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message, type: "signup" });
  }
};

// ===============================
// HR VERIFY EMAIL
// ===============================
export const HandleHRVerifyEmail = async (req, res) => {
  const verificationcode =
    req.body.otp || req.body.verificationcode || req.body.code;

  if (!verificationcode) {
    return res.status(400).json({
      success: false,
      message: "Verification code is required",
      type: "HRverifyemail",
    });
  }

  try {
    const HR = await HumanResources.findOne({
      where: {
        verificationotp: verificationcode,
        verificationotpexpires: { [Op.gt]: new Date() },
      },
    });

    if (!HR)
      return res.status(401).json({
        success: false,
        message: "Invalid or Expired Verification Code",
        type: "HRverifyemail",
      });

    HR.isverified = true;
    HR.verificationotp = null;
    HR.verificationotpexpires = null;
    await HR.save();

    return res.status(200).json({
      success: true,
      message: "Email Verified successfully",
      type: "HRverifyemail",
    });
  } catch (error) {
    console.error("HandleHRVerifyEmail error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
      type: "HRverifyemail",
    });
  }
};

// ===============================
// HR LOGIN
// ===============================
export const HandleHRLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const HR = await HumanResources.findOne({ where: { email } });
    if (!HR)
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
        type: "HRLogin",
      });

    if (!HR.isverified)
      return res.status(401).json({
        success: false,
        message: "Email not verified",
        type: "HRLogin",
      });

    const isMatch = await bcrypt.compare(password, HR.password);
    if (!isMatch)
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
        type: "HRLogin",
      });

    GenerateJwtTokenAndSetCookiesHR(res, HR.id, HR.role, HR.organizationID);
    HR.lastlogin = new Date();
    await HR.save();

    return res.status(200).json({
      success: true,
      message: "HR Login Successful",
      type: "HRLogin",
    });
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

// ===============================
// HR LOGOUT
// ===============================
export const HandleHRLogout = async (req, res) => {
  try {
    res.clearCookie("HRtoken");
    return res
      .status(200)
      .json({ success: true, message: "HR Logged Out Successfully" });
  } catch (error) {
    console.error("HandleHRLogout error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error });
  }
};

// ===============================
// HR CHECK (SESSION)
// ===============================
export const HandleHRCheck = async (req, res) => {
  try {
    const HR = await HumanResources.findOne({
      where: { id: req.HRid, organizationID: req.ORGID },
    });
    if (!HR)
      return res.status(404).json({ success: false, message: "HR not found", type: "checkHR" });

    return res.status(200).json({
      success: true,
      message: "HR Already Logged In",
      type: "checkHR",
    });
  } catch (error) {
    console.error("HandleHRCheck error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal error",
      error,
      type: "checkHR",
    });
  }
};

// ===============================
// HR FORGOT PASSWORD
// ===============================
export const HandleHRForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const HR = await HumanResources.findOne({ where: { email } });
    if (!HR)
      return res.status(404).json({
        success: false,
        message: "HR Email Does Not Exist",
        type: "HRforgotpassword",
      });

    const resetToken = crypto.randomBytes(25).toString("hex");
    HR.resetpasswordtoken = resetToken;
    HR.resetpasswordexpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await HR.save();

    const URL = `${process.env.CLIENT_URL}/auth/HR/resetpassword/${resetToken}`;
    const SendResetPasswordEmailStatus = await SendForgotPasswordEmail(
      email,
      URL
    );

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

// ===============================
// HR RESET PASSWORD
// ===============================
export const HandleHRResetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    if (req.cookies?.HRtoken) res.clearCookie("HRtoken");

    const HR = await HumanResources.findOne({
      where: {
        resetpasswordtoken: token,
        resetpasswordexpires: { [Op.gt]: new Date() },
      },
    });

    if (!HR)
      return res.status(401).json({
        success: false,
        message: "Invalid or Expired Reset Password Token",
        resetpassword: false,
      });

    HR.password = await bcrypt.hash(password, 10);
    HR.resetpasswordtoken = null;
    HR.resetpasswordexpires = null;
    await HR.save();

    const SendPasswordResetEmailStatus = await SendResetPasswordConfirmation(
      HR.email
    );

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

// ===============================
// HR RESEND VERIFICATION EMAIL
// ===============================
export const HandleHRResendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const HR = await HumanResources.findOne({ where: { email } });

    if (!HR)
      return res.status(404).json({
        success: false,
        message: "HR Email Does Not Exist",
        type: "HRResendVerifyEmail",
      });
    if (HR.isverified)
      return res.status(400).json({
        success: false,
        message: "HR Email is already Verified",
        type: "HRResendVerifyEmail",
      });

    HR.verificationotp = GenerateVerificationToken(6);
    HR.verificationotpexpires = new Date(Date.now() + 5 * 60 * 1000);
    await HR.save();

    const status = await SendVerificationEmail(email, HR.verificationotp);
    return res.status(200).json({
      success: true,
      message: "Verification Email Sent Successfully",
      VerificationEmailStatus: status,
      type: "HRResendVerifyEmail",
    });
  } catch (error) {
    console.error("HandleHRResendVerificationEmail error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error });
  }
};

// ===============================
// HR CHECK VERIFICATION STATUS
// ===============================
export const HandleHRCheckVerifyEmail = async (req, res) => {
  try {
    const HR = await HumanResources.findOne({
      where: { id: req.HRid, organizationID: req.ORGID },
    });
    if (!HR)
      return res.status(404).json({
        success: false,
        message: "HR not found",
        type: "HRcodeavailable",
      });

    if (HR.isverified)
      return res.status(200).json({
        success: true,
        message: "HR Already Verified",
        type: "HRcodeavailable",
        alreadyverified: true,
      });

    if (HR.verificationotp && HR.verificationotpexpires > new Date())
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
    console.error("HandleHRCheckVerifyEmail error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
      type: "HRcodeavailable",
    });
  }
};
