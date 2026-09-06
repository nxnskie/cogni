"use client";

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

  return (
    <AppShell>
      {!payload ? (
        <section className="flex min-h-[70vh] flex-col justify-center gap-8">
          <div className="sf-fade-up max-w-2xl">
            <p className="font-display text-4xl font-bold tracking-tight text-sf-text sm:text-5xl">
              Cogni
            </p>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-sf-muted sm:text-lg">
              Upload your materials. Tune flashcards, quiz size, difficulty, and
              focus — then walk out with a complete study pack.
            </p>
          </div>
          <div className="sf-fade-up-delay">
            <UploadPanel />
          </div>
        </section>
      ) : (
        <section className="sf-fade-up flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-sf-accent">
                {reviewerId ? "Saved reviewer" : "Guest session"}
              </p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-sf-text">
                {title || "Study session"}
              </h2>
              {fileName && (
                <p className="mt-1 text-sm text-sf-muted">{fileName}</p>
              )}
            </div>
            <div className="flex gap-1 rounded-2xl border border-sf-border bg-sf-card/80 p-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "bg-sf-accent text-sf-bg"
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
