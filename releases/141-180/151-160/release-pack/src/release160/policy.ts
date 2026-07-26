import type { ServiceAssuranceGate } from "./contracts";

export interface Release160Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateServiceAssuranceGate(value: ServiceAssuranceGate): Release160Decision {
  if (value.decision === "no_go" || value.decision === "rejected") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  return { allowed: true, reason: "release_160_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
