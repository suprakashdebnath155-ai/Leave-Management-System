const fs = require("fs");
const path = require("path");
const {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
} = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const getCredential = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON));
  }

  const credentialPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    path.join(__dirname, "../firebase/serviceAccountKey.json");

  if (fs.existsSync(credentialPath)) {
    return cert(require(credentialPath));
  }

  return applicationDefault();
};

const firebaseApp =
  getApps()[0] || initializeApp({ credential: getCredential() });
const db = getFirestore(firebaseApp);

module.exports = { firebaseApp, db };
