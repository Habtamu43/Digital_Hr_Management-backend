// emailTransporter.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const EmailClient = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ADD THIS: Verify the connection configuration
EmailClient.verify(function (error, success) {
  if (error) {
    console.error("❌ Email Transporter Error:", error);
  } else {
    console.log("✅ Email Server is ready to take messages");
  }
});

export const sender = {
  name: "HRMS",
  email: process.env.EMAIL_FROM || process.env.EMAIL_USER,
};