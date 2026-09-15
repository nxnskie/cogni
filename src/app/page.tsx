"use client";

import { useState } from "react";
import { Check, Pencil } from "lucide-react";
import { FlashcardViewer } from "@/components/FlashcardViewer";
import { QuizEngine } from "@/components/QuizEngine";
import { StudyNotes } from "@/components/StudyNotes";
import { UploadPanel } from "@/components/UploadPanel";
import { AppShell } from "@/components/AppShell";
import { useReviewerStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "notes" as const, label: "Notes" },
  { id: "flashcards" as const, label: "Flashcards" },
  { id: "quiz" as const, label: "Quiz" },
];

export default function HomePage() {
  const payload = useReviewerStore((s) => s.payload);
  const fileName = useReviewerStore((s) => s.fileName);
  const title = useReviewerStore((s) => s.title);
  const activeTab = useReviewerStore((s) => s.activeTab);
  const setActiveTab = useReviewerStore((s) => s.setActiveTab);
  const reviewerId = useReviewerStore((s) => s.reviewerId);
  const updateTitle = useReviewerStore((s) => s.updateTitle);
  const [editingTitle, setEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [savingTitle, setSavingTitle] = useState(false);

  function beginTitleEdit() {
    setDraftTitle(title || "Study set");
    setEditingTitle(true);
  }

  async function saveTitle() {
    const nextTitle = draftTitle.trim();
    if (!reviewerId || !nextTitle || savingTitle) return;

    setSavingTitle(true);
    try {
      const response = await fetch(`/api/reviewer/${reviewerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: nextTitle }),
      });
      if (!response.ok) throw new Error("Unable to save title");
      updateTitle(nextTitle);
      setEditingTitle(false);
    } catch (error) {
      console.error("[home] title update failed", error);
    } finally {
      setSavingTitle(false);
    }
  }

  return (
    <AppShell>
      {!payload ? (
        <section className="flex min-h-[70vh] flex-col justify-center gap-8">
          <div className="sf-fade-up max-w-2xl">
            <p className="text-4xl font-bold tracking-tight text-sf-text sm:text-5xl">
              Cogni
            </p>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-sf-muted sm:text-lg">
              Upload study files, set the pace, and get notes you can actually
              work through.
            </p>
          </div>
          <div className="sf-fade-up-delay">
            <UploadPanel />
          </div>
        </section>
      ) : (
        <section className="sf-fade-up flex flex-col gap-8">
          <p className="text-xs text-sf-faint">Home / Study sets / {title || "Current set"}</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-sf-accent">
                {reviewerId ? "Saved set" : "Local session"}
              </p>
              <div className="mt-1 flex items-center gap-2">
                {editingTitle ? (
                  <input
                    autoFocus
                    value={draftTitle}
                    onChange={(event) => setDraftTitle(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") void saveTitle();
                      if (event.key === "Escape") setEditingTitle(false);
                    }}
                    onBlur={() => void saveTitle()}
                    className="min-w-0 rounded-lg border border-sf-accent bg-sf-bg2 px-2 py-1 text-3xl font-semibold text-sf-text outline-none"
                    maxLength={200}
                  />
                ) : (
                  <h2 className="text-3xl font-semibold text-sf-text">
                    {title || "Study set"}
                  </h2>
                )}
                {reviewerId && (
                  <button
                    type="button"
                    aria-label={editingTitle ? "Save reviewer title" : "Edit reviewer title"}
                    title={editingTitle ? "Save title" : "Edit title"}
                    disabled={savingTitle}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      if (editingTitle) void saveTitle();
                      else beginTitleEdit();
                    }}
                    className="rounded-lg p-1.5 text-sf-muted transition-colors hover:bg-sf-card-hover hover:text-sf-accent disabled:opacity-50"
                  >
                    {editingTitle ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                  </button>
                )}
              </div>
              {fileName && (
                <p className="mt-1 text-sm text-sf-muted">{fileName}</p>
              )}
            </div>
            <div className="flex gap-1 rounded-xl border border-sf-border/70 bg-sf-card/60 p-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "bg-sf-card-hover text-sf-text shadow-sm"
                      : "text-sf-muted hover:bg-sf-card-hover hover:text-sf-text"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "notes" && <StudyNotes notes={payload.studyNotes} />}
          {activeTab === "flashcards" && (
            <FlashcardViewer cards={payload.flashcards} />
          )}
          {activeTab === "quiz" && <QuizEngine questions={payload.quiz} />}
        </section>
      )}
    </AppShell>
  );
}
