import type { IdentityThreatSignal } from "./contracts";

export interface Release205Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateIdentityThreatSignal(value: IdentityThreatSignal): Release205Decision {
  if (value.riskScore >= 70) return { allowed: false, reason: "risk_threshold_exceeded", obligations: ["contain", "human_review"] };
  return { allowed: true, reason: "release_205_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
