import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureAppUser, getAuthUser } from "@/lib/supabase-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/reviewers — list saved reviewers for the signed-in user */
export async function GET() {
  const user = await getAuthUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    }))
  );
}

/** DELETE /api/reviewers — clear all history for the signed-in user */
export async function DELETE() {
  const user = await getAuthUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.reviewer.deleteMany({ where: { userId: user.id } });
  return NextResponse.json({ ok: true });
}
