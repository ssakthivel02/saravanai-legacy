import type { ERPIntegrationAndTransactionGovernance } from "./contracts";
import { validateERPIntegrationAndTransactionGovernance } from "./contracts";
import { evaluateERPIntegrationAndTransactionGovernance } from "./policy";

export function assessRelease443(value: ERPIntegrationAndTransactionGovernance) {
  const validationErrors = validateERPIntegrationAndTransactionGovernance(value);
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
    decision: evaluateERPIntegrationAndTransactionGovernance(value)
  };
}
