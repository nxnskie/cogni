"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import type { User } from "@supabase/supabase-js";
import { LogIn, LogOut, Moon, Settings2, Sun, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useReviewerStore } from "@/lib/store";
import { createClient } from "@/utils/supabase/client";

export function HeaderProfile() {
  const { resolvedTheme, setTheme } = useTheme();
  const setHistory = useReviewerStore((s) => s.setHistory);
  const clear = useReviewerStore((s) => s.clear);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    void supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) {
        setUser(data.user);
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const displayName =
    (typeof user?.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null) ||
    (typeof user?.user_metadata?.name === "string"
      ? user.user_metadata.name
      : null) ||
    user?.email ||
    "Guest";

  const avatarUrl =
    (typeof user?.user_metadata?.avatar_url === "string"
      ? user.user_metadata.avatar_url
      : null) ||
    (typeof user?.user_metadata?.picture === "string"
      ? user.user_metadata.picture
      : null);

  async function clearHistory() {
    setBusy(true);
    try {
      const res = await fetch("/api/reviewers", {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });
      const raw = await res.text();
      let data: unknown;
      try {
        data = JSON.parse(raw);
      } catch {
        toast.error("The server returned an unexpected response.");
        return;
      }
      if (res.ok) {
        setHistory([]);
        clear();
        toast.success("History cleared");
      } else {
        const message =
          typeof data === "object" && data !== null && "error" in data
            ? String(data.error)
            : "Unable to clear history right now.";
        toast.error(message);
      }
    } finally {
      setBusy(false);
    }
  }

  async function signInWithGoogle() {
    setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        console.error("[auth] Google sign-in", error);
        toast.error("Google sign-in is currently unavailable.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setBusy(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setHistory([]);
      clear();
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl border border-sf-border bg-sf-card/70 px-3 py-2.5 text-left transition-colors hover:bg-sf-card"
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sf-accent/20 text-xs font-semibold text-sf-accent">
              {displayName?.[0]?.toUpperCase() || "G"}
            </span>
          )}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-sf-text">
              {loading ? "…" : user ? displayName : "Guest"}
            </span>
            <span className="block truncate text-[11px] text-sf-faint">
              {user?.email || "Sign in to save history"}
            </span>
          </span>
          <Settings2 className="h-4 w-4 text-sf-faint" />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Theme, account, and history controls.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-sf-border bg-sf-card/60 px-3 py-3">
            <div>
              <p className="text-sm font-medium text-sf-text">Theme</p>
              <p className="text-xs text-sf-muted">Default is dark mode</p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              {resolvedTheme === "dark" ? (
                <>
                  <Sun className="h-3.5 w-3.5" /> Light
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5" /> Dark
                </>
              )}
            </Button>
          </div>

          {user ? (
            <div className="space-y-3 rounded-xl border border-sf-border bg-sf-card/60 p-3">
              <div className="flex items-center gap-3">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt=""
                    className="h-10 w-10 rounded-full"
                  />
                ) : null}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-sf-text">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-sf-muted">{user.email}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="destructive"
                className="w-full"
                disabled={busy}
                onClick={() => void clearHistory()}
              >
                <Trash2 className="h-4 w-4" />
                Clear all history
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                disabled={busy}
                onClick={() => void handleSignOut()}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          ) : (
            <div className="space-y-3 rounded-xl border border-sf-border bg-sf-card/60 p-3">
              <p className="text-sm text-sf-muted">
                Sign in with Google to save reviewers across sessions.
              </p>
              <Button
                type="button"
                className="w-full"
                disabled={busy || loading}
                onClick={() => void signInWithGoogle()}
              >
                <LogIn className="h-4 w-4" />
                Continue with Google
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
