# 🏢 Internal Leave Management System (ILMS)

A secure, cloud-based full-stack web application designed to digitize and automate the internal employee leave management process of an organization.

---

## 👨‍💻 Project Developers

| Name | Role |
|---|---|
| **Suprakash Debnath** | Project Developer |
| **Chayanika Debnath** | Project Developer |

---

## 📌 Project Overview

The **Internal Leave Management System (ILMS)** is a full-stack web application developed to automate and simplify the complete employee leave management process.

The system eliminates traditional paper-based leave applications and provides a secure digital platform where employees can apply for leave, track application status, view leave balances, and receive notifications.

The application implements a structured **multi-level leave approval workflow** involving:

1. Employee
2. Reporting Officer
3. Reviewing Officer
4. Approving Authority

An **Admin** manages employee accounts, organizational information, user roles, holidays, and other administrative operations.

The application is developed using modern web technologies including **React.js, Vite, Node.js, Express.js, Firebase Authentication, and Firebase Firestore**.

---

## 🎯 Project Objectives

The main objectives of the Internal Leave Management System are:

- Automate the employee leave application process.
- Eliminate paper-based leave management.
- Reduce administrative workload.
- Provide secure user authentication.
- Implement Role-Based Access Control (RBAC).
- Provide a structured multi-level approval workflow.
- Maintain accurate employee leave balances.
- Provide real-time leave status tracking.
- Manage organizational holidays.
- Improve transparency and accountability.
- Store organizational data securely in the cloud.
- Provide a scalable foundation for future HRMS development.

---

## 👥 User Roles

The system supports five primary user roles.

### 1. Admin

The Admin can:

- Create employee accounts.
- Manage employee information.
- Assign organizational roles.
- Assign Reporting Officers.
- Assign Reviewing Officers.
- Assign Approving Authorities.
- Manage holidays.
- View administrative dashboard information.
- Monitor leave-related activities.
- Manage organizational data.

### 2. Employee

The Employee can:

- Login securely.
- View the employee dashboard.
- View personal profile information.
- View available leave balances.
- Apply for leave.
- Track leave application status.
- View leave history.
- Cancel eligible leave applications.
- Receive notifications.

### 3. Reporting Officer

The Reporting Officer can:

- View assigned leave applications.
- Review employee leave requests.
- Recommend applications.
- Reject applications where permitted.
- Add remarks.
- Forward recommended requests to the Reviewing Officer.

### 4. Reviewing Officer

The Reviewing Officer can:

- View requests forwarded by the Reporting Officer.
- Review leave details.
- Recommend or reject requests.
- Add remarks.
- Forward recommended requests to the Approving Authority.

### 5. Approving Authority

The Approving Authority can:

- View requests forwarded for final approval.
- Review complete leave application details.
- Approve leave applications.
- Reject leave applications.
- Add final remarks.
- Complete the leave approval workflow.

---

## 🔄 System Workflow

The basic application workflow is:

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
Firebase ID Token Generated
            ↓
Employee Accesses Dashboard
            ↓
Employee Applies for Leave
            ↓
Reporting Officer Reviews Request
            ↓
Reviewing Officer Reviews Request
            ↓
Approving Authority Makes Final Decision
            ↓
Leave Approved or Rejected
            ↓
Leave Balance Updated Where Applicable
            ↓
Notification Generated
            ↓
Employee Views Final Status
```

---

## 🛠️ Technology Stack

### Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3

### Backend

- Node.js
- Express.js
- REST APIs

### Database

- Firebase Firestore

### Authentication

- Firebase Authentication

### Backend Firebase Integration

- Firebase Admin SDK

### Security

- Firebase ID Token Verification
- Role-Based Access Control (RBAC)
- Helmet
- CORS
- Protected Backend APIs
- Input Validation
- Firestore Security Rules
- Audit Logging

### Additional Services

Depending on the final configuration:

- Email notifications
- Audit logging
- Dashboard statistics
- Holiday management
- Request validation

---

## ✨ Main Features

The Internal Leave Management System includes:

- Secure login system.
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

## 🏗️ System Architecture

The application follows a modern full-stack layered architecture:

```text
┌─────────────────────────────┐
│          USERS              │
│ Admin / Employee / Officers │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│    REACT.JS + VITE          │
│       Frontend UI           │
└──────────────┬──────────────┘
               │ HTTPS / REST API
               ▼
