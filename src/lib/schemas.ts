import { Type } from "@google/genai";
import { z } from "zod";
import type { QuizQuestion, QuizType, ReviewerPayload } from "./types";

const PAD_OPTIONS = [
  "None of the above",
  "All of the above",
  "Not enough information",
  "Cannot be determined",
];

const QUIZ_TYPES: QuizType[] = [
  "multiple-choice",
  "true-false",
  "identification",
  "fill-blank",
];

function asQuizType(value: unknown): QuizType {
  const v = String(value ?? "").trim();
  return (QUIZ_TYPES as string[]).includes(v)
    ? (v as QuizType)
    : "multiple-choice";
}

/** Normalize quiz options based on question type. */
export function normalizeQuizOptions(
  type: QuizType,
  options: unknown,
  correctAnswer: string
): string[] {
  const answer = correctAnswer.trim() || "True";

  if (type === "true-false") {
    const normalized = /^(true|t|yes)$/i.test(answer) ? "True" : "False";
    return ["True", "False"].includes(normalized)
      ? ["True", "False"]
      : ["True", "False"];
  }

  if (type === "identification" || type === "fill-blank") {
    return [];
  }

  const raw = Array.isArray(options)
    ? options.map((o) => String(o ?? "").trim()).filter((o) => o.length > 0)
    : [];

  const unique: string[] = [];
  for (const opt of raw) {
    if (!unique.includes(opt)) unique.push(opt);
  }

  if (!unique.includes(answer) && answer) {
    unique.unshift(answer);
  }

  let i = 0;
  while (unique.length < 4) {
    const pad = PAD_OPTIONS[i % PAD_OPTIONS.length];
    i += 1;
    if (!unique.includes(pad)) unique.push(pad);
  }

  if (unique.length > 4) {
    const result = [answer];
    for (const opt of unique) {
      if (result.length >= 4) break;
      if (!result.includes(opt)) result.push(opt);
    }
    while (result.length < 4) {
      const pad = PAD_OPTIONS[result.length % PAD_OPTIONS.length];
      if (!result.includes(pad)) result.push(pad);
    }
    return result;
  }

  return unique.slice(0, 4);
}

function normalizeCorrectAnswer(type: QuizType, answer: string): string {
  if (type === "true-false") {
    return /^(true|t|yes)$/i.test(answer.trim()) ? "True" : "False";
  }
  return answer.trim();
}

/**
 * Soften Gemini quirks before Zod validation.
 */
export function sanitizeReviewerPayload(input: unknown): unknown {
  if (!input || typeof input !== "object") return input;
  const data = input as Record<string, unknown>;

  const studyNotes = Array.isArray(data.studyNotes)
    ? data.studyNotes.slice(0, 150).map((note) => {
        if (!note || typeof note !== "object") return note;
        const n = note as Record<string, unknown>;
        return {
          ...n,
          title: String(n.title ?? "").trim(),
          summary: String(n.summary ?? "").trim(),
          bulletPoints: Array.isArray(n.bulletPoints)
            ? n.bulletPoints.map((point) => String(point ?? "").trim())
            : [],
          ...(typeof n.details === "string" && n.details.trim()
            ? { details: n.details.trim() }
            : {}),
          ...(typeof n.imageUrl === "string" && n.imageUrl.trim()
            ? { imageUrl: n.imageUrl.trim() }
            : {}),
          keyTerms: Array.isArray(n.keyTerms)
            ? n.keyTerms.map((term) => String(term ?? "").trim()).filter(Boolean).slice(0, 20)
            : [],
          diagrams: Array.isArray(n.diagrams)
            ? n.diagrams
                .filter((diagram) => diagram && typeof diagram === "object")
                .map((diagram) => {
                  const d = diagram as Record<string, unknown>;
                  return {
                    url: String(d.url ?? "").trim(),
                    ...(typeof d.caption === "string" && d.caption.trim()
                      ? { caption: d.caption.trim() }
                      : {}),
                    ...(typeof d.contextText === "string" && d.contextText.trim()
                      ? { contextText: d.contextText.trim() }
                      : {}),
                  };
                })
                .filter((diagram) => diagram.url)
                .slice(0, 12)
            : [],
        };
      })
    : data.studyNotes;

  const flashcards = Array.isArray(data.flashcards)
    ? data.flashcards.slice(0, 100).map((card, index) => {
        if (!card || typeof card !== "object") return card;
        const c = card as Record<string, unknown>;
        return {
          ...c,
          id: String(c.id ?? `fc-${String(index + 1).padStart(3, "0")}`),
          front: String(c.front ?? ""),
          back: String(c.back ?? ""),
          tag: String(c.tag ?? "General"),
          ...(typeof c.imageUrl === "string" && c.imageUrl.trim()
            ? { imageUrl: c.imageUrl.trim() }
            : {}),
        };
      })
    : data.flashcards;

  const quiz = Array.isArray(data.quiz)
    ? data.quiz.slice(0, 100).map((item) => {
        if (!item || typeof item !== "object") return item;
        const q = item as Record<string, unknown>;
        const type = asQuizType(q.type);
        const correctAnswer = normalizeCorrectAnswer(
          type,
          String(q.answer ?? q.correctAnswer ?? "")
        );
        const options = normalizeQuizOptions(type, q.options, correctAnswer);
        const fixedAnswer =
          type === "multiple-choice" && !options.includes(correctAnswer)
            ? options[0]
            : correctAnswer;

        return {
          ...q,
          type,
          question: String(q.question ?? "").trim(),
          options,
          correctAnswer: fixedAnswer,
          explanation: String(q.explanation ?? "").trim(),
          answer: correctAnswer,
          ...(typeof q.imageUrl === "string" && q.imageUrl.trim()
            ? { imageUrl: q.imageUrl.trim() }
            : {}),
        } satisfies Partial<QuizQuestion>;
      })
    : data.quiz;

  return {
    ...data,
    generatedTitle:
      typeof data.generatedTitle === "string"
        ? data.generatedTitle.trim().slice(0, 120)
        : undefined,
    studyNotes,
    flashcards,
    quiz,
  };
}

