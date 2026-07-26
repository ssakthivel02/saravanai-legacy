import type { GlobalDigitalTrustAssuranceGate } from "./contracts";

export interface Release490Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateGlobalDigitalTrustAssuranceGate(value: GlobalDigitalTrustAssuranceGate): Release490Decision {
  if ((value as any).decision === "no_go" || (value as any).decision === "fail") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  if ((value as any).approvedBy.length < 2) return { allowed: false, reason: "multi_party_approval_required", obligations: ["independent_approval"] };
  return { allowed: true, reason: "release_490_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
