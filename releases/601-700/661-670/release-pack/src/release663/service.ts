import type { SLOErrorBudgetAndReliabilityPolicy } from "./contracts";
import { validateSLOErrorBudgetAndReliabilityPolicy } from "./contracts";
import { evaluateSLOErrorBudgetAndReliabilityPolicy } from "./policy";

export function assessRelease663(value: SLOErrorBudgetAndReliabilityPolicy) {
  const validationErrors = validateSLOErrorBudgetAndReliabilityPolicy(value);
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
    decision: evaluateSLOErrorBudgetAndReliabilityPolicy(value)
  };
}