/** Runtime validation after Gemini returns JSON (post-sanitize). */
export const reviewerPayloadSchema: z.ZodType<ReviewerPayload> = z.object({
  generatedTitle: z.string().min(1).max(120).optional(),
  studyNotes: z
    .array(
      z.object({
        title: z.string().min(1),
        summary: z.string().min(1),
        bulletPoints: z.array(z.string().min(1)).min(1).max(16),
        details: z.string().min(1).optional(),
        imageUrl: z.string().url().optional(),
        keyTerms: z.array(z.string().min(1)).max(20).optional(),
        diagrams: z
          .array(
            z.object({
              url: z.string().url(),
              caption: z.string().optional(),
              contextText: z.string().optional(),
            })
          )
          .max(12)
          .optional(),
      })
    )
    .min(1)
    .max(150),
  flashcards: z
    .array(
      z.object({
        id: z.string().min(1),
        front: z.string().min(1),
        back: z.string().min(1),
        tag: z.string().min(1),
        imageUrl: z.string().url().optional(),
      })
    )
    .min(1)
    .max(100),
  quiz: z
    .array(
      z.object({
        type: z.enum([
          "multiple-choice",
          "true-false",
          "identification",
          "fill-blank",
        ]),
        question: z.string().min(1),
        options: z.array(z.string()),
        correctAnswer: z.string().min(1),
        answer: z.string().min(1).optional(),
        explanation: z.string().min(1),
        imageUrl: z.string().url().optional(),
      })
    )
    .min(1)
    .max(100),
});

export const REVIEWER_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  required: ["studyNotes", "flashcards", "quiz"],
  properties: {
    generatedTitle: {
      type: Type.STRING,
      description: "A concise 3-8 word title describing the complete source.",
    },
    studyNotes: {
      type: Type.ARRAY,
      description:
        "Exhaustive topic-organized study notes covering every study-able section/concept from the source.",
      items: {
        type: Type.OBJECT,
        required: ["title", "summary", "bulletPoints"],
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          details: {
            type: Type.STRING,
            description:
              "Optional deeper explanation with context, examples, and why the topic matters.",
          },
          imageUrl: { type: Type.STRING },
          keyTerms: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Short terms and definitions to highlight in the detail view.",
          },
          diagrams: {
            type: Type.ARRAY,
            description: "Relevant extracted diagrams for this topic. Use exact supplied URLs.",
            items: {
              type: Type.OBJECT,
              required: ["url"],
              properties: {
                url: { type: Type.STRING },
                caption: { type: Type.STRING },
              },
            },
          },
          bulletPoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
      },
    },
    flashcards: {
      type: Type.ARRAY,
      description: "Active-recall flashcards.",
      items: {
        type: Type.OBJECT,
        required: ["id", "front", "back", "tag"],
        properties: {
          id: { type: Type.STRING },
          front: { type: Type.STRING },
          back: { type: Type.STRING },
          tag: { type: Type.STRING },
          imageUrl: { type: Type.STRING },
        },
      },
    },
    quiz: {
      type: Type.ARRAY,
      description:
        "Mixed quiz: multiple-choice, true-false, identification, fill-blank.",
      items: {
        type: Type.OBJECT,
        required: [
          "type",
          "question",
          "options",
          "answer",
          "explanation",
        ],
        properties: {
          type: {
            type: Type.STRING,
            description:
              "One of: multiple-choice, true-false, identification, fill-blank",
          },
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description:
              "multiple-choice: EXACTLY 4 options. true-false: [True, False]. identification/fill-blank: empty array [].",
          },
          answer: { type: Type.STRING },
          explanation: { type: Type.STRING },
          imageUrl: { type: Type.STRING },
        },
      },
    },
  },
};
