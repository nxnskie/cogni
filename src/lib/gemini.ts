import { GoogleGenAI } from "@google/genai";
import { REVIEWER_RESPONSE_SCHEMA, reviewerPayloadSchema, sanitizeReviewerPayload } from "./schemas";
import { SYSTEM_INSTRUCTION, buildUserPrompt } from "./prompts";
import type { GenerationSettings, ReviewerPayload } from "./types";
import { DEFAULT_GENERATION_SETTINGS } from "./types";

/** Fast Flash model tuned for Vercel serverless latency. */
const DEFAULT_MODEL = "gemini-2.5-flash";
const FALLBACK_MODELS = [
  "gemini-3.6-flash",
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
];

/** Cap output size so structured JSON finishes within function time limits. */
const MAX_OUTPUT_TOKENS = 24_576;
const MAX_OUTPUT_TOKENS_COMPACT = 12_288;

function getPreferredModel(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
}

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  return new GoogleGenAI({ apiKey });
}

/** Pull a readable message out of @google/genai / fetch error shapes. */
export function extractGeminiError(err: unknown): string {
  if (!(err instanceof Error)) return "Unknown Gemini error";

  const raw = err.message?.trim() || "";
  if (raw.startsWith("{")) {
    try {
      const parsed = JSON.parse(raw) as {
        error?: { message?: string; status?: string; code?: number };
      };
      const api = parsed.error;
      if (api?.message) {
        const status = api.status ? ` (${api.status})` : "";
        return `${api.message}${status}`;
      }
    } catch {
      // fall through
    }
  }

  return raw || "Gemini request failed";
}

function sanitizeMarkdown(markdown: string): string {
  return markdown
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .trim();
}

function modelCandidates(): string[] {
  const preferred = getPreferredModel();
  return [preferred, DEFAULT_MODEL, ...FALLBACK_MODELS].filter(
    (model, index, all) => Boolean(model) && all.indexOf(model) === index
  );
}

/**
 * Pull a JSON object from model text even when wrapped in fences or trailing junk.
 */
export function extractJsonObject(raw: string): unknown {
  const trimmed = raw.trim();

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? trimmed).trim();

  try {
    return JSON.parse(candidate);
  } catch {
    // continue
  }

  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return JSON.parse(candidate.slice(start, end + 1));
  }

  throw new Error("No JSON object found in model response");
}

function collectResponseText(response: {
  text?: string;
  candidates?: Array<{
    finishReason?: string;
    content?: { parts?: Array<{ text?: string; thought?: boolean }> };
  }>;
}): { text: string; finishReason?: string } {
  const finishReason = response.candidates?.[0]?.finishReason;
  const parts = response.candidates?.[0]?.content?.parts ?? [];

  const fromParts = parts
    .filter((p) => !p.thought && typeof p.text === "string")
    .map((p) => p.text!)
    .join("")
    .trim();

  const text = fromParts || response.text?.trim() || "";
  return { text, finishReason };
}

function validatePayload(parsed: unknown): ReviewerPayload {
  const sanitized = sanitizeReviewerPayload(parsed);
  const validated = reviewerPayloadSchema.safeParse(sanitized);
  if (!validated.success) {
    console.error(
      "[gemini] JSON validation failed:",
      validated.error.issues
        .slice(0, 8)
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")
    );
    throw new Error(
      "Failed to process document structure. Please try uploading again."
    );
  }

  for (const q of validated.data.quiz) {
    if (
      (q.type === "multiple-choice" || q.type === "true-false") &&
      q.options.length > 0 &&
      !q.options.includes(q.correctAnswer)
    ) {
      q.correctAnswer = q.options[0];
    }
  }

  return {
    ...validated.data,
    flashcards: shuffleArray(validated.data.flashcards),
    quiz: shuffleArray(validated.data.quiz),
  };
}

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Calls Gemini with Structured Outputs (`responseSchema`) and validates with Zod.
 * Retries alternate Flash models on transient UNAVAILABLE / NOT_FOUND.
 * On truncated/non-JSON output, retries once in compact mode.
 */
export async function generateReviewerFromMarkdown(
  markdown: string,
  fileName?: string,
  settings: GenerationSettings = DEFAULT_GENERATION_SETTINGS
): Promise<ReviewerPayload> {
  const ai = getClient();
  const cleaned = sanitizeMarkdown(markdown);
  const models = modelCandidates();

  const attempts: Array<{ compact: boolean; label: string }> = [
    { compact: false, label: "full" },
    { compact: true, label: "compact" },
  ];

  let lastError: unknown;

  for (const model of models) {
    for (const attempt of attempts) {
      try {
        const contents = buildUserPrompt(cleaned, fileName, {
          compact: attempt.compact,
          settings,
        });

        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.55,
            maxOutputTokens: attempt.compact
              ? MAX_OUTPUT_TOKENS_COMPACT
              : MAX_OUTPUT_TOKENS,
            responseMimeType: "application/json",
            responseSchema: REVIEWER_RESPONSE_SCHEMA,
          },
        });

        const { text: raw, finishReason } = collectResponseText(response);

        if (!raw) {
          throw new Error(
            finishReason
              ? `Gemini returned an empty response (${finishReason})`
              : "Gemini returned an empty response"
          );
        }

        if (finishReason === "MAX_TOKENS") {
          throw new Error(
            "Gemini hit the output token limit (truncated JSON). Retrying with a smaller reviewer…"
          );
        }

        let parsed: unknown;
        try {
          parsed = extractJsonObject(raw);
        } catch {
          console.error(
            `[gemini] non-JSON from ${model} (${attempt.label}), finish=${finishReason}, preview=`,
            raw.slice(0, 240)
          );
          throw new Error(
            "Gemini returned non-JSON content despite schema enforcement"
          );
        }

        return validatePayload(parsed);
      } catch (err) {
        lastError = err;
        const message = extractGeminiError(err);
        const retryableModel =
          /UNAVAILABLE|NOT_FOUND|high demand|no longer available|is not found/i.test(
            message
          );
        const retryableCompact =
          /non-JSON|token limit|truncated JSON|empty response/i.test(message);

        if (retryableCompact && !attempt.compact) {
          console.warn(
            `[gemini] ${model} ${attempt.label} failed (${message}); retrying compact`
          );
          continue;
        }

        if (retryableModel) {
          console.warn(
            `[gemini] ${model} failed (${message}); trying next model`
          );
          break;
        }

        throw new Error(message);
      }
    }
  }

  throw new Error(extractGeminiError(lastError));
}
