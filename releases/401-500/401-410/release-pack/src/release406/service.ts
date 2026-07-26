import type { InferenceCapacityAndQueueManagement } from "./contracts";
import { validateInferenceCapacityAndQueueManagement } from "./contracts";
import { evaluateInferenceCapacityAndQueueManagement } from "./policy";

export function assessRelease406(value: InferenceCapacityAndQueueManagement) {
  const validationErrors = validateInferenceCapacityAndQueueManagement(value);
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
    decision: evaluateInferenceCapacityAndQueueManagement(value)
  };
}
