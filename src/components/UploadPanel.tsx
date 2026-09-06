"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import type { ReviewerListItem, ReviewerPayload, SavedReviewer } from "@/lib/types";
import { useReviewerStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { GenerationControls } from "@/components/GenerationControls";
import { toUserFacingError } from "@/lib/user-facing-error";
import { createClient } from "@/utils/supabase/client";

const ACCEPT =
  ".pdf,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown";

const PPTX_UNSUPPORTED_MESSAGE =
  "PPTX file parsing requires converting to PDF first, or paste your text directly.";

function getExtension(name: string): string {
  const idx = name.lastIndexOf(".");
  return idx >= 0 ? name.slice(idx).toLowerCase() : "";
}

export function UploadPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const isGenerating = useReviewerStore((s) => s.isGenerating);
  const settings = useReviewerStore((s) => s.settings);
  const setGenerating = useReviewerStore((s) => s.setGenerating);
  const setPayload = useReviewerStore((s) => s.setPayload);
  const setError = useReviewerStore((s) => s.setError);
  const setHistory = useReviewerStore((s) => s.setHistory);
  const error = useReviewerStore((s) => s.error);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function refreshHistory() {
    if (!user) return;
    const res = await fetch("/api/reviewers");
    if (!res.ok) return;
    setHistory((await res.json()) as ReviewerListItem[]);
  }

  async function processFile(file: File) {
    const ext = getExtension(file.name);
    if (ext === ".pptx") {
      toast.error(PPTX_UNSUPPORTED_MESSAGE);
      setError(PPTX_UNSUPPORTED_MESSAGE);
      return;
    }

    setError(null);
    setStatus(null);
    setGenerating(true);
    setStatus("Reading document…");

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("flashcardCount", String(settings.flashcardCount));
      form.append("quizCount", String(settings.quizCount));
      form.append("difficulty", settings.difficulty);
      form.append("focus", settings.focus);

      setStatus("Building notes, flashcards, and quiz…");

      const genRes = await fetch("/api/generate-reviewer", {
        method: "POST",
        body: form,
      });

      const rawText = await genRes.text();
      let genJson: ReviewerPayload & {
        error?: string;
        warning?: string;
        reviewerId?: string | null;
        saved?: SavedReviewer;
      };

      try {
        genJson = JSON.parse(rawText) as typeof genJson;
      } catch {
        console.error(
          "[upload-panel] non-JSON response",
          genRes.status,
          rawText.slice(0, 200)
        );
        throw new Error(
          "The server returned an unexpected response. Please try again."
        );
      }

      if (!genRes.ok) {
        throw new Error(
          toUserFacingError(
            genJson.error,
            "Failed to process document structure. Please try uploading again."
          )
        );
      }

      if (!genJson.studyNotes || !genJson.flashcards || !genJson.quiz) {
        throw new Error(
          "Failed to process document structure. Please try uploading again."
        );
      }

      if (genJson.warning) {
        toast.message(genJson.warning);
      }

      setPayload(genJson, {
        fileName: file.name,
        reviewerId: genJson.reviewerId ?? null,
        title: genJson.saved?.title,
      });
      await refreshHistory();
      setStatus(null);
    } catch (err) {
      const raw = err instanceof Error ? err.message : null;
      console.error("[upload-panel]", raw);
      setError(toUserFacingError(raw));
      setStatus(null);
      setGenerating(false);
    }
  }

  function resetFileInput() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function onFileSelect(files: FileList | null) {
    const file = files?.[0];
    resetFileInput();
    if (!file || isGenerating) return;

    setError(null);
    setStatus(null);
    void processFile(file);
  }

  function openFilePicker() {
    if (isGenerating) return;
    setError(null);
    resetFileInput();
    inputRef.current?.click();
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <GenerationControls />

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openFilePicker();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (isGenerating) return;
          setError(null);
          onFileSelect(e.dataTransfer.files);
        }}
        onClick={openFilePicker}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-dashed px-6 py-14 text-center transition-all duration-300",
          dragOver
            ? "border-sf-accent bg-sf-accent/10"
            : "border-sf-border bg-sf-card/70 hover:border-sf-accent/60 hover:bg-sf-card",
          isGenerating && "pointer-events-none"
        )}
      >
        {isGenerating && <div className="sf-shimmer absolute inset-0" />}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => onFileSelect(e.target.files)}
        />
        <div className="relative z-[1] flex flex-col items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sf-accent/15 text-sf-accent">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <p className="font-display text-xl font-semibold text-sf-text">
            Drop study material here
          </p>
          <p className="max-w-md text-sm leading-relaxed text-sf-muted">
            PDF, DOCX, TXT, or MD — extracted and converted into study notes,
            flashcards, and a quiz.
            {user
              ? " Signed in: results save to your history."
              : " As a guest, results stay until you refresh."}
          </p>
          <span className="mt-2 rounded-xl bg-sf-accent px-5 py-2.5 text-sm font-semibold text-sf-bg shadow-[0_8px_24px_rgba(6,214,160,0.25)]">
            {isGenerating ? "Working…" : "Choose file"}
          </span>
        </div>
      </div>

      {(status || error) && (
        <p
          className={cn(
            "text-center text-sm leading-relaxed",
            error ? "text-sf-error" : "text-sf-muted"
          )}
        >
          {error || status}
        </p>
      )}
    </div>
  );
}
