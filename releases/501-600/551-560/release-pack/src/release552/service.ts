import type { EmailAndCalendarAutomationSafety } from "./contracts";
import { validateEmailAndCalendarAutomationSafety } from "./contracts";
import { evaluateEmailAndCalendarAutomationSafety } from "./policy";

export function assessRelease552(value: EmailAndCalendarAutomationSafety) {
  const validationErrors = validateEmailAndCalendarAutomationSafety(value);
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
    decision: evaluateEmailAndCalendarAutomationSafety(value)
  };
}
