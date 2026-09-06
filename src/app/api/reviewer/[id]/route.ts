import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { mapReviewerRecord } from "@/lib/reviewers";
import { ensureAppUser, getAuthUser } from "@/lib/supabase-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  if (!record) {
    return NextResponse.json({ error: "Reviewer not found" }, { status: 404 });
  }

  return NextResponse.json(mapReviewerRecord(record));
}

const patchSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  studyNotes: z
    .array(
      z.object({
        title: z.string(),
        summary: z.string(),
        bulletPoints: z.array(z.string()),
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
        userAnswer: z.string().nullable().optional(),
        isCorrect: z.boolean().nullable().optional(),
      })
    )
    .optional(),
});

/** PATCH /api/reviewer/[id] — update notes, flashcards, quiz responses */
export async function PATCH(req: NextRequest, context: RouteContext) {
  const authResult = await requireUser();
  if ("error" in authResult) return authResult.error;
  const { id } = await context.params;

  const existing = await prisma.reviewer.findFirst({
    where: { id, userId: authResult.userId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Reviewer not found" }, { status: 404 });
  }

  const body = patchSchema.safeParse(await req.json());
  if (!body.success) {
    return NextResponse.json(
      { error: "Invalid patch body", details: body.error.flatten() },
      { status: 400 }
    );
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

  return NextResponse.json(mapReviewerRecord(updated!));
}

/** DELETE /api/reviewer/[id] */
export async function DELETE(_req: NextRequest, context: RouteContext) {
  const authResult = await requireUser();
  if ("error" in authResult) return authResult.error;
  const { id } = await context.params;

  const result = await prisma.reviewer.deleteMany({
    where: { id, userId: authResult.userId },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Reviewer not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
