# 🏢 Internal Leave Management System (ILMS)

> A secure, cloud-based, full-stack web application designed to digitize and automate the internal employee leave management process of an organization.

---

## 📌 Project Information

| Field | Details |
|---|---|
| **Project Title** | Internal Leave Management System (ILMS) |
| **Project Type** | Full-Stack Web Application |
| **Frontend** | React.js + Vite |
| **Backend** | Node.js + Express.js |
| **Database** | Firebase Firestore |
| **Authentication** | Firebase Authentication |
| **Security** | Firebase ID Tokens, RBAC, Helmet, CORS |
| **Developers** | Suprakash Debnath & Chayanika Debnath |

---

## 👨‍💻 Project Developers

### Suprakash Debnath

**Project Developer**

### Chayanika Debnath

**Project Developer**

---

# 📖 About the Project

The **Internal Leave Management System (ILMS)** is a secure, cloud-based full-stack web application developed to automate and simplify the complete employee leave management process within an organization.

Traditional leave management systems often rely on paperwork, manual approval processes, physical records, and direct communication between employees and administrative authorities. These processes can result in:

- Delayed approvals
- Human errors
- Incorrect leave balance calculations
- Poor transparency
- Difficulty tracking leave applications
- Increased administrative workload
- Inefficient record management

The ILMS solves these problems by providing a centralized digital platform where employees can securely apply for leave, track their application status, view leave balances, and receive notifications.

The system implements a structured **three-level leave approval workflow** involving:

1. Reporting Officer
2. Reviewing Officer
3. Approving Authority

An **Admin** manages employee accounts, user roles, organizational hierarchy, holidays, and other administrative operations.

---

# 🎯 Project Objectives

The primary objectives of the Internal Leave Management System are:

- Automate the complete employee leave application process.
- Eliminate paper-based leave management.
- Reduce administrative workload.
- Provide secure user authentication.
- Implement Role-Based Access Control (RBAC).
- Provide a structured multi-level approval workflow.
- Maintain accurate employee leave balances.
- Allow real-time leave application status tracking.
- Manage organizational holidays.
- Improve transparency and accountability.
- Store organizational data securely in the cloud.
- Protect sensitive employee information.
- Provide a scalable foundation for future HRMS development.

---

# 👥 User Roles

The ILMS supports five primary user roles.

## 1. Admin

The Admin is responsible for managing the application and organizational users.

The Admin can:

- Create employee accounts.
- Manage employee information.
- Assign user roles.
- Assign Reporting Officers.
- Assign Reviewing Officers.
- Assign Approving Authorities.
- Manage organizational holidays.
- View administrative dashboards.
- Monitor leave-related activities.
- Manage organizational data.

---

## 2. Employee

An Employee can:

- Login securely.
- View the employee dashboard.
- View personal profile information.
- View available leave balances.
- Apply for leave.
- Track leave application status.
- View leave history.
- Cancel eligible leave applications.
- Receive notifications.

---

## 3. Reporting Officer

The Reporting Officer can:

- View assigned leave applications.
- Review employee leave requests.
- Recommend applications.
- Reject applications where permitted.
- Add remarks.
- Forward recommended requests to the Reviewing Officer.

---

## 4. Reviewing Officer

The Reviewing Officer can:

- View leave applications forwarded by the Reporting Officer.
- Review complete leave details.
- Recommend applications.
- Reject applications where permitted.
- Add remarks.
- Forward recommended applications to the Approving Authority.

---

## 5. Approving Authority

The Approving Authority can:

- View applications forwarded for final approval.
- Review complete application details.
- Approve leave applications.
- Reject leave applications.
- Add final remarks.
- Complete the leave approval workflow.

---

# 🔄 Complete System Workflow

```text
Admin Creates Employee Account
            ↓
Firebase Authentication Account Created
            ↓
Firestore User Profile Created
            ↓
Employee Receives Login Credentials
            ↓
Employee Logs In
            ↓
Firebase Generates ID Token
            ↓
Employee Accesses Dashboard
            ↓
Employee Applies for Leave
            ↓
Leave Request Stored in Firestore
            ↓
Reporting Officer Reviews Request
            ↓
Recommend / Reject
            ↓
Reviewing Officer Reviews Request
            ↓
Recommend / Reject
            ↓
Approving Authority Makes Final Decision
            ↓
Approve / Reject
            ↓
Leave Balance Updated Where Applicable
            ↓
Notification Generated
            ↓
Employee Views Final Status
```

