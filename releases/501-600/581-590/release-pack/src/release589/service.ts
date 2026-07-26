import type { GlobalExperienceQualityAnalytics } from "./contracts";
import { validateGlobalExperienceQualityAnalytics } from "./contracts";
import { evaluateGlobalExperienceQualityAnalytics } from "./policy";

export function assessRelease589(value: GlobalExperienceQualityAnalytics) {
  const validationErrors = validateGlobalExperienceQualityAnalytics(value);
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
    decision: evaluateGlobalExperienceQualityAnalytics(value)
  };
}
