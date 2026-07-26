import type { AutomationValueAndControlMonitoring } from "./contracts";
import { validateAutomationValueAndControlMonitoring } from "./contracts";
import { evaluateAutomationValueAndControlMonitoring } from "./policy";

export function assessRelease679(value: AutomationValueAndControlMonitoring) {
  const validationErrors = validateAutomationValueAndControlMonitoring(value);
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
    decision: evaluateAutomationValueAndControlMonitoring(value)
  };
}
