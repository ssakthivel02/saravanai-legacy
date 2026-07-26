export interface UsageRecord {
  usageId: string;
  tenantId: string;
  metric: string;
  units: number;
  estimatedPence: number;
  occurredAt: string;
  billingEnabled: false;
}

export const RELEASE_157_CONTROLS = ["metric_required", "non_negative_usage", "billing_disabled"] as const;

export function validateUsageRecord(value: UsageRecord): string[] {
  const errors: string[] = [];
  if (!value.usageId.trim()) errors.push("usageId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.metric.trim()) errors.push("metric_required");
  if (!Number.isFinite(value.units) || value.units < 0) errors.push("units_invalid");
  if (!Number.isFinite(value.estimatedPence) || value.estimatedPence < 0) errors.push("estimatedPence_invalid");
  if (!value.occurredAt.trim()) errors.push("occurredAt_required");
  if (value.billingEnabled !== false) errors.push("billingEnabled_must_remain_false");
  return [...new Set(errors)];
}
