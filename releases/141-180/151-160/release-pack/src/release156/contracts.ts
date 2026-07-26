export interface ServiceRequest {
  requestId: string;
  tenantId: string;
  catalogueItemId: string;
  idempotencyKey: string;
  approvalId: string | undefined;
  writeAction: boolean;
}

export const RELEASE_156_CONTROLS = ["catalogue_item_required", "idempotency_required", "write_requires_approval"] as const;

export function validateServiceRequest(value: ServiceRequest): string[] {
  const errors: string[] = [];
  if (!value.requestId.trim()) errors.push("requestId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.catalogueItemId.trim()) errors.push("catalogueItemId_required");
  if (!value.idempotencyKey.trim()) errors.push("idempotencyKey_required");
  return [...new Set(errors)];
}
