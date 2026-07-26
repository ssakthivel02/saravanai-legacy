-- Runtime Wave 1 non-production migration design.
-- Do not execute in production until the migration and rollback are rehearsed.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS runtime_policy_decisions (
  decision_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  request_id TEXT NOT NULL,
  trace_id TEXT NOT NULL,
  action TEXT NOT NULL,
  allowed INTEGER NOT NULL CHECK (allowed IN (0, 1)),
  reason_codes_json TEXT NOT NULL DEFAULT '[]',
  obligation_codes_json TEXT NOT NULL DEFAULT '[]',
  risk_score INTEGER NOT NULL DEFAULT 0 CHECK (risk_score BETWEEN 0 AND 100),
  actor_subject_hash TEXT NOT NULL,
  policy_version TEXT NOT NULL,
  decided_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_runtime_policy_request
  ON runtime_policy_decisions(tenant_id, request_id);

CREATE INDEX IF NOT EXISTS idx_runtime_policy_tenant_time
  ON runtime_policy_decisions(tenant_id, decided_at);

CREATE TABLE IF NOT EXISTS runtime_idempotency_keys (
  tenant_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  payload_sha256 TEXT NOT NULL,
  result_ref TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (tenant_id, idempotency_key)
);

CREATE INDEX IF NOT EXISTS idx_runtime_idempotency_expiry
  ON runtime_idempotency_keys(expires_at);

CREATE TABLE IF NOT EXISTS runtime_security_events (
  event_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  request_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'low', 'medium', 'high', 'critical')),
  outcome TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  occurred_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_runtime_security_tenant_time
  ON runtime_security_events(tenant_id, occurred_at);
