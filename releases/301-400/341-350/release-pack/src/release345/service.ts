import type { FederatedAnalyticsGovernance } from "./contracts";
import { validateFederatedAnalyticsGovernance } from "./contracts";
import { evaluateFederatedAnalyticsGovernance } from "./policy";

export function assessRelease345(value: FederatedAnalyticsGovernance) {
  const validationErrors = validateFederatedAnalyticsGovernance(value);
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
    decision: evaluateFederatedAnalyticsGovernance(value)
  };
}
