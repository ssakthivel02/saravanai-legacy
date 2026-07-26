export interface DeveloperProgramme {
  programmeId: string;
  sdkRefs: string[];
  scopeCatalogue: string[];
  securityContact: string;
  codeOfConductRef: string;
  status: 'private' | 'preview' | 'public';
}

export const RELEASE_173_CONTROLS = ["security_contact_required", "scope_catalogue_required", "conduct_policy_required"] as const;

export function validateDeveloperProgramme(value: DeveloperProgramme): string[] {
  const errors: string[] = [];
  if (!value.programmeId.trim()) errors.push("programmeId_required");
  if (!value.sdkRefs.length) errors.push("sdkRefs_required");
  if (!value.scopeCatalogue.length) errors.push("scopeCatalogue_required");
  if (!value.securityContact.trim()) errors.push("securityContact_required");
  if (!value.codeOfConductRef.trim()) errors.push("codeOfConductRef_required");
  return [...new Set(errors)];
}
