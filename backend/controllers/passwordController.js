const crypto = require("crypto");
const { getAuth } = require("firebase-admin/auth");
const { db } = require("../config/firebase");

const { sendEmail } = require("../services/emailService");
const {
  passwordResetEmailTemplate,
} = require("../templates/passwordResetEmail");

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await getAuth().getUserByEmail(email);

    const profileDoc = await db
      .collection("users")
      .doc(user.uid)
      .get();

    if (!profileDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profile = profileDoc.data();

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = Date.now() + 30 * 60 * 1000;

    await db.collection("passwordResetTokens").doc(token).set({
      uid: user.uid,
      email,
      token,
      used: false,
      expiresAt,
      createdAt: new Date(),
    });

    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await sendEmail({
      to: email,
      subject: "Reset your LeaveFlow password",
      html: passwordResetEmailTemplate({
        name: profile.name,
        resetLink,
      }),
    });

    res.json({
      success: true,
      message: "Password reset email sent.",
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {

    const { token, password } = req.body;

    const tokenDoc = await db
      .collection("passwordResetTokens")
      .doc(token)
      .get();

    if (!tokenDoc.exists) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset link.",
      });
    }

    const data = tokenDoc.data();

    if (data.used) {
      return res.status(400).json({
        success: false,
        message: "This reset link has already been used.",
      });
    }

    if (Date.now() > data.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "Reset link expired.",
      });
    }

    await getAuth().updateUser(data.uid, {
      password,
    });

    await tokenDoc.ref.update({
      used: true,
      usedAt: new Date(),
    });

    res.json({
      success: true,
      message: "Password updated successfully.",
    });

  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message,
    });

  }
};

module.exports = {
  requestPasswordReset,
  resetPassword,
};