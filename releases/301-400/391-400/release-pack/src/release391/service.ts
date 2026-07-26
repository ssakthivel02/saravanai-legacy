import type { EnterprisePortfolioAndBenefitsRealisation } from "./contracts";
import { validateEnterprisePortfolioAndBenefitsRealisation } from "./contracts";
import { evaluateEnterprisePortfolioAndBenefitsRealisation } from "./policy";

export function assessRelease391(value: EnterprisePortfolioAndBenefitsRealisation) {
  const validationErrors = validateEnterprisePortfolioAndBenefitsRealisation(value);
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
    decision: evaluateEnterprisePortfolioAndBenefitsRealisation(value)
  };
}
