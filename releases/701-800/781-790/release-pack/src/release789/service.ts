import type { EnterprisePerformanceAndTrustReporting } from "./contracts";
import { validateEnterprisePerformanceAndTrustReporting } from "./contracts";
import { evaluateEnterprisePerformanceAndTrustReporting } from "./policy";

export function assessRelease789(value: EnterprisePerformanceAndTrustReporting) {
  const validationErrors = validateEnterprisePerformanceAndTrustReporting(value);
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
    decision: evaluateEnterprisePerformanceAndTrustReporting(value)
  };
}
