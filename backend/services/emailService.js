const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.BREVO_API_KEY) {
    console.log("BREVO_API_KEY is missing.");
    return { skipped: true };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
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
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Brevo API Error:", result);

      return {
        success: false,
        error: result,
      };
    }

    console.log("Email sent successfully:", result);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Brevo Fetch Error:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  sendEmail,
};