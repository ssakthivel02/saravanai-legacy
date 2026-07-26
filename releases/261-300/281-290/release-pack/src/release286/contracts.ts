export interface ModelRiskRecord {
  recordId: string;
  modelVersion: string;
  riskTier: 'low' | 'medium' | 'high' | 'critical';
  owner: string;
  limitationRefs: string[];
  evaluationEvidenceRefs: string[];
  approvedBy: string | undefined;
  status: 'draft' | 'approved' | 'restricted' | 'retired';
}

export const RELEASE_286_CONTROLS = ["risk_tier_required", "owner_required", "limitations_recorded", "evaluation_evidence_required"] as const;

export function validateModelRiskRecord(value: ModelRiskRecord): string[] {
  const errors: string[] = [];
  if (!value.recordId.trim()) errors.push("recordId_required");
  if (!value.modelVersion.trim()) errors.push("modelVersion_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.limitationRefs.length) errors.push("limitationRefs_required");
  if (!value.evaluationEvidenceRefs.length) errors.push("evaluationEvidenceRefs_required");
  return [...new Set(errors)];
}
