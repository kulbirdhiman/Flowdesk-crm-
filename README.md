# CRM Docker setup

Requires Docker Desktop (running) and Docker Compose v2.

```sh
cp .env.example .env
docker compose up --build -d
```

Compose starts PostgreSQL, applies committed Prisma migrations, starts the NestJS backend and Next.js frontend, and runs Prisma Studio. The first frontend build needs internet access to download its Google fonts.

| Service | Local address |
| --- | --- |
| Frontend | http://localhost:3000 |
| Backend | http://localhost:4000 |
| Prisma Studio | http://localhost:5555 |
| PostgreSQL | localhost:5432 |

Ports and local database credentials can be changed in the root `.env`. Keep `POSTGRES_*` settings out of `backend/.env`: Compose can load that file when run from the backend directory, overriding the root settings. Changing `POSTGRES_PASSWORD` does not change the password already stored in an existing PostgreSQL volume. All published ports bind to localhost. Use URL-safe database credentials (or percent-encode them in the connection URL). The root `.env` is used by Compose; the existing `backend/.env` is not copied into images. Optional Observe credentials can be added to the backend service environment if needed.

PostgreSQL data persists in the `postgres_data` volume across container restarts. `docker compose down` stops the stack without removing database data. `docker compose down -v` deletes the database volume and all its data.

```sh
docker compose ps
docker compose logs -f backend
docker compose logs migrate
```

## Prisma workflow

The PostgreSQL schema is in `backend/prisma/schema.prisma`. The initial migration creates a starter `User` table; it does not implement authentication or migrate the frontend's existing browser/local data. Inject `PrismaService` into NestJS services to implement database-backed APIs.

After editing the schema, create and apply a development migration using the running local database:

```sh
docker compose run --rm --user root -v "./backend/prisma:/app/prisma" backend npm run prisma:migrate:dev -- --name describe_change
docker compose up --build -d
```

Commit the schema and generated migration SQL. Rebuilding regenerates the client and the migration service applies pending migrations before the backend starts. The migration command above is for local development; container startup uses `prisma migrate deploy`.

To run backend tooling outside Docker, install dependencies in `backend`, merge `backend/.env.example` values into your local `backend/.env`, then run:

```sh
cd backend
npm ci
npm run prisma:generate
npm run prisma:migrate:deploy
npm run start:dev
# In another terminal inside backend:
npm run prisma:studio
```

The host database URL uses `localhost`; containers use the Compose service name `postgres`. Prisma configuration follows the [Prisma config reference](https://www.prisma.io/docs/orm/v7/reference/prisma-config-reference).

## Authentication API

Auth uses TypeORM repositories (`@InjectRepository(User)`, `Repository<User>`) against the same tables managed by Prisma. TypeORM schema synchronization is disabled. Continue creating migrations with Prisma and viewing data in Studio; do not enable TypeORM synchronization.

A random JWT secret has been created in the local environment files. For a fresh checkout, generate one with `openssl rand -hex 32` and set `JWT_SECRET` in the root `.env` before starting Compose. For host development, also set it in `backend/.env`. Use `COOKIE_SECURE=true` with HTTPS in production; local HTTP uses false.

| Endpoint | Body / credentials |
| --- | --- |
| `POST /auth/register` | `{ "name": "Sam", "email": "sam@example.com", "password": "a-strong-password" }` |
| `POST /auth/login` | `{ "email": "sam@example.com", "password": "a-strong-password" }` |
| `POST /auth/refresh` | HTTP-only refresh cookie |
| `POST /auth/logout` | HTTP-only refresh cookie |
| `GET /auth/me` | `Authorization: Bearer <accessToken>` |
| `POST /auth/change-password` | Bearer token plus `{ "currentPassword": "...", "newPassword": "..." }` |
| `POST /auth/forgot-password` | `{ "email": "sam@example.com" }` |
| `POST /auth/reset-password` | `{ "token": "<token from email>", "newPassword": "..." }` |

Passwords require at least 12 characters and at most 72 UTF-8 bytes. Registration creates employees; role/status input is rejected. Access tokens expire after 15 minutes; refresh sessions have a seven-day absolute expiry and rotate on each refresh. Logout and password changes revoke server-side sessions, including their access tokens. Password-reset tokens expire after one hour and can be used once. Auth routes allow 10 requests per route per IP per minute in this single-instance setup.

Login and refresh return `{ accessToken, user }`; keep the access token in frontend memory. Send `credentials: 'include'` on browser login/refresh/logout requests so the browser handles the refresh cookie. For protected routes, use `JwtAuthGuard`; add role checks when implementing privileged business endpoints. Public registration never grants elevated roles.

Local password-reset emails are captured by Mailpit at http://localhost:8025 (SMTP port 1025). Real delivery requires `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM` configured for your email provider. Reset emails link to `${FRONTEND_URL}/reset-password?token=...`; the frontend reset form and existing login/AuthContext integration remain to be implemented. The backend reset API can be tested directly with the emailed token. Tokens are not returned by the forgot-password endpoint or logged.

Auth events are written to the Nest logger without passwords or tokens. This project does not have the example's property/tenant model or a persistent audit-log service.

After starting the Compose stack, run the database/email integration test from the root:

```sh
node --test backend/test/auth.integration.mjs
```

It covers registration, duplicate emails, rejected role injection, login, refresh rotation/replay, origin checks, logout, password changes, email delivery, one-time password reset, and session revocation. It removes its temporary account afterward.

### Injecting the user service

`UsersModule` exports `UsersService`. Import `UsersModule` in a consuming module's `imports`, then inject `constructor(private readonly usersService: UsersService) {}` into its service. `AuthModule` already does this for registration.

Available service methods are `create({ name, email, password })`, `findById(id)`, `update(id, { name?, email? })`, and `delete(id)`. Create hashes the password; results exclude it. Unknown users produce 404 and duplicate emails produce 409. Deleting a user also deletes their refresh/reset tokens through database foreign keys. Use the auth password-change method for password updates. These are injectable service methods; user CRUD HTTP routes have not been exposed.
