# Company CRM

A CRM with separate admin, HR and employee portals: lead pipeline, call logs, attendance, tasks, tickets, documents and subscriptions. Built with Next.js, TypeScript, Tailwind and shadcn/ui.

## Local database

The app runs on a database that lives in the browser (`lib/localDb.ts`), so it needs no hosted backend and never goes down because a database paused. It implements the parts of the Supabase client the app uses (queries, filters, joins such as `assigned_to(full_name)`, auth and file storage), and saves everything in `localStorage`.

- Demo data is created on the first visit from `lib/seedData.ts`, with dates relative to today.
- Changes are kept in that browser until you click **Reset demo data** on the login page.
- Each visitor gets their own copy, so nothing they change affects anyone else.

## Demo logins

Use the one-click buttons on the login page, or sign in by hand:

| Profile  | Email               | Password   |
| -------- | ------------------- | ---------- |
| Admin    | admin@demo.crm      | demo1234   |
| Employee | employee@demo.crm   | demo1234   |
| HR       | hr@demo.crm         | demo1234   |

## Run it

```bash
npm install
npm run dev
```

## NestJS API (initial backend)

The `backend/` directory contains the first NestJS API, using your Supabase project's PostgreSQL database directly. It currently provides health checks, JWT login/current-user endpoints, and role-scoped lead endpoints. The Next.js app is **not connected to this API yet**; it continues to use the browser-only demo database until frontend integration is done.

1. Apply `backend/database/migrations/001_create_crm_users.sql` to the existing Supabase database. This is additive and creates the API authentication table; it does not seed demo data.
2. In `backend/`, copy `.env.example` to `.env` and set `DATABASE_URL`, `JWT_SECRET` (at least 32 random characters), and `FRONTEND_ORIGIN`. Use the PostgreSQL connection string from Supabase, not the anon or service-role key.
3. Install and start the API:

   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

4. Create real API users after applying the migration. Associate each with its existing `"Employee Directory"` UUID when applicable:

   ```bash
   npm run build
   npm run user:create -- person@company.com employee <employee-uuid>
   ```

   Use `admin` or `hr` instead of `employee` for those roles. Never use the demo passwords for real accounts.

The API listens on port 4000 by default. Routes are prefixed with `/api/v1`; check `GET /api/v1/health`, use `POST /api/v1/auth/login`, then send the returned bearer token to `/api/v1/auth/me` and `/api/v1/leads`.

**Production caution:** do not run `supabase/recreate_database.sql` against a live database; it drops tables and includes public-access policies. Before production, review and remove any permissive public Supabase/PostgREST policies, secure database credentials, and complete the remaining CRM modules and frontend integration.
