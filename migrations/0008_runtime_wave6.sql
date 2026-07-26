-- Future Runtime Wave 6 supply-chain schema. DO NOT execute in this release.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS supply_chain_evidence_registry (
  evidence_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  release_id TEXT NOT NULL,
  evidence_type TEXT NOT NULL,
  evidence_digest TEXT NOT NULL,
  result TEXT NOT NULL CHECK (result IN ('pass','fail','review')),
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS risk_exception_registry (
  exception_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  control_id TEXT NOT NULL,
  owner_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('proposed','approved','rejected','expired','revoked')),
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS artifact_provenance_registry (
  provenance_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  repository TEXT NOT NULL,
  commit_sha TEXT NOT NULL,
  artifact_sha256 TEXT NOT NULL,
  builder_id TEXT NOT NULL,
  created_at TEXT NOT NULL
);
