// mailtrap.config.js

import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

// Read your Mailtrap API token from .env
const TOKEN = process.env.MAILTRAP_TOKEN;

// Create the Mailtrap client
export const Emailclient = new MailtrapClient({
  token: TOKEN,
});

// Default sender information
export const sender = {
  email: "hello@demomailtrap.com", // Mailtrap Sandbox address
  name: "Mailtrap Test",
};
