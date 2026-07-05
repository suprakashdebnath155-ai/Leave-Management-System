# System Architecture

## Component view

```mermaid
flowchart LR
  U["Browser / React SPA"] -->|"Firebase sign-in"| A["Firebase Authentication"]
  U -->|"Bearer ID token"| API["Express API"]
  API -->|"verifyIdToken"| A
  API -->|"role + ownership checks"| DB["Cloud Firestore"]
  API --> MAIL["Optional email service"]
  API --> AUDIT["Audit logs"]
  DB --> USERS["users"]
  DB --> LEAVES["leaveRequests"]
  DB --> BAL["leaveBalances + balanceHistory"]
  DB --> NOTE["notifications"]
  DB --> HOL["holidays"]
```

## Approval workflow

```mermaid
flowchart TD
  E["Employee submits request"] --> V{"Dates, overlap and balance valid?"}
  V -->|No| X["Return actionable validation error"]
  V -->|Yes| R["Pending with Reporting Officer"]
  R -->|Reject| RJ["Rejected"]
  R -->|Recommend| RV["Pending with Reviewing Officer"]
  RV -->|Reject| RJ
  RV -->|Recommend| AP["Pending with Approving Authority"]
  AP -->|Reject| RJ
  AP -->|Approve| D["Deduct balance atomically"]
  D --> OK["Approved"]
  E -. "Cancel pending request" .-> C["Cancelled"]
  OK -. "Cancel future approved request" .-> RS["Restore balance"]
  RS --> C
```

## Data model

```mermaid
erDiagram
  USERS ||--|| LEAVE_BALANCES : owns
  USERS ||--o{ LEAVE_REQUESTS : submits
  USERS ||--o{ NOTIFICATIONS : receives
  USERS ||--o{ AUDIT_LOGS : performs
  LEAVE_REQUESTS ||--o{ BALANCE_HISTORY : changes

  USERS {
    string uid PK
    string employeeId
    string name
    string email
    string role
    string department
    string designation
    string reportingOfficerId
    string reviewingOfficerId
    string approvingAuthorityId
    boolean isActive
  }
  LEAVE_REQUESTS {
    string id PK
    string employeeId FK
    string leaveType
    string startDate
    string endDate
    number daysRequested
    string status
    string reportingStatus
    string reviewingStatus
    string approvingStatus
    array approvalHistory
  }
  LEAVE_BALANCES {
    string employeeId PK
    number casualLeaveBalance
    number medicalLeave
    number earnedLeave
    number halfPayLeave
    number dutyLeave
  }
  NOTIFICATIONS {
    string id PK
    string userId FK
    string title
    string message
    boolean isRead
  }
  BALANCE_HISTORY {
    string id PK
    string employeeId FK
    string leaveId FK
    string action
    number days
  }
  AUDIT_LOGS {
    string id PK
    string actorId FK
    string action
    string entityType
    string entityId
  }
```

## Security boundaries

The browser accesses Firestore only through the Express API. Firestore rules deny direct client reads and writes. Every protected API validates the Firebase ID token, checks the Firestore profile is active, and enforces roles plus request ownership/assignment. Firebase Admin credentials exist only on the backend.
