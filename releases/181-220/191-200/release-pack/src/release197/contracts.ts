export interface DataSharingAgreement {
  agreementId: string;
  providerTenantId: string;
  consumerTenantId: string;
  purpose: string;
  allowedFields: string[];
  allowedQueries: string[];
  expiresAt: string;
  approvedBy: string | undefined;
}

export const RELEASE_197_CONTROLS = ["provider_consumer_distinct", "purpose_required", "field_allowlist_required", "expiry_required"] as const;

export function validateDataSharingAgreement(value: DataSharingAgreement): string[] {
  const errors: string[] = [];
  if (!value.agreementId.trim()) errors.push("agreementId_required");
  if (!value.providerTenantId.trim()) errors.push("providerTenantId_required");
  if (!value.consumerTenantId.trim()) errors.push("consumerTenantId_required");
  if (!value.purpose.trim()) errors.push("purpose_required");
  if (!value.allowedFields.length) errors.push("allowedFields_required");
  if (!value.allowedQueries.length) errors.push("allowedQueries_required");
  if (!value.expiresAt.trim()) errors.push("expiresAt_required");
  if (value.providerTenantId === value.consumerTenantId) errors.push("provider_consumer_must_differ");
  return [...new Set(errors)];
}
