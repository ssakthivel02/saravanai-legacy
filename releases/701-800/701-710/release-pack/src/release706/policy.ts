import type { FairnessAndAccessibilityEvaluation } from "./contracts";

export interface Release706Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateFairnessAndAccessibilityEvaluation(value: FairnessAndAccessibilityEvaluation): Release706Decision {
  if ((value as any).decision === "no_go" || (value as any).decision === "fail") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  if ((value as any).score < 0.7) return { allowed: false, reason: "assessment_threshold_not_met", obligations: ["remediate", "reassess"] };
  return { allowed: true, reason: "release_706_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
