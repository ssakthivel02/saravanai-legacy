import type { TrustComplianceGate } from "./contracts";

export interface Release290Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateTrustComplianceGate(value: TrustComplianceGate): Release290Decision {
  if (value.decision === "no_go" || value.decision === "rejected") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  return { allowed: true, reason: "release_290_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
