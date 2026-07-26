import type { CryptographicAgilityAssuranceGate } from "./contracts";

export interface Release330Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateCryptographicAgilityAssuranceGate(value: CryptographicAgilityAssuranceGate): Release330Decision {
  if ((value as any).decision === "no_go" || (value as any).decision === "fail") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  if ((value as any).approvedBy.length < 2) return { allowed: false, reason: "multi_party_approval_required", obligations: ["independent_approval"] };
  return { allowed: true, reason: "release_330_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
