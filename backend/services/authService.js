const { getAuth } = require("firebase-admin/auth");
const { db } = require("../config/firebase");

// Create Firebase Authentication User
const createFirebaseUser = async (
  email,
  password
) => {
  const userRecord =
    await getAuth().createUser({
      email,
      password,
    });

  return userRecord;
};

// Create Firestore User Profile
const createUserProfile = async (
  userData
) => {
  await db
    .collection("users")
    .doc(userData.uid)
    .set(userData);

  return userData;
};

// Get User Profile
const getUserProfile = async (
  uid
) => {
  const doc = await db
    .collection("users")
    .doc(uid)
    .get();

  if (!doc.exists) {
    throw new Error(
      "User not found"
    );
  }

  return doc.data();
};

module.exports = {
  createFirebaseUser,
  createUserProfile,
  getUserProfile,
};