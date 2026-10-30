import 'dotenv/config';
import pg from 'pg';
import bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';

const {
  ADMIN_EMAIL: email,
  ADMIN_NAME: name = 'Administrator',
  ADMIN_PASSWORD: password,
  DATABASE_URL,
} = process.env;
if (
  !email ||
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
  !password ||
  password.length < 12 ||
  Buffer.byteLength(password) > 72 ||
  !DATABASE_URL
) {
  throw new Error(
    'Set DATABASE_URL, ADMIN_EMAIL and ADMIN_PASSWORD (12–72 UTF-8 bytes). ADMIN_NAME is optional.',
  );
}
const db = new pg.Client({ connectionString: DATABASE_URL });
try {
  const hash = await bcrypt.hash(password, 12);
  await db.connect();
  // Never replace an existing account or silently promote it.
  await db.query(
    'INSERT INTO "User" (id, name, email, password, role, status, "updatedAt") VALUES ($1, $2, $3, $4, \'ADMIN\', \'ACTIVE\', NOW())',
    [randomUUID(), name, email.trim().toLowerCase(), hash],
  );
  console.log(
    'Administrator created. Sign in through the frontend to provision the employee profile.',
  );
} finally {
  await db.end();
}