┌─────────────────────────────┐
│  NODE.JS + EXPRESS.JS       │
│       Backend API           │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│     SECURITY MIDDLEWARE     │
│ Auth │ RBAC │ Validation    │
│ Helmet │ CORS │ ID Tokens   │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      BUSINESS LOGIC         │
│ Controllers and Services    │
└───────┬─────────────┬───────┘
        │             │
        ▼             ▼
┌──────────────┐  ┌───────────────┐
│  FIREBASE    │  │   FIRESTORE   │
│     AUTH     │  │   DATABASE    │
└──────────────┘  └───────────────┘
```

---

## 📁 Project Folder Structure

A simplified representation of the project structure is shown below:

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

> **Note:** The exact folder structure may differ slightly depending on the final project version.

---

# 🚀 Complete Installation and Setup Guide

Follow the steps below carefully to run the ILMS project on another computer without sharing the original `.env` files or Firebase Service Account Key.

---

## Step 1: Install Required Software

Before running the project, install:

- Node.js
- npm
- Visual Studio Code
- Google Chrome or another modern browser
- Git (optional)
- A Google account for Firebase

Check whether Node.js is installed:

```bash
node --version
```

Check npm:

```bash
npm --version
```

If both commands display version numbers, the installation is successful.

---

## Step 2: Download or Extract the Project

If the project was received as a ZIP file:

1. Download the ZIP file.
2. Extract the ZIP file.
3. Open the extracted project folder in Visual Studio Code.

If using Git:

```bash
git clone <your-repository-url>
```

Then enter the project folder:

```bash
cd <project-folder-name>
```

---

## Step 3: Install Frontend Dependencies

Open the VS Code terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Wait until all required frontend packages are installed.

Do not start the frontend yet because Firebase configuration must be completed first.

---

## Step 4: Install Backend Dependencies

Open another terminal.

Navigate to the backend directory:

```bash
cd backend
```

Install backend dependencies:

```bash
npm install
```

Wait until the installation is complete.

---

# 🔥 Firebase Configuration

The project requires a Firebase project for:

- Firebase Authentication
- Firestore Database
- Frontend Firebase SDK
- Backend Firebase Admin SDK

Each person or organization running this project should use their own Firebase project and credentials.

---

## Step 5: Create a Firebase Project

Open the Firebase Console in your browser.

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
6. Wait for Firebase to finish creating the project.

---

## Step 6: Enable Firebase Authentication

Inside the Firebase Console:

1. Open the Firebase project.
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

The ILMS application does not require public registration because employee accounts are intended to be created by an Admin.

---

## Step 7: Create the Firestore Database

Inside Firebase Console:

1. Navigate to:

```text
Build → Firestore Database
```

2. Click **Create Database**.
3. Select an appropriate database location.
4. Complete database creation.

For production deployment, always use secure Firestore Security Rules.

---

## Step 8: Register the Frontend as a Firebase Web Application

Inside the Firebase Console:

1. Open **Project Settings**.
2. Scroll to **Your apps**.
3. Click the Web Application icon:

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

Do not copy the example values literally. Use the actual configuration values generated for your own Firebase project.

---

# 🔐 Frontend Environment Configuration

## Step 9: Create the Frontend `.env` File

Inside the frontend folder, create a file named:

```text
.env
```

The path should be:

```text
ILMS/
└── frontend/
    └── .env
```

Add the following variables:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

VITE_API_BASE_URL=http://localhost:5000/api
```

Replace every placeholder with the actual values from your Firebase project.

### Important

All environment variables exposed to a Vite frontend must begin with:

```text
VITE_
```

After changing the `.env` file, restart the Vite development server.

---

