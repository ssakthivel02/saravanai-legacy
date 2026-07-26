import type { CriticalInfrastructureCrossSectorExercise } from "./contracts";
import { validateCriticalInfrastructureCrossSectorExercise } from "./contracts";
import { evaluateCriticalInfrastructureCrossSectorExercise } from "./policy";

export function assessRelease369(value: CriticalInfrastructureCrossSectorExercise) {
  const validationErrors = validateCriticalInfrastructureCrossSectorExercise(value);
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
    decision: evaluateCriticalInfrastructureCrossSectorExercise(value)
  };
}
