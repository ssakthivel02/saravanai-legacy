export interface LicenceRecord {
  recordId: string;
  assetRef: string;
  licence: string;
  attributionRequired: boolean;
  sourceRefs: string[];
  usageRestrictions: string[];
}

export const RELEASE_178_CONTROLS = ["licence_required", "source_provenance_required", "restrictions_recorded"] as const;

export function validateLicenceRecord(value: LicenceRecord): string[] {
  const errors: string[] = [];
  if (!value.recordId.trim()) errors.push("recordId_required");
  if (!value.assetRef.trim()) errors.push("assetRef_required");
  if (!value.licence.trim()) errors.push("licence_required");
  if (!value.sourceRefs.length) errors.push("sourceRefs_required");
  if (!value.usageRestrictions.length) errors.push("usageRestrictions_required");
  return [...new Set(errors)];
}
