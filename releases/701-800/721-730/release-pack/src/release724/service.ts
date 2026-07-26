import type { MobileAndProgressiveWebExperience } from "./contracts";
import { validateMobileAndProgressiveWebExperience } from "./contracts";
import { evaluateMobileAndProgressiveWebExperience } from "./policy";

export function assessRelease724(value: MobileAndProgressiveWebExperience) {
  const validationErrors = validateMobileAndProgressiveWebExperience(value);
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
    decision: evaluateMobileAndProgressiveWebExperience(value)
  };
}
