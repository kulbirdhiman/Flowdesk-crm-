import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  createQueryEngine,
  FOREIGN_KEYS,
  PRIMARY_KEYS,
  type Row,
  type Tables,
} from './query-engine.js';
import { authorizeWrite, visibleTables, type Actor } from './policy.js';
import { randomUUID } from 'node:crypto';

export type QueryInput = { operations: { method: string; args: any[] }[] };
const methods = new Set([
  'select',
  'insert',
  'upsert',
  'update',
  'delete',
  'eq',
  'neq',
  'gt',
  'gte',
  'lt',
  'lte',
  'like',
  'ilike',
  'in',
  'is',
  'contains',
  'not',
  'filter',
  'match',
  'or',
  'order',
  'limit',
  'range',
  'single',
  'maybeSingle',
]);
const writes = new Set(['insert', 'upsert', 'update', 'delete']);
export const emptyTables = (): Tables =>
  Object.fromEntries(Object.keys(PRIMARY_KEYS).map((k) => [k, []]));
export function resourceName(name: string) {
  const resource = Object.keys(PRIMARY_KEYS).find(
    (k) => k.toLowerCase() === name.toLowerCase(),
  );
  if (!resource) throw new BadRequestException('Unknown CRM resource');
  return resource;
}

@Injectable()
export class CrmService {
  constructor(private readonly prisma: PrismaService) {}

