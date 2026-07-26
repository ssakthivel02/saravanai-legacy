import type { TrainingAccessibilityAndMultilingualDelivery } from "./contracts";
import { validateTrainingAccessibilityAndMultilingualDelivery } from "./contracts";
import { evaluateTrainingAccessibilityAndMultilingualDelivery } from "./policy";

export function assessRelease749(value: TrainingAccessibilityAndMultilingualDelivery) {
  const validationErrors = validateTrainingAccessibilityAndMultilingualDelivery(value);
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
    decision: evaluateTrainingAccessibilityAndMultilingualDelivery(value)
  };
}
