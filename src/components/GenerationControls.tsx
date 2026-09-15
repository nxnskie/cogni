"use client";

import {
  MAX_FLASHCARDS,
  MAX_QUIZ_QUESTIONS,
  MIN_FLASHCARDS,
  MIN_QUIZ_QUESTIONS,
  type GenerationSettings,
} from "@/lib/types";
import { useReviewerStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const DIFFICULTIES: GenerationSettings["difficulty"][] = [
  "easy",
  "medium",
  "hard",
];

const FOCUSES: { id: GenerationSettings["focus"]; label: string }[] = [
  { id: "balanced", label: "Balanced" },
  { id: "conceptual", label: "Conceptual" },
  { id: "formulas", label: "Formulas & Math" },
  { id: "definitions", label: "Definitions" },
];

function rangeProgress(value: number, min: number, max: number): string {
  const percentage = ((value - min) / (max - min)) * 100;
  return `linear-gradient(to right, var(--sf-accent) ${percentage}%, var(--sf-border) ${percentage}%)`;
}

export function GenerationControls({ className }: { className?: string }) {
  const settings = useReviewerStore((s) => s.settings);
  const setSettings = useReviewerStore((s) => s.setSettings);
  const isGenerating = useReviewerStore((s) => s.isGenerating);

  return (
    <div
      className={cn(
        "grid gap-4 rounded-xl border border-sf-border/70 bg-sf-card/60 p-4 sm:grid-cols-2",
        className
      )}
    >
      <label className="space-y-2 text-sm">
        <span className="flex items-center justify-between text-sf-muted">
          Flashcards
          <span className="font-medium text-sf-accent">
            {settings.flashcardCount}
          </span>
        </span>
        <input
          type="range"
          min={MIN_FLASHCARDS}
          max={MAX_FLASHCARDS}
          value={settings.flashcardCount}
          disabled={isGenerating}
          onChange={(e) =>
            setSettings({ flashcardCount: Number(e.target.value) })
          }
          className="sf-range w-full"
          style={{
            background: rangeProgress(
              settings.flashcardCount,
              MIN_FLASHCARDS,
              MAX_FLASHCARDS
            ),
          }}
        />
      </label>

      <label className="space-y-2 text-sm">
        <span className="flex items-center justify-between text-sf-muted">
          Quiz questions
          <span className="font-medium text-sf-accent">{settings.quizCount}</span>
        </span>
        <input
          type="range"
          min={MIN_QUIZ_QUESTIONS}
          max={MAX_QUIZ_QUESTIONS}
          value={settings.quizCount}
          disabled={isGenerating}
          onChange={(e) => setSettings({ quizCount: Number(e.target.value) })}
          className="sf-range w-full"
          style={{
            background: rangeProgress(
              settings.quizCount,
              MIN_QUIZ_QUESTIONS,
              MAX_QUIZ_QUESTIONS
            ),
          }}
        />
      </label>

      <div className="space-y-2 text-sm sm:col-span-2">
        <p className="text-xs text-sf-faint">
          Start with 20 cards and 15 mixed questions. You can adjust the balance
          before generating a set.
        </p>
      </div>

      <div className="space-y-2 text-sm">
        <p className="text-sf-muted">Quiz difficulty</p>
        <div className="flex flex-wrap gap-1 rounded-lg bg-sf-bg2 p-1">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              type="button"
              disabled={isGenerating}
              onClick={() => setSettings({ difficulty: d })}
              className={cn(
                "rounded-md border border-transparent px-3 py-1.5 capitalize transition-colors",
                settings.difficulty === d
                  ? "bg-sf-card-hover text-sf-text shadow-sm"
                  : "text-sf-muted hover:bg-sf-card-hover/70 hover:text-sf-text"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <p className="text-sf-muted">Reviewer focus</p>
        <div className="flex flex-wrap gap-1 rounded-lg bg-sf-bg2 p-1">
          {FOCUSES.map((f) => (
            <button
              key={f.id}
              type="button"
              disabled={isGenerating}
              onClick={() => setSettings({ focus: f.id })}
              className={cn(
                "rounded-md border border-transparent px-3 py-1.5 transition-colors",
                settings.focus === f.id
                  ? "bg-sf-card-hover text-sf-text shadow-sm"
                  : "text-sf-muted hover:bg-sf-card-hover/70 hover:text-sf-text"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