  async profile(actor: Actor) {
    return this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(73491821)`;
      const profiles = await tx.crmRecord.findMany({
        where: { resource: 'Employee Directory' },
      });
      let row = profiles
        .map((r) => r.data as Row)
        .find(
          (r) =>
            String(r.official_email).toLowerCase() ===
            actor.email.toLowerCase(),
        );
      if (!row) {
        row = {
          whalesync_postgres_id: actor.id,
          id: actor.id,
          full_name: actor.name,
          official_email: actor.email,
          status: 'Active',
          date_of_joining: new Date().toISOString().slice(0, 10),
        };
        await tx.crmRecord.create({
          data: { resource: 'Employee Directory', id: actor.id, data: row },
        });
      }
      const mappings = await tx.crmRecord.findMany({
        where: { resource: 'Users' },
      });
      const mapping = mappings.find(
        (r) => (r.data as Row).email === actor.email,
      );
      const mappingId =
        mapping?.id ||
        String(
          mappings.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0) + 1,
        );
      const data = {
        id: Number(mappingId),
        email: actor.email,
        employee: row.whalesync_postgres_id,
      };
      await tx.crmRecord.upsert({
        where: { resource_id: { resource: 'Users', id: mappingId } },
        create: { resource: 'Users', id: mappingId, data },
        update: { data },
      });
      return {
        ...row,
        role:
          actor.role === 'ADMIN'
            ? 'admin'
            : actor.role === 'MANAGER'
              ? 'hr'
              : 'employee',
      };
    });
  }

  async query(name: string, input: QueryInput, actor: Actor) {
    const table = resourceName(name);
    if (
      !input ||
      !Array.isArray(input.operations) ||
      input.operations.length > 60 ||
      input.operations.length === 0
    )
      throw new BadRequestException('Provide 1–60 query operations');
    for (const op of input.operations) {
      if (
        !op ||
        !methods.has(op.method) ||
        !Array.isArray(op.args) ||
        op.args.length > 3
      )
        throw new BadRequestException('Invalid query operation');
      if (
        ['limit', 'range'].includes(op.method) &&
        op.args.some((n) => !Number.isSafeInteger(n) || n < 0 || n > 100000)
      )
        throw new BadRequestException('Invalid pagination');
    }
    if (JSON.stringify(input).length > 1024 * 1024)
      throw new BadRequestException('CRM queries must be smaller than 1 MB');
    const mutations = input.operations.filter((op) => writes.has(op.method));
    if (mutations.length > 1)
      throw new BadRequestException('One mutation per request is supported');
    const mutation = mutations[0];
    if (mutation && input.operations[0] !== mutation)
      throw new BadRequestException('Mutation must be the first operation');
    if (
      mutation &&
      ['update', 'delete'].includes(mutation.method) &&
      !input.operations.some((op) => ['eq', 'in', 'match'].includes(op.method))
    )
      throw new BadRequestException(
        'Updates and deletes require an explicit record filter',
      );
    return this.prisma.$transaction(
      async (tx) => {
        // Serialize compatibility writes so concurrent requests cannot lose changes or reuse serial IDs.
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(73491821)`;
        const stored = await tx.crmRecord.findMany();
        const all = emptyTables();
        for (const r of stored)
          if (all[r.resource]) all[r.resource].push(r.data as Row);
        const visible = visibleTables(all, actor);
        const before = structuredClone(visible);
        if (mutation) {
          let payload = mutation.method === 'delete' ? [] : mutation.args[0];
          payload = Array.isArray(payload) ? payload : [payload];
          if (
            payload.length > 500 ||
            payload.some(
              (r: unknown) => !r || typeof r !== 'object' || Array.isArray(r),
            )
          )
            throw new BadRequestException('Provide up to 500 record objects');
          const rows = payload as Row[];
          authorizeWrite(table, mutation.method, rows, actor, all);
          const pk = PRIMARY_KEYS[table];
          let serial = all[table].reduce(
            (max, r) => Math.max(max, Number(r[pk.column]) || 0),
            0,
          );
          for (const row of rows) {
            if (
              Object.keys(row).some((k) =>
                ['__proto__', 'prototype', 'constructor'].includes(k),
              )
            )
              throw new BadRequestException('Invalid record field');
            if (row.attachments !== undefined && actor.role !== 'ADMIN') {
              if (
                !Array.isArray(row.attachments) ||
                row.attachments.length > 50
              )
                throw new BadRequestException('Invalid attachments');
              for (const attachment of row.attachments) {
                if (!attachment || typeof attachment.path !== 'string')
                  throw new BadRequestException('Invalid attachment');
                const file = await tx.crmFile.findUnique({
                  where: {
                    bucket_path: { bucket: 'documents', path: attachment.path },
                  },
                });
                if (!file || file.ownerId !== actor.id)
                  throw new BadRequestException(
                    'You can only attach files you uploaded',
                  );
              }
            }
            if (mutation.method === 'update' && pk.column in row)
              throw new BadRequestException('Primary keys cannot be changed');
            if (mutation.method === 'insert' || mutation.method === 'upsert') {
              if (
                mutation.method === 'upsert' &&
                mutation.args[1]?.onConflict
              ) {
                const columns = String(mutation.args[1].onConflict)
                  .split(',')
                  .map((s: string) => s.trim());
                const target = all[table].find((r) =>
                  columns.every(
                    (k: string) => row[k] !== undefined && r[k] === row[k],
                  ),
                );
                if (target) {
                  if (
                    !visible[table].some(
                      (r) => r[pk.column] === target[pk.column],
                    )
                  )
                    throw new ConflictException(
                      'Conflicting record is not accessible',
                    );
                  if (
                    row[pk.column] != null &&
                    row[pk.column] !== target[pk.column]
                  )
                    throw new BadRequestException(
                      'Upsert cannot change a primary key',
                    );
                  row[pk.column] = target[pk.column];
                }
              }
              if (row[pk.column] == null)
                row[pk.column] = pk.kind === 'serial' ? ++serial : randomUUID();
              const existing = all[table].find(
                (r) => String(r[pk.column]) === String(row[pk.column]),
              );
              if (
                existing &&
                (mutation.method === 'insert' ||
                  !visible[table].some(
                    (r) => r[pk.column] === existing[pk.column],
                  ))
              )
                throw new ConflictException('Record ID already exists');
              const now = new Date().toISOString();
              if (!existing) row.created_at ??= now;
              row.updated_at ??= now;
            }
            for (const fk of FOREIGN_KEYS.filter((f) => f.table === table)) {
              if (
                row[fk.column] != null &&
                !all[fk.ref].some((r) => r[fk.refColumn] === row[fk.column])
              )
                throw new BadRequestException(
                  `Invalid reference: ${fk.column}`,
                );
            }
          }
          if (mutation.method !== 'delete')
            mutation.args[0] = mutation.method === 'update' ? rows[0] : rows;
        }
        const engine = createQueryEngine(visible);
        let query: any = engine.from(table);
        let result;
        try {
          for (const op of input.operations)
            query = query[op.method](...op.args);
          result = await query;
        } catch {
          throw new BadRequestException('Invalid CRM query');
        }
        if (result.error) return result;
        if (mutation) {
          const merged = structuredClone(all);
          for (const resource of Object.keys(visible)) {
            const pk = PRIMARY_KEYS[resource].column;
            const oldIds = new Set(before[resource].map((r) => String(r[pk])));
            merged[resource] = [
              ...all[resource].filter((r) => !oldIds.has(String(r[pk]))),
              ...visible[resource],
            ];
          }
          validateTables(merged);
          for (const [resource, rows] of Object.entries(visible)) {
            const pk = PRIMARY_KEYS[resource].column;
            const current = new Map(rows.map((r) => [String(r[pk]), r]));
            const previous = new Map(
              before[resource].map((r) => [String(r[pk]), r]),
            );
            for (const [id, row] of current) {
              if (JSON.stringify(row) === JSON.stringify(previous.get(id)))
                continue;
              await tx.crmRecord.upsert({
                where: { resource_id: { resource, id } },
                create: { resource, id, data: row },
                update: { data: row },
              });
            }
            for (const id of previous.keys())
              if (!current.has(id))
                await tx.crmRecord.delete({
                  where: { resource_id: { resource, id } },
                });
          }
        }
        return result;
      },
      { timeout: 15000 },
    );
  }
}

