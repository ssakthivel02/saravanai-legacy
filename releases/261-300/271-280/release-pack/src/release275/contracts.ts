export interface DiscoveryProfile {
  profileId: string;
  tenantId: string;
  indexRefs: string[];
  rankingPolicyId: string;
  accessFilterRequired: true;
  explanationAvailable: true;
  personalisationOptOutAvailable: true;
  status: 'draft' | 'approved' | 'retired';
}

export const RELEASE_275_CONTROLS = ["index_provenance_required", "access_filter_required", "explanation_required", "opt_out_required"] as const;

export function validateDiscoveryProfile(value: DiscoveryProfile): string[] {
  const errors: string[] = [];
  if (!value.profileId.trim()) errors.push("profileId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.indexRefs.length) errors.push("indexRefs_required");
  if (!value.rankingPolicyId.trim()) errors.push("rankingPolicyId_required");
  if (value.accessFilterRequired !== true) errors.push("accessFilterRequired_must_remain_true");
  if (value.explanationAvailable !== true) errors.push("explanationAvailable_must_remain_true");
  if (value.personalisationOptOutAvailable !== true) errors.push("personalisationOptOutAvailable_must_remain_true");
  return [...new Set(errors)];
}
