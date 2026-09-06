import type { Prisma } from "@/generated/prisma";
import type {
  GenerationSettings,
  QuizType,
  ReviewerPayload,
  StudyNoteTopic,
} from "@/lib/types";
import { prisma } from "@/lib/prisma";

function deriveSummary(notes: StudyNoteTopic[]): string {
  return notes
    .slice(0, 3)
    .map((n) => n.title)
    .join(" · ");
}

function asQuizType(value: unknown): QuizType {
  const v = String(value ?? "");
  if (
    v === "true-false" ||
    v === "identification" ||
    v === "fill-blank" ||
    v === "multiple-choice"
  ) {
    return v;
  }
  return "multiple-choice";
}

export async function saveReviewerForUser(params: {
  userId: string;
  title: string;
  fileName?: string;
  payload: ReviewerPayload;
  settings: GenerationSettings;
}) {
  const { userId, title, fileName, payload, settings } = params;

  return prisma.reviewer.create({
    data: {
      userId,
      title,
      fileName: fileName ?? null,
      summary: deriveSummary(payload.studyNotes),
      studyNotes: payload.studyNotes as unknown as Prisma.InputJsonValue,
      focus: settings.focus,
      difficulty: settings.difficulty,
      flashcardCnt: settings.flashcardCount,
      quizCnt: settings.quizCount,
      flashcards: {
        create: payload.flashcards.map((card, index) => ({
          front: card.front,
          back: card.back,
          tag: card.tag || "General",
          status: card.status ?? "needs_review",
          sortOrder: index,
        })),
      },
      quizItems: {
        create: payload.quiz.map((item, index) => ({
          type: item.type,
          question: item.question,
          options: item.options as unknown as Prisma.InputJsonValue,
          correctAnswer: item.correctAnswer,
          explanation: item.explanation,
          sortOrder: index,
        })),
      },
    },
    include: {
      flashcards: { orderBy: { sortOrder: "asc" } },
      quizItems: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export function mapReviewerRecord(record: {
  id: string;
  title: string;
  fileName: string | null;
  summary: string | null;
  studyNotes: unknown;
  focus: string;
  difficulty: string;
  flashcardCnt: number;
  quizCnt: number;
  createdAt: Date;
  updatedAt: Date;
  flashcards: Array<{
    id: string;
    front: string;
    back: string;
    tag: string;
    status: string;
  }>;
  quizItems: Array<{
    id: string;
    type?: string;
    question: string;
    options: unknown;
    correctAnswer: string;
    explanation: string;
    userAnswer: string | null;
    isCorrect: boolean | null;
  }>;
}) {
  const notes = record.studyNotes as StudyNoteTopic[];
  return {
    id: record.id,
    title: record.title,
    fileName: record.fileName,
    summary: record.summary,
    studyNotes: notes,
    focus: record.focus,
    difficulty: record.difficulty,
    flashcardCnt: record.flashcardCnt,
    quizCnt: record.quizCnt,
    flashcards: record.flashcards.map((c) => ({
      id: c.id,
      front: c.front,
      back: c.back,
      tag: c.tag,
      status: (c.status === "mastered" ? "mastered" : "needs_review") as
        | "mastered"
        | "needs_review",
    })),
    quiz: record.quizItems.map((q) => {
      const type = asQuizType(q.type);
      const opts = Array.isArray(q.options) ? (q.options as string[]) : [];
      return {
        id: q.id,
        type,
        question: q.question,
        options: opts,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        userAnswer: q.userAnswer,
        isCorrect: q.isCorrect,
      };
    }),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
