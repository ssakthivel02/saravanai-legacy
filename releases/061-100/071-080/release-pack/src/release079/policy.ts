import type { SupplierAssessment } from "./model";

export const RELEASE_079_CONTROL_RULES = ["supplier_required", "score_range", "critical_supplier_due_diligence", "high_findings_block_approval", "conditional_decision_requires_treatment_plan"] as const;

export function validateSupplierAssessment(input: SupplierAssessment): string[] {
  const errors: string[] = [];
  if (!String(input.assessmentId ?? "").trim()) errors.push("assessmentId_required");
  if (input.securityScore < 0 || input.securityScore > 100) errors.push("securityScore_out_of_range");
  if (input.privacyScore < 0 || input.privacyScore > 100) errors.push("privacyScore_out_of_range");
  if (input.resilienceScore < 0 || input.resilienceScore > 100) errors.push("resilienceScore_out_of_range");
  return [...new Set(errors)];
}

export function release079Ready(input: SupplierAssessment): boolean {
  return validateSupplierAssessment(input).length === 0;
}
