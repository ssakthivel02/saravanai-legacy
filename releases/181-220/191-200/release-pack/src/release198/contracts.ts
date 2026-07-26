export interface DiscoveryMatter {
  matterId: string;
  tenantId: string;
  custodians: string[];
  recordTypes: string[];
  legalHoldRefs: string[];
  evidenceRefs: string[];
  owner: string;
  status: 'open' | 'review' | 'closed';
}

export const RELEASE_198_CONTROLS = ["custodians_required", "hold_respected", "chain_of_custody_required", "owner_required"] as const;

export function validateDiscoveryMatter(value: DiscoveryMatter): string[] {
  const errors: string[] = [];
  if (!value.matterId.trim()) errors.push("matterId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.custodians.length) errors.push("custodians_required");
  if (!value.recordTypes.length) errors.push("recordTypes_required");
  if (!value.legalHoldRefs.length) errors.push("legalHoldRefs_required");
  if (!value.evidenceRefs.length) errors.push("evidenceRefs_required");
  if (!value.owner.trim()) errors.push("owner_required");
  return [...new Set(errors)];
}
