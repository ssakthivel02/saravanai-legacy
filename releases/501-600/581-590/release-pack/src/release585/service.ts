import type { CognitiveAccessibilityAndPlainLanguage } from "./contracts";
import { validateCognitiveAccessibilityAndPlainLanguage } from "./contracts";
import { evaluateCognitiveAccessibilityAndPlainLanguage } from "./policy";

export function assessRelease585(value: CognitiveAccessibilityAndPlainLanguage) {
  const validationErrors = validateCognitiveAccessibilityAndPlainLanguage(value);
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
    decision: evaluateCognitiveAccessibilityAndPlainLanguage(value)
  };
}
