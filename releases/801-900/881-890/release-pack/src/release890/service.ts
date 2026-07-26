import type { EconomicsCapacityAndSustainabilityGate } from "./contracts";
import { validateEconomicsCapacityAndSustainabilityGate } from "./contracts";
import { evaluateEconomicsCapacityAndSustainabilityGate } from "./policy";

export function assessRelease890(value: EconomicsCapacityAndSustainabilityGate) {
  const validationErrors = validateEconomicsCapacityAndSustainabilityGate(value);
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
    decision: evaluateEconomicsCapacityAndSustainabilityGate(value)
  };
}
