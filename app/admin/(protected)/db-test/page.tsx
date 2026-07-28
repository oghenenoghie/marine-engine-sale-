"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { testDbConnectionAction, type DbTestReport } from "@/lib/actions/stock";

/**
 * Round-trip test against the live Supabase database: admin auth check,
 * service-role write, public anon-key read-back, cleanup delete. Mirrors
 * /cloudinary-test's purpose — a fast way to see exactly which step in the
 * persistence pipeline is broken instead of digging through logs.
 */
export default function DbTestPage() {
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState<DbTestReport | null>(null);

  const run = async () => {
    setRunning(true);
    setReport(null);
    const result = await testDbConnectionAction();
    setReport(result);
    setRunning(false);
  };

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h1 className="font-display text-xl font-bold">Database diagnostic</h1>
      <p className="mt-1 text-[13px] text-steel">
        Runs a real insert → read-back → delete against <code className="font-mono">stock_items</code>, using the
        same admin-auth check and service-role client the real save/delete actions use.
      </p>

      <Button type="button" onClick={run} disabled={running} className="mt-6">
        {running ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Running…
          </>
        ) : (
          "Run database test"
        )}
      </Button>

      {report && (
        <div className="mt-6 space-y-2">
          <div
            className={`rounded-sm border px-3 py-2 text-[13px] font-semibold ${
              report.ok ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-hull/30 bg-hull/5 text-hull"
            }`}
          >
            {report.ok ? "All checks passed" : "Failed"}
          </div>
          {report.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-2 rounded-sm border border-steel/15 bg-white px-3 py-2">
              {step.ok ? (
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
              ) : (
                <XCircle size={16} className="mt-0.5 shrink-0 text-hull" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-medium text-hull">{step.label}</span>
                  <span className="shrink-0 font-mono text-[11px] text-steel">{step.ms}ms</span>
                </div>
                <p className={`mt-0.5 break-words text-[12px] ${step.ok ? "text-steel" : "font-medium text-hull"}`}>{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
