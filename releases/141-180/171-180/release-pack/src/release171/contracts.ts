export interface InteroperabilityProfile {
  profileId: string;
  standards: string[];
  versions: string[];
  compatibilityTests: string[];
  fallbackFormats: string[];
  owner: string;
}

export const RELEASE_171_CONTROLS = ["standards_required", "compatibility_tests_required", "fallback_required"] as const;

export function validateInteroperabilityProfile(value: InteroperabilityProfile): string[] {
  const errors: string[] = [];
  if (!value.profileId.trim()) errors.push("profileId_required");
  if (!value.standards.length) errors.push("standards_required");
  if (!value.versions.length) errors.push("versions_required");
  if (!value.compatibilityTests.length) errors.push("compatibilityTests_required");
  if (!value.fallbackFormats.length) errors.push("fallbackFormats_required");
  if (!value.owner.trim()) errors.push("owner_required");
  return [...new Set(errors)];
}
