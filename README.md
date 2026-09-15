# Cogni

Full-stack study reviewer: upload PDF / DOCX / PPTX / TXT / MD → structured notes, flashcards, quizzes, and relevant document images.

## Features

- **Guest mode** — generate without an account (session-only UI state)
- **Supabase Auth (Google)** — save reviewers to Supabase Postgres (Prisma)
- **Generation controls** — flashcard count, quiz count, difficulty, focus
- **History sidebar** — open / delete saved reviewers
- **Settings** — light/dark theme, account, clear history

## Stack

- Next.js App Router + TypeScript + Tailwind
- Supabase Auth
- Prisma + Supabase PostgreSQL
- `@google/genai` (`gemini-2.5-flash`)
- In-process PDF / DOCX parsing
- Optional Python worker for embedded image extraction and Supabase Storage uploads

## Setup

```bash
npm install
cp .env.example .env.local
npx prisma generate
```

Run [`supabase/schema.sql`](supabase/schema.sql) once in Supabase Dashboard → **SQL Editor**. Then copy the database password from Supabase Dashboard → **Project Settings → Database → Connect** into the `DATABASE_URL` and `DIRECT_URL` values in both `.env.local` and `.env`.

For embedded PDF/DOCX/PPTX images, install the optional worker dependencies, create the `document-images` bucket in Supabase Storage, and configure `PARSER_SERVICE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_STORAGE_BUCKET`. The service-role key must stay server-side and must never be exposed to the browser. On Vercel, `PARSER_SERVICE_URL` must point to a separately deployed worker; Vercel does not run `Start-Parser.cmd`.

The generator uses the full uploaded text up to the configured request ceiling, spreads coverage across the complete source, creates a synthesized title when none is supplied, and supports adding more quiz questions from the active quiz view.

### Required env

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `DATABASE_URL` | Supabase Postgres pooled connection |
| `DIRECT_URL` | Supabase Postgres direct connection |
| `GEMINI_API_KEY` | Google AI Studio key |
| `GEMINI_MODEL` | Gemini model name (optional) |
| `PARSER_SERVICE_URL` | Optional worker URL, such as `http://localhost:8001` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key used by the worker to upload images |
| `SUPABASE_STORAGE_BUCKET` | Storage bucket for extracted images |

### Google OAuth (Supabase)

1. Enable Google in Supabase → Auth → Providers
2. Redirect URL: `http://localhost:3000/auth/callback`

Supabase Auth and Supabase Postgres use separate credentials. The anon key authenticates browser requests; Prisma still needs the database password in the two server-only connection strings.

## Run

```bash
npm run dev          # Next.js :3000
# Optional image extraction worker:
Start-Parser.cmd
```

## Project layout

```
prisma/schema.prisma
src/app/api/...
src/components/
```
