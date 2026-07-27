-- Future evidence schema for Runtime Waves 31–50.
-- DO NOT execute during merge or initial production deployment.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS runtime_advanced_assurance_evidence (
  evidence_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  wave_number INTEGER NOT NULL CHECK (wave_number BETWEEN 31 AND 50),
  subject_ref TEXT NOT NULL,
  control_id TEXT NOT NULL,
  assessment_score REAL,
  assessment_result TEXT NOT NULL,
  evidence_digest TEXT NOT NULL,
  evidence_classification TEXT NOT NULL,
  exception_expires_at TEXT,
  owner_review_status TEXT NOT NULL DEFAULT 'pending',
  independent_review_status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL,
  reviewed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_runtime_advanced_assurance_wave
  ON runtime_advanced_assurance_evidence (wave_number, created_at);

CREATE INDEX IF NOT EXISTS idx_runtime_advanced_assurance_subject
  ON runtime_advanced_assurance_evidence (tenant_id, subject_ref);
