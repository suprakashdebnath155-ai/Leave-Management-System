const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({
  to,
  subject,
  html,
}) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return { skipped: true };
  }

  await transporter.sendMail({
    from: `"Leave Management System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  return { skipped: false };
};

module.exports = {
  sendEmail,
};
