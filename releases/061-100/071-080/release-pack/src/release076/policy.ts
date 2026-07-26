import type { LearningPath } from "./model";

export const RELEASE_076_CONTROL_RULES = ["competencies_required", "modules_required", "assessment_integrity", "accessibility_review_required", "certification_claim_must_be_false"] as const;

export function validateLearningPath(input: LearningPath): string[] {
  const errors: string[] = [];
  if (!String(input.pathId ?? "").trim()) errors.push("pathId_required");
  if (input.certificationClaim !== false) errors.push("certificationClaim_must_be_false");
  if (input.certificationClaim !== false) errors.push("unsupported_certification_claim");
  return [...new Set(errors)];
}

export function release076Ready(input: LearningPath): boolean {
  return validateLearningPath(input).length === 0;
}
