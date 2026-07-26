import type { LearningAndCareerServicesAssuranceGate } from "./contracts";
import { validateLearningAndCareerServicesAssuranceGate } from "./contracts";
import { evaluateLearningAndCareerServicesAssuranceGate } from "./policy";

export function assessRelease750(value: LearningAndCareerServicesAssuranceGate) {
  const validationErrors = validateLearningAndCareerServicesAssuranceGate(value);
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
    decision: evaluateLearningAndCareerServicesAssuranceGate(value)
  };
}
