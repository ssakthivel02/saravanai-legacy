import type { RecoveryAndContinuitySimulation } from "./contracts";

export interface Release309Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateRecoveryAndContinuitySimulation(value: RecoveryAndContinuitySimulation): Release309Decision {
  if ((value as any).decision === "no_go" || (value as any).decision === "fail") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  if ((value as any).score < 0.7) return { allowed: false, reason: "assessment_threshold_not_met", obligations: ["remediate", "reassess"] };
  return { allowed: true, reason: "release_309_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
