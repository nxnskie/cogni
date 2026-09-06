"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useReviewerStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { SidebarHistory } from "@/components/SidebarHistory";
import { HeaderProfile } from "@/components/HeaderProfile";
import { Button } from "@/components/ui/button";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const payload = useReviewerStore((s) => s.payload);
  const reviewerId = useReviewerStore((s) => s.reviewerId);
  const clear = useReviewerStore((s) => s.clear);

  function goNew() {
    clear();
    setMobileOpen(false);
  }

  return (
    <div className="relative min-h-screen bg-sf-bg text-sf-text">
      <div
        className="sf-bg-anim pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 15% 45%, rgba(6,214,160,0.07) 0%, transparent 50%), radial-gradient(ellipse at 85% 15%, rgba(255,209,102,0.045) 0%, transparent 48%), radial-gradient(ellipse at 50% 90%, rgba(17,138,178,0.05) 0%, transparent 50%)",
        }}
      />

      <button
        type="button"
        className="fixed left-4 top-4 z-40 rounded-xl border border-sf-border bg-sf-card/90 p-2.5 text-sf-text backdrop-blur md:hidden"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 6h18M3 12h18M3 18h18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/55 md:hidden"
          aria-label="Close menu overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-sf-border bg-sf-bg2/95 backdrop-blur-xl transition-transform duration-300 md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="border-b border-sf-border px-4 py-5">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sf-accent/15 text-sf-accent">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </span>
            <div>
              <p className="font-display text-xl font-bold tracking-tight">
                Cogni
              </p>
              <p className="text-xs text-sf-faint">Master your materials</p>
            </div>
          </div>
          <Button type="button" className="w-full" onClick={goNew}>
            <Plus className="h-4 w-4" />
            New Reviewer
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-3">
          <SidebarHistory
            activeId={reviewerId}
            onSelect={() => setMobileOpen(false)}
          />
        </div>

        <div className="border-t border-sf-border p-3">
          <HeaderProfile />
        </div>
      </aside>

      <div className="md:pl-[280px]">
        <main className="mx-auto min-h-screen w-full max-w-5xl px-5 pb-16 pt-16 md:px-8 md:pt-10">
          {children}
        </main>
      </div>

      {payload ? null : null}
    </div>
  );
}
