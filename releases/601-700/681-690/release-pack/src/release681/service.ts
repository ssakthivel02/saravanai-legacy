import type { ObligationAndControlRequirementRegistry } from "./contracts";
import { validateObligationAndControlRequirementRegistry } from "./contracts";
import { evaluateObligationAndControlRequirementRegistry } from "./policy";

export function assessRelease681(value: ObligationAndControlRequirementRegistry) {
  const validationErrors = validateObligationAndControlRequirementRegistry(value);
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
    decision: evaluateObligationAndControlRequirementRegistry(value)
  };
}
