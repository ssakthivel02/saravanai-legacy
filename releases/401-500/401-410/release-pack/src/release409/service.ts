import type { AIPortfolioValueAndRiskReporting } from "./contracts";
import { validateAIPortfolioValueAndRiskReporting } from "./contracts";
import { evaluateAIPortfolioValueAndRiskReporting } from "./policy";

export function assessRelease409(value: AIPortfolioValueAndRiskReporting) {
  const validationErrors = validateAIPortfolioValueAndRiskReporting(value);
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
    decision: evaluateAIPortfolioValueAndRiskReporting(value)
  };
}
