export interface GraphNode {
  nodeId: string;
  tenantId: string;
  type: "project" | "document" | "decision" | "risk" | "control" | "evidence" | "api" | "repository";
  label: string;
  confidence: number;
  validFrom: string;
  validTo?: string;
  provenance: string[];
}

export interface GraphEdge {
  edgeId: string;
  tenantId: string;
  fromNodeId: string;
  toNodeId: string;
  predicate: string;
  confidence: number;
  validFrom: string;
  validTo?: string;
  provenance: string[];
}

export function validateGraphEdge(edge: GraphEdge): string[] {
  const errors: string[] = [];
  if (edge.fromNodeId === edge.toNodeId) errors.push("self_edge_not_allowed");
  if (edge.confidence < 0 || edge.confidence > 1) errors.push("confidence_out_of_range");
  if (!edge.provenance.length) errors.push("provenance_required");
  return errors;
}
