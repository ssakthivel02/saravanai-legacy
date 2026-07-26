-- Future Runtime Wave 10 evidence schema. DO NOT execute in this release.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS continuity_evidence (
  evidence_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  rto_minutes INTEGER NOT NULL,
  rpo_minutes INTEGER NOT NULL,
  evidence_digest TEXT NOT NULL,
  created_at TEXT NOT NULL
);
