export interface DeveloperProgramme {
  programmeId: string;
  owner: string;
  apiIds: string[];
  sdkIds: string[];
  scopeCatalogueId: string;
  securityContact: string;
  deprecationPolicyId: string;
  status: 'private' | 'preview' | 'public' | 'retired';
}

export const RELEASE_293_CONTROLS = ["owner_required", "apis_required", "security_contact_required", "deprecation_policy_required"] as const;

export function validateDeveloperProgramme(value: DeveloperProgramme): string[] {
  const errors: string[] = [];
  if (!value.programmeId.trim()) errors.push("programmeId_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.apiIds.length) errors.push("apiIds_required");
  if (!value.sdkIds.length) errors.push("sdkIds_required");
  if (!value.scopeCatalogueId.trim()) errors.push("scopeCatalogueId_required");
  if (!value.securityContact.trim()) errors.push("securityContact_required");
  if (!value.deprecationPolicyId.trim()) errors.push("deprecationPolicyId_required");
  return [...new Set(errors)];
}
