import type { DataAccessProductisation } from "./contracts";
import { validateDataAccessProductisation } from "./contracts";
import { evaluateDataAccessProductisation } from "./policy";

export function assessRelease436(value: DataAccessProductisation) {
  const validationErrors = validateDataAccessProductisation(value);
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
    decision: evaluateDataAccessProductisation(value)
  };
}