---

# 🛠️ Technology Stack

## Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3

## Backend

- Node.js
- Express.js
- REST APIs

## Database

- Firebase Firestore

## Authentication

- Firebase Authentication

## Backend Firebase Integration

- Firebase Admin SDK

## Security

- Firebase ID Token Verification
- Role-Based Access Control (RBAC)
- Helmet
- CORS
- Protected Backend APIs
- Input Validation
- Firestore Security Rules
- Audit Logging

## Additional Features

Depending on the final configuration:

- Email notifications
- Dashboard statistics
- Holiday management
- Leave history
- Notifications
- Audit logs
- Request validation

---

# ✨ Main Features

The Internal Leave Management System includes:

- Secure user login.
- Firebase Authentication.
- Firebase ID Token verification.
- Role-Based Access Control.
- Protected frontend routes.
- Protected backend APIs.
- Admin-controlled employee creation.
- Employee profile management.
- Leave application submission.
- Multi-level approval workflow.
- Reporting Officer review.
- Reviewing Officer review.
- Approving Authority final decision.
- Leave balance management.
- Leave history.
- Leave status tracking.
- Holiday management.
- Dashboard statistics.
- Notifications.
- Email notification support where configured.
- Audit logging.
- Request validation.
- Secure API communication.

---

# 🏗️ System Architecture

```text
┌───────────────────────────────────────┐
│                 USERS                 │
│ Admin │ Employee │ Officers │ Authority│
└──────────────────┬────────────────────┘
                   │
                   ▼
┌───────────────────────────────────────┐
│           REACT.JS + VITE             │
│              Frontend UI              │
└──────────────────┬────────────────────┘
                   │
                   │ REST API / HTTP(S)
                   ▼
┌───────────────────────────────────────┐
│         NODE.JS + EXPRESS.JS          │
│              Backend API              │
└──────────────────┬────────────────────┘
                   │
                   ▼
┌───────────────────────────────────────┐
│          SECURITY MIDDLEWARE          │
│ Authentication │ RBAC │ Validation    │
│ Helmet │ CORS │ Firebase ID Tokens    │
└──────────────────┬────────────────────┘
                   │
                   ▼
┌───────────────────────────────────────┐
│            BUSINESS LOGIC             │
│     Controllers │ Services │ Utils    │
└──────────────┬────────────────┬───────┘
               │                │
               ▼                ▼
┌─────────────────────┐  ┌─────────────────────┐
│ FIREBASE AUTH       │  │ FIRESTORE DATABASE  │
│ User Authentication │  │ Cloud Data Storage  │
└─────────────────────┘  └─────────────────────┘
```

---

# 📁 Project Folder Structure

A simplified representation of the ILMS project structure is:

```text
ILMS/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── routes/
│   │   └── assets/
│   │
│   ├── package.json
│   ├── vite.config.js
│   ├── .env
│   └── .env.example
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── validations/
│   ├── emailTemplates/
│   ├── firebase/
│   │   └── serviceAccountKey.json
│   ├── config/
│   ├── utils/
│   ├── scripts/
│   │   └── createAdmin.js
│   ├── tests/
│   ├── package.json
│   ├── .env
│   └── .env.example
│
├── firestore.rules
├── firestore.indexes.json
├── .gitignore
└── README.md
```

> **Note:** The exact folder structure may differ slightly depending on the final project version. Always check the actual source code before changing paths or filenames.

---

# 🚀 COMPLETE INSTALLATION AND SETUP GUIDE

This section explains how another developer, internship mentor, or organization can run the ILMS project without receiving the original developer's `.env` files or Firebase Service Account Key.

The complete setup process is:

