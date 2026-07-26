export interface RegionalRiskProfile {
  profileId: string;
  region: string;
  owner: string;
  dependencyRefs: string[];
  riskFactors: string[];
  localReviewRequired: boolean;
  reviewedAt: string;
  status: 'normal' | 'elevated' | 'restricted';
}

export const RELEASE_201_CONTROLS = ["region_required", "dependencies_mapped", "local_review_recorded", "current_review_required"] as const;

export function validateRegionalRiskProfile(value: RegionalRiskProfile): string[] {
  const errors: string[] = [];
  if (!value.profileId.trim()) errors.push("profileId_required");
  if (!value.region.trim()) errors.push("region_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.dependencyRefs.length) errors.push("dependencyRefs_required");
  if (!value.riskFactors.length) errors.push("riskFactors_required");
  if (!value.reviewedAt.trim()) errors.push("reviewedAt_required");
  return [...new Set(errors)];
}
