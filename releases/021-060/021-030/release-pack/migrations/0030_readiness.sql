CREATE TABLE IF NOT EXISTS go_no_go_decisions(
  decision_id TEXT PRIMARY KEY, release_id TEXT NOT NULL, commit_sha TEXT NOT NULL,
  environment TEXT NOT NULL, decision TEXT NOT NULL, approver TEXT NOT NULL,
  evidence_json TEXT NOT NULL, residual_risks_json TEXT NOT NULL,
  decided_at TEXT NOT NULL
);
