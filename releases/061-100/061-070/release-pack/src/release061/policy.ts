import type { ModelRoutePolicy } from "./model";

export const RELEASE_061_CONTROL_RULES = ["policyId_required", "tenant_required", "provider_allowlist_required", "restricted_data_external_route_denied"] as const;

export function validateModelRoutePolicy(input: ModelRoutePolicy): string[] {
  const errors: string[] = [];
  if (!String(input.policyId ?? "").trim()) errors.push("policyId_required");
  if (!input.allowedProviders.length) errors.push("allowedProviders_required");
  if (input.enabled && errors.length) errors.push("enabled_resource_has_validation_errors");
  if (input.restrictedDataAllowed) errors.push("restricted_data_external_route_denied");
  return [...new Set(errors)];
}

export function release061Ready(input: ModelRoutePolicy): boolean {
  return validateModelRoutePolicy(input).length === 0;
}
