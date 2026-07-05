const { getAuth } = require("firebase-admin/auth");
const { db } = require("../config/firebase");
const {
  createFirebaseUser,
  createUserProfile,
} = require("../services/authService");
const {
  createLeaveBalance,
} = require("../services/leaveBalanceService");

async function seedAdmin() {
  try {
    const email = "admin@gmail.com";
    const password = "Admin@123";

    let user;

    try {
      user = await getAuth().getUserByEmail(email);
      
    } catch {
      user = await createFirebaseUser(email, password);
      
    }

    const userDoc = await db.collection("users").doc(user.uid).get();

    if (!userDoc.exists) {
      await createUserProfile({
        uid: user.uid,
        name: "System Administrator",
        email,
        role: "admin",
        department: "Administration",
        designation: "System Administrator",
        employeeId: "ADMIN001",
        jobMode: "Regular",
        reportingOfficerId: "",
        reviewingOfficerId: "",
        approvingAuthorityId: "",
        phone: "",
        photoURL: "",
        isActive: true,
        forcePasswordChange: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await createLeaveBalance(user.uid, "Regular");

     
    } else {
 
    }

  } catch (err) {
    console.error(err);
  }

  process.exit();
}

seedAdmin();