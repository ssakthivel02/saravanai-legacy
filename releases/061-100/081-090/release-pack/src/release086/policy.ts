import type { AIImpactAssessment } from "./model";

export const RELEASE_086_CONTROL_RULES = ["intended_use_required", "affected_groups_required", "harm_analysis_required", "mitigations_required", "prohibited_use_denied", "high_risk_owner_approval"] as const;

export function validateAIImpactAssessment(input: AIImpactAssessment): string[] {
  const errors: string[] = [];
  if (!String(input.assessmentId ?? "").trim()) errors.push("assessmentId_required");
  if (!input.affectedGroups.length) errors.push("affectedGroups_required");
  if (!input.harms.length) errors.push("harms_required");
  if (!input.mitigations.length) errors.push("mitigations_required");
  if ((input as any).status === "approved" && !input.approvedBy) errors.push("approved_by_required");
  return [...new Set(errors)];
}

export function release086Ready(input: AIImpactAssessment): boolean {
  return validateAIImpactAssessment(input).length === 0;
}
