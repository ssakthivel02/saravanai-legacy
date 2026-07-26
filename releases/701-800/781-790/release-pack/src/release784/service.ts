import type { EnterpriseRiskAndOpportunityPortfolio } from "./contracts";
import { validateEnterpriseRiskAndOpportunityPortfolio } from "./contracts";
import { evaluateEnterpriseRiskAndOpportunityPortfolio } from "./policy";

export function assessRelease784(value: EnterpriseRiskAndOpportunityPortfolio) {
  const validationErrors = validateEnterpriseRiskAndOpportunityPortfolio(value);
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
    decision: evaluateEnterpriseRiskAndOpportunityPortfolio(value)
  };
}
