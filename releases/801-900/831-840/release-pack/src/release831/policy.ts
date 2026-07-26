import type { KnowledgeSourceConnectorRuntime } from "./contracts";

export interface Release831Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateKnowledgeSourceConnectorRuntime(value: KnowledgeSourceConnectorRuntime): Release831Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_831_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
