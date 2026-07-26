PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS continuity_exit_plans (
  planid TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'platform',
  record_version INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft',
  payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  created_by TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_continuity_exit_plans_tenant_status
  ON continuity_exit_plans(tenant_id, status, updated_at);

CREATE TABLE IF NOT EXISTS continuity_exercises (
  event_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'platform',
  resource_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  request_id TEXT NOT NULL,
  actor_subject TEXT NOT NULL,
  outcome TEXT NOT NULL,
  evidence_ids_json TEXT NOT NULL DEFAULT '[]',
  occurred_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_continuity_exercises_resource_time
  ON continuity_exercises(tenant_id, resource_id, occurred_at);
