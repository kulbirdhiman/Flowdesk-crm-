import { createQueryEngine } from './query-engine.js';
import { authorizeWrite, visibleTables, type Actor } from './policy.js';
import { CrmService, emptyTables, validateTables } from './crm.service.js';
const employee: Actor = {
  id: 'account1',
  email: 'one@example.com',
  name: 'One',
  role: 'EMPLOYEE',
};
function fixture() {
  const t = emptyTables();
  t['Employee Directory'] = [
    {
      whalesync_postgres_id: 'e1',
      full_name: 'One',
      official_email: employee.email,
      monthly_payroll: 100,
    },
    {
      whalesync_postgres_id: 'e2',
      full_name: 'Two',
      official_email: 'two@example.com',
      monthly_payroll: 999,
      personal_email: 'private@example.com',
    },
  ];
  t.Leads = [
    { whalesync_postgres_id: 'l1', name: 'Visible', assigned_to: 'e1' },
    { whalesync_postgres_id: 'l2', name: 'Hidden', assigned_to: 'e2' },
  ];
  t.tasks = [
    { id: 't1', title: 'Own task', assignee: 'e1' },
    { id: 't2', title: 'Other task', assignee: 'e2' },
  ];
  t.credentials = [{ id: 1, password: 'secret' }];
  return t;
}
describe('CRM queries and authorization', () => {
  it('scopes records before projection, counts and embedded relations', async () => {
    const tables = visibleTables(fixture(), employee);
    const result = await createQueryEngine(tables)
      .from('Leads')
      .select('name,assigned_to(full_name)', { count: 'exact' });
    expect(result.data).toEqual([
      { name: 'Visible', assigned_to: { full_name: 'One' } },
    ]);
    expect(result.count).toBe(1);
    expect(tables.credentials).toEqual([]);
    expect(tables['Employee Directory'][1]).not.toHaveProperty(
      'monthly_payroll',
    );
    expect(tables['Employee Directory'][1]).not.toHaveProperty(
      'personal_email',
    );
  });
  it('supports filtering, ordering, inclusive pagination and single results', async () => {
    const t = fixture();
    const engine = createQueryEngine(t);
    expect(
      (
        await engine
          .from('tasks')
          .select('*', { count: 'exact' })
          .or('title.ilike.%task%')
          .order('id', { ascending: false })
          .range(0, 0)
      ).data[0].id,
    ).toBe('t2');
    expect(
      (await engine.from('tasks').select().eq('id', 'missing').single()).status,
    ).toBe(406);
    expect(
      (await engine.from('tasks').select().eq('id', 'missing').maybeSingle())
        .data,
    ).toBeNull();
  });
  it('rejects privilege escalation, lead reassignment and writing another employee', () => {
    const t = fixture();
    expect(() =>
      authorizeWrite(
        'Employee Directory',
        'update',
        [{ job_title: 'Admin' }],
        employee,
        t,
      ),
    ).toThrow();
    expect(() =>
      authorizeWrite('Leads', 'update', [{ assigned_to: 'e2' }], employee, t),
    ).toThrow();
    expect(() =>
      authorizeWrite(
        'tasks',
        'insert',
        [{ assignee: 'e2', title: 'x' }],
        employee,
        t,
      ),
    ).toThrow();
    expect(() =>
      authorizeWrite('Calls', 'insert', [{ leads: 'l2' }], employee, t),
    ).toThrow();
    expect(() => authorizeWrite('tasks', 'delete', [], employee, t)).toThrow();
  });
  it('assigns new employee tasks to the authenticated profile', () => {
    const rows = [{ title: 'x' }] as any[];
    authorizeWrite('tasks', 'insert', rows, employee, fixture());
    expect(rows[0].assignee).toBe('e1');
  });
  it('checks required fields, unique email addresses and foreign keys', () => {
    const t = fixture();
    expect(() => validateTables(t)).not.toThrow();
    t['Employee Directory'][1].official_email = employee.email.toUpperCase();
    expect(() => validateTables(t)).toThrow('Duplicate');
    t['Employee Directory'][1].official_email = 'two@example.com';
    t.Leads[0].assigned_to = 'missing';
    expect(() => validateTables(t)).toThrow('reference');
  });
  it('uses HR access for attendance without exposing subscription passwords', () => {
    const t = fixture();
    t.Attendance = [{ employee: 'e2', date: '2026-10-29' }];
    const hr = visibleTables(t, { ...employee, role: 'MANAGER' });
    expect(hr.Attendance).toHaveLength(1);
    expect(hr.credentials).toEqual([]);
    expect(() =>
      authorizeWrite(
        'credentials',
        'insert',
        [],
        { ...employee, role: 'MANAGER' },
        t,
      ),
    ).toThrow();
  });
  it('does not expose documents with viewing disabled', () => {
    const t = fixture();
    t.documents = [{ id: 'doc1', file_url: 'private' }];
    t.document_assignments = [
      { id: 1, document_id: 'doc1', employee_id: 'e1', can_view: false },
    ];
    expect(visibleTables(t, employee).documents).toEqual([]);
  });
  it('rejects unknown methods, oversized requests and unfiltered mutations before DB access', async () => {
    const crm = new CrmService({} as any);
    await expect(
      crm.query(
        'User',
        { operations: [{ method: 'select', args: [] }] },
        employee,
      ),
    ).rejects.toThrow('Unknown');
    await expect(
      crm.query(
        'tasks',
        { operations: [{ method: 'constructor', args: [] }] },
        employee,
      ),
    ).rejects.toThrow('Invalid');
    await expect(
      crm.query(
        'tasks',
        { operations: [{ method: 'delete', args: [] }] },
        employee,
      ),
    ).rejects.toThrow('filter');
  });
  it('does not let embedded relations disclose another employee lead', async () => {
    const t = fixture();
    const result = await createQueryEngine(visibleTables(t, employee))
      .from('Employee Directory')
      .select('full_name,Leads(name)');
    expect(result.data.find((r: any) => r.full_name === 'Two').Leads).toEqual(
      [],
    );
  });
});
