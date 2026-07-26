import type { APIAndIntegrationFabricAssuranceGate } from "./contracts";

export interface Release530Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateAPIAndIntegrationFabricAssuranceGate(value: APIAndIntegrationFabricAssuranceGate): Release530Decision {
  if ((value as any).decision === "no_go" || (value as any).decision === "fail") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  if ((value as any).approvedBy.length < 2) return { allowed: false, reason: "multi_party_approval_required", obligations: ["independent_approval"] };
  return { allowed: true, reason: "release_530_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
