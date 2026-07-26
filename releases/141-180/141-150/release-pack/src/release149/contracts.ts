export interface LearningPath {
  pathId: string;
  role: string;
  modules: string[];
  assessmentRequired: boolean;
  trackingConsent: boolean;
  completionEvidenceRefs: string[];
}

export const RELEASE_149_CONTROLS = ["role_alignment_required", "consent_for_tracking", "assessment_evidence_required"] as const;

export function validateLearningPath(value: LearningPath): string[] {
  const errors: string[] = [];
  if (!value.pathId.trim()) errors.push("pathId_required");
  if (!value.role.trim()) errors.push("role_required");
  if (!value.modules.length) errors.push("modules_required");
  if (!value.completionEvidenceRefs.length) errors.push("completionEvidenceRefs_required");
  return [...new Set(errors)];
}
