# LeaveFlow Project Report

## Abstract

LeaveFlow replaces manual leave registers and fragmented approval messages with a secure, role-aware web system. Employees receive clear balances and status visibility, officers work from assignment-specific queues, and administrators gain auditable workforce records and reports.

## Objectives

The system centralises employee management, validates leave eligibility, automates a three-level approval workflow, maintains balance integrity, delivers notifications, supports reporting, and provides a professional responsive interface.

## Technology

React 19 and Vite provide the client application. Express 5 exposes a REST API. Firebase Authentication provides identity; Firestore stores profiles, requests, balances, notifications, holidays and audit data. Helmet, CORS, rate limiting, validation, ownership checks and deny-by-default Firestore rules form the security layer.

## Major modules

1. Authentication and role routing
2. Employee dashboard, profile and leave application
3. Leave balance and balance history
4. Three-level officer workflow and status timeline
5. User, holiday and leave administration
6. In-app/email notifications
7. Reports and CSV/PDF-compatible export
8. Audit logging, security and deployment configuration

## Validation and integrity

The API rejects reversed dates, all-non-working ranges, overlaps and insufficient balances. Half days count as 0.5 and require a single date. Final approval checks balance again and records deduction history. Future approved cancellation restores the balance. Transactions protect decision state and balance changes from duplicate actions.

## Outcome and future scope

The delivered application covers the complete core workflow and is ready for environment configuration and acceptance testing. Future extensions can add binary Firebase Storage uploads, scheduled policy-specific accrual jobs, attendance integration, multilingual content and organisation-specific email templates.