# 🔑 Firebase Admin SDK Configuration

## Step 10: Generate a Firebase Service Account Key

The backend requires Firebase Admin SDK credentials.

Inside the Firebase Console:

1. Open your Firebase project.
2. Click the gear icon.
3. Open **Project Settings**.
4. Select the **Service accounts** tab.
5. Find the **Firebase Admin SDK** section.
6. Click:

```text
Generate new private key
```

7. Confirm the action.
8. A JSON file will be downloaded.

Rename the downloaded file to:

```text
serviceAccountKey.json
```

Place the file inside:

```text
backend/firebase/
```

The complete path should be:

```text
ILMS/
└── backend/
    └── firebase/
        └── serviceAccountKey.json
```

### ⚠️ Critical Security Warning

Never:

- Upload `serviceAccountKey.json` to GitHub.
- Commit it to Git.
- Share it publicly.
- Include it in screenshots.
- Send it through unsecured communication channels.

A Firebase service account private key provides privileged backend access to Firebase resources.

---

## Step 11: Firebase Admin SDK Initialization

The backend should initialize Firebase Admin SDK using the service account key.

A typical configuration is:

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

Use the existing Firebase configuration file included in the project. Do not create duplicate Firebase initialization code unless required.

---

# ⚙️ Backend Environment Configuration

## Step 12: Create the Backend `.env` File

Inside the backend folder, create:

```text
.env
```

Path:

```text
ILMS/
└── backend/
    └── .env
```

A basic configuration may look like:

```env
PORT=5000
NODE_ENV=development

FRONTEND_URL=http://localhost:5173
```

If email notification functionality is enabled, additional environment variables may be required:

```env
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_app_password
```

### Important

The exact variable names must match those referenced by the project's source code.

Do not rename environment variables without updating the corresponding source code.

---

# 📧 Optional Email Notification Setup

If the ILMS project uses email notifications, configure the email service.

For Gmail:

1. Sign in to the Google account that will send emails.
2. Enable 2-Step Verification.
3. Create a Google App Password if available for the account.
4. Add the email address and App Password to the backend `.env`.

Example:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

Never use or publish your actual email password.

---

# 🛡️ Configure `.gitignore`

Sensitive files must not be uploaded to GitHub.

At the root of the project, create or verify:

```text
.gitignore
```

Add:

```gitignore
# Dependencies
**/node_modules/

# Environment Variables
**/.env
**/.env.local
**/.env.production

# Firebase Admin SDK Private Key
backend/firebase/serviceAccountKey.json

# Frontend Build
frontend/dist/

# Logs
*.log

# Operating System Files
.DS_Store
Thumbs.db
```

---

# 📄 Create `.env.example` Files

It is recommended to include example environment files so another developer knows which configuration values are required.

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

Never place actual passwords, private keys, or production secrets inside `.env.example`.

---

# 👑 Creating the First Admin Account

Since public registration should be disabled, the first Admin account must be created manually or through the project's Admin seed script.

---

## Method 1: Create Admin Manually

### Step A: Create Firebase Authentication User

Open:

```text
Firebase Console
→ Authentication
→ Users
→ Add User
```

Enter:

- Admin email address.
- Secure password.

Create the user.

Copy the user's Firebase UID.

---

### Step B: Create Admin Profile in Firestore

Open:

```text
Firebase Console
→ Firestore Database
```

Create the required user collection if it does not already exist.

For example:

```text
users
```

Create a document whose Document ID matches the Firebase Authentication UID.

Example fields:

```text
name: "System Administrator"
email: "admin@example.com"
employeeId: "ADMIN001"
role: "admin"
isActive: true
forcePasswordChange: false
```

### Important

The exact collection name, field names, and role values must match the source code.

For example, if the source code expects:

```text
Admin
```

instead of:

```text
admin
```

use the exact expected value.

---

## Method 2: Use the Admin Seed Script

If the backend contains an Admin seeding script inside:

```text
backend/scripts/
```

use the actual script provided by the project.

For example:

```bash
node scripts/seedAdmin.js
```

