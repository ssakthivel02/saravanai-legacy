import type { CrisisAlertingAndNotification } from "./contracts";
import { validateCrisisAlertingAndNotification } from "./contracts";
import { evaluateCrisisAlertingAndNotification } from "./policy";

export function assessRelease562(value: CrisisAlertingAndNotification) {
  const validationErrors = validateCrisisAlertingAndNotification(value);
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
    decision: evaluateCrisisAlertingAndNotification(value)
  };
}
