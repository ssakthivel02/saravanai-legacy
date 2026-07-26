export interface ScaleReadinessRecord {
  recordId: string;
  serviceIds: string[];
  performanceEvidenceRefs: string[];
  capacityEvidenceRefs: string[];
  reliabilityEvidenceRefs: string[];
  costEvidenceRefs: string[];
  certificationClaimed: false;
  status: 'draft' | 'reviewed' | 'approved';
}

export const RELEASE_298_CONTROLS = ["services_required", "performance_evidence_required", "reliability_evidence_required", "certification_not_claimed"] as const;

export function validateScaleReadinessRecord(value: ScaleReadinessRecord): string[] {
  const errors: string[] = [];
  if (!value.recordId.trim()) errors.push("recordId_required");
  if (!value.serviceIds.length) errors.push("serviceIds_required");
  if (!value.performanceEvidenceRefs.length) errors.push("performanceEvidenceRefs_required");
  if (!value.capacityEvidenceRefs.length) errors.push("capacityEvidenceRefs_required");
  if (!value.reliabilityEvidenceRefs.length) errors.push("reliabilityEvidenceRefs_required");
  if (!value.costEvidenceRefs.length) errors.push("costEvidenceRefs_required");
  if (value.certificationClaimed !== false) errors.push("certificationClaimed_must_remain_false");
  return [...new Set(errors)];
}
