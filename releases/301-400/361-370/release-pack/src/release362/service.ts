import type { HealthcareClinicalBoundaryPattern } from "./contracts";
import { validateHealthcareClinicalBoundaryPattern } from "./contracts";
import { evaluateHealthcareClinicalBoundaryPattern } from "./policy";

export function assessRelease362(value: HealthcareClinicalBoundaryPattern) {
  const validationErrors = validateHealthcareClinicalBoundaryPattern(value);
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
    decision: evaluateHealthcareClinicalBoundaryPattern(value)
  };
}
