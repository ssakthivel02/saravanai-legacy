CREATE TABLE IF NOT EXISTS service_events(
  event_id TEXT PRIMARY KEY, service TEXT NOT NULL, severity TEXT NOT NULL,
  event_type TEXT NOT NULL, request_id TEXT, tenant_id TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}', occurred_at TEXT NOT NULL
);
