import type { ProgressiveRollout } from "./model";

export const RELEASE_094_CONTROL_RULES = ["waves_required", "success_criteria_required", "abort_criteria_required", "rollback_required", "promotion_requires_evidence"] as const;

export function validateProgressiveRollout(input: ProgressiveRollout): string[] {
  const errors: string[] = [];
  if (!String(input.rolloutId ?? "").trim()) errors.push("rolloutId_required");
  if (!input.waves.length) errors.push("waves_required");
  if (!input.successCriteria.length) errors.push("successCriteria_required");
  if (!input.abortCriteria.length) errors.push("abortCriteria_required");
  return [...new Set(errors)];
}

export function release094Ready(input: ProgressiveRollout): boolean {
  return validateProgressiveRollout(input).length === 0;
}