export function validateTables(tables: Tables) {
  const required: Record<string, string[]> = {
    'Employee Directory': ['full_name', 'official_email'],
    Departments: ['department_name'],
    Teams: ['team_name'],
    Users: ['email'],
    Leads: ['name'],
    Attendance: ['date'],
    tasks: ['title'],
    documents: ['title', 'file_name', 'file_type', 'file_url'],
    'Employee Documents': ['document_name'],
    subscriptions: ['subscription_name'],
    tickets: ['client_name', 'client_email', 'issue'],
    ticket_chat: ['ticket_id', 'user_name', 'message', 'sender_type'],
    ticket_history: ['ticket_id', 'user_name', 'action'],
    admin_notes: ['page_key'],
  };
  const unique: Record<string, string[][]> = {
    'Employee Directory': [['official_email']],
    Users: [['email']],
    Departments: [['department_name']],
    Teams: [['team_name']],
    Attendance: [['employee', 'date']],
    admin_notes: [['page_key']],
    document_assignments: [['document_id', 'employee_id']],
    subscription_users: [['subscription_id', 'user_id']],
    ticket_assignments: [['ticket_id', 'employee_id']],
  };
  for (const [name, rows] of Object.entries(tables)) {
    const keys = [[PRIMARY_KEYS[name].column], ...(unique[name] || [])];
    for (const row of rows) {
      for (const field of required[name] || [])
        if (row[field] == null || String(row[field]).trim() === '')
          throw new BadRequestException(`${name}.${field} is required`);
    }
    for (const fields of keys) {
      const seen = new Set<string>();
      for (const row of rows) {
        if (fields.some((k) => row[k] == null)) continue;
        const key = JSON.stringify(
          fields.map((k) =>
            /email/i.test(k) ? String(row[k]).toLowerCase() : row[k],
          ),
        );
        if (seen.has(key))
          throw new ConflictException(`Duplicate ${name} ${fields.join(', ')}`);
        seen.add(key);
      }
    }
  }
  for (const fk of FOREIGN_KEYS)
    for (const row of tables[fk.table]) {
      if (
        row[fk.column] != null &&
        !tables[fk.ref].some((r) => r[fk.refColumn] === row[fk.column])
      )
        throw new BadRequestException(
          `Invalid ${fk.table}.${fk.column} reference`,
        );
    }
}
