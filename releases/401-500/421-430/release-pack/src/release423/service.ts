import type { DetectionEngineeringLifecycle } from "./contracts";
import { validateDetectionEngineeringLifecycle } from "./contracts";
import { evaluateDetectionEngineeringLifecycle } from "./policy";

export function assessRelease423(value: DetectionEngineeringLifecycle) {
  const validationErrors = validateDetectionEngineeringLifecycle(value);
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
    decision: evaluateDetectionEngineeringLifecycle(value)
  };
}
