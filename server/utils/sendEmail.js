import config from "config";
import nodemailer from "nodemailer";

const userEmail = config.get("EMAIL");
const PASS = config.get("PASS");

async function sendEmail(emailData) {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: userEmail,
        pass: PASS,
      },
    });
    let info = await transporter.sendMail({
      from: `"INCORRECT "<${userEmail}`,
      subject: emailData.subject,
      to: emailData.to,
      html: emailData.html,
      text: emailData.text,
    });
    console.log("email sent success", info.messageId);
  } catch (error) {
    console.log(error);
  }
}
export default sendEmail;