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
    ? data.studyNotes.slice(0, 150)
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
          String(q.correctAnswer ?? "")
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
        } satisfies Partial<QuizQuestion>;
      })
    : data.quiz;

  return {
    ...data,
    studyNotes,
    flashcards,
    quiz,
  };
}

/** Runtime validation after Gemini returns JSON (post-sanitize). */
export const reviewerPayloadSchema: z.ZodType<ReviewerPayload> = z.object({
  studyNotes: z
    .array(
      z.object({
        title: z.string().min(1),
        summary: z.string().min(1),
        bulletPoints: z.array(z.string().min(1)).min(1).max(16),
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
        explanation: z.string().min(1),
      })
    )
    .min(1)
    .max(100),
});

export const REVIEWER_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  required: ["studyNotes", "flashcards", "quiz"],
  properties: {
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
          "correctAnswer",
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
          correctAnswer: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },
      },
    },
  },
};
