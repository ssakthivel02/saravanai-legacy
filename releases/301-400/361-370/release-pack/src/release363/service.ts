import type { FinancialServicesConductPattern } from "./contracts";
import { validateFinancialServicesConductPattern } from "./contracts";
import { evaluateFinancialServicesConductPattern } from "./policy";

export function assessRelease363(value: FinancialServicesConductPattern) {
  const validationErrors = validateFinancialServicesConductPattern(value);
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
    decision: evaluateFinancialServicesConductPattern(value)
  };
}
