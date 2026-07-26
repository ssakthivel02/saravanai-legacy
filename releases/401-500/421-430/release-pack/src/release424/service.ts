import type { SecurityAnalyticsAndCorrelation } from "./contracts";
import { validateSecurityAnalyticsAndCorrelation } from "./contracts";
import { evaluateSecurityAnalyticsAndCorrelation } from "./policy";

export function assessRelease424(value: SecurityAnalyticsAndCorrelation) {
  const validationErrors = validateSecurityAnalyticsAndCorrelation(value);
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
    decision: evaluateSecurityAnalyticsAndCorrelation(value)
  };
}