```text
Receive ILMS Source Code
        ↓
Install Node.js and npm
        ↓
Install Project Dependencies
        ↓
Create Own Firebase Project
        ↓
Enable Firebase Authentication
        ↓
Create Firestore Database
        ↓
Register Firebase Web App
        ↓
Create Frontend .env
        ↓
Generate Firebase Service Account Key
        ↓
Place serviceAccountKey.json in Backend
        ↓
Create Backend .env
        ↓
Deploy Firestore Rules and Indexes
        ↓
Create First Admin Account
        ↓
Start Backend
        ↓
Start Frontend
        ↓
Login as Admin
        ↓
Create Other Users
```

---

# STEP 1 — Install Required Software

Before running the project, install:

- Node.js
- npm
- Visual Studio Code
- Google Chrome or another modern browser
- Git (optional)
- A Google account for Firebase

Check Node.js:

```bash
node --version
```

Check npm:

```bash
npm --version
```

If both commands display version numbers, Node.js and npm are installed correctly.

---

# STEP 2 — Download or Extract the Project

If the project was received as a ZIP file:

1. Download the ZIP file.
2. Extract the ZIP file.
3. Open the extracted folder in Visual Studio Code.

If using Git:

```bash
git clone <your-repository-url>
```

Enter the project folder:

```bash
cd <project-folder-name>
```

---

# STEP 3 — Install Frontend Dependencies

Open a terminal in Visual Studio Code.

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Wait for the installation to complete.

Do not start the frontend yet because Firebase configuration must be completed first.

---

# STEP 4 — Install Backend Dependencies

Open another terminal.

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Wait for installation to complete.

---

# 🔥 FIREBASE SETUP

The project requires Firebase for:

- User authentication.
- Firestore cloud database.
- Frontend Firebase SDK.
- Backend Firebase Admin SDK.

Each person or organization running this project should create and use their own Firebase project.

---

# STEP 5 — Create a Firebase Project

Open the Firebase Console:

https://console.firebase.google.com/

Then:

1. Sign in using a Google account.
2. Click **Create a project**.
3. Enter a project name.

Example:

```text
internal-leave-management-system
```

4. Continue through the project creation process.
5. Google Analytics is optional for local development.
6. Wait until Firebase finishes creating the project.

---

# STEP 6 — Enable Firebase Authentication

Inside Firebase Console:

1. Open your Firebase project.
2. Navigate to:

```text
Build → Authentication
```

3. Click **Get Started**.
4. Open the **Sign-in method** section.
5. Select:

```text
Email/Password
```

6. Enable Email/Password authentication.
7. Save the configuration.

The ILMS application does not require public user registration because employee accounts are intended to be created by an Admin.

---

# STEP 7 — Create Firestore Database

Inside Firebase Console:

1. Navigate to:

```text
Build → Firestore Database
```

2. Click **Create Database**.
3. Select the appropriate database mode.
4. Select a suitable database location.
5. Complete database creation.

For production deployment, always use secure Firestore Security Rules.

---

# STEP 8 — Register a Firebase Web Application

The frontend requires Firebase Web SDK configuration.

Inside Firebase Console:

1. Open **Project Settings**.
2. Scroll down to **Your apps**.
3. Click the Web icon:

```text
</>
```

4. Enter an application nickname.

Example:

```text
ILMS Frontend
```

5. Click **Register App**.

Firebase will provide configuration values similar to:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Do not copy these example values literally.

Use the actual configuration generated by your own Firebase project.

---

# 🔐 FRONTEND ENVIRONMENT CONFIGURATION

# STEP 9 — Create the Frontend `.env` File

Inside the frontend folder, create a file named:

```text
.env
```

Expected path:

```text
ILMS/
└── frontend/
    └── .env
```

Add:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

VITE_API_BASE_URL=http://localhost:5000/api
```

Replace every placeholder with actual values from your Firebase project.

## Important for Vite

Frontend environment variables that need to be accessible in browser code must begin with:

```text
VITE_
```

After changing the frontend `.env`, restart the Vite development server.

---

# 🔑 FIREBASE ADMIN SDK SERVICE ACCOUNT KEY

The backend requires Firebase Admin SDK credentials to perform trusted server-side operations such as:

- Verify Firebase ID Tokens.
- Access Firestore securely.
- Create Firebase Authentication users.
- Manage employee accounts.
- Create the first Admin account.
- Perform privileged backend operations.

For security reasons, the real `serviceAccountKey.json` should never be included in a public repository or shared source-code ZIP.

---

# STEP 10 — Generate `serviceAccountKey.json`

Follow these steps carefully.

## 10.1 Open Firebase Console

Open:

```text
https://console.firebase.google.com/
```

Sign in and select the Firebase project created for ILMS.

## 10.2 Open Project Settings

Inside the project:

```text
Project Overview
        ↓
