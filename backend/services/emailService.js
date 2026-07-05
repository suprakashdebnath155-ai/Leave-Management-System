const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("Email skipped: EMAIL_USER or EMAIL_PASS is missing.");
    return { skipped: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Leave Management System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully:", info.messageId);

    return { skipped: false };
  } catch (error) {
    console.error("Email failed:", error.message);
    throw error;
  }
};

module.exports = {
  sendEmail,
};