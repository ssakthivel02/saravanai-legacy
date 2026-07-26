import type { AccessibilityPreferenceAndAdaptationRuntime } from "./contracts";
import { validateAccessibilityPreferenceAndAdaptationRuntime } from "./contracts";
import { evaluateAccessibilityPreferenceAndAdaptationRuntime } from "./policy";

export function assessRelease865(value: AccessibilityPreferenceAndAdaptationRuntime) {
  const validationErrors = validateAccessibilityPreferenceAndAdaptationRuntime(value);
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
    decision: evaluateAccessibilityPreferenceAndAdaptationRuntime(value)
  };
}
