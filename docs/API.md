# API Reference

Base URL: `/api`. Protected requests require `Authorization: Bearer <Firebase ID token>`.

## Authentication and profile

| Method | Endpoint | Role | Purpose |
|---|---|---|---|
| POST | `/auth/create-employee` | Admin | Create Auth user, profile and balance |
| GET | `/auth/me` | Any | Current profile |
| PATCH | `/auth/me` | Any | Update allowed profile fields |
| GET | `/auth/admin` | Admin | Admin authorization check |

## Leaves

| Method | Endpoint | Role | Purpose |
|---|---|---|---|
| POST | `/leaves/apply` | Employee | Submit validated request |
| GET | `/leaves/my-leaves` | Employee | Employee history |
| GET | `/leaves/balance` | Employee | Current balance |
| GET | `/leaves/balance/history` | Employee | Balance ledger |
| PATCH | `/leaves/:id/cancel` | Employee | Cancel owned request |
| GET | `/leaves/all` | Admin | Filterable organisation records |
| GET | `/leaves/reporting/pending` | Reporting Officer | Assigned queue |
| PUT | `/leaves/reporting/:id/review` | Reporting Officer | Recommend/reject |
| GET | `/leaves/reviewing/pending` | Reviewing Officer | Assigned queue |
| PUT | `/leaves/reviewing/:id/review` | Reviewing Officer | Recommend/reject |
| GET | `/leaves/approving/pending` | Approving Authority | Assigned queue |
| PUT | `/leaves/approving/:id/review` | Approving Authority | Approve/reject |
| GET | `/leaves/:id` | Assigned/owner/admin | Request detail |

Application payload:

```json
{
  "leaveType": "Casual Leave",
  "startDate": "2026-07-10",
  "endDate": "2026-07-11",
  "reason": "Family commitment requiring travel.",
  "halfDay": false,
  "emergency": false,
  "attachmentUrl": ""
}
```

Decision payload: `{ "decision": "recommended", "remark": "Coverage confirmed." }`.

## Administration

| Method | Endpoint | Role | Purpose |
|---|---|---|---|
| GET | `/users` | Admin | Search/filter users |
| PATCH | `/users/:id` | Admin | Edit profile, role and chain |
| PATCH | `/users/:id/status` | Admin | Activate/deactivate |
| POST | `/users/:id/reset-password` | Admin | Generate reset link |
| DELETE | `/users/:id` | Admin | Delete account/profile |
| GET/POST | `/holidays` | Any/Admin | List/add holidays |
| DELETE | `/holidays/:id` | Admin | Remove holiday |
| GET | `/reports` | Admin | Aggregated filtered report |

## Dashboards and notifications

Dashboard endpoints are `/dashboard/employee`, `/dashboard/admin`, `/dashboard/reporting`, `/dashboard/reviewing`, and `/dashboard/approving`.

Notifications: `GET /notifications/my`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all`, and `DELETE /notifications/:id`.

All responses use `{ "success": true, ... }` or `{ "success": false, "message": "..." }`.
