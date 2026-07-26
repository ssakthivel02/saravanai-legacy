import type { DifferentialPrivacyBudgetManagement } from "./contracts";
import { validateDifferentialPrivacyBudgetManagement } from "./contracts";
import { evaluateDifferentialPrivacyBudgetManagement } from "./policy";

export function assessRelease344(value: DifferentialPrivacyBudgetManagement) {
  const validationErrors = validateDifferentialPrivacyBudgetManagement(value);
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
    decision: evaluateDifferentialPrivacyBudgetManagement(value)
  };
}
