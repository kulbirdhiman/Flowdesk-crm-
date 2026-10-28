import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { test } from 'node:test';

// Requires the local Compose backend, PostgreSQL, and Mailpit services.
test('register, login, refresh rotation, logout, password change and single-use reset', async () => {
  const email = `auth-test-${randomUUID()}@example.com`;
  const password = 'Initial-password-123';
  const updatedPassword = 'Changed-password-456';
  const resetPassword = 'Reset-password-789';
  let cookie;
  const base = process.env.AUTH_TEST_URL ?? 'http://localhost:4000';
  async function request(path, data, status, token, headers = {}) {
    const response = await fetch(`${base}/auth/${path}`, {
      method: data === undefined ? 'GET' : 'POST',
      headers: { 'content-type': 'application/json', ...(cookie ? { cookie } : {}), ...(token ? { authorization: `Bearer ${token}` } : {}), ...headers },
      ...(data === undefined ? {} : { body: JSON.stringify(data) }),
    });
    const body = response.status === 204 ? null : await response.json();
    assert.equal(response.status, status, `${path}: ${JSON.stringify(body)}`);
    const nextCookie = response.headers.get('set-cookie');
    if (nextCookie) cookie = nextCookie.split(';')[0];
    return body;
  }
  try {
    await request('register', { name: 'Auth Integration', email, password, role: 'ADMIN' }, 400);
    const user = await request('register', { name: 'Auth Integration', email, password }, 201);
    assert.equal(user.role, 'EMPLOYEE');
    assert.equal(user.password, undefined);
    await request('register', { name: 'Duplicate', email, password }, 409);
    await request('login', { email, password: 'incorrect' }, 401);
    const login = await request('login', { email, password }, 200);
    assert.equal(login.refreshToken, undefined);
    const oldCookie = cookie;
    await request('me', undefined, 200, login.accessToken);
    await request('refresh', {}, 403, undefined, { origin: 'https://untrusted.example' });
    const refreshed = await request('refresh', {}, 200);
    assert.notEqual(cookie, oldCookie);
    const newCookie = cookie;
    cookie = oldCookie;
    await request('refresh', {}, 401);
    cookie = newCookie;
    await request('logout', {}, 204);
    await request('me', undefined, 401, refreshed.accessToken);
    const second = await request('login', { email, password }, 200);
    await request('change-password', { currentPassword: password, newPassword: updatedPassword }, 204, second.accessToken);
    await request('me', undefined, 401, second.accessToken);
    await request('login', { email, password }, 401);
    const third = await request('login', { email, password: updatedPassword }, 200);
    const forgot = await request('forgot-password', { email }, 200);
    assert.equal(forgot.resetToken, undefined);
    const mailUrl = process.env.AUTH_TEST_MAIL_URL ?? 'http://localhost:8025';
    const messages = await (await fetch(`${mailUrl}/api/v1/messages`)).json();
    const message = messages.messages.find(m => m.To.some(to => to.Address === email));
    assert.ok(message, 'Reset email was delivered to Mailpit');
    const mail = await (await fetch(`${mailUrl}/api/v1/message/${message.ID}`)).json();
    const token = mail.Text.match(/token=([a-f0-9]{64})/)?.[1];
    assert.ok(token, 'Reset email contains token');
    await request('reset-password', { token, newPassword: resetPassword }, 204);
    await request('reset-password', { token, newPassword: password }, 400);
    await request('me', undefined, 401, third.accessToken);
    await request('login', { email, password: resetPassword }, 200);
    await fetch(`${mailUrl}/api/v1/messages`, { method: 'DELETE', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ IDs: [message.ID] }) });
  } finally {
    // Delete only this test's account; token rows cascade through database FKs.
    execFileSync('docker', ['compose', 'exec', '-T', 'backend', 'node', '--input-type=module', '-e',
      `import pg from 'pg';const c=new pg.Client({connectionString:process.env.DATABASE_URL});await c.connect();await c.query('DELETE FROM "User" WHERE email = $1',[${JSON.stringify(email)}]);await c.end();`], { stdio: 'pipe' });
  }
});
