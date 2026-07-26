export interface AiEfficiencyProfile {
  profileId: string;
  tenantId: string;
  latencyTargetMs: number;
  qualityFloor: number;
  monthlyBudgetPence: number;
  hardStopEnabled: true;
  paidProvidersEnabled: false;
  owner: string;
}

export const RELEASE_188_CONTROLS = ["quality_floor_required", "hard_budget_stop_required", "paid_providers_disabled", "owner_required"] as const;

export function validateAiEfficiencyProfile(value: AiEfficiencyProfile): string[] {
  const errors: string[] = [];
  if (!value.profileId.trim()) errors.push("profileId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!Number.isFinite(value.latencyTargetMs) || value.latencyTargetMs < 0) errors.push("latencyTargetMs_invalid");
  if (!Number.isFinite(value.qualityFloor) || value.qualityFloor < 0) errors.push("qualityFloor_invalid");
  if (!Number.isFinite(value.monthlyBudgetPence) || value.monthlyBudgetPence < 0) errors.push("monthlyBudgetPence_invalid");
  if (value.hardStopEnabled !== true) errors.push("hardStopEnabled_must_remain_true");
  if (value.paidProvidersEnabled !== false) errors.push("paidProvidersEnabled_must_remain_false");
  if (!value.owner.trim()) errors.push("owner_required");
  if (value.qualityFloor < 0 || value.qualityFloor > 1) errors.push("quality_floor_out_of_range");
  return [...new Set(errors)];
}