The exact filename may differ. Check the `scripts` folder and `package.json`.

---

# 🔒 Firestore Security Rules

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

Initialize Firebase if necessary:

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

If the project includes:

```text
firestore.indexes.json
```

deploy indexes using:

```bash
firebase deploy --only firestore:indexes
```

### Never use insecure production rules such as:

```javascript
allow read, write: if true;
```

This would allow unrestricted access to the database.

---

# ▶️ Running the Application

Once all dependencies and Firebase configuration are complete, start the backend and frontend separately.

---

## Step 13: Start the Backend

Open a terminal:

```bash
cd backend
```

Install dependencies if not already installed:

```bash
npm install
```

Start the backend using the appropriate script:

```bash
npm run dev
```

If the project does not contain a `dev` script, try:

```bash
npm start
```

The backend will typically run at:

```text
http://localhost:5000
```

Check the terminal output for the exact port.

---

## Step 14: Start the Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies if necessary:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will typically run at:

```text
http://localhost:5173
```

Open this address in a browser.

---

# 🔐 Authentication Request Flow

When a user logs in:

```text
User Enters Email and Password
            ↓
Firebase Authentication Verifies Credentials
            ↓
Firebase Generates ID Token
            ↓
Frontend Stores Authentication Session
            ↓
Frontend Sends API Request
            ↓
Authorization: Bearer <firebase-id-token>
            ↓
Backend Authentication Middleware
            ↓
Firebase Admin SDK Verifies Token
            ↓
Backend Retrieves User Role
            ↓
RBAC Middleware Checks Permission
            ↓
Authorized Request Continues
```

---

# 🗄️ Main Firestore Collections

Depending on the final project version, the application may use collections such as:

```text
users
leaveRequests
leaveBalances
holidays
notifications
auditLogs
```

### Users

Stores:

- Firebase UID
- Employee ID
- Name
- Email
- Department
- Designation
- Role
- Account status
- Assigned officers

### Leave Requests

Stores:

- Employee UID
- Leave type
- Start date
- End date
- Number of leave days
- Reason
- Current status
- Reporting Officer decision
- Reviewing Officer decision
- Approving Authority decision
- Remarks
- Timestamps

### Leave Balances

Stores available balances for supported leave types.

### Holidays

Stores organizational holiday information.

### Notifications

Stores system-generated notifications for users.

### Audit Logs

Stores important actions performed within the application.

---

# 🧪 Recommended Testing Procedure

After setup, test the application in this sequence:

1. Start the backend.
2. Start the frontend.
3. Login as Admin.
4. Verify Admin Dashboard access.
5. Create an Employee account.
6. Login as Employee.
7. Verify Employee Dashboard.
8. Submit a leave application.
9. Login as Reporting Officer.
10. Review the leave request.
11. Login as Reviewing Officer.
12. Review the forwarded request.
13. Login as Approving Authority.
14. Approve or reject the request.
15. Login as Employee.
16. Verify final status.
17. Check leave balance.
18. Check notifications.
19. Check Firestore records.
20. Verify that unauthorized users cannot access restricted modules.

---

# 🧰 Troubleshooting

## Error: `serviceAccountKey.json` Not Found

Verify that the file exists at:

```text
backend/firebase/serviceAccountKey.json
```

Make sure the filename matches exactly:

```text
serviceAccountKey.json
```

---

## Error: Firebase Authentication Fails

Check:

- Email/Password authentication is enabled.
- Firebase frontend credentials are correct.
- The `.env` file exists.
- All Vite variables begin with `VITE_`.
- The frontend development server was restarted after editing `.env`.

---

## Error: `401 Unauthorized`

Possible causes:

- User is not logged in.
- Firebase ID Token is missing.
- Token is invalid.
- Token has expired.
- Frontend is not sending the Authorization header.

Expected format:

```text
Authorization: Bearer <firebase-id-token>
```

---

## Error: `403 Forbidden`

A `403 Forbidden` response usually means the user is authenticated but does not have permission to access the requested resource.

Check:

