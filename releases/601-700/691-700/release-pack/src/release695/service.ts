import type { GlobalOperationsAndFollowTheSunReadiness } from "./contracts";
import { validateGlobalOperationsAndFollowTheSunReadiness } from "./contracts";
import { evaluateGlobalOperationsAndFollowTheSunReadiness } from "./policy";

export function assessRelease695(value: GlobalOperationsAndFollowTheSunReadiness) {
  const validationErrors = validateGlobalOperationsAndFollowTheSunReadiness(value);
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
    decision: evaluateGlobalOperationsAndFollowTheSunReadiness(value)
  };
}
