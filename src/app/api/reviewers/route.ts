import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureAppUser, getAuthUser } from "@/lib/supabase-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(error: string, status: number) {
  return NextResponse.json(
    { error },
    { status, headers: { "Cache-Control": "no-store" } }
  );
}

/** GET /api/reviewers — list saved reviewers for the signed-in user */
export async function GET() {
  try {
    const user = await getAuthUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    await ensureAppUser(user);

    const rows = await prisma.reviewer.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        fileName: true,
        summary: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      rows.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      })),
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[reviewers] GET failed:", error);
    return jsonError(
      "Unable to load reviewer history right now. Please try again later.",
      503
    );
  }
}

/** DELETE /api/reviewers — clear all history for the signed-in user */
export async function DELETE() {
  try {
    const user = await getAuthUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    await ensureAppUser(user);
    await prisma.reviewer.deleteMany({ where: { userId: user.id } });
    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[reviewers] DELETE failed:", error);
    return jsonError(
      "Unable to clear reviewer history right now. Please try again later.",
      503
    );
  }
}
