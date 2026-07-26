export interface GeneratedContent {
  contentId: string;
  tenantId: string;
  mediaType: 'text' | 'image' | 'audio' | 'video';
  sourceRefs: string[];
  syntheticDisclosureRequired: true;
  consentEvidenceRefs: string[];
  safetyReviewId: string;
  status: 'draft' | 'approved' | 'rejected' | 'withdrawn';
}

export const RELEASE_273_CONTROLS = ["source_provenance_required", "synthetic_disclosure_required", "consent_evidence_required", "safety_review_required"] as const;

export function validateGeneratedContent(value: GeneratedContent): string[] {
  const errors: string[] = [];
  if (!value.contentId.trim()) errors.push("contentId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.sourceRefs.length) errors.push("sourceRefs_required");
  if (value.syntheticDisclosureRequired !== true) errors.push("syntheticDisclosureRequired_must_remain_true");
  if (!value.consentEvidenceRefs.length) errors.push("consentEvidenceRefs_required");
  if (!value.safetyReviewId.trim()) errors.push("safetyReviewId_required");
  return [...new Set(errors)];
}
