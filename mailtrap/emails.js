// email.js
import { 
  VERIFICATION_EMAIL_TEMPLATE, 
  PASSWORD_RESET_REQUEST_TEMPLATE, 
  PASSWORD_RESET_SUCCESS_TEMPLATE 
} from "./emailtemplates.js";

import { EmailClient, sender } from "./emailTransporter.js";

// ===============================
// SEND VERIFICATION EMAIL
// ===============================
export const SendVerificationEmail = async (email, verificationCode) => {
  try {
    const info = await EmailClient.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationCode),
    });

    console.log("Verification Email Sent:", info.messageId);

    return {
      success: true,
      status: true,
      info
    };

  } catch (error) {
    console.error("Error Sending Verification Email:", error.message);

    return {
      success: false,
      status: false,
      error: error.message
    };
  }
};

// ===============================
// SEND WELCOME EMAIL
// ===============================
export const SendWelcomeEmail = async (email, firstname, lastname, role) => {
  const template =
    role === "HR-Admin"
      ? `<h2>Welcome HR ${firstname} ${lastname}</h2><p>You have been added to the EMS system.</p>`
      : `<h2>Welcome ${firstname} ${lastname}</h2><p>Your EMS account is created.</p>`;

  try {
    const info = await EmailClient.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "Welcome to EMS",
      html: template,
    });

    console.log("Welcome Email Sent:", info.messageId);

    return {
      success: true,
      status: true,
      info
    };

  } catch (error) {
    console.error("Error Sending Welcome Email:", error.message);

    return {
      success: false,
      status: false,
      error: error.message
    };
  }
};

// ===============================
// SEND FORGOT PASSWORD EMAIL
// ===============================
export const SendForgotPasswordEmail = async (email, resetURL) => {
  try {
    const info = await EmailClient.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "Reset Your Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    });

    console.log("Forgot Password Email Sent:", info.messageId);

    return {
      success: true,
      status: true,
      info
    };

  } catch (error) {
    console.error("Error Sending Forgot Password Email:", error.message);

    return {
      success: false,
      status: false,
      error: error.message
    };
  }
};

// ===============================
// SEND PASSWORD RESET CONFIRMATION
// ===============================
export const SendResetPasswordConfirmation = async (email) => {
  try {
    const info = await EmailClient.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });

    console.log("Reset Password Confirmation Sent:", info.messageId);

    return {
      success: true,
      status: true,
      info
    };

  } catch (error) {
    console.error("Error Sending Reset Password Confirmation Email:", error.message);

    return {
      success: false,
      status: false,
      error: error.message
    };
  }
};
