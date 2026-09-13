import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

const MIN_TEXT_CHARS = 40;
const MAX_BYTES = 25 * 1024 * 1024;
const PARSER_TIMEOUT_MS = 15_000;

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

async function parseWithExternalService(file: File): Promise<{
  fileName: string;
  markdown: string;
} | null> {
  const parserUrl = process.env.PARSER_SERVICE_URL?.trim();
  if (!parserUrl) return null;

  const form = new FormData();
  form.append("file", file, file.name || "upload.bin");

  try {
    const response = await fetch(`${parserUrl.replace(/\/$/, "")}/parse`, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(PARSER_TIMEOUT_MS),
    });

    const body: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      const detail =
        body && typeof body === "object" && "detail" in body
          ? String(body.detail)
          : `Parser service returned ${response.status}`;
      throw new Error(detail);
    }

    const parsedBody =
      body && typeof body === "object"
        ? (body as Record<string, unknown>)
        : null;

    if (
      !parsedBody ||
      typeof parsedBody.markdown !== "string" ||
      parsedBody.markdown.trim().length < MIN_TEXT_CHARS
    ) {
      throw new Error("Parser service returned unusable text");
    }

    return {
      fileName:
        typeof parsedBody.fileName === "string" && parsedBody.fileName.trim()
          ? parsedBody.fileName
          : file.name || "upload.bin",
      markdown: cleanExtractedText(parsedBody.markdown),
    };
  } catch (error) {
    // Vercel should remain usable when the optional worker is asleep, absent, or unreachable.
    console.warn(
      "[document-parser] external parser unavailable; using local parser:",
      error
    );
    return null;
  }
}

/**
 * Extract study text using the optional parser service, then reliable local parsers.
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

  const externalResult = await parseWithExternalService(file);
  if (externalResult) return externalResult;

  try {
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
  } catch (error) {
    if (error instanceof DocumentParseError) throw error;
    console.error("[document-parser] local parsing failed:", error);
    throw new DocumentParseError(
      "We couldn't read that document. Please try another file or paste the text directly.",
      422
    );
  }
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
