# Release 004 — Files, PDFs and Evidence Search

## Goal

Add controlled file upload, PDF/document conversion, searchable evidence and citation-backed answers without exposing stored files publicly.

## Architecture

1. **Private source storage — Cloudflare R2**
   - Bucket: `sakthiai-evidence`
   - Worker binding: `EVIDENCE_BUCKET`
   - Objects are private by default.
   - Every object key is tenant/project scoped when identity is introduced.

2. **File intake API**
   - `POST /api/v1/files`
   - Multipart upload with strict size and MIME allowlists.
   - Reject executable/archive formats in the initial release.
   - Compute SHA-256 and store immutable source metadata.
   - Do not accept browser-supplied object keys.

3. **Document conversion**
   - Convert PDFs, Office documents, HTML and supported images to Markdown using Cloudflare Workers AI Markdown Conversion.
   - Store original source, converted Markdown and extraction manifest separately.
   - Preserve filename, MIME type, checksum, conversion status and page/evidence metadata.

4. **Evidence search — Cloudflare AI Search**
   - Instance: `sakthiai-evidence`
   - Index R2 or use built-in storage.
   - Worker binding: `AI_SEARCH` after the instance is created.
   - Search results must return source title, object key, citation metadata and relevance information.

5. **Research API**
   - `POST /api/v1/files/search`
   - `POST /api/v1/files/ask`
   - Answers must distinguish uploaded evidence from live web research.
   - Never invent a page number or citation.

## Initial security limits

- Initial maximum upload: 10 MiB per file until asynchronous multipart/workflow processing is added.
- Allow: PDF, TXT, Markdown, HTML, DOCX, PPTX, XLSX, PNG, JPEG and WebP when conversion support is verified.
- Deny: executables, scripts, archives, password-protected files and unknown binary formats.
- File content is never inserted into logs.
- Download endpoints use authorization or short-lived signed access; no public bucket.
- Write operations remain disabled until Release 006 identity/RBAC is complete. Release 004 begins with a controlled owner/admin upload boundary.

## Status model

- `received`
- `stored`
- `converting`
- `converted`
- `indexing`
- `ready`
- `failed`
- `quarantined`

## Acceptance criteria

- Original file stored privately in R2 with SHA-256 metadata.
- Supported documents convert to Markdown or return a structured conversion failure.
- API cannot overwrite an unrelated object key.
- API responses never expose Cloudflare credentials or internal bucket details.
- Search answers contain evidence references from the indexed source.
- Unsupported or oversized files fail before storage.
- Existing chat, streaming and live research regression tests continue to pass.

## Cloudflare resources requiring one-time dashboard creation

1. Create private R2 bucket `sakthiai-evidence`.
2. Create AI Search instance `sakthiai-evidence` and connect it to the R2 bucket or use built-in storage.
3. Attach Worker bindings after resource creation:
   - `EVIDENCE_BUCKET`
   - `AI_SEARCH`
4. Review R2 and AI Search billing/limits before enabling public uploads.

## Delivery sequence

- 004A — R2 upload contract and checksum manifest
- 004B — Markdown conversion and status pipeline
- 004C — AI Search indexing and evidence query API
- 004D — PDF/evidence viewer, citations and QA
- 004E — production controls, limits and release closure
