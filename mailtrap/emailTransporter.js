// emailTransporter.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const EmailClient = nodemailer.createTransport({
  service: "gmail", // Tell Nodemailer to use Gmail settings
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // must be App Password (NOT Gmail login password!)
  },
});

// Sender details
export const sender = {
  name: "HRMS",
  email: process.env.EMAIL_FROM,
};
