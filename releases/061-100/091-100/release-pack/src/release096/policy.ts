import type { CapacityProfile } from "./model";

export const RELEASE_096_CONTROL_RULES = ["maximum_above_expected", "headroom_range", "latency_target_positive", "saturation_range", "recent_load_test_required"] as const;

export function validateCapacityProfile(input: CapacityProfile): string[] {
  const errors: string[] = [];
  if (!String(input.profileId ?? "").trim()) errors.push("profileId_required");
  if (input.headroomPercent < 0 || input.headroomPercent > 100) errors.push("headroomPercent_out_of_range");
  if (input.saturationThreshold < 0 || input.saturationThreshold > 100) errors.push("saturationThreshold_out_of_range");
  return [...new Set(errors)];
}

export function release096Ready(input: CapacityProfile): boolean {
  return validateCapacityProfile(input).length === 0;
}
