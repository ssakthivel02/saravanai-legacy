CREATE TABLE IF NOT EXISTS ai_safety_assessments(
  assessment_id TEXT PRIMARY KEY, request_id TEXT NOT NULL, tenant_id TEXT,
  input_hash TEXT NOT NULL, risk_level TEXT NOT NULL, findings_json TEXT NOT NULL,
  blocked INTEGER NOT NULL, reviewer_identity_id TEXT, created_at TEXT NOT NULL
);
