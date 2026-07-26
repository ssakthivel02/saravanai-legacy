-- Runtime Wave 2 future evidence schema.
-- DO NOT execute as part of this pack. A separate reviewed migration PR is required.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS agent_plan_evidence (
  plan_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  objective_sha256 TEXT NOT NULL,
  plan_json TEXT NOT NULL,
  plan_version TEXT NOT NULL,
  approved INTEGER NOT NULL DEFAULT 0 CHECK (approved IN (0, 1)),
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_agent_plan_tenant_time
  ON agent_plan_evidence(tenant_id, created_at);

CREATE TABLE IF NOT EXISTS tool_lease_proposals (
  proposal_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  tool_id TEXT NOT NULL,
  scope_json TEXT NOT NULL,
  execution_allowed INTEGER NOT NULL DEFAULT 0 CHECK (execution_allowed = 0),
  write_allowed INTEGER NOT NULL DEFAULT 0 CHECK (write_allowed = 0),
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS human_approval_evidence (
  approval_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  action_class TEXT NOT NULL,
  required_review_level TEXT NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('pending', 'approved', 'rejected', 'expired')),
  approver_subject_hash TEXT,
  evidence_json TEXT NOT NULL DEFAULT '{}',
  decided_at TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS emergency_stop_events (
  event_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('stopped', 'released')),
  reason TEXT NOT NULL,
  actor_subject_hash TEXT NOT NULL,
  occurred_at TEXT NOT NULL
);
