export interface AccessibilityAssessment {
  assessmentId: string;
  releaseId: string;
  criteria: string[];
  failures: string[];
  manualReviewRequired: boolean;
  evidenceRefs: string[];
}

export const RELEASE_144_CONTROLS = ["wcag_intent_recorded", "manual_review_required", "blocking_failures_prevent_release"] as const;

export function validateAccessibilityAssessment(value: AccessibilityAssessment): string[] {
  const errors: string[] = [];
  if (!value.assessmentId.trim()) errors.push("assessmentId_required");
  if (!value.releaseId.trim()) errors.push("releaseId_required");
  if (!value.criteria.length) errors.push("criteria_required");
  if (!value.failures.length) errors.push("failures_required");
  if (!value.evidenceRefs.length) errors.push("evidenceRefs_required");
  return [...new Set(errors)];
}
