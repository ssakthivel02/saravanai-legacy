import type { InferenceCacheAndPrivacyBoundary } from "./contracts";
import { validateInferenceCacheAndPrivacyBoundary } from "./contracts";
import { evaluateInferenceCacheAndPrivacyBoundary } from "./policy";

export function assessRelease608(value: InferenceCacheAndPrivacyBoundary) {
  const validationErrors = validateInferenceCacheAndPrivacyBoundary(value);
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
    decision: evaluateInferenceCacheAndPrivacyBoundary(value)
  };
}
