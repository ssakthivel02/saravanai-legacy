PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS release_667_records (
  record_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  record_type TEXT NOT NULL DEFAULT 'capacity_performance_and_saturation_engineering',
  payload_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  owner_subject TEXT NOT NULL,
  evidence_ids_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_release_667_tenant_status
  ON release_667_records(tenant_id, status);

CREATE TABLE IF NOT EXISTS release_667_decisions (
  decision_id TEXT PRIMARY KEY,
  record_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  allowed INTEGER NOT NULL CHECK (allowed IN (0,1)),
  reason TEXT NOT NULL,
  obligations_json TEXT NOT NULL,
  policy_version TEXT NOT NULL,
  evidence_ids_json TEXT NOT NULL DEFAULT '[]',
  decided_by TEXT NOT NULL,
  decided_at TEXT NOT NULL,
  FOREIGN KEY(record_id) REFERENCES release_667_records(record_id)
);

CREATE INDEX IF NOT EXISTS idx_release_667_decision_tenant
  ON release_667_decisions(tenant_id, decided_at);
