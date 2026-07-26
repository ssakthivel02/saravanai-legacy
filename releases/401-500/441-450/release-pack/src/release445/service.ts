import type { HRAndWorkforceSystemIntegration } from "./contracts";
import { validateHRAndWorkforceSystemIntegration } from "./contracts";
import { evaluateHRAndWorkforceSystemIntegration } from "./policy";

export function assessRelease445(value: HRAndWorkforceSystemIntegration) {
  const validationErrors = validateHRAndWorkforceSystemIntegration(value);
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
    decision: evaluateHRAndWorkforceSystemIntegration(value)
  };
}
