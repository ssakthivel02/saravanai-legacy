export interface EnvironmentRequest {
  environmentId: string;
  tenantId: string;
  blueprintId: string;
  region: string;
  expiresAt: string;
  approvalId: string | undefined;
}

export const RELEASE_163_CONTROLS = ["blueprint_required", "expiry_required", "approval_required"] as const;

export function validateEnvironmentRequest(value: EnvironmentRequest): string[] {
  const errors: string[] = [];
  if (!value.environmentId.trim()) errors.push("environmentId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.blueprintId.trim()) errors.push("blueprintId_required");
  if (!value.region.trim()) errors.push("region_required");
  if (!value.expiresAt.trim()) errors.push("expiresAt_required");
  return [...new Set(errors)];
}
