import type { RetrievalAccessFilterEnforcement } from "./contracts";
import { validateRetrievalAccessFilterEnforcement } from "./contracts";
import { evaluateRetrievalAccessFilterEnforcement } from "./policy";

export function assessRelease624(value: RetrievalAccessFilterEnforcement) {
  const validationErrors = validateRetrievalAccessFilterEnforcement(value);
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
    decision: evaluateRetrievalAccessFilterEnforcement(value)
  };
}
