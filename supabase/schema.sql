-- Cogni persistence schema for Supabase Postgres.
-- Run this once in Supabase Dashboard -> SQL Editor.
-- Keep DATABASE_URL and DIRECT_URL configured for the server-side Prisma client.

create table if not exists "User" (
  "id" text primary key,
  "name" text,
  "email" text unique,
  "image" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists "Reviewer" (
  "id" text primary key,
  "userId" text not null references "User"("id") on delete cascade,
  "title" text not null,
  "fileName" text,
  "summary" text,
  "studyNotes" jsonb not null,
  "focus" text not null default 'balanced',
  "difficulty" text not null default 'medium',
  "flashcardCnt" integer not null default 10,
  "quizCnt" integer not null default 8,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists "Flashcard" (
  "id" text primary key,
  "reviewerId" text not null references "Reviewer"("id") on delete cascade,
  "front" text not null,
  "back" text not null,
  "tag" text not null default 'General',
  "imageUrl" text,
  "status" text not null default 'needs_review',
  "sortOrder" integer not null default 0,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists "QuizItem" (
  "id" text primary key,
  "reviewerId" text not null references "Reviewer"("id") on delete cascade,
  "type" text not null default 'multiple-choice',
  "question" text not null,
  "options" jsonb not null,
  "correctAnswer" text not null,
  "explanation" text not null,
  "imageUrl" text,
  "userAnswer" text,
  "isCorrect" boolean,
  "sortOrder" integer not null default 0,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

alter table "Flashcard" add column if not exists "imageUrl" text;
alter table "QuizItem" add column if not exists "imageUrl" text;

create index if not exists "Reviewer_userId_updatedAt_idx"
  on "Reviewer" ("userId", "updatedAt");
create index if not exists "Flashcard_reviewerId_sortOrder_idx"
  on "Flashcard" ("reviewerId", "sortOrder");
create index if not exists "QuizItem_reviewerId_sortOrder_idx"
  on "QuizItem" ("reviewerId", "sortOrder");

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$;

drop trigger if exists "User_set_updated_at" on "User";
create trigger "User_set_updated_at"
  before update on "User"
  for each row execute function public.set_updated_at();

drop trigger if exists "Reviewer_set_updated_at" on "Reviewer";
create trigger "Reviewer_set_updated_at"
  before update on "Reviewer"
  for each row execute function public.set_updated_at();

drop trigger if exists "Flashcard_set_updated_at" on "Flashcard";
create trigger "Flashcard_set_updated_at"
  before update on "Flashcard"
  for each row execute function public.set_updated_at();

drop trigger if exists "QuizItem_set_updated_at" on "QuizItem";
create trigger "QuizItem_set_updated_at"
  before update on "QuizItem"
  for each row execute function public.set_updated_at();

-- Prisma connects with the database role, so RLS is intentionally not enabled here.
-- Application ownership is enforced in every query by userId and the Supabase Auth UUID.
