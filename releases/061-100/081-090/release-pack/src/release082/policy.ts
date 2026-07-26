import type { RegionalDataPolicy } from "./model";

export const RELEASE_082_CONTROL_RULES = ["region_required", "storage_region_required", "processing_region_required", "cross_region_transfer_mechanism_required", "legal_review_for_exception"] as const;

export function validateRegionalDataPolicy(input: RegionalDataPolicy): string[] {
  const errors: string[] = [];
  if (!String(input.policyId ?? "").trim()) errors.push("policyId_required");
  if (!input.allowedStorageRegions.length) errors.push("allowedStorageRegions_required");
  if (!input.allowedProcessingRegions.length) errors.push("allowedProcessingRegions_required");
  return [...new Set(errors)];
}

export function release082Ready(input: RegionalDataPolicy): boolean {
  return validateRegionalDataPolicy(input).length === 0;
}
