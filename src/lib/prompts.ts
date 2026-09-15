import {
  PROMPT_MARKDOWN_CHARS,
  PROMPT_MARKDOWN_CHARS_COMPACT,
} from "./limits";
import type { DocumentImage, GenerationSettings } from "./types";
import { DEFAULT_GENERATION_SETTINGS } from "./types";

/** Exact system instruction sent with every generate-reviewer call. */
export const SYSTEM_INSTRUCTION = `You are helping a student turn class material into a clear study guide.

Convert the provided study material into a high-yield reviewer package.

Hard rules:
1. Use ONLY information in the source. Do not invent facts, citations, or numbers.
2. Write like a careful student explaining the material to a classmate: direct, specific, and calm. Avoid filler and self-referential language.
3. studyNotes: cover distinct topics. Give each topic a short summary, useful bullet points, highlighted keyTerms, and a detailed explanation with multiple paragraphs. Do not begin with phrases like "this section discusses" or "in this study guide".
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
10. Generate a plain, useful generatedTitle (3–8 words) describing the material, never just a filename.
11. When supplied image metadata is relevant, copy its exact URL into diagrams on the specific note topic it illustrates, with a useful caption. You may also use imageUrl on a flashcard or quiz item. Never invent image URLs or attach a diagram to an unrelated topic.
12. Output one valid JSON object matching the schema. No markdown fences, no commentary.`;

export interface BuildUserPromptOptions {
  compact?: boolean;
  settings?: GenerationSettings;
  documentImages?: DocumentImage[];
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

  const notes = studyNotesTarget(markdown.length, compact);
  const varietySeed = Math.floor(Math.random() * 1_000_000);
  const imageContext = (options.documentImages ?? []).slice(0, 20);

  const sizing = `DOCUMENT COVERAGE:
- Cover every chapter, section, page range, formula, definition, example, and troubleshooting procedure in the source.
- Spread notes, flashcards, and quiz questions across the entire source instead of focusing on the opening sections.

STUDY NOTES:
- Create ${notes.min}–${notes.max} studyNotes topics. Include a substantial multi-paragraph details breakdown for every topic.

FLASHCARDS & QUIZ (seed=${varietySeed}):
- Produce EXACTLY ${cardTarget} flashcards and EXACTLY ${quizTarget} quiz questions when source allows.
- Mix quiz types: multiple-choice, true-false, identification, fill-blank.
- Multiple-choice MUST have EXACTLY 4 options. Identification/fill-blank: options [].
- Keep quiz explanations to one short sentence. Make note details deeper than summaries while staying focused on high-yield facts.
${imageContext.length > 0 ? `DOCUMENT DIAGRAMS (use exact URLs only when relevant):\n${imageContext.map((image) => `- ${image.url}${image.page ? ` [page ${image.page}]` : ""}${image.slide ? ` [slide ${image.slide}]` : ""}${image.contextText ? ` — ${image.contextText}` : ""}`).join("\n")}` : "No document diagrams were extracted."}
${focusInstruction(settings.focus)}
${difficultyInstruction(settings.difficulty)}`;

  return `${sourceLabel}${sizing}

Convert the following complete study material into generatedTitle, studyNotes, flashcards, and quiz.

===== BEGIN SOURCE MARKDOWN =====
${clipped}
===== END SOURCE MARKDOWN =====`;
}
