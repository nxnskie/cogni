/**
 * Maps internal / provider errors to short copy safe for end users.
 * Technical detail should be logged separately with console.error.
 */
export function toUserFacingError(
  message: string | null | undefined,
  fallback = "Something went wrong. Please try again."
): string {
  if (!message?.trim()) return fallback;
  const m = message.trim();

  if (/Missing GEMINI_API_KEY/i.test(m)) {
    return "Missing GEMINI_API_KEY environment variable on Vercel.";
  }
  if (/GEMINI_API_KEY|API.?key|auth.?secret/i.test(m)) {
    return "Study generation is temporarily unavailable. Please try again later.";
  }
  if (
    /Gemini JSON failed validation|failed validation|non-JSON|No JSON object|Invalid reviewer payload|Invalid request body/i.test(
      m
    )
  ) {
    return "Failed to process document structure. Please try uploading again.";
  }
  if (/token limit|truncated JSON|empty response/i.test(m)) {
    return "We couldn't finish generating your study set. Try fewer cards or a smaller file, then upload again.";
  }
  if (/UNAVAILABLE|high demand|overloaded/i.test(m)) {
    return "Our study engine is busy right now. Please try again in a moment.";
  }
  if (/timeout|timed out|FUNCTION_INVOCATION/i.test(m)) {
    return "Generation took too long. Try fewer flashcards or quiz questions, then upload again.";
  }
  if (
    /Python parser|PARSER_URL|Could not reach|npm run dev:worker|ECONNREFUSED|localhost|127\.0\.0\.1/i.test(
      m
    )
  ) {
    return "Document processing is temporarily unavailable. Please try again shortly.";
  }
  if (/Parser returned too little|too little usable text|Markdown payload is too short/i.test(m)) {
    return "We couldn't extract enough text from that file. Try a clearer document or another format.";
  }
  if (/Markdown exceeds|character limit/i.test(m)) {
    return "That document is too large to process. Try a shorter file or split it into parts.";
  }
  if (/Missing file|multipart form/i.test(m)) {
    return "Please choose a file to upload.";
  }
  if (/Unsupported file type/i.test(m)) {
    return "Unsupported file type. Please use PDF, DOCX, TXT, or MD.";
  }
  if (/PPTX file parsing requires/i.test(m)) {
    return m;
  }
  if (/File too large/i.test(m)) {
    return "File is too large (max 25MB).";
  }
  if (/Upload\/parse failed|Generation failed|Parser failed/i.test(m)) {
    return "Something went wrong while processing your file. Please try again.";
  }

  if (
    m.length > 200 ||
    /\bprisma\b|\bzod\b|\.env\b|at\s+\S+\s+\(/i.test(m)
  ) {
    return fallback;
  }

  return m;
}
