CREATE TABLE IF NOT EXISTS memories(
  memory_id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, subject_id TEXT NOT NULL,
  memory_class TEXT NOT NULL, encrypted_content TEXT NOT NULL, source_ref TEXT NOT NULL,
  consent_basis TEXT NOT NULL, quality_score REAL NOT NULL, sensitivity TEXT NOT NULL,
  status TEXT NOT NULL, created_at TEXT NOT NULL, expires_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_memories_subject ON memories(tenant_id, subject_id, status);