Gear Icon ⚙️
        ↓
Project Settings
```

## 10.3 Open Service Accounts

Select:

```text
Service accounts
```

Find the:

```text
Firebase Admin SDK
```

section.

## 10.4 Generate New Private Key

Click:

```text
Generate new private key
```

Firebase will display a confirmation warning.

Click:

```text
Generate key
```

A JSON file will automatically download to the computer.

The original filename may look similar to:

```text
internal-leave-management-firebase-adminsdk-fbsvc-abc123.json
```

## 10.5 Rename the File

Rename the downloaded file to:

```text
serviceAccountKey.json
```

## 10.6 Place the File in the Backend

Place it inside:

```text
backend/firebase/
```

The final location should be:

```text
ILMS/
│
└── backend/
    │
    └── firebase/
        │
        └── serviceAccountKey.json
```

Expected path:

```text
backend/firebase/serviceAccountKey.json
```

---

# ⚠️ CRITICAL SECURITY WARNING

The `serviceAccountKey.json` file contains a private key and privileged Firebase credentials.

Never:

- Upload it to GitHub.
- Commit it to Git.
- Share it publicly.
- Include it in screenshots.
- Send its contents in public messages.
- Place it inside frontend code.
- Expose it through an API response.

If a Service Account Key is accidentally exposed:

1. Immediately revoke or delete the compromised key.
2. Generate a new key.
3. Update the backend configuration.
4. Review Firebase and Google Cloud logs where appropriate.

---

# STEP 11 — Firebase Admin SDK Initialization

A typical Firebase Admin SDK configuration looks like:

```javascript
const admin = require("firebase-admin");
const serviceAccount = require("../firebase/serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = {
  admin,
  db,
  auth
};
```

Use the Firebase initialization code already included in the project.

Do not create duplicate Firebase Admin instances unless required.

The relative path to `serviceAccountKey.json` must match the actual location of the Firebase configuration file.

---

# ⚙️ BACKEND ENVIRONMENT CONFIGURATION

# STEP 12 — Create the Backend `.env` File

Inside the backend folder, create:

```text
.env
```

Expected path:

```text
ILMS/
└── backend/
    └── .env
```

Basic example:

```env
PORT=5000
NODE_ENV=development

FRONTEND_URL=http://localhost:5173
```

If email notifications are enabled:

```env
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_app_password
```

## Important

The exact environment-variable names must match those referenced in the source code.

Do not rename environment variables without updating the corresponding source code.

---

# 📧 OPTIONAL EMAIL NOTIFICATION SETUP

If the ILMS project uses email notifications, configure an email account.

For Gmail:

1. Sign in to the Google account that will send notifications.
2. Enable 2-Step Verification.
3. Create a Google App Password if available for the account.
4. Add the email address and App Password to the backend `.env`.

Example:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

Never publish or commit the real email password or App Password.

---

# 👑 CREATING THE FIRST ADMIN ACCOUNT

This is one of the most important setup steps.

Because public registration is disabled and only an Admin can create employees, a new installation has a bootstrap problem:

```text
No Admin Exists
        ↓
Nobody Can Login as Admin
        ↓
Nobody Can Create Employees
```

Therefore, the first Admin must be created separately.

The recommended solution is a **one-time Admin creation script**.

---

# METHOD 1 — RECOMMENDED: Create First Admin Using a Script

The recommended project structure is:

```text
backend/
│
├── scripts/
│   └── createAdmin.js
│
├── firebase/
│   └── serviceAccountKey.json
│
├── package.json
└── .env
```

The person setting up the application runs:

```bash
cd backend
npm run create-admin
```

The script should ask for:

```text
==========================================
        ILMS FIRST ADMIN SETUP
