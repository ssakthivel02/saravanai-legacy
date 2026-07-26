import type { HybridSearchAndRankingEvaluation } from "./contracts";

export interface Release625Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateHybridSearchAndRankingEvaluation(value: HybridSearchAndRankingEvaluation): Release625Decision {
  if ((value as any).decision === "no_go" || (value as any).decision === "fail") return { allowed: false, reason: "explicit_no_go", obligations: ["preserve_evidence"] };
  if ((value as any).score < 0.7) return { allowed: false, reason: "assessment_threshold_not_met", obligations: ["remediate", "reassess"] };
  return { allowed: true, reason: "release_625_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}
