/** HTTP adapter preserving the query interface used by the existing screens. */
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
).replace(/\/$/, "");
export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
type Result = {
  data: any;
  error: any;
  count: number | null;
  status: number;
  statusText: string;
};
type Session = {
  access_token: string;
  user: any;
  expires_at: number;
  token_type: string;
};
let session: Session | null = null;
let refreshing: Promise<Session | null> | null = null;
const listeners = new Set<(event: string, session: Session | null) => void>();
const failure = (message: string, status = 400): Result => ({
  data: null,
  error: { message, status },
  count: null,
  status,
  statusText: "Error",
});
const success = (data: any): Result => ({
  data,
  error: null,
  count: null,
  status: 200,
  statusText: "OK",
});
async function readResponse(response: Response) {
  if (response.status === 204) return null;
  const value = await response.json();
  if (!response.ok)
    throw new Error(
      Array.isArray(value.message)
        ? value.message.join(", ")
        : value.message || "Request failed",
    );
  return value;
}
async function establish(value: any) {
  const response = await fetch(`${API_URL}/crm/profile`, {
    headers: { Authorization: `Bearer ${value.accessToken}` },
    credentials: "include",
  });
  const profile = await readResponse(response);
  session = {
    access_token: value.accessToken,
    token_type: "bearer",
    expires_at: Date.now() / 1000 + 14 * 60,
    user: {
      id: profile.whalesync_postgres_id,
      email: value.user.email,
      created_at: profile.date_of_joining,
      role: profile.role,
      user_metadata: { full_name: profile.full_name },
      app_metadata: { role: profile.role },
    },
  };
  return session;
}
async function refresh(): Promise<Session | null> {
  if (refreshing) return refreshing;
  refreshing = (async () => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      return await establish(await readResponse(response));
    } catch {
      session = null;
      listeners.forEach((l) => l("SIGNED_OUT", null));
      return null;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}
async function currentSession() {
  return session && session.expires_at > Date.now() / 1000
    ? session
    : refresh();
}
export async function apiRequest(
  path: string,
  body?: unknown,
  method?: string,
): Promise<any> {
  const current = await currentSession();
  if (!current) throw new Error("Please sign in to continue");
  const send = (token: string) =>
    fetch(`${API_URL}${path}`, {
      method: method || (body === undefined ? "GET" : "POST"),
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  let response = await send(current.access_token);
  if (response.status === 401) {
    const renewed = await refresh();
    if (!renewed) throw new Error("Your session expired. Please sign in again");
    response = await send(renewed.access_token);
  }
  return readResponse(response);
}
class RemoteQuery implements PromiseLike<Result> {
  private operations: { method: string; args: any[] }[] = [];
  private pending?: Promise<Result>;
  constructor(private table: string) {}
  private op(method: string, ...args: any[]) {
    this.operations.push({ method, args });
    return this;
  }
  select(columns = "*", opts = {}) {
    return this.op("select", columns, opts);
  }
  insert(values: any) {
    return this.op("insert", values);
  }
  upsert(values: any, opts = {}) {
    return this.op("upsert", values, opts);
  }
  update(values: any) {
    return this.op("update", values);
  }
  delete() {
    return this.op("delete");
  }
  eq(c: string, v: any) {
    return this.op("eq", c, v);
  }
  neq(c: string, v: any) {
    return this.op("neq", c, v);
  }
  gt(c: string, v: any) {
    return this.op("gt", c, v);
  }
  gte(c: string, v: any) {
    return this.op("gte", c, v);
  }
  lt(c: string, v: any) {
    return this.op("lt", c, v);
  }
  lte(c: string, v: any) {
    return this.op("lte", c, v);
  }
  like(c: string, v: string) {
    return this.op("like", c, v);
  }
  ilike(c: string, v: string) {
    return this.op("ilike", c, v);
  }
  in(c: string, v: any[]) {
    return this.op("in", c, v);
  }
  is(c: string, v: any) {
    return this.op("is", c, v);
  }
  contains(c: string, v: any) {
    return this.op("contains", c, v);
  }
  not(c: string, op: string, v: any) {
    return this.op("not", c, op, v);
  }
  filter(c: string, op: string, v: any) {
    return this.op("filter", c, op, v);
  }
  match(values: any) {
    return this.op("match", values);
  }
  or(value: string) {
    return this.op("or", value);
  }
  order(c: string, opts = {}) {
    return this.op("order", c, opts);
  }
  limit(n: number) {
    return this.op("limit", n);
  }
  range(a: number, b: number) {
    return this.op("range", a, b);
  }
  single() {
    return this.op("single");
  }
  maybeSingle() {
    return this.op("maybeSingle");
  }
  abortSignal(_signal?: AbortSignal) {
    return this;
  }
  returns<T = any>() {
    return this;
  }
  throwOnError() {
    return this;
  }
  then<A = Result, B = never>(
    resolve?: ((value: Result) => A | PromiseLike<A>) | null,
    reject?: ((reason: any) => B | PromiseLike<B>) | null,
  ): PromiseLike<A | B> {
    this.pending ||= apiRequest(
      `/crm/resources/${encodeURIComponent(this.table)}/query`,
      { operations: this.operations },
    ).catch((e) => failure(e.message));
    return this.pending.then(resolve, reject);
  }
}
const auth = {
  async signInWithPassword(body: { email: string; password: string }) {
    try {
      if (refreshing) await refreshing;
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const next = await establish(await readResponse(response));
      listeners.forEach((l) => l("SIGNED_IN", next));
      return { data: { user: next.user, session: next }, error: null };
    } catch (e: any) {
      return {
        data: { user: null, session: null },
        error: { message: e.message },
      };
    }
  },
  async getSession() {
    return { data: { session: await currentSession() }, error: null };
  },
  async getUser() {
    const current = await currentSession();
    return {
      data: { user: current?.user || null },
      error: current ? null : { message: "Please sign in" },
    };
  },
  async signOut() {
    if (refreshing) await refreshing;
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    await readResponse(response);
    session = null;
    listeners.forEach((l) => l("SIGNED_OUT", null));
    return { error: null };
  },
  onAuthStateChange(
    callback: (event: string, session: Session | null) => void,
  ) {
    listeners.add(callback);
    void currentSession().then((s) => callback("INITIAL_SESSION", s));
    return {
      data: { subscription: { unsubscribe: () => listeners.delete(callback) } },
    };
  },
};
async function storageRequest(
  bucket: string,
  action: string,
  path?: string,
  extra = {},
): Promise<Result> {
  try {
    return success(
      await apiRequest("/crm/files", { bucket, action, path, ...extra }),
    );
  } catch (e: any) {
    return failure(e.message);
  }
}
const storage = {
  from: (bucket: string) => ({
    async upload(path: string, file: Blob) {
      const content = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result).split(",")[1]);
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      return storageRequest(bucket, "upload", path, {
        content,
        mimeType: file.type,
      });
    },
    getPublicUrl(path: string) {
      return { data: { publicUrl: `crm-file://${bucket}/${path}` } };
    },
    async createSignedUrl(path: string, _expires?: number) {
      const result = await storageRequest(bucket, "sign", path);
      if (result.data)
        result.data.signedUrl = `${API_URL}${result.data.signedUrl}`;
      return result;
    },
    async download(path: string) {
      const result = await storageRequest(bucket, "download", path);
      if (result.data) {
        const bytes = Uint8Array.from(atob(result.data.content), (c) =>
          c.charCodeAt(0),
        );
        result.data = new Blob([bytes], { type: result.data.mimeType });
      }
      return result;
    },
    async remove(paths: string[]) {
      const results = await Promise.all(
        paths.map((path) => storageRequest(bucket, "remove", path)),
      );
      return (
        results.find((r) => r.error) || success(results.map((r) => r.data))
      );
    },
    list() {
      return storageRequest(bucket, "list");
    },
  }),
};
export async function resolveFileUrl(url: string) {
  if (!url.startsWith("crm-file://")) return url;
  const [bucket, ...parts] = url.slice("crm-file://".length).split("/");
  const { data, error } = await storage
    .from(bucket)
    .createSignedUrl(parts.join("/"));
  if (error) throw new Error(error.message);
  return data.signedUrl as string;
}
export const apiClient = {
  from: (name: string) => new RemoteQuery(name),
  auth,
  storage,
  async rpc() {
    return failure("This operation is not implemented");
  },
  channel() {
    const ch = {
      on: (..._args: any[]) => ch,
      subscribe: (..._args: any[]) => ch,
      unsubscribe: async () => "ok",
    };
    return ch;
  },
  removeChannel: async (..._args: any[]) => "ok",
};

export async function publicAuthRequest(
  path: "forgot-password" | "reset-password",
  body: unknown,
) {
  return readResponse(
    await fetch(`${API_URL}/auth/${path}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}
