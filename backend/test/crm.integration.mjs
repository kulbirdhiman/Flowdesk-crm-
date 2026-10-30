import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { pathToFileURL, fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url)).replace(/\/$/, '');
const mod = (p) => import(pathToFileURL(`${root}/${p}`).href);
const { PGlite } = await mod('node_modules/@electric-sql/pglite/dist/index.js');
const { PGLiteSocketServer } = await mod(
  'node_modules/@electric-sql/pglite-socket/dist/index.js',
);
const { PrismaService } = await mod('dist/prisma/prisma.service.js');
const { CrmService } = await mod('dist/crm/crm.service.js');
const { FilesService } = await mod('dist/crm/files.service.js');
const db = new PGlite();
let server, prisma, app;
try {
  for (const dir of (
    await readdir(`${root}/prisma/migrations`, { withFileTypes: true })
  )
    .filter((d) => d.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name)))
    await db.exec(
      await readFile(
        `${root}/prisma/migrations/${dir.name}/migration.sql`,
        'utf8',
      ),
    );
  server = new PGLiteSocketServer({
    db,
    port: Number(process.env.CRM_TEST_PORT || 55439),
    host: '127.0.0.1',
  });
  await server.start();
  process.env.DATABASE_URL = `postgresql://postgres:postgres@127.0.0.1:${process.env.CRM_TEST_PORT || 55439}/postgres?connection_limit=1`;
  process.env.JWT_SECRET = 'test-secret-at-least-thirty-two-characters';
  prisma = new PrismaService();
  await prisma.$connect();
  const crm = new CrmService(prisma);
  const admin = {
    id: 'admin',
    email: 'admin@test.example',
    name: 'Admin',
    role: 'ADMIN',
  };
  const employee = {
    id: 'employee',
    email: 'employee@test.example',
    name: 'Employee',
    role: 'EMPLOYEE',
  };
  const bcrypt = await mod('node_modules/bcrypt/bcrypt.js');
  const password = await bcrypt.hash('Test-password-123', 4);
  for (const actor of [admin, employee])
    await prisma.user.create({
      data: { ...actor, password, status: 'ACTIVE' },
    });
  const a = await crm.profile(admin);
  const e = await crm.profile(employee);
  const query = (resource, operations, actor = admin) =>
    crm.query(resource, { operations }, actor);
  const select = { method: 'select', args: ['*'] };
  const created = await query('Leads', [
    {
      method: 'insert',
      args: [{ name: 'Test lead', assigned_to: e.whalesync_postgres_id }],
    },
    select,
    { method: 'single', args: [] },
  ]);
  const id = created.data.whalesync_postgres_id;
  assert.equal((await query('Leads', [select], employee)).data.length, 1);
  await query(
    'Leads',
    [
      { method: 'update', args: [{ stage: 'Converted' }] },
      { method: 'eq', args: ['whalesync_postgres_id', id] },
    ],
    employee,
  );
  assert.equal(
    (
      await query('Leads', [
        select,
        { method: 'eq', args: ['whalesync_postgres_id', id] },
        { method: 'single', args: [] },
      ])
    ).data.stage,
    'Converted',
  );
  await assert.rejects(
    query(
      'Leads',
      [
        { method: 'update', args: [{ assigned_to: a.whalesync_postgres_id }] },
        { method: 'eq', args: ['whalesync_postgres_id', id] },
      ],
      employee,
    ),
  );
  await query('Leads', [
    {
      method: 'insert',
      args: [{ name: 'Hidden', assigned_to: a.whalesync_postgres_id }],
    },
  ]);
  assert.equal((await query('Leads', [select], employee)).data.length, 1);
  await assert.rejects(
    query('Attendance', [
      {
        method: 'insert',
        args: [
          [
            { employee: e.whalesync_postgres_id, date: '2026-10-29' },
            { employee: e.whalesync_postgres_id, date: '2026-10-29' },
          ],
        ],
      },
    ]),
  );
  assert.equal(
    (await query('Attendance', [select])).data.length,
    0,
    'failed transaction rolled back',
  );
  const files = new FilesService(prisma, {
    getOrThrow: () => 'test-secret-at-least-thirty-two-characters',
  });
  await files.operation(
    {
      bucket: 'documents',
      path: 'test.pdf',
      action: 'upload',
      content: Buffer.from('pdf').toString('base64'),
      mimeType: 'application/pdf',
    },
    admin,
  );
  await assert.rejects(
    files.operation(
      { bucket: 'documents', path: 'test.pdf', action: 'download' },
      employee,
    ),
  );
  const doc = await query('documents', [
    {
      method: 'insert',
      args: [
        {
          title: 'Document',
          file_name: 'test.pdf',
          file_type: 'application/pdf',
          file_url: 'crm-file://documents/test.pdf',
          created_by: a.whalesync_postgres_id,
        },
      ],
    },
    select,
    { method: 'single', args: [] },
  ]);
  await query('document_assignments', [
    {
      method: 'insert',
      args: [
        {
          document_id: doc.data.id,
          employee_id: e.whalesync_postgres_id,
          can_view: true,
          can_download: true,
        },
      ],
    },
  ]);
  assert.equal(
    Buffer.from(
      (
        await files.operation(
          { bucket: 'documents', path: 'test.pdf', action: 'download' },
          employee,
        )
      ).content,
      'base64',
    ).toString(),
    'pdf',
  );
  const link = await files.operation(
    { bucket: 'documents', path: 'test.pdf', action: 'sign' },
    employee,
  );
  const url = new URL(link.signedUrl, 'http://localhost');
  assert.equal(
    Buffer.from(
      (
        await files.readSigned(
          url.pathname.split('/').pop(),
          url.searchParams.get('expires'),
          url.searchParams.get('signature'),
        )
      ).content,
    ).toString(),
    'pdf',
  );
  await assert.rejects(
    files.readSigned(
      url.pathname.split('/').pop(),
      String(Date.now() - 1000),
      url.searchParams.get('signature'),
    ),
  );
  await query('Leads', [
    { method: 'delete', args: [] },
    { method: 'eq', args: ['whalesync_postgres_id', id] },
  ]);
  assert.equal((await query('Leads', [select], employee)).data.length, 0);
  const { Module, ValidationPipe, UnauthorizedException } =
    await import('@nestjs/common');
  const { NestFactory } = await import('@nestjs/core');
  const { ConfigModule } = await import('@nestjs/config');
  const { CrmController } = await mod('dist/crm/crm.controller.js');
  const { AccountsController } = await mod('dist/crm/accounts.controller.js');
  const { AuthService } = await mod('dist/auth/auth.service.js');
  const { JwtAuthGuard } = await mod('dist/auth/jwt-auth.guard.js');
  const { default: supertest } = await import('supertest');
  const { default: cookieParser } = await import('cookie-parser');
  class TestApp {}
  // Exercise the real bearer guard and CRM controllers with deterministic actors.
  // The separate auth integration suite verifies JWT login/refresh against PostgreSQL.
  Module({
    imports: [ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true })],
    controllers: [CrmController, AccountsController],
    providers: [
      CrmService,
      FilesService,
      JwtAuthGuard,
      { provide: PrismaService, useValue: prisma },
      {
        provide: AuthService,
        useValue: {
          authenticate: async (token) => {
            if (token === 'admin-token') return admin;
            if (token === 'employee-token') return employee;
            throw new UnauthorizedException();
          },
        },
      },
    ],
  })(TestApp);
  app = await NestFactory.create(TestApp, {
    logger: ['error'],
    abortOnError: false,
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.init();
  const http = supertest(app.getHttpServer());
  await http
    .post('/crm/resources/Leads/query')
    .send({ operations: [select] })
    .expect(401);
  const authHeader = 'Bearer admin-token';
  await http.get('/crm/profile').set('Authorization', authHeader).expect(200);
  const accounts = await http
    .get('/crm/accounts')
    .set('Authorization', authHeader)
    .expect(200);
  assert.equal(accounts.body.length, 2);
  assert.equal(accounts.body[0].password, undefined);
  await http
    .post('/crm/accounts')
    .set('Authorization', authHeader)
    .send({
      name: 'Third',
      email: 'third@test.example',
      password: 'Third-password-123',
      role: 'MANAGER',
    })
    .expect(201);
  await http
    .post('/crm/accounts')
    .set('Authorization', authHeader)
    .send({
      name: 'Invalid',
      email: 'invalid@test.example',
      password: 'Third-password-123',
      role: 'SUPERADMIN',
    })
    .expect(400);
  await http
    .get('/crm/accounts')
    .set('Authorization', 'Bearer employee-token')
    .expect(403);
  await http
    .post('/crm/resources/Leads/query')
    .set('Authorization', authHeader)
    .send({ operations: [select] })
    .expect(200);
  console.log(
    'PASS: HTTP bearer guards, accounts, role validation, migrations, persistence, row scoping, rollback, shared files and signed links',
  );
} finally {
  if (app) await app.close();
  if (prisma) await prisma.$disconnect();
  if (server) await server.stop();
  await db.close();
}
