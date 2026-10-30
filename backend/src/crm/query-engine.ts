// Compatibility query engine for the existing CRM screens. No browser or auth state.
export type Row = Record<string, any>;
export type Tables = Record<string, Row[]>;
function scalarString(value: unknown): string {
  return typeof value === 'object' && value !== null
    ? JSON.stringify(value)
    : String(value);
}

type PkInfo = { column: string; kind: 'uuid' | 'serial' };

export const PRIMARY_KEYS: Record<string, PkInfo> = {
  Departments: { column: 'whalesync_postgres_id', kind: 'uuid' },
  Teams: { column: 'id', kind: 'serial' },
  'Employee Directory': { column: 'whalesync_postgres_id', kind: 'uuid' },
  Users: { column: 'id', kind: 'serial' },
  Leads: { column: 'whalesync_postgres_id', kind: 'uuid' },
  Calls: { column: 'whalesync_postgres_id', kind: 'uuid' },
  Attendance: { column: 'whalesync_postgres_id', kind: 'uuid' },
  'Employee Documents': { column: 'id', kind: 'serial' },
  tasks: { column: 'id', kind: 'uuid' },
  documents: { column: 'id', kind: 'uuid' },
  document_assignments: { column: 'id', kind: 'serial' },
  subscriptions: { column: 'id', kind: 'uuid' },
  subscription_users: { column: 'id', kind: 'serial' },
  credentials: { column: 'id', kind: 'serial' },
  tickets: { column: 'id', kind: 'uuid' },
  ticket_assignments: { column: 'id', kind: 'serial' },
  ticket_chat: { column: 'id', kind: 'uuid' },
  ticket_history: { column: 'id', kind: 'uuid' },
  admin_notes: { column: 'id', kind: 'serial' },
};

type ForeignKey = {
  table: string;
  column: string;
  ref: string;
  refColumn: string;
};

export const FOREIGN_KEYS: ForeignKey[] = [
  {
    table: 'Employee Directory',
    column: 'department',
    ref: 'Departments',
    refColumn: 'whalesync_postgres_id',
  },
  {
    table: 'Employee Directory',
    column: 'reporting_manager',
    ref: 'Employee Directory',
    refColumn: 'whalesync_postgres_id',
  },
  {
    table: 'Employee Directory',
    column: 'teams',
    ref: 'Teams',
    refColumn: 'id',
  },
  {
    table: 'Users',
    column: 'employee',
    ref: 'Employee Directory',
    refColumn: 'whalesync_postgres_id',
  },
  {
    table: 'Leads',
    column: 'assigned_to',
    ref: 'Employee Directory',
    refColumn: 'whalesync_postgres_id',
  },
  {
    table: 'Calls',
    column: 'employee',
    ref: 'Employee Directory',
    refColumn: 'whalesync_postgres_id',
  },
  {
    table: 'Calls',
    column: 'leads',
    ref: 'Leads',
    refColumn: 'whalesync_postgres_id',
  },
  {
    table: 'Attendance',
    column: 'employee',
    ref: 'Employee Directory',
    refColumn: 'whalesync_postgres_id',
  },
  {
    table: 'Employee Documents',
    column: 'employee',
    ref: 'Employee Directory',
    refColumn: 'whalesync_postgres_id',
  },
  {
    table: 'tasks',
    column: 'assignee',
    ref: 'Employee Directory',
    refColumn: 'whalesync_postgres_id',
  },
  {
    table: 'documents',
    column: 'created_by',
    ref: 'Employee Directory',
    refColumn: 'whalesync_postgres_id',
  },
  {
    table: 'document_assignments',
    column: 'document_id',
    ref: 'documents',
    refColumn: 'id',
  },
  {
    table: 'document_assignments',
    column: 'employee_id',
    ref: 'Employee Directory',
    refColumn: 'whalesync_postgres_id',
  },
  {
    table: 'subscriptions',
    column: 'vendor_id',
    ref: 'Employee Directory',
    refColumn: 'whalesync_postgres_id',
  },
  {
    table: 'subscriptions',
    column: 'owner_id',
    ref: 'Employee Directory',
    refColumn: 'whalesync_postgres_id',
  },
  {
    table: 'subscription_users',
    column: 'subscription_id',
    ref: 'subscriptions',
    refColumn: 'id',
  },
  {
    table: 'subscription_users',
    column: 'user_id',
    ref: 'Employee Directory',
    refColumn: 'whalesync_postgres_id',
  },
  {
    table: 'credentials',
    column: 'subscription_id',
    ref: 'subscriptions',
    refColumn: 'id',
  },
  {
    table: 'ticket_assignments',
    column: 'ticket_id',
    ref: 'tickets',
    refColumn: 'id',
  },
  {
    table: 'ticket_assignments',
    column: 'employee_id',
    ref: 'Employee Directory',
    refColumn: 'whalesync_postgres_id',
  },
  {
    table: 'ticket_chat',
    column: 'ticket_id',
    ref: 'tickets',
    refColumn: 'id',
  },
  {
    table: 'ticket_history',
    column: 'ticket_id',
    ref: 'tickets',
    refColumn: 'id',
  },
];

