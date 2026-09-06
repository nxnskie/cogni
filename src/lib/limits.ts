/**
 * Shared markdown size limits for upload → Gemini generation.
 * Prompt clipping stays tight so structured JSON finishes inside serverless limits.
 */
export const MAX_MARKDOWN_CHARS = 1_500_000;
export const PROMPT_MARKDOWN_CHARS = 120_000;
export const PROMPT_MARKDOWN_CHARS_COMPACT = 60_000;
