# Deployment Guide

## Firebase setup

Enable Email/Password Authentication and Cloud Firestore. Register a web app and place its public configuration in frontend environment variables. Create a backend service account and store its complete JSON in the hosting provider secret `FIREBASE_SERVICE_ACCOUNT_JSON`.

Deploy rules and indexes:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## Frontend

Build with `npm ci && npm run build` inside `frontend`. Deploy `frontend/dist` to Firebase Hosting, Netlify or Vercel. Set all `VITE_FIREBASE_*` values and `VITE_API_URL` before building.

For Firebase Hosting:

```bash
npm run build --prefix frontend
firebase deploy --only hosting
```

## Backend

`render.yaml` provides a Render blueprint. Set `FRONTEND_URL`, `FIREBASE_SERVICE_ACCOUNT_JSON`, and optional email secrets. The health check is `/api/health`.

## Final production checks

- Use HTTPS only.
- Restrict `FRONTEND_URL` to the deployed origin.
- Rotate any credential that has previously been shared or committed.
- Deploy Firestore rules before adding production data.
- Create the first admin manually, then create all other accounts in the UI.
- Configure Firestore backups, provider log retention and uptime monitoring.
