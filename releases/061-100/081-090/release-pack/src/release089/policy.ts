import type { ThreatIndicator } from "./model";

export const RELEASE_089_CONTROL_RULES = ["indicator_type_required", "raw_secret_not_stored", "confidence_range", "expiry_required", "sharing_boundary_enforced"] as const;

export function validateThreatIndicator(input: ThreatIndicator): string[] {
  const errors: string[] = [];
  if (!String(input.indicatorId ?? "").trim()) errors.push("indicatorId_required");
  if (input.confidence < 0 || input.confidence > 1) errors.push("confidence_out_of_range");
  return [...new Set(errors)];
}

export function release089Ready(input: ThreatIndicator): boolean {
  return validateThreatIndicator(input).length === 0;
}
