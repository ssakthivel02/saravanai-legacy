import type { JurisdictionAndRegionalPolicyRegistry } from "./contracts";
import { validateJurisdictionAndRegionalPolicyRegistry } from "./contracts";
import { evaluateJurisdictionAndRegionalPolicyRegistry } from "./policy";

export function assessRelease861(value: JurisdictionAndRegionalPolicyRegistry) {
  const validationErrors = validateJurisdictionAndRegionalPolicyRegistry(value);
  if (validationErrors.length) {
    return {
      valid: false,
      validationErrors,
      decision: { allowed: false, reason: "validation_failed", obligations: ["correct_input"] }
    };
  }
  return {
    valid: true,
    validationErrors: [],
    decision: evaluateJurisdictionAndRegionalPolicyRegistry(value)
  };
}
