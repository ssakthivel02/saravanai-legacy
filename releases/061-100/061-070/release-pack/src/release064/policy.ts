import type { VisionSafetyAssessment } from "./model";

export const RELEASE_064_CONTROL_RULES = ["risk_score_range", "child_safety_strict", "high_risk_requires_block", "reviewer_required_for_override"] as const;

export function validateVisionSafetyAssessment(input: VisionSafetyAssessment): string[] {
  const errors: string[] = [];
  if (!String(input.assessmentId ?? "").trim()) errors.push("assessmentId_required");
  if (input.riskScore < 0 || input.riskScore > 100) errors.push("riskScore_out_of_range");
  if (input.riskScore >= 80 && !(input as any).blocked && (input as any).decision !== "block") errors.push("high_risk_requires_block");
  return [...new Set(errors)];
}

export function release064Ready(input: VisionSafetyAssessment): boolean {
  return validateVisionSafetyAssessment(input).length === 0;
}
