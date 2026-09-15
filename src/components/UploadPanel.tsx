"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import type {
  DocumentImage,
  ReviewerListItem,
  ReviewerPayload,
  SavedReviewer,
} from "@/lib/types";
import { useReviewerStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { GenerationControls } from "@/components/GenerationControls";
import { toUserFacingError } from "@/lib/user-facing-error";
import { createClient } from "@/utils/supabase/client";

const ACCEPT =
  ".pdf,.docx,.pptx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,text/markdown";

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

type UploadedDocument = {
  id: string;
  fileName: string;
  markdown: string;
  images: DocumentImage[];
};

export function UploadPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [draft, setDraft] = useState("");
  const [instructions, setInstructions] = useState("");
  const [title, setTitle] = useState("");

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
    try {
      const res = await fetch("/api/reviewers", {
        headers: { Accept: "application/json" },
      });
      const raw = await res.text();
      let data: unknown;
      try {
        data = JSON.parse(raw);
      } catch {
        console.error("[upload-panel] non-JSON history response", res.status);
        return;
      }
      if (!res.ok || !Array.isArray(data)) {
        console.error("[upload-panel] history request failed", res.status, data);
        return;
      }
      setHistory(data as ReviewerListItem[]);
    } catch (error) {
      console.error("[upload-panel] history request failed", error);
    }
  }

  async function parseFile(file: File): Promise<UploadedDocument | null> {
    if (file.size > MAX_UPLOAD_BYTES) {
      const message =
        "This deployment accepts files up to 4 MB. Please compress the file or paste its text directly.";
      toast.error(message);
      setError(message);
      return null;
    }

    try {
      const form = new FormData();
      form.append("file", file);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      const rawText = await uploadRes.text();
      let uploadJson: {
        fileName?: string;
        markdown?: string;
        images?: DocumentImage[];
        error?: string;
      };

      try {
        uploadJson = JSON.parse(rawText) as typeof uploadJson;
      } catch {
        console.warn("[upload-panel] non-JSON response", uploadRes.status);
        throw new Error(
          `Upload failed (${uploadRes.status}). The deployment may have rejected the file or the server may be unavailable.`
        );
      }

      if (!uploadRes.ok || !uploadJson.markdown) {
        throw new Error(toUserFacingError(uploadJson.error, "Failed to read this document."));
      }

      return {
        id: `${file.name}-${file.size}-${file.lastModified}`,
        fileName: uploadJson.fileName || file.name,
        markdown: uploadJson.markdown,
        images: uploadJson.images ?? [],
      };
    } catch (err) {
      const raw = err instanceof Error ? err.message : null;
      console.error("[upload-panel]", raw);
      setError(toUserFacingError(raw));
      return null;
    }
  }

  async function onGenerate() {
    if (!draft.trim() || isGenerating) return;

    setError(null);
    setGenerating(true);
    setStatus("Building notes, flashcards, and quiz…");

    try {
      const markdown = instructions.trim()
        ? `${draft.trim()}\n\n## Reviewer instructions\n${instructions.trim()}`
        : draft.trim();
      const genRes = await fetch("/api/generate-reviewer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          markdown,
          fileName: documents.map((document) => document.fileName).join(", "),
          title: title.trim() || undefined,
          settings,
          documentImages: documents.flatMap((document) => document.images),
        }),
      });
      const rawText = await genRes.text();
      const genJson = JSON.parse(rawText) as ReviewerPayload & {
        error?: string;
        warning?: string;
        reviewerId?: string | null;
        saved?: SavedReviewer;
        generatedTitle?: string;
      };

      if (!genRes.ok) {
        throw new Error(toUserFacingError(genJson.error, "Failed to generate the reviewer."));
      }
      if (!genJson.studyNotes || !genJson.flashcards || !genJson.quiz) {
        throw new Error("Failed to process document structure. Please try again.");
      }
      if (genJson.warning) toast.message(genJson.warning);

      setPayload(genJson, {
        fileName: documents.map((document) => document.fileName).join(", "),
        reviewerId: genJson.reviewerId ?? null,
        title:
          genJson.saved?.title ||
          genJson.generatedTitle ||
          title.trim() ||
          undefined,
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

  async function onFileSelect(files: FileList | null) {
    const selectedFiles = Array.from(files ?? []);
    resetFileInput();
    if (!selectedFiles.length || isGenerating) return;

    setError(null);
    setGenerating(true);
    const parsedDocuments: UploadedDocument[] = [];
    for (let index = 0; index < selectedFiles.length; index += 1) {
      const file = selectedFiles[index];
      setStatus(
        `Reading document ${index + 1} of ${selectedFiles.length}: ${file.name}`
      );
      const parsed = await parseFile(file);
      if (parsed) parsedDocuments.push(parsed);
    }
    setDocuments((current) => {
      const additions = parsedDocuments.filter(
        (document) => !current.some((item) => item.id === document.id)
      );
      if (additions.length > 0) {
        setDraft((currentDraft) => {
          const additionsDraft = additions
            .map((document) => `# ${document.fileName}\n\n${document.markdown}`)
            .join("\n\n---\n\n");
          return currentDraft
            ? `${currentDraft}\n\n---\n\n${additionsDraft}`
            : additionsDraft;
        });
      }
      const next = [...current, ...additions];
      return next;
    });
    setStatus(null);
    setGenerating(false);
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
          "group relative overflow-hidden rounded-2xl border border-dashed px-6 py-14 text-center transition-all duration-300",
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
          multiple
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => onFileSelect(e.target.files)}
        />
        <div className="relative z-1 flex flex-col items-center gap-3">
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
          <p className="text-xl font-semibold text-sf-text">
            Drop study materials here
          </p>
          <p className="max-w-md text-sm leading-relaxed text-sf-muted">
            Add one or more PDF, DOCX, TXT, or MD files. Review and edit the
            extracted material before creating your study set.
            {user
              ? " Signed in: results save to your history."
              : " As a guest, results stay until you refresh."}
          </p>
          <span className="mt-2 rounded-lg border border-sf-border bg-sf-bg2 px-5 py-2.5 text-sm font-semibold text-sf-text transition-colors group-hover:border-sf-accent/60 group-hover:bg-sf-card-hover">
            {isGenerating ? "Reading…" : "Choose files"}
          </span>
        </div>
      </div>

      {documents.length > 0 && (
        <div className="space-y-4 rounded-2xl border border-sf-border bg-sf-card/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-sf-text">Files for this set</p>
              <p className="text-xs text-sf-muted">
                {documents.length} file{documents.length === 1 ? "" : "s"} ready to edit
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setDocuments([]);
                setDraft("");
                setInstructions("");
                setTitle("");
              }}
              className="text-xs text-sf-muted hover:text-sf-text"
            >
              Clear all
            </button>
          </div>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Name this set (optional)"
            className="w-full rounded-xl border border-sf-border bg-sf-bg2 px-3 py-2 text-sm text-sf-text outline-none focus:border-sf-accent"
          />
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={12}
            className="w-full resize-y rounded-xl border border-sf-border bg-sf-bg2 px-3 py-3 text-sm leading-relaxed text-sf-text outline-none focus:border-sf-accent"
            placeholder="Edit the extracted text here..."
          />
          <textarea
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            rows={3}
            placeholder="What should the reviewer focus on? (Optional)"
            className="w-full resize-y rounded-xl border border-sf-border bg-sf-bg2 px-3 py-3 text-sm leading-relaxed text-sf-text outline-none focus:border-sf-accent"
          />
          <button
            type="button"
            disabled={isGenerating || draft.trim().length < 40}
            onClick={() => void onGenerate()}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-100 px-5 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? "Building set…" : "Create study set"}
          </button>
        </div>
      )}

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