==========================================

Enter Admin Name:
Enter Admin Email:
Enter Admin Password:
Enter Employee ID:

Creating Firebase Authentication account...

✓ Authentication account created successfully.

Creating Firestore Admin profile...

✓ Firestore Admin profile created successfully.

==========================================
    ADMIN ACCOUNT CREATED SUCCESSFULLY
==========================================

You can now start the application and login.
```

The script should create:

```text
Firebase Authentication
        │
        ├── UID
        ├── Email
        └── Password
                ↓
Firestore User Profile
        │
        ├── uid
        ├── name
        ├── email
        ├── employeeId
        ├── role
        ├── isActive
        └── timestamps
```

---

# Example `createAdmin.js`

> **Important:** This is a generic example. Field names, Firebase configuration imports, collection names, and role values must match the actual project implementation.

```javascript
const readline = require("readline");
const { auth, db } = require("../config/firebaseAdmin");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function createFirstAdmin() {
  console.log("\n==========================================");
  console.log("        ILMS FIRST ADMIN SETUP");
  console.log("==========================================\n");

  try {
    const name = await askQuestion("Enter Admin Name: ");
    const email = await askQuestion("Enter Admin Email: ");
    const password = await askQuestion("Enter Admin Password: ");
    const employeeId = await askQuestion("Enter Employee ID: ");

    if (!name || !email || !password || !employeeId) {
      throw new Error("All fields are required.");
    }

    if (password.length < 6) {
      throw new Error(
        "Firebase Authentication requires a password of at least 6 characters."
      );
    }

    console.log("\nChecking whether the Admin already exists...");

    try {
      const existingUser = await auth.getUserByEmail(email);

      if (existingUser) {
        console.log("\nAn Authentication account already exists with this email.");
        console.log("No duplicate Admin was created.");
        return;
      }
    } catch (error) {
      if (error.code !== "auth/user-not-found") {
        throw error;
      }
    }

    console.log("Creating Firebase Authentication account...");

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: false,
      disabled: false
    });

    console.log("✓ Authentication account created successfully.");

    console.log("Creating Firestore Admin profile...");

    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      name,
      email,
      employeeId,
      role: "admin",
      isActive: true,
      forcePasswordChange: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log("✓ Firestore Admin profile created successfully.");

    console.log("\n==========================================");
    console.log("    ADMIN ACCOUNT CREATED SUCCESSFULLY");
    console.log("==========================================");
    console.log(`Name        : ${name}`);
    console.log(`Email       : ${email}`);
    console.log(`Employee ID : ${employeeId}`);
    console.log("Role        : admin");
    console.log("==========================================");
    console.log("\nYou can now start ILMS and login as Admin.\n");
  } catch (error) {
    console.error("\nAdmin creation failed:");
    console.error(error.message);
  } finally {
    rl.close();
  }
}

createFirstAdmin();
```

---

# Add Admin Script to `package.json`

Inside the backend `package.json`, add:

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "create-admin": "node scripts/createAdmin.js"
  }
}
```

Do not replace existing scripts unnecessarily. Add the `create-admin` script to the existing `scripts` object.

Then run:

```bash
npm run create-admin
```

---

# METHOD 2 — Create First Admin Manually

If the Admin script is unavailable, create the first Admin manually.

## Step A — Create Firebase Authentication User

Open:

```text
Firebase Console
    ↓
Authentication
    ↓
Users
    ↓
Add User
```

Enter:

- Admin email.
- Secure password.

Create the user.

Copy the Firebase UID.

---

## Step B — Create Firestore User Profile

Open:

```text
Firebase Console
    ↓
Firestore Database
```

Create the required user collection.

For example:

```text
users
```

Create a document whose Document ID is exactly the same as the Firebase Authentication UID.

Example:

```text
Document ID:
Firebase Authentication UID
```

Example fields:

```text
uid: "firebase-user-uid"
name: "System Administrator"
email: "admin@example.com"
employeeId: "ADMIN001"
role: "admin"
isActive: true
forcePasswordChange: false
```

## Important

The exact:

- Collection name
- Field names
- Role value
- Capitalization
- Required profile fields

