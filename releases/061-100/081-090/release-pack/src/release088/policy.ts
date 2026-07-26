import type { AbuseAssessment } from "./model";

export const RELEASE_088_CONTROL_RULES = ["signal_required", "risk_score_range", "high_risk_block_or_challenge", "appeal_for_material_decision", "human_review_for_false_positive"] as const;

export function validateAbuseAssessment(input: AbuseAssessment): string[] {
  const errors: string[] = [];
  if (!String(input.assessmentId ?? "").trim()) errors.push("assessmentId_required");
  if (input.riskScore < 0 || input.riskScore > 100) errors.push("riskScore_out_of_range");
  if (input.riskScore >= 80 && !(input as any).blocked && (input as any).decision !== "block") errors.push("high_risk_requires_block");
  return [...new Set(errors)];
}

export function release088Ready(input: AbuseAssessment): boolean {
  return validateAbuseAssessment(input).length === 0;
}
