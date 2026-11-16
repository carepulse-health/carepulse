import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password | CarePulse" },
      { name: "description", content: "Choose a new password for your CarePulse patient account." },
      { property: "og:title", content: "Reset password | CarePulse" },
      { property: "og:description", content: "Choose a new password for your CarePulse patient account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return setMessage(error.message);
    void navigate({ to: "/", replace: true });
  };
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-[26px] font-semibold tracking-tight">Choose a new password</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <Input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" />
        {message && <p className="text-xs text-destructive">{message}</p>}
        <Button type="submit" className="w-full">Save password</Button>
      </form>
    </main>
  );
}
