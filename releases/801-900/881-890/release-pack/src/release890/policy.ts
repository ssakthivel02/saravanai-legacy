import type { EconomicsCapacityAndSustainabilityGate } from "./contracts";

export interface Release890Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateEconomicsCapacityAndSustainabilityGate(value: EconomicsCapacityAndSustainabilityGate): Release890Decision {
  if ((value as any).decision === "no_go" || (value as any).decision === "fail") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  if ((value as any).approvedBy.length < 2) return { allowed: false, reason: "multi_party_approval_required", obligations: ["independent_approval"] };
  return { allowed: true, reason: "release_890_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
