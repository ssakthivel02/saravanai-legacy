import type { DecisionOutcomeMonitoring } from "./contracts";
import { validateDecisionOutcomeMonitoring } from "./contracts";
import { evaluateDecisionOutcomeMonitoring } from "./policy";

export function assessRelease507(value: DecisionOutcomeMonitoring) {
  const validationErrors = validateDecisionOutcomeMonitoring(value);
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
    decision: evaluateDecisionOutcomeMonitoring(value)
  };
}
