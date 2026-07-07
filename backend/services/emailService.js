const SibApiV3Sdk = require("@getbrevo/brevo");

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.BREVO_API_KEY) {
    console.log("BREVO_API_KEY is missing.");
    return { skipped: true };
  }

  try {
    const sendSmtpEmail = {
      sender: {
        name: "Leave Management System",
        email: process.env.EMAIL_FROM,
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      htmlContent: html,
    };

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Email sent successfully.", result);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Brevo API Error:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  sendEmail,
};