"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { apiRequest, isDemoMode } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
type Account = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};
export default function AccountsPage() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try {
      setAccounts(await apiRequest("/crm/accounts"));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load accounts");
    }
  }, []);
  useEffect(() => {
    if (user?.role === "admin" && !isDemoMode) void load();
  }, [user, load]);
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    setBusy(true);
    try {
      await apiRequest("/crm/accounts", values);
      form.reset();
      toast.success("Account created");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unable to create account");
    } finally {
      setBusy(false);
    }
  }
  async function update(id: string, changes: Record<string, string>) {
    setBusy(true);
    try {
      await apiRequest(`/crm/accounts/${id}`, changes, "PATCH");
      await load();
      toast.success("Access updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unable to update account");
    } finally {
      setBusy(false);
    }
  }
  if (user?.role !== "admin" || isDemoMode)
    return (
      <p className="p-6">
        Account management requires an administrator connected to the backend.
      </p>
    );
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="space-y-6 p-6">
          <h1 className="text-2xl font-semibold">Login accounts</h1>
          <p className="text-muted-foreground">
            Create access for an employee using their official email. HR
            accounts can manage attendance and employee documents.
          </p>
          <Card>
            <CardHeader>
              <CardTitle>Create account</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={create} className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="account-name">Full name</Label>
                  <Input
                    id="account-name"
                    name="name"
                    required
                    maxLength={100}
                  />
                </div>
                <div>
                  <Label htmlFor="account-email">Official email</Label>
                  <Input
                    id="account-email"
                    name="email"
                    type="email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="account-password">Initial password</Label>
                  <Input
                    id="account-password"
                    name="password"
                    type="password"
                    minLength={12}
                    maxLength={72}
                    required
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <Label htmlFor="account-role">Role</Label>
                  <select
                    id="account-role"
                    name="role"
                    className="w-full rounded-md border p-2"
                    defaultValue="EMPLOYEE"
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="MANAGER">HR</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>
                <Button disabled={busy} type="submit">
                  {busy ? "Saving…" : "Create account"}
                </Button>
              </form>
            </CardContent>
          </Card>
          {error && (
            <p role="alert" className="text-destructive">
              {error}
            </p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id} className="border-t">
                    <td className="p-3">{account.name}</td>
                    <td className="p-3">{account.email}</td>
                    <td className="p-3">
                      <select
                        aria-label={`Role for ${account.email}`}
                        value={account.role}
                        disabled={busy || account.email === user.email}
                        onChange={(e) =>
                          void update(account.id, { role: e.target.value })
                        }
                      >
                        <option value="EMPLOYEE">Employee</option>
                        <option value="MANAGER">HR</option>
                        <option value="ADMIN">Administrator</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <select
                        aria-label={`Status for ${account.email}`}
                        value={account.status}
                        disabled={busy || account.email === user.email}
                        onChange={(e) =>
                          void update(account.id, { status: e.target.value })
                        }
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
