import type { AccessibleComponentAndJourneyValidation } from "./contracts";
import { validateAccessibleComponentAndJourneyValidation } from "./contracts";
import { evaluateAccessibleComponentAndJourneyValidation } from "./policy";

export function assessRelease866(value: AccessibleComponentAndJourneyValidation) {
  const validationErrors = validateAccessibleComponentAndJourneyValidation(value);
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
    decision: evaluateAccessibleComponentAndJourneyValidation(value)
  };
}
