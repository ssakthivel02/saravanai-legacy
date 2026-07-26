import type { ServiceReviewAndSuccessPlanning } from "./contracts";
import { validateServiceReviewAndSuccessPlanning } from "./contracts";
import { evaluateServiceReviewAndSuccessPlanning } from "./policy";

export function assessRelease356(value: ServiceReviewAndSuccessPlanning) {
  const validationErrors = validateServiceReviewAndSuccessPlanning(value);
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
    decision: evaluateServiceReviewAndSuccessPlanning(value)
  };
}
