import type { MediaQualityAndBrandCompliance } from "./contracts";
import { validateMediaQualityAndBrandCompliance } from "./contracts";
import { evaluateMediaQualityAndBrandCompliance } from "./policy";

export function assessRelease646(value: MediaQualityAndBrandCompliance) {
  const validationErrors = validateMediaQualityAndBrandCompliance(value);
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
    decision: evaluateMediaQualityAndBrandCompliance(value)
  };
}
