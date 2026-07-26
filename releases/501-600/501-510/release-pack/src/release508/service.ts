import type { BiasFairnessAndDistributionalReview } from "./contracts";
import { validateBiasFairnessAndDistributionalReview } from "./contracts";
import { evaluateBiasFairnessAndDistributionalReview } from "./policy";

export function assessRelease508(value: BiasFairnessAndDistributionalReview) {
  const validationErrors = validateBiasFairnessAndDistributionalReview(value);
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
    decision: evaluateBiasFairnessAndDistributionalReview(value)
  };
}
