const { db } = require("../config/firebase");

const getAllUsers = async () => {
  const snapshot = await db.collection("users").get();

  const users = [];

  snapshot.forEach((doc) => {
    users.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return users;
};

const createNewUser = async (userData) => {
  const docRef = await db.collection("users").add({
    ...userData,
    isActive: true,
    createdAt: new Date(),
  });

  return docRef.id;
};

const getUserByEmail = async (email) => {
  const snapshot = await db
    .collection("users")
    .where("email", "==", email)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return {
  id: snapshot.docs[0].id,
  ...snapshot.docs[0].data(),
};
};

module.exports = {
  getAllUsers,
  createNewUser,
  getUserByEmail,
};