CREATE TABLE IF NOT EXISTS release_evidence(
  evidence_id TEXT PRIMARY KEY, release_id TEXT NOT NULL, evidence_type TEXT NOT NULL,
  artifact_ref TEXT NOT NULL, sha256 TEXT NOT NULL, created_at TEXT NOT NULL,
  created_by TEXT NOT NULL
);
