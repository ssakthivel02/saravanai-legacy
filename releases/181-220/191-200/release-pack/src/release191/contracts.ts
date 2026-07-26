export interface DataDomain {
  domainId: string;
  tenantId: string;
  name: string;
  owner: string;
  productIds: string[];
  policyIds: string[];
  qualityObjectiveIds: string[];
  status: 'active' | 'deprecated';
}

export const RELEASE_191_CONTROLS = ["domain_owner_required", "products_registered", "policies_required", "quality_objectives_required"] as const;

export function validateDataDomain(value: DataDomain): string[] {
  const errors: string[] = [];
  if (!value.domainId.trim()) errors.push("domainId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.name.trim()) errors.push("name_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.productIds.length) errors.push("productIds_required");
  if (!value.policyIds.length) errors.push("policyIds_required");
  if (!value.qualityObjectiveIds.length) errors.push("qualityObjectiveIds_required");
  return [...new Set(errors)];
}
