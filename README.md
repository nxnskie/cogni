# Cogni

Full-stack study reviewer: upload PDF / PPTX / DOCX → Markdown (Python MarkItDown) → Gemini structured notes, flashcards, and quizzes.

## Features

- **Guest mode** — generate without an account (session-only UI state)
- **Google OAuth (Auth.js v5)** — save reviewers to Neon Postgres (Prisma)
- **Generation controls** — flashcard count, quiz count, difficulty, focus
- **History sidebar** — open / delete saved reviewers
- **Settings** — light/dark theme, account, clear history

## Stack

- Next.js App Router + TypeScript + Tailwind
- NextAuth.js v5 + Prisma Adapter
- Neon PostgreSQL
- `@google/genai` (`gemini-3.6-flash`)
- FastAPI + MarkItDown worker

## Setup

```bash
npm install
cp .env.example .env.local
# Also keep a local `.env` (same DB URLs) for Prisma CLI, or copy .env.local → .env
npx prisma generate
npx prisma db push
```

### Required env

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Neon pooled connection |
| `DIRECT_URL` | Neon direct connection (migrations) |
| `GEMINI_API_KEY` | Google AI Studio key |
| `AUTH_SECRET` | Auth.js secret |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google OAuth (optional until you enable sign-in) |
| `AUTH_URL` / `NEXTAUTH_URL` | `http://localhost:3000` |
| `PARSER_URL` | `http://127.0.0.1:8001/parse` |

### Google OAuth

1. Create OAuth client in Google Cloud Console
2. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
3. Put client id/secret in `.env.local`

## Run

```bash
npm run dev:worker   # Python parser :8001
npm run dev          # Next.js :3000
```

## Project layout

```
prisma/schema.prisma
src/auth.ts
src/app/api/...
src/components/
python-worker/
```
