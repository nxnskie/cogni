import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { mapReviewerRecord } from "@/lib/reviewers";
import { ensureAppUser, getAuthUser } from "@/lib/supabase-auth";
import { generateReviewerFromMarkdown } from "@/lib/gemini";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(error: string, status: number, details?: unknown) {
  return NextResponse.json(
    { error, ...(details !== undefined ? { details } : {}) },
    { status, headers: { "Cache-Control": "no-store" } }
  );
}

async function requireUser() {
  const user = await getAuthUser();
  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  await ensureAppUser(user);
  return { userId: user.id };
}

type RouteContext = { params: Promise<{ id: string }> };

/** GET /api/reviewer/[id] */
export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const authResult = await requireUser();
    if ("error" in authResult) return authResult.error;
    const { id } = await context.params;

    const record = await prisma.reviewer.findFirst({
      where: { id, userId: authResult.userId },
      include: {
        flashcards: { orderBy: { sortOrder: "asc" } },
        quizItems: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!record) return jsonError("Reviewer not found", 404);

    return NextResponse.json(mapReviewerRecord(record), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[reviewer] GET failed:", error);
    return jsonError("Unable to load this reviewer right now.", 503);
  }
}

const quizExpansionSchema = z.object({
  targetCount: z.number().int().min(5).max(100),
});

/** POST /api/reviewer/[id] — append quiz questions up to targetCount. */
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const authResult = await requireUser();
    if ("error" in authResult) return authResult.error;
    const { id } = await context.params;
    const body = quizExpansionSchema.safeParse(await req.json());
    if (!body.success) return jsonError("Invalid quiz count", 400);

    const record = await prisma.reviewer.findFirst({
      where: { id, userId: authResult.userId },
      include: {
        quizItems: { orderBy: { sortOrder: "asc" } },
      },
    });
    if (!record) return jsonError("Reviewer not found", 404);
    if (body.data.targetCount <= record.quizItems.length) {
      return jsonError("The reviewer already has that many quiz questions.", 400);
    }

    const source = JSON.stringify(record.studyNotes);
    const generated = await generateReviewerFromMarkdown(
      `Existing study notes from the complete source:\n${source}`,
      record.title,
      {
        flashcardCount: 5,
        quizCount: body.data.targetCount - record.quizItems.length,
        difficulty: record.difficulty as "easy" | "medium" | "hard",
        focus: record.focus as "conceptual" | "formulas" | "definitions" | "balanced",
      }
    );
    const additions = generated.quiz.slice(
      0,
      body.data.targetCount - record.quizItems.length
    );

    await prisma.$transaction(
      additions.map((item, index) =>
        prisma.quizItem.create({
          data: {
            reviewerId: id,
            type: item.type,
            question: item.question,
            options: item.options,
            correctAnswer: item.correctAnswer,
            explanation: item.explanation,
            imageUrl: item.imageUrl ?? null,
            sortOrder: record.quizItems.length + index,
          },
        })
      )
    );

    const updated = await prisma.reviewer.findFirst({
      where: { id, userId: authResult.userId },
      include: {
        flashcards: { orderBy: { sortOrder: "asc" } },
        quizItems: { orderBy: { sortOrder: "asc" } },
      },
    });
    return NextResponse.json(mapReviewerRecord(updated!), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[reviewer] quiz expansion failed:", error);
    return jsonError("Unable to generate additional quiz questions right now.", 503);
  }
}

const patchSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  studyNotes: z
    .array(
      z.object({
        title: z.string(),
        summary: z.string(),
        bulletPoints: z.array(z.string()),
        details: z.string().optional(),
        imageUrl: z.string().url().optional(),
      })
    )
    .optional(),
  flashcards: z
    .array(
      z.object({
        id: z.string(),
        front: z.string().optional(),
        back: z.string().optional(),
        tag: z.string().optional(),
        imageUrl: z.string().url().nullable().optional(),
        status: z.enum(["needs_review", "mastered"]).optional(),
      })
    )
    .optional(),
  quiz: z
    .array(
      z.object({
        id: z.string(),
        question: z.string().optional(),
        options: z.array(z.string()).length(4).optional(),
        correctAnswer: z.string().optional(),
        explanation: z.string().optional(),
        imageUrl: z.string().url().nullable().optional(),
        userAnswer: z.string().nullable().optional(),
        isCorrect: z.boolean().nullable().optional(),
      })
    )
    .optional(),
});

/** PATCH /api/reviewer/[id] — update notes, flashcards, quiz responses */
export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const authResult = await requireUser();
    if ("error" in authResult) return authResult.error;
    const { id } = await context.params;

    const existing = await prisma.reviewer.findFirst({
      where: { id, userId: authResult.userId },
    });
    if (!existing) return jsonError("Reviewer not found", 404);

    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return jsonError("Invalid patch body", 400);
    }

    const body = patchSchema.safeParse(rawBody);
    if (!body.success) {
      return jsonError("Invalid patch body", 400, body.error.flatten());
    }

  const data = body.data;

    await prisma.$transaction(async (tx) => {
    if (data.title || data.studyNotes) {
      await tx.reviewer.update({
        where: { id },
        data: {
          ...(data.title ? { title: data.title } : {}),
          ...(data.studyNotes
            ? {
                studyNotes:
                  data.studyNotes as unknown as import("@/generated/prisma").Prisma.InputJsonValue,
              }
            : {}),
        },
      });
    }

    if (data.flashcards?.length) {
      for (const card of data.flashcards) {
        await tx.flashcard.updateMany({
          where: { id: card.id, reviewerId: id },
          data: {
            ...(card.front !== undefined ? { front: card.front } : {}),
            ...(card.back !== undefined ? { back: card.back } : {}),
            ...(card.tag !== undefined ? { tag: card.tag } : {}),
            ...(card.status !== undefined ? { status: card.status } : {}),
            ...(card.imageUrl !== undefined ? { imageUrl: card.imageUrl } : {}),
          },
        });
      }
    }

    if (data.quiz?.length) {
      for (const item of data.quiz) {
        await tx.quizItem.updateMany({
          where: { id: item.id, reviewerId: id },
          data: {
            ...(item.question !== undefined ? { question: item.question } : {}),
            ...(item.options !== undefined ? { options: item.options } : {}),
            ...(item.correctAnswer !== undefined
              ? { correctAnswer: item.correctAnswer }
              : {}),
            ...(item.explanation !== undefined
              ? { explanation: item.explanation }
              : {}),
            ...(item.userAnswer !== undefined
              ? { userAnswer: item.userAnswer }
              : {}),
            ...(item.isCorrect !== undefined
              ? { isCorrect: item.isCorrect }
              : {}),
            ...(item.imageUrl !== undefined ? { imageUrl: item.imageUrl } : {}),
          },
        });
      }
    }
    });

    const updated = await prisma.reviewer.findFirst({
      where: { id, userId: authResult.userId },
      include: {
        flashcards: { orderBy: { sortOrder: "asc" } },
        quizItems: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!updated) return jsonError("Reviewer not found", 404);

    return NextResponse.json(mapReviewerRecord(updated), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[reviewer] PATCH failed:", error);
    return jsonError("Unable to save reviewer changes right now.", 503);
  }
}

/** DELETE /api/reviewer/[id] */
export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const authResult = await requireUser();
    if ("error" in authResult) return authResult.error;
    const { id } = await context.params;

    const result = await prisma.reviewer.deleteMany({
      where: { id, userId: authResult.userId },
    });

    if (result.count === 0) return jsonError("Reviewer not found", 404);

    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[reviewer] DELETE failed:", error);
    return jsonError("Unable to delete this reviewer right now.", 503);
  }
}
