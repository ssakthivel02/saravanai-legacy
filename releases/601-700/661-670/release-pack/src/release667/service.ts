import type { CapacityPerformanceAndSaturationEngineering } from "./contracts";
import { validateCapacityPerformanceAndSaturationEngineering } from "./contracts";
import { evaluateCapacityPerformanceAndSaturationEngineering } from "./policy";

export function assessRelease667(value: CapacityPerformanceAndSaturationEngineering) {
  const validationErrors = validateCapacityPerformanceAndSaturationEngineering(value);
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
    decision: evaluateCapacityPerformanceAndSaturationEngineering(value)
  };
}
