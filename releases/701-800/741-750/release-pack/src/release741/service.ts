import type { LearningProgrammeAndCurriculumRegistry } from "./contracts";
import { validateLearningProgrammeAndCurriculumRegistry } from "./contracts";
import { evaluateLearningProgrammeAndCurriculumRegistry } from "./policy";

export function assessRelease741(value: LearningProgrammeAndCurriculumRegistry) {
  const validationErrors = validateLearningProgrammeAndCurriculumRegistry(value);
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
    decision: evaluateLearningProgrammeAndCurriculumRegistry(value)
  };
}
