# LeaveFlow — Professional Leave Management System

LeaveFlow is a full-stack leave management platform for employees, administrators and three approval levels. It uses React 19, Vite, Express 5, Firebase Authentication and Firestore.

## What is included

- Secure Firebase login, forgot password, remember-me sessions and protected role routes
- Employee overview, profile editing, password changes and live leave balances
- Holiday/weekend-aware leave applications with overlap, date and balance validation
- Casual, medical, earned, half-pay and duty leave balances with deduction, restoration and history
- Assignment-aware Reporting Officer → Reviewing Officer → Approving Authority workflow
- Complete status timeline, remarks, notifications, cancellation and audit logs
- Admin employee CRUD, role/approval-chain assignment, activation and password reset
- Organisation-wide leave history with search, filter, sorting and CSV export
- Admin reports with date/department/type filters, print-to-PDF and CSV/Excel-compatible export
- Holiday administration, responsive UI, dark mode, loading/error/empty states and confirmation prompts
- Firestore rules, deployment templates, tests and technical documentation

## Quick start

Prerequisites: Node.js 20+, a Firebase project with Authentication and Firestore enabled, and a Firebase Admin service account.

1. Copy `backend/.env.example` to `backend/.env`.
2. Put the service account at `backend/firebase/serviceAccountKey.json`, or set `FIREBASE_SERVICE_ACCOUNT_JSON`.
3. Copy `frontend/.env.example` to `frontend/.env` and add the Firebase web-app configuration.
4. Install dependencies:

   ```bash
   npm run install:all
   ```

5. In separate terminals:

   ```bash
   npm run dev:backend
   npm run dev:frontend
   ```

6. Open `http://localhost:5173`.

An initial admin must be created in Firebase Authentication and a matching Firestore `users/{uid}` document must contain:

```json
{
  "name": "System Administrator",
  "email": "admin@example.com",
  "role": "admin",
  "department": "HR",
  "designation": "Administrator",
  "isActive": true
}
```

## Verification

```bash
npm test
npm run build
```

The repository contains no required secret. Never commit `.env` or `serviceAccountKey.json`; both are ignored.

## Documentation

- [System architecture](docs/ARCHITECTURE.md)
- [API reference](docs/API.md)
- [User guide](docs/USER_GUIDE.md)
- [Testing guide](docs/TESTING.md)
- [Deployment guide](docs/DEPLOYMENT.md)
- [Project report](docs/PROJECT_REPORT.md)

## Important production note

Email is optional and safely skipped when SMTP credentials are missing. Supporting documents currently use a secure external URL rather than binary upload; this keeps the deployment storage-provider neutral. Add Firebase Storage or an approved document service if local upload is mandatory.
