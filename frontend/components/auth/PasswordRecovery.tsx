"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { publicAuthRequest } from "@/lib/apiClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
export function PasswordRecovery({ reset = false }: { reset?: boolean }) {
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (reset)
      setToken(new URLSearchParams(window.location.search).get("token") || "");
  }, [reset]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const result = await publicAuthRequest(
        reset ? "reset-password" : "forgot-password",
        reset
          ? { token, newPassword: form.get("password") }
          : { email: form.get("email") },
      );
      setMessage(
        reset
          ? "Your password has been updated. You can now sign in."
          : result?.message ||
              "If an account exists, a password reset link has been sent.",
      );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to process your request",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{reset ? "Reset password" : "Forgot password"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {message ? (
            <p role="status">{message}</p>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {reset ? (
                <div>
                  <Label htmlFor="new-password">New password</Label>
                  <Input
                    id="new-password"
                    name="password"
                    type="password"
                    required
                    minLength={12}
                    maxLength={72}
                    autoComplete="new-password"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="recovery-email">Company email</Label>
                  <Input
                    id="recovery-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                  />
                </div>
              )}
              {reset && !token && (
                <p className="text-destructive">
                  Open the reset link from your email to continue.
                </p>
              )}
              <Button type="submit" disabled={busy || (reset && !token)}>
                {busy
                  ? "Please wait…"
                  : reset
                    ? "Update password"
                    : "Send reset link"}
              </Button>
            </form>
          )}
          {error && (
            <p role="alert" className="text-destructive">
              {error}
            </p>
          )}
          <Link href="/login" className="block text-sm underline">
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
