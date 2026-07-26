PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS release_838_records (
  record_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  record_type TEXT NOT NULL DEFAULT 'research_synthesis_and_report_pipeline',
  payload_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  owner_subject TEXT NOT NULL,
  evidence_ids_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_release_838_tenant_status
  ON release_838_records(tenant_id, status);

CREATE TABLE IF NOT EXISTS release_838_operations (
  operation_id TEXT PRIMARY KEY,
  record_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  payload_sha256 TEXT NOT NULL,
  outcome TEXT NOT NULL,
  result_ref TEXT,
  evidence_ids_json TEXT NOT NULL DEFAULT '[]',
  operated_by TEXT NOT NULL,
  operated_at TEXT NOT NULL,
  FOREIGN KEY(record_id) REFERENCES release_838_records(record_id),
  UNIQUE(tenant_id, idempotency_key)
);

CREATE INDEX IF NOT EXISTS idx_release_838_operations_tenant
  ON release_838_operations(tenant_id, operated_at);
