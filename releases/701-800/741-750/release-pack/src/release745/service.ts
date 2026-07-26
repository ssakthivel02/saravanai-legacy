import type { LearningProgressAndMasteryEvidence } from "./contracts";
import { validateLearningProgressAndMasteryEvidence } from "./contracts";
import { evaluateLearningProgressAndMasteryEvidence } from "./policy";

export function assessRelease745(value: LearningProgressAndMasteryEvidence) {
  const validationErrors = validateLearningProgressAndMasteryEvidence(value);
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
    decision: evaluateLearningProgressAndMasteryEvidence(value)
  };
}
