export interface FairnessAndAccessibilityEvaluation {
  assessmentId: string;
  tenantId: string;
  subjectId: string;
  owner: string;
  methodologyRef: string;
  score: number;
  findingIds: string[];
  evidenceRefs: string[];
  decision: 'pending' | 'pass' | 'conditional' | 'fail';
}

export const RELEASE_706_CONTROLS = ["owner_accountability_required", "evidence_integrity_required", "methodology_required", "findings_review_required", "protected_baseline_required", "accessibility_review_required"] as const;

export function validateFairnessAndAccessibilityEvaluation(value: FairnessAndAccessibilityEvaluation): string[] {
  const errors: string[] = [];
  if (!value.assessmentId.trim()) errors.push("assessmentId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.subjectId.trim()) errors.push("subjectId_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.methodologyRef.trim()) errors.push("methodologyRef_required");
  if (!Number.isFinite(value.score) || value.score < 0) errors.push("score_invalid");
  if (!value.findingIds.length) errors.push("findingIds_required");
  if (!value.evidenceRefs.length) errors.push("evidenceRefs_required");
  if (value.score > 1) errors.push("score_out_of_range");
  return [...new Set(errors)];
}
