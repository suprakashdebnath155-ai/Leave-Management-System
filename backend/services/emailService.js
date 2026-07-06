const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,
  debug: true,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP VERIFY ERROR");
    console.error(error);
  } else {
    console.log("SMTP READY");
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"LeaveFlow" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });

    console.log(info);

    return info;
  } catch (err) {
    console.error("SENDMAIL ERROR");
    console.error(err);
    return null;
  }
};

module.exports = { sendEmail };