"use client";

import { useCallback, useEffect, useState } from "react";
import type { Flashcard } from "@/lib/types";
import { useReviewerStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FlashcardViewerProps {
  cards: Flashcard[];
  className?: string;
}

export function FlashcardViewer({ cards, className }: FlashcardViewerProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const reviewerId = useReviewerStore((s) => s.reviewerId);
  const updateFlashcardLocal = useReviewerStore((s) => s.updateFlashcardLocal);

  const total = cards.length;
  const card = total > 0 ? cards[index] : null;

  const goPrev = useCallback(() => {
    setFlipped(false);
    setIndex((i) => (i <= 0 ? total - 1 : i - 1));
  }, [total]);

  const goNext = useCallback(() => {
    setFlipped(false);
    setIndex((i) => (i >= total - 1 ? 0 : i + 1));
  }, [total]);

  const flip = useCallback(() => setFlipped((f) => !f), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        flip();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flip, goNext, goPrev]);

  async function setStatus(status: "mastered" | "needs_review") {
    if (!card) return;
    updateFlashcardLocal(card.id, { status });
    if (!reviewerId) return;
    await fetch(`/api/reviewer/${reviewerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        flashcards: [{ id: card.id, status }],
      }),
    });
  }

  if (!card || total === 0) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-dashed border-sf-border p-8 text-center text-sm text-sf-muted",
          className
        )}
      >
        No flashcards available.
      </div>
    );
  }

  return (
    <div className={cn("mx-auto flex w-full max-w-xl flex-col gap-4", className)}>
      <div className="flex items-center justify-between text-sm text-sf-muted">
        <span className="rounded-lg bg-sf-accent/15 px-2.5 py-1 font-medium text-sf-accent">
          {card.tag}
        </span>
        <span>
          Card {index + 1} / {total}
        </span>
      </div>

      <button
        type="button"
        onClick={flip}
        aria-label={flipped ? "Show question" : "Show answer"}
        className="group relative h-72 w-full cursor-pointer [perspective:1200px]"
      >
        <div
          className={cn(
            "relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]",
            flipped && "[transform:rotateY(180deg)]"
          )}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border border-sf-border bg-sf-card p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.35)] [backface-visibility:hidden]">
            <p className="text-xs uppercase tracking-[0.2em] text-sf-faint">
              Question
            </p>
            <p className="text-lg font-semibold leading-snug text-sf-text">
              {card.front}
            </p>
            <p className="text-xs text-sf-faint">
              Space / click to flip · ← → navigate
            </p>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border border-sf-accent/35 bg-gradient-to-br from-sf-accent/15 to-sf-card p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.35)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <p className="text-xs uppercase tracking-[0.2em] text-sf-accent/80">
              Answer
            </p>
            <p className="text-lg font-medium leading-snug text-sf-text">
              {card.back}
            </p>
          </div>
        </div>
      </button>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button type="button" variant="secondary" onClick={goPrev}>
          Previous
        </Button>
        <Button type="button" onClick={flip}>
          Flip
        </Button>
        <Button type="button" variant="secondary" onClick={goNext}>
          Next
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          type="button"
          size="sm"
          variant={card.status === "mastered" ? "default" : "secondary"}
          onClick={() => void setStatus("mastered")}
        >
          Mastered
        </Button>
        <Button
          type="button"
          size="sm"
          variant={
            card.status !== "mastered" ? "destructive" : "secondary"
          }
          onClick={() => void setStatus("needs_review")}
        >
          Needs Review
        </Button>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-sf-border">
        <div
          className="h-full rounded-full bg-sf-accent transition-all duration-300"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
