import type { AICostCapacityAndQueueController } from "./contracts";
import { validateAICostCapacityAndQueueController } from "./contracts";
import { evaluateAICostCapacityAndQueueController } from "./policy";

export function assessRelease818(value: AICostCapacityAndQueueController) {
  const validationErrors = validateAICostCapacityAndQueueController(value);
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
    decision: evaluateAICostCapacityAndQueueController(value)
  };
}
