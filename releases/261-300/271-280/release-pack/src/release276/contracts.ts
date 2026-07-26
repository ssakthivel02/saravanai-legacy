export interface LearningProgramme {
  programmeId: string;
  owner: string;
  audience: string;
  moduleIds: string[];
  assessmentIds: string[];
  accessibilityEvidenceRefs: string[];
  accreditationClaimed: false;
  status: 'draft' | 'active' | 'retired';
}

export const RELEASE_276_CONTROLS = ["owner_required", "modules_required", "accessibility_evidence_required", "accreditation_not_claimed"] as const;

export function validateLearningProgramme(value: LearningProgramme): string[] {
  const errors: string[] = [];
  if (!value.programmeId.trim()) errors.push("programmeId_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.audience.trim()) errors.push("audience_required");
  if (!value.moduleIds.length) errors.push("moduleIds_required");
  if (!value.assessmentIds.length) errors.push("assessmentIds_required");
  if (!value.accessibilityEvidenceRefs.length) errors.push("accessibilityEvidenceRefs_required");
  if (value.accreditationClaimed !== false) errors.push("accreditationClaimed_must_remain_false");
  return [...new Set(errors)];
}
