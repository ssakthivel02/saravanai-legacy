export interface RegionalTenantProfile {
  profileId: string;
  tenantId: string;
  regions: string[];
  dataBoundaryId: string;
  localeIds: string[];
  supportModelId: string;
  regionalOwners: string[];
  status: 'planned' | 'active' | 'restricted' | 'retired';
}

export const RELEASE_291_CONTROLS = ["regions_required", "data_boundary_required", "locales_required", "regional_owners_required"] as const;

export function validateRegionalTenantProfile(value: RegionalTenantProfile): string[] {
  const errors: string[] = [];
  if (!value.profileId.trim()) errors.push("profileId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.regions.length) errors.push("regions_required");
  if (!value.dataBoundaryId.trim()) errors.push("dataBoundaryId_required");
  if (!value.localeIds.length) errors.push("localeIds_required");
  if (!value.supportModelId.trim()) errors.push("supportModelId_required");
  if (!value.regionalOwners.length) errors.push("regionalOwners_required");
  return [...new Set(errors)];
}
