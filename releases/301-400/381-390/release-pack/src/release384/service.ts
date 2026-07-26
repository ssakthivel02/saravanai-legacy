import type { AccessibleContentAndAssistiveTechnologyTesting } from "./contracts";
import { validateAccessibleContentAndAssistiveTechnologyTesting } from "./contracts";
import { evaluateAccessibleContentAndAssistiveTechnologyTesting } from "./policy";

export function assessRelease384(value: AccessibleContentAndAssistiveTechnologyTesting) {
  const validationErrors = validateAccessibleContentAndAssistiveTechnologyTesting(value);
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
    decision: evaluateAccessibleContentAndAssistiveTechnologyTesting(value)
  };
}
