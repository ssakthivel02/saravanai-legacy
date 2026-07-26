import type { ConfidentialComputingReadiness } from "./contracts";
import { validateConfidentialComputingReadiness } from "./contracts";
import { evaluateConfidentialComputingReadiness } from "./policy";

export function assessRelease324(value: ConfidentialComputingReadiness) {
  const validationErrors = validateConfidentialComputingReadiness(value);
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
    decision: evaluateConfidentialComputingReadiness(value)
  };
}
