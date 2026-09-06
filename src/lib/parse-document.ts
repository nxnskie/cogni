import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

const MIN_TEXT_CHARS = 40;
const MAX_BYTES = 25 * 1024 * 1024;

export const PPTX_UNSUPPORTED_MESSAGE =
  "PPTX file parsing requires converting to PDF first, or paste your text directly.";

export type SupportedParseExt = ".pdf" | ".docx" | ".txt" | ".md";

export class DocumentParseError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "DocumentParseError";
    this.status = status;
  }
}

function getExtension(name: string): string {
  const idx = name.lastIndexOf(".");
  return idx >= 0 ? name.slice(idx).toLowerCase() : "";
}

function cleanExtractedText(text: string): string {
  return text
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return result.text ?? "";
  } finally {
    await parser.destroy().catch(() => undefined);
  }
}

async function extractDocxText(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value ?? "";
}

function extractPlainText(buffer: Buffer): string {
  return buffer.toString("utf-8");
}

/**
 * Extract study text from an uploaded file using free Node parsers (no PARSER_URL).
 */
export async function parseUploadedDocument(file: File): Promise<{
  fileName: string;
  markdown: string;
}> {
  const fileName = file.name || "upload.bin";
  const ext = getExtension(fileName);

  if (ext === ".pptx") {
    throw new DocumentParseError(PPTX_UNSUPPORTED_MESSAGE, 400);
  }

  if (![".pdf", ".docx", ".txt", ".md"].includes(ext)) {
    throw new DocumentParseError(
      "Unsupported file type. Please use PDF, DOCX, TXT, or MD.",
      400
    );
  }

  if (file.size > MAX_BYTES) {
    throw new DocumentParseError("File is too large (max 25MB).", 413);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  let raw = "";

  switch (ext as SupportedParseExt) {
    case ".pdf":
      raw = await extractPdfText(buffer);
      break;
    case ".docx":
      raw = await extractDocxText(buffer);
      break;
    case ".txt":
    case ".md":
      raw = extractPlainText(buffer);
      break;
  }

  const markdown = cleanExtractedText(raw);
  if (markdown.length < MIN_TEXT_CHARS) {
    throw new DocumentParseError(
      "We couldn't extract enough text from that file. Try a clearer document or another format.",
      422
    );
  }

  return { fileName, markdown };
}

export function parseSettingsFromFormData(
  form: FormData
): Partial<{
  flashcardCount: number;
  quizCount: number;
  difficulty: "easy" | "medium" | "hard";
  focus: "conceptual" | "formulas" | "definitions" | "balanced";
}> {
  const flashcardCount = Number(form.get("flashcardCount"));
  const quizCount = Number(form.get("quizCount"));
  const difficulty = String(form.get("difficulty") || "");
  const focus = String(form.get("focus") || "");

  const settings: ReturnType<typeof parseSettingsFromFormData> = {};

  if (Number.isFinite(flashcardCount) && flashcardCount > 0) {
    settings.flashcardCount = flashcardCount;
  }
  if (Number.isFinite(quizCount) && quizCount > 0) {
    settings.quizCount = quizCount;
  }
  if (["easy", "medium", "hard"].includes(difficulty)) {
    settings.difficulty = difficulty as "easy" | "medium" | "hard";
  }
  if (
    ["conceptual", "formulas", "definitions", "balanced"].includes(focus)
  ) {
    settings.focus = focus as
      | "conceptual"
      | "formulas"
      | "definitions"
      | "balanced";
  }

  return settings;
}
