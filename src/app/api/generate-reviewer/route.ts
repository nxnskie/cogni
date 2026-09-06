import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { extractGeminiError, generateReviewerFromMarkdown } from "@/lib/gemini";
import { MAX_MARKDOWN_CHARS } from "@/lib/limits";
import {
  DocumentParseError,
  parseSettingsFromFormData,
  parseUploadedDocument,
} from "@/lib/parse-document";
import { mapReviewerRecord, saveReviewerForUser } from "@/lib/reviewers";
import { ensureAppUser, getAuthUser } from "@/lib/supabase-auth";
import { toUserFacingError } from "@/lib/user-facing-error";
import {
  DEFAULT_GENERATION_SETTINGS,
  MAX_FLASHCARDS,
  MAX_QUIZ_QUESTIONS,
  type GenerationSettings,
} from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const VERCEL_MAX_FLASHCARDS = 30;
const VERCEL_MAX_QUIZ = 25;

const bodySchema = z.object({
  markdown: z.string().min(40, "Markdown payload is too short"),
  fileName: z.string().max(260).optional(),
  title: z.string().max(200).optional(),
  settings: z
    .object({
      flashcardCount: z.number().int().min(5).max(MAX_FLASHCARDS).optional(),
      quizCount: z.number().int().min(5).max(MAX_QUIZ_QUESTIONS).optional(),
      difficulty: z.enum(["easy", "medium", "hard"]).optional(),
      focus: z
        .enum(["conceptual", "formulas", "definitions", "balanced"])
        .optional(),
    })
    .optional(),
});

function jsonError(
  error: string,
  status: number,
  details?: unknown
): NextResponse {
  return NextResponse.json(
    {
      error,
      ...(details !== undefined
        ? { details: typeof details === "string" ? details : String(details) }
        : {}),
    },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    }
  );
}

function clampSettingsForRuntime(
  settings: GenerationSettings
): GenerationSettings {
  const onVercel = Boolean(process.env.VERCEL);
  const maxCards = onVercel ? VERCEL_MAX_FLASHCARDS : MAX_FLASHCARDS;
  const maxQuiz = onVercel ? VERCEL_MAX_QUIZ : MAX_QUIZ_QUESTIONS;

  return {
    ...settings,
    flashcardCount: Math.min(settings.flashcardCount, maxCards),
    quizCount: Math.min(settings.quizCount, maxQuiz),
  };
}

async function resolveRequestPayload(req: NextRequest): Promise<{
  markdown: string;
  fileName?: string;
  title?: string;
  settings: GenerationSettings;
}> {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      throw new DocumentParseError("Please choose a file to upload.", 400);
    }

    const { fileName, markdown } = await parseUploadedDocument(file);
    const formSettings = parseSettingsFromFormData(form);
    const titleRaw = form.get("title");
    const title =
      typeof titleRaw === "string" && titleRaw.trim()
        ? titleRaw.trim()
        : undefined;

    return {
      markdown,
      fileName,
      title,
      settings: clampSettingsForRuntime({
        ...DEFAULT_GENERATION_SETTINGS,
        ...formSettings,
      }),
    };
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    throw new DocumentParseError(
      "Invalid request body. Please upload a file and try again.",
      400
    );
  }

  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    console.error("[generate-reviewer] invalid body", parsed.error.flatten());
    throw new DocumentParseError(
      "Failed to process document structure. Please try uploading again.",
      400
    );
  }

  return {
    markdown: parsed.data.markdown,
    fileName: parsed.data.fileName,
    title: parsed.data.title,
    settings: clampSettingsForRuntime({
      ...DEFAULT_GENERATION_SETTINGS,
      ...parsed.data.settings,
    }),
  };
}

/**
 * POST /api/generate-reviewer
 * Always returns JSON — never an HTML error page.
 * Guests get payload only; signed-in users auto-save when DB is available.
 */
export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY?.trim()) {
      console.error(
        "CRITICAL API ROUTE ERROR: Missing GEMINI_API_KEY environment variable"
      );
      return jsonError(
        "Missing GEMINI_API_KEY environment variable on Vercel.",
        500
      );
    }

    const { markdown, fileName, title, settings } =
      await resolveRequestPayload(req);

    if (markdown.length > MAX_MARKDOWN_CHARS) {
      return jsonError(
        "That document is too large to process. Try a shorter file or split it into parts.",
        413
      );
    }

    const payload = await generateReviewerFromMarkdown(
      markdown,
      fileName,
      settings
    );

    // Auth + DB save must never turn a successful generation into an HTML 500.
    let reviewerId: string | null = null;
    let saved: ReturnType<typeof mapReviewerRecord> | undefined;
    let saveWarning: string | undefined;

    try {
      const user = await getAuthUser();
      if (user) {
        await ensureAppUser(user);
        const record = await saveReviewerForUser({
          userId: user.id,
          title:
            title?.trim() ||
            fileName?.replace(/\.[^.]+$/, "") ||
            payload.studyNotes[0]?.title ||
            "Untitled reviewer",
          fileName,
          payload,
          settings,
        });
        reviewerId = record.id;
        saved = mapReviewerRecord(record);
      }
    } catch (saveErr) {
      console.error("CRITICAL API ROUTE ERROR (save/auth):", saveErr);
      saveWarning =
        "Study pack generated, but saving to history failed. You can still use it in this session.";
    }

    return NextResponse.json(
      {
        ...payload,
        reviewerId,
        ...(saved ? { saved } : {}),
        ...(saveWarning ? { warning: saveWarning } : {}),
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error: unknown) {
    console.error("CRITICAL API ROUTE ERROR:", error);

    if (error instanceof DocumentParseError) {
      return jsonError(error.message, error.status);
    }

    const message = extractGeminiError(error);
    const status = /GEMINI_API_KEY/i.test(message)
      ? 500
      : /UNAVAILABLE|high demand|overloaded/i.test(message)
        ? 503
        : /timeout|timed out|FUNCTION_INVOCATION/i.test(message)
          ? 504
          : 500;

    return jsonError(
      toUserFacingError(
        message,
        "An unexpected error occurred while generating the reviewer."
      ),
      status,
      process.env.NODE_ENV === "development" ? message : undefined
    );
  }
}
