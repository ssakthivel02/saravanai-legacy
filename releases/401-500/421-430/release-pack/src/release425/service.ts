import type { AutomatedContainmentSafety } from "./contracts";
import { validateAutomatedContainmentSafety } from "./contracts";
import { evaluateAutomatedContainmentSafety } from "./policy";

export function assessRelease425(value: AutomatedContainmentSafety) {
  const validationErrors = validateAutomatedContainmentSafety(value);
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
    decision: evaluateAutomatedContainmentSafety(value)
  };
}
