CREATE TABLE IF NOT EXISTS access_decisions(
  decision_id TEXT PRIMARY KEY, request_id TEXT NOT NULL, identity_id TEXT,
  organisation_id TEXT, policy_version TEXT NOT NULL, allowed INTEGER NOT NULL,
  reason TEXT NOT NULL, risk_score INTEGER NOT NULL, signals_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_access_decisions_created ON access_decisions(created_at);
