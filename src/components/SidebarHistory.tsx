"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useReviewerStore } from "@/lib/store";
import type { ReviewerListItem, SavedReviewer } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export function SidebarHistory({
  activeId,
  onSelect,
}: {
  activeId: string | null;
  onSelect: () => void;
}) {
  const history = useReviewerStore((s) => s.history);
  const setHistory = useReviewerStore((s) => s.setHistory);
  const loadSaved = useReviewerStore((s) => s.loadSaved);
  const removeHistoryItem = useReviewerStore((s) => s.removeHistoryItem);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    void supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) {
        setUser(data.user);
        setAuthReady(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authReady) return;

    if (!user) {
      setHistory([]);
      return;
    }

    void (async () => {
      try {
        const res = await fetch("/api/reviewers", {
          headers: { Accept: "application/json" },
        });
        const raw = await res.text();
        let data: unknown;
        try {
          data = JSON.parse(raw);
        } catch {
          console.error("[sidebar-history] non-JSON history response", res.status);
          return;
        }
        if (!res.ok || !Array.isArray(data)) {
          console.error("[sidebar-history] history request failed", res.status, data);
          return;
        }
        setHistory(data as ReviewerListItem[]);
      } catch (error) {
        console.error("[sidebar-history] history request failed", error);
      }
    })();
  }, [authReady, user, setHistory]);

  async function openReviewer(item: ReviewerListItem) {
    setLoadingId(item.id);
    try {
      const res = await fetch(`/api/reviewer/${item.id}`);
      const raw = await res.text();
      let data: unknown;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("The server returned an unexpected response.");
      }
      if (!res.ok) {
        const message =
          typeof data === "object" && data !== null && "error" in data
            ? String(data.error)
            : "Failed to load reviewer";
        throw new Error(message);
      }
      const saved = data as SavedReviewer;
      loadSaved(saved);
      onSelect();
    } finally {
      setLoadingId(null);
      setMenuId(null);
    }
  }

  async function deleteReviewer(id: string) {
    const res = await fetch(`/api/reviewer/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    removeHistoryItem(id);
    setMenuId(null);
  }

  if (!authReady) {
    return (
      <div className="px-3 py-4 text-xs leading-relaxed text-sf-faint">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-3 py-4 text-xs leading-relaxed text-sf-faint">
        Sign in to save reviewers and browse history here.
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="px-3 py-4 text-xs leading-relaxed text-sf-faint">
        No saved reviewers yet. Generate one to start your history.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 px-2">
      <p className="px-2 pb-1 text-[11px] font-medium uppercase tracking-[0.16em] text-sf-faint">
        History
      </p>
      {history.map((item) => (
        <div key={item.id} className="group relative">
          <button
            type="button"
            onClick={() => void openReviewer(item)}
            className={cn(
              "w-full rounded-xl px-3 py-2.5 text-left transition-colors",
              activeId === item.id
                ? "bg-sf-accent/15 text-sf-accent"
                : "text-sf-muted hover:bg-sf-card hover:text-sf-text"
            )}
          >
            <p className="truncate text-sm font-medium">
              {loadingId === item.id ? "Loading…" : item.title}
            </p>
            <p className="truncate text-[11px] text-sf-faint">
              {item.summary || item.fileName || "Saved reviewer"}
            </p>
          </button>
          <div className="absolute right-1 top-1.5 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                setMenuId((v) => (v === item.id ? null : item.id));
              }}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          {menuId === item.id && (
            <div className="absolute right-2 top-9 z-20 w-36 rounded-xl border border-sf-border bg-sf-bg2 p-1 shadow-xl">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-sf-error hover:bg-sf-error/10"
                onClick={() => void deleteReviewer(item.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
