-- Future Runtime Wave 11 evidence schema. DO NOT execute in this release.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS enterprise_readiness_evidence (
  evidence_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  control_scope TEXT NOT NULL,
  readiness_score REAL NOT NULL,
  decision TEXT NOT NULL,
  evidence_digest TEXT NOT NULL,
  created_at TEXT NOT NULL
);
