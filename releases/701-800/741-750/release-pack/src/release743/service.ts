import type { InteractiveLessonAndPracticeGenerator } from "./contracts";
import { validateInteractiveLessonAndPracticeGenerator } from "./contracts";
import { evaluateInteractiveLessonAndPracticeGenerator } from "./policy";

export function assessRelease743(value: InteractiveLessonAndPracticeGenerator) {
  const validationErrors = validateInteractiveLessonAndPracticeGenerator(value);
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
    decision: evaluateInteractiveLessonAndPracticeGenerator(value)
  };
}
