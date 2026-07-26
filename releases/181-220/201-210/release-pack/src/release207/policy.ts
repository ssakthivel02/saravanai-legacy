import type { AbuseCase } from "./contracts";

export interface Release207Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateAbuseCase(value: AbuseCase): Release207Decision {
  if (value.riskScore >= 70) return { allowed: false, reason: "risk_threshold_exceeded", obligations: ["contain", "human_review"] };
  return { allowed: true, reason: "release_207_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
