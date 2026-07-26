import type { EducationAndSafeguardingPattern } from "./contracts";
import { validateEducationAndSafeguardingPattern } from "./contracts";
import { evaluateEducationAndSafeguardingPattern } from "./policy";

export function assessRelease365(value: EducationAndSafeguardingPattern) {
  const validationErrors = validateEducationAndSafeguardingPattern(value);
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
    decision: evaluateEducationAndSafeguardingPattern(value)
  };
}
