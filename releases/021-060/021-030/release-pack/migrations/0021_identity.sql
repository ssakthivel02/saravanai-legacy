PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS organisations(
  organisation_id TEXT PRIMARY KEY, name TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS identities(
  identity_id TEXT PRIMARY KEY, subject TEXT NOT NULL UNIQUE, email TEXT,
  status TEXT NOT NULL DEFAULT 'active', created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS memberships(
  membership_id TEXT PRIMARY KEY, organisation_id TEXT NOT NULL, identity_id TEXT NOT NULL,
  role TEXT NOT NULL, attributes_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL,
  UNIQUE(organisation_id, identity_id),
  FOREIGN KEY(organisation_id) REFERENCES organisations(organisation_id),
  FOREIGN KEY(identity_id) REFERENCES identities(identity_id)
);
CREATE INDEX IF NOT EXISTS idx_memberships_identity ON memberships(identity_id);
