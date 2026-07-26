import type { PlatformExperienceAndAdoptionAnalytics } from "./contracts";
import { validatePlatformExperienceAndAdoptionAnalytics } from "./contracts";
import { evaluatePlatformExperienceAndAdoptionAnalytics } from "./policy";

export function assessRelease339(value: PlatformExperienceAndAdoptionAnalytics) {
  const validationErrors = validatePlatformExperienceAndAdoptionAnalytics(value);
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
    decision: evaluatePlatformExperienceAndAdoptionAnalytics(value)
  };
}