must match the actual source code.

For example, if the code expects:

```text
Admin
```

do not use:

```text
admin
```

unless the source code supports that value.

---

# 🔐 COMPLETE FIRST ADMIN FLOW

```text
Create Firebase Project
        ↓
Enable Authentication
        ↓
Create Firestore Database
        ↓
Generate serviceAccountKey.json
        ↓
Place Key in backend/firebase/
        ↓
Configure .env Files
        ↓
Run:
npm run create-admin
        ↓
Enter Admin Information
        ↓
Firebase Auth Account Created
        ↓
Firestore Admin Profile Created
        ↓
Start Backend
        ↓
Start Frontend
        ↓
Login Using Admin Credentials
        ↓
Admin Creates Employees and Officers
```

---

# 🛡️ CONFIGURE `.gitignore`

Create or verify the root-level:

```text
.gitignore
```

Add:

```gitignore
# Dependencies
**/node_modules/

# Environment Files
**/.env
**/.env.local
**/.env.production

# Firebase Admin SDK Private Key
backend/firebase/serviceAccountKey.json

# Frontend Build Output
frontend/dist/

# Logs
*.log

# Operating System Files
.DS_Store
Thumbs.db
```

---

# 📄 CREATE `.env.example` FILES

It is recommended to include example environment files so another developer knows what configuration is required.

---

## Frontend `.env.example`

Create:

```text
frontend/.env.example
```

Add:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Backend `.env.example`

Create:

```text
backend/.env.example
```

Add:

```env
PORT=5000
NODE_ENV=development

FRONTEND_URL=http://localhost:5173

EMAIL_USER=
EMAIL_PASSWORD=
```

Never place real passwords, private keys, or production secrets inside `.env.example`.

---

# 🔒 FIRESTORE SECURITY RULES

If the project contains:

```text
firestore.rules
```

the rules can be deployed using Firebase CLI.

Install Firebase CLI:

```bash
npm install -g firebase-tools
```

Login:

```bash
firebase login
```

Initialize Firebase if required:

```bash
firebase init
```

Select:

```text
Firestore
```

Deploy Firestore Security Rules:

```bash
firebase deploy --only firestore:rules
```

If the project contains:

```text
firestore.indexes.json
```

deploy indexes:

```bash
firebase deploy --only firestore:indexes
```

Never use unrestricted production rules such as:

```javascript
allow read, write: if true;
```

This would allow unauthorized database access.

---

# ▶️ RUNNING THE APPLICATION

After completing all configuration, start the backend and frontend separately.

---

# STEP 13 — Start the Backend

Open Terminal 1:

```bash
cd backend
```

Install dependencies if necessary:

```bash
npm install
```

Start development mode:

```bash
npm run dev
```

Or, depending on the project's scripts:

```bash
npm start
```

The backend will typically run at:

```text
http://localhost:5000
```

Check terminal output for the exact port.

---

# STEP 14 — Start the Frontend

Open Terminal 2:

```bash
cd frontend
```

Install dependencies if necessary:

```bash
npm install
```

Start Vite:

```bash
npm run dev
```

The frontend will typically run at:

```text
http://localhost:5173
```

Open this address in a browser.

---

# 🔐 AUTHENTICATION REQUEST FLOW

```text
User Enters Email and Password
            ↓
Firebase Authentication Verifies Credentials
            ↓
Firebase Generates ID Token
            ↓
Frontend Maintains Authentication Session
            ↓
Frontend Sends API Request
            ↓
Authorization: Bearer <firebase-id-token>
            ↓
Backend Authentication Middleware
            ↓
Firebase Admin SDK Verifies Token
            ↓
Backend Retrieves User Profile and Role
            ↓
RBAC Middleware Checks Permission
            ↓
Authorized Request Continues
```

---

# 🗄️ MAIN FIRESTORE COLLECTIONS

Depending on the final project implementation, the application may use collections such as:

```text
users
leaveRequests
leaveBalances
holidays
notifications
auditLogs
```

## Users

Stores information such as:

- Firebase UID.
- Employee ID.
- Name.
- Email.
- Department.
- Designation.
- Role.
- Account status.
- Assigned officers.

