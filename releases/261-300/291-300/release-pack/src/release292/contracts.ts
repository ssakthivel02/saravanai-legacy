export interface MarketplaceItem {
  itemId: string;
  publisher: string;
  version: string;
  permissions: string[];
  allowedHosts: string[];
  signatureRef: string;
  reviewEvidenceRefs: string[];
  status: 'draft' | 'approved' | 'revoked' | 'retired';
}

export const RELEASE_292_CONTROLS = ["publisher_required", "permission_minimisation", "egress_allowlist_required", "signature_required"] as const;

export function validateMarketplaceItem(value: MarketplaceItem): string[] {
  const errors: string[] = [];
  if (!value.itemId.trim()) errors.push("itemId_required");
  if (!value.publisher.trim()) errors.push("publisher_required");
  if (!value.version.trim()) errors.push("version_required");
  if (!value.permissions.length) errors.push("permissions_required");
  if (!value.allowedHosts.length) errors.push("allowedHosts_required");
  if (!value.signatureRef.trim()) errors.push("signatureRef_required");
  if (!value.reviewEvidenceRefs.length) errors.push("reviewEvidenceRefs_required");
  return [...new Set(errors)];
}
