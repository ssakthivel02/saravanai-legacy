-- Future Runtime Wave 5 SRE schema. DO NOT execute in this release.
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS slo_registry (
  slo_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  indicator TEXT NOT NULL,
  target_percent REAL NOT NULL,
  window_days INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('proposed','approved','active','retired')),
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS incident_registry (
  incident_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('SEV1','SEV2','SEV3','SEV4')),
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('declared','investigating','mitigated','resolved','closed')),
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS deployment_evidence_registry (
  evidence_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  release_id TEXT NOT NULL,
  decision TEXT NOT NULL,
  rationale_fingerprint TEXT NOT NULL,
  created_at TEXT NOT NULL
);
