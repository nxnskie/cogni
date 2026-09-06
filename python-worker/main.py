"""
StudyForge document parser — MarkItDown → clean Markdown.
Run: uvicorn main:app --reload --port 8000
"""

from __future__ import annotations

import os
import tempfile
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from markitdown import MarkItDown

ALLOWED_EXT = {".pdf", ".pptx", ".docx"}
MAX_BYTES = 25 * 1024 * 1024

app = FastAPI(title="StudyForge Parser", version="1.0.0")
md = MarkItDown()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/parse")
async def parse(file: UploadFile = File(...)) -> dict[str, str]:
    name = file.filename or "upload.bin"
    ext = Path(name).suffix.lower()

    if ext not in ALLOWED_EXT:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="File too large (max 25MB)")

    suffix = ext or ".bin"
    tmp_path: str | None = None

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(data)
            tmp_path = tmp.name

        result = md.convert(tmp_path)
        text = (getattr(result, "text_content", None) or "").strip()

        if len(text) < 40:
            raise HTTPException(
                status_code=422,
                detail="Could not extract usable text from the document",
            )

        return {"fileName": name, "markdown": text}
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001 — surface convert errors to the client
        raise HTTPException(
            status_code=500,
            detail=f"Failed to convert document: {exc}",
        ) from exc
    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except OSError:
                pass
