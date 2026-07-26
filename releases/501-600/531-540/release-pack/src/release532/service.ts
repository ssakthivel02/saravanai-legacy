import type { RansomwareContainmentAndRecovery } from "./contracts";
import { validateRansomwareContainmentAndRecovery } from "./contracts";
import { evaluateRansomwareContainmentAndRecovery } from "./policy";

export function assessRelease532(value: RansomwareContainmentAndRecovery) {
  const validationErrors = validateRansomwareContainmentAndRecovery(value);
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
    decision: evaluateRansomwareContainmentAndRecovery(value)
  };
}
