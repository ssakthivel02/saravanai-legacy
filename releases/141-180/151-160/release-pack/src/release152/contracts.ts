export interface ServicePlan {
  planId: string;
  name: string;
  quotaProfile: string;
  hardStopEnabled: boolean;
  paidUpgradeEnabled: false;
  fairUsePolicyId: string;
}

export const RELEASE_152_CONTROLS = ["quota_profile_required", "hard_stop_required", "paid_upgrade_disabled"] as const;

export function validateServicePlan(value: ServicePlan): string[] {
  const errors: string[] = [];
  if (!value.planId.trim()) errors.push("planId_required");
  if (!value.name.trim()) errors.push("name_required");
  if (!value.quotaProfile.trim()) errors.push("quotaProfile_required");
  if (!value.fairUsePolicyId.trim()) errors.push("fairUsePolicyId_required");
  if (value.paidUpgradeEnabled !== false) errors.push("paidUpgradeEnabled_must_remain_false");
  return [...new Set(errors)];
}
