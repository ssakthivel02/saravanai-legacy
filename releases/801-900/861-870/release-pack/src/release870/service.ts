import type { GlobalRegionalAndAccessibilityActivationGate } from "./contracts";
import { validateGlobalRegionalAndAccessibilityActivationGate } from "./contracts";
import { evaluateGlobalRegionalAndAccessibilityActivationGate } from "./policy";

export function assessRelease870(value: GlobalRegionalAndAccessibilityActivationGate) {
  const validationErrors = validateGlobalRegionalAndAccessibilityActivationGate(value);
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
    decision: evaluateGlobalRegionalAndAccessibilityActivationGate(value)
  };
}