export function createQueryEngine(tables: Tables): {
  from: (table: string) => any;
} {
  const load = () => tables;
  const save = () => {};
  function resolveTable(name: string): string {
    return (
      Object.keys(tables).find((t) => t.toLowerCase() === name.toLowerCase()) ||
      name
    );
  }
  function rowsOf(name: string): Row[] {
    return (tables[name] ||= []);
  }
  const clone = <T>(v: T): T =>
    v === undefined ? v : JSON.parse(JSON.stringify(v));

  function uuid(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
      return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  // ---------------------------------------------------------------------------
  // Value comparison helpers
  // ---------------------------------------------------------------------------

  type Value = unknown;

  function parseLiteral(v: string): Value {
    if (v === 'null') return null;
    if (v === 'true') return true;
    if (v === 'false') return false;
    return v;
  }

  function cmp(a: Value, b: Value): number {
    if (a === b) return 0;
    if (a === null || a === undefined) return -1;
    if (b === null || b === undefined) return 1;
    const na = typeof a === 'number' ? a : Number(a);
    const nb = typeof b === 'number' ? b : Number(b);
    if (
      (typeof a === 'number' || typeof b === 'number') &&
      !Number.isNaN(na) &&
      !Number.isNaN(nb)
    )
      return na - nb;
    return scalarString(a) < scalarString(b)
      ? -1
      : scalarString(a) > scalarString(b)
        ? 1
        : 0;
  }

  function eq(a: Value, b: Value): boolean {
    if (b === null || b === undefined) return a === null || a === undefined;
    if (Array.isArray(a)) return a.some((x) => eq(x, b));
    if (typeof a === 'boolean' || typeof b === 'boolean')
      return scalarString(a) === scalarString(b);
    return cmp(a, b) === 0;
  }

  function likeToRegex(pattern: string, flags: string) {
    const escaped = Array.from(pattern)
      .map((ch) =>
        ch === '%' || ch === '*'
          ? '.*'
          : ch === '_'
            ? '.'
            : ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      )
      .join('');
    return new RegExp(`^${escaped}$`, flags);
  }

  function getPath(row: Row, path: string): Value {
    return path
      .split(/->>?|\./)
      .reduce<Value>(
        (acc, key) =>
          acc && typeof acc === 'object' ? (acc as Row)[key] : undefined,
        row,
      );
  }

  function test(value: Value, op: string, arg: Value): boolean {
    switch (op) {
      case 'eq':
        return eq(value, arg);
      case 'neq':
        if (arg === null || arg === undefined)
          return value !== null && value !== undefined;
        return value !== null && value !== undefined && !eq(value, arg);
      case 'gt':
        return value !== null && value !== undefined && cmp(value, arg) > 0;
      case 'gte':
        return value !== null && value !== undefined && cmp(value, arg) >= 0;
      case 'lt':
        return value !== null && value !== undefined && cmp(value, arg) < 0;
      case 'lte':
        return value !== null && value !== undefined && cmp(value, arg) <= 0;
      case 'like':
        return (
          value !== null &&
          value !== undefined &&
          likeToRegex(scalarString(arg), '').test(scalarString(value))
        );
      case 'ilike':
        return (
          value !== null &&
          value !== undefined &&
          likeToRegex(scalarString(arg), 'i').test(scalarString(value))
        );
      case 'in': {
        const list = Array.isArray(arg)
          ? arg
          : scalarString(arg)
              .replace(/^\(|\)$/g, '')
              .split(',')
              .map((s) => s.trim().replace(/^"|"$/g, ''));
        return list.some((x) => eq(value, x));
      }
      case 'is':
        if (arg === null || arg === 'null')
          return value === null || value === undefined;
        return scalarString(value) === scalarString(arg);
      case 'contains':
      case 'cs': {
        const want = Array.isArray(arg)
          ? arg
          : scalarString(arg)
              .replace(/^\{|\}$/g, '')
              .split(',');
        return (
          Array.isArray(value) && want.every((w) => value.some((v) => eq(v, w)))
        );
      }
      default:
        throw new Error('Unsupported filter operator');
    }
  }

  // PostgREST filter strings, as used by `.or("a.eq.1,b.ilike.%x%")`.
  function splitTop(s: string): string[] {
    const out: string[] = [];
    let depth = 0;
    let cur = '';
    for (const ch of s) {
      if (ch === '(') depth++;
      if (ch === ')') depth--;
      if (ch === ',' && depth === 0) {
        out.push(cur);
        cur = '';
      } else cur += ch;
    }
    if (cur.trim()) out.push(cur);
    return out.map((x) => x.trim());
  }

  type Predicate = (row: Row) => boolean;

  function parseCondition(expr: string): Predicate {
    const group = expr.match(/^(and|or)\((.*)\)$/);
    if (group) {
      const parts = splitTop(group[2]).map(parseCondition);
      return group[1] === 'and'
        ? (r) => parts.every((p) => p(r))
        : (r) => parts.some((p) => p(r));
    }
    const m = expr.match(/^([^.]+)\.(not\.)?([a-z]+)\.(.*)$/);
    if (!m) throw new Error('Invalid filter expression');
    const [, column, negate, op, raw] = m;
    const arg = op === 'in' ? raw : parseLiteral(raw);
    return (r) => {
      const ok = test(getPath(r, column), op, arg);
      return negate ? !ok : ok;
    };
  }

  // ---------------------------------------------------------------------------
  // Select parsing and embedded relations
  // ---------------------------------------------------------------------------

  type Field =
    | { type: 'all' }
    | { type: 'column'; name: string; alias?: string }
    | { type: 'embed'; target: string; alias?: string; inner: Field[] };

  function parseSelect(sel: string): Field[] {
    const clean = sel.replace(/\s+/g, ' ').trim();
    if (!clean) return [{ type: 'all' }];
    return splitTop(clean).map((part): Field => {
      const embed = part.match(
        /^(?:([\w ]+?)\s*:\s*)?([\w ]+?)(?:!\w+)?\s*\(([\s\S]*)\)$/,
      );
      if (embed) {
        return {
          type: 'embed',
          alias: embed[1]?.trim(),
          target: embed[2].trim(),
          inner: parseSelect(embed[3]),
        };
      }
      if (part === '*') return { type: 'all' };
      const col = part.match(/^(?:([\w ]+?)\s*:\s*)?(.+?)(?:::\w+)?$/);
      return {
        type: 'column',
        alias: col?.[1]?.trim(),
        name: (col?.[2] || part).trim().replace(/^"|"$/g, ''),
      };
    });
  }

  function project(table: string, row: Row, fields: Field[]): Row {
    const out: Row = {};
    for (const f of fields) {
      if (f.type === 'all') Object.assign(out, row);
      else if (f.type === 'column') {
        if (f.name === 'count') continue;
        out[f.alias || f.name] = getPath(row, f.name) ?? null;
      }
    }
    for (const f of fields) {
      if (f.type !== 'embed') continue;
      out[f.alias || f.target] = embed(table, row, f);
    }
    return out;
  }

  function embed(
    table: string,
    row: Row,
    f: Extract<Field, { type: 'embed' }>,
  ): Value {
    // 1. The target is a foreign-key column on this table: many-to-one.
    const byColumn = FOREIGN_KEYS.find(
      (fk) => fk.table === table && fk.column === f.target,
    );
    if (byColumn)
      return one(
        byColumn.ref,
        byColumn.refColumn,
        row[byColumn.column],
        f.inner,
      );

    const target = resolveTable(f.target);
    // 2. This table points at the target table: many-to-one.
    const outgoing = FOREIGN_KEYS.find(
      (fk) => fk.table === table && fk.ref === target,
    );
    if (outgoing)
      return one(target, outgoing.refColumn, row[outgoing.column], f.inner);
    // 3. The target table points at this one: one-to-many.
    const incoming = FOREIGN_KEYS.find(
      (fk) => fk.table === target && fk.ref === table,
    );
    if (incoming) {
      return rowsOf(target)
        .filter((r) => eq(r[incoming.column], row[incoming.refColumn]))
        .map((r) => project(target, r, f.inner));
    }
    return null;
  }

  function one(
    table: string,
    column: string,
    value: Value,
    fields: Field[],
  ): Row | null {
    if (value === null || value === undefined) return null;
    const found = rowsOf(table).find((r) => eq(r[column], value));
    return found ? project(table, found, fields) : null;
  }

  // ---------------------------------------------------------------------------
  // Query builder
  // ---------------------------------------------------------------------------

  type Result = {
    data: any;
    error: any;
    count: number | null;
    status: number;
    statusText: string;
  };

  const ok = (
    data: unknown,
    count: number | null = null,
    status = 200,
  ): Result => ({ data, error: null, count, status, statusText: 'OK' });
  const fail = (message: string, code = 'LOCAL', status = 400): Result => ({
    data: null,
    error: { message, code, details: null, hint: null },
    count: null,
    status,
    statusText: 'Error',
  });

  class QueryBuilder implements PromiseLike<Result> {
    private table: string;
    private action: 'select' | 'insert' | 'update' | 'delete' | 'upsert' =
      'select';
    private fields: Field[] = [{ type: 'all' }];
    private returning = false;
    private countMode: string | null = null;
    private head = false;
    private filters: Predicate[] = [];
    private orders: {
      column: string;
      ascending: boolean;
      nullsFirst: boolean;
    }[] = [];
    private limitN: number | null = null;
    private rangeFrom: number | null = null;
    private rangeTo: number | null = null;
    private mode: 'many' | 'single' | 'maybe' = 'many';
    private payload: Row[] = [];
    private onConflict: string | null = null;

    constructor(table: string) {
      this.table = resolveTable(table);
    }

    select(columns = '*', opts: { count?: string; head?: boolean } = {}) {
      this.fields = parseSelect(columns);
      if (this.action === 'select') {
        this.countMode = opts.count || null;
        this.head = !!opts.head;
      } else this.returning = true;
      return this;
    }

    insert(values: Row | Row[]) {
      this.action = 'insert';
      this.payload = Array.isArray(values) ? values : [values];
      return this;
    }

    upsert(values: Row | Row[], opts: { onConflict?: string } = {}) {
      this.action = 'upsert';
      this.payload = Array.isArray(values) ? values : [values];
      this.onConflict = opts.onConflict || null;
      return this;
    }

    update(values: Row) {
      this.action = 'update';
      this.payload = [values];
      return this;
    }

    delete() {
      this.action = 'delete';
      return this;
    }

    private where(column: string, op: string, arg: Value) {
      this.filters.push((r) => test(getPath(r, column), op, arg));
      return this;
    }

    eq(c: string, v: Value) {
      return this.where(c, 'eq', v);
    }
    neq(c: string, v: Value) {
      return this.where(c, 'neq', v);
    }
    gt(c: string, v: Value) {
      return this.where(c, 'gt', v);
    }
    gte(c: string, v: Value) {
      return this.where(c, 'gte', v);
    }
    lt(c: string, v: Value) {
      return this.where(c, 'lt', v);
    }
    lte(c: string, v: Value) {
      return this.where(c, 'lte', v);
    }
    like(c: string, v: string) {
      return this.where(c, 'like', v);
    }
    ilike(c: string, v: string) {
      return this.where(c, 'ilike', v);
    }
    in(c: string, v: Value[]) {
      return this.where(c, 'in', v);
    }
    is(c: string, v: Value) {
      return this.where(c, 'is', v);
    }
    contains(c: string, v: Value) {
      return this.where(c, 'contains', v);
    }

    not(column: string, op: string, arg: Value) {
      const parsed =
        typeof arg === 'string' && op !== 'in' ? parseLiteral(arg) : arg;
      this.filters.push((r) => !test(getPath(r, column), op, parsed));
      return this;
    }

    filter(column: string, op: string, arg: Value) {
      const negate = op.startsWith('not.');
      const realOp = negate ? op.slice(4) : op;
      const parsed =
        typeof arg === 'string' && realOp !== 'in' ? parseLiteral(arg) : arg;
      this.filters.push((r) => {
        const res = test(getPath(r, column), realOp, parsed);
        return negate ? !res : res;
      });
      return this;
    }

    match(obj: Row) {
      for (const [k, v] of Object.entries(obj)) this.eq(k, v);
      return this;
    }

    or(expr: string) {
      const parts = splitTop(expr).map(parseCondition);
      this.filters.push((r) => parts.some((p) => p(r)));
      return this;
    }

    order(
      column: string,
      opts: {
        ascending?: boolean;
        nullsFirst?: boolean;
        foreignTable?: string;
        referencedTable?: string;
      } = {},
    ) {
      if (opts.foreignTable || opts.referencedTable) return this;
      const ascending = opts.ascending !== false;
      this.orders.push({
        column,
        ascending,
        nullsFirst: opts.nullsFirst ?? !ascending,
      });
      return this;
    }

    limit(n: number) {
      this.limitN = n;
      return this;
    }

    range(from: number, to: number) {
      this.rangeFrom = from;
      this.rangeTo = to;
      return this;
    }

    single() {
      this.mode = 'single';
      return this;
    }

    maybeSingle() {
      this.mode = 'maybe';
      return this;
    }

    abortSignal() {
      return this;
    }

    throwOnError() {
      return this;
    }

    returns() {
      return this;
    }

    // oxlint-disable-next-line unicorn/no-thenable -- Preserve the awaited query-builder interface.
    then<A = Result, B = never>(
      onFulfilled?: ((v: Result) => A | PromiseLike<A>) | null,
      onRejected?: ((e: any) => B | PromiseLike<B>) | null,
    ) {
      return new Promise<Result>((resolve) => {
        let result: Result;
        try {
          result = this.run();
        } catch (e: any) {
          result = fail(e?.message || 'Local database error');
        }
        resolve(result);
      }).then(onFulfilled, onRejected);
    }

    catch<B = never>(onRejected?: (e: any) => B | PromiseLike<B>) {
      return this.then(undefined, onRejected);
    }

    finally(fn?: () => void) {
      return this.then(
        (v) => {
          fn?.();
          return v;
        },
        (e) => {
          fn?.();
          throw e;
        },
      );
    }

    private matching(): Row[] {
      return rowsOf(this.table).filter((r) => this.filters.every((f) => f(r)));
    }

    private shape(rows: Row[], total: number | null): Result {
      let list = rows.map((r) => project(this.table, r, this.fields));
      if (this.mode === 'single') {
        if (list.length !== 1) {
          return fail(
            list.length === 0
              ? 'JSON object requested, multiple (or no) rows returned'
              : 'JSON object requested, multiple (or no) rows returned',
            'PGRST116',
            406,
          );
        }
        return ok(clone(list[0]), total);
      }
      if (this.mode === 'maybe') {
        if (list.length > 1)
          return fail(
            'JSON object requested, multiple (or no) rows returned',
            'PGRST116',
            406,
          );
        return ok(clone(list[0] ?? null), total);
      }
      list = clone(list);
      return ok(list, total);
    }

    private run(): Result {
      if (this.table === 'information_schema.tables') {
        return ok(Object.keys(load()).map((table_name) => ({ table_name })));
      }
      switch (this.action) {
        case 'select':
          return this.runSelect();
        case 'insert':
          return this.runInsert(false);
        case 'upsert':
          return this.runInsert(true);
        case 'update':
          return this.runUpdate();
        case 'delete':
          return this.runDelete();
      }
    }

    private runSelect(): Result {
      let rows = this.matching();
      const total = this.countMode ? rows.length : null;
      if (this.head) return ok(null, total);

      if (this.orders.length) {
        rows = [...rows].sort((a, b) => {
          for (const o of this.orders) {
            const va = getPath(a, o.column);
            const vb = getPath(b, o.column);
            const an = va === null || va === undefined;
            const bn = vb === null || vb === undefined;
            if (an || bn) {
              if (an && bn) continue;
              return an === o.nullsFirst ? -1 : 1;
            }
            const c = cmp(va, vb);
            if (c !== 0) return o.ascending ? c : -c;
          }
          return 0;
        });
      }
      if (this.rangeFrom !== null && this.rangeTo !== null)
        rows = rows.slice(this.rangeFrom, this.rangeTo + 1);
      if (this.limitN !== null) rows = rows.slice(0, this.limitN);

      // `select('count')` returns the number of rows the way PostgREST does.
      if (
        this.fields.length === 1 &&
        this.fields[0].type === 'column' &&
        this.fields[0].name === 'count'
      ) {
        return this.mode === 'many'
          ? ok([{ count: rows.length }], total)
          : ok({ count: rows.length }, total);
      }
      return this.shape(rows, total);
    }

    private withDefaults(input: Row): Row {
      const pk = PRIMARY_KEYS[this.table] || {
        column: 'id',
        kind: 'uuid' as const,
      };
      const row: Row = { ...input };
      const rows = rowsOf(this.table);
      if (row[pk.column] === undefined || row[pk.column] === null) {
        row[pk.column] =
          pk.kind === 'serial'
            ? rows.reduce((m, r) => Math.max(m, Number(r[pk.column]) || 0), 0) +
              1
            : uuid();
      }
      const now = new Date().toISOString();
      const sample = rows[0] || {};
      for (const col of ['created_at', 'updated_at', 'marked_at']) {
        if (
          row[col] === undefined &&
          (col in sample || this.table === 'tasks' || this.table === 'tickets')
        )
          row[col] = now;
      }
      if (this.table === 'Employee Directory')
        row.id = row.whalesync_postgres_id;
      if (this.table === 'tickets' && row.ticket_number === undefined) {
        row.ticket_number =
          rows.reduce(
            (m, r) => Math.max(m, Number(r.ticket_number) || 0),
            1000,
          ) + 1;
      }
      return row;
    }

    private runInsert(upsert: boolean): Result {
      const rows = rowsOf(this.table);
      const pk = PRIMARY_KEYS[this.table]?.column || 'id';
      const keys = (this.onConflict || pk).split(',').map((k) => k.trim());
      const written: Row[] = [];
      for (const input of this.payload) {
        if (upsert) {
          const existing = rows.find((r) =>
            keys.every((k) => input[k] !== undefined && eq(r[k], input[k])),
          );
          if (existing) {
            Object.assign(existing, input);
            written.push(existing);
            continue;
          }
        }
        const row = this.withDefaults(input);
        rows.push(row);
        written.push(row);
      }
      save();
      if (!this.returning) return ok(null, null, 201);
      return this.shape(written, null);
    }

    private runUpdate(): Result {
      const changes = this.payload[0] || {};
      const targets = this.matching();
      for (const r of targets) {
        Object.assign(r, changes);
        if ('updated_at' in r && changes.updated_at === undefined)
          r.updated_at = new Date().toISOString();
      }
      save();
      if (!this.returning) return ok(null, null, 204);
      return this.shape(targets, null);
    }

    private runDelete(): Result {
      const rows = rowsOf(this.table);
      const targets = this.matching();
      const pk = PRIMARY_KEYS[this.table]?.column || 'id';
      const doomed = new Set(targets.map((r) => r[pk]));
      load()[this.table] = rows.filter((r) => !doomed.has(r[pk]));
      // ON DELETE CASCADE / SET NULL for rows pointing at the deleted ones.
      for (const fk of FOREIGN_KEYS.filter((f) => f.ref === this.table)) {
        const refValues = new Set(targets.map((r) => r[fk.refColumn]));
        const child = rowsOf(fk.table);
        const cascade = [
          'Users',
          'Calls',
          'Attendance',
          'Employee Documents',
          'document_assignments',
          'subscription_users',
          'credentials',
          'ticket_assignments',
          'ticket_chat',
          'ticket_history',
        ].includes(fk.table);
        if (cascade)
          load()[fk.table] = child.filter((r) => !refValues.has(r[fk.column]));
        else
          child.forEach(
            (r) => refValues.has(r[fk.column]) && (r[fk.column] = null),
          );
      }
      save();
      if (!this.returning) return ok(null, null, 204);
      return this.shape(targets, null);
    }
  }

  return { from: (table: string) => new QueryBuilder(table) };
}