## Leave Requests

Stores:

- Employee UID.
- Leave type.
- Start date.
- End date.
- Total leave days.
- Reason.
- Current status.
- Reporting Officer decision.
- Reviewing Officer decision.
- Approving Authority decision.
- Remarks.
- Timestamps.

## Leave Balances

Stores employee leave balances.

Possible leave types include:

- Casual Leave.
- Medical Leave.
- Earned Leave.
- Half Pay Leave.
- Duty Leave.

## Holidays

Stores organizational holiday information.

## Notifications

Stores system-generated user notifications.

## Audit Logs

Stores important actions performed within the application.

---

# 🧪 RECOMMENDED TESTING PROCEDURE

After setup, test the application in this order:

1. Start the backend.
2. Start the frontend.
3. Login as the first Admin.
4. Verify Admin Dashboard access.
5. Create an Employee account.
6. Create or assign a Reporting Officer.
7. Create or assign a Reviewing Officer.
8. Create or assign an Approving Authority.
9. Login as Employee.
10. Verify Employee Dashboard.
11. Submit a leave application.
12. Login as Reporting Officer.
13. Review the leave application.
14. Login as Reviewing Officer.
15. Review the forwarded application.
16. Login as Approving Authority.
17. Approve or reject the application.
18. Login again as Employee.
19. Verify final leave status.
20. Verify leave balance.
21. Check notifications.
22. Check Firestore records.
23. Verify unauthorized users cannot access restricted modules.

---

# 🧰 TROUBLESHOOTING

## Error: `serviceAccountKey.json` Not Found

Verify the file exists at:

```text
backend/firebase/serviceAccountKey.json
```

Make sure the filename is exactly:

```text
serviceAccountKey.json
```

Also verify the import path used by your Firebase Admin configuration.

---

## Error: Firebase Authentication Fails

Check:

- Email/Password authentication is enabled.
- Firebase frontend configuration is correct.
- The frontend `.env` file exists.
- Vite environment variables begin with `VITE_`.
- The frontend development server was restarted after changing `.env`.

---

## Error: `401 Unauthorized`

Possible reasons:

- User is not logged in.
- Firebase ID Token is missing.
- Token is invalid.
- Token has expired.
- Frontend is not sending the Authorization header.

Expected header:

```text
Authorization: Bearer <firebase-id-token>
```

---

## Error: `403 Forbidden`

This usually means the user is authenticated but does not have permission to access the requested resource.

Check:

- User role.
- Firestore user profile.
- Account status.
- Role spelling.
- Role capitalization.
- RBAC middleware.

---

## Error: CORS Blocked

Verify that the backend allows:

```text
http://localhost:5173
```

Check backend `.env`:

```env
FRONTEND_URL=http://localhost:5173
```

Restart the backend after modifying `.env`.

---

## Error: Firestore Index Required

Firestore may return an error requiring a composite index.

If the project includes:

```text
firestore.indexes.json
```

deploy indexes:

```bash
firebase deploy --only firestore:indexes
```

---

## Error: Email Notifications Not Working

Check:

- Email address.
- App Password.
- Environment-variable names.
- Email service configuration.
- Backend console logs.

The main ILMS functionality may continue working even if email delivery fails, depending on the project's error handling.

---

## Error: Frontend Cannot Connect to Backend

Check:

- Backend is running.
- Correct backend port is configured.
- `VITE_API_BASE_URL` is correct.
- CORS permits the frontend origin.
- Firewall is not blocking the local port.

Example:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Error: Admin Cannot Login

Check all of the following:

1. The Admin exists in Firebase Authentication.
2. The password is correct.
3. A matching Admin profile exists in Firestore.
4. The Firestore document ID matches the Firebase UID if required by the project.
5. The Admin role exactly matches the expected role value.
6. The Admin account is active.
7. Firebase Authentication Email/Password login is enabled.

---

## Error: `npm run create-admin` Does Not Work

Check:

1. `backend/scripts/createAdmin.js` exists.
2. The backend `package.json` contains:

```json
"create-admin": "node scripts/createAdmin.js"
```

