import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import type { DocumentImage } from "./types";

const MIN_TEXT_CHARS = 40;
const MAX_BYTES = process.env.VERCEL
  ? 4 * 1024 * 1024
  : 25 * 1024 * 1024;

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
  images: DocumentImage[];
} | null> {
  const parserUrl = process.env.PARSER_SERVICE_URL?.trim();
  if (!parserUrl) return null;

  const form = new FormData();
  form.append("file", file, file.name || "upload.bin");

  try {
    const response = await fetch(`${parserUrl.replace(/\/$/, "")}/parse`, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(15_000),
    });
    const body: unknown = await response.json().catch(() => null);
    if (!response.ok) throw new Error(`Parser service returned ${response.status}`);
    const parsed = body as Record<string, unknown>;
    if (typeof parsed.markdown !== "string" || parsed.markdown.trim().length < MIN_TEXT_CHARS) {
      throw new Error("Parser service returned unusable text");
    }
    const images = Array.isArray(parsed.images)
      ? parsed.images.filter(
          (image): image is DocumentImage =>
            Boolean(image) && typeof image === "object" &&
            typeof (image as Record<string, unknown>).url === "string"
        ).map((image) => ({
          url: image.url,
          contextText: image.contextText,
          page: typeof (image as DocumentImage).page === "number"
            ? (image as DocumentImage).page
            : undefined,
          slide: typeof (image as DocumentImage).slide === "number"
            ? (image as DocumentImage).slide
            : undefined,
        }))
      : [];
    return {
      fileName: typeof parsed.fileName === "string" ? parsed.fileName : file.name,
      markdown: cleanExtractedText(parsed.markdown),
      images,
    };
  } catch (error) {
    console.warn("[document-parser] external parser unavailable; using local parser:", error);
    return null;
  }
}

/**
 * Extract study text using the local parsers supported by the web app.
 */
export async function parseUploadedDocument(file: File): Promise<{
  fileName: string;
  markdown: string;
  images: DocumentImage[];
}> {
  const fileName = file.name || "upload.bin";
  const ext = getExtension(fileName);

  if (![".pdf", ".docx", ".pptx", ".txt", ".md"].includes(ext)) {
    throw new DocumentParseError(
      "Unsupported file type. Please use PDF, DOCX, TXT, or MD.",
      400
    );
  }

  if (file.size > MAX_BYTES) {
    throw new DocumentParseError(
      process.env.VERCEL
        ? "File is too large for this deployment (max 4MB)."
        : "File is too large (max 25MB).",
      413
    );
  }

  const externalResult = await parseWithExternalService(file);
  if (externalResult) return externalResult;

  if (ext === ".pptx") {
    throw new DocumentParseError(
      `${PPTX_UNSUPPORTED_MESSAGE} Configure PARSER_SERVICE_URL to enable PPTX parsing.`,
      400
    );
  }

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

    return { fileName, markdown, images: [] };
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
