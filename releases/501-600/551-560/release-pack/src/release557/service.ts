import type { OfficeProcessAnalyticsWithoutSurveillance } from "./contracts";
import { validateOfficeProcessAnalyticsWithoutSurveillance } from "./contracts";
import { evaluateOfficeProcessAnalyticsWithoutSurveillance } from "./policy";

export function assessRelease557(value: OfficeProcessAnalyticsWithoutSurveillance) {
  const validationErrors = validateOfficeProcessAnalyticsWithoutSurveillance(value);
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
    decision: evaluateOfficeProcessAnalyticsWithoutSurveillance(value)
  };
}
