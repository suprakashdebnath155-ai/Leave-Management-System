require("dotenv").config();

const { getAuth } = require("firebase-admin/auth");
const { db } = require("../config/firebase");

const createInitialAdmin = async () => {
  try {
    console.log("🔍 Checking for an existing administrator...");

    // Check whether an admin profile already exists in Firestore
    const adminSnapshot = await db
      .collection("users")
      .where("role", "==", "admin")
      .limit(1)
      .get();

    if (!adminSnapshot.empty) {
      const existingAdmin = adminSnapshot.docs[0].data();

      console.log(
        `ℹ️ An administrator already exists: ${existingAdmin.email || "Unknown email"}`
      );

      console.log("No new administrator was created.");
      process.exit(0);
    }

    // Read initial admin credentials from environment variables
    const name = process.env.INITIAL_ADMIN_NAME;
    const email = process.env.INITIAL_ADMIN_EMAIL;
    const password = process.env.INITIAL_ADMIN_PASSWORD;

    if (!name || !email || !password) {
      throw new Error(
        "Missing INITIAL_ADMIN_NAME, INITIAL_ADMIN_EMAIL, or INITIAL_ADMIN_PASSWORD in environment variables."
      );
    }

    if (password.length < 8) {
      throw new Error(
        "INITIAL_ADMIN_PASSWORD must contain at least 8 characters."
      );
    }

    console.log("👤 No administrator found. Creating initial administrator...");

    const auth = getAuth();

    let userRecord;

    try {
      // Try to find an existing Firebase Authentication account
      userRecord = await auth.getUserByEmail(email);

      console.log(
        "ℹ️ Firebase Authentication account already exists. Checking Firestore profile..."
      );
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        // Create Firebase Authentication account
        userRecord = await auth.createUser({
          email,
          password,
          displayName: name,
          emailVerified: false,
        });

        console.log("✅ Firebase Authentication account created.");
      } else {
        throw error;
      }
    }

    // Create or repair the Firestore admin profile
    const adminProfile = {
      uid: userRecord.uid,
      name,
      email,
      role: "admin",
      department: "Administration",
      jobMode: "Regular",
      dateOfJoining: new Date().toISOString().slice(0, 10),
      designation: "System Administrator",
      reportingOfficerId: "",
      reviewingOfficerId: "",
      approvingAuthorityId: "",
      employeeId: `ADMIN-${userRecord.uid.slice(0, 8).toUpperCase()}`,
      isActive: true,
      forcePasswordChange: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db
      .collection("users")
      .doc(userRecord.uid)
      .set(adminProfile, { merge: true });

    console.log("✅ Firestore administrator profile created.");

    console.log("");
    console.log("🎉 Initial administrator setup completed successfully.");
    console.log(`Admin email: ${email}`);
    console.log("The administrator can now log in through the normal login page.");

    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("❌ Initial administrator setup failed:");
    console.error(error.message);

    process.exit(1);
  }
};

createInitialAdmin();