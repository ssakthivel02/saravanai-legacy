export interface PreferenceRecord {
  preferenceId: string;
  tenantId: string;
  subject: string;
  key: string;
  value: string;
  consentBasis: string;
  expiresAt: string;
}

export const RELEASE_143_CONTROLS = ["consent_basis_required", "expiry_required", "sensitive_inference_forbidden"] as const;

export function validatePreferenceRecord(value: PreferenceRecord): string[] {
  const errors: string[] = [];
  if (!value.preferenceId.trim()) errors.push("preferenceId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.subject.trim()) errors.push("subject_required");
  if (!value.key.trim()) errors.push("key_required");
  if (!value.value.trim()) errors.push("value_required");
  if (!value.consentBasis.trim()) errors.push("consentBasis_required");
  if (!value.expiresAt.trim()) errors.push("expiresAt_required");
  return [...new Set(errors)];
}
