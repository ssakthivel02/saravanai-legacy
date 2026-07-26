export interface ProductEntitlement {
  entitlementId: string;
  tenantId: string;
  productId: string;
  capabilities: string[];
  startsAt: string;
  endsAt: string | undefined;
  paidActivationAllowed: false;
}

export const RELEASE_151_CONTROLS = ["capability_scope_required", "expiry_supported", "paid_activation_forbidden"] as const;

export function validateProductEntitlement(value: ProductEntitlement): string[] {
  const errors: string[] = [];
  if (!value.entitlementId.trim()) errors.push("entitlementId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.productId.trim()) errors.push("productId_required");
  if (!value.capabilities.length) errors.push("capabilities_required");
  if (!value.startsAt.trim()) errors.push("startsAt_required");
  if (value.paidActivationAllowed !== false) errors.push("paidActivationAllowed_must_remain_false");
  return [...new Set(errors)];
}
