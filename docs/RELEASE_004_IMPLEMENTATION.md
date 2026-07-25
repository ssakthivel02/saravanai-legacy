# Release 004 — Private file and PDF evidence pipeline

Release 004 adds a guarded file-ingestion API without exposing anonymous public uploads.

## Free-first architecture

- Private R2 bucket for source files.
- Workers AI `toMarkdown` conversion for PDF, Word, spreadsheets, HTML, CSV and supported images.
- AI Search indexing when an `AI_SEARCH` binding is configured.
- SHA-256 checksum, file manifest and conversion metadata.
- Source content remains private; downloads require an ingestion token until Release 006 identity/RBAC replaces it.

## Binding activation

The code is safe to deploy without storage bindings. File routes report `FILES_NOT_CONFIGURED` until the following resources are attached:

- `EVIDENCE_BUCKET` → R2 bucket `sakthiai-evidence`
- `AI_SEARCH` → Workers AI Search binding
- `SAKTHI_INGEST_TOKEN` → encrypted Worker secret

## API contract

- `GET /api/v1/files/capabilities`
- `POST /api/v1/files/upload`
- `GET /api/v1/files/:id`
- `DELETE /api/v1/files/:id`
- `POST /api/v1/files/:id/convert`

## Security boundary

Anonymous upload is prohibited. Release 004 uses a temporary owner/admin ingestion token. Release 006 will replace it with user, team, tenant and RBAC enforcement.
