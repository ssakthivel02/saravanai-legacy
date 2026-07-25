PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS control_catalogue (
  id TEXT PRIMARY KEY,
  pillar TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  control_type TEXT NOT NULL CHECK (control_type IN ('preventive','detective','corrective','directive')),
  mandatory INTEGER NOT NULL DEFAULT 1 CHECK (mandatory IN (0,1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS control_framework_mappings (
  id TEXT PRIMARY KEY,
  control_id TEXT NOT NULL,
  framework_id TEXT NOT NULL,
  framework_reference TEXT NOT NULL,
  mapping_rationale TEXT NOT NULL,
  legal_review_required INTEGER NOT NULL DEFAULT 0 CHECK (legal_review_required IN (0,1)),
  FOREIGN KEY (control_id) REFERENCES control_catalogue(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assurance_evidence (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  control_id TEXT NOT NULL,
  evidence_type TEXT NOT NULL,
  evidence_uri TEXT,
  content_hash TEXT,
  collected_at TEXT NOT NULL,
  collected_by TEXT NOT NULL,
  valid_until TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft','submitted','accepted','rejected','expired')),
  classification TEXT NOT NULL CHECK (classification IN ('public','internal','confidential','restricted')),
  FOREIGN KEY (control_id) REFERENCES control_catalogue(id)
);

CREATE INDEX IF NOT EXISTS idx_assurance_evidence_tenant_control ON assurance_evidence(tenant_id, control_id);

CREATE TABLE IF NOT EXISTS governance_risks (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  likelihood INTEGER NOT NULL CHECK (likelihood BETWEEN 1 AND 5),
  impact INTEGER NOT NULL CHECK (impact BETWEEN 1 AND 5),
  inherent_score INTEGER NOT NULL CHECK (inherent_score BETWEEN 1 AND 25),
  treatment TEXT NOT NULL CHECK (treatment IN ('avoid','reduce','transfer','accept')),
  owner_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open','treated','accepted','closed')),
  review_at TEXT NOT NULL,
  accepted_by TEXT,
  acceptance_expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_governance_risks_tenant_status ON governance_risks(tenant_id, status);

CREATE TABLE IF NOT EXISTS data_processing_register (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  processing_purpose TEXT NOT NULL,
  data_categories TEXT NOT NULL,
  data_subjects TEXT NOT NULL,
  lawful_basis_review TEXT NOT NULL,
  retention_policy TEXT NOT NULL,
  recipients TEXT NOT NULL,
  transfer_review TEXT NOT NULL,
  security_controls TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  review_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_system_register (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  system_name TEXT NOT NULL,
  intended_purpose TEXT NOT NULL,
  prohibited_uses TEXT NOT NULL,
  model_or_service TEXT NOT NULL,
  human_oversight TEXT NOT NULL,
  impact_classification TEXT NOT NULL,
  regional_review TEXT NOT NULL,
  evaluation_status TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  review_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS incidents (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  incident_type TEXT NOT NULL CHECK (incident_type IN ('security','privacy','availability','ai-safety','customer-safety','compliance')),
  severity TEXT NOT NULL CHECK (severity IN ('SEV1','SEV2','SEV3','SEV4')),
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('declared','contained','recovering','resolved','reviewed')),
  commander_id TEXT NOT NULL,
  detected_at TEXT NOT NULL,
  contained_at TEXT,
  resolved_at TEXT,
  customer_notification_status TEXT NOT NULL DEFAULT 'not-assessed',
  regulator_notification_status TEXT NOT NULL DEFAULT 'not-assessed',
  post_incident_review_uri TEXT
);

CREATE INDEX IF NOT EXISTS idx_incidents_tenant_severity ON incidents(tenant_id, severity, status);

CREATE TABLE IF NOT EXISTS release_certifications (
  id TEXT PRIMARY KEY,
  release_id TEXT NOT NULL,
  environment TEXT NOT NULL,
  security_status TEXT NOT NULL,
  privacy_status TEXT NOT NULL,
  resilience_status TEXT NOT NULL,
  accessibility_status TEXT NOT NULL,
  legal_status TEXT NOT NULL,
  financial_status TEXT NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('no-go','conditional-go','go')),
  decided_by TEXT NOT NULL,
  decided_at TEXT NOT NULL,
  exceptions TEXT NOT NULL DEFAULT '[]',
  evidence_bundle_uri TEXT,
  UNIQUE(release_id, environment)
);
