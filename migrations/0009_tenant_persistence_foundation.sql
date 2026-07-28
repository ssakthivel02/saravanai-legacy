-- SakthiAI Build 018 tenant persistence schema design.
-- DO NOT execute automatically. Production execution requires owner Access verification,
-- endpoint authorisation, D1 backup/export, rollback rehearsal and explicit approval.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS tenant_profiles (
  tenant_id TEXT PRIMARY KEY CHECK (tenant_id GLOB 'tenant-*'),
  role TEXT NOT NULL CHECK (role IN ('owner', 'member', 'reader')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
  schema_version TEXT NOT NULL DEFAULT '0009',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tenant_records (
  tenant_id TEXT NOT NULL,
  record_id TEXT NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('project','conversation','artifact','approval','memory','knowledge-node','usage-ledger')),
  content_type TEXT NOT NULL,
  payload_ciphertext BLOB NOT NULL,
  payload_nonce BLOB NOT NULL,
  payload_sha256 TEXT NOT NULL,
  payload_bytes INTEGER NOT NULL CHECK (payload_bytes BETWEEN 0 AND 262144),
  key_version TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  PRIMARY KEY (tenant_id, record_id),
  FOREIGN KEY (tenant_id) REFERENCES tenant_profiles(tenant_id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tenant_records_type_updated
  ON tenant_records(tenant_id, resource_type, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_tenant_records_active
  ON tenant_records(tenant_id, deleted_at, updated_at DESC);

CREATE TABLE IF NOT EXISTS tenant_usage_counters (
  tenant_id TEXT NOT NULL,
  period_start TEXT NOT NULL,
  record_count INTEGER NOT NULL DEFAULT 0 CHECK (record_count >= 0),
  stored_bytes INTEGER NOT NULL DEFAULT 0 CHECK (stored_bytes >= 0),
  write_count INTEGER NOT NULL DEFAULT 0 CHECK (write_count >= 0),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (tenant_id, period_start),
  FOREIGN KEY (tenant_id) REFERENCES tenant_profiles(tenant_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS tenant_deletion_requests (
  request_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  record_id TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested','approved','rejected','completed','cancelled')),
  requested_at TEXT NOT NULL,
  approved_at TEXT,
  completed_at TEXT,
  evidence_json TEXT NOT NULL DEFAULT '{}',
  FOREIGN KEY (tenant_id) REFERENCES tenant_profiles(tenant_id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tenant_deletion_status
  ON tenant_deletion_requests(tenant_id, status, requested_at DESC);

CREATE TABLE IF NOT EXISTS tenant_migration_ledger (
  migration_id TEXT PRIMARY KEY,
  checksum_sha256 TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('planned','applied','rolled-back','failed')),
  approved_by_actor_hash TEXT,
  applied_at TEXT,
  rolled_back_at TEXT,
  evidence_json TEXT NOT NULL DEFAULT '{}'
);

-- No email address, JWT, Access AUD, password, provider key or raw profile key is stored.