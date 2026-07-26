import type { ArchitectureDebtAndModernisationPortfolio } from "./contracts";
import { validateArchitectureDebtAndModernisationPortfolio } from "./contracts";
import { evaluateArchitectureDebtAndModernisationPortfolio } from "./policy";

export function assessRelease392(value: ArchitectureDebtAndModernisationPortfolio) {
  const validationErrors = validateArchitectureDebtAndModernisationPortfolio(value);
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
    decision: evaluateArchitectureDebtAndModernisationPortfolio(value)
  };
}
