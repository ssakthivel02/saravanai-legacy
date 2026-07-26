import type { EnterpriseRiskAggregationAndStressTesting } from "./contracts";
import { validateEnterpriseRiskAggregationAndStressTesting } from "./contracts";
import { evaluateEnterpriseRiskAggregationAndStressTesting } from "./policy";

export function assessRelease396(value: EnterpriseRiskAggregationAndStressTesting) {
  const validationErrors = validateEnterpriseRiskAggregationAndStressTesting(value);
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
    decision: evaluateEnterpriseRiskAggregationAndStressTesting(value)
  };
}
