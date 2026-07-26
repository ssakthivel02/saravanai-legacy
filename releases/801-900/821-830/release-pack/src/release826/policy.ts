import type { AgentSandboxNetworkAndFileBoundary } from "./contracts";

export interface Release826Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateAgentSandboxNetworkAndFileBoundary(value: AgentSandboxNetworkAndFileBoundary): Release826Decision {
  if ((value as any).productionWriteAllowed !== false) return { allowed: false, reason: "production_write_forbidden", obligations: ["disable_execution"] };
  return { allowed: true, reason: "release_826_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
