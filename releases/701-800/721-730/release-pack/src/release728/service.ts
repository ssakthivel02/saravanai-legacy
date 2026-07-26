import type { ApplicationQualitySecurityAndAccessibilityTesting } from "./contracts";
import { validateApplicationQualitySecurityAndAccessibilityTesting } from "./contracts";
import { evaluateApplicationQualitySecurityAndAccessibilityTesting } from "./policy";

export function assessRelease728(value: ApplicationQualitySecurityAndAccessibilityTesting) {
  const validationErrors = validateApplicationQualitySecurityAndAccessibilityTesting(value);
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
    decision: evaluateApplicationQualitySecurityAndAccessibilityTesting(value)
  };
}
