import type { ModelRoutingAndSelectionPolicy } from "./contracts";
import { validateModelRoutingAndSelectionPolicy } from "./contracts";
import { evaluateModelRoutingAndSelectionPolicy } from "./policy";

export function assessRelease402(value: ModelRoutingAndSelectionPolicy) {
  const validationErrors = validateModelRoutingAndSelectionPolicy(value);
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
    decision: evaluateModelRoutingAndSelectionPolicy(value)
  };
}
