import type { MediaAccessibilityAndLocalisation } from "./contracts";
import { validateMediaAccessibilityAndLocalisation } from "./contracts";
import { evaluateMediaAccessibilityAndLocalisation } from "./policy";

export function assessRelease519(value: MediaAccessibilityAndLocalisation) {
  const validationErrors = validateMediaAccessibilityAndLocalisation(value);
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
    decision: evaluateMediaAccessibilityAndLocalisation(value)
  };
}
