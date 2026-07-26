-- Future Runtime Wave 7 evidence schema. DO NOT execute in this release.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS model_governance_evidence (
  evidence_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  model_id TEXT NOT NULL,
  model_version TEXT NOT NULL,
  risk_tier INTEGER NOT NULL,
  evidence_digest TEXT NOT NULL,
  created_at TEXT NOT NULL
);
