import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

/** Current Supabase Auth user, or null for guests. Never throws. */
export async function getAuthUser(): Promise<User | null> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
    if (!url || !key) {
      console.warn("[auth] Supabase env vars missing — treating as guest");
      return null;
    }

    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("[auth] getUser failed:", error.message);
      return null;
    }

    return user;
  } catch (err) {
    console.error("[auth] getAuthUser threw:", err);
    return null;
  }
}

/** Ensure a Prisma User row exists for this Supabase Auth UUID. */
export async function ensureAppUser(user: User) {
  const email = user.email?.trim().toLowerCase() || null;
  const name =
    (typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null) ||
    (typeof user.user_metadata?.name === "string"
      ? user.user_metadata.name
      : null) ||
    email?.split("@")[0] ||
    "User";
  const image =
    (typeof user.user_metadata?.avatar_url === "string"
      ? user.user_metadata.avatar_url
      : null) ||
    (typeof user.user_metadata?.picture === "string"
      ? user.user_metadata.picture
      : null);

  return prisma.user.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      email,
      name,
      image,
    },
    update: {
      email: email ?? undefined,
      name,
      image,
    },
  });
}
