import type { CodeReviewQualityAndPolicy } from "./contracts";
import { validateCodeReviewQualityAndPolicy } from "./contracts";
import { evaluateCodeReviewQualityAndPolicy } from "./policy";

export function assessRelease472(value: CodeReviewQualityAndPolicy) {
  const validationErrors = validateCodeReviewQualityAndPolicy(value);
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
    decision: evaluateCodeReviewQualityAndPolicy(value)
  };
}