3. Firebase Admin SDK is installed.
4. `serviceAccountKey.json` exists in the expected folder.
5. The Firebase configuration import path is correct.
6. Backend dependencies have been installed using:

```bash
npm install
```

---

# 🔐 SECURITY BEST PRACTICES

Never share or upload:

```text
frontend/.env
backend/.env
backend/firebase/serviceAccountKey.json
Firebase private keys
Email passwords
Email App Passwords
Production secrets
API secrets
```

Before uploading the project to GitHub, run:

```bash
git status
```

Verify that no sensitive files are being tracked.

If a Firebase Service Account Key is accidentally exposed:

1. Immediately revoke or delete the compromised key.
2. Generate a new key.
3. Update the backend.
4. Review Firebase and Google Cloud audit logs where applicable.

---

# 🚫 FILES THAT SHOULD NOT BE SHARED

Keep these private:

```text
frontend/.env
backend/.env
backend/firebase/serviceAccountKey.json
```

Instead, share:

```text
frontend/.env.example
backend/.env.example
README.md
```

Another developer can create their own private configuration by following this README.

---

# 📋 COMPLETE SETUP CHECKLIST

Before running ILMS, verify:

- [ ] Node.js is installed.
- [ ] npm is installed.
- [ ] Frontend dependencies are installed.
- [ ] Backend dependencies are installed.
- [ ] Firebase project is created.
- [ ] Firebase Authentication is enabled.
- [ ] Email/Password authentication is enabled.
- [ ] Firestore Database is created.
- [ ] Firebase Web App is registered.
- [ ] Frontend `.env` is configured.
- [ ] Firebase Service Account Key is generated.
- [ ] `serviceAccountKey.json` is placed in the correct backend folder.
- [ ] Backend `.env` is configured.
- [ ] Email service is configured if required.
- [ ] Firestore Security Rules are configured.
- [ ] Firestore indexes are deployed if required.
- [ ] First Admin account is created.
- [ ] Backend server starts successfully.
- [ ] Frontend development server starts successfully.
- [ ] Admin login works.
- [ ] Employee creation works.
- [ ] Leave workflow works.

---

# ⚡ QUICK START SUMMARY

## Terminal 1 — Backend

```bash
cd backend
npm install
npm run create-admin
npm run dev
```

## Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# 🌟 FUTURE SCOPE

The ILMS architecture can be extended with:

- AI-powered employee chatbot.
- Machine Learning-based leave prediction.
- Leave pattern analysis.
- Fraud and anomaly detection.
- Multi-Factor Authentication.
- Advanced cybersecurity monitoring.
- Attendance integration.
- Payroll integration.
- Mobile application.
- Push notifications.
- SMS notifications.
- Advanced analytics dashboard.
- PDF and Excel report generation.
- Multi-organization SaaS support.
- Enterprise HRMS integration.

---

# 📌 PROJECT INFORMATION

**Project Title:** Internal Leave Management System (ILMS)

**Project Type:** Full-Stack Web Application

**Developers:**

- Suprakash Debnath
- Chayanika Debnath

**Frontend:** React.js + Vite

**Backend:** Node.js + Express.js

**Database:** Firebase Firestore

**Authentication:** Firebase Authentication

**Security:** Firebase ID Tokens, Role-Based Access Control, Helmet, CORS, Protected APIs, and Firestore Security Rules

---

# 👨‍💻 AUTHORS

## Suprakash Debnath

Project Developer

## Chayanika Debnath

Project Developer

---

# 📄 LICENSE AND USAGE

This project was developed as part of an internship and academic software development project.

The source code, documentation, and associated materials should be used in accordance with the permissions and requirements of the project developers, internship organization, and associated educational institution.

---

# 🙏 ACKNOWLEDGEMENT

We would like to express our sincere gratitude to our internship mentor and all individuals who provided guidance, feedback, and support throughout the development of the **Internal Leave Management System (ILMS)**.

Their valuable suggestions and encouragement contributed significantly to the successful completion of this project.

---

<p align="center">
  <strong>Internal Leave Management System (ILMS)</strong>
</p>

<p align="center">
  Developed by <strong>Suprakash Debnath</strong> and <strong>Chayanika Debnath</strong>
</p>