"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Anchor } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="grid min-h-screen place-items-center bg-hull px-6">
      <div className="w-full max-w-sm rounded-sm border border-paper/10 bg-paper/5 p-6">
        <div className="flex items-center gap-2 text-paper">
          <Anchor size={20} className="text-paper" />
          <span className="font-display text-lg font-extrabold tracking-tight">SHIPCOVE ADMIN</span>
        </div>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email" className="text-paper/60">
              Email
            </Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="password" className="text-paper/60">
              Password
            </Label>
            <Input id="password" name="password" type="password" required />
          </div>
          {error && <p className="text-[12px] font-medium text-hull">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
