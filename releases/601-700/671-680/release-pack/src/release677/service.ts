import type { ProcessMiningAndImprovementWithoutSurveillance } from "./contracts";
import { validateProcessMiningAndImprovementWithoutSurveillance } from "./contracts";
import { evaluateProcessMiningAndImprovementWithoutSurveillance } from "./policy";

export function assessRelease677(value: ProcessMiningAndImprovementWithoutSurveillance) {
  const validationErrors = validateProcessMiningAndImprovementWithoutSurveillance(value);
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
    decision: evaluateProcessMiningAndImprovementWithoutSurveillance(value)
  };
}
