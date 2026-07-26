import type { SafeguardProfile } from "./model";

export const RELEASE_083_CONTROL_RULES = ["unknown_age_uses_strict_default", "child_personalisation_restricted", "child_direct_messaging_denied", "guardian_consent_when_required", "vulnerability_requires_human_review"] as const;

export function validateSafeguardProfile(input: SafeguardProfile): string[] {
  const errors: string[] = [];
  if (!String(input.profileId ?? "").trim()) errors.push("profileId_required");
  return [...new Set(errors)];
}

export function release083Ready(input: SafeguardProfile): boolean {
  return validateSafeguardProfile(input).length === 0;
}
