-- Future Runtime Wave 8 evidence schema. DO NOT execute in this release.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS privacy_lifecycle_evidence (
  evidence_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  classification TEXT NOT NULL,
  retention_days INTEGER NOT NULL,
  legal_basis TEXT NOT NULL,
  evidence_digest TEXT NOT NULL,
  created_at TEXT NOT NULL
);
