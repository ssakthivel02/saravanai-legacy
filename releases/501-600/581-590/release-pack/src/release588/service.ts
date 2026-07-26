import type { RegionalLegalAndContentReview } from "./contracts";
import { validateRegionalLegalAndContentReview } from "./contracts";
import { evaluateRegionalLegalAndContentReview } from "./policy";

export function assessRelease588(value: RegionalLegalAndContentReview) {
  const validationErrors = validateRegionalLegalAndContentReview(value);
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
    decision: evaluateRegionalLegalAndContentReview(value)
  };
}
