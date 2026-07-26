import type { CyberCrisisExerciseAndLessons } from "./contracts";
import { validateCyberCrisisExerciseAndLessons } from "./contracts";
import { evaluateCyberCrisisExerciseAndLessons } from "./policy";

export function assessRelease538(value: CyberCrisisExerciseAndLessons) {
  const validationErrors = validateCyberCrisisExerciseAndLessons(value);
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
    decision: evaluateCyberCrisisExerciseAndLessons(value)
  };
}
