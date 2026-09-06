import {
  PROMPT_MARKDOWN_CHARS,
  PROMPT_MARKDOWN_CHARS_COMPACT,
} from "./limits";
import type { GenerationSettings } from "./types";
import { DEFAULT_GENERATION_SETTINGS } from "./types";

/** Exact system instruction sent with every generate-reviewer call. */
export const SYSTEM_INSTRUCTION = `You are an expert study-guide author and exam coach.

Convert the provided study material into a high-yield reviewer package.

Hard rules:
1. Use ONLY information in the source. Do not invent facts, citations, or numbers.
2. Be concise and specific. Ban filler ("important concept", "various factors", "it depends").
3. studyNotes: cover distinct topics; prefer focused topics. Keep summaries to 1–2 sentences and bullets short.
4. flashcards: one atomic fact per card; short question front; short precise answer back; tag by topic.
5. Quiz MUST mix types — not only multiple choice:
   - "multiple-choice": EXACTLY 4 distinct options; correctAnswer matches one option exactly.
   - "true-false": options ["True","False"]; correctAnswer "True" or "False".
   - "identification": options []; correctAnswer is a short term/phrase.
   - "fill-blank": question has ____; options []; correctAnswer is the missing word/phrase.
6. Aim for ~30% multiple-choice, ~20% true-false, ~25% identification, ~25% fill-blank when count allows.
7. Randomize which facts you test and phrasing so each generation feels unique.
8. Hit the requested flashcard and quiz counts when the source supports them.
9. Keep every string brief so the JSON completes without truncation.
10. Output one valid JSON object matching the schema. No markdown fences, no commentary.`;

export interface BuildUserPromptOptions {
  compact?: boolean;
  settings?: GenerationSettings;
}

function focusInstruction(focus: GenerationSettings["focus"]): string {
  switch (focus) {
    case "conceptual":
      return "Focus on concepts, relationships, and why things work.";
    case "formulas":
      return "Prioritize formulas, equations, calculations, and worked examples.";
    case "definitions":
      return "Prioritize precise definitions, terminology, and key vocabulary.";
    default:
      return "Balance concepts, definitions, and applied problem-solving.";
  }
}

function difficultyInstruction(
  difficulty: GenerationSettings["difficulty"]
): string {
  switch (difficulty) {
    case "easy":
      return "Quiz difficulty: Easy — straightforward recall and recognition.";
    case "hard":
      return "Quiz difficulty: Hard — multi-step reasoning, traps, and synthesis.";
    default:
      return "Quiz difficulty: Medium — mix of recall and applied understanding.";
  }
}

function studyNotesTarget(
  markdownLength: number,
  compact: boolean
): { min: number; max: number } {
  // Lean targets so serverless responses finish within Vercel time limits.
  if (compact) {
    if (markdownLength < 8_000) return { min: 4, max: 8 };
    if (markdownLength < 40_000) return { min: 6, max: 12 };
    return { min: 8, max: 16 };
  }

  if (markdownLength < 5_000) return { min: 5, max: 12 };
  if (markdownLength < 20_000) return { min: 8, max: 18 };
  if (markdownLength < 80_000) return { min: 10, max: 24 };
  return { min: 12, max: 28 };
}

/** Builds the user turn that wraps the extracted Markdown. */
export function buildUserPrompt(
  markdown: string,
  fileName?: string,
  options: BuildUserPromptOptions = {}
): string {
  const compact = Boolean(options.compact);
  const settings = { ...DEFAULT_GENERATION_SETTINGS, ...options.settings };
  const limit = compact ? PROMPT_MARKDOWN_CHARS_COMPACT : PROMPT_MARKDOWN_CHARS;
  const sourceLabel = fileName?.trim()
    ? `Source file: ${fileName.trim()}\n\n`
    : "";
  const clipped =
    markdown.length > limit
      ? `${markdown.slice(0, limit)}\n\n[TRUNCATED: source exceeded ${limit.toLocaleString()} characters]`
      : markdown;

  const cardTarget = compact
    ? Math.min(settings.flashcardCount, 15)
    : settings.flashcardCount;
  const quizTarget = compact
    ? Math.min(settings.quizCount, 12)
    : settings.quizCount;

  const notes = studyNotesTarget(clipped.length, compact);
  const varietySeed = Math.floor(Math.random() * 1_000_000);

  const sizing = `STUDY NOTES:
- Create ${notes.min}–${notes.max} concise studyNotes topics.

FLASHCARDS & QUIZ (seed=${varietySeed}):
- Produce EXACTLY ${cardTarget} flashcards and EXACTLY ${quizTarget} quiz questions when source allows.
- Mix quiz types: multiple-choice, true-false, identification, fill-blank.
- Multiple-choice MUST have EXACTLY 4 options. Identification/fill-blank: options [].
- Keep explanations to one short sentence. Prefer high-yield facts over fluff.
${focusInstruction(settings.focus)}
${difficultyInstruction(settings.difficulty)}`;

  return `${sourceLabel}${sizing}

Convert the following study material into studyNotes, flashcards, and quiz.

===== BEGIN SOURCE MARKDOWN =====
${clipped}
===== END SOURCE MARKDOWN =====`;
}
