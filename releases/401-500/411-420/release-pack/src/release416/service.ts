import type { ConstrainedComputeOptimisation } from "./contracts";
import { validateConstrainedComputeOptimisation } from "./contracts";
import { evaluateConstrainedComputeOptimisation } from "./policy";

export function assessRelease416(value: ConstrainedComputeOptimisation) {
  const validationErrors = validateConstrainedComputeOptimisation(value);
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
    decision: evaluateConstrainedComputeOptimisation(value)
  };
}
