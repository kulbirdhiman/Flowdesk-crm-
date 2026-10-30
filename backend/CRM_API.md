# Frontend-connected CRM backend

The Next.js screens now use NestJS at `NEXT_PUBLIC_API_URL` (default `http://localhost:4000`). Browser-only demo mode must be explicitly enabled with `NEXT_PUBLIC_DEMO_MODE=true` at build time. Production login uses the existing JWT authentication service; access tokens stay in memory and refresh tokens stay in HTTP-only cookies.

## Services and APIs

| Service | API | Frontend use |
| --- | --- | --- |
| Authentication | Existing `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me`, `/auth/change-password`, `/auth/forgot-password`, `/auth/reset-password` | Login, session restoration, logout and password recovery |
| Employee profile | `GET /crm/profile` | Creates/links the signed-in employee profile and legacy user mapping; supplies the authenticated role |
| Login accounts | `GET /crm/accounts`, `POST /crm/accounts`, `PATCH /crm/accounts/:id` | Administrator account creation, roles and active/inactive access at `/dashboard/accounts` |
| Leads and calls | `POST /crm/resources/Leads/query`, `POST /crm/resources/Calls/query` | Lead CRUD, assignments, stages, follow-ups, call history and data for dashboard calculations |
| People | Same query endpoint with `Employee Directory`, `Departments`, `Teams`, `Users`, `Employee Documents` | Directory, organization and employee documents |
| Attendance and tasks | Same endpoint with `Attendance` and `tasks` | Check-in/out, history, task creation and status changes |
| Shared documents | Same endpoint with `documents`, `document_assignments` | Document metadata, employee assignments and permissions |
| Subscriptions | Same endpoint with `subscriptions`, `subscription_users`, `credentials` | Subscription tracking, assigned users and admin-only credentials |
| Support | Same endpoint with `tickets`, `ticket_assignments`, `ticket_chat`, `ticket_history` | Support queue, assignment, messages and history |
| Admin notes | Same endpoint with `admin_notes` | Page notes |
| Private files | `POST /crm/files` | Upload, download, list, delete and sign; 10 MB per file |
| Download links | `GET /crm/files/content/:id?expires=...&signature=...` | Validated five-minute file links |

All CRM APIs require a bearer token except signed file downloads. No Supabase account or key is required.

## Query contract

The adapter in `frontend/lib/apiClient.ts` preserves existing `supabase.from(...).select(...).eq(...)` screen calls and sends an ordered operation list:

```http
POST /crm/resources/Leads/query
Authorization: Bearer <access token>
Content-Type: application/json

{"operations":[{"method":"select","args":["*,assigned_to(full_name)",{"count":"exact"}]},{"method":"eq","args":["stage","New"]},{"method":"order","args":["date_and_time",{"ascending":false}]},{"method":"range","args":[0,19]}]}
```

Responses use `{data,error,count,status,statusText}`. Insert/update/delete/upsert, filters, embedded relations, counts, sorting, inclusive ranges, single and nullable-single results are supported. Mutations must come first; updates/deletes require an equality, membership or match filter. Up to 500 inserted rows, 60 operations and 1 MB per CRM request are allowed. Unknown resources/methods are rejected.

Account creation accepts `{name,email,password,role?}` where role is `ADMIN`, `MANAGER` (HR in the UI) or `EMPLOYEE`. Password rules match registration. Account patch accepts `{role?,status?}` with `ACTIVE`/`INACTIVE`; administrators cannot change their own access through this endpoint. Account responses exclude password hashes. Profiles with matching official email are linked automatically at login.

File requests accept `{action,bucket,path,...}`. Upload adds base64 `content` and `mimeType`; actions are `upload`, `download`, `sign`, `remove`, `list`. `getPublicUrl()` in the adapter produces a persistent `crm-file://bucket/path` reference, not a publicly accessible URL. Document views resolve it to a fresh private download link.

## Access rules

- Administrators manage all CRM resources and login accounts.
- HR (`MANAGER`) sees employee HR information and manages attendance, employee documents, departments and teams. Credentials and login administration remain restricted to administrators.
- Employees see assigned leads, calls, tasks, documents, subscriptions and tickets, and their own attendance/profile. Other employee profiles expose only directory fields. Embedded relations use the same access scope.
- Employees can update lead disposition fields, manage their own tasks and attendance, log calls and append messages/history to assigned tickets. They cannot reassign records, change their role, or delete records. Employee-created tasks must be assigned to themselves; sharing tasks with other employees requires an administrator.
- Employees can attach only their own uploads. Files are readable by administrators, their uploader, assignees of tasks referencing them, or employees assigned documents with viewing and downloading enabled. Only administrators/uploaders may delete files.

Required fields, primary keys, unique emails, attendance employee/date pairs, assignment pairs and foreign references are validated before committing. Writes run in transactions under an advisory lock.

## Start and provision

From the repository root:

```sh
docker compose up --build -d
```

Create the first administrator using the running backend. The script creates a new account and refuses to replace or promote an existing account:

```sh
# Set these in your shell; use your own email and a strong password.
export ADMIN_EMAIL ADMIN_NAME ADMIN_PASSWORD
docker compose exec -e ADMIN_EMAIL -e ADMIN_NAME -e ADMIN_PASSWORD backend npm run admin:create
unset ADMIN_PASSWORD
```

Open `http://localhost:3000/login`, sign in, then use **Login Accounts** to create employee/HR accounts. The login email must match the employee's official email to link an existing directory entry. Password reset email is captured by Mailpit at `http://localhost:8025` locally. Configure SMTP for real delivery.

For host development, apply migrations and start the backend as described in the root README. Copy `frontend/.env.example` to `frontend/.env.local`, then run `npm run dev` in `frontend`. `NEXT_PUBLIC_*` values are compiled into frontend builds; rebuild after changing them. Compose passes the configured backend port into the frontend build.

## Validation

```sh
cd backend
npm run prisma:generate
npm run build
npm test
npm run test:crm-integration
```

The integration suite uses an isolated, in-memory PostgreSQL-compatible PGlite server on localhost port 55439 (`CRM_TEST_PORT` overrides it), applies all migrations and exercises actual Prisma persistence, HTTP bearer-guard handling with deterministic authenticated actors, account DTO validation, role guards, employee scoping, rollback and signed file sharing. It does not touch your application database. The existing auth integration suite still requires the Compose stack and Mailpit.

## Current limits

CRM records use PostgreSQL JSONB envelopes (`CrmRecord`) to preserve the frontend's varied legacy field names. File bytes are stored in `CrmFile`. This is a compatibility implementation for the existing UI: queries currently load records into a request-scoped engine and serialize behind one lock. Large deployments should move to indexed domain tables and SQL-side filtering/pagination. Database constraints cover envelope keys and file ownership; CRM field/reference constraints are enforced by the service.

Browser demo data is not automatically imported or seeded into the shared database. Fresh databases start empty, apart from profiles created on sign-in. The backend does not migrate browser uploads. Static prototype analytics/settings, real WhatsApp/SMS/telephony, background assignment jobs, external billing, realtime subscriptions and audit-event persistence are not implemented by this adapter. Existing frontend calculations run on the API data they fetch; auto-assignment still runs from the frontend. RPC returns an explicit unsupported error; the legacy channel adapter does not deliver realtime events.
