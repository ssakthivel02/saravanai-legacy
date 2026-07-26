import type { SecureCodeGenerationAndReview } from "./contracts";
import { validateSecureCodeGenerationAndReview } from "./contracts";
import { evaluateSecureCodeGenerationAndReview } from "./policy";

export function assessRelease652(value: SecureCodeGenerationAndReview) {
  const validationErrors = validateSecureCodeGenerationAndReview(value);
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
    decision: evaluateSecureCodeGenerationAndReview(value)
  };
}
