-- SakthiAI Build 019 tenant lifecycle evidence schema design.
-- DO NOT execute automatically. This file is for reviewed non-production rehearsal only.
-- Production execution requires an approved change, verified backup, restore evidence and rollback plan.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS tenant_lifecycle_evidence (
  evidence_id TEXT PRIMARY KEY,
  evidence_type TEXT NOT NULL CHECK (evidence_type IN ('migration','backup','restore','isolation','deletion','rollback')),
  environment TEXT NOT NULL CHECK (environment IN ('local','preview','non-production')),
  subject_hash TEXT NOT NULL,
  evidence_sha256 TEXT NOT NULL CHECK (length(evidence_sha256) = 64),
  result TEXT NOT NULL CHECK (result IN ('pass','fail','blocked')),
  reviewed_by_actor_hash TEXT,
  reviewed_at TEXT,
  created_at TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_tenant_lifecycle_type_created
  ON tenant_lifecycle_evidence(evidence_type, created_at DESC);

CREATE TABLE IF NOT EXISTS tenant_recovery_drills (
  drill_id TEXT PRIMARY KEY,
  environment TEXT NOT NULL CHECK (environment IN ('local','preview','non-production')),
  backup_evidence_id TEXT NOT NULL,
  restore_evidence_id TEXT NOT NULL,
  isolation_evidence_id TEXT NOT NULL,
  recovery_time_minutes INTEGER NOT NULL CHECK (recovery_time_minutes BETWEEN 0 AND 1440),
  recovery_point_minutes INTEGER NOT NULL CHECK (recovery_point_minutes BETWEEN 0 AND 1440),
  checksum_match INTEGER NOT NULL CHECK (checksum_match IN (0,1)),
  status TEXT NOT NULL CHECK (status IN ('planned','passed','failed','blocked')),
  created_at TEXT NOT NULL,
  completed_at TEXT,
  FOREIGN KEY (backup_evidence_id) REFERENCES tenant_lifecycle_evidence(evidence_id) ON DELETE RESTRICT,
  FOREIGN KEY (restore_evidence_id) REFERENCES tenant_lifecycle_evidence(evidence_id) ON DELETE RESTRICT,
  FOREIGN KEY (isolation_evidence_id) REFERENCES tenant_lifecycle_evidence(evidence_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS tenant_legal_holds (
  hold_id TEXT PRIMARY KEY,
  tenant_subject_hash TEXT NOT NULL,
  record_subject_hash TEXT,
  reason_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','released')),
  created_at TEXT NOT NULL,
  released_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_tenant_legal_hold_scope
  ON tenant_legal_holds(tenant_subject_hash, record_subject_hash, status);

-- No email, JWT, Access AUD, password, provider key, raw profile key,
-- tenant record content, backup bytes or evidence body is stored by this design.
