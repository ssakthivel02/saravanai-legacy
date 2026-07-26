import type { DataIntelligenceAssuranceGate } from "./contracts";

export interface Release350Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateDataIntelligenceAssuranceGate(value: DataIntelligenceAssuranceGate): Release350Decision {
  if ((value as any).decision === "no_go" || (value as any).decision === "fail") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  if ((value as any).approvedBy.length < 2) return { allowed: false, reason: "multi_party_approval_required", obligations: ["independent_approval"] };
  return { allowed: true, reason: "release_350_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
