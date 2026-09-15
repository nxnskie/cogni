"use client";

import { useState } from "react";
import type { StudyNoteTopic } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StudyNotesProps {
  notes: StudyNoteTopic[];
  className?: string;
}

/** Renders structured study notes as topic sections. */
export function StudyNotes({ notes, className }: StudyNotesProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

  if (selectedIndex !== null) {
    const topic = notes[selectedIndex];
    return (
      <NoteDetailView
        topic={topic}
        onBack={() => setSelectedIndex(null)}
        className={className}
      />
    );
  }

  return (
    <div className={cn("mx-auto flex w-full max-w-3xl flex-col gap-4", className)}>
      {notes.map((topic, i) => (
        <button
          type="button"
          key={`${topic.title}-${i}`}
          className={cn(
            "w-full rounded-xl border border-sf-border/70 bg-sf-card/65 p-6 text-left transition-colors hover:border-sf-border hover:bg-sf-card"
          )}
          onClick={() => setSelectedIndex(i)}
        >
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-semibold text-sf-text">
              {topic.title}
            </h3>
            <span className="shrink-0 text-xs text-sf-muted">Read note</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-sf-muted">
            {topic.summary}
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-sf-text/90">
            {topic.bulletPoints.map((point, idx) => (
              <li key={`${topic.title}-${idx}`}>{point}</li>
            ))}
          </ul>
        </button>
      ))}
    </div>
  );
}

function NoteDetailView({
  topic,
  onBack,
  className,
}: {
  topic: StudyNoteTopic;
  onBack: () => void;
  className?: string;
}) {
  const diagrams = topic.diagrams?.length
    ? topic.diagrams
    : topic.imageUrl
      ? [{ url: topic.imageUrl, caption: `Diagram for ${topic.title}` }]
      : [];

  return (
    <article className={cn("mx-auto w-full max-w-4xl", className)}>
      <button
        type="button"
        onClick={onBack}
        className="mb-5 text-sm font-medium text-sf-accent hover:text-sf-text"
      >
        ← Back to Notes Overview
      </button>
      <div className="rounded-2xl border border-sf-border bg-sf-card/90 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-sf-accent">
              Deep-dive note
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-sf-text">
              {topic.title}
            </h2>
          </div>
        </div>

        <section className="mt-7">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-sf-faint">
            Summary
          </h3>
          <p className="mt-3 text-base leading-relaxed text-sf-muted">{topic.summary}</p>
        </section>

        <section className="mt-7">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-sf-faint">
            Key Takeaways
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-sf-text/90">
            {topic.bulletPoints.map((point, index) => (
              <li key={`${topic.title}-takeaway-${index}`}>{point}</li>
            ))}
          </ul>
        </section>

        {topic.keyTerms && topic.keyTerms.length > 0 && (
          <section className="mt-7">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-sf-faint">
              Key Terms & Highlights
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {topic.keyTerms.map((term) => (
                <span
                  key={term}
                  className="rounded-lg border border-sf-accent/30 bg-sf-accent/10 px-3 py-1.5 text-sm text-sf-accent"
                >
                  {term}
                </span>
              ))}
            </div>
          </section>
        )}

        {topic.details && (
          <section className="mt-7 border-t border-sf-border pt-7">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-sf-faint">
              Detailed Breakdown
            </h3>
            <div className="mt-4 text-sm leading-relaxed text-sf-text/90">
              {topic.details.split(/\n\s*\n/).map((paragraph, index) => (
                <p key={`${topic.title}-detail-${index}`} className={cn(index > 0 && "mt-4")}>
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        )}

        {diagrams.length > 0 && (
          <section className="mt-7 border-t border-sf-border pt-7">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-sf-faint">
              Embedded Diagrams
            </h3>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              {diagrams.map((diagram) => (
                <figure key={diagram.url} className="space-y-2">
                  <img
                    src={diagram.url}
                    alt={diagram.caption || `Diagram for ${topic.title}`}
                    className="max-h-120 w-full rounded-xl border border-sf-border bg-sf-bg2 object-contain"
                    loading="lazy"
                  />
                  {diagram.caption && (
                    <figcaption className="text-sm text-sf-muted">{diagram.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
