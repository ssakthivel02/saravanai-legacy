import type { SupplyChainArtifact } from "./contracts";

export interface Release204Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateSupplyChainArtifact(value: SupplyChainArtifact): Release204Decision {
  if (value.criticalFindings > 0) return { allowed: false, reason: "critical_supply_chain_findings", obligations: ["revoke_candidate"] };
  return { allowed: true, reason: "release_204_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
