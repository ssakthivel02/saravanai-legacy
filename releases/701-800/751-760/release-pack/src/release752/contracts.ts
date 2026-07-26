export interface OTNetworkZoneAndConduitModel {
  recordId: string;
  tenantId: string;
  name: string;
  owner: string;
  version: string;
  sourceRefs: string[];
  reviewAt: string;
  status: 'draft' | 'approved' | 'retired';
}

export const RELEASE_752_CONTROLS = ["owner_accountability_required", "evidence_integrity_required", "provenance_required", "lifecycle_governance_required", "ot_safety_boundary_required"] as const;

export function validateOTNetworkZoneAndConduitModel(value: OTNetworkZoneAndConduitModel): string[] {
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
