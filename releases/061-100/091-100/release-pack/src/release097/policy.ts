import type { CarbonAwarePolicy } from "./model";

export const RELEASE_097_CONTROL_RULES = ["measurement_method_required", "delay_non_negative", "safety_override_always_available", "security_never_deferred", "cost_and_carbon_do_not_override_safety"] as const;

export function validateCarbonAwarePolicy(input: CarbonAwarePolicy): string[] {
  const errors: string[] = [];
  if (!String(input.policyId ?? "").trim()) errors.push("policyId_required");
  if (input.enabled && errors.length) errors.push("enabled_resource_has_validation_errors");
  return [...new Set(errors)];
}

export function release097Ready(input: CarbonAwarePolicy): boolean {
  return validateCarbonAwarePolicy(input).length === 0;
}
