import { EmailClient, sender } from "./emailTransporter.js";
async function test() {
  try {
    const info = await EmailClient.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: "habtamukassa4339@gmail.com",  // test sending to yourself
      subject: "Test Email from EMS",
      text: "This is a test email from EMS backend.",
    });

    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

test();