import type { DecisionProblemRegistry } from "./contracts";
import { validateDecisionProblemRegistry } from "./contracts";
import { evaluateDecisionProblemRegistry } from "./policy";

export function assessRelease501(value: DecisionProblemRegistry) {
  const validationErrors = validateDecisionProblemRegistry(value);
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
    decision: evaluateDecisionProblemRegistry(value)
  };
}