- User role.
- Firestore user profile.
- Account status.
- Role spelling and capitalization.
- RBAC middleware configuration.

---

## Error: CORS Blocked

Verify that the backend allows requests from:

```text
http://localhost:5173
```

Check the backend `.env`:

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

deploy indexes using:

```bash
firebase deploy --only firestore:indexes
```

---

## Error: Email Notifications Not Working

Check:

- Email credentials.
- Environment-variable names.
- App Password configuration.
- Email service setup.
- Backend console logs.

Depending on the implementation, the main ILMS functionality may continue to work even if email notification delivery fails.

---

## Error: Frontend Cannot Connect to Backend

Check:

- Backend is running.
- Correct backend port is configured.
- `VITE_API_BASE_URL` is correct.
- CORS allows the frontend origin.
- No firewall is blocking the local port.

Example:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

# 🔐 Security Best Practices

Never share or upload:

```text
.env
serviceAccountKey.json
Firebase private keys
Email passwords
Production secrets
API secrets
```

Before uploading the project to GitHub, run:

```bash
git status
```

Verify that no sensitive files are being tracked.

If a Firebase Service Account Key is accidentally exposed publicly:

1. Immediately revoke or delete the compromised key.
2. Generate a new Service Account Key.
3. Update the backend configuration.
4. Review Firebase and Google Cloud audit logs where applicable.

---

# 📋 Quick Setup Summary

Follow these steps in order:

1. Install Node.js and npm.
2. Extract the ILMS project.
3. Open it in Visual Studio Code.
4. Run `npm install` in the frontend.
5. Run `npm install` in the backend.
6. Create a Firebase project.
7. Enable Firebase Authentication.
8. Enable Email/Password login.
9. Create Firestore Database.
10. Register a Firebase Web App.
11. Create `frontend/.env`.
12. Generate Firebase Admin SDK Service Account Key.
13. Add `serviceAccountKey.json` to the correct backend folder.
14. Create `backend/.env`.
15. Configure email credentials if email functionality is required.
16. Deploy Firestore Security Rules.
17. Deploy Firestore indexes if required.
18. Create the first Admin account.
19. Start the backend.
20. Start the frontend.
21. Login and test all user roles.

---

# 💻 Quick Start Commands

## Terminal 1 — Backend

```bash
cd backend
npm install
npm run dev
```

## Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the frontend in a browser:

```text
http://localhost:5173
```

---

# 🚫 Files That Should Not Be Shared

The following files should remain private:

```text
frontend/.env
backend/.env
backend/firebase/serviceAccountKey.json
```

Instead, share:

```text
frontend/.env.example
backend/.env.example
```

This allows another developer to create their own configuration without exposing your private credentials.

---

# 🌟 Future Scope

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

# 📌 Project Information

**Project Title:** Internal Leave Management System (ILMS)

**Project Type:** Full-Stack Web Application

**Developers:**

- Suprakash Debnath
- Chayanika Debnath

**Frontend:** React.js + Vite

**Backend:** Node.js + Express.js

**Database:** Firebase Firestore

**Authentication:** Firebase Authentication

**Security:** Firebase ID Tokens, RBAC, Helmet, CORS, Protected APIs, Firestore Security Rules

---

# 👨‍💻 Authors

### Suprakash Debnath

Project Developer

### Chayanika Debnath

Project Developer

---

# 📄 License and Usage

This project was developed as part of an internship and academic software development project.

The source code, documentation, and associated materials should be used in accordance with the permissions and requirements of the project developers, internship organization, and associated educational institution.

---

# 🙏 Acknowledgement

We would like to express our sincere gratitude to our internship mentor and all individuals who provided guidance, feedback, and support throughout the development of the **Internal Leave Management System (ILMS)**.

Their valuable suggestions and encouragement contributed significantly to the successful completion of this project.

---

<p align="center">
  <strong>Internal Leave Management System (ILMS)</strong>
</p>

<p align="center">
  Developed by <strong>Suprakash Debnath</strong> and <strong>Chayanika Debnath</strong>
</p>