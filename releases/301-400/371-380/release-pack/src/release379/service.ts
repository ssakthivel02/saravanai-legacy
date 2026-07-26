import type { SustainabilityAndCapacityTradeOffGovernance } from "./contracts";
import { validateSustainabilityAndCapacityTradeOffGovernance } from "./contracts";
import { evaluateSustainabilityAndCapacityTradeOffGovernance } from "./policy";

export function assessRelease379(value: SustainabilityAndCapacityTradeOffGovernance) {
  const validationErrors = validateSustainabilityAndCapacityTradeOffGovernance(value);
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
    decision: evaluateSustainabilityAndCapacityTradeOffGovernance(value)
  };
}
