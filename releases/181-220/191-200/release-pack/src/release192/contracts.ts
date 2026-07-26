export interface MasterRecord {
  recordId: string;
  tenantId: string;
  entityType: string;
  canonicalIdentifier: string;
  sourceRefs: string[];
  steward: string;
  confidence: number;
  status: 'active' | 'merged' | 'retired';
}

export const RELEASE_192_CONTROLS = ["canonical_id_required", "source_provenance_required", "steward_required", "confidence_bounded"] as const;

export function validateMasterRecord(value: MasterRecord): string[] {
  const errors: string[] = [];
  if (!value.recordId.trim()) errors.push("recordId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.entityType.trim()) errors.push("entityType_required");
  if (!value.canonicalIdentifier.trim()) errors.push("canonicalIdentifier_required");
  if (!value.sourceRefs.length) errors.push("sourceRefs_required");
  if (!value.steward.trim()) errors.push("steward_required");
  if (!Number.isFinite(value.confidence) || value.confidence < 0) errors.push("confidence_invalid");
  if (value.confidence < 0 || value.confidence > 1) errors.push("confidence_out_of_range");
  return [...new Set(errors)];
}
