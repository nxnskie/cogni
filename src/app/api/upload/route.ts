import { NextRequest, NextResponse } from "next/server";
import {
  DocumentParseError,
  parseUploadedDocument,
} from "@/lib/parse-document";
import { toUserFacingError } from "@/lib/user-facing-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * POST /api/upload
 * multipart/form-data with field `file`
 * Parses PDF / DOCX / TXT / MD in-process (no PARSER_URL).
 */
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please choose a file to upload." },
        { status: 400 }
      );
    }

    const { fileName, markdown } = await parseUploadedDocument(file);

    return NextResponse.json({ fileName, markdown });
  } catch (err) {
    if (err instanceof DocumentParseError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }

    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("[upload]", err);
    return NextResponse.json(
      { error: toUserFacingError(message) },
      { status: 500 }
    );
  }
}
