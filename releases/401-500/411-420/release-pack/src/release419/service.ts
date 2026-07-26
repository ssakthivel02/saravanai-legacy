import type { SovereignOperationsAndSupportReadiness } from "./contracts";
import { validateSovereignOperationsAndSupportReadiness } from "./contracts";
import { evaluateSovereignOperationsAndSupportReadiness } from "./policy";

export function assessRelease419(value: SovereignOperationsAndSupportReadiness) {
  const validationErrors = validateSovereignOperationsAndSupportReadiness(value);
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
    decision: evaluateSovereignOperationsAndSupportReadiness(value)
  };
}
