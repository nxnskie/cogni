"use client";

import type { StudyNoteTopic } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StudyNotesProps {
  notes: StudyNoteTopic[];
  className?: string;
}

/** Renders structured study notes as topic sections. */
export function StudyNotes({ notes, className }: StudyNotesProps) {
  if (notes.length === 0) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-dashed border-sf-border p-8 text-center text-sm text-sf-muted",
          className
        )}
      >
        No study notes available.
      </div>
    );
  }

  return (
    <div className={cn("mx-auto flex w-full max-w-3xl flex-col gap-4", className)}>
      {notes.map((topic, i) => (
        <article
          key={`${topic.title}-${i}`}
          className="rounded-2xl border border-sf-border bg-sf-card/90 p-6 transition-colors hover:border-sf-accent/30 hover:bg-sf-card"
        >
          <h3 className="font-display text-xl font-semibold text-sf-text">
            {topic.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-sf-muted">
            {topic.summary}
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-sf-text/90">
            {topic.bulletPoints.map((point, idx) => (
              <li key={`${topic.title}-${idx}`}>{point}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
