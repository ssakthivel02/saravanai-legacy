import type { PortfolioInvestmentAndCapacityPlanning } from "./contracts";
import { validatePortfolioInvestmentAndCapacityPlanning } from "./contracts";
import { evaluatePortfolioInvestmentAndCapacityPlanning } from "./policy";

export function assessRelease782(value: PortfolioInvestmentAndCapacityPlanning) {
  const validationErrors = validatePortfolioInvestmentAndCapacityPlanning(value);
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
    decision: evaluatePortfolioInvestmentAndCapacityPlanning(value)
  };
}
