// Import templates and config using ES module syntax
import { 
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE
} from "./emailtemplates.js";

import { Emailclient, sender } from "./mailtrap.config.js";

// Send verification email
export const SendVerificationEmail = async (email, verificationcode) => {
  const receiver = [{ email }];
  try {
    const response = await Emailclient.send({
      from: sender,
      to: receiver,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationcode),
      category: "Email verification"
    });
    return response.success;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

// Send welcome email
export const SendWelcomeEmail = async (email, firstname, lastname, role) => {
  const receiver = [{ email }];
  const templateData = role === "HR-Admin" 
    ? {
        template_uuid: "4749eba4-dc99-4658-923e-54ccd0c0b99c",
        template_variables: {
          company_info_name: "Your Company Name - [EMS]",
          name: `${firstname} ${lastname} - HR`
        }
      }
    : {
        template_uuid: "cf9f23f4-ebfb-4baa-a69e-bcb76487ac24",
        template_variables: {
          company_info_name: "Company Name - (EMS)",
          name: `${firstname} ${lastname}`
        }
      };

  try {
    const response = await Emailclient.send({
      from: sender,
      to: receiver,
      ...templateData
    });
    return response.success;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

// Send forgot password email
export const SendForgotPasswordEmail = async (email, resetURL) => {
  const receiver = [{ email }];
  try {
    const response = await Emailclient.send({
      from: sender,
      to: receiver,
      subject: "Reset Your Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset Email"
    });
    return response.success;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

// Send reset password confirmation email
export const SendResetPasswordConfimation = async (email) => {
  const receiver = [{ email }];
  try {
    const response = await Emailclient.send({
      from: sender,
      to: receiver,
      subject: "Password Reset Successfully",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset Confirmation"
    });
    return response.success;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
