export interface AnalyticsPolicy {
  policyId: string;
  tenantId: string;
  purpose: string;
  minimumGroupSize: number;
  directIdentifiersAllowed: false;
  reidentificationAllowed: false;
  retentionDays: number;
  approvedBy: string | undefined;
}

export const RELEASE_196_CONTROLS = ["purpose_required", "minimum_group_required", "identifiers_forbidden", "reidentification_forbidden"] as const;

export function validateAnalyticsPolicy(value: AnalyticsPolicy): string[] {
  const errors: string[] = [];
  if (!value.policyId.trim()) errors.push("policyId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.purpose.trim()) errors.push("purpose_required");
  if (!Number.isFinite(value.minimumGroupSize) || value.minimumGroupSize < 0) errors.push("minimumGroupSize_invalid");
  if (value.directIdentifiersAllowed !== false) errors.push("directIdentifiersAllowed_must_remain_false");
  if (value.reidentificationAllowed !== false) errors.push("reidentificationAllowed_must_remain_false");
  if (!Number.isFinite(value.retentionDays) || value.retentionDays < 0) errors.push("retentionDays_invalid");
  if (value.minimumGroupSize < 5) errors.push("minimum_group_size_too_small");
  return [...new Set(errors)];
}
