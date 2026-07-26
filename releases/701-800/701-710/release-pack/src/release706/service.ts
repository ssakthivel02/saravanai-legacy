import type { FairnessAndAccessibilityEvaluation } from "./contracts";
import { validateFairnessAndAccessibilityEvaluation } from "./contracts";
import { evaluateFairnessAndAccessibilityEvaluation } from "./policy";

export function assessRelease706(value: FairnessAndAccessibilityEvaluation) {
  const validationErrors = validateFairnessAndAccessibilityEvaluation(value);
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
    decision: evaluateFairnessAndAccessibilityEvaluation(value)
  };
}
