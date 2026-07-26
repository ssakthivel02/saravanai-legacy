import type { InvestmentPortfolioPrioritisation } from "./contracts";
import { validateInvestmentPortfolioPrioritisation } from "./contracts";
import { evaluateInvestmentPortfolioPrioritisation } from "./policy";

export function assessRelease574(value: InvestmentPortfolioPrioritisation) {
  const validationErrors = validateInvestmentPortfolioPrioritisation(value);
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
    decision: evaluateInvestmentPortfolioPrioritisation(value)
  };
}
