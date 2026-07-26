import type { InterviewSimulationAndFeedback } from "./contracts";
import { validateInterviewSimulationAndFeedback } from "./contracts";
import { evaluateInterviewSimulationAndFeedback } from "./policy";

export function assessRelease747(value: InterviewSimulationAndFeedback) {
  const validationErrors = validateInterviewSimulationAndFeedback(value);
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
    decision: evaluateInterviewSimulationAndFeedback(value)
  };
}
