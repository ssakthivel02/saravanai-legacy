export interface DataProduct {
  productId: string;
  tenantId: string;
  owner: string;
  version: string;
  contractId: string;
  slaId: string;
  exportFormats: string[];
  status: 'draft' | 'active' | 'deprecated' | 'retired';
}

export const RELEASE_199_CONTROLS = ["owner_required", "contract_required", "sla_required", "portable_format_required"] as const;

export function validateDataProduct(value: DataProduct): string[] {
  const errors: string[] = [];
  if (!value.productId.trim()) errors.push("productId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.version.trim()) errors.push("version_required");
  if (!value.contractId.trim()) errors.push("contractId_required");
  if (!value.slaId.trim()) errors.push("slaId_required");
  if (!value.exportFormats.length) errors.push("exportFormats_required");
  return [...new Set(errors)];
}
