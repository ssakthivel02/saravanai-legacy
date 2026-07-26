import type { PolicyExceptionAndRiskAcceptanceV2 } from "./contracts";

export interface Release686Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluatePolicyExceptionAndRiskAcceptanceV2(value: PolicyExceptionAndRiskAcceptanceV2): Release686Decision {
  if ((value as any).decision === "no_go" || (value as any).decision === "fail") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  return { allowed: true, reason: "release_686_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
