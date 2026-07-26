import type { BusinessProcessTwin } from "./contracts";
import { validateBusinessProcessTwin } from "./contracts";
import { evaluateBusinessProcessTwin } from "./policy";

export function assessRelease303(value: BusinessProcessTwin) {
  const validationErrors = validateBusinessProcessTwin(value);
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
    decision: evaluateBusinessProcessTwin(value)
  };
}
