export interface CrisisInformationItem {
  itemId: string;
  region: string;
  title: string;
  sourceRefs: string[];
  verifiedAt: string;
  verifiedBy: string;
  correctionOf: string | undefined;
  status: 'draft' | 'verified' | 'withdrawn';
}

export const RELEASE_202_CONTROLS = ["source_verification_required", "timestamp_required", "verifier_required", "correction_supported"] as const;

export function validateCrisisInformationItem(value: CrisisInformationItem): string[] {
  const errors: string[] = [];
  if (!value.itemId.trim()) errors.push("itemId_required");
  if (!value.region.trim()) errors.push("region_required");
  if (!value.title.trim()) errors.push("title_required");
  if (!value.sourceRefs.length) errors.push("sourceRefs_required");
  if (!value.verifiedAt.trim()) errors.push("verifiedAt_required");
  if (!value.verifiedBy.trim()) errors.push("verifiedBy_required");
  return [...new Set(errors)];
}
