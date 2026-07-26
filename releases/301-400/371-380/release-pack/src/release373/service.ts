import type { DependencyFailureAndBulkheadEngineering } from "./contracts";
import { validateDependencyFailureAndBulkheadEngineering } from "./contracts";
import { evaluateDependencyFailureAndBulkheadEngineering } from "./policy";

export function assessRelease373(value: DependencyFailureAndBulkheadEngineering) {
  const validationErrors = validateDependencyFailureAndBulkheadEngineering(value);
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
    decision: evaluateDependencyFailureAndBulkheadEngineering(value)
  };
}
