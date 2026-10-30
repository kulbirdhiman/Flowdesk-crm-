import { ForbiddenException } from '@nestjs/common';
import type { Row, Tables } from './query-engine.js';
export type Actor = { id: string; email: string; name: string; role: string };
export function employeeId(tables: Tables, actor: Actor): string | undefined {
  return tables['Employee Directory'].find(
    (r) => String(r.official_email).toLowerCase() === actor.email.toLowerCase(),
  )?.whalesync_postgres_id;
}
export function visibleTables(tables: Tables, actor: Actor): Tables {
  if (actor.role === 'ADMIN') return structuredClone(tables);
  const id = employeeId(tables, actor);
  const own = (value: unknown) => !!id && value === id;
  const hr = actor.role === 'MANAGER';
  const assigned = (name: string, column: string) =>
    new Set(
      tables[name]
        .filter(
          (r) =>
            own(r[column]) &&
            (name !== 'document_assignments' || r.can_view !== false),
        )
        .map((r) => r.document_id || r.subscription_id || r.ticket_id),
    );
  const docs = assigned('document_assignments', 'employee_id');
  const subscriptions = assigned('subscription_users', 'user_id');
  const tickets = assigned('ticket_assignments', 'employee_id');
  const result: Tables = {};
  for (const [name, rows] of Object.entries(tables)) {
    result[name] = rows
      .filter((r) => {
        switch (name) {
          case 'Departments':
          case 'Teams':
          case 'Employee Directory':
            return true;
          case 'Attendance':
          case 'Employee Documents':
            return hr || own(r.employee);
          case 'Users':
            return r.email === actor.email;
          case 'Leads':
            return own(r.assigned_to);
          case 'Calls':
            return own(r.employee);
          case 'tasks':
            return own(r.assignee);
          case 'documents':
            return own(r.created_by) || docs.has(r.id);
          case 'document_assignments':
            return own(r.employee_id);
          case 'subscriptions':
            return own(r.owner_id) || subscriptions.has(r.id);
          case 'subscription_users':
            return own(r.user_id);
          case 'tickets':
            return tickets.has(r.id);
          case 'ticket_assignments':
            return own(r.employee_id);
          case 'ticket_chat':
          case 'ticket_history':
            return tickets.has(r.ticket_id);
          default:
            return false;
        }
      })
      .map((r) => {
        if (name !== 'Employee Directory' || hr || own(r.whalesync_postgres_id))
          return structuredClone(r);
        const publicFields = [
          'whalesync_postgres_id',
          'id',
          'full_name',
          'official_email',
          'job_title',
          'department',
          'teams',
          'profile_photo',
          'Announcement',
          'status',
        ];
        return Object.fromEntries(
          publicFields.filter((k) => k in r).map((k) => [k, r[k]]),
        );
      });
  }
  return result;
}
export function authorizeWrite(
  table: string,
  action: string,
  payload: Row[],
  actor: Actor,
  tables: Tables,
) {
  if (actor.role === 'ADMIN') return;
  const id = employeeId(tables, actor);
  if (!id) throw new ForbiddenException('An employee profile is required');
  if (
    actor.role === 'MANAGER' &&
    ['Attendance', 'Employee Documents', 'Departments', 'Teams'].includes(table)
  )
    return;
  const allowed: Record<string, string[]> = {
    Leads: [
      'stage',
      'deal_amount',
      'follow_up_date',
      'call_remark',
      'call_notes',
      'lead_tag',
      'expected_closing',
      'last_callback_date',
    ],
    Calls: [
      'employee',
      'leads',
      'client_name',
      'client_number',
      'duration',
      'call_date',
      'sentiment',
      'call_type',
      'service',
      'ai_call_summary',
    ],
    tasks: [
      'title',
      'description',
      'status',
      'priority',
      'due_date',
      'assignee',
      'completed_on',
      'is_overdue',
      'days_overdue',
      'update_count',
      'updated_at',
      'created_at',
      'attachments',
    ],
    Attendance: [
      'employee',
      'date',
      'status',
      'time_in',
      'time_out',
      'working_hours',
      'notes',
      'punctuality_status',
      'marked_at',
      'full_name_from_employee',
      'employee_id_from_employee',
      'employee_name',
      'employee_id',
    ],
    ticket_chat: ['ticket_id', 'user_name', 'message', 'sender_type'],
    ticket_history: ['ticket_id', 'user_name', 'action'],
    tickets: ['status', 'priority', 'updated_at'],
  };
  if (
    !allowed[table] ||
    action === 'delete' ||
    (['Leads', 'tickets'].includes(table) && action !== 'update')
  )
    throw new ForbiddenException('This operation requires an administrator');
  const owner = (
    { Calls: 'employee', tasks: 'assignee', Attendance: 'employee' } as Record<
      string,
      string
    >
  )[table];
  const scope = visibleTables(tables, actor);
  for (const row of payload) {
    if (Object.keys(row).some((k) => !allowed[table].includes(k)))
      throw new ForbiddenException('A protected field cannot be changed');
    if (owner) {
      if (row[owner] !== undefined && row[owner] !== id)
        throw new ForbiddenException('Cannot assign another employee');
      if (action === 'insert' || action === 'upsert') row[owner] = id;
    }
    if (
      row.leads &&
      !scope.Leads.some((r) => r.whalesync_postgres_id === row.leads)
    )
      throw new ForbiddenException('Lead is not assigned to you');
    if (['ticket_chat', 'ticket_history'].includes(table)) {
      if (
        action !== 'insert' ||
        !scope.tickets.some((r) => r.id === row.ticket_id)
      )
        throw new ForbiddenException('Ticket is not assigned to you');
      row.user_name = actor.name;
      if (table === 'ticket_chat') row.sender_type = 'sent';
    }
  }
}
