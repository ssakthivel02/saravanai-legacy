CREATE TABLE IF NOT EXISTS agent_tasks(
  task_id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, agent_name TEXT NOT NULL,
  objective TEXT NOT NULL, status TEXT NOT NULL, step INTEGER NOT NULL DEFAULT 0,
  approval_id TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
