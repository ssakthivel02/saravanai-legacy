-- Runtime Wave 3 future knowledge-evidence schema.
-- DO NOT execute as part of this pack. Use a separate migration review.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS source_registry (
  source_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  title TEXT NOT NULL,
  source_type TEXT NOT NULL,
  canonical_url TEXT NOT NULL,
  published_date TEXT,
  accessed_date TEXT NOT NULL,
  license TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('proposed', 'approved', 'quarantined', 'retired')),
  created_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_source_registry_tenant_url
  ON source_registry(tenant_id, canonical_url);

CREATE TABLE IF NOT EXISTS claim_registry (
  claim_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  proposition_sha256 TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'supported', 'disputed', 'withdrawn')),
  temporal_as_of TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS citation_registry (
  citation_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  claim_id TEXT NOT NULL,
  source_id TEXT NOT NULL,
  locator TEXT NOT NULL,
  quote_length INTEGER NOT NULL DEFAULT 0 CHECK (quote_length BETWEEN 0 AND 25),
  created_at TEXT NOT NULL,
  FOREIGN KEY (claim_id) REFERENCES claim_registry(claim_id),
  FOREIGN KEY (source_id) REFERENCES source_registry(source_id)
);

CREATE TABLE IF NOT EXISTS correction_evidence (
  correction_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  target_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  actions_json TEXT NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('pending', 'approved', 'rejected', 'completed')),
  approved_by_hash TEXT,
  created_at TEXT NOT NULL
);
