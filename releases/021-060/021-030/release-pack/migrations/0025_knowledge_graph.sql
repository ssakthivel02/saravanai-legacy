CREATE TABLE IF NOT EXISTS graph_nodes(
  node_id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, node_type TEXT NOT NULL,
  label TEXT NOT NULL, confidence REAL NOT NULL, valid_from TEXT NOT NULL,
  valid_to TEXT, provenance_json TEXT NOT NULL, payload_json TEXT NOT NULL DEFAULT '{}'
);
CREATE TABLE IF NOT EXISTS graph_edges(
  edge_id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, from_node_id TEXT NOT NULL,
  to_node_id TEXT NOT NULL, predicate TEXT NOT NULL, confidence REAL NOT NULL,
  valid_from TEXT NOT NULL, valid_to TEXT, provenance_json TEXT NOT NULL,
  FOREIGN KEY(from_node_id) REFERENCES graph_nodes(node_id),
  FOREIGN KEY(to_node_id) REFERENCES graph_nodes(node_id)
);
