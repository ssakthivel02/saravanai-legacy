-- Future Runtime Wave 9 evidence schema. DO NOT execute in this release.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS api_governance_evidence (
  evidence_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  api_name TEXT NOT NULL,
  api_version TEXT NOT NULL,
  compatibility_result TEXT NOT NULL,
  evidence_digest TEXT NOT NULL,
  created_at TEXT NOT NULL
);
