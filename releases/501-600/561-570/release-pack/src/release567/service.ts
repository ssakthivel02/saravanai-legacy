import type { EssentialServiceContinuity } from "./contracts";
import { validateEssentialServiceContinuity } from "./contracts";
import { evaluateEssentialServiceContinuity } from "./policy";

export function assessRelease567(value: EssentialServiceContinuity) {
  const validationErrors = validateEssentialServiceContinuity(value);
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
    decision: evaluateEssentialServiceContinuity(value)
  };
}
