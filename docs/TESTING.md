# Testing Guide

## Automated checks

```bash
npm test
npm run build
```

Backend tests cover weekend/holiday calculation, half days and invalid date ranges. Frontend checks include ESLint and the production Vite build.

## Manual acceptance checklist

1. Login: valid/invalid credentials, remember me and forgot password.
2. Roles: direct URL access must redirect to the role home.
3. Employee: submit standard, half-day, emergency, overlap and insufficient-balance cases.
4. Workflow: verify assignment at every stage, duplicate decision prevention and remarks.
5. Balance: approve, cancel future approved leave and inspect the ledger.
6. Admin: CRUD, self-deactivation/self-deletion prevention, filters and reports.
7. Security: call protected APIs without token, with wrong role and while inactive.
8. Responsive: 390px, tablet and desktop; navigation, forms, tables and modals.
9. Firestore: deploy rules and confirm direct client database access is denied.
10. Email: verify graceful operation with and without SMTP credentials.
