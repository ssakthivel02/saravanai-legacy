import type { DataIntegrationGate } from "./contracts";

export interface Release200Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateDataIntegrationGate(value: DataIntegrationGate): Release200Decision {
  if (value.decision === "no_go" || value.decision === "rejected") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  return { allowed: true, reason: "release_200_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
