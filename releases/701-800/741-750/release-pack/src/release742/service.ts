import type { PersonalLearningPathAndStudyPlan } from "./contracts";
import { validatePersonalLearningPathAndStudyPlan } from "./contracts";
import { evaluatePersonalLearningPathAndStudyPlan } from "./policy";

export function assessRelease742(value: PersonalLearningPathAndStudyPlan) {
  const validationErrors = validatePersonalLearningPathAndStudyPlan(value);
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
    decision: evaluatePersonalLearningPathAndStudyPlan(value)
  };
}
