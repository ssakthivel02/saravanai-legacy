-- Future Runtime Wave 4 schema. DO NOT execute in this release.
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS workspace_registry (
  workspace_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  data_zone TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('proposed','approved','active','suspended','retired')),
  created_at TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_workspace_tenant_slug ON workspace_registry(tenant_id, slug);
CREATE TABLE IF NOT EXISTS workspace_memberships (
  membership_id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  subject_hash TEXT NOT NULL,
  role_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('proposed','approved','active','revoked','expired')),
  created_at TEXT NOT NULL,
  FOREIGN KEY (workspace_id) REFERENCES workspace_registry(workspace_id)
);
CREATE TABLE IF NOT EXISTS audit_event_registry (
  event_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  subject_fingerprint TEXT NOT NULL,
  purpose TEXT NOT NULL,
  occurred_at TEXT NOT NULL
);
