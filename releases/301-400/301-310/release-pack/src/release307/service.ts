import type { CapacityAndCostSimulation } from "./contracts";
import { validateCapacityAndCostSimulation } from "./contracts";
import { evaluateCapacityAndCostSimulation } from "./policy";

export function assessRelease307(value: CapacityAndCostSimulation) {
  const validationErrors = validateCapacityAndCostSimulation(value);
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
    decision: evaluateCapacityAndCostSimulation(value)
  };
}
