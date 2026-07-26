export interface ThreatIntelligenceSourceGovernance {
  recordId: string;
  tenantId: string;
  name: string;
  owner: string;
  version: string;
  sourceRefs: string[];
  reviewAt: string;
  status: 'draft' | 'approved' | 'retired';
}

export const RELEASE_422_CONTROLS = ["owner_accountability_required", "evidence_integrity_required", "provenance_required", "lifecycle_governance_required", "threat_intelligence_handling_required"] as const;

export function validateThreatIntelligenceSourceGovernance(value: ThreatIntelligenceSourceGovernance): string[] {
  const errors: string[] = [];
  if (!value.recordId.trim()) errors.push("recordId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.name.trim()) errors.push("name_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.version.trim()) errors.push("version_required");
  if (!value.sourceRefs.length) errors.push("sourceRefs_required");
  if (!value.reviewAt.trim()) errors.push("reviewAt_required");
  return [...new Set(errors)];
}
