PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS release_108_records(
 record_id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, owner_subject TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'draft', payload_json TEXT NOT NULL,
 risk_score INTEGER NOT NULL DEFAULT 0, evidence_refs_json TEXT NOT NULL DEFAULT '[]',
 created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_release_108_tenant_status ON release_108_records(tenant_id,status);
CREATE TABLE IF NOT EXISTS release_108_decisions(
 decision_id TEXT PRIMARY KEY, record_id TEXT NOT NULL, tenant_id TEXT NOT NULL,
 allowed INTEGER NOT NULL CHECK(allowed IN(0,1)), reason TEXT NOT NULL,
 obligations_json TEXT NOT NULL, decided_by TEXT NOT NULL, decided_at TEXT NOT NULL,
 FOREIGN KEY(record_id) REFERENCES release_108_records(record_id));
