const { getAuth } = require("firebase-admin/auth");
const { db } = require("../config/firebase");

const PROFILE_CACHE_TTL_MS = Number(process.env.PROFILE_CACHE_TTL_MS || 60_000);
const profileCache = new Map();

const clearUserProfileCache = (uid) => {
  if (uid) {
    profileCache.delete(uid);
  }
};

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

  profileCache.set(userData.uid, {
    profile: userData,
    expiresAt: Date.now() + PROFILE_CACHE_TTL_MS,
  });

  return userData;
};

// Get User Profile
const getUserProfile = async (
  uid
) => {
  const cached = profileCache.get(uid);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.profile;
  }

  const doc = await db
    .collection("users")
    .doc(uid)
    .get();

  if (!doc.exists) {
    throw new Error(
      "User not found"
    );
  }

  const profile = doc.data();
  profileCache.set(uid, {
    profile,
    expiresAt: Date.now() + PROFILE_CACHE_TTL_MS,
  });

  return profile;
};

module.exports = {
  createFirebaseUser,
  createUserProfile,
  getUserProfile,
  clearUserProfileCache,
};
