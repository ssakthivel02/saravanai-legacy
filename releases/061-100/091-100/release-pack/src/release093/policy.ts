import type { VerificationSuite } from "./model";

export const RELEASE_093_CONTROL_RULES = ["scenarios_required", "security_checks_required", "tenant_isolation_required", "production_mutation_must_be_false", "minimum_pass_rate_range"] as const;

export function validateVerificationSuite(input: VerificationSuite): string[] {
  const errors: string[] = [];
  if (!String(input.suiteId ?? "").trim()) errors.push("suiteId_required");
  if (!input.scenarioIds.length) errors.push("scenarioIds_required");
  if (input.productionMutationAllowed !== false) errors.push("productionMutationAllowed_must_be_false");
  if (input.minimumPassRate < 0 || input.minimumPassRate > 100) errors.push("minimumPassRate_out_of_range");
  return [...new Set(errors)];
}

export function release093Ready(input: VerificationSuite): boolean {
  return validateVerificationSuite(input).length === 0;
}
